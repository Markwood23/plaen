"use client";

import { Button } from "@/components/ui/button";
import { 
  Search01Icon,
  Loading03Icon,
  MoreHorizontalIcon,
  ArrowDataTransferVerticalIcon,
  CheckmarkSquare02Icon,
  Cancel01Icon,
  Clock01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Add01Icon,
  ViewIcon,
  Delete02Icon,
  Download01Icon,
  DollarSquareIcon,
  FileValidationIcon
} from "hugeicons-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const invoicesData = [
  { id: 1, invoiceId: "#12594", date: "Dec 1, 2021", contact: "Frank Murlo", reason: "312 S Wilmette Ave", amount: "$847.69", status: "Paid" },
  { id: 2, invoiceId: "#12306", date: "Nov 02, 2021", contact: "Bill Norton", reason: "5685 Bruce Ave, Portage", amount: "$477.14", status: "Cancelled" },
  { id: 3, invoiceId: "#12305", date: "Nov 02, 2021", contact: "Jane Smith", reason: "1234 Main Street", amount: "$1,250.00", status: "Refunded" },
  { id: 4, invoiceId: "#12304", date: "Oct 28, 2021", contact: "Acme Corp", reason: "789 Business Blvd", amount: "$3,200.00", status: "Paid" },
  { id: 5, invoiceId: "#12303", date: "Oct 25, 2021", contact: "Tech Solutions Ltd", reason: "456 Innovation Drive", amount: "$2,100.50", status: "Pending" },
  { id: 6, invoiceId: "#12302", date: "Oct 20, 2021", contact: "Global Industries", reason: "9012 Commerce Way", amount: "$4,750.25", status: "Paid" },
  { id: 7, invoiceId: "#12301", date: "Oct 18, 2021", contact: "Sarah Johnson", reason: "321 Park Avenue", amount: "$925.00", status: "Paid" },
  { id: 8, invoiceId: "#12300", date: "Oct 15, 2021", contact: "Michael Chen", reason: "567 Elm Street", amount: "$1,680.75", status: "Refunded" },
  { id: 9, invoiceId: "#12299", date: "Oct 12, 2021", contact: "Creative Agency Inc", reason: "890 Design Plaza", amount: "$5,500.00", status: "Pending" },
  { id: 10, invoiceId: "#12298", date: "Oct 08, 2021", contact: "Emma Williams", reason: "234 Oak Lane", amount: "$3,250.50", status: "Paid" },
  { id: 11, invoiceId: "#12297", date: "Oct 05, 2021", contact: "Robert Martinez", reason: "678 Maple Drive", amount: "$890.00", status: "Cancelled" },
  { id: 12, invoiceId: "#12296", date: "Oct 01, 2021", contact: "Digital Ventures LLC", reason: "123 Tech Boulevard", amount: "$6,800.00", status: "Paid" },
];

