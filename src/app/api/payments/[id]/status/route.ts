import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { verifyPayment, getPaymentByTxRef } from '@/lib/payments/flutterwave';

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: transactionId } = await params;
  const supabase = getServiceClient();

  // Check if this is a tx_ref (Flutterwave reference) or a payment ID
  const isTxRef = transactionId.startsWith('plaen_');

  if (isTxRef) {
    // Check if payment already recorded in our DB
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*, payment_allocations(invoice_id)')
      .eq('reference', transactionId)
      .single();

    if (existingPayment) {
      // Payment already processed
      const invoiceId = existingPayment.payment_allocations?.[0]?.invoice_id;
      const { data: invoice } = invoiceId
        ? await supabase.from('invoices').select('invoice_number').eq('id', invoiceId).single()
        : { data: null };

      return NextResponse.json({
        transaction_id: transactionId,
        status: 'success',
        amount: (existingPayment.amount || 0) / 100,
        currency: existingPayment.currency || 'GHS',
        timestamp: existingPayment.payment_date || existingPayment.created_at,
        invoice_number: invoice?.invoice_number || null,
        reference: existingPayment.transaction_id || existingPayment.reference,
      });
    }

    // Not in DB yet - check Flutterwave
    try {
      const flwResult = await getPaymentByTxRef(transactionId);
      
      if (flwResult.status === 'success' && flwResult.data) {
        const tx = flwResult.data;
        const flwStatus = tx.status?.toLowerCase();

        if (flwStatus === 'successful') {
          return NextResponse.json({
            transaction_id: transactionId,
            status: 'success',
            amount: tx.amount,
            currency: tx.currency,
            timestamp: tx.created_at,
            invoice_number: tx.meta?.invoice_number || null,
            reference: tx.flw_ref || tx.tx_ref,
          });
        } else if (flwStatus === 'pending') {
          return NextResponse.json({
            transaction_id: transactionId,
            status: 'pending',
            message: 'Payment is being processed',
          });
        } else {
          return NextResponse.json({
            transaction_id: transactionId,
            status: 'failed',
            message: 'Payment failed or was cancelled',
          });
        }
      }
    } catch {
      // Flutterwave lookup failed, return pending
    }

    return NextResponse.json({
      transaction_id: transactionId,
      status: 'pending',
      message: 'Payment status unknown - please wait',
    });
  }

  // Standard payment ID lookup
  const { data: payment, error } = await supabase
    .from('payments')
    .select('*, payment_allocations(invoice_id)')
    .eq('id', transactionId)
    .single();

  if (error || !payment) {
    return NextResponse.json({ 
      transaction_id: transactionId,
      status: 'not_found',
      message: 'Payment not found' 
    }, { status: 404 });
  }

  const invoiceId = payment.payment_allocations?.[0]?.invoice_id;
  const { data: invoice } = invoiceId
    ? await supabase.from('invoices').select('invoice_number').eq('id', invoiceId).single()
    : { data: null };

  return NextResponse.json({
    transaction_id: transactionId,
    status: 'success',
    amount: (payment.amount || 0) / 100,
    currency: payment.currency || 'GHS',
    timestamp: payment.payment_date || payment.created_at,
    invoice_number: invoice?.invoice_number || null,
    reference: payment.transaction_id || payment.reference,
  });
}
