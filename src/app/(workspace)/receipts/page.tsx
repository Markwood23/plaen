"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RefreshCircle, 
  SearchNormal1, 
  Calendar as CalendarIcon, 
  DocumentDownload, 
  Add, 
  More, 
  ArrowSwapVertical, 
  TickCircle, 
  Eye, 
  Trash, 
  ReceiptText,
  Clock,
  Danger,
  Edit2,
  ArrowLeft2,
  ArrowRight2,
  Filter,
  Money,
  Category2,
} from "iconsax-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useReceiptsData, deleteReceipt, verifyReceipt } from "@/hooks/useReceiptsData";
import { EmptyState } from "@/components/ui/empty-state";

// Loading skeletons
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="group relative rounded-2xl p-6 animate-pulse" style={{ backgroundColor: 'rgba(176, 179, 184, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="h-6 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  );
}

export default function ReceiptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { maskAmount } = useBalanceVisibility();

  const { receipts, loading, error, pagination, refetch, setFilters, filters } = useReceiptsData({
    page: 1,
    limit: 10,
  });

  // Update filters when search or status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchQuery || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        dateFrom: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        dateTo: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        page: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, selectedCategory, dateRange]);

  // Calculate KPIs from receipts
  const totalReceipts = pagination.total;
  const verifiedCount = receipts.filter(r => r.status === 'verified').length;
  const pendingCount = receipts.filter(r => r.status === 'pending').length;
  const flaggedCount = receipts.filter(r => r.status === 'flagged').length;
  const totalAmount = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);

  // Handle select all
  const allSelected = receipts.length > 0 && selectedRows.length === receipts.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(receipts.map(r => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (receiptId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this receipt?');
    if (!confirmed) return;

    const result = await deleteReceipt(receiptId);
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Failed to delete receipt');
    }
  };

  const handleVerify = async (receiptId: string) => {
    const result = await verifyReceipt(receiptId);
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Failed to verify receipt');
    }
  };

  const formatAmount = (amount: number, currency: string = '₵') => {
    return maskAmount(`${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="verified">
            <TickCircle size={14} color="#14462a" variant="Bold" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="pending">
            <Clock size={14} color="#D97706" variant="Bold" /> Pending
          </Badge>
        );
      case "flagged":
        return (
          <Badge variant="flagged">
            <Danger size={14} color="#DC2626" variant="Bold" /> Flagged
          </Badge>
        );
      default:
        return null;
    }
  };

  // Check if user has no receipts at all (for empty state)
  const isNewUser = !loading && receipts.length === 0 && !searchQuery && selectedStatus === 'all' && selectedCategory === 'all' && !dateRange;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Receipts</h1>
          <p className="text-xs sm:text-sm mt-0.5 sm:mt-1" style={{ color: '#B0B3B8' }}>Track and manage expense receipts</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105 h-8 sm:h-9 text-xs sm:text-sm"
            style={{ backgroundColor: 'white' }}
            onClick={() => refetch()}
          >
            <RefreshCircle size={14} color="#65676B" className="mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            size="sm"
            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105 h-8 sm:h-9 text-xs sm:text-sm"
            style={{ backgroundColor: '#14462a', color: 'white' }}
            asChild
          >
            <Link href="/receipts/new">
              <Add size={14} color="white" className="mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Add Receipt</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            <div className="group relative rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <ReceiptText size={16} color="#14462a" variant="Bulk" className="sm:hidden" />
                  <ReceiptText size={24} color="#14462a" variant="Bulk" className="hidden sm:block" />
                </div>
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <span className="text-[10px] sm:text-xs font-semibold" style={{ color: '#14462a' }}>{totalReceipts}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Receipts</p>
              <p className="text-lg sm:text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{totalReceipts}</p>
            </div>

            <div className="group relative rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <TickCircle size={16} color="#14462a" variant="Bulk" className="sm:hidden" />
                  <TickCircle size={24} color="#14462a" variant="Bulk" className="hidden sm:block" />
                </div>
              </div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Verified</p>
              <p className="text-lg sm:text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{verifiedCount}</p>
            </div>

            <div className="group relative rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(217, 119, 6, 0.04)' }}>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(217, 119, 6, 0.12)' }}>
                  <Clock size={16} color="#D97706" variant="Bulk" className="sm:hidden" />
                  <Clock size={24} color="#D97706" variant="Bulk" className="hidden sm:block" />
                </div>
              </div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Pending</p>
              <p className="text-lg sm:text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{pendingCount}</p>
            </div>

            <div className="group relative rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(220, 38, 38, 0.04)' }}>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}>
                  <Danger size={16} color="#DC2626" variant="Bulk" className="sm:hidden" />
                  <Danger size={24} color="#DC2626" variant="Bulk" className="hidden sm:block" />
                </div>
              </div>
              <p className="text-xs sm:text-sm mb-1 sm:mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Flagged</p>
              <p className="text-lg sm:text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{flaggedCount}</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters - Only show if user has receipts */}
      {!isNewUser && (
        <div className="rounded-xl sm:rounded-2xl p-3 sm:p-6" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Receipts</h3>
              <p className="text-[10px] sm:text-xs mt-0.5 hidden sm:block" style={{ color: '#B0B3B8' }}>Search and filter your receipts</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setDateRange(undefined);
              }}
              className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all hover:bg-white"
              style={{ color: '#14462a' }}
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] sm:text-xs mb-1.5 sm:mb-2 block font-medium" style={{ color: '#65676B' }}>Search</label>
              <div className="relative">
                <SearchNormal1 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B0B3B8' }} />
                <Input
                  placeholder="Search receipts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 h-9 sm:h-11 rounded-lg sm:rounded-xl border-0 shadow-sm transition-all focus:shadow-md text-sm"
                  style={{ backgroundColor: 'white', color: '#2D2D2D' }}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] sm:text-xs mb-1.5 sm:mb-2 block font-medium" style={{ color: '#65676B' }}>Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9 sm:h-11 rounded-lg sm:rounded-xl border-0 shadow-sm transition-all hover:shadow-md text-sm" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] sm:text-xs mb-1.5 sm:mb-2 block font-medium" style={{ color: '#65676B' }}>Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-9 sm:h-11 rounded-lg sm:rounded-xl border-0 shadow-sm transition-all hover:shadow-md text-sm" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="office_supplies">Office Supplies</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Receipts Table */}
      <div className="rounded-xl sm:rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : isNewUser ? (
          <EmptyState
            icon={ReceiptText}
            iconColor="#14462a"
            title="No receipts yet"
            description="Start tracking your expense receipts to manage your finances better."
            actionLabel="Add Your First Receipt"
            actionHref="/receipts/new"
          />
        ) : receipts.length === 0 ? (
          <EmptyState
            icon={SearchNormal1}
            title="No results found"
            description={searchQuery ? `No receipts matching "${searchQuery}"` : "No receipts match your filters. Try adjusting your search criteria."}
            size="sm"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
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
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow
                      key={receipt.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => window.location.href = `/receipts/${receipt.id}`}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.includes(receipt.id)}
                          onCheckedChange={() => toggleSelectRow(receipt.id)}
                          aria-label={`Select ${receipt.receipt_id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                          >
                            <ReceiptText size={16} color="#14462a" />
                          </div>
                          <span className="font-medium" style={{ color: '#2D2D2D' }}>
                            {receipt.receipt_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm" style={{ color: '#65676B' }}>
                        {formatDate(receipt.date)}
                      </TableCell>
                      <TableCell className="font-medium" style={{ color: '#2D2D2D' }}>
                        {receipt.vendor}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full capitalize">
                          {receipt.category?.replace(/_/g, ' ') || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold" style={{ color: '#2D2D2D' }}>
                        {formatAmount(receipt.amount, receipt.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                      <TableCell className="text-sm" style={{ color: '#65676B' }}>
                        {receipt.payment_method}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                              <More size={16} color="#B0B3B8" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                            <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                              <Link href={`/receipts/${receipt.id}`}>
                                <Eye size={16} color="#14462a" className="mr-2" />
                                <span>View</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                              <Link href={`/receipts/${receipt.id}/edit`}>
                                <Edit2 size={16} color="#14462a" className="mr-2" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            {receipt.status === 'pending' && (
                              <DropdownMenuItem
                                className="rounded-xl p-3 cursor-pointer"
                                onClick={() => handleVerify(receipt.id)}
                              >
                                <TickCircle size={16} color="#14462a" className="mr-2" />
                                <span>Verify</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="my-2" />
                            <DropdownMenuItem
                              className="rounded-xl p-3 cursor-pointer text-red-600"
                              onClick={() => handleDelete(receipt.id)}
                            >
                              <Trash size={16} color="#DC2626" className="mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-3 space-y-3">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  onClick={() => window.location.href = `/receipts/${receipt.id}`}
                  className="p-4 rounded-xl cursor-pointer transition-all hover:shadow-md"
                  style={{ backgroundColor: '#FAFBFC' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                      >
                        <ReceiptText size={16} color="#14462a" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate" style={{ color: "#2D2D2D" }}>
                          {receipt.vendor}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#B0B3B8" }}>
                          {receipt.receipt_id} • {formatDate(receipt.date)}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0 capitalize">
                            {receipt.category?.replace(/_/g, ' ') || 'Uncategorized'}
                          </Badge>
                          {getStatusBadge(receipt.status)}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>
                            {formatAmount(receipt.amount, receipt.currency)}
                          </span>
                          <span className="text-[10px]" style={{ color: "#B0B3B8" }}>
                            {receipt.payment_method}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                          <More size={16} color="#B0B3B8" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-44 p-2">
                        <DropdownMenuItem asChild className="rounded-xl p-2.5 cursor-pointer">
                          <Link href={`/receipts/${receipt.id}`}>
                            <Eye size={14} color="#14462a" className="mr-2" />
                            <span className="text-sm">View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl p-2.5 cursor-pointer">
                          <Link href={`/receipts/${receipt.id}/edit`}>
                            <Edit2 size={14} color="#14462a" className="mr-2" />
                            <span className="text-sm">Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        {receipt.status === 'pending' && (
                          <DropdownMenuItem
                            className="rounded-xl p-2.5 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); handleVerify(receipt.id); }}
                          >
                            <TickCircle size={14} color="#14462a" className="mr-2" />
                            <span className="text-sm">Verify</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                          className="rounded-xl p-2.5 cursor-pointer text-red-600"
                          onClick={(e) => { e.stopPropagation(); handleDelete(receipt.id); }}
                        >
                          <Trash size={14} color="#DC2626" className="mr-2" />
                          <span className="text-sm">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t">
                <p className="text-xs sm:text-sm" style={{ color: '#65676B' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 sm:h-9"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    <ArrowLeft2 size={14} color="#65676B" />
                  </Button>
                  <span className="text-xs sm:text-sm px-2 sm:px-3" style={{ color: '#2D2D2D' }}>
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 sm:h-9"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  >
                    <ArrowRight2 size={14} color="#65676B" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
