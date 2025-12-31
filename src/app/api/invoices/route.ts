import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { InvoiceInsert, InvoiceLineItemInsert, InvoiceStatus } from '@/types/database'

const VALID_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled']

// GET /api/invoices - List invoices
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const customerId = searchParams.get('customer_id')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const search = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    
    // Build query
    let query = supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name, email, company)
      `, { count: 'exact' })
      .eq('user_id', user.id)
    
    // Apply filters
    if (statusParam && statusParam !== 'all' && VALID_STATUSES.includes(statusParam as InvoiceStatus)) {
      query = query.eq('status', statusParam as InvoiceStatus)
    }
    
    if (customerId) {
      query = query.eq('customer_id', customerId)
    }
    
    if (from) {
      query = query.gte('issue_date', from)
    }
    
    if (to) {
      query = query.lte('issue_date', to)
    }
    
    if (search) {
      // Search in invoice number and notes directly, and customer name via sub-query
      // We'll search for matching customer IDs first, then include those in the OR
      const { data: matchingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .ilike('name', `%${search}%`)
      
      const customerIds = matchingCustomers?.map(c => c.id) || []
      
      if (customerIds.length > 0) {
        query = query.or(`invoice_number.ilike.%${search}%,notes.ilike.%${search}%,customer_id.in.(${customerIds.join(',')})`)
      } else {
        query = query.or(`invoice_number.ilike.%${search}%,notes.ilike.%${search}%`)
      }
    }
    
    // Apply sorting
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending })
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: invoices, error, count } = await query
    
    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/invoices - Create invoice
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Safety: ensure the public.users row exists (avoids FK violations on invoices.user_id)
    try {
      await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            email: user.email || '',
          },
          { onConflict: 'id' }
        )
    } catch (e) {
      console.warn('Failed to ensure user profile row:', e)
    }
    
    const body = await request.json()
    
    // Generate invoice number with retry logic for duplicates
    let invoiceNumber: string | null = null
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      const { data: generatedNumber, error: numError } = await supabase
        .rpc('generate_invoice_number', { p_user_id: user.id })
      
      if (numError) {
        console.error('Error generating invoice number:', numError)
        retryCount++
        continue
      }
      
      invoiceNumber = generatedNumber
      break
    }
    
    // Fallback to timestamp-based number if RPC fails
    if (!invoiceNumber) {
      invoiceNumber = `INV-${Date.now()}`
    }
    
    // Generate public ID if sending immediately
    const publicId = body.status === 'sent' ? await generatePublicId(supabase) : null
    
    // Prepare invoice data
    const invoiceData: InvoiceInsert = {
      user_id: user.id,
      customer_id: body.customer_id || null,
      invoice_number: invoiceNumber,
      issue_date: body.issue_date || new Date().toISOString().split('T')[0],
      due_date: body.due_date || null,
      currency: body.currency || 'GHS',
      status: body.status || 'draft',
      notes: body.notes || null,
      terms: body.terms || null,
      footer: body.footer || null,
      tax_rate: body.tax_rate || 0,
      discount_type: body.discount_type || null,
      discount_value: body.discount_value || 0,
      payment_instructions: body.payment_instructions || {},
      public_id: publicId,
      sent_at: body.status === 'sent' ? new Date().toISOString() : null,
    }
    
    // Insert invoice with retry for duplicate key errors
    let invoice = null
    let invoiceError = null
    retryCount = 0
    
    while (retryCount < maxRetries) {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single()
      
      if (error) {
        // Check if it's a duplicate key error (code 23505)
        if (error.code === '23505' && error.message.includes('invoice_number')) {
          console.warn(`Duplicate invoice number ${invoiceData.invoice_number}, retrying...`)
          retryCount++
          // Generate a new invoice number
          const { data: newNumber } = await supabase
            .rpc('generate_invoice_number', { p_user_id: user.id })
          invoiceData.invoice_number = newNumber || `INV-${Date.now()}-${retryCount}`
          continue
        }
        invoiceError = error
        break
      }
      
      invoice = data
      break
    }
    
    if (invoiceError || !invoice) {
      console.error('Error creating invoice:', invoiceError)
      return NextResponse.json({ error: invoiceError?.message || 'Failed to create invoice' }, { status: 500 })
    }
    
    // Insert line items if provided (use admin client to bypass RLS)
    if (body.items && body.items.length > 0) {
      const adminClient = createAdminClient()
      const lineItems: InvoiceLineItemInsert[] = body.items.map((item: {
        description: string
        quantity?: number
        unit_price: number
      }, index: number) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price,
        amount: (item.quantity || 1) * item.unit_price,
        sort_order: index,
      }))
      
      const { error: itemsError } = await adminClient
        .from('invoice_line_items')
        .insert(lineItems)
      
      if (itemsError) {
        console.error('Error creating line items:', itemsError)
        // Invoice was created but items failed - return partial success
        return NextResponse.json({ 
          invoice, 
          warning: 'Invoice created but failed to add line items' 
        }, { status: 201 })
      }
    }
    
    // Fetch the complete invoice with calculated totals
    const { data: completeInvoice } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name, email, company),
        line_items:invoice_line_items(*)
      `)
      .eq('id', invoice.id)
      .single()
    
    return NextResponse.json({ invoice: completeInvoice }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper to generate public ID using database function
async function generatePublicId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { data } = await supabase.rpc('generate_public_id')
  if (data) return data
  
  // Fallback to client-side generation
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
