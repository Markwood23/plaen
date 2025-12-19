"use client";

import { Button } from "@/components/ui/button";
import { 
  RefreshCircle, 
  SearchNormal1, 
  Calendar as CalendarIcon, 
  DocumentDownload, 
  ArrowSwapVertical, 
  More, 
  TickCircle, 
  CloseCircle, 
  Coin1, 
  Card, 
  Mobile, 
  Building, 
  Bitcoin, 
  Receipt21, 
  ArrowLeft2, 
  ArrowRight2, 
  Clock, 
  Eye,
  InfoCircle
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";

// Payment allocations to invoices (invoice-first model per PRD)
const paymentAllocationsData = [
  { 
    id: 1, 
    paymentDate: "Dec 15, 2024", 
    invoiceId: "PL-A7K9X2", 
    invoiceDate: "Dec 1, 2024",
    contact: "Frank Murlo", 
    invoiceAmount: "₵9,275.05",
    amountAllocated: "₵9,275.05", 
    rail: "MTN MoMo", 
    reference: "MM-A7K9X2", 
    status: "Paid",
    daysToPayment: 14,
    isOnTime: false // >3 days
  },
  { 
    id: 2, 
    paymentDate: "Dec 14, 2024", 
    invoiceId: "PL-N4Q8R5", 
    invoiceDate: "Dec 12, 2024",
    contact: "Sarah Johnson", 
    invoiceAmount: "₵4,520.00",
    amountAllocated: "₵4,520.00", 
    rail: "Bank Transfer", 
    reference: "BNK-N4Q8R5", 
    status: "Paid",
    daysToPayment: 2,
    isOnTime: true // ≤3 days
  },
  { 
    id: 3, 
    paymentDate: "Dec 13, 2024", 
    invoiceId: "PL-S6T1U9", 
    invoiceDate: "Dec 11, 2024",
    contact: "Tech Solutions Ltd", 
    invoiceAmount: "₵15,750.32",
    amountAllocated: "₵15,750.32", 
    rail: "Vodafone Cash", 
    reference: "VC-S6T1U9", 
    status: "Paid",
    daysToPayment: 2,
    isOnTime: true
  },
  { 
    id: 4, 
    paymentDate: "Dec 11, 2024", 
    invoiceId: "PL-V2W7X3", 
    invoiceDate: "Dec 5, 2024",
    contact: "Acme Corp", 
    invoiceAmount: "₵35,014.72",
    amountAllocated: "₵20,000.00", 
    rail: "Bank Transfer", 
    reference: "BNK-V2W7X3-1", 
    status: "Partially Paid",
    daysToPayment: 6,
    isOnTime: false
  },
  { 
    id: 5, 
    paymentDate: "Dec 14, 2024", 
    invoiceId: "PL-V2W7X3", 
    invoiceDate: "Dec 5, 2024",
    contact: "Acme Corp", 
    invoiceAmount: "₵35,014.72",
    amountAllocated: "₵15,014.72", 
    rail: "Bank Transfer", 
    reference: "BNK-V2W7X3-2", 
    status: "Paid",
    daysToPayment: 9,
    isOnTime: false
  },
  { 
    id: 6, 
    paymentDate: "Dec 10, 2024", 
    invoiceId: "PL-Y8Z4A0", 
    invoiceDate: "Dec 9, 2024",
    contact: "Digital Ventures LLC", 
    invoiceAmount: "₵22,400.00",
    amountAllocated: "₵22,400.00", 
    rail: "MTN MoMo", 
    reference: "MM-Y8Z4A0", 
    status: "Paid",
    daysToPayment: 1,
    isOnTime: true
  },
  { 
    id: 7, 
    paymentDate: "Dec 08, 2024", 
    invoiceId: "PL-B5C1D6", 
    invoiceDate: "Dec 1, 2024",
    contact: "Global Industries", 
    invoiceAmount: "₵18,250.00",
    amountAllocated: "₵0.00", 
    rail: "AirtelTigo Money", 
    reference: "AT-B5C1D6", 
    status: "Failed",
    daysToPayment: null,
    isOnTime: false
  },
  { 
    id: 8, 
    paymentDate: "Dec 07, 2024", 
    invoiceId: "PL-E9F2G7", 
    invoiceDate: "Dec 6, 2024",
    contact: "Creative Agency Inc", 
    invoiceAmount: "₵12,975.83",
    amountAllocated: "₵12,975.83", 
    rail: "Bank Transfer", 
    reference: "BNK-E9F2G7", 
    status: "Paid",
    daysToPayment: 1,
    isOnTime: true
  },
  { 
    id: 9, 
    paymentDate: "Dec 05, 2024", 
    invoiceId: "PL-H3I8J4", 
    invoiceDate: "Dec 4, 2024",
    contact: "Emma Williams", 
    invoiceAmount: "₵8,640.25",
    amountAllocated: "₵8,640.25", 
    rail: "Crypto (USDC)", 
    reference: "0x4f3a...7b2c", 
    status: "Paid",
    daysToPayment: 1,
    isOnTime: true
  },
  { 
    id: 10, 
    paymentDate: "Dec 04, 2024", 
    invoiceId: "PL-K6L0M5", 
    invoiceDate: "Nov 28, 2024",
    contact: "Michael Chen", 
    invoiceAmount: "₵25,120.00",
    amountAllocated: "₵25,120.00", 
    rail: "MTN MoMo", 
    reference: "MM-K6L0M5", 
    status: "Paid",
    daysToPayment: 6,
    isOnTime: false
  },
  { 
    id: 11, 
    paymentDate: "Dec 02, 2024", 
    invoiceId: "PL-N1P7Q2", 
    invoiceDate: "Dec 2, 2024",
    contact: "Robert Martinez", 
    invoiceAmount: "₵5,890.00",
    amountAllocated: "₵5,890.00", 
    rail: "Cash", 
    reference: "CASH-N1P7Q2", 
    status: "Paid",
    daysToPayment: 0,
    isOnTime: true
  },
  { 
    id: 12, 
    paymentDate: "Nov 30, 2024", 
    invoiceId: "PL-R3S9T8", 
    invoiceDate: "Nov 25, 2024",
    contact: "Jane Doe Consulting", 
    invoiceAmount: "₵18,750.00",
    amountAllocated: "₵18,750.00", 
    rail: "Document-only", 
    reference: "DOC-R3S9T8", 
    status: "Paid",
    daysToPayment: 5,
    isOnTime: false
  },
];

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { maskAmount } = useBalanceVisibility();

  // Calculate pagination
  const totalPages = Math.ceil(paymentAllocationsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAllocations = paymentAllocationsData.slice(startIndex, endIndex);

  // Handle select all
  const allSelected = currentAllocations.length > 0 && selectedRows.length === currentAllocations.length && currentAllocations.every(alloc => selectedRows.includes(alloc.id));
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentAllocations.map(alloc => alloc.id));
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
          <Badge variant="paid">
            <TickCircle size={14} color="#14462a" variant="Bold" /> Paid
          </Badge>
        );
      case "Partially Paid":
        return (
          <Badge variant="partial">
            <Coin1 size={14} color="#0D9488" variant="Bold" /> Partial
          </Badge>
        );
      case "Failed":
        return (
          <Badge variant="failed">
            <CloseCircle size={14} color="#DC2626" variant="Bold" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRailIcon = (rail: string) => {
    let icon = '/icons/transfer-money.png';
    let bgColor = '#F9F9F9';
    let alt = 'Payment';
    
    if (rail.includes("MoMo") || rail.includes("Money") || rail.includes("Vodafone") || rail.includes("AirtelTigo")) {
      icon = '/icons/mobile.png';
      bgColor = '#FFF4E6'; // Soft orange
      alt = 'Mobile Money';
    } else if (rail.includes("Bank")) {
      icon = '/icons/bank.png';
      bgColor = '#E8F4FD'; // Soft blue
      alt = 'Bank Transfer';
    } else if (rail.includes("Card")) {
      icon = '/icons/credit-card.png';
      bgColor = '#F3E8FF'; // Soft purple
      alt = 'Card';
    } else if (rail.includes("Cash")) {
      icon = '/icons/transfer-money.png';
      bgColor = '#E8F9F1'; // Soft green
      alt = 'Cash';
    }
    
    return (
      <div 
        className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <Image 
          src={icon} 
          alt={alt}
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
    );
  };

  const getRailBgColor = (rail: string) => {
    if (rail.includes("MoMo") || rail.includes("Money") || rail.includes("Vodafone") || rail.includes("AirtelTigo")) {
      return '#FFF4E6'; // Soft orange
    } else if (rail.includes("Bank")) {
      return '#E8F4FD'; // Soft blue
    } else if (rail.includes("Card")) {
      return '#F3E8FF'; // Soft purple
    } else if (rail.includes("Cash")) {
      return '#E8F9F1'; // Soft green
    }
    return '#F9F9F9';
  };

  // Calculate stats (PRD metrics: On-time rate ≤3 days, DSO)
  const totalPaid = paymentAllocationsData
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + parseFloat(p.amountAllocated.replace("₵", "").replace(",", "")), 0);
  
  const partialPayments = paymentAllocationsData.filter(p => p.status === "Partially Paid").length;
  const failedPayments = paymentAllocationsData.filter(p => p.status === "Failed").length;
  
  // On-time rate: payments made ≤3 days from invoice date (per PRD)
  const paidAllocations = paymentAllocationsData.filter(p => p.status === "Paid" && p.daysToPayment !== null);
  const onTimePayments = paidAllocations.filter(p => p.isOnTime).length;
  const onTimeRate = paidAllocations.length > 0 ? Math.round((onTimePayments / paidAllocations.length) * 100) : 0;
  
  // DSO (Days Sales Outstanding) - simplified: average days to payment for paid invoices
  const avgDaysToPayment = paidAllocations.length > 0
    ? Math.round(paidAllocations.reduce((sum, p) => sum + (p.daysToPayment || 0), 0) / paidAllocations.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment Allocations</h1>
        <p className="text-sm" style={{ color: '#B0B3B8' }}>Track how payments are allocated to invoices and monitor collection performance</p>
      </div>

      {/* Stats Card - PRD Metrics: On-time rate, DSO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
              <Coin1 size={24} color="#0D9488" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#0D9488' }}>+12.5%</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Collected</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {maskAmount(`₵${totalPaid.toLocaleString()}`)}
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>From {paymentAllocationsData.filter(p => p.status === 'Paid' || p.status === 'Partially Paid').length} payments</p>
        </div>

        {/* On-time Rate (≤3 days per PRD) */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
              <Clock size={24} color="#14462a" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#14462a' }}>+8.2%</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>On-time Rate</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {onTimeRate}<span className="text-lg font-normal" style={{ color: '#B0B3B8' }}>%</span>
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Paid within 3 days</p>
        </div>

        {/* DSO (Days Sales Outstanding) */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
              <RefreshCircle size={24} color="#14462a" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#0D9488' }}>-2.1d</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Avg DSO</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {avgDaysToPayment}<span className="text-lg font-normal" style={{ color: '#B0B3B8' }}> days</span>
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Average collection time</p>
        </div>

        {/* Failed Allocations */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(220, 38, 38, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}>
              <CloseCircle size={24} color="#DC2626" />
            </div>
            {failedPayments > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}>
                <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>Action needed</span>
              </div>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Failed Payments</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {failedPayments}
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Requires attention</p>
        </div>
      </div>

      {/* Search and Filter Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Payments</h3>
            <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" style={{ color: '#14462a' }}>
            Clear all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Search</label>
            <div className="relative group">
              <SearchNormal1 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#B0B3B8' }} />
              <Input
                placeholder="Invoice, contact, reference..."
                className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md focus:scale-[1.01]"
                style={{ backgroundColor: '#FAFBFC' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Status</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                <SelectItem value="all" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>All Status</span>
                </SelectItem>
                <SelectItem value="paid" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#0D9488' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="partial" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#F59E0B' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Partially Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="failed" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#DC2626' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Failed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rail Filter */}
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Payment Rail</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="Select rail" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Rails</SelectItem>
                <SelectItem value="momo">
                  <div className="flex items-center gap-2">
                    <Mobile size={14} color="#14462a" />
                    Mobile Money
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center gap-2">
                    <Building size={14} color="#14462a" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <Card size={14} color="#14462a" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="crypto">
                  <div className="flex items-center gap-2">
                    <Bitcoin size={14} color="#14462a" />
                    Crypto
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Coin1 size={14} color="#14462a" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center gap-2">
                    <Receipt21 size={14} color="#14462a" />
                    Document-only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl justify-start text-left font-normal border-0 shadow-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: '#FAFBFC', color: dateRange?.from ? '#2D2D2D' : '#B0B3B8' }}
                >
                  <CalendarIcon className="mr-2" size={16} />
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Payment Allocations Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)', borderColor: 'rgba(20, 70, 42, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                <TickCircle size={16} color="#14462a" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>
                  {selectedRows.length} {selectedRows.length === 1 ? 'payment' : 'payments'} selected
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
                <DocumentDownload size={16} color="currentColor" className="mr-2" /> Export Selected
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
            <TableRow style={{ borderColor: '#E4E6EB' }}>
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
                  Payment Date <ArrowSwapVertical size={14} />
                </button>
              </TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Invoice Amount</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Payment Rail</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Days to Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAllocations.map((allocation) => (
              <TableRow
                key={allocation.id}
                data-state={selectedRows.includes(allocation.id) ? "selected" : undefined}
                style={{ borderColor: '#E4E6EB', cursor: 'pointer' }}
                onClick={() => window.location.href = `/payments/${allocation.id}`}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.includes(allocation.id)}
                    onCheckedChange={() => toggleSelectRow(allocation.id)}
                    aria-label={`Select allocation ${allocation.reference}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {allocation.paymentDate}
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/invoices/${allocation.id}`} 
                    className="font-medium hover:underline transition-colors"
                    style={{ color: '#14462a' }}
                  >
                    {allocation.invoiceId}
                  </Link>
                  <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>{allocation.invoiceDate}</p>
                </TableCell>
                <TableCell>{allocation.contact}</TableCell>
                <TableCell className="font-medium text-[#65676B]">
                  {maskAmount(allocation.invoiceAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {maskAmount(allocation.amountAllocated)}
                    </span>
                    {allocation.status === "Partially Paid" && (
                      <span className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>
                        of {maskAmount(allocation.invoiceAmount)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    {getRailIcon(allocation.rail)}
                    <span className="text-sm">{allocation.rail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: getRailBgColor(allocation.rail), color: '#2D2D2D' }}>
                    {allocation.reference}
                  </code>
                </TableCell>
                <TableCell>
                  {allocation.daysToPayment !== null ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{allocation.daysToPayment}d</span>
                      {allocation.isOnTime && (
                        <Badge variant="partial">
                          ✓
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#B0B3B8' }}>—</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(allocation.status)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[rgba(20,70,42,0.06)] transition-colors">

                        <More size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                        >
                          <Receipt21 size={16} color="#14462a" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                          View Invoice
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
                        >
                          <Eye size={16} color="#0D9488" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                          View Receipt
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                        >
                          <DocumentDownload size={16} color="#14462a" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                          Download Receipt PDF
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      {allocation.status === "Failed" && (
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }}
                          >
                            <RefreshCircle size={16} color="#F59E0B" />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                            Retry Payment
                          </span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                        >
                          <InfoCircle size={16} color="#DC2626" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>Report Issue</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #E4E6EB' }}>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>
            Showing {startIndex + 1} to {Math.min(endIndex, paymentAllocationsData.length)} of {paymentAllocationsData.length} payment allocations
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{ borderColor: '#E4E6EB' }}
            >
              <ArrowLeft2 size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0 rounded-full"
                onClick={() => setCurrentPage(page)}
                style={
                  currentPage === page
                    ? { backgroundColor: '#14462a', color: 'white', borderColor: '#14462a' }
                    : { borderColor: '#E4E6EB', color: '#2D2D2D' }
                }
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                    e.currentTarget.style.borderColor = '#14462a';
                    e.currentTarget.style.color = '#14462a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#E4E6EB';
                    e.currentTarget.style.color = '#2D2D2D';
                  }
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{ borderColor: '#E4E6EB' }}
            >
              <ArrowRight2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
