import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  verifyPayment,
  getPaymentByTxRef,
  mapPaymentStatus,
  mapPaymentRail,
  isFlutterwaveConfigured,
} from '@/lib/payments/flutterwave';
import { computeReceiptVerificationHash } from '@/lib/receipts/verification';
import { sendPaymentConfirmationEmail, isEmailConfigured } from '@/lib/email/mailjet';
import { notifyPaymentReceived, notifyInvoicePaid } from '@/lib/notifications/create';
import type { PaymentInsert } from '@/types/database';

async function resolveInvoiceId(
  supabase: ReturnType<typeof getServiceClient>,
  invoiceIdOrPublicId: string
): Promise<string | null> {
  // Try UUID first
  const { data: byId } = await supabase
    .from('invoices')
    .select('id')
    .eq('id', invoiceIdOrPublicId)
    .maybeSingle();
  if (byId?.id) return byId.id;

  // Fallback to public_id
  const { data: byPublic } = await supabase
    .from('invoices')
    .select('id')
    .eq('public_id', invoiceIdOrPublicId)
    .maybeSingle();
  return byPublic?.id ?? null;
}

// Service client for public verification
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    const { tx_ref, transaction_id, invoice_id } = await request.json();

    console.info('[payments/verify] request', {
      has_tx_ref: !!tx_ref,
      has_transaction_id: !!transaction_id,
      invoice_id: invoice_id ? String(invoice_id) : null,
      flutterwave_configured: isFlutterwaveConfigured(),
    });

    if (!tx_ref && !transaction_id) {
      return NextResponse.json(
        { status: 'error', message: 'Transaction reference required' },
        { status: 400 }
      );
    }

    // If Flutterwave not configured, return mock success
    if (!isFlutterwaveConfigured()) {
      return NextResponse.json({
        status: 'success',
        message: 'Payment verified (test mode)',
        transaction_id: tx_ref || transaction_id,
        amount: 100,
        currency: 'GHS',
      });
    }

    // Verify with Flutterwave
    let verificationData;
    try {
      if (transaction_id) {
        const response = await verifyPayment(transaction_id);
        verificationData = response.data;
      } else {
        const response = await getPaymentByTxRef(tx_ref);
        verificationData = response.data;
      }
    } catch (verifyError) {
      console.error('Flutterwave verification failed:', verifyError);
      return NextResponse.json({
        status: 'pending',
        message: 'Payment verification in progress. Please check back later.',
      });
    }

    const paymentStatus = mapPaymentStatus(verificationData.status);

    console.info('[payments/verify] flutterwave_result', {
      mapped_status: paymentStatus,
      flw_status: verificationData.status,
      flw_ref: verificationData.flw_ref,
      tx_ref: verificationData.tx_ref,
    });

    if (paymentStatus === 'success') {
      // Check if we've already processed this payment
      const supabase = getServiceClient();
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('reference', verificationData.flw_ref)
        .single();

      // If not already processed, process it now
      if (!existingPayment && invoice_id) {
        const resolvedInvoiceId = await resolveInvoiceId(supabase, String(invoice_id));
        console.info('[payments/verify] resolve_invoice', {
          invoice_id: String(invoice_id),
          resolved_invoice_id: resolvedInvoiceId,
          existing_payment: false,
        });
        if (resolvedInvoiceId) {
          await processSuccessfulPayment(supabase, resolvedInvoiceId, verificationData);
        } else {
          console.error('Invoice not found for verification processing:', invoice_id);
        }
      } else if (existingPayment) {
        console.info('[payments/verify] already_processed', {
          payment_id: existingPayment.id,
          flw_ref: verificationData.flw_ref,
        });
      }

      return NextResponse.json({
        status: 'success',
        message: 'Payment successful',
        transaction_id: verificationData.tx_ref,
        flw_ref: verificationData.flw_ref,
        amount: verificationData.amount,
        currency: verificationData.currency,
        payment_type: verificationData.payment_type,
      });
    }

    if (paymentStatus === 'pending') {
      return NextResponse.json({
        status: 'pending',
        message: 'Payment is being processed',
        transaction_id: verificationData.tx_ref,
      });
    }

    return NextResponse.json({
      status: 'failed',
      message: verificationData.processor_response || 'Payment failed',
      transaction_id: verificationData.tx_ref,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Verification failed' },
      { status: 500 }
    );
  }
}

/**
 * Process a successful payment (if not already processed by webhook)
 */
