import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { PaymentUpdate } from '@/types/database'

// GET /api/payments/[id] - Get single payment
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
    
    // Get payment with allocations
    const { data: payment, error } = await supabase
      .from('payments')
      .select(`
        *,
        allocations:payment_allocations(
          id,
          amount,
          invoice:invoices(
            id,
            invoice_number,
            total,
            status,
            customer:customers(id, name, email)
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/payments/[id] - Update payment
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
    const updateData: PaymentUpdate = {}
    if (body.amount !== undefined) updateData.amount = body.amount
    if (body.payment_method !== undefined) updateData.payment_method = body.payment_method
    if (body.reference !== undefined) updateData.reference = body.reference
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.payer_name !== undefined) updateData.payer_name = body.payer_name
    if (body.payer_email !== undefined) updateData.payer_email = body.payer_email
    if (body.payer_phone !== undefined) updateData.payer_phone = body.payer_phone
    
    // Update payment
    const { data: payment, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating payment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/payments/[id] - Delete payment
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
    
    // Delete payment (allocations will be deleted via cascade)
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error deleting payment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
