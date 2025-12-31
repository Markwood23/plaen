import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

// Helper to mask PII for public view
function maskEmail(email: string | null): string {
  if (!email) return '***@***.***';
  const [local, domain] = email.split('@');
  if (!domain) return '***@***.***';
  const maskedLocal = local.length > 2 ? local[0] + '***' + local.slice(-1) : '***';
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0].length > 2 
    ? domainParts[0][0] + '***' 
    : '***';
  return `${maskedLocal}@${maskedDomain}.${domainParts.slice(1).join('.')}`;
}

function maskPhone(phone: string | null): string {
  if (!phone) return '*** *** ****';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '*** *** ****';
  return '*** *** ' + digits.slice(-4);
}

function maskName(name: string | null): string {
  if (!name) return '***';
  const parts = name.split(' ');
  return parts.map(p => p.length > 1 ? p[0] + '***' : '***').join(' ');
}

// GET /api/receipts/public/[id] - Public receipt view with PII masking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Get receipt data
    const { data: receipt, error } = await supabase
      .from('receipt_snapshots')
      .select(`
        id,
        payment_id,
        invoice_id,
        receipt_number,
        snapshot_data,
        created_at
      `)
      .eq('id', id)
      .single();

    if (error || !receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select('id, amount, currency, payment_method, payment_date, payer_name, payer_email')
      .eq('id', receipt.payment_id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Get business owner details for "From" section
    const { data: ownerPayment } = await supabase
      .from('payments')
      .select('user_id')
      .eq('id', receipt.payment_id)
      .single();

    let business = null;
    if (ownerPayment?.user_id) {
      const { data: userData } = await supabase
        .from('users')
        .select('business_name, full_name, logo_url')
        .eq('id', ownerPayment.user_id)
        .single();
      if (userData) {
        business = {
          name: userData.business_name || userData.full_name || 'Business',
          logo_url: userData.logo_url,
        };
      }
    }

    // Get invoice details if linked (for items)
    let invoice = null;
    let items: Array<{ label: string; quantity: number; unit_price: number; total: number }> = [];
    if (receipt.invoice_id) {
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          issue_date,
          subtotal,
          discount_amount,
          tax_amount,
          total,
          currency,
          status
        `)
        .eq('id', receipt.invoice_id)
        .single();
      
      if (invoiceData) {
        invoice = {
          invoice_number: invoiceData.invoice_number,
          issue_date: invoiceData.issue_date,
          subtotal: (invoiceData.subtotal || 0) / 100,
          discount: (invoiceData.discount_amount || 0) / 100,
          tax: (invoiceData.tax_amount || 0) / 100,
          total: (invoiceData.total || 0) / 100,
          currency: invoiceData.currency,
          status: invoiceData.status,
        };

        // Get line items
        const { data: lineItems } = await supabase
          .from('invoice_line_items')
          .select('label, quantity, unit_price, total')
          .eq('invoice_id', invoiceData.id)
          .order('sort_order', { ascending: true });

        if (lineItems) {
          items = lineItems.map(item => ({
            label: item.label,
            quantity: item.quantity,
            unit_price: (item.unit_price || 0) / 100,
            total: (item.total || 0) / 100,
          }));
        }
      }
    }

    // Extract verification data from snapshot
    const snapshotData = receipt.snapshot_data as Record<string, unknown> || {};
    const verification = snapshotData.verification as Record<string, unknown> || {};

    // Build masked public receipt response
    const publicReceipt = {
      id: receipt.id,
      receipt_number: receipt.receipt_number,
      created_at: receipt.created_at,
      
      // Business info (not masked)
      business: business,
      
      // Payer info (masked)
      payer: {
        name: maskName(payment.payer_name),
        email: maskEmail(payment.payer_email),
      },
      
      // Payment info
      payment: {
        amount: payment.amount / 100,
        currency: payment.currency,
        method: payment.payment_method,
        date: payment.payment_date,
        reference_tail: snapshotData.reference_tail as string || '****',
      },
      
      // Invoice info (if linked)
      invoice: invoice,
      
      // Line items
      items: items,
      
      // Verification info
      verification: {
        hash_tail: (verification.tail as string) || (verification.hash as string)?.slice(-10) || null,
        algo: (verification.algo as string) || 'sha256',
        verified_at: new Date().toISOString(),
      },
    };

    return NextResponse.json({ receipt: publicReceipt });
  } catch (error) {
    console.error('Error in public receipt API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
