import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendPaymentReminderEmail, isEmailConfigured } from '@/lib/email/mailjet'
import { format, differenceInDays } from 'date-fns'

// POST /api/invoices/[id]/reminder - Send payment reminder email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json({ 
        error: 'Email service not configured',
        message: 'Please configure Mailjet API credentials to send reminder emails'
      }, { status: 503 })
    }
    
    // Get the invoice with customer data
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    // Check if invoice can receive reminders (must be sent and have balance)
    if (invoice.status === 'draft') {
      return NextResponse.json({ 
        error: 'Cannot send reminder for draft invoice',
        message: 'Send the invoice first before sending reminders'
      }, { status: 400 })
    }
    
    if (invoice.status === 'paid') {
      return NextResponse.json({ 
        error: 'Invoice is already paid',
        message: 'This invoice has been paid in full'
      }, { status: 400 })
    }
    
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
    
    if (!customer?.email) {
      return NextResponse.json({ 
        error: 'Customer has no email address',
        message: 'Please add an email address to the customer to send reminders'
      }, { status: 400 })
    }
    
    // Get user profile for business details
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // Calculate days overdue
    const dueDate = invoice.due_date ? new Date(invoice.due_date) : new Date()
    const today = new Date()
    const daysOverdue = Math.max(0, differenceInDays(today, dueDate))
    
    // Send the reminder email
    const emailResult = await sendPaymentReminderEmail({
      customerEmail: customer.email,
      customerName: customer.name || 'Customer',
      invoiceNumber: invoice.invoice_number,
      amount: formatAmount(invoice.balance_due || invoice.total || 0),
      currency: invoice.currency || 'GHS',
      dueDate: invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : 'On Receipt',
      daysOverdue: daysOverdue,
      paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.public_id}`,
      businessName: userProfile?.business_name || userProfile?.full_name || 'Your Business',
      businessEmail: user.email || undefined,
    })
    
    if (!emailResult.success) {
      return NextResponse.json({ 
        error: 'Failed to send reminder email',
        message: emailResult.error
      }, { status: 500 })
    }
    
    // Log the reminder sent (optional: could track in database)
    console.log(`Reminder sent for invoice ${invoice.invoice_number} to ${customer.email}`)
    
    return NextResponse.json({
      success: true,
      message: `Reminder sent to ${customer.email}`,
      invoice_number: invoice.invoice_number,
      days_overdue: daysOverdue,
    })
  } catch (error) {
    console.error('Error sending reminder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
