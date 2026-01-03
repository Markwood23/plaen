import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products - List products/services
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
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const isActive = searchParams.get('is_active')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Build query
    let query = supabase
      .from('products_services')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
    
    // Apply search filter - search in name, description, details, sku, category
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,details.ilike.%${search}%,sku.ilike.%${search}%,category.ilike.%${search}%`)
    }
    
    // Apply type filter
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    
    // Apply category filter
    if (category) {
      query = query.eq('category', category)
    }
    
    // Apply is_active filter
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true')
    }
    
    // Apply sorting and pagination
    query = query.order('name', { ascending: true })
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: products, error, count } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      products: products || [],
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

// POST /api/products - Create product/service
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
    if (!body.type || !['product', 'service'].includes(body.type)) {
      return NextResponse.json({ error: 'Type must be "product" or "service"' }, { status: 400 })
    }
    if (body.unit_price === undefined || body.unit_price < 0) {
      return NextResponse.json({ error: 'Valid unit price is required' }, { status: 400 })
    }
    
    // Prepare product data
    const productData = {
      user_id: user.id,
      name: body.name,
      description: body.description || null,
      details: body.details || null,
      type: body.type,
      unit_price: body.unit_price,
      currency: body.currency || 'GHS',
      default_tax: body.default_tax || 0,
      default_discount: body.default_discount || 0,
      discount_type: body.discount_type || 'percent',
      sku: body.sku || null,
      is_active: body.is_active !== false,
      category: body.category || null,
    }
    
    // Insert product
    const { data: product, error } = await supabase
      .from('products_services')
      .insert(productData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
