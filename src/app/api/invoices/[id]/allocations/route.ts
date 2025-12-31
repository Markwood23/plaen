import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { PaymentInsert, PaymentAllocationInsert } from '@/types/database'
import { sendPaymentConfirmationEmail, isEmailConfigured } from '@/lib/email/mailjet'
import { format } from 'date-fns'

// Format amount with commas
function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Format payment method for display
function formatPaymentMethod(method: string): string {
  const methodMap: Record<string, string> = {
    'mobile_money': 'Mobile Money',
    'bank_transfer': 'Bank Transfer',
    'card': 'Card Payment',
    'cash': 'Cash',
    'crypto': 'Cryptocurrency',
    'other': 'Other',
  }
  return methodMap[method] || method
}

// POST /api/invoices/[id]/allocations - Record a payment against an invoice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { 
      amount, 
      payment_method, 
      reference, 
      payment_date,
      payer_name,
      payer_phone,
      payer_email,
      notes,
    } = body
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }
    
    if (!payment_method) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 })
    }
    
    // Get invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()
    
    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    // Check if invoice can accept payments
    const invoiceStatus = invoice.status || 'draft'
    if (['paid', 'cancelled'].includes(invoiceStatus)) {
      return NextResponse.json({ 
        error: `Cannot record payment for ${invoiceStatus} invoice` 
      }, { status: 400 })
    }
    
    // Validate amount against balance
    const balanceDue = Number(invoice.balance_due) || 0
    
    if (amount > balanceDue) {
      return NextResponse.json({ 
        error: 'Payment amount exceeds balance due',
        balance_due: balanceDue
      }, { status: 400 })
    }
    
    // Create payment record
    const paymentData: PaymentInsert = {
      user_id: user.id,
      amount,
      currency: invoice.currency || 'GHS',
      payment_method,
      reference: reference || `PAY-${Date.now()}`,
      payment_date: payment_date || new Date().toISOString(),
      payer_name: payer_name || null,
      payer_phone: payer_phone || null,
      payer_email: payer_email || null,
      notes: notes || null,
    }
    
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()
    
    if (paymentError) {
      console.error('Error creating payment:', paymentError)
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }
    
    // Create payment allocation
    const allocationData: PaymentAllocationInsert = {
      payment_id: payment.id,
      invoice_id: invoiceId,
      amount,
    }
    
    const { data: allocation, error: allocationError } = await supabase
      .from('payment_allocations')
      .insert(allocationData)
      .select()
      .single()
    
    if (allocationError) {
      console.error('Error creating allocation:', allocationError)
      return NextResponse.json({ 
        payment,
        warning: 'Payment created but failed to allocate to invoice' 
      }, { status: 201 })
    }
    
    // Refresh invoice to get updated totals
    const { data: updatedInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()
    
    // Send payment confirmation emails if configured
    if (isEmailConfigured()) {
      // Get customer details
      let customer = null
      if (invoice.customer_id) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', invoice.customer_id)
          .single()
        customer = customerData
      }
      
      // Get user profile for business details
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      const businessName = userProfile?.business_name || userProfile?.full_name || 'Your Business'
      const paymentMethodDisplay = formatPaymentMethod(payment_method)
      const newBalance = updatedInvoice?.balance_due || 0
      
      // Send to business owner
      if (user.email) {
        await sendPaymentConfirmationEmail({
          recipientEmail: user.email,
          recipientName: userProfile?.full_name || 'Business Owner',
          invoiceNumber: invoice.invoice_number,
          amountPaid: formatAmount(amount),
          currency: invoice.currency || 'GHS',
          paymentMethod: paymentMethodDisplay,
          paymentDate: format(new Date(payment_date || new Date()), 'MMM d, yyyy'),
          remainingBalance: newBalance > 0 ? formatAmount(newBalance) : undefined,
          businessName,
        }).catch(err => console.error('Failed to send owner confirmation:', err))
      }
      
      // Send to customer if they have email
      if (customer?.email) {
        await sendPaymentConfirmationEmail({
          recipientEmail: customer.email,
          recipientName: customer.name || 'Customer',
          invoiceNumber: invoice.invoice_number,
          amountPaid: formatAmount(amount),
          currency: invoice.currency || 'GHS',
          paymentMethod: paymentMethodDisplay,
          paymentDate: format(new Date(payment_date || new Date()), 'MMM d, yyyy'),
          remainingBalance: newBalance > 0 ? formatAmount(newBalance) : undefined,
          businessName,
        }).catch(err => console.error('Failed to send customer confirmation:', err))
      }
    }
    
    return NextResponse.json({ 
      payment, 
      allocation,
      invoice: updatedInvoice,
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/invoices/[id]/allocations - Get allocations for an invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify invoice belongs to user
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()
    
    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    // Get allocations
    const { data: allocations, error } = await supabase
      .from('payment_allocations')
      .select(`
        id,
        amount,
        created_at,
        payment:payments(
          id,
          amount,
          payment_method,
          payment_date,
          reference,
          payer_name
        )
      `)
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching allocations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ allocations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
