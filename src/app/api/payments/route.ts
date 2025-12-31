import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { PaymentInsert, PaymentAllocationInsert, PaymentMethod } from '@/types/database'

const VALID_METHODS: PaymentMethod[] = ['bank_transfer', 'mobile_money', 'card', 'crypto', 'cash', 'other']

// GET /api/payments - List payments
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
    const methodParam = searchParams.get('method')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build query
    let query = supabase
      .from('payments')
      .select(`
        *,
        allocations:payment_allocations(
          id,
          amount,
          invoice:invoices(id, invoice_number, total, customer:customers(id, name))
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
    
    // Apply filters
    if (methodParam && VALID_METHODS.includes(methodParam as PaymentMethod)) {
      query = query.eq('payment_method', methodParam as PaymentMethod)
    }
    
    if (from) {
      query = query.gte('payment_date', from)
    }
    
    if (to) {
      query = query.lte('payment_date', to)
    }
    
    // Apply sorting and pagination
    query = query.order('payment_date', { ascending: false })
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: payments, error, count } = await query
    
    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      payments,
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

// POST /api/payments - Record a payment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }
    
    if (!body.payment_method) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 })
    }
    
    // Prepare payment data
    const paymentData: PaymentInsert = {
      user_id: user.id,
      amount: body.amount,
      currency: body.currency || 'GHS',
      payment_method: body.payment_method,
      reference: body.reference || null,
      transaction_id: body.transaction_id || null,
      payer_name: body.payer_name || null,
      payer_email: body.payer_email || null,
      payer_phone: body.payer_phone || null,
      notes: body.notes || null,
      metadata: body.metadata || {},
      payment_date: body.payment_date || new Date().toISOString(),
    }
    
    // Insert payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()
    
    if (paymentError) {
      console.error('Error creating payment:', paymentError)
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }
    
    // If invoice_id is provided, create allocation
    if (body.invoice_id) {
      const allocationData: PaymentAllocationInsert = {
        payment_id: payment.id,
        invoice_id: body.invoice_id,
        amount: body.allocation_amount || body.amount,
      }
      
      const { error: allocError } = await supabase
        .from('payment_allocations')
        .insert(allocationData)
      
      if (allocError) {
        console.error('Error creating allocation:', allocError)
        // Payment was created but allocation failed
        return NextResponse.json({ 
          payment, 
          warning: 'Payment created but failed to allocate to invoice' 
        }, { status: 201 })
      }
    }
    
    // Fetch complete payment with allocations
    const { data: completePayment } = await supabase
      .from('payments')
      .select(`
        *,
        allocations:payment_allocations(
          id,
          amount,
          invoice:invoices(id, invoice_number, total)
        )
      `)
      .eq('id', payment.id)
      .single()
    
    return NextResponse.json({ payment: completePayment }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
