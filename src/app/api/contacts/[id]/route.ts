import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { CustomerUpdate } from '@/types/database'

// GET /api/contacts/[id] - Get single customer with stats
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
    
    // Get customer
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    // Get invoice stats for this customer
    const { data: invoiceStats } = await supabase
      .from('invoices')
      .select('id, total, status, balance_due')
      .eq('customer_id', id)
      .eq('user_id', user.id)
    
    type InvoiceStat = { id: string; total: number | null; status: string | null; balance_due: number | null }
    const invoiceData = (invoiceStats || []) as InvoiceStat[]
    
    const stats = {
      total_invoices: invoiceData.length,
      total_revenue: invoiceData.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0),
      outstanding_balance: invoiceData.reduce((sum, inv) => sum + (Number(inv.balance_due) || 0), 0),
      paid_invoices: invoiceData.filter(inv => inv.status === 'paid').length,
    }
    
    // Get recent invoices
    const { data: recentInvoices } = await supabase
      .from('invoices')
      .select('id, invoice_number, total, status, due_date, created_at')
      .eq('customer_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    return NextResponse.json({
      customer,
      stats,
      recent_invoices: recentInvoices || []
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/contacts/[id] - Update customer
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
    const updateData: CustomerUpdate = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.company !== undefined) updateData.company = body.company
    if (body.address !== undefined) updateData.address = body.address
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.tags !== undefined) updateData.tags = body.tags
    
    // Update customer
    const { data: customer, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating customer:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    
    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/contacts/[id] - Delete customer
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
    
    // Delete customer
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error deleting customer:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
