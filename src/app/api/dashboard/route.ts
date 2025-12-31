import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Helper to get date N months ago
function getDateMonthsAgo(months: number): Date {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date
}

// Helper to get start of month
function getStartOfMonth(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
}

// Helper to get end of month
function getEndOfMonth(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
}

// GET /api/dashboard - Get dashboard metrics
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    // Get all invoices for the user
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, status, total, balance_due, due_date, issue_date, created_at')
      .eq('user_id', user.id)
    
    // Get all payments for the user with payment_date
    const { data: allPayments } = await supabase
      .from('payments')
      .select('id, amount, payment_date, currency')
      .eq('user_id', user.id)
      .order('payment_date', { ascending: true })
    
    // Calculate metrics
    const totalInvoices = invoices?.length || 0
    const draftInvoices = invoices?.filter(i => i.status === 'draft').length || 0
    const sentInvoices = invoices?.filter(i => i.status === 'sent').length || 0
    const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0
    const overdueInvoices = invoices?.filter(i => 
      ['sent', 'viewed', 'partially_paid'].includes(i.status || '') && 
      i.due_date && i.due_date < today
    ).length || 0
    
    const totalRevenue = allPayments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
    const totalOutstanding = invoices?.reduce((sum, i) => sum + (Number(i.balance_due) || 0), 0) || 0
    const paidAmount = invoices?.filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0) || 0
    
    // Calculate month-over-month percentage changes
    const currentMonthStart = getStartOfMonth(now)
    const currentMonthEnd = getEndOfMonth(now)
    const lastMonthStart = getStartOfMonth(getDateMonthsAgo(1))
    const lastMonthEnd = getEndOfMonth(getDateMonthsAgo(1))
    
    // Current month revenue (from payments)
    const currentMonthRevenue = allPayments?.filter(p => 
      p.payment_date && p.payment_date >= currentMonthStart && p.payment_date <= currentMonthEnd
    ).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
    
    // Last month revenue (from payments)
    const lastMonthRevenue = allPayments?.filter(p => 
      p.payment_date && p.payment_date >= lastMonthStart && p.payment_date <= lastMonthEnd
    ).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
    
    // Calculate percentage change
    let revenueChangePercent = 0
    if (lastMonthRevenue > 0) {
      revenueChangePercent = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    } else if (currentMonthRevenue > 0) {
      revenueChangePercent = 100 // New revenue this month when there was none last month
    }
    
    // Current month outstanding (invoices issued this month that are unpaid)
    const currentMonthOutstanding = invoices?.filter(i => 
      i.issue_date && i.issue_date >= currentMonthStart && i.issue_date <= currentMonthEnd &&
      ['sent', 'viewed', 'partially_paid'].includes(i.status || '')
    ).reduce((sum, i) => sum + (Number(i.balance_due) || 0), 0) || 0
    
    // Last month outstanding
    const lastMonthOutstanding = invoices?.filter(i => 
      i.issue_date && i.issue_date >= lastMonthStart && i.issue_date <= lastMonthEnd &&
      ['sent', 'viewed', 'partially_paid'].includes(i.status || '')
    ).reduce((sum, i) => sum + (Number(i.balance_due) || 0), 0) || 0
    
    let outstandingChangePercent = 0
    if (lastMonthOutstanding > 0) {
      outstandingChangePercent = ((currentMonthOutstanding - lastMonthOutstanding) / lastMonthOutstanding) * 100
    } else if (currentMonthOutstanding > 0) {
      outstandingChangePercent = 100
    }
    
    // Generate chart data for last 7 months
    const chartData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 6; i >= 0; i--) {
      const monthDate = getDateMonthsAgo(i)
      const monthStart = getStartOfMonth(monthDate)
      const monthEnd = getEndOfMonth(monthDate)
      const monthName = monthNames[monthDate.getMonth()]
      
      // Revenue for this month (total payments received)
      const monthRevenue = allPayments?.filter(p => 
        p.payment_date && p.payment_date >= monthStart && p.payment_date <= monthEnd
      ).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
      
      // Profit estimation: revenue minus estimated costs (we'll use 70% of revenue as profit margin)
      // In a real app, you'd track actual expenses. For now, use invoiced amount - payments as a proxy
      // Or simply show revenue vs invoiced amounts
      const monthInvoiced = invoices?.filter(i => 
        i.issue_date && i.issue_date >= monthStart && i.issue_date <= monthEnd
      ).reduce((sum, i) => sum + (Number(i.total) || 0), 0) || 0
      
      chartData.push({
        month: monthName,
        revenue: monthRevenue,
        invoiced: monthInvoiced,
      })
    }
    
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
    
    // Calculate AR aging with count and total for each bucket
    const arAging = {
      current: { count: 0, total: 0 },    // 0-30 days
      attention: { count: 0, total: 0 },   // 31-60 days
      concerning: { count: 0, total: 0 },  // 61-90 days
      critical: { count: 0, total: 0 },    // 90+ days
    }
    
    invoices?.forEach(inv => {
      if (!['sent', 'viewed', 'partially_paid'].includes(inv.status || '')) return
      if (!inv.due_date || !inv.balance_due) return
      
      const dueDate = new Date(inv.due_date)
      const todayDate = new Date()
      const daysDiff = Math.floor((todayDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const balance = Number(inv.balance_due)
      
      if (daysDiff <= 30) {
        arAging.current.count++
        arAging.current.total += balance
      } else if (daysDiff <= 60) {
        arAging.attention.count++
        arAging.attention.total += balance
      } else if (daysDiff <= 90) {
        arAging.concerning.count++
        arAging.concerning.total += balance
      } else {
        arAging.critical.count++
        arAging.critical.total += balance
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
        revenue_change_percent: Math.round(revenueChangePercent * 10) / 10,
        outstanding_change_percent: Math.round(outstandingChangePercent * 10) / 10,
      },
      ar_aging: arAging,
      chart_data: chartData,
      recent_invoices: recentInvoices || [],
      recent_payments: recentPayments || [],
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
