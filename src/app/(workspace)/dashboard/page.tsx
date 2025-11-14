import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import IconFrame from "@/components/ui/icon-frame";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Copy, ArrowUpDown, Check, X, RotateCcw } from "lucide-react";
import { CreditCardIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ProfitRevenueChart from "@/components/dashboard/profit-revenue-chart";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const kpis = [
    {
      label: "Incoming",
      value: "$16,935.80",
      delta: "+10%",
      icon: CreditCardIcon,
      up: true,
      sparkline: "M2 20 Q10 8, 18 12 T34 8 Q42 14, 50 10 T62 6",
    },
    {
      label: "Outgoing",
      value: "$1,721.65",
      delta: "-18%",
      icon: PaperAirplaneIcon,
      up: false,
      sparkline: "M2 12 Q10 18, 18 14 T34 20 Q42 16, 50 22 T62 26",
    },
  ];

  const rows = [
    { id: "#12594", customer: "Frank Murlo", date: "Dec 1, 2021", reason: "312 S Wilmette Ave", status: "Paid", amount: "$847.69" },
    { id: "#12306", customer: "Bill Norton", date: "Nov 02, 2021", reason: "5685 Bruce Ave, Portage", status: "Cancelled", amount: "$477.14" },
    { id: "#12306", customer: "Bill Norton", date: "Nov 02, 2021", reason: "5685 Bruce Ave, Portage", status: "Refunded", amount: "$477.14" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">Good morning, Paul</h1>
        <p className="text-sm text-[#949494]">Here's your dashboard overview</p>
      </div>

      {/* Top row: KPIs and Quick Pay */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 text-sm text-[#949494]">
                      <IconFrame icon={kpi.icon} size="sm" variant="subtle" />
                      <span className="font-medium">{kpi.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-semibold tracking-tight text-[#212121]">{kpi.value}</div>
                    {/* sparkline */}
                    <svg className="h-12 w-28" viewBox="0 0 64 32" fill="none">
                      <defs>
                        <linearGradient id={`gradient-${kpi.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#212121" stopOpacity={0.3} />
                          <stop offset="50%" stopColor="#212121" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#212121" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <path d={kpi.sparkline} stroke={`url(#gradient-${kpi.label})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <span
                      className={
                        kpi.up
                          ? "inline-flex items-center gap-1 rounded-full bg-[#212121] px-2.5 py-1 text-xs font-medium text-white"
                          : "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#949494]"
                      }
                    >
                      {kpi.delta}
                    </span>
                    <span className="text-xs text-[#949494] font-normal">vs last month</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] text-white border-[#212121]">
          <CardHeader className="px-5">
            <CardTitle className="text-base font-semibold">Quick Pay</CardTitle>
            <CardAction>
              <button
                aria-label="Open quick pay"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-2 text-sm text-white/80 font-normal">
              <span>plaen.tech/<span className="font-medium">username</span></span>
              <button
                aria-label="Copy link"
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/20 bg-white/5 hover:bg-white/10"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/70 font-normal">
              Share your payment link to receive quick payments from your saved contacts
            </div>
            <Link href="/coming-soon" className="mt-3 inline-flex items-center text-sm font-medium text-white underline underline-offset-4">
              Learn More
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Profit & Revenue */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#212121]">Profit & Revenue</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md border border-[#EBECE7] px-2.5 py-1.5 text-xs font-medium text-[#949494] hover:bg-gray-50">Weekly</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Daily</DropdownMenuItem>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
                <DropdownMenuItem>Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ProfitRevenueChart />
          </CardContent>
        </Card>
      </section>

      {/* Recent Invoices */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#212121]">Recent Invoices</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md border border-[#EBECE7] px-2.5 py-1.5 text-xs font-medium text-[#949494] hover:bg-gray-50">Monthly</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Group by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Daily</DropdownMenuItem>
                <DropdownMenuItem>Weekly</DropdownMenuItem>
                <DropdownMenuItem>Monthly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <Table className="[&_th]:py-4 [&_td]:py-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">No</TableHead>
                  <TableHead className="min-w-28">ID <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-[#949494]" /></TableHead>
                  <TableHead className="min-w-28">Date <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-[#949494]" /></TableHead>
                  <TableHead className="min-w-40">Contact <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-[#949494]" /></TableHead>
                  <TableHead className="min-w-56">Reason</TableHead>
                  <TableHead className="min-w-24">Amount <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-[#949494]" /></TableHead>
                  <TableHead className="min-w-28">Status <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-[#949494]" /></TableHead>
                  <TableHead className="w-10">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={`${row.id}-${idx}`}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell className="text-[#949494]">{row.reason}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      {row.status === "Paid" ? (
                        <Badge className="bg-[#212121] text-white border-[#212121]">
                          <Check className="h-3.5 w-3.5" /> Paid
                        </Badge>
                      ) : row.status === "Cancelled" ? (
                        <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
                          <X className="h-3.5 w-3.5" /> Cancelled
                        </Badge>
                      ) : row.status === "Refunded" ? (
                        <Badge className="bg-gray-400 text-white border-gray-400">
                          <RotateCcw className="h-3.5 w-3.5" /> Refunded
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-md p-1 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href="/coming-soon">View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Copy link</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
