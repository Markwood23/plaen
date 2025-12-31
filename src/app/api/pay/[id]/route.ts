import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/pay/[id] - Get public invoice data for payment page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // First, try to find by public_id (8-char alphanumeric)
    let invoiceQuery = supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        issue_date,
        due_date,
        status,
        currency,
        subtotal,
        tax_amount,
        discount_amount,
        total,
        balance_due,
        notes,
        customers(name, email, company),
        users(full_name, email, phone, business_name, address)
      `)
    
    // Check if id looks like a public_id (8 chars alphanumeric) or a UUID
    const isPublicId = id.length === 8 && /^[a-zA-Z0-9]+$/.test(id)
    
    if (isPublicId) {
      invoiceQuery = invoiceQuery.eq('public_id', id)
    } else {
      // Assume it's a regular UUID
      invoiceQuery = invoiceQuery.eq('id', id)
    }
    
    // Only allow viewing of sent, partially_paid, or overdue invoices publicly
    invoiceQuery = invoiceQuery.in('status', ['sent', 'viewed', 'partially_paid', 'paid', 'overdue'])
    
    const { data: invoice, error } = await invoiceQuery.single()
    
    if (error || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found or not available for payment' }, 
        { status: 404 }
      )
    }
    
    // Fetch line items separately
    const { data: lineItems } = await supabase
      .from('invoice_line_items')
      .select('id, description, quantity, unit_price, amount')
      .eq('invoice_id', invoice.id)
      .order('sort_order', { ascending: true })
    
    // Get user info for "from" section
    const user = invoice.users as { full_name?: string; email?: string; phone?: string; business_name?: string; address?: unknown } | null
    const customer = invoice.customers as { name?: string; email?: string; company?: string } | null
    
    // Transform to public format (mask sensitive data)
    const publicInvoice = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      
      // Business info (from user/owner)
      from: {
        business_name: user?.business_name || user?.full_name || 'Business',
        email: maskEmail(user?.email || ''),
        phone: maskPhone(user?.phone || ''),
        address: user?.address,
      },
      
      // Customer info (masked)
      bill_to: {
        name: customer?.name || 'Customer',
        company: customer?.company,
        email: customer?.email ? maskEmail(customer.email) : undefined,
      },
      
      // Line items
      items: (lineItems || []).map((item: {
        id: string;
        description: string;
        quantity: number | null;
        unit_price: number;
        amount: number;
      }) => ({
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: Number(item.unit_price || 0) / 100,
        details: undefined,
      })),
      
      // Totals (convert from minor to major units)
      totals: {
        subtotal: Number(invoice.subtotal || 0) / 100,
        tax: Number(invoice.tax_amount || 0) / 100,
        discount: Number(invoice.discount_amount || 0) / 100,
        total: Number(invoice.total || 0) / 100,
        amount_paid: (Number(invoice.total || 0) - Number(invoice.balance_due || 0)) / 100,
        balance_due: Number(invoice.balance_due || 0) / 100,
      },
      
      // Available payment methods
      payment_methods: ['momo', 'bank', 'card'] as ('momo' | 'bank' | 'card')[],
      
      // Notes (if any)
      notes: invoice.notes,
    }
    
    return NextResponse.json(publicInvoice)
  } catch (error) {
    console.error('Public invoice fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mask email: jo***@example.com
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.com'
  const [local, domain] = email.split('@')
  const maskedLocal = local.length > 2 
    ? local.substring(0, 2) + '***' 
    : local[0] + '***'
  return `${maskedLocal}@${domain}`
}

// Mask phone: +233 ** *** **67
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '*** *** ****'
  return phone.substring(0, 4) + ' ** *** **' + phone.slice(-2)
}
