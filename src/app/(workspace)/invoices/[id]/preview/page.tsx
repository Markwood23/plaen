"use client";

import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft2, 
  DocumentDownload, 
  Send2,
  Printer,
  TickCircle,
  Clock,
  Coin1,
  Card
} from "iconsax-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useInvoiceDetail } from "@/hooks/useInvoicesData";
import { SendInvoiceModal } from "@/components/invoices/send-invoice-modal";
import { useSearchParams } from "next/navigation";

export default function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { maskAmount } = useBalanceVisibility();
  const searchParams = useSearchParams();
  const [sendOpen, setSendOpen] = useState(false);
  
  // Fetch real invoice data
  const { invoice: invoiceData, loading, error, refetch } = useInvoiceDetail(id);

  useEffect(() => {
    if (searchParams.get('send') === '1') {
      setSendOpen(true);
    }
  }, [searchParams]);

  const origin = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  }, []);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format currency - amounts from DB are in minor units (cents/pesewas), divide by 100
  const formatCurrency = (amount: number, currency?: string) => {
    const curr = currency?.toUpperCase() || 'GHS';
    const symbol = curr === 'GHS' ? '₵' : curr === 'USD' ? '$' : curr;
    const majorUnits = (amount || 0) / 100;
    return `${symbol}${majorUnits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Uses browser print-to-PDF
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="px-12 py-10">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-3 gap-8 mb-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Invoice not found</p>
          <Button variant="outline" asChild>
            <Link href="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals from line items
  const lineItems = invoiceData.line_items || [];
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const total = invoiceData.total || subtotal;
  const balanceDue = invoiceData.balance_due || 0;

  const paymentUrl = invoiceData.public_id ? `${origin}/pay/${invoiceData.public_id}` : null;

  // Get customer info
  const customer = invoiceData.customer;

  // Status display
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'partially_paid': return 'Partially Paid';
      case 'sent': return 'Sent';
      case 'draft': return 'Draft';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return { bg: '#E8F9F1', text: '#14462a' };
      case 'partially_paid': return { bg: '#FFF4E6', text: '#F59E0B' };
      case 'sent': return { bg: '#EBF5FF', text: '#3B82F6' };
      case 'overdue': return { bg: '#FEF2F2', text: '#DC2626' };
      case 'cancelled': return { bg: '#F3F4F6', text: '#6B7280' };
      default: return { bg: '#F9F9F9', text: '#B0B3B8' };
    }
  };

  const statusColors = getStatusColor(invoiceData.status || 'draft');

  return (
    <div className="min-h-screen bg-white">
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Action Bar - Hidden on print */}
      <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href={`/invoices/${id}`}>
                <ArrowLeft2 size={16} color="currentColor" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                onClick={handlePrint}
              >
                <Printer size={14} color="currentColor" className="mr-1.5" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                onClick={handleDownloadPDF}
              >
                <DocumentDownload size={14} color="currentColor" className="mr-1.5" />
                Download PDF
              </Button>
              {invoiceData.status !== 'paid' && (
                <Button 
                  size="sm" 
                  className="rounded-full px-5 h-9" 
                  style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
                  onClick={() => setSendOpen(true)}
                >
                  <Send2 size={14} color="currentColor" className="mr-1.5" />
                  Send to Customer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SendInvoiceModal
        open={sendOpen}
        onOpenChange={(open) => {
          setSendOpen(open);
          // Refetch data when modal closes (not while open) to update status
          if (!open) {
            refetch();
          }
        }}
        invoiceId={id}
        invoiceNumber={invoiceData.invoice_number}
        customerEmail={invoiceData.customer?.email || ''}
        customerName={invoiceData.customer?.name || ''}
        total={(total || 0) / 100}
        currency={invoiceData.currency || 'GHS'}
      />

      {/* Invoice Document */}
      <div className="max-w-5xl mx-auto px-6 py-12 print:py-0 print:px-0">
        <div className="bg-white print:border-0">
          {/* Header */}
          <div className="px-12 py-10 print:px-0">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="mb-4">
                  <LogoIcon size={32} />
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Plaen</h1>
              </div>
              <div className="text-right">
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Invoice</p>
                <p className="text-2xl font-bold mb-4" style={{ color: '#2D2D2D' }}>{invoiceData.invoice_number}</p>
                <div className="flex justify-end">
                  <span 
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ 
                      backgroundColor: statusColors.bg,
                      color: statusColors.text
                    }}
                  >
                    {invoiceData.status === 'paid' && <TickCircle size={16} color="currentColor" />}
                    {invoiceData.status === 'partially_paid' && <Coin1 size={16} color="currentColor" />}
                    {(invoiceData.status === 'sent' || invoiceData.status === 'draft') && <Clock size={16} color="currentColor" />}
                    {getStatusText(invoiceData.status || 'draft')}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-8 mb-8 flex-wrap">
              <div>
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Issue Date</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatDate(invoiceData.issue_date)}</p>
              </div>
              <div className="h-px w-8 hidden sm:block" style={{ borderTop: '1px solid #E4E6EB' }}></div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Due Date</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatDate(invoiceData.due_date)}</p>
              </div>
            </div>

            {/* Bill To */}
            {customer && (
              <div className="mb-8">
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Bill To</p>
                <p className="text-base font-medium mb-1" style={{ color: '#2D2D2D' }}>{customer.name}</p>
                {customer.company && (
                  <p className="text-sm" style={{ color: '#B0B3B8' }}>{customer.company}</p>
                )}
                {customer.email && (
                  <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>{customer.email}</p>
                )}
              </div>
            )}

            {/* Line Items - Table Style */}
            <div className="mb-8 mt-12">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 mb-6" style={{ borderBottom: '1px solid #E4E6EB' }}>
                <div className="col-span-6">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Description</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Qty</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Rate</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Amount</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4">
                {lineItems.map((item) => {
                  const itemTotal = item.quantity * item.unit_price;
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <p className="text-base mb-1" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                      </div>
                      <div className="col-span-2 text-center">
                        <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.quantity}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                          {maskAmount(formatCurrency(item.unit_price, invoiceData.currency))}
                        </p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                          {maskAmount(formatCurrency(itemTotal, invoiceData.currency))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals - Clean Right-Aligned */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-3">
                <div className="grid grid-cols-2 gap-8 items-center py-2">
                  <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Subtotal</span>
                  <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                    {maskAmount(formatCurrency(subtotal, invoiceData.currency))}
                  </span>
                </div>
                
                {/* Total */}
                <div className="grid grid-cols-2 gap-8 items-center pt-4" style={{ borderTop: '1px solid #E4E6EB' }}>
                  <span className="text-lg font-semibold text-right" style={{ color: '#2D2D2D' }}>Total</span>
                  <span className="text-2xl font-bold text-right" style={{ color: '#2D2D2D' }}>
                    {maskAmount(formatCurrency(total, invoiceData.currency))}
                  </span>
                </div>

                {/* Balance Due (if different from total) */}
                {balanceDue > 0 && balanceDue !== total && (
                  <div className="grid grid-cols-2 gap-8 items-center py-2">
                    <span className="text-base text-right font-medium" style={{ color: '#DC2626' }}>Balance Due</span>
                    <span className="text-xl font-bold text-right" style={{ color: '#DC2626' }}>
                      {maskAmount(formatCurrency(balanceDue, invoiceData.currency))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pay Invoice Button - Part of PDF */}
            {invoiceData.status !== 'paid' && invoiceData.status !== 'cancelled' && balanceDue > 0 && paymentUrl && (
              <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E4E6EB' }}>
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity print:hidden"
                  style={{ backgroundColor: '#14462a' }}
                >
                  <Card size={20} color="currentColor" />
                  Pay Invoice Now
                </a>
                <p className="text-sm mt-3" style={{ color: '#B0B3B8' }}>
                  Payment link: {paymentUrl}
                </p>
              </div>
            )}

            {/* Notes */}
            {invoiceData.notes && (
              <div className="mt-8">
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Notes</p>
                <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#2D2D2D' }}>{invoiceData.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #E4E6EB' }}>
              <p className="text-sm" style={{ color: '#B0B3B8' }}>
                Thank you for your business!
              </p>
              <p className="text-sm mt-2" style={{ color: '#B0B3B8' }}>
                Powered by Plaen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
