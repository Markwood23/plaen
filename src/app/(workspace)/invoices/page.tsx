"use client";

import { Button } from "@/components/ui/button";
import { 
  SearchNormal1,
  RefreshCircle,
  More,
  TickCircle,
  CloseCircle,
  Clock,
  ArrowLeft2,
  ArrowRight2,
  Add,
  Eye,
  Trash,
  Coin1,
  Receipt21,
  ArrowUp2,
  ArrowDown2,
  DocumentDownload,
  Send2
} from "iconsax-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useInvoicesData, deleteInvoice, bulkDeleteInvoices, bulkMarkAsSent, exportInvoicesToCSV } from "@/hooks/useInvoicesData";
import { EmptyState } from "@/components/ui/empty-state";

// Loading skeleton
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
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

export default function InvoicesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { isBalanceHidden, maskAmount } = useBalanceVisibility();
  
  const { invoices, loading, error, pagination, refetch, setFilters, filters } = useInvoicesData({
    page: 1,
    limit: 10,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      setFilters({ ...filters, sortBy: column, sortOrder: newOrder, page: 1 });
    } else {
      setSortBy(column);
      setSortOrder("desc");
      setFilters({ ...filters, sortBy: column, sortOrder: "desc", page: 1 });
    }
  };

  // Update filters when search or status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate KPI stats from invoices
  const stats = {
    overdue: invoices.filter(i => i.status === 'overdue'),
    pending: invoices.filter(i => ['sent', 'viewed', 'partially_paid'].includes(i.status || '')),
    paid: invoices.filter(i => i.status === 'paid'),
    total: invoices,
  };

  const overdueTotal = stats.overdue.reduce((sum, i) => sum + i.balance_due, 0);
  const pendingTotal = stats.pending.reduce((sum, i) => sum + i.balance_due, 0);
  const paidTotal = stats.paid.reduce((sum, i) => sum + i.total, 0);
  const totalAmount = invoices.reduce((sum, i) => sum + i.total, 0);

  // Handle select all
  const allSelected = invoices.length > 0 && selectedRows.length === invoices.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(invoices.map(inv => inv.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (invoiceId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirmed) return;
    
    const result = await deleteInvoice(invoiceId);
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Failed to delete invoice');
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedRows.length} invoice(s)?`);
    if (!confirmed) return;
    
    const result = await bulkDeleteInvoices(selectedRows);
    if (result.success) {
      setSelectedRows([]);
      refetch();
    } else {
      alert(result.error || 'Failed to delete invoices');
    }
  };

  // Bulk mark as sent handler
  const handleBulkSend = async () => {
    if (selectedRows.length === 0) return;
    
    const confirmed = window.confirm(`Mark ${selectedRows.length} invoice(s) as sent and email customers?`);
    if (!confirmed) return;
    
    const result = await bulkMarkAsSent(selectedRows);
    if (result.success) {
      setSelectedRows([]);
      refetch();
    } else {
      alert(result.error || 'Failed to send invoices');
    }
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    // Export selected or all invoices
    const invoicesToExport = selectedRows.length > 0 
      ? invoices.filter(inv => selectedRows.includes(inv.id))
      : invoices;
    exportInvoicesToCSV(invoicesToExport);
  };

  const getStatusBadge = (status: string | null) => {
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
            <Clock size={14} color="#D97706" variant="Bold" /> {status?.replace('_', ' ')}
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline">
            <Receipt21 size={14} color="#65676B" variant="Bold" /> Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  // Check if user has no invoices at all (for empty state)
  const isNewUser = !loading && invoices.length === 0 && !searchQuery && statusFilter === 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Invoices</h1>
          <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Create and manage all invoices</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bulk Actions (shown when items selected) */}
          {selectedRows.length > 0 && (
            <>
              <span className="text-sm text-gray-500">{selectedRows.length} selected</span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
                style={{ backgroundColor: 'white' }}
                onClick={handleBulkSend}
              >
                <Send2 size={16} color="#14462a" className="mr-2" />
                Send
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105 text-red-600"
                style={{ backgroundColor: 'white' }}
                onClick={handleBulkDelete}
              >
                <Trash size={16} color="#DC2626" className="mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: 'white' }}
            onClick={handleExportCSV}
            title={selectedRows.length > 0 ? `Export ${selectedRows.length} selected` : 'Export all'}
          >
            <DocumentDownload size={16} color="#65676B" className="mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: 'white' }}
            onClick={() => refetch()}
          >
            <RefreshCircle size={16} color="#65676B" className="mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: '#14462a', color: 'white' }}
            asChild
          >
            <Link href="/invoices/new">
              <Add size={16} color="white" className="mr-2" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(220, 38, 38, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
                >
                  <Clock size={24} color="#DC2626" variant="Bulk" />
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' }}
                >
                  {stats.overdue.length}
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Overdue</p>
              <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{maskAmount(formatCurrency(overdueTotal))}</div>
              <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Needs attention</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}
                >
                  <Receipt21 size={24} color="#F59E0B" variant="Bulk" />
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}
                >
                  {stats.pending.length}
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Pending</p>
              <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{maskAmount(formatCurrency(pendingTotal))}</div>
              <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>Awaiting payment</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}
                >
                  <TickCircle size={24} color="#0D9488" variant="Bulk" />
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488' }}
                >
                  {stats.paid.length}
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Paid</p>
              <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{maskAmount(formatCurrency(paidTotal))}</div>
              <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>This period</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}
                >
                  <Coin1 size={24} color="#14462a" variant="Bulk" />
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)', color: '#14462a' }}
                >
                  {pagination.total}
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Invoices</p>
              <div className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{maskAmount(formatCurrency(totalAmount))}</div>
              <p className="text-xs mt-3" style={{ color: '#B0B3B8' }}>All time</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters */}
      {!isNewUser && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Invoices</h3>
              <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" 
              style={{ color: '#14462a' }}
            >
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
                <SearchNormal1 size={16} color="#B0B3B8" className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search invoices or contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md"
                  style={{ backgroundColor: 'white', color: '#2D2D2D' }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'white', color: '#2D2D2D' }}>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all" className="rounded-xl">All Statuses</SelectItem>
                  <SelectItem value="draft" className="rounded-xl">Draft</SelectItem>
                  <SelectItem value="sent" className="rounded-xl">Sent</SelectItem>
                  <SelectItem value="paid" className="rounded-xl">Paid</SelectItem>
                  <SelectItem value="partially_paid" className="rounded-xl">Partially Paid</SelectItem>
                  <SelectItem value="overdue" className="rounded-xl">Overdue</SelectItem>
                  <SelectItem value="cancelled" className="rounded-xl">Cancelled</SelectItem>
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
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `\${format(dateRange.from, "MMM d")} - \${format(dateRange.to, "MMM d, yyyy")}`
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span style={{ color: '#B0B3B8' }}>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                  <CalendarComponent
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
      )}

      {/* Invoices Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : isNewUser ? (
          <EmptyState
            icon={Receipt21}
            iconColor="#14462a"
            title="No invoices yet"
            description="Create your first invoice to start getting paid. It only takes a minute to set up!"
            actionLabel="Create Your First Invoice"
            actionHref="/invoices/new"
          />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={SearchNormal1}
            title="No results found"
            description={searchQuery ? `No invoices matching "\${searchQuery}"` : "No invoices match your filters. Try adjusting your search criteria."}
            size="sm"
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("invoice_number")}
                  >
                    <div className="flex items-center gap-1.5">
                      Invoice
                      {sortBy === "invoice_number" && (
                        sortOrder === "asc" ? <ArrowUp2 size={14} color="#14462a" /> : <ArrowDown2 size={14} color="#14462a" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("issue_date")}
                  >
                    <div className="flex items-center gap-1.5">
                      Date
                      {sortBy === "issue_date" && (
                        sortOrder === "asc" ? <ArrowUp2 size={14} color="#14462a" /> : <ArrowDown2 size={14} color="#14462a" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1.5">
                      Amount
                      {sortBy === "total" && (
                        sortOrder === "asc" ? <ArrowUp2 size={14} color="#14462a" /> : <ArrowDown2 size={14} color="#14462a" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1.5">
                      Status
                      {sortBy === "status" && (
                        sortOrder === "asc" ? <ArrowUp2 size={14} color="#14462a" /> : <ArrowDown2 size={14} color="#14462a" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => window.location.href = `/invoices/\${invoice.id}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(invoice.id)}
                        onCheckedChange={() => toggleSelectRow(invoice.id)}
                        aria-label={`Select \${invoice.invoice_number}`}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{new Date(invoice.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                    <TableCell>{invoice.customer?.name || 'No contact'}</TableCell>
                    <TableCell className="text-[#65676B] max-w-[200px] truncate">{invoice.notes || '-'}</TableCell>
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
                          <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                            <Link href={`/invoices/\${invoice.id}`} className="flex items-center gap-2">
                              <Eye size={16} color="#14462a" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer text-red-600"
                            onClick={() => handleDelete(invoice.id)}
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
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm" style={{ color: '#65676B' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} invoices
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    <ArrowLeft2 size={16} />
                  </Button>
                  <span className="text-sm px-3" style={{ color: '#2D2D2D' }}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  >
                    <ArrowRight2 size={16} />
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
