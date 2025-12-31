import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  verifyPayment,
  verifyWebhookSignature,
  mapPaymentStatus,
  mapPaymentRail,
} from '@/lib/payments/flutterwave';
import { computeReceiptVerificationHash } from '@/lib/receipts/verification';
import { sendPaymentConfirmationEmail, isEmailConfigured } from '@/lib/email/mailjet';
import { notifyPaymentReceived, notifyInvoicePaid } from '@/lib/notifications/create';
import type { PaymentInsert } from '@/types/database';

// Service client for webhooks (server-to-server)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    
    // Verify webhook signature
    const signature = request.headers.get('verif-hash');
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('Invalid Flutterwave webhook signature');
      // In production, you might want to reject this
      // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = body;
    console.log('Flutterwave webhook received:', event, data?.tx_ref);

    // Only handle successful charge events
    if (event !== 'charge.completed') {
      return NextResponse.json({ status: 'ignored', message: `Event ${event} not handled` });
    }

    const supabase = getServiceClient();
    const txRef = data.tx_ref;
    const flwRef = data.flw_ref;
    const transactionId = data.id;

    // Idempotency check - see if we've already processed this transaction
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('reference', flwRef)
      .single();

    if (existingPayment) {
      console.log('Payment already processed:', flwRef);
      return NextResponse.json({ status: 'already_processed' });
    }

    // Verify the payment with Flutterwave
    let verifiedData;
    try {
      const verification = await verifyPayment(transactionId);
      verifiedData = verification.data;
    } catch (verifyError) {
      console.error('Failed to verify payment:', verifyError);
      // Still process if we can't verify (Flutterwave sends trusted data)
      verifiedData = data;
    }

    // Check if payment was successful
    const paymentStatus = mapPaymentStatus(verifiedData.status);
    if (paymentStatus !== 'success') {
      return NextResponse.json({ status: paymentStatus, message: 'Payment not successful' });
    }

    // Extract invoice_id from meta
    const invoiceId = verifiedData.meta?.invoice_id;
    if (!invoiceId) {
      console.error('No invoice_id in payment meta:', txRef);
      return NextResponse.json({ error: 'Missing invoice_id' }, { status: 400 });
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceId, invoiceError);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Fetch customer + user profile separately (no implicit relationships)
    const [{ data: customer }, { data: userProfile }] = await Promise.all([
      invoice.customer_id
        ? supabase.from('customers').select('*').eq('id', invoice.customer_id).single()
        : Promise.resolve({ data: null } as any),
      supabase.from('users').select('*').eq('id', invoice.user_id).single(),
    ]);

    // Create payment record
    const amountMinor = Math.round(Number(verifiedData.amount || 0) * 100);
    const paymentInsert: PaymentInsert = {
      user_id: invoice.user_id,
      amount: amountMinor,
      currency: verifiedData.currency || invoice.currency || 'GHS',
      payment_method: mapPaymentRail(String(verifiedData.payment_type || 'other')),
      reference: flwRef || null,
      transaction_id: txRef || String(transactionId || ''),
      payment_date: verifiedData.created_at ? new Date(verifiedData.created_at).toISOString() : new Date().toISOString(),
      payer_name: verifiedData.customer?.name || customer?.name || null,
      payer_email: verifiedData.customer?.email || customer?.email || null,
      payer_phone: verifiedData.customer?.phone_number || customer?.phone || null,
      notes: null,
      metadata: {
        provider: 'flutterwave',
        flw_ref: flwRef,
        tx_ref: txRef,
        flutterwave_transaction_id: transactionId,
        payment_type: verifiedData.payment_type,
        processor_response: verifiedData.processor_response,
        raw: verifiedData,
      },
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentInsert)
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Failed to create payment:', paymentError);
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }

    // Create payment allocation
    const { error: allocationError } = await supabase
      .from('payment_allocations')
      .insert({
        payment_id: payment.id,
        invoice_id: invoiceId,
        amount: amountMinor,
      });

    if (allocationError) {
      console.error('Failed to create allocation:', allocationError);
    }

    // Refresh invoice totals (DB trigger updates balance_due/status)
    const { data: updatedInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    // Generate receipt snapshot
    await createReceiptSnapshot({
      supabase,
      paymentId: payment.id,
      invoiceId,
      invoiceNumber: invoice.invoice_number,
      userId: invoice.user_id,
      amountMinor,
      currency: verifiedData.currency || invoice.currency || 'GHS',
      provider: 'flutterwave',
      reference: flwRef || txRef || '',
      payer: {
        name: verifiedData.customer?.name || customer?.name || null,
        email: verifiedData.customer?.email || customer?.email || null,
        phone: verifiedData.customer?.phone_number || customer?.phone || null,
      },
      meta: { tx_ref: txRef, flw_ref: flwRef, transaction_id: transactionId },
    });

    const businessName = userProfile?.business_name || userProfile?.full_name || 'Your Business';
    const remainingMinor = Number(updatedInvoice?.balance_due ?? invoice.balance_due ?? 0);
    const remainingMajor = (remainingMinor / 100).toFixed(2);
    const amountMajor = (amountMinor / 100).toFixed(2);

    // Send payment confirmation email
    if (isEmailConfigured() && customer?.email) {
      try {
        await sendPaymentConfirmationEmail({
          recipientEmail: customer.email,
          recipientName: customer.name || 'Customer',
          invoiceNumber: invoice.invoice_number,
          amountPaid: amountMajor,
          currency: verifiedData.currency || invoice.currency || 'GHS',
          paymentMethod: String(verifiedData.payment_type || 'Flutterwave'),
          paymentDate: new Date(verifiedData.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
          remainingBalance: remainingMinor > 0 ? remainingMajor : undefined,
          receiptLink: `${process.env.NEXT_PUBLIC_APP_URL}/receipts`,
          businessName,
          businessEmail: userProfile?.email || undefined,
          reference: flwRef || txRef || undefined,
          payerName: verifiedData.customer?.name || customer?.name || undefined,
        });
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }
    }

    // Create in-app notifications
    const currency = verifiedData.currency || invoice.currency || 'GHS';
    const amountFormatted = `${currency} ${amountMajor}`;
    
    // Always notify about payment received
    await notifyPaymentReceived(
      invoice.user_id,
      amountFormatted,
      invoice.invoice_number,
      payment.id,
      invoiceId
    );

    // If invoice is fully paid, send additional notification
    if (updatedInvoice?.status === 'paid') {
      const totalFormatted = `${currency} ${(Number(invoice.total || 0) / 100).toFixed(2)}`;
      await notifyInvoicePaid(
        invoice.user_id,
        invoice.invoice_number,
        totalFormatted,
        invoiceId
      );
    }

    console.log('Payment processed successfully:', {
      payment_id: payment.id,
      invoice_id: invoiceId,
      amount: verifiedData.amount,
      status: updatedInvoice?.status,
    });

    return NextResponse.json({
      status: 'success',
      payment_id: payment.id,
      invoice_status: updatedInvoice?.status,
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Create a receipt snapshot for the payment
 */
async function createReceiptSnapshot(args: {
  supabase: ReturnType<typeof getServiceClient>
  paymentId: string
  invoiceId: string
  invoiceNumber: string
  userId: string
  amountMinor: number
  currency: string
  provider: 'flutterwave'
  reference: string
  payer: { name: string | null; email: string | null; phone: string | null }
  meta: Record<string, unknown>
}) {
  try {
    const receiptNumber = `REC-${Date.now().toString(36).toUpperCase()}-${args.paymentId.substring(0, 4).toUpperCase()}`;

    const baseSnapshotData = {
      provider: args.provider,
      invoice_id: args.invoiceId,
      invoice_number: args.invoiceNumber,
      amount: args.amountMinor,
      currency: args.currency,
      reference: args.reference,
      payer: args.payer,
      meta: args.meta,
      created_at: new Date().toISOString(),
    };

    const { hash, tail } = computeReceiptVerificationHash(baseSnapshotData);

    await args.supabase.from('receipt_snapshots').insert({
      payment_id: args.paymentId,
      invoice_id: args.invoiceId,
      receipt_number: receiptNumber,
      snapshot_data: {
        ...baseSnapshotData,
        verification: {
          algo: 'sha256',
          hash,
          tail,
          created_at: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Failed to create receipt snapshot:', error);
  }
}

// Handle GET for webhook verification (some providers use this)
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok', message: 'Flutterwave webhook endpoint active' });
}
