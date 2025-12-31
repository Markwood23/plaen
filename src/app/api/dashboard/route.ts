import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Helper to get date N months ago (using first day of month to avoid rollover issues)
function getMonthsAgo(months: number): { year: number; month: number } {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() - months
  
  // Handle negative months (previous year)
  while (month < 0) {
    month += 12
    year -= 1
  }
  
  return { year, month }
}

// Helper to get date string for start of a specific month
function getMonthStartDate(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-01`
}

// Helper to get date string for end of a specific month
function getMonthEndDate(year: number, month: number): string {
  // Get last day of month
  const lastDay = new Date(year, month + 1, 0).getDate()
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

// Helper to extract date portion from timestamp for comparison
function getPaymentDateString(paymentDate: string | null): string | null {
  if (!paymentDate) return null
  // Handle both date strings and timestamps
  return paymentDate.split(' ')[0].split('T')[0]
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
    const currentMonth = getMonthsAgo(0)
    const lastMonth = getMonthsAgo(1)
    
    const currentMonthStart = getMonthStartDate(currentMonth.year, currentMonth.month)
    const currentMonthEnd = getMonthEndDate(currentMonth.year, currentMonth.month)
    const lastMonthStart = getMonthStartDate(lastMonth.year, lastMonth.month)
    const lastMonthEnd = getMonthEndDate(lastMonth.year, lastMonth.month)
    
    // Current month revenue (from payments) - extract date portion for comparison
    const currentMonthRevenue = allPayments?.filter(p => {
      const payDate = getPaymentDateString(p.payment_date)
      return payDate && payDate >= currentMonthStart && payDate <= currentMonthEnd
    }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
    
    // Last month revenue (from payments)
    const lastMonthRevenue = allPayments?.filter(p => {
      const payDate = getPaymentDateString(p.payment_date)
      return payDate && payDate >= lastMonthStart && payDate <= lastMonthEnd
    }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
    
    // Calculate percentage change (null if no previous data to compare)
    let revenueChangePercent: number | null = null
    if (lastMonthRevenue > 0) {
      revenueChangePercent = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    } else if (currentMonthRevenue > 0) {
      revenueChangePercent = null // No previous data to compare
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
    
    let outstandingChangePercent: number | null = null
    if (lastMonthOutstanding > 0) {
      outstandingChangePercent = ((currentMonthOutstanding - lastMonthOutstanding) / lastMonthOutstanding) * 100
    } else if (currentMonthOutstanding > 0) {
      outstandingChangePercent = null // No previous data to compare
    }
    
    // Generate chart data for last 7 months
    const chartData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 6; i >= 0; i--) {
      const { year, month } = getMonthsAgo(i)
      const monthStart = getMonthStartDate(year, month)
      const monthEnd = getMonthEndDate(year, month)
      const monthName = monthNames[month]
      
      // Revenue for this month (total payments received) - extract date portion for comparison
      const monthRevenue = allPayments?.filter(p => {
        const payDate = getPaymentDateString(p.payment_date)
        return payDate && payDate >= monthStart && payDate <= monthEnd
      }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
      
      // Invoiced amount for this month
      const monthInvoiced = invoices?.filter(i => 
        i.issue_date && i.issue_date >= monthStart && i.issue_date <= monthEnd
      ).reduce((sum, i) => sum + (Number(i.total) || 0), 0) || 0
      
      chartData.push({
        month: monthName,
        year: year,
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
        revenue_change_percent: revenueChangePercent !== null ? Math.round(revenueChangePercent * 10) / 10 : null,
        outstanding_change_percent: outstandingChangePercent !== null ? Math.round(outstandingChangePercent * 10) / 10 : null,
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
