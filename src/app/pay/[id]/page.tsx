/**
 * Public Payment Page
 * Responsive layout with mobile-first design
 * Mobile: Single column with collapsible invoice details
 * Desktop: Two-column layout with all PRD features
 */

"use client";

import { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayMethods } from "@/components/pay/PayMethods";
import { Receipt } from "@/components/pay/Receipt";
import { 
  Loader2, 
  AlertCircle, 
  WifiOff, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Download,
  FileText,
  Paperclip,
  AlertTriangle
} from "lucide-react";
import { usePayState } from "@/hooks/usePayState";
import { paymentAPI, type Invoice } from "@/lib/api/payments";
import { telemetry } from "@/lib/telemetry";
import Image from "next/image";
import "@/styles/typography.css";

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: invoiceId } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState('');
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  // Format date as Mon DD, YYYY (e.g., Dec 31, 2024)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format invoice number (e.g., INV-2024-001 becomes #2024001)
  const formatInvoiceNumber = (invoiceNumber: string) => {
    // Extract year and number parts
    const parts = invoiceNumber.split('-');
    if (parts.length === 3) {
      return `#${parts[1]}${parts[2]}`;
    }
    // Fallback to original if format doesn't match
    return invoiceNumber;
  };

  const {
    state,
    selectMethod,
    setAmount: setPayAmount,
    initiatePayment,
    retryPayment,
    isLoading,
    canPay,
  } = usePayState(invoiceId, amount, (receiptData) => {
    telemetry.receiptViewed(receiptData.transactionId);
  });

  // Fetch invoice on mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await paymentAPI.getInvoice(invoiceId);
        setInvoice(data);
        setAmount(data.totals.balance_due);
        setPayAmount(data.totals.balance_due);
        setAmountInput(data.totals.balance_due.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }));
        
        telemetry.pageView(`/pay/${invoiceId}`, {
          invoice_number: data.invoice_number,
          balance_due: data.totals.balance_due,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ opacity: 0.5 }} />
          <p className="text-body text-subtle">Loading invoice...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ opacity: 0.5 }} />
          <h1 className="text-h3 mb-2">Invoice Not Found</h1>
          <p className="text-body text-subtle mb-6">
            {error || 'This invoice could not be found or may have been deleted.'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Success state - show receipt
  if (state.status === 'success' && state.receiptData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Receipt data={state.receiptData} />
        </div>
      </div>
    );
  }

  // Already paid state
  if (state.status === 'already_paid') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: '#2D2D2D' }} />
          <h1 className="text-h3 mb-2">Invoice Already Paid</h1>
          <p className="text-body text-subtle">
            This invoice has been fully paid. Thank you!
          </p>
        </div>
      </div>
    );
  }

  // Expired state
  if (state.status === 'expired') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <Clock className="h-12 w-12 mx-auto mb-4" style={{ opacity: 0.5 }} />
          <h1 className="text-h3 mb-2">Invoice Expired</h1>
          <p className="text-body text-subtle mb-6">
            This invoice has expired and is no longer accepting payments.
          </p>
          <p className="text-body-sm text-subtle">
            Please contact {invoice.from.business_name} for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Offline state
  if (state.status === 'offline') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <WifiOff className="h-12 w-12 mx-auto mb-4" style={{ opacity: 0.5 }} />
          <h1 className="text-h3 mb-2">No Internet Connection</h1>
          <p className="text-body text-subtle mb-6">
            Please check your internet connection and try again.
          </p>
          <Button onClick={retryPayment}>Try Again</Button>
        </div>
      </div>
    );
  }

  const handlePaymentInitiate = async (methodData: any) => {
    await initiatePayment();
  };

  const handleAmountChange = (value: string) => {
    // Allow only digits and a single decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const sanitized = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : cleanValue;
    
    // Limit decimal places to 2
    let finalValue = sanitized;
    if (sanitized.includes('.')) {
      const [whole, decimal] = sanitized.split('.');
      finalValue = whole + '.' + decimal.slice(0, 2);
    }
    
    setAmountInput(finalValue);
    const numValue = parseFloat(finalValue) || 0;
    setAmount(numValue);
    setPayAmount(numValue);
  };

  const handleAmountBlur = () => {
    // Format on blur for display
    if (amount > 0) {
      const formatted = amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
      setAmountInput(formatted);
    }
  };

  const handleAmountFocus = () => {
    // Remove formatting on focus for easy editing
    if (amount > 0) {
      setAmountInput(amount.toString());
    } else {
      setAmountInput('');
    }
  };

  // Extract optional features for conditional rendering
  const invoiceNotes = invoice.notes;
  const attachments = invoice.attachments || [];
  const paymentHistory = invoice.payment_history || [];

  // Calculate if invoice is overdue
  const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';
  const daysOverdue = isOverdue 
    ? Math.floor((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile: max-w-lg, Desktop: max-w-7xl with grid */}
      <div className="max-w-lg lg:max-w-7xl mx-auto">
        
        {/* Desktop: Two-column grid, Mobile: Single column */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:p-8">
          
          {/* Left Column - Invoice Details (2/3 on desktop, full width on mobile) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header - Sticky on both mobile and desktop */}
            <div className="px-4 lg:px-0 sticky top-0 z-10 bg-white" style={{ paddingTop: '18px', paddingBottom: '12px' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H12V12H3V3Z" fill="#1877F2"/>
                      <path d="M14 3H21L17.5 12H14V3Z" fill="#1877F2"/>
                      <path d="M12 14H21V21H12V14Z" fill="#1877F2"/>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold mb-1" style={{ color: '#2D2D2D' }}>{invoice.from.business_name}</h1>
                  <p className="text-sm" style={{ color: '#B0B3B8' }}>{invoice.from.email}</p>
                </div>
                
                {/* Desktop: Download PDF button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden lg:flex items-center gap-2"
                  onClick={() => {/* TODO: Download PDF */}}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>

              {/* Status Badges - Desktop only */}
              <div className="hidden lg:flex gap-2 mt-4">
                {isOverdue && (
                  <span 
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Overdue
                  </span>
                )}
                {invoice.status === 'partially_paid' && (
                  <span 
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#FFF4E6', color: '#F59E0B' }}
                  >
                    <Clock className="h-4 w-4" />
                    Partially Paid
                  </span>
                )}
                {invoice.status === 'paid' && (
                  <span 
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#E8F9F1', color: '#059669' }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Paid
                  </span>
                )}
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="px-4 lg:px-0 bg-white" style={{ paddingBottom: '12px' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Invoice</p>
                  <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatInvoiceNumber(invoice.invoice_number)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Due Date</p>
                  <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatDate(invoice.due_date)}</p>
                  {/* Desktop: Show days overdue */}
                  {isOverdue && (
                    <p className="text-sm mt-1 hidden lg:block" style={{ color: '#DC2626' }}>
                      {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Bill To</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{invoice.bill_to.name}</p>
                {invoice.bill_to.company && (
                  <p className="text-base" style={{ color: '#B0B3B8' }}>{invoice.bill_to.company}</p>
                )}
              </div>

              {/* Mobile: Amount Due (prominent) */}
              <div className="py-4 lg:hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base" style={{ color: '#B0B3B8' }}>Amount Due</span>
                  <span className="text-2xl font-bold" style={{ color: '#2D2D2D' }}>
                    ₵{invoice.totals.balance_due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {invoice.totals.amount_paid > 0 && (
                  <p className="text-sm text-right" style={{ color: '#B0B3B8' }}>
                    ₵{invoice.totals.amount_paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} already paid
                  </p>
                )}
              </div>

              {/* Mobile: Divider */}
              <div className="h-px lg:hidden" style={{ backgroundColor: '#E4E6EB' }}></div>

              {/* Mobile: View Invoice Details Button */}
              <button
                onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
                className="w-full py-4 flex items-center justify-between hover:opacity-70 transition-opacity lg:hidden"
              >
                <div className="flex items-center gap-3">
                  <Image 
                    src="/icons/mobile.png" 
                    alt="Invoice" 
                    width={32} 
                    height={32}
                    className="opacity-100"
                  />
                  <span className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                    {showInvoiceDetails ? 'Hide' : 'View'} Invoice Details
                  </span>
                </div>
                <ChevronRight 
                  className="h-5 w-5 transition-transform" 
                  style={{ 
                    color: '#B0B3B8',
                    transform: showInvoiceDetails ? 'rotate(90deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>

              {/* Expandable Invoice Details - Mobile: conditional, Desktop: always shown */}
              <div className={`${showInvoiceDetails ? 'block' : 'hidden'} lg:block`}>
                <div className="mt-4 pt-4 border-t lg:border-t-0 lg:mt-0 lg:pt-0" style={{ borderColor: '#E4E6EB' }}>
                  {/* Line Items - Table Style */}
                  <div className="mb-8 lg:mt-12">
                    {/* Table Header - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 pb-3 mb-6" style={{ borderBottom: '1px solid #E4E6EB' }}>
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

                    {/* Mobile: Simple List | Desktop: Table Rows */}
                    <div className="space-y-4">
                      {invoice.items.map((item, index) => (
                        <div key={index}>
                          {/* Mobile View */}
                          <div className="flex justify-between items-start gap-3 lg:hidden">
                            <div className="flex-1 min-w-0">
                              <p className="text-base mb-0.5" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                              <p className="text-sm" style={{ color: '#B0B3B8' }}>
                                Qty: {item.quantity} × ₵{item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-base whitespace-nowrap" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                              ₵{(item.quantity * item.unit_price).toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Desktop Table View */}
                          <div className="hidden lg:grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                              <p className="text-base mb-1" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                              {item.details && (
                                <p className="text-sm" style={{ color: '#B0B3B8' }}>{item.details}</p>
                              )}
                            </div>
                            <div className="col-span-2 text-center">
                              <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.quantity}</p>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{item.unit_price.toFixed(2)}</p>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{(item.quantity * item.unit_price).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals Breakdown */}
                  <div>
                    {/* Desktop: Right-aligned grid | Mobile: Full width flex */}
                    <div className="lg:flex lg:justify-end lg:mb-8">
                      <div className="w-full lg:max-w-sm space-y-3">
                        <div className="grid grid-cols-2 gap-8 items-center py-2">
                          <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Subtotal</span>
                          <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{invoice.totals.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        {invoice.totals.tax > 0 && (
                          <div className="grid grid-cols-2 gap-8 items-center py-2">
                            <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Tax</span>
                            <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{invoice.totals.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        {invoice.totals.discount > 0 && (
                          <div className="grid grid-cols-2 gap-8 items-center py-2">
                            <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Discount</span>
                            <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>-₵{invoice.totals.discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        
                        {/* Total */}
                        <div className="grid grid-cols-2 gap-8 items-center pt-4">
                          <span className="text-lg font-semibold text-right" style={{ color: '#2D2D2D' }}>Total</span>
                          <span className="text-2xl font-bold text-right" style={{ color: '#2D2D2D' }}>₵{invoice.totals.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        {invoice.totals.amount_paid > 0 && (
                          <>
                            <div className="grid grid-cols-2 gap-8 items-center py-2 mt-3">
                              <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Amount Paid</span>
                              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{invoice.totals.amount_paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            
                            {/* Balance Due */}
                            <div className="grid grid-cols-2 gap-8 items-center pt-4">
                              <span className="text-lg font-semibold text-right" style={{ color: '#2D2D2D' }}>Balance Due</span>
                              <span className="text-2xl font-bold text-right" style={{ color: '#F59E0B' }}>₵{invoice.totals.balance_due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Notes - Desktop only */}
            {invoiceNotes && (
              <div className="hidden lg:block bg-white" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#B0B3B8' }} />
                  <div>
                    <h3 className="text-base font-semibold mb-2" style={{ color: '#2D2D2D' }}>Invoice Notes</h3>
                    <p className="text-base leading-relaxed" style={{ color: '#2D2D2D' }}>{invoiceNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments - Desktop only */}
            {attachments.length > 0 && (
              <div className="hidden lg:block bg-white" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-5 w-5" style={{ color: '#B0B3B8' }} />
                  <h3 className="text-base font-semibold" style={{ color: '#2D2D2D' }}>Attachments</h3>
                  <span className="ml-auto text-sm" style={{ color: '#B0B3B8' }}>{attachments.length} {attachments.length === 1 ? 'file' : 'files'}</span>
                </div>
                
                {/* Divider */}
                <div className="h-px mb-4" style={{ borderTop: '1px solid #E4E6EB' }}></div>
                
                <div className="space-y-3">
                  {attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.url || '#'}
                      download
                      className="w-full flex items-center justify-between py-3 hover:opacity-70 transition-opacity group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: '#B0B3B8' }} />
                        <div className="text-left">
                          <p className="text-base group-hover:text-[#1877F2] transition-colors" style={{ color: '#2D2D2D' }}>{file.name}</p>
                          <p className="text-sm" style={{ color: '#B0B3B8' }}>{file.size}</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#1877F2' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Payment History - Desktop only */}
            {paymentHistory.length > 0 && (
              <div className="hidden lg:block bg-white" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
                <h3 className="text-base font-semibold mb-4" style={{ color: '#2D2D2D' }}>Payment History</h3>
                
                {/* Divider */}
                <div className="h-px mb-4" style={{ borderTop: '1px solid #E4E6EB' }}></div>
                
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="pb-4 border-b last:border-b-0 last:pb-0" style={{ borderColor: '#E4E6EB' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-base font-medium mb-1" style={{ color: '#2D2D2D' }}>{payment.method}</p>
                          <p className="text-sm" style={{ color: '#B0B3B8' }}>{formatDate(payment.date)}</p>
                          {payment.reference && (
                            <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Ref: {payment.reference}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold mb-1" style={{ color: '#2D2D2D' }}>₵{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <span 
                            className="inline-block text-sm px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: payment.status === 'completed' || payment.status === 'Confirmed' ? '#E8F9F1' : '#FFF4E6',
                              color: payment.status === 'completed' || payment.status === 'Confirmed' ? '#059669' : '#F59E0B'
                            }}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Payment Form (1/3 on desktop, full width on mobile) */}
          <div className="lg:col-span-1">
            <div className="px-4 lg:px-0 lg:sticky lg:top-6 bg-white font-outfit" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
              <h2 className="pay-page-header mb-6 font-outfit">Make Payment</h2>

              {state.error && (
                <div className="mb-6 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
                  <AlertCircle className="h-5 w-5 shrink-0" style={{ color: '#2D2D2D' }} />
                  <div>
                    <p className="text-body-sm text-emphasis mb-1">Payment Failed</p>
                    <p className="text-body-sm text-[#B0B3B8]">{state.error}</p>
                    {state.status === 'declined' && (
                      <Button variant="ghost" size="sm" className="mt-2" onClick={retryPayment}>
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {state.status === 'pending' && (
                <div className="mb-6 p-6 text-center rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-body text-emphasis mb-2">Processing Payment</p>
                  <p className="text-body-sm text-[#B0B3B8]">
                    Please wait while we confirm your payment. This may take a moment.
                  </p>
                </div>
              )}

              {state.status !== 'pending' && (
                <>
                  {/* Amount */}
                  <div className="mb-6">
                    <Label className="text-label mb-2 block">Amount to Pay</Label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 pay-amount-sm font-outfit" style={{ fontWeight: 700, color: '#2D2D2D', transform: 'translateY(-47%)' }}>₵</span>
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="border h-14 pl-10 pay-amount-sm font-outfit rounded-full"
                        style={{ borderColor: '#E4E6EB', fontWeight: 700 }}
                        value={amountInput}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        onFocus={handleAmountFocus}
                        onBlur={handleAmountBlur}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-body-sm text-[#B0B3B8]">
                        Balance due: ₵{invoice.totals.balance_due.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                      <button
                        onClick={() => handleAmountChange(invoice.totals.balance_due.toString())}
                        className="text-body-sm font-medium hover:underline"
                        style={{ color: '#1877F2' }}
                      >
                        Pay Full Amount
                      </button>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <PayMethods
                    selectedMethod={state.method}
                    onSelectMethod={selectMethod}
                    amount={amount}
                    onInitiatePayment={handlePaymentInitiate}
                    isProcessing={isLoading}
                    availableMethods={invoice.payment_methods}
                    invoiceNumber={invoice.invoice_number}
                  />
                </>
              )}

              {/* Footer - Inside sticky payment section on desktop */}
              <div className="hidden lg:block mt-8">
                <div className="text-center">
                  <p className="text-body-sm mb-2 text-[#B0B3B8]">
                    Powered by <span className="font-medium" style={{ color: '#2D2D2D' }}>Plaen Pay</span>
                  </p>
                  <p className="text-body-sm text-[#B0B3B8]">
                    Questions? Contact <a href="mailto:info@plaen.tech" className="hover:underline" style={{ color: '#1877F2' }}>Plaen</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer - Mobile only */}
            <div className="px-4 lg:hidden bg-white" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
              <div className="text-center">
                <p className="text-body-sm mb-2 text-[#B0B3B8]">
                  Powered by <span className="font-medium" style={{ color: '#2D2D2D' }}>Plaen Pay</span>
                </p>
                <p className="text-body-sm text-[#B0B3B8]">
                  Questions? Contact <a href={`mailto:${invoice.from.email}`} className="hover:underline" style={{ color: '#1877F2' }}>{invoice.from.business_name}</a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