export default function InvoicesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(invoicesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoicesData.slice(startIndex, endIndex);

  // Handle select all
  const allSelected = currentInvoices.length > 0 && selectedRows.length === currentInvoices.length && currentInvoices.every(inv => selectedRows.includes(inv.id));
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentInvoices.map(inv => inv.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge style={{ backgroundColor: 'rgba(5, 150, 105, 0.08)', color: '#059669', borderColor: 'transparent' }}>
            <CheckmarkSquare02Icon size={14} /> Paid
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge style={{ backgroundColor: 'rgba(176, 179, 184, 0.08)', color: '#65676B', borderColor: 'transparent' }}>
            <Cancel01Icon size={14} /> Cancelled
          </Badge>
        );
      case "Refunded":
        return (
          <Badge style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)', color: '#14462a', borderColor: 'transparent' }}>
            <Loading03Icon size={14} /> Refunded
          </Badge>
        );
      case "Pending":
        return (
          <Badge style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#F59E0B', borderColor: 'transparent' }}>
            <Clock01Icon size={14} /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Invoices</h1>
          <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Create and manage all invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: 'white' }}
          >
            <Loading03Icon size={16} className="mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: '#14462a', color: 'white' }}
            asChild
          >
            <Link href="/invoices/new">
              <Add01Icon size={16} className="mr-2" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(220, 38, 38, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
            >
              <Clock01Icon size={24} style={{ color: '#DC2626', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' }}
            >
              3
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Overdue</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵16,935.80</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Needs attention</p>
        </div>

        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}
            >
              <FileValidationIcon size={24} style={{ color: '#F59E0B', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}
            >
              5
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Pending</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵8,750.50</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Awaiting payment</p>
        </div>

        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(5, 150, 105, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}
            >
              <CheckmarkSquare02Icon size={24} style={{ color: '#059669', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)', color: '#059669' }}
            >
              +12%
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Paid</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵45,320.00</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>This month</p>
        </div>

        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}
            >
              <DollarSquareIcon size={24} style={{ color: '#14462a', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)', color: '#14462a' }}
            >
              12
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Invoices</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵71,006.30</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>All time</p>
        </div>
      </div>

      {/* Payment Setup Banner */}
      <div className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)', border: '1px solid rgba(20, 70, 42, 0.1)' }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                <DollarSquareIcon size={20} style={{ color: '#14462a', strokeWidth: 2 }} />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#2D2D2D' }}>Get Paid 3x Faster with Mobile Money</h3>
                <p className="text-sm" style={{ color: '#65676B' }}>Accept MTN MoMo, Vodafone Cash, and AirtelTigo payments instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-[52px]">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden relative transition-transform hover:scale-110 hover:z-10">
                  <Image 
                    src="/logos/mtn-mobile-money.png" 
                    alt="MTN Mobile Money" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden relative transition-transform hover:scale-110 hover:z-10">
                  <Image 
                    src="/logos/vodafone-cash.png" 
                    alt="Vodafone Cash" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden relative transition-transform hover:scale-110 hover:z-10">
                  <Image 
                    src="/logos/tigo-cash.png" 
                    alt="AirtelTigo Cash" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div className="h-1 w-1 rounded-full" style={{ backgroundColor: '#059669' }}></div>
                <span className="text-xs font-medium" style={{ color: '#059669' }}>Active & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
              style={{ backgroundColor: 'white', color: '#2D2D2D' }}
            >
              Learn More
            </Button>
            <Button
              size="sm"
              className="rounded-xl shadow-sm transition-all hover:shadow-md hover:scale-105"
              style={{ backgroundColor: '#14462a', color: 'white' }}
            >
              Set as Default
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Invoices</h3>
            <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" style={{ color: '#14462a' }}>
            Clear all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Search
            </label>
            <div className="relative group">
              <Search01Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#B0B3B8' }} />
              <Input
                type="text"
                placeholder="Search invoices or contacts..."
                className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md focus:scale-[1.01]"
                style={{ backgroundColor: '#FAFBFC', color: '#2D2D2D' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Status
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC', color: '#2D2D2D' }}>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                <SelectItem value="all" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>All Statuses</span>
                  </div>
                </SelectItem>
                <SelectItem value="paid" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Pending</span>
                  </div>
                </SelectItem>
                <SelectItem value="overdue" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Overdue</span>
                  </div>
                </SelectItem>
                <SelectItem value="cancelled" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Cancelled</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Date Range
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start text-left rounded-xl border-0 shadow-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: '#FAFBFC', color: dateRange ? '#2D2D2D' : '#B0B3B8', fontWeight: 400 }}
                >
                  <Calendar03Icon className="mr-2" size={16} />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)', borderColor: 'rgba(20, 70, 42, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                <CheckmarkSquare02Icon size={16} style={{ color: '#14462a' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>
                  {selectedRows.length} {selectedRows.length === 1 ? 'invoice' : 'invoices'} selected
                </p>
                <p className="text-xs" style={{ color: '#65676B' }}>
                  Choose an action to apply
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105" 
                style={{ backgroundColor: 'white' }}
              >
                <Download01Icon size={16} className="mr-2" /> Export Selected
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl transition-all hover:bg-white"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected}
                  {...(someSelected && { 'data-state': 'indeterminate' })}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Invoice ID <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Date <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Contact <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Amount <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentInvoices.map((invoice) => (
              <TableRow 
                key={invoice.id}
                data-state={selectedRows.includes(invoice.id) ? "selected" : undefined}
                className="cursor-pointer"
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedRows.includes(invoice.id)}
                    onCheckedChange={() => toggleSelectRow(invoice.id)}
                    aria-label={`Select invoice ${invoice.invoiceId}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                <TableCell className="text-[#65676B]">{invoice.date}</TableCell>
                <TableCell>{invoice.contact}</TableCell>
                <TableCell className="text-[#65676B]">{invoice.reason}</TableCell>
                <TableCell className="font-medium">{invoice.amount}</TableCell>
                <TableCell>
                  {getStatusBadge(invoice.status)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(24,119,242,0.08)]">
                        <MoreHorizontalIcon size={16} style={{ color: '#B0B3B8' }} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]" asChild>
                        <Link href={`/invoices/${invoice.id}`}>
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                          >
                            <ViewIcon size={16} style={{ color: '#14462a' }} />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>View Invoice</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(5, 150, 105, 0.08)' }}
                        >
                          <Download01Icon size={16} style={{ color: '#059669' }} />
                        </div>
                        <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                        >
                          <Delete02Icon size={16} style={{ color: '#DC2626' }} />
                        </div>
                        <span className="text-sm font-medium transition-all" style={{ color: '#DC2626' }}>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: '#E4E6EB' }}>
          <p className="text-sm" style={{ color: '#65676B' }}>
            Showing <span className="font-semibold" style={{ color: '#2D2D2D' }}>{startIndex + 1}</span> to{" "}
            <span className="font-semibold" style={{ color: '#2D2D2D' }}>{Math.min(endIndex, invoicesData.length)}</span> of{" "}
            <span className="font-semibold" style={{ color: '#2D2D2D' }}>{invoicesData.length}</span> invoices
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 rounded-xl border-0 shadow-sm transition-all hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: 'white' }}
            >
              <ArrowLeft01Icon size={16} style={{ color: '#B0B3B8' }} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="h-9 w-9 p-0 rounded-xl border-0 shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: page === currentPage ? '#14462a' : 'white',
                  color: page === currentPage ? 'white' : '#2D2D2D'
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 rounded-xl border-0 shadow-sm transition-all hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: 'white' }}
            >
              <ArrowRight01Icon size={16} style={{ color: '#B0B3B8' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
