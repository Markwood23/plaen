import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail, isEmailConfigured } from '@/lib/email/mailjet'
import { format } from 'date-fns'

// POST /api/invoices/[id]/send - Send invoice and generate public link
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse request body for optional email flag and recipient override
    let sendEmailFlag = true
    let recipientEmailOverride: string | null = null
    try {
      const body = await request.json()
      sendEmailFlag = body.sendEmail !== false
      if (typeof body.email === 'string') {
        const trimmed = body.email.trim()
        recipientEmailOverride = trimmed.length > 0 ? trimmed : null
      }
    } catch {
      // No body or invalid JSON - default to sending email
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
    
    // Get line items for the email
    const { data: lineItems } = await supabase
      .from('invoice_line_items')
      .select('description, quantity, unit_price')
      .eq('invoice_id', id)
      .order('sort_order', { ascending: true })
    
    // Get user profile for business details
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // Ensure we have a public link.
    // Draft invoices: mark as sent + assign public_id.
    // Non-draft invoices: keep status, but allow re-sending email using existing public_id.
    let publicId: string = invoice.public_id || generatePublicId()
    let publicUrl = `${appUrl}/pay/${publicId}`
    let updatedInvoice = invoice

    if (invoice.status === 'draft') {
      const { data, error: updateError } = await supabase
        .from('invoices')
        .update({
          status: 'sent',
          public_id: publicId,
          sent_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      updatedInvoice = data
    } else if (!invoice.public_id) {
      // Invoice is already sent/paid/etc but missing a public_id: backfill one.
      const { data, error: backfillError } = await supabase
        .from('invoices')
        .update({ public_id: publicId })
        .eq('id', id)
        .select()
        .single()

      if (backfillError) {
        return NextResponse.json({ error: backfillError.message }, { status: 500 })
      }

      updatedInvoice = data
    }
    
    // Send email to customer if configured and customer has email
    let emailSent = false
    let emailError: string | null = null

    const recipientEmail = recipientEmailOverride || customer?.email || null

    if (sendEmailFlag && !recipientEmail) {
      emailError = 'No recipient email provided'
    } else if (sendEmailFlag && !isEmailConfigured()) {
      emailError = 'Mailjet is not configured'
    } else if (sendEmailFlag && recipientEmail) {
      // Format line items for email (convert from minor to major units)
      const emailItems = lineItems?.map(item => ({
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: (item.unit_price || 0) / 100,
      })) || []
      
      const emailResult = await sendInvoiceEmail({
        customerEmail: recipientEmail,
        customerName: customer?.name || 'Customer',
        invoiceNumber: invoice.invoice_number,
        amount: formatAmount(invoice.total || invoice.balance_due || 0),
        currency: invoice.currency || 'GHS',
        dueDate: invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : 'On Receipt',
        paymentLink: publicUrl,
        businessName: userProfile?.business_name || userProfile?.full_name || 'Your Business',
        senderName: userProfile?.full_name || undefined,
        businessEmail: user.email || undefined,
        issueDate: invoice.issue_date ? format(new Date(invoice.issue_date), 'MMM d, yyyy') : undefined,
        items: emailItems.length > 0 ? emailItems : undefined,
      })
      
      emailSent = emailResult.success
      if (!emailResult.success) {
        emailError = emailResult.error || 'Mailjet send failed'
        console.error('Failed to send invoice email:', emailError)
      }
    }
    
    return NextResponse.json({
      success: true,
      public_id: publicId,
      public_url: publicUrl,
      invoice: updatedInvoice,
      email_sent: emailSent,
      email_error: emailError,
    })
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generatePublicId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function formatAmount(amount: number): string {
  const major = amount / 100
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major)
}
