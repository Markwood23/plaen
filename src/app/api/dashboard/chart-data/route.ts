import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type TimeRange = '7d' | '30d' | '90d' | '12m'

interface ChartDataPoint {
  date: string
  label: string
  revenue: number
  invoiced: number
  payments: number
  invoiceCount: number
  paymentCount: number
}

// GET /api/dashboard/chart-data - Get revenue/payment chart data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const range = (searchParams.get('range') || '30d') as TimeRange
    const currency = searchParams.get('currency') || 'GHS'
    
    // Calculate date range
    const { startDate, groupBy, labelFormat } = getDateConfig(range)
    
    // Fetch invoices in range
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, total, issue_date, created_at, currency, status')
      .eq('user_id', user.id)
      .gte('issue_date', startDate.toISOString().split('T')[0])
      .in('status', ['sent', 'viewed', 'partially_paid', 'paid'])
    
    // Fetch payments in range
    const { data: payments } = await supabase
      .from('payments')
      .select('id, amount, payment_date, currency')
      .eq('user_id', user.id)
      .gte('payment_date', startDate.toISOString().split('T')[0])
    
    // Group data by date period
    const chartData = groupDataByPeriod(
      invoices || [],
      payments || [],
      startDate,
      groupBy,
      labelFormat,
      currency
    )
    
    // Calculate summary stats
    const totalInvoiced = chartData.reduce((sum, d) => sum + d.invoiced, 0)
    const totalPayments = chartData.reduce((sum, d) => sum + d.payments, 0)
    const totalInvoiceCount = chartData.reduce((sum, d) => sum + d.invoiceCount, 0)
    const totalPaymentCount = chartData.reduce((sum, d) => sum + d.paymentCount, 0)
    
    // Calculate trend (compare last half to first half)
    const midpoint = Math.floor(chartData.length / 2)
    const firstHalf = chartData.slice(0, midpoint).reduce((sum, d) => sum + d.payments, 0)
    const secondHalf = chartData.slice(midpoint).reduce((sum, d) => sum + d.payments, 0)
    const trend = firstHalf > 0 
      ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) 
      : 0
    
    return NextResponse.json({
      range,
      currency,
      data: chartData,
      summary: {
        total_invoiced: totalInvoiced,
        total_payments: totalPayments,
        invoice_count: totalInvoiceCount,
        payment_count: totalPaymentCount,
        collection_rate: totalInvoiced > 0 
          ? Math.round((totalPayments / totalInvoiced) * 100) 
          : 0,
        trend,
      },
    })
  } catch (error) {
    console.error('Chart data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDateConfig(range: TimeRange): {
  startDate: Date
  groupBy: 'day' | 'week' | 'month'
  labelFormat: 'short' | 'medium' | 'month'
} {
  const now = new Date()
  
  switch (range) {
    case '7d':
      return {
        startDate: new Date(now.setDate(now.getDate() - 7)),
        groupBy: 'day',
        labelFormat: 'short',
      }
    case '30d':
      return {
        startDate: new Date(now.setDate(now.getDate() - 30)),
        groupBy: 'day',
        labelFormat: 'short',
      }
    case '90d':
      return {
        startDate: new Date(now.setDate(now.getDate() - 90)),
        groupBy: 'week',
        labelFormat: 'medium',
      }
    case '12m':
      return {
        startDate: new Date(now.setMonth(now.getMonth() - 12)),
        groupBy: 'month',
        labelFormat: 'month',
      }
    default:
      return {
        startDate: new Date(now.setDate(now.getDate() - 30)),
        groupBy: 'day',
        labelFormat: 'short',
      }
  }
}

function groupDataByPeriod(
  invoices: { id: string; total: number | null; issue_date: string; currency: string | null }[],
  payments: { id: string; amount: number | null; payment_date: string | null; currency: string | null }[],
  startDate: Date,
  groupBy: 'day' | 'week' | 'month',
  labelFormat: 'short' | 'medium' | 'month',
  currency: string
): ChartDataPoint[] {
  const now = new Date()
  const dataMap = new Map<string, ChartDataPoint>()
  
  // Generate all periods
  const current = new Date(startDate)
  while (current <= now) {
    const key = getPeriodKey(current, groupBy)
    const label = formatLabel(current, labelFormat)
    
    if (!dataMap.has(key)) {
      dataMap.set(key, {
        date: key,
        label,
        revenue: 0,
        invoiced: 0,
        payments: 0,
        invoiceCount: 0,
        paymentCount: 0,
      })
    }
    
    // Advance to next period
    switch (groupBy) {
      case 'day':
        current.setDate(current.getDate() + 1)
        break
      case 'week':
        current.setDate(current.getDate() + 7)
        break
      case 'month':
        current.setMonth(current.getMonth() + 1)
        break
    }
  }
  
  // Sum invoices by period
  invoices
    .filter(inv => inv.total != null && (!currency || inv.currency === currency))
    .forEach(inv => {
      const date = new Date(inv.issue_date)
      const key = getPeriodKey(date, groupBy)
      const point = dataMap.get(key)
      if (point) {
        point.invoiced += Math.round(Number(inv.total))
        point.invoiceCount++
      }
    })
  
  // Sum payments by period
  payments
    .filter(pay => pay.amount != null && pay.payment_date != null && (!currency || pay.currency === currency))
    .forEach(pay => {
      const date = new Date(pay.payment_date!)
      const key = getPeriodKey(date, groupBy)
      const point = dataMap.get(key)
      if (point) {
        point.payments += Math.round(Number(pay.amount))
        point.revenue += Math.round(Number(pay.amount))
        point.paymentCount++
      }
    })
  
  // Return sorted array
  return Array.from(dataMap.values()).sort((a, b) => 
    a.date.localeCompare(b.date)
  )
}

function getPeriodKey(date: Date, groupBy: 'day' | 'week' | 'month'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  switch (groupBy) {
    case 'day':
      return `${year}-${month}-${day}`
    case 'week':
      // Get start of week (Monday)
      const weekStart = new Date(date)
      const dayOfWeek = date.getDay()
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      weekStart.setDate(date.getDate() + diff)
      return `${weekStart.getFullYear()}-W${getWeekNumber(weekStart)}`
    case 'month':
      return `${year}-${month}`
    default:
      return `${year}-${month}-${day}`
  }
}

function getWeekNumber(date: Date): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return String(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)).padStart(2, '0')
}

function formatLabel(date: Date, format: 'short' | 'medium' | 'month'): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  switch (format) {
    case 'short':
      return `${months[date.getMonth()]} ${date.getDate()}`
    case 'medium':
      return `${months[date.getMonth()]} ${date.getDate()}`
    case 'month':
      return months[date.getMonth()]
    default:
      return `${months[date.getMonth()]} ${date.getDate()}`
  }
}
