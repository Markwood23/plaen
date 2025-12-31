import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail, isEmailConfigured } from '@/lib/email/mailjet'

// POST /api/invoices/bulk-send - Mark multiple invoices as sent
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { invoice_ids, send_email = true } = body
    
    if (!invoice_ids || !Array.isArray(invoice_ids) || invoice_ids.length === 0) {
      return NextResponse.json({ error: 'No invoice IDs provided' }, { status: 400 })
    }
    
    // Fetch invoices with customer info
    const { data: invoicesData, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .in('id', invoice_ids)
      .in('status', ['draft']) // Only send draft invoices
    
    if (fetchError) {
      console.error('Error fetching invoices:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }
    
    if (!invoicesData || invoicesData.length === 0) {
      return NextResponse.json({ error: 'No draft invoices to send' }, { status: 400 })
    }

    // Get customers for these invoices
    const customerIds = [...new Set(
      invoicesData
        .map(inv => inv.customer_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    )]

    const { data: customersData } = customerIds.length
      ? await supabase
          .from('customers')
          .select('id, name, email, phone')
          .in('id', customerIds)
      : { data: [] as Array<{ id: string; name: string | null; email: string | null; phone: string | null }> }
    
    const customersMap = new Map((customersData || []).map(c => [c.id, c]))
    
    // Combine invoice with customer data
    const invoices = invoicesData.map(inv => ({
      ...inv,
      customer: inv.customer_id ? customersMap.get(inv.customer_id) : null
    }))
    
    // Get user info for sender details
    const { data: userProfile } = await supabase
      .from('users')
      .select('full_name, business_name, email')
      .eq('id', user.id)
      .single()
    
    // Update all invoices to sent status
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .in('id', invoices.map(inv => inv.id))
    
    if (updateError) {
      console.error('Error updating invoices:', updateError)
      return NextResponse.json({ error: 'Failed to update invoice status' }, { status: 500 })
    }
    
    // Send emails if configured and requested
    let emailsSent = 0
    if (send_email && isEmailConfigured()) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
      
      for (const invoice of invoices) {
        if (invoice.customer?.email) {
          try {
            await sendInvoiceEmail({
              customerEmail: invoice.customer.email,
              customerName: invoice.customer.name || 'Customer',
              invoiceNumber: invoice.invoice_number || '',
              amount: ((invoice.total || 0) / 100).toFixed(2),
              currency: invoice.currency || 'GHS',
              dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'Upon receipt',
              paymentLink: `${baseUrl}/pay/${invoice.id}`,
              businessName: userProfile?.business_name || userProfile?.full_name || 'Plaen User',
              senderName: userProfile?.full_name || undefined,
            })
            emailsSent++
          } catch (emailError) {
            console.error(`Failed to send email for invoice ${invoice.id}:`, emailError)
          }
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      updated: invoices.length,
      emails_sent: emailsSent,
      message: `Successfully sent ${invoices.length} invoice(s)${emailsSent > 0 ? ` and sent ${emailsSent} email(s)` : ''}`
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