async function processSuccessfulPayment(
  supabase: ReturnType<typeof getServiceClient>,
  invoiceId: string,
  paymentData: any
) {
  try {
    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice not found for payment processing:', invoiceId);
      return;
    }

    const [{ data: customer }, { data: userProfile }, { data: lineItems }] = await Promise.all([
      invoice.customer_id
        ? supabase.from('customers').select('*').eq('id', invoice.customer_id).single()
        : Promise.resolve({ data: null } as any),
      supabase.from('users').select('*').eq('id', invoice.user_id).single(),
      supabase.from('invoice_line_items').select('*').eq('invoice_id', invoiceId).order('sort_order'),
    ]);

    // Create payment record
    const amountMinor = Math.round(Number(paymentData.amount || 0) * 100);
    const paymentInsert: PaymentInsert = {
      user_id: invoice.user_id,
      amount: amountMinor,
      currency: paymentData.currency || invoice.currency || 'GHS',
      payment_method: mapPaymentRail(String(paymentData.payment_type || 'other')),
      reference: paymentData.flw_ref || null,
      transaction_id: paymentData.tx_ref || String(paymentData.id || ''),
      payment_date: paymentData.created_at ? new Date(paymentData.created_at).toISOString() : new Date().toISOString(),
      payer_name: paymentData.customer?.name || customer?.name || null,
      payer_email: paymentData.customer?.email || customer?.email || null,
      payer_phone: paymentData.customer?.phone_number || customer?.phone || null,
      notes: null,
      metadata: {
        provider: 'flutterwave',
        flw_ref: paymentData.flw_ref,
        tx_ref: paymentData.tx_ref,
        flutterwave_transaction_id: paymentData.id,
        payment_type: paymentData.payment_type,
        processor_response: paymentData.processor_response,
        raw: paymentData,
      },
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentInsert)
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Failed to create payment:', paymentError);
      return;
    }

    // Create payment allocation
    await supabase.from('payment_allocations').insert({
      payment_id: payment.id,
      invoice_id: invoiceId,
      amount: amountMinor,
    });

    // Refresh invoice for latest balance/status
    const { data: updatedInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    // Generate clean receipt number using database function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: receiptNumber } = await (supabase.rpc as any)('generate_receipt_number', { p_user_id: invoice.user_id });
    const finalReceiptNumber = receiptNumber || `REC-${Date.now().toString().slice(-6)}`;

    const baseSnapshotData = {
      provider: 'flutterwave',
      invoice_id: invoiceId,
      invoice_number: invoice.invoice_number,
      amount: amountMinor,
      currency: paymentData.currency || invoice.currency || 'GHS',
      reference: paymentData.flw_ref || paymentData.tx_ref || '',
      payer: {
        name: paymentData.customer?.name || customer?.name || null,
        email: paymentData.customer?.email || customer?.email || null,
        phone: paymentData.customer?.phone_number || customer?.phone || null,
      },
      created_at: new Date().toISOString(),
    };

    const { hash, tail } = computeReceiptVerificationHash(baseSnapshotData);

    await supabase.from('receipt_snapshots').insert({
      payment_id: payment.id,
      invoice_id: invoiceId,
      receipt_number: finalReceiptNumber,
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

    const businessName = userProfile?.business_name || userProfile?.full_name || 'Your Business';
    const remainingMinor = Number(updatedInvoice?.balance_due ?? invoice.balance_due ?? 0);
    const amountMajor = (amountMinor / 100).toFixed(2);
    const remainingMajor = (remainingMinor / 100).toFixed(2);

    // Send confirmation email
    if (isEmailConfigured() && customer?.email) {
      try {
        // Format line items for email
        const emailLineItems = lineItems && lineItems.length > 0 
          ? lineItems.map((item: { description: string; quantity: number; unit_price: number; amount: number }) => ({
              description: item.description,
              quantity: item.quantity || 1,
              unitPrice: (item.unit_price || 0) / 100,
              total: (item.amount || 0) / 100,
            }))
          : undefined;

        await sendPaymentConfirmationEmail({
          recipientEmail: customer.email,
          recipientName: customer.name || 'Customer',
          invoiceNumber: invoice.invoice_number,
          amountPaid: amountMajor,
          currency: paymentData.currency || invoice.currency || 'GHS',
          paymentMethod: String(paymentData.payment_type || 'Flutterwave'),
          paymentDate: new Date(paymentData.created_at).toLocaleString('en-US', {
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
          receiptNumber: finalReceiptNumber,
          reference: paymentData.flw_ref || paymentData.tx_ref || undefined,
          payerName: paymentData.customer?.name || customer?.name || undefined,
          lineItems: emailLineItems,
        });
      } catch (emailError) {
        console.error('Failed to send payment confirmation:', emailError);
      }
    }

    // Create in-app notifications
    const currency = paymentData.currency || invoice.currency || 'GHS';
    const amountFormatted = `${currency} ${amountMajor}`;

    // Notify about payment received
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

    console.log('Payment processed via verification:', payment.id);
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}
