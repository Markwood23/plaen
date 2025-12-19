"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import IconFrame from "@/components/ui/icon-frame";
import { 
  ArrowRight,
  ArrowDown,
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
  CalendarTick
} from "iconsax-react";
import Link from "next/link";
import ProfitRevenueChart from "@/components/dashboard/profit-revenue-chart";
import { useState } from "react";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";

export default function DashboardPage() {
  const [isARAgingExpanded, setIsARAgingExpanded] = useState(true);
  const { isBalanceHidden, maskAmount } = useBalanceVisibility();
  
  const kpis = [
    {
      label: "Incoming",
      value: "₵185,212.03",
      delta: "+10%",
      icon: Card,
      up: true,
      sparkline: "M2 20 Q10 8, 18 12 T34 8 Q42 14, 50 10 T62 6",
      iconColor: "#0D9488", // Green for incoming
      iconBg: "rgba(13, 148, 136, 0.08)",
    },
    {
      label: "Outgoing",
      value: "₵18,834.69",
      delta: "-18%",
      icon: Send2,
      up: false,
      sparkline: "M2 12 Q10 18, 18 14 T34 20 Q42 16, 50 22 T62 26",
      iconColor: "#14462a", // Purple for outgoing
      iconBg: "rgba(20, 70, 42, 0.08)",
    },
  ];

  const rows = [
    { id: "PL-A7K9X2", customer: "Frank Murlo", date: "Dec 1, 2021", reason: "312 S Wilmette Ave", status: "Paid", amount: "₵9,273.14" },
    { id: "PL-B3M4N8", customer: "Bill Norton", date: "Nov 02, 2021", reason: "5685 Bruce Ave, Portage", status: "Cancelled", amount: "₵5,220.31" },
    { id: "PL-C5P2Q7", customer: "Bill Norton", date: "Nov 02, 2021", reason: "5685 Bruce Ave, Portage", status: "Refunded", amount: "₵5,220.31" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Good morning, Paul</h1>
        <p className="text-sm" style={{ color: '#B0B3B8' }}>Here's your dashboard overview</p>
      </div>

      {/* Top row: KPIs and Quick Pay */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {kpis.map((kpi) => (
            <div key={kpi.label} className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: `${kpi.iconColor}0A` }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: kpi.iconBg }}
                >
                  <kpi.icon size={24} color={kpi.iconColor} variant="Bulk" />
                  </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={kpi.up ? { backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' } : { backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' }}
                    >
                      {kpi.delta}
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>{kpi.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{maskAmount(kpi.value)}</div>
                {/* sparkline */}
                <svg className="h-10 w-24 opacity-40" viewBox="0 0 64 32" fill="none">
                  <defs>
                    <linearGradient id={`gradient-${kpi.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={kpi.iconColor} stopOpacity={0.3} />
                      <stop offset="50%" stopColor={kpi.iconColor} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={kpi.iconColor} stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <path d={kpi.sparkline} stroke={`url(#gradient-${kpi.label})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>vs last month</p>
            </div>
          ))}
        </div>

        {/* Quick Pay - Facebook Blue */}
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
            <div className="flex items-center gap-3">
              {!isARAgingExpanded && (
                <div className="flex items-center gap-2 mr-2">
                  {/* Current - Green */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.06)' }}>
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                      <span className="text-base font-bold" style={{ color: '#14462a' }}>3</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#14462a' }}>Current</div>
                      <div className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{maskAmount("₵31.1k")}</div>
                    </div>
                  </div>
                  
                  {/* Attention - Yellow */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)' }}>
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                      <span className="text-base font-bold" style={{ color: '#D97706' }}>1</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#D97706' }}>Attention</div>
                      <div className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{maskAmount("₵9.5k")}</div>
                    </div>
                  </div>
                  
                  {/* Concerning - Orange */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(249, 115, 22, 0.06)' }}>
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}>
                      <span className="text-base font-bold" style={{ color: '#EA580C' }}>0</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#EA580C' }}>Overdue</div>
                      <div className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{maskAmount("₵0")}</div>
                    </div>
                  </div>
                  
                  {/* Critical - Red */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(220, 38, 38, 0.06)' }}>
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg" style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)' }}>
                      <span className="text-base font-bold" style={{ color: '#DC2626' }}>0</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#DC2626' }}>Critical</div>
                      <div className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{maskAmount("₵0")}</div>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsARAgingExpanded(!isARAgingExpanded)}
                aria-label={isARAgingExpanded ? "Collapse AR Aging card" : "Expand AR Aging card"}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all border-0 shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {isARAgingExpanded ? (
                  <ArrowUp2 size={16} color="#B0B3B8" />
                ) : (
                  <ArrowDown2 size={16} color="#B0B3B8" />
                )}
              </button>
            </div>
          </div>
          {isARAgingExpanded && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 0-30 Days - Current */}
                <div className="rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ backgroundColor: 'rgba(20, 70, 42, 0.02)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Current</div>
                    <div className="text-xs px-2 py-1 rounded-full" style={{ color: '#14462a', backgroundColor: 'rgba(20, 70, 42, 0.1)', fontWeight: 500 }}>0-30 days</div>
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#14462a' }}>3</div>
                  <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount("₵31,159.34")}</div>
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
                  <div className="text-3xl font-bold mb-2" style={{ color: '#F59E0B' }}>1</div>
                  <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount("₵9,565.02")}</div>
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
                  <div className="text-3xl font-bold mb-2" style={{ color: '#F97316' }}>0</div>
                  <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount("₵0.00")}</div>
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
                  <div className="text-3xl font-bold mb-2" style={{ color: '#DC2626' }}>0</div>
                  <div className="text-sm mb-3" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount("₵0.00")}</div>
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
        </div>
      </section>

      {/* Profit & Revenue */}
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
              <DropdownMenuContent align="end" className="rounded-2xl w-44 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium" style={{ color: '#B0B3B8' }}>Time Period</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Clock size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Daily</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Calendar1 size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Weekly</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Calendar size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Monthly</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <CalendarTick size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Yearly</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
            <ProfitRevenueChart />
        </div>
      </section>

      {/* Recent Invoices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Recent Invoices</h2>
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
                  <Calendar size={16} color="#14462a" variant="Bulk" />
                  <span>Monthly</span>
                  <ArrowDown2 size={14} color="#14462a" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-44 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium" style={{ color: '#B0B3B8' }}>Group by</DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Clock size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Daily</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Calendar1 size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Weekly</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <Calendar size={14} color="#14462a" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Monthly</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <Table>
              <TableHeader>
                <TableRow>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                    ID <ArrowSwapVertical size={14} color="#B0B3B8" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                    Date <ArrowSwapVertical size={14} color="#B0B3B8" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                    Contact <ArrowSwapVertical size={14} color="#B0B3B8" />
                  </button>
                </TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                    Amount <ArrowSwapVertical size={14} color="#B0B3B8" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                    Status <ArrowSwapVertical size={14} color="#B0B3B8" />
                  </button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                <TableRow 
                  key={`${row.id}-${idx}`}
                  className="cursor-pointer"
                  onClick={() => window.location.href = `/invoices/${row.id.replace('#', '')}`}
                >
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                  <TableCell className="text-[#65676B]">{row.reason}</TableCell>
                  <TableCell className="font-medium">{maskAmount(row.amount)}</TableCell>
                    <TableCell>
                      {row.status === "Paid" ? (
                        <Badge variant="paid">
                          <TickCircle size={14} color="#14462a" variant="Bold" /> Paid
                        </Badge>
                      ) : row.status === "Cancelled" ? (
                        <Badge variant="cancelled">
                          <CloseCircle size={14} color="#65676B" variant="Bold" /> Cancelled
                        </Badge>
                      ) : row.status === "Refunded" ? (
                        <Badge variant="refunded">
                          <RefreshCircle size={14} color="#BE123C" variant="Bold" /> Refunded
                        </Badge>
                      ) : null}
                    </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                          <More size={16} color="#B0B3B8" />
                          </button>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                        <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                          <Link href={`/invoices/${row.id.replace('#', '')}`} className="flex items-center">
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                              style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                            >
                              <Eye size={16} color="#14462a" />
                            </div>
                            <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>View</span>
                          </Link>
                          </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                          >
                            <Copy size={16} color="#14462a" />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Copy link</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                          >
                            <Trash size={16} color="#DC2626" />
                          </div>
                          <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>Delete</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </section>
    </div>
  );
}
