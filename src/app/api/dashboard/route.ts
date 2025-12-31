import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/dashboard - Get dashboard metrics
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get invoice counts by status
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, status, total, balance_due, due_date')
      .eq('user_id', user.id)
    
    // Calculate metrics
    const today = new Date().toISOString().split('T')[0]
    
    const totalInvoices = invoices?.length || 0
    const draftInvoices = invoices?.filter(i => i.status === 'draft').length || 0
    const sentInvoices = invoices?.filter(i => i.status === 'sent').length || 0
    const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0
    const overdueInvoices = invoices?.filter(i => 
      ['sent', 'viewed', 'partially_paid'].includes(i.status || '') && 
      i.due_date && i.due_date < today
    ).length || 0
    
    const totalRevenue = invoices?.reduce((sum, i) => sum + (Number(i.total) || 0), 0) || 0
    const totalOutstanding = invoices?.reduce((sum, i) => sum + (Number(i.balance_due) || 0), 0) || 0
    const paidAmount = invoices?.filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0) || 0
    
    // Get recent invoices
    const { data: recentInvoices } = await supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        total,
        balance_due,
        status,
        issue_date,
        due_date,
        currency,
        created_at,
        customer:customers(id, name, email)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Get recent payments
    const { data: recentPayments } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        payment_method,
        payment_date,
        payer_name,
        allocations:payment_allocations(
          invoice:invoices(invoice_number)
        )
      `)
      .eq('user_id', user.id)
      .order('payment_date', { ascending: false })
      .limit(5)
    
    // Get customer count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    
    // Calculate AR aging
    const arAging = {
      current: 0,
      days_1_30: 0,
      days_31_60: 0,
      days_61_90: 0,
      days_over_90: 0,
    }
    
    invoices?.forEach(inv => {
      if (!['sent', 'viewed', 'partially_paid'].includes(inv.status || '')) return
      if (!inv.due_date || !inv.balance_due) return
      
      const dueDate = new Date(inv.due_date)
      const todayDate = new Date()
      const daysDiff = Math.floor((todayDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const balance = Number(inv.balance_due)
      
      if (daysDiff <= 0) {
        arAging.current += balance
      } else if (daysDiff <= 30) {
        arAging.days_1_30 += balance
      } else if (daysDiff <= 60) {
        arAging.days_31_60 += balance
      } else if (daysDiff <= 90) {
        arAging.days_61_90 += balance
      } else {
        arAging.days_over_90 += balance
      }
    })
    
    return NextResponse.json({
      metrics: {
        total_invoices: totalInvoices,
        draft_invoices: draftInvoices,
        sent_invoices: sentInvoices,
        paid_invoices: paidInvoices,
        overdue_invoices: overdueInvoices,
        total_revenue: totalRevenue,
        total_outstanding: totalOutstanding,
        paid_amount: paidAmount,
        customer_count: customerCount || 0,
      },
      ar_aging: arAging,
      recent_invoices: recentInvoices || [],
      recent_payments: recentPayments || [],
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
