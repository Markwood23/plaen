import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/invoices/bulk-delete - Delete multiple invoices
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { invoice_ids } = body
    
    if (!invoice_ids || !Array.isArray(invoice_ids) || invoice_ids.length === 0) {
      return NextResponse.json({ error: 'No invoice IDs provided' }, { status: 400 })
    }
    
    // Verify all invoices belong to the user
    const { data: invoices, error: verifyError } = await supabase
      .from('invoices')
      .select('id, status')
      .eq('user_id', user.id)
      .in('id', invoice_ids)
    
    if (verifyError) {
      console.error('Error verifying invoices:', verifyError)
      return NextResponse.json({ error: 'Failed to verify invoices' }, { status: 500 })
    }
    
    // Check if any invoices are paid (can't delete paid invoices)
    const paidInvoices = invoices?.filter(inv => inv.status === 'paid') || []
    if (paidInvoices.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete ${paidInvoices.length} paid invoice(s). Please cancel them first.` 
      }, { status: 400 })
    }
    
    // Only delete invoices that belong to the user
    const validIds = invoices?.map(inv => inv.id) || []
    
    if (validIds.length === 0) {
      return NextResponse.json({ error: 'No valid invoices to delete' }, { status: 400 })
    }
    
    // Delete line items first (due to foreign key constraint)
    await supabase
      .from('invoice_line_items')
      .delete()
      .in('invoice_id', validIds)
    
    // Delete payment allocations
    await supabase
      .from('payment_allocations')
      .delete()
      .in('invoice_id', validIds)
    
    // Delete invoices
    const { error: deleteError } = await supabase
      .from('invoices')
      .delete()
      .in('id', validIds)
    
    if (deleteError) {
      console.error('Error deleting invoices:', deleteError)
      return NextResponse.json({ error: 'Failed to delete invoices' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      deleted: validIds.length,
      message: `Successfully deleted ${validIds.length} invoice(s)`
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
