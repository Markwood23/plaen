import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/settings/export
 * 
 * GDPR-compliant data export endpoint.
 * Exports all user data in a structured JSON format.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Fetch all user's customers
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch all user's invoices with line items
    const { data: invoices } = await supabase
      .from('invoices')
      .select(`
        *,
        line_items:invoice_line_items(*),
        customer:customers(id, display_name, email)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch all user's payments with allocations
    const { data: payments } = await supabase
      .from('payments')
      .select(`
        *,
        allocations:payment_allocations(
          id,
          invoice_id,
          amount_minor,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch all user's receipt snapshots
    const { data: receipts } = await supabase
      .from('receipt_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch all user's notes
    const { data: notes } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch all user's attachments
    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Compile export data
    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        user_id: user.id,
        user_email: user.email,
        format_version: '1.0',
        description: 'Complete data export for GDPR compliance',
      },
      account: {
        auth: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        profile: profile || null,
      },
      customers: customers || [],
      invoices: invoices || [],
      payments: payments || [],
      receipts: receipts || [],
      notes: notes || [],
      attachments: (attachments || []).map(a => ({
        ...a,
        // Include download URLs if needed
        note: 'File content not included - download separately from signed URL',
      })),
      statistics: {
        total_customers: customers?.length || 0,
        total_invoices: invoices?.length || 0,
        total_payments: payments?.length || 0,
        total_receipts: receipts?.length || 0,
        total_notes: notes?.length || 0,
        total_attachments: attachments?.length || 0,
      },
    }

    // Create response with JSON file
    const jsonString = JSON.stringify(exportData, null, 2)
    const filename = `plaen-data-export-${user.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
