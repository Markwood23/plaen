import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  initializePayment,
  initiateMobileMoneyPayment,
  generateTxRef,
  isFlutterwaveConfigured,
  getSupportedPaymentMethods,
} from '@/lib/payments/flutterwave';

// Service client for public payment pages (no auth required)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, method, amount, phone_number, network } = body;

    // Validate required fields
    if (!invoice_id) {
      return NextResponse.json({ message: 'Invoice ID is required' }, { status: 400 });
    }
    if (!method) {
      return NextResponse.json({ message: 'Payment method is required' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ message: 'Valid amount is required' }, { status: 400 });
    }

    // Check if Flutterwave is configured
    if (!isFlutterwaveConfigured()) {
      console.warn('Flutterwave not configured, using mock response');
      return NextResponse.json({
        transaction_id: `TXN-${Date.now()}`,
        tx_ref: generateTxRef(invoice_id),
        status: 'pending',
        message: 'Payment initiated (test mode)',
      });
    }

    // Fetch invoice details to get customer info
    const supabase = getServiceClient();
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    // Generate unique transaction reference
    const tx_ref = generateTxRef(invoice_id);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Determine customer + business info
    const [{ data: customer }, { data: userProfile }] = await Promise.all([
      invoice.customer_id
        ? supabase.from('customers').select('*').eq('id', invoice.customer_id).single()
        : Promise.resolve({ data: null } as any),
      supabase.from('users').select('*').eq('id', invoice.user_id).single(),
    ]);

    const customerEmail = customer?.email || 'customer@plaen.co';
    const customerName = customer?.name || 'Customer';
    const customerPhone = phone_number || customer?.phone || '';
    const businessName = userProfile?.business_name || userProfile?.full_name || 'Plaen Invoice';

    // Handle mobile money payments specifically
    if (method === 'momo' && phone_number && network) {
      try {
        const momoResponse = await initiateMobileMoneyPayment({
          tx_ref,
          amount,
          currency: invoice.currency || 'GHS',
          phone_number: customerPhone,
          network: network.toUpperCase() as 'MTN' | 'VODAFONE' | 'TIGO' | 'AIRTEL',
          email: customerEmail,
          fullname: customerName,
          redirect_url: `${baseUrl}/pay/${invoice_id}/callback?tx_ref=${tx_ref}`,
          meta: {
            invoice_id,
            invoice_number: invoice.invoice_number,
          },
        });

        return NextResponse.json({
          transaction_id: tx_ref,
          tx_ref,
          status: 'pending',
          message: 'Mobile money payment initiated. Please approve on your phone.',
          requires_approval: true,
        });
      } catch (error) {
        console.error('Mobile money initiation failed:', error);
        return NextResponse.json(
          { message: error instanceof Error ? error.message : 'Mobile money payment failed' },
          { status: 500 }
        );
      }
    }

    // Standard Flutterwave checkout (card, bank, etc.)
    try {
      const paymentResponse = await initializePayment({
        tx_ref,
        amount,
        currency: invoice.currency || 'GHS',
        redirect_url: `${baseUrl}/pay/${invoice_id}/callback?tx_ref=${tx_ref}`,
        customer: {
          email: customerEmail,
          phone_number: customerPhone,
          name: customerName,
        },
        payment_options: getSupportedPaymentMethods(invoice.currency || 'GHS').join(','),
        meta: {
          invoice_id,
          invoice_number: invoice.invoice_number,
        },
        customizations: {
          title: businessName,
          description: `Payment for Invoice ${invoice.invoice_number}`,
          logo: 'https://plaen.co/logos/plaen-logo.svg',
        },
      });

      return NextResponse.json({
        transaction_id: tx_ref,
        tx_ref,
        status: 'requires_action',
        redirect_url: paymentResponse.data.link,
        message: 'Redirecting to payment page...',
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Failed to initiate payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { message: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
