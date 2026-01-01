"use client";

import { Button } from "@/components/ui/button";
import { 
  RefreshCircle, 
  SearchNormal1, 
  DocumentDownload, 
  More, 
  TickCircle, 
  CloseCircle, 
  Coin1, 
  Mobile, 
  Building, 
  Receipt21, 
  ArrowLeft2, 
  ArrowRight2, 
  Clock, 
  Eye,
  MoneyRecive
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
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
import { usePaymentsData, Payment } from "@/hooks/usePaymentsData";
import { EmptyState } from "@/components/ui/empty-state";
import { PaymentDetailModal } from "@/components/payments/payment-detail-modal";

// Loading skeletons
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
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

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { maskAmount } = useBalanceVisibility();

  const { payments, loading, error, pagination, refetch, setFilters, filters } = usePaymentsData({
    page: 1,
    limit: 10,
  });

  // Update filters when method changes
  useEffect(() => {
    setFilters({
      ...filters,
      method: methodFilter !== 'all' ? methodFilter as any : undefined,
      page: 1,
    });
  }, [methodFilter]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle select all
  const allSelected = payments.length > 0 && selectedRows.length === payments.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(payments.map(p => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Calculate stats from payments
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = payments.length;

  const getRailIcon = (method: string | null) => {
    let icon = '/icons/transfer-money.png';
    let bgColor = '#F9F9F9';
    let alt = 'Payment';
    
    if (method?.includes("momo") || method?.includes("mobile")) {
      icon = '/icons/mobile.png';
      bgColor = '#FFF4E6';
      alt = 'Mobile Money';
    } else if (method?.includes("bank") || method?.includes("transfer")) {
      icon = '/icons/bank.png';
      bgColor = '#E8F4FD';
      alt = 'Bank Transfer';
    } else if (method?.includes("card")) {
      icon = '/icons/credit-card.png';
      bgColor = '#F3E8FF';
      alt = 'Card';
    } else if (method?.includes("cash")) {
      icon = '/icons/transfer-money.png';
      bgColor = '#E8F9F1';
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

  const getMethodLabel = (method: string | null) => {
    if (!method) return 'Unknown';
    const labels: Record<string, string> = {
      'mtn_momo': 'MTN MoMo',
      'vodafone_cash': 'Vodafone Cash',
      'airteltigo_money': 'AirtelTigo Money',
      'bank_transfer': 'Bank Transfer',
      'card': 'Card',
      'cash': 'Cash',
      'crypto': 'Crypto',
    };
    return labels[method] || method.replace(/_/g, ' ');
  };

  // Check if user has no payments at all (for empty state)
  const isNewUser = !loading && payments.length === 0 && methodFilter === 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment Allocations</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Track how payments are allocated to invoices and monitor collection performance</p>
        </div>
        <div className="flex items-center gap-3">
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
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: 'white' }}
          >
            <DocumentDownload size={16} color="#65676B" className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            {/* Total Collected */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <Coin1 size={24} color="#14462a" variant="Bulk" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <span className="text-xs font-semibold" style={{ color: '#14462a' }}>{pagination.total}</span>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Collected</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {maskAmount(formatCurrency(totalCollected))}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>From {paidPayments} payments</p>
            </div>

            {/* Payments Count */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <MoneyRecive size={24} color="#14462a" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Payments</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {pagination.total}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>All time</p>
            </div>

            {/* Average Payment */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <Receipt21 size={24} color="#14462a" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Avg Payment</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {maskAmount(formatCurrency(payments.length > 0 ? totalCollected / payments.length : 0))}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Per transaction</p>
            </div>

            {/* Recent Activity */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <Clock size={24} color="#14462a" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>This Month</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {payments.filter(p => {
                  const paymentDate = new Date(p.payment_date);
                  const now = new Date();
                  return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Payments received</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filter Card - Only show if user has payments */}
      {!isNewUser && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Payments</h3>
              <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setMethodFilter('all'); }}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" 
              style={{ color: '#14462a' }}
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Search</label>
              <div className="relative group">
                <SearchNormal1 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#B0B3B8' }} />
                <Input
                  placeholder="Invoice, contact, reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md"
                  style={{ backgroundColor: 'white', color: '#2D2D2D' }}
                />
              </div>
            </div>

            {/* Method Filter */}
            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Payment Method</label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="mtn_momo">
                    <div className="flex items-center gap-2">
                      <Mobile size={14} color="#14462a" />
                      MTN MoMo
                    </div>
                  </SelectItem>
                  <SelectItem value="vodafone_cash">
                    <div className="flex items-center gap-2">
                      <Mobile size={14} color="#14462a" />
                      Vodafone Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <Building size={14} color="#14462a" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Coin1 size={14} color="#14462a" />
                      Cash
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
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span style={{ color: '#B0B3B8' }}>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
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
      )}

      {/* Payments Table */}
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
                <DocumentDownload size={16} color="currentColor" className="mr-2" /> Export
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

        {loading ? (
          <TableSkeleton rows={5} />
        ) : isNewUser ? (
          <EmptyState
            icon={MoneyRecive}
            iconColor="#14462a"
            title="No payments yet"
            description="When your clients pay their invoices, payments will appear here. Create an invoice and share it to start receiving payments."
            actionLabel="Create an Invoice"
            actionHref="/invoices/new"
          />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={SearchNormal1}
            title="No results found"
            description="No payments match your filters. Try adjusting your search criteria."
            size="sm"
          />
        ) : (
          <>
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
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow 
                    key={payment.id} 
                    data-state={selectedRows.includes(payment.id) ? "selected" : undefined}
                    className="cursor-pointer hover:bg-gray-50" 
                    style={{ borderColor: '#E4E6EB' }}
                    onClick={() => {
                      setSelectedPayment(payment);
                      setIsModalOpen(true);
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedRows.includes(payment.id)}
                        onCheckedChange={() => toggleSelectRow(payment.id)}
                        aria-label="Select payment"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {payment.allocations.length > 0 ? (
                        <div className="space-y-1">
                          {payment.allocations.map(alloc => (
                            <Link 
                              key={alloc.id}
                              href={`/invoices/${alloc.invoice?.id}`}
                              className="text-[#14462a] hover:underline block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {alloc.invoice?.invoice_number || '-'}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#65676B]">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.allocations.length > 0 ? (
                        <span>{payment.allocations[0]?.invoice?.customer?.name || payment.payer_name || '-'}</span>
                      ) : (
                        <span>{payment.payer_name || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRailIcon(payment.payment_method)}
                        <span className="text-sm">{getMethodLabel(payment.payment_method)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {maskAmount(formatCurrency(payment.amount, payment.currency))}
                    </TableCell>
                    <TableCell className="text-[#65676B] text-sm truncate max-w-[150px]">
                      {payment.reference || '-'}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                            <More size={16} color="#B0B3B8" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye size={16} color="#14462a" className="mr-2" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {payment.allocations.length > 0 && (
                            <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                              <Link href={`/invoices/${payment.allocations[0]?.invoice?.id}`}>
                                <Receipt21 size={16} color="#14462a" className="mr-2" />
                                <span>View Invoice</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
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
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} payments
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    <ArrowLeft2 size={16} color="#65676B" />
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
                    <ArrowRight2 size={16} color="#65676B" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal 
        payment={selectedPayment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
