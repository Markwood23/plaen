"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Search, Calendar } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css"; // layout/styles first; colors overridden globally
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Check, X, RotateCcw, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
          <Badge className="bg-[#212121] text-white border-[#212121]">
            <Check className="h-3.5 w-3.5" /> Paid
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <X className="h-3.5 w-3.5" /> Cancelled
          </Badge>
        );
      case "Refunded":
        return (
          <Badge className="bg-gray-400 text-white border-gray-400">
            <RotateCcw className="h-3.5 w-3.5" /> Refunded
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <Clock className="h-3.5 w-3.5" /> Pending
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
          <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">Invoices</h1>
          <p className="text-sm text-[#949494]">Create and manage all invoices</p>
        </div>
        <Button className="bg-[#212121] text-white hover:bg-[#212121]/90 rounded-lg px-5 h-10 font-medium shadow-sm transition-all hover:shadow-md">
          + New Invoice
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Overdue */}
            <div className="group">
              <p className="text-sm text-[#949494] mb-2 font-medium">Overdue</p>
              <p className="text-3xl font-semibold text-[#212121] transition-all">
                $16,935<span className="text-[#949494]">.80</span>
              </p>
            </div>

            {/* Due within 30 days */}
            <div className="group">
              <p className="text-sm text-[#949494] mb-2 font-medium">Due within 30 days</p>
              <p className="text-3xl font-semibold text-[#212121] transition-all">
                $16,935<span className="text-[#949494]">.80</span>
              </p>
            </div>

            {/* Average time paid */}
            <div className="group">
              <p className="text-sm text-[#949494] mb-2 font-medium">Average time paid</p>
              <p className="text-3xl font-semibold text-[#212121] transition-all">
                2 <span className="text-[#949494] text-base font-normal">days</span>
              </p>
            </div>

            {/* Upcoming payment */}
            <div className="group">
              <p className="text-sm text-[#949494] mb-2 font-medium">Upcoming payment</p>
              <p className="text-3xl font-semibold text-[#212121] transition-all">None</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[#949494]">
              <span>Last update a minute ago.</span>
              <button 
                className="hover:text-gray-700 transition-all hover:rotate-180 duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-full p-1" 
                aria-label="Refresh statistics"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-[#F9F9F9] rounded-full py-2.5 px-5 transition-all hover:bg-gray-100">
              <div className="flex -space-x-2">
                {/* MTN Mobile Money */}
                <div className="w-8 h-8 rounded-full border-[0.5px] border-white shadow-sm overflow-hidden relative">
                  <Image 
                    src="/logos/mtn-mobile-money.png" 
                    alt="MTN Mobile Money" 
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Vodafone Cash */}
                <div className="w-8 h-8 rounded-full border-[0.5px] border-white shadow-sm overflow-hidden relative">
                  <Image 
                    src="/logos/vodafone-cash.png" 
                    alt="Vodafone Cash" 
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Tigo Cash */}
                <div className="w-8 h-8 rounded-full border-[0.5px] border-white shadow-sm overflow-hidden relative">
                  <Image 
                    src="/logos/tigo-cash.png" 
                    alt="Tigo Cash" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Get paid 3x faster with mobile money payment.{" "}
                <button className="font-semibold text-[#212121] hover:underline focus-visible:outline-none focus-visible:underline transition-all">
                  Set as Default Payment
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm text-[#949494] mb-2">
                Search for invoice
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949494]" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for invoice or contact"
                  className="pl-9 h-11"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm text-[#949494] mb-2">
                Status
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="status" className="!h-11 w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm text-[#949494] mb-2">
                Date
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="From"
                    className="h-11"
                    readOnly
                    value={dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : ""}
                  />
                </div>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="To"
                    className="h-11"
                    readOnly
                    value={dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : ""}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className="h-11 w-11 flex items-center justify-center border border-[#EBECE7] rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                      aria-label="Select date range"
                      type="button"
                    >
                      <Calendar className="h-4 w-4 text-[#949494]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="plaen-calendar">
                      <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="p-3"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent>
          {/* Bulk Actions Bar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-[#F9F9F9] rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{selectedRows.length}</span> invoice{selectedRows.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-sm">
                  Export
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  Mark as Paid
                </Button>
                <Button variant="outline" size="sm" className="text-sm text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          )}

          <Table className="[&_th]:py-4 [&_td]:py-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className={someSelected ? "data-[state=checked]:bg-gray-400" : ""}
                  />
                </TableHead>
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
              {currentInvoices.map((invoice, idx) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.includes(invoice.id)}
                      onCheckedChange={() => toggleSelectRow(invoice.id)}
                      aria-label={`Select invoice ${invoice.invoiceId}`}
                    />
                  </TableCell>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.contact}</TableCell>
                  <TableCell className="text-gray-600">{invoice.reason}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
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

          {/* Pagination */}
          {/* Footer with pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-[#EBECE7]">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, invoicesData.length)}</span> of{" "}
              <span className="font-medium">{invoicesData.length}</span> invoices
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 p-0 ${page === currentPage ? "bg-[#212121] text-white hover:bg-[#212121]" : ""}`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content will go here */}
    </div>
  );
}
