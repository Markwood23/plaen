import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { InvoiceUpdate, InvoiceLineItemInsert } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/server'

const ATTACHMENTS_BUCKET = 'attachments'

// GET /api/invoices/[id] - Get single invoice
export async function GET(
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
    
    // Get invoice with related data
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(*),
        line_items:invoice_line_items(*),
        allocations:payment_allocations(
          id,
          amount,
          payment:payments(id, payment_method, payment_date, reference)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const { data: attachments, error: attachmentsError } = await supabase
      .from('attachments')
      .select('*')
      .eq('user_id', user.id)
      .eq('entity_type', 'invoice')
      .eq('entity_id', id)
      .order('created_at', { ascending: false })

    if (attachmentsError) {
      console.warn('Error fetching invoice attachments:', attachmentsError)
    }

    const admin = createAdminClient()
    const enrichedAttachments = await Promise.all(
      (attachments || []).map(async (att) => {
        const { data: signed, error: signedError } = await admin.storage
          .from(ATTACHMENTS_BUCKET)
          .createSignedUrl(att.file_url, 60 * 60)

        if (signedError) {
          console.warn('Failed to create attachment signed URL:', signedError)
        }

        return {
          ...att,
          download_url: signed?.signedUrl || null,
        }
      })
    )

    const invoiceWithAttachments = {
      ...invoice,
      attachments: enrichedAttachments,
    }
    
    return NextResponse.json({ invoice: invoiceWithAttachments })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/invoices/[id] - Update invoice
export async function PATCH(
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
    
    const body = await request.json()
    
    // Build update data
    const updateData: InvoiceUpdate = {}
    if (body.customer_id !== undefined) updateData.customer_id = body.customer_id
    if (body.issue_date !== undefined) updateData.issue_date = body.issue_date
    if (body.due_date !== undefined) updateData.due_date = body.due_date
    if (body.currency !== undefined) updateData.currency = body.currency
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.terms !== undefined) updateData.terms = body.terms
    if (body.footer !== undefined) updateData.footer = body.footer
    if (body.tax_rate !== undefined) updateData.tax_rate = body.tax_rate
    if (body.discount_type !== undefined) updateData.discount_type = body.discount_type
    if (body.discount_value !== undefined) updateData.discount_value = body.discount_value
    if (body.payment_instructions !== undefined) updateData.payment_instructions = body.payment_instructions
    
    // Update invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    // Handle line items update if provided (use admin client to bypass RLS)
    if (body.items) {
      const adminClient = createAdminClient()
      
      // Delete existing line items
      await adminClient
        .from('invoice_line_items')
        .delete()
        .eq('invoice_id', id)
      
      // Insert new line items
      const lineItems: InvoiceLineItemInsert[] = body.items.map((item: {
        description: string
        quantity?: number
        unit_price: number
      }, index: number) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        amount: (item.quantity || 1) * item.unit_price,
        sort_order: index,
      }))
      
      await adminClient
        .from('invoice_line_items')
        .insert(lineItems)
    }
    
    // Fetch complete invoice
    const { data: completeInvoice } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(*),
        line_items:invoice_line_items(*)
      `)
      .eq('id', id)
      .single()
    
    return NextResponse.json({ invoice: completeInvoice })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
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
    
    // Check if invoice can be deleted (not paid)
    const { data: invoice } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Cannot delete a paid invoice' }, { status: 400 })
    }
    
    // Delete invoice (line items will be deleted via cascade)
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error deleting invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
