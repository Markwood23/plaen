"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  ArrowRight,
  More,
  Copy,
  ArrowSwapVertical,
  TickCircle,
  CloseCircle,
  RefreshCircle,
  Receipt21,
  Danger,
  Clock,
  ArrowDown2,
  ArrowUp2,
  Eye,
  Trash,
  Card,
  Send2,
  Calendar,
  Calendar1,
  CalendarTick,
  Chart,
  Add,
  People
} from "iconsax-react";
import Link from "next/link";
import ProfitRevenueChart from "@/components/dashboard/profit-revenue-chart";
import { useState } from "react";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";

// Loading skeleton components
function KPISkeleton() {
  return (
    <div className="group relative rounded-2xl p-6 animate-pulse" style={{ backgroundColor: 'rgba(176, 179, 184, 0.1)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-32 bg-gray-200 rounded" />
    </div>
  );
}

function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [isARAgingExpanded, setIsARAgingExpanded] = useState(true);
  const { isBalanceHidden, maskAmount } = useBalanceVisibility();
  const { data, loading, error, refetch } = useDashboardData();
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format compact currency (e.g., ₵31.1k)
  const formatCompactCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    const value = amount / 100;
    if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(1)}k`;
    return `${symbol}${value.toFixed(0)}`;
  };

  // Determine if user is new (no data)
  const isNewUser = data && 
    data.metrics.total_invoices === 0 && 
    data.recentInvoices.length === 0 && 
    data.recentPayments.length === 0;

  // KPIs with real data
  const kpis = data ? [
    {
      label: "Incoming",
      value: formatCurrency(data.metrics.total_revenue),
      delta: (data.metrics.revenue_change_percent ?? 0) > 0 
        ? `+${(data.metrics.revenue_change_percent ?? 0).toFixed(0)}%` 
        : `${(data.metrics.revenue_change_percent ?? 0).toFixed(0)}%`,
      icon: Card,
      up: (data.metrics.revenue_change_percent ?? 0) >= 0,
      sparkline: "M2 20 Q10 8, 18 12 T34 8 Q42 14, 50 10 T62 6",
      iconColor: "#0D9488",
      iconBg: "rgba(13, 148, 136, 0.08)",
    },
    {
      label: "Outstanding",
      value: formatCurrency(data.metrics.total_outstanding),
      delta: (data.metrics.outstanding_change_percent ?? 0) > 0 
        ? `+${(data.metrics.outstanding_change_percent ?? 0).toFixed(0)}%` 
        : `${(data.metrics.outstanding_change_percent ?? 0).toFixed(0)}%`,
      icon: Send2,
      up: (data.metrics.outstanding_change_percent ?? 0) <= 0,
      sparkline: "M2 12 Q10 18, 18 14 T34 20 Q42 16, 50 22 T62 26",
      iconColor: "#14462a",
      iconBg: "rgba(20, 70, 42, 0.08)",
    },
  ] : [];

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="paid">
            <TickCircle size={14} color="#14462a" variant="Bold" /> Paid
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="cancelled">
            <CloseCircle size={14} color="#65676B" variant="Bold" /> Cancelled
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <Clock size={14} color="#DC2626" variant="Bold" /> Overdue
          </Badge>
        );
      case "sent":
      case "viewed":
      case "partially_paid":
        return (
          <Badge variant="pending">
            <Clock size={14} color="#F59E0B" variant="Bold" /> {status.replace('_', ' ')}
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline">
            <Receipt21 size={14} color="#65676B" variant="Bold" /> Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Dashboard</h1>
        </div>
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Good morning</h1>
        <p className="text-sm" style={{ color: '#B0B3B8' }}>
          {isNewUser ? "Welcome to Plaen! Let's get you started." : "Here's your dashboard overview"}
        </p>
      </div>

      {/* New User Welcome Banner */}
      {isNewUser && (
        <section className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)', border: '1px solid rgba(20, 70, 42, 0.1)' }}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
              <Receipt21 size={24} color="#14462a" variant="Bulk" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1" style={{ color: '#2D2D2D' }}>Create your first invoice</h2>
              <p className="text-sm mb-4" style={{ color: '#65676B' }}>
                Start getting paid by creating your first invoice. Add your client details, line items, and send it in minutes.
              </p>
              <div className="flex items-center gap-3">
                <Button asChild>
                  <Link href="/invoices/new">
                    <Add size={18} className="mr-2" />
                    Create Invoice
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contacts/new">
                    <People size={18} className="mr-2" />
                    Add Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top row: KPIs and Quick Pay */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <>
              <KPISkeleton />
              <KPISkeleton />
            </>
          ) : (
            kpis.map((kpi) => (
              <div key={kpi.label} className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: `\${kpi.iconColor}0A` }}>
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: kpi.iconBg }}
                  >
                    <kpi.icon size={24} color={kpi.iconColor} variant="Bulk" />
                  </div>
                  {data && data.metrics.total_invoices > 0 && (
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={kpi.up ? { backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' } : { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' }}
                    >
                      {kpi.delta}
                    </div>
                  )}
                </div>
                <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                    {maskAmount(kpi.value)}
                  </div>
                  {data && data.metrics.total_invoices > 0 && (
                    <svg className="h-10 w-24 opacity-40" viewBox="0 0 64 32" fill="none">
                      <defs>
                        <linearGradient id={`gradient-\${kpi.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={kpi.iconColor} stopOpacity={0.3} />
                          <stop offset="50%" stopColor={kpi.iconColor} stopOpacity={0.7} />
                          <stop offset="100%" stopColor={kpi.iconColor} stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <path d={kpi.sparkline} stroke={`url(#gradient-\${kpi.label})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  )}
                </div>
                {data && data.metrics.total_invoices > 0 && (
                  <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>vs last month</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Pay */}
        <div className="text-white rounded-lg p-6" style={{ backgroundColor: '#14462a' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base" style={{ fontWeight: 600 }}>Quick Pay</h3>
            <button
              aria-label="Open quick pay"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <ArrowRight size={16} color="white" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <span>plaen.tech/<span style={{ fontWeight: 500 }}>username</span></span>
              <button
                aria-label="Copy link"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                <Copy size={14} color="white" />
              </button>
            </div>
            <div className="rounded-md p-4 text-sm" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.7)' }}>
              Share your payment link to receive quick payments from your saved contacts
            </div>
            <Link href="/help/payments" className="inline-flex items-center text-sm text-white underline underline-offset-4 hover:no-underline transition-all" style={{ fontWeight: 500 }}>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* AR Aging Buckets */}
      <section>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Accounts Receivable Aging</h2>
              <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Track how long unpaid invoices have been outstanding</p>
            </div>
            <button
              onClick={() => setIsARAgingExpanded(!isARAgingExpanded)}
              aria-label={isARAgingExpanded ? "Collapse AR Aging card" : "Expand AR Aging card"}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all border-0 shadow-sm hover:shadow-md"
              style={{ backgroundColor: 'white' }}
            >
              {isARAgingExpanded ? (
                <ArrowUp2 size={16} color="#B0B3B8" />
              ) : (
                <ArrowDown2 size={16} color="#B0B3B8" />
              )}
            </button>
          </div>
          {isARAgingExpanded && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg p-5 animate-pulse" style={{ backgroundColor: 'rgba(176, 179, 184, 0.05)' }}>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                      <div className="h-8 w-12 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : data && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* 0-30 Days - Current */}
                    <div className="rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'rgba(20, 70, 42, 0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Current</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ color: '#14462a', backgroundColor: 'rgba(20, 70, 42, 0.1)', fontWeight: 500 }}>0-30 days</div>
                      </div>
                      <div className="text-3xl font-bold mb-2" style={{ color: '#14462a' }}>{data.arAging.current.count}</div>
                      <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(formatCurrency(data.arAging.current.total))}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#B0B3B8' }}>
                        Recently issued invoices. Still within normal payment terms.
                      </div>
                    </div>

                    {/* 31-60 Days - Attention */}
                    <div className="rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'rgba(245, 158, 11, 0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Attention</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)', fontWeight: 500 }}>31-60 days</div>
                      </div>
                      <div className="text-3xl font-bold mb-2" style={{ color: '#F59E0B' }}>{data.arAging.attention.count}</div>
                      <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(formatCurrency(data.arAging.attention.total))}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#B0B3B8' }}>
                        Slightly overdue. Consider sending a friendly payment reminder.
                      </div>
                    </div>

                    {/* 61-90 Days - Concerning */}
                    <div className="rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'rgba(249, 115, 22, 0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Concerning</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ color: '#F97316', backgroundColor: 'rgba(249, 115, 22, 0.1)', fontWeight: 500 }}>61-90 days</div>
                      </div>
                      <div className="text-3xl font-bold mb-2" style={{ color: '#F97316' }}>{data.arAging.concerning.count}</div>
                      <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(formatCurrency(data.arAging.concerning.total))}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#B0B3B8' }}>
                        Significantly overdue. Follow up urgently with the customer.
                      </div>
                    </div>

                    {/* 90+ Days - Critical */}
                    <div className="rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'rgba(220, 38, 38, 0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Critical</div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ color: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.1)', fontWeight: 500 }}>90+ days</div>
                      </div>
                      <div className="text-3xl font-bold mb-2" style={{ color: '#DC2626' }}>{data.arAging.critical.count}</div>
                      <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(formatCurrency(data.arAging.critical.total))}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#B0B3B8' }}>
                        Severely overdue. May require debt collection or write-off.
                      </div>
                    </div>
                  </div>
                  
                  {/* Helpful explanation */}
                  <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.02)', border: '1px solid rgba(20, 70, 42, 0.2)' }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                          <Danger size={16} color="#14462a" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm mb-1" style={{ color: '#2D2D2D', fontWeight: 600 }}>What is AR Aging?</div>
                        <p className="text-sm leading-relaxed" style={{ color: '#B0B3B8' }}>
                          AR (Accounts Receivable) Aging shows how long invoices have been unpaid since their due date. 
                          It helps you identify slow-paying customers and take action before payments become uncollectable. 
                          The earlier you follow up, the more likely you are to get paid.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Profit & Revenue Chart */}
      <section>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Profit & Revenue</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all border hover:border-[#14462a]/30 focus:outline-none focus:ring-2 focus:ring-[#14462a]/20" 
                  style={{ 
                    color: '#14462a', 
                    fontWeight: 500, 
                    backgroundColor: 'rgba(20, 70, 42, 0.06)',
                    borderColor: 'rgba(20, 70, 42, 0.15)'
                  }}
                >
                  <Calendar1 size={16} color="#14462a" variant="Bulk" />
                  <span>Weekly</span>
                  <ArrowDown2 size={14} color="#14462a" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-44 p-2">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium" style={{ color: '#B0B3B8' }}>Time Period</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">Daily</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">Weekly</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">Monthly</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isNewUser ? (
            <EmptyState
              icon={Chart}
              iconColor="#14462a"
              title="No revenue data yet"
              description="Your revenue and profit charts will appear here once you start receiving payments."
              size="sm"
            />
          ) : (
            <ProfitRevenueChart />
          )}
        </div>
      </section>

      {/* Recent Invoices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Recent Invoices</h2>
          {data && data.recentInvoices.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/invoices">View all</Link>
            </Button>
          )}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          {loading ? (
            <TableSkeleton rows={3} />
          ) : data && data.recentInvoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    className="cursor-pointer"
                    onClick={() => window.location.href = `/invoices/\${invoice.id}`}
                  >
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{new Date(invoice.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                    <TableCell>{invoice.customer?.name || 'Unknown'}</TableCell>
                    <TableCell className="font-medium">{maskAmount(formatCurrency(invoice.total, invoice.currency))}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                            <More size={16} color="#B0B3B8" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                          <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer">
                            <Link href={`/invoices/\${invoice.id}`} className="flex items-center gap-2">
                              <Eye size={16} color="#14462a" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer">
                            <Copy size={16} color="#14462a" />
                            <span>Copy link</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer text-red-600">
                            <Trash size={16} color="#DC2626" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Receipt21}
              iconColor="#14462a"
              title="No invoices yet"
              description="Create your first invoice to start getting paid. It only takes a minute!"
              actionLabel="Create Invoice"
              actionHref="/invoices/new"
              size="md"
            />
          )}
        </div>
      </section>
    </div>
  );
}
