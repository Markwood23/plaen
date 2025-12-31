import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { CustomerInsert } from '@/types/database'
import { notifyNewCustomer } from '@/lib/notifications/create'

// GET /api/contacts - List customers
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
    const search = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build query
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
    
    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }
    
    // Apply sorting and pagination
    query = query.order('name', { ascending: true })
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: customers, error, count } = await query
    
    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      contacts: customers,
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

// POST /api/contacts - Create customer
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
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    // Prepare customer data
    const customerData: CustomerInsert = {
      user_id: user.id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      company: body.company || null,
      address: body.address || {},
      notes: body.notes || null,
      tags: body.tags || [],
    }
    
    // Insert customer
    const { data: customer, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create notification for new customer
    await notifyNewCustomer(user.id, customer.name, customer.id)
    
    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
