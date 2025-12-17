"use client";

import { Button } from "@/components/ui/button";
import { 
  Loading03Icon, 
  Search01Icon, 
  Calendar03Icon, 
  Download01Icon, 
  Add01Icon, 
  MoreHorizontalIcon, 
  ArrowDataTransferVerticalIcon, 
  CheckmarkSquare02Icon, 
  ViewIcon, 
  Delete02Icon, 
  FileValidationIcon 
} from "hugeicons-react";
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

const receiptsData = [
  { id: 1, receiptId: "#REC001", date: "Dec 15, 2024", vendor: "Office Supplies Co", category: "Office Supplies", amount: "₵523.45", status: "Verified", paymentMethod: "MTN MoMo" },
  { id: 2, receiptId: "#REC002", date: "Dec 14, 2024", vendor: "Tech Solutions Ltd", category: "Equipment", amount: "₵2,450.00", status: "Pending", paymentMethod: "Bank Transfer" },
  { id: 3, receiptId: "#REC003", date: "Dec 12, 2024", vendor: "Coffee Corner", category: "Meals", amount: "₵85.20", status: "Verified", paymentMethod: "Cash" },
  { id: 4, receiptId: "#REC004", date: "Dec 10, 2024", vendor: "Internet Service", category: "Utilities", amount: "₵350.00", status: "Verified", paymentMethod: "Bank Transfer" },
  { id: 5, receiptId: "#REC005", date: "Dec 8, 2024", vendor: "Fuel Station", category: "Transport", amount: "₵180.00", status: "Flagged", paymentMethod: "Cash" },
  { id: 6, receiptId: "#REC006", date: "Dec 5, 2024", vendor: "Marketing Agency", category: "Marketing", amount: "₵1,850.00", status: "Pending", paymentMethod: "MTN MoMo" },
];

export default function ReceiptsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  const currentReceipts = receiptsData;
  
  // Handle select all
  const allSelected = currentReceipts.length > 0 && selectedRows.length === currentReceipts.length && currentReceipts.every(receipt => selectedRows.includes(receipt.id));
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentReceipts.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge style={{ backgroundColor: '#14462a', color: 'white', borderColor: '#14462a' }}>
            <CheckmarkSquare02Icon size={14} /> Verified
          </Badge>
        );
      case "Pending":
        return (
          <Badge style={{ backgroundColor: 'rgba(240, 242, 245, 0.5)', color: '#2D2D2D', borderColor: '#E4E6EB' }}>
            <FileValidationIcon size={14} /> Pending
          </Badge>
        );
      case "Flagged":
        return (
          <Badge style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.2)' }}>
            Flagged
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
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Receipts</h1>
          <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Track and manage expense receipts</p>
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
          >
            <Add01Icon size={16} className="mr-2" />
            Add Receipt
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              +5%
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Verified</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵5,238.65</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>This month</p>
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
              12
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Pending Review</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵4,650.00</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Awaiting verification</p>
        </div>

        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}
            >
              <FileValidationIcon size={24} style={{ color: '#14462a', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)', color: '#14462a' }}
            >
              48
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Receipts</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>156</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>All time</p>
        </div>

        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(220, 38, 38, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
            >
              <FileValidationIcon size={24} style={{ color: '#DC2626', strokeWidth: 2 }} />
            </div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' }}
            >
              3
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Flagged</p>
          <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>₵265.20</div>
          <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Requires attention</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Receipts</h3>
            <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" style={{ color: '#14462a' }}>
            Clear all
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="search" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Search
            </label>
            <div className="relative group">
              <Search01Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#B0B3B8' }} />
              <Input
                id="search"
                placeholder="Search receipts..."
                className="h-11 pl-10 rounded-xl border-0 shadow-sm transition-all focus:shadow-md focus:scale-[1.01]"
                style={{ backgroundColor: '#FAFBFC' }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Category
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="category" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                <SelectItem value="all" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>All categories</span>
                </SelectItem>
                <SelectItem value="office" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>Office Supplies</span>
                </SelectItem>
                <SelectItem value="equipment" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>Equipment</span>
                </SelectItem>
                <SelectItem value="meals" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>Meals</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="status" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Status
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="status" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                <SelectItem value="all" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>All statuses</span>
                </SelectItem>
                <SelectItem value="verified" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#14462a' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Verified</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#F59E0B' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Pending</span>
                  </div>
                </SelectItem>
                <SelectItem value="flagged" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#DC2626' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Flagged</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Date Range
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start text-left rounded-xl border-0 shadow-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: 'white', color: dateRange ? '#2D2D2D' : '#B0B3B8', fontWeight: 400 }}
                >
                  <Calendar03Icon className="mr-2" size={16} />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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

      {/* Receipt Table */}
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
                  {selectedRows.length} {selectedRows.length === 1 ? 'receipt' : 'receipts'} selected
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
                  Receipt ID <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Date <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Vendor <ArrowDataTransferVerticalIcon size={14} />
                </button>
              </TableHead>
              <TableHead>Category</TableHead>
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
            {currentReceipts.map((receipt) => (
              <TableRow 
                key={receipt.id}
                data-state={selectedRows.includes(receipt.id) ? "selected" : undefined}
                className="cursor-pointer"
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedRows.includes(receipt.id)}
                    onCheckedChange={() => toggleSelectRow(receipt.id)}
                    aria-label={`Select receipt ${receipt.receiptId}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{receipt.receiptId}</TableCell>
                <TableCell className="text-[#65676B]">{receipt.date}</TableCell>
                <TableCell>{receipt.vendor}</TableCell>
                <TableCell className="text-[#65676B]">{receipt.category}</TableCell>
                <TableCell className="font-medium">{receipt.amount}</TableCell>
                <TableCell>
                  {getStatusBadge(receipt.status)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(24,119,242,0.08)]">
                        <MoreHorizontalIcon size={16} style={{ color: '#B0B3B8' }} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                      <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                          style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                        >
                          <ViewIcon size={16} style={{ color: '#14462a' }} />
                        </div>
                        <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>View Receipt</span>
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
      </div>
    </div>
  );
}
