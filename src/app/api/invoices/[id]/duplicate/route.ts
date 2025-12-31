import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/invoices/[id]/duplicate - Duplicate an invoice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the original invoice
    const { data: originalInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !originalInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    // Get line items separately
    const { data: lineItems, error: lineItemsError } = await supabase
      .from('invoice_line_items')
      .select('*')
      .eq('invoice_id', id)
      .order('sort_order', { ascending: true })
    
    if (lineItemsError) {
      console.error('Error fetching line items:', lineItemsError)
    }
    
    // Get current date for new invoice
    const today = new Date().toISOString().split('T')[0]
    
    // Calculate new due date (same duration as original, or default to 14 days)
    const originalIssue = new Date(originalInvoice.issue_date)
    let newDueDate = today
    if (originalInvoice.due_date) {
      const originalDue = new Date(originalInvoice.due_date)
      const duration = originalDue.getTime() - originalIssue.getTime()
      newDueDate = new Date(new Date(today).getTime() + duration).toISOString().split('T')[0]
    } else {
      // Default to 14 days from today
      newDueDate = new Date(new Date(today).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    // Generate new invoice number using the database function
    const { data: invoiceNumber, error: numError } = await supabase
      .rpc('generate_invoice_number', { p_user_id: user.id })
    
    if (numError) {
      console.error('Error generating invoice number:', numError)
      return NextResponse.json({ error: 'Failed to generate invoice number' }, { status: 500 })
    }
    
    // Create the new invoice (as draft)
    const { data: newInvoice, error: createError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: invoiceNumber || `INV-${Date.now()}`,
        customer_id: originalInvoice.customer_id,
        issue_date: today,
        due_date: newDueDate,
        currency: originalInvoice.currency,
        subtotal: originalInvoice.subtotal,
        tax_amount: originalInvoice.tax_amount,
        tax_rate: originalInvoice.tax_rate,
        discount_amount: originalInvoice.discount_amount,
        discount_type: originalInvoice.discount_type,
        discount_value: originalInvoice.discount_value,
        total: originalInvoice.total,
        balance_due: originalInvoice.total, // Full amount due on new invoice
        status: 'draft',
        notes: originalInvoice.notes,
        terms: originalInvoice.terms,
        footer: originalInvoice.footer,
        payment_instructions: originalInvoice.payment_instructions,
      })
      .select()
      .single()
    
    if (createError || !newInvoice) {
      console.error('Error creating duplicate invoice:', createError)
      return NextResponse.json({ error: createError?.message || 'Failed to create invoice' }, { status: 500 })
    }
    
    // Duplicate line items (use the separately fetched lineItems)
    if (lineItems && lineItems.length > 0) {
      const newLineItems = lineItems.map((item) => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
        sort_order: item.sort_order,
      }))
      
      const { error: itemsError } = await supabase
        .from('invoice_line_items')
        .insert(newLineItems)
      
      if (itemsError) {
        console.error('Error duplicating line items:', itemsError)
        // Invoice was created but items failed - clean up
        await supabase.from('invoices').delete().eq('id', newInvoice.id)
        return NextResponse.json({ error: 'Failed to duplicate line items' }, { status: 500 })
      }
    }
    
    // Fetch the complete new invoice
    const { data: completeInvoice, error: completeError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', newInvoice.id)
      .single()
    
    if (completeError) {
      return NextResponse.json({ error: completeError.message }, { status: 500 })
    }
    
    // Fetch line items for the new invoice
    const { data: newInvoiceLineItems } = await supabase
      .from('invoice_line_items')
      .select('*')
      .eq('invoice_id', newInvoice.id)
      .order('sort_order', { ascending: true })
    
    return NextResponse.json({
      success: true,
      invoice: {
        ...completeInvoice,
        line_items: newInvoiceLineItems || []
      },
      message: `Invoice duplicated successfully. New invoice: ${completeInvoice?.invoice_number}`
    })
  } catch (error) {
    console.error('Error duplicating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
