"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
// Removed tabs to match clean single-page layout
import { 
  ArrowLeft2, 
  DocumentDownload, 
  Send2, 
  Edit2, 
  TickCircle, 
  Clock,
  Receipt21,
  Sms,
  Call,
  Building,
  Copy,
  Eye,
  More,
  Card,
  Message,
  Pause,
  Document,
  CloseCircle,
  Printer
} from "iconsax-react";
import { CedisCircle } from "@/components/icons/cedis-icon";
import Link from "next/link";
import { use, useState, useEffect, useRef } from "react";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useInvoiceDetail } from "@/hooks/useInvoicesData";
import { Skeleton } from "@/components/ui/skeleton";
import { RecordPaymentModal } from "@/components/invoices/record-payment-modal";
import { SendInvoiceModal } from "@/components/invoices/send-invoice-modal";
import { useRouter } from "next/navigation";
import { updateInvoice } from "@/hooks/useInvoicesData";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [daysOverdue, setDaysOverdue] = useState<number>(0);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { maskAmount } = useBalanceVisibility();

  // Fetch real invoice data from API
  const { invoice: invoiceData, loading, error, refetch } = useInvoiceDetail(id);

  const copyPaymentLink = () => {
    const paymentUrl = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(paymentUrl);
    setCopiedPaymentLink(true);
    setTimeout(() => setCopiedPaymentLink(false), 2000);
  };

  // Format invoice number (displays the PL- format)
  const formatInvoiceNumber = (invoiceNumber: string) => {
    return invoiceNumber;
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  // Format currency based on invoice currency - amounts from DB are in minor units (cents/pesewas)
  const formatCurrency = (amount: number, currency?: string) => {
    const curr = currency?.toUpperCase() || 'GHS';
    const symbol = curr === 'GHS' ? '₵' : curr === 'USD' ? '$' : curr;
    const majorUnits = (amount || 0) / 100;
    return `${symbol}${majorUnits.toFixed(2)}`;
  };

  // Calculate totals from line items
  const lineItems = invoiceData?.line_items || [];
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const total = invoiceData?.total || subtotal;
  const amountPaid = (total - (invoiceData?.balance_due || 0));
  const balanceDue = invoiceData?.balance_due || 0;
  const paidPercentage = total > 0 ? Math.round((amountPaid / total) * 100) : 0;

  const attachments = invoiceData?.attachments || [];

  const handlePickAttachments = () => {
    fileInputRef.current?.click();
  };

  const handleUploadAttachments = async (files: File[]) => {
    if (files.length === 0) return;
    setAttachmentError(null);
    setUploadingAttachments(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.set('entity_id', id);
          formData.set('entity_type', 'invoice');
          formData.set('file', file);

          const res = await fetch('/api/attachments', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || 'Attachment upload failed');
          }
        })
      );
      await refetch();
    } catch (err) {
      console.error('Attachment upload error:', err);
      setAttachmentError(err instanceof Error ? err.message : 'Attachment upload failed');
    } finally {
      setUploadingAttachments(false);
    }
  };

  const handleAttachmentsSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const allowed = new Set(['application/pdf', 'image/png', 'image/jpeg']);
    const maxBytes = 10 * 1024 * 1024;
    const valid: File[] = [];

    for (const f of files) {
      if (f.size > maxBytes) {
        setAttachmentError('One or more files exceed 10MB');
        continue;
      }
      if (!allowed.has(f.type)) {
        setAttachmentError('Only PDF, PNG, JPG files are supported');
        continue;
      }
      valid.push(f);
    }

    await handleUploadAttachments(valid);
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    setAttachmentError(null);
    try {
      const res = await fetch(`/api/attachments/${attachmentId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete attachment');
      }
      await refetch();
    } catch (err) {
      console.error('Attachment delete error:', err);
      setAttachmentError(err instanceof Error ? err.message : 'Failed to delete attachment');
    }
  };
  
  // Check if overdue - using useEffect to avoid hydration mismatch
  useEffect(() => {
    if (invoiceData?.due_date && balanceDue > 0) {
      const dueDate = new Date(invoiceData.due_date);
      const now = new Date();
      const overdue = now > dueDate;
      setIsOverdue(overdue);
      if (overdue) {
        setDaysOverdue(Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      }
    }
  }, [invoiceData?.due_date, balanceDue]);

  // Handle cancel invoice
  const handleCancelInvoice = async () => {
    if (!confirm("Are you sure you want to cancel this invoice? This action cannot be undone.")) {
      return;
    }

    setCancelling(true);
    try {
      const result = await updateInvoice(id, { status: "cancelled" } as Parameters<typeof updateInvoice>[1]);
      if (result.success) {
        refetch();
      } else {
        alert(result.error || "Failed to cancel invoice");
      }
    } catch (err) {
      alert("Failed to cancel invoice");
    } finally {
      setCancelling(false);
    }
  };

  // Handle send reminder
  const handleSendReminder = async () => {
    if (!invoiceData?.customer?.email) {
      alert("This customer doesn't have an email address. Please add one to send reminders.");
      return;
    }

    setSendingReminder(true);
    try {
      const response = await fetch(`/api/invoices/${id}/reminder`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`Reminder sent successfully to ${invoiceData.customer.email}`);
      } else {
        alert(data.error || data.message || 'Failed to send reminder');
      }
    } catch (err) {
      alert('Failed to send reminder. Please try again.');
    } finally {
      setSendingReminder(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sent":
        return <Send2 size={12} color="#14462a" />;
      case "finalized":
        return <TickCircle size={12} color="#14462a" />;
      case "created":
        return <Receipt21 size={12} color="#14462a" />;
      case "payment":
        return <TickCircle size={12} color="#14462a" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-white" />;
    }
  };

  const getActivityIconBackground = (type: string) => {
    switch (type) {
      case "sent":
        return 'rgba(20, 70, 42, 0.08)';
      case "finalized":
        return 'rgba(13, 148, 136, 0.08)';
      case "created":
        return 'rgba(20, 70, 42, 0.08)';
      case "payment":
        return 'rgba(20, 70, 42, 0.08)';
      default:
        return 'rgba(240, 242, 245, 0.5)';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invoiceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
          <CloseCircle size={32} color="#DC2626" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {error || 'Invoice not found'}
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          This invoice may have been deleted or you don&apos;t have permission to view it.
        </p>
        <Button asChild className="rounded-full" style={{ backgroundColor: '#14462a' }}>
          <Link href="/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  // Build activity from allocations and created date
  const activity = [
    ...(invoiceData.allocations || []).map(alloc => ({
      date: alloc.payment?.payment_date ? formatDate(alloc.payment.payment_date) : 'Unknown',
      action: `Payment of ${formatCurrency(alloc.amount, invoiceData.currency)} received`,
      description: alloc.payment?.reference ? `Ref: ${alloc.payment.reference}` : '',
      type: 'payment'
    })),
    {
      date: formatDate(invoiceData.created_at),
      action: 'Invoice was created',
      description: '',
      type: 'created'
    }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href="/invoices">
                <ArrowLeft2 size={16} />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 600 }}>
                {formatInvoiceNumber(invoiceData.invoice_number)}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                  {maskAmount(formatCurrency(balanceDue, invoiceData.currency))} due
                </p>
                {amountPaid > 0 && (
                  <>
                    <span style={{ color: '#B0B3B8' }}>•</span>
                    <p className="text-sm" style={{ color: '#B0B3B8' }}>
                      {maskAmount(formatCurrency(amountPaid, invoiceData.currency))} paid
                    </p>
                  </>
                )}
                {isOverdue && (
                  <>
                    <span style={{ color: '#B0B3B8' }}>•</span>
                    <p className="text-sm" style={{ color: '#DC2626', fontWeight: 500 }}>
                      {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Action Buttons */}
          <div className="flex items-center gap-2">
            {balanceDue > 0 && (
              <Button 
                size="sm" 
                className="rounded-full px-5 h-9" 
                style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
                onClick={() => setShowPaymentModal(true)}
              >
                <CedisCircle size={14} color="currentColor" className="mr-1.5" />
                Record Payment
              </Button>
            )}
            {isOverdue && (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]" 
                style={{ borderColor: '#DC2626', color: '#DC2626', fontWeight: 400 }}
                onClick={handleSendReminder}
                disabled={sendingReminder}
              >
                <Sms size={14} color="currentColor" className="mr-1.5" />
                {sendingReminder ? 'Sending...' : 'Send Reminder'}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]" 
              style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
              onClick={() => setShowSendModal(true)}
            >
              <Send2 size={14} color="currentColor" className="mr-1.5" />
              Send Invoice
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]" 
              style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
              onClick={copyPaymentLink}
            >
              <Copy size={14} color="currentColor" className="mr-1.5" />
              {copiedPaymentLink ? 'Copied!' : 'Copy Payment Link'}
            </Button>
          </div>
        </div>

        {/* Actions bar - tab style with gray background */}
        <div className="rounded-full px-3 py-2 flex items-center gap-2 divide-x divide-[#E4E6EB]" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 h-9 transition-all" 
            style={{ 
              backgroundColor: activeAction === 'preview' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
              color: activeAction === 'preview' ? '#14462a' : '#2D2D2D', 
              fontWeight: activeAction === 'preview' ? 500 : 400 
            }}
            onMouseEnter={(e) => {
              if (activeAction !== 'preview') {
                e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                e.currentTarget.style.color = '#14462a';
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== 'preview') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D2D2D';
              }
            }}
            onClick={() => setActiveAction('preview')}
            asChild
          >
            <Link href={`/invoices/${id}/preview`}>
              <Eye size={14} color="currentColor" className="mr-1.5" />
              Preview
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 h-9 transition-all" 
            style={{ 
              backgroundColor: activeAction === 'edit' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
              color: activeAction === 'edit' ? '#14462a' : '#2D2D2D', 
              fontWeight: activeAction === 'edit' ? 500 : 400 
            }}
            onMouseEnter={(e) => {
              if (activeAction !== 'edit') {
                e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                e.currentTarget.style.color = '#14462a';
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== 'edit') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D2D2D';
              }
            }}
            onClick={() => setActiveAction('edit')}
            asChild
          >
            <Link href={`/invoices/${id}/edit`}>
              <Edit2 size={14} color="currentColor" className="mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 h-9 transition-all" 
            style={{ 
              backgroundColor: activeAction === 'download' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
              color: activeAction === 'download' ? '#14462a' : '#2D2D2D', 
              fontWeight: activeAction === 'download' ? 500 : 400 
            }}
            onMouseEnter={(e) => {
              if (activeAction !== 'download') {
                e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                e.currentTarget.style.color = '#14462a';
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== 'download') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D2D2D';
              }
            }}
            onClick={() => {
              setActiveAction('download');
              router.push(`/invoices/${id}/preview`);
            }}
          >
            <DocumentDownload size={14} color="currentColor" className="mr-1.5" />
            Download PDF
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 h-9 transition-all" 
            style={{ 
              backgroundColor: activeAction === 'attachment' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
              color: activeAction === 'attachment' ? '#14462a' : '#2D2D2D', 
              fontWeight: activeAction === 'attachment' ? 500 : 400 
            }}
            onMouseEnter={(e) => {
              if (activeAction !== 'attachment') {
                e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                e.currentTarget.style.color = '#14462a';
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== 'attachment') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D2D2D';
              }
            }}
            onClick={() => setActiveAction('attachment')}
          >
            <Document size={14} color="currentColor" className="mr-1.5" />
            Add attachment
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-5 h-9 transition-all" 
            style={{ 
              backgroundColor: activeAction === 'note' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
              color: activeAction === 'note' ? '#14462a' : '#2D2D2D', 
              fontWeight: activeAction === 'note' ? 500 : 400 
            }}
            onMouseEnter={(e) => {
              if (activeAction !== 'note') {
                e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                e.currentTarget.style.color = '#14462a';
              }
            }}
            onMouseLeave={(e) => {
              if (activeAction !== 'note') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D2D2D';
              }
            }}
            onClick={() => setActiveAction('note')}
          >
            <Message size={14} color="currentColor" className="mr-1.5" />
            Add note
          </Button>
          <DropdownMenu onOpenChange={(open) => setActiveAction(open ? 'more' : null)}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-5 h-9 transition-all" 
                style={{ 
                  backgroundColor: activeAction === 'more' ? 'rgba(20, 70, 42, 0.08)' : 'transparent',
                  color: activeAction === 'more' ? '#14462a' : '#2D2D2D', 
                  fontWeight: activeAction === 'more' ? 500 : 400 
                }}
                onMouseEnter={(e) => {
                  if (activeAction !== 'more') {
                    e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                    e.currentTarget.style.color = '#14462a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeAction !== 'more') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#2D2D2D';
                  }
                }}
              >
                <More size={14} color="currentColor" className="mr-1.5" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <Document size={16} color="#14462a" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <Printer size={16} color="#14462a" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
                >
                  <Eye size={16} color="#14462a" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>View public page</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50"
                onClick={handleCancelInvoice}
                disabled={cancelling || invoiceData.status === 'cancelled' || invoiceData.status === 'paid'}
              >
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                >
                  <CloseCircle size={16} color="#DC2626" />
                </div>
                <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>
                  {cancelling ? "Cancelling..." : "Cancel invoice"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Payment Status Bar (for partially paid/pending) */}
      {invoiceData.status !== "paid" && amountPaid > 0 && (
        <div className="rounded-xl p-4" style={{ border: '1px solid #E4E6EB', backgroundColor: 'rgba(240, 242, 245, 0.5)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                Payment Progress: {paidPercentage}%
              </p>
              <p className="text-sm" style={{ color: '#B0B3B8' }}>
                {formatCurrency(amountPaid, invoiceData.currency)} paid of {formatCurrency(total, invoiceData.currency)} total
              </p>
            </div>
            <Button 
              size="sm" 
              className="rounded-full px-5 py-2 h-auto" 
              style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
              onClick={() => setShowPaymentModal(true)}
            >
              <CedisCircle size={14} color="currentColor" className="mr-1.5" />
              Record Payment
            </Button>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E4E6EB' }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${paidPercentage}%`, backgroundColor: '#14462a' }} />
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-6">
        <h2 className="text-base" style={{ color: '#2D2D2D', fontWeight: 600 }}>Summary</h2>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Invoice ID</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{formatInvoiceNumber(invoiceData.invoice_number)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Issue Date</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{formatDate(invoiceData.issue_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Due Date</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{formatDate(invoiceData.due_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Status</span>
                <Badge 
                  variant="outline" 
                  className="rounded-full px-3"
                  style={{ 
                    backgroundColor: invoiceData.status === 'paid' ? 'rgba(13, 148, 136, 0.1)' : 
                                    invoiceData.status === 'overdue' ? 'rgba(220, 38, 38, 0.1)' : 
                                    'rgba(20, 70, 42, 0.08)',
                    color: invoiceData.status === 'paid' ? '#14462a' : 
                           invoiceData.status === 'overdue' ? '#DC2626' : '#14462a',
                    borderColor: 'transparent'
                  }}
                >
                  {invoiceData.status ? invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1).replace('_', ' ') : 'Draft'}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {invoiceData.customer && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#B0B3B8' }}>Billed to</span>
                    <span className="text-sm" style={{ color: '#14462a', fontWeight: 500 }}>{invoiceData.customer.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#B0B3B8' }}>Client Name</span>
                    <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoiceData.customer.name}</span>
                  </div>
                  {invoiceData.customer.company && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#B0B3B8' }}>Company</span>
                      <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoiceData.customer.company}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Currency</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoiceData.currency?.toUpperCase() || 'GHS'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8 mt-12">
          <h2 className="text-lg mb-6" style={{ color: '#2D2D2D', fontWeight: 600 }}>Items</h2>
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
            {lineItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No line items</p>
            ) : (
              lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <p className="text-base mb-1" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.quantity}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(formatCurrency(item.unit_price, invoiceData.currency))}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(formatCurrency(item.total, invoiceData.currency))}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals - Clean Right-Aligned */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm space-y-3">
            <div className="grid grid-cols-2 gap-8 items-center py-2">
              <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Subtotal</span>
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(formatCurrency(subtotal, invoiceData.currency))}</span>
            </div>
            <div className="grid grid-cols-2 gap-8 items-center py-2">
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>Total</span>
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(formatCurrency(total, invoiceData.currency))}</span>
            </div>
            {amountPaid > 0 && (
              <div className="grid grid-cols-2 gap-8 items-center py-2">
                <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Amount Paid</span>
                <span className="text-base text-right" style={{ color: '#14462a', fontWeight: 500 }}>{maskAmount(`-${formatCurrency(amountPaid, invoiceData.currency)}`)}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-8 items-center pt-4">
              <span className="text-base font-semibold text-right" style={{ color: '#2D2D2D' }}>Balance Due</span>
              <span className="text-base font-bold text-right" style={{ color: balanceDue > 0 ? '#2D2D2D' : '#14462a' }}>{maskAmount(formatCurrency(balanceDue, invoiceData.currency))}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {invoiceData.allocations && invoiceData.allocations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg mb-4" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment History</h2>
            <div className="space-y-4">
              {invoiceData.allocations.map((allocation) => (
                <div key={allocation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <TickCircle size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>
                        {allocation.payment?.payment_method === 'mobile_money' && 'Mobile Money'}
                        {allocation.payment?.payment_method === 'bank_transfer' && 'Bank Transfer'}
                        {allocation.payment?.payment_method === 'card' && 'Card Payment'}
                        {allocation.payment?.payment_method === 'cash' && 'Cash'}
                        {!allocation.payment?.payment_method && 'Payment'}
                      </p>
                      <p className="text-xs" style={{ color: '#B0B3B8' }}>
                        {allocation.payment?.reference && `Ref: ${allocation.payment.reference} • `}
                        {allocation.payment?.payment_date && formatDate(allocation.payment.payment_date)}
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-medium" style={{ color: '#14462a' }}>{maskAmount(formatCurrency(allocation.amount, invoiceData.currency))}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Attachments</h2>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleAttachmentsSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handlePickAttachments}
                disabled={uploadingAttachments}
              >
                {uploadingAttachments ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>

          {attachmentError && (
            <p className="text-xs mb-3" style={{ color: '#DC2626' }}>
              {attachmentError}
            </p>
          )}

          {attachments.length === 0 ? (
            <p className="text-sm" style={{ color: '#B0B3B8' }}>No attachments</p>
          ) : (
            <div className="space-y-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-xl border border-[#E4E6EB] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2D2D2D] truncate">{att.file_name}</p>
                    <p className="text-xs text-[#B0B3B8]">
                      {att.mime_type || 'file'}
                      {att.file_size ? ` • ${(att.file_size / (1024 * 1024)).toFixed(2)} MB` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {att.download_url ? (
                      <a
                        href={att.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm"
                        style={{ color: '#14462a', fontWeight: 500 }}
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-[#B0B3B8]">Unavailable</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteAttachment(att.id)}
                      className="text-sm"
                      style={{ color: '#DC2626', fontWeight: 500 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {invoiceData.notes && (
          <div className="mb-12">
            <h2 className="text-lg mb-4" style={{ color: '#2D2D2D', fontWeight: 600 }}>Notes</h2>
            <p className="text-sm" style={{ color: '#2D2D2D', lineHeight: '1.6' }}>
              {invoiceData.notes}
            </p>
          </div>
        )}

        {/* Activity */}
        <div>
          <h2 className="text-lg mb-6" style={{ color: '#2D2D2D', fontWeight: 600 }}>Activity</h2>
          <div>
            <div className="space-y-6">
              {activity.map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  {index !== activity.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px" style={{ backgroundColor: '#E4E6EB' }} />
                  )}
                  <div className="shrink-0 mt-0.5">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: getActivityIconBackground(item.type) }}>
                      {getActivityIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm mb-0.5" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                      {item.action}
                    </p>
                    <p className="text-xs" style={{ color: '#B0B3B8' }}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        invoiceId={id}
        invoiceNumber={invoiceData.invoice_number}
        balanceDue={balanceDue}
        currency={invoiceData.currency || 'GHS'}
        onSuccess={() => refetch()}
      />

      {/* Send Invoice Modal */}
      <SendInvoiceModal
        open={showSendModal}
        onOpenChange={(open) => {
          setShowSendModal(open);
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
    </div>
  );
}