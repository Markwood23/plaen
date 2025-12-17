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
  DollarSquare, 
  TickSquare, 
  Clock,
  DocumentText,
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
  CloseSquare,
  Printer
} from "iconsax-react";
import Link from "next/link";
import { use, useState } from "react";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const copyPaymentLink = () => {
    const paymentUrl = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(paymentUrl);
    setCopiedPaymentLink(true);
    setTimeout(() => setCopiedPaymentLink(false), 2000);
  };

  // Format invoice number (e.g., INV-2024-001 becomes #2024001)
  const formatInvoiceNumber = (invoiceNumber: string) => {
    const parts = invoiceNumber.split('-');
    if (parts.length === 3) {
      return `#${parts[1]}${parts[2]}`;
    }
    return invoiceNumber;
  };

  // Mock data - will be replaced with API call
  const invoice = {
    id: id,
    invoiceNumber: "INV-2024-001",
    issueDate: "Mar 21, 2023, 3:12 AM",
    dueDate: "June 24, 11:59 PM",
    paymentTerms: "Net 30",
    status: "Waiting Payment",
    
    // From
    from: {
      businessName: "Your Business Name",
      email: "hello@yourbusiness.com",
      phone: "+233 24 000 0000",
      address: "123 Business Street\nAccra, Ghana",
      taxId: "TIN-123456789",
      website: "www.yourbusiness.com"
    },
    
    // Bill To
    billTo: {
      name: "Frank Murlo",
      email: "aditya@gmail.com",
      phone: "+233 24 123 4567",
      company: "Murlo Industries",
      address: "456 Client Avenue\nAccra, Ghana",
    },
    
    // Currency
    primaryCurrency: "ghs",
    secondaryCurrency: "",
    exchangeRate: "",
    
    // Line Items
    items: [
      {
        id: 1,
        description: "Website Design & Development",
        details: "Complete website design and development service including responsive design, 5 pages, SEO optimization, and 3 months support",
        quantity: 1,
        unitPrice: 2500.00,
        tax: 15,
        discount: 0,
        discountType: "percent"
      },
      {
        id: 2,
        description: "Logo Design Package",
        details: "Professional logo design with 3 revisions, includes vector files, brand guidelines, and multiple format exports",
        quantity: 2,
        unitPrice: 500.00,
        tax: 15,
        discount: 10,
        discountType: "percent"
      },
    ],
    
    // Payment Methods
    paymentMethods: ["mtn", "bank", "card"],
    
    // Notes
    notes: "Thank you for your business! Payment is due within 30 days. For questions, contact us at hello@yourbusiness.com",
    termsAndConditions: "1. Payment is due within 30 days of invoice date\n2. Late payments may incur additional fees\n3. All prices are in Ghana Cedis (GHS)\n4. Goods remain property of seller until full payment is received",
    
    // Payments
    payments: [] as Array<{ id: string; rail: string; reference: string; amount: number; date: string }>,
    // Attachments
    attachments: [
      { id: 'a1', name: 'Invoice_20230602', size: '2.2mb', date: 'Tue, 23 June 2023' },
      { id: 'a2', name: 'Invoice_20230602', size: '2.2mb', date: 'Tue, 23 June 2023' },
      { id: 'a3', name: 'Invoice_20230602', size: '2.2mb', date: 'Tue, 23 June 2023' },
    ],
    
    // Activity
    activity: [
      { date: "Mar 21, 2023, 3:12 AM", action: "Invoice was sent to aditya@gmail.com", description: "", type: "sent" },
      { date: "Mar 21, 2023, 3:12 AM", action: "Invoice was finalized", description: "", type: "finalized" },
      { date: "Mar 21, 2023, 3:12 AM", action: "Invoice payment page was created", description: "", type: "created" },
    ],
  };

  // Calculate totals
  const calculateItemTotal = (item: typeof invoice.items[0]) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * item.tax) / 100;
    const discountAmount = item.discountType === "percent" 
      ? (subtotal * item.discount) / 100 
      : item.discount;
    return subtotal + taxAmount - discountAmount;
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = invoice.items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
  const totalDiscount = invoice.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (item.discountType === "percent" 
      ? (itemSubtotal * item.discount) / 100 
      : item.discount);
  }, 0);
  const total = subtotal + totalTax - totalDiscount;
  const amountPaid = invoice.payments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);
  const balanceDue = total - amountPaid;
  const paidPercentage = amountPaid > 0 ? Math.round((amountPaid / total) * 100) : 0;
  
  // Check if overdue
  const dueDate = new Date(invoice.dueDate);
  const now = new Date();
  const isOverdue = now > dueDate && balanceDue > 0;
  const daysOverdue = isOverdue ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sent":
        return <Send2 size={12} color="#14462a" />;
      case "finalized":
        return <TickSquare size={12} color="#059669" />;
      case "created":
        return <DocumentText size={12} color="#14462a" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-white" />;
    }
  };

  const getActivityIconBackground = (type: string) => {
    switch (type) {
      case "sent":
        return 'rgba(20, 70, 42, 0.08)'; // Blue
      case "finalized":
        return 'rgba(5, 150, 105, 0.08)'; // Green
      case "created":
        return 'rgba(20, 70, 42, 0.08)'; // Purple
      default:
        return 'rgba(240, 242, 245, 0.5)';
    }
  };

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
                {formatInvoiceNumber(invoice.invoiceNumber)}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                  ₵{balanceDue.toFixed(2)} due
                </p>
                {amountPaid > 0 && (
                  <>
                    <span style={{ color: '#B0B3B8' }}>•</span>
                    <p className="text-sm" style={{ color: '#B0B3B8' }}>
                      ₵{amountPaid.toFixed(2)} paid
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
              >
                <DollarSquare size={14} className="mr-1.5" />
                Record Payment
              </Button>
            )}
            {isOverdue && (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]" 
                style={{ borderColor: '#DC2626', color: '#DC2626', fontWeight: 400 }}
              >
                <Sms size={14} className="mr-1.5" />
                Send Reminder
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]" 
              style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
              onClick={copyPaymentLink}
            >
              <Copy size={14} className="mr-1.5" />
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
              <Eye size={14} className="mr-1.5" />
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
          >
            <Edit2 size={14} className="mr-1.5" />
            Edit
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
            onClick={() => setActiveAction('download')}
          >
            <DocumentDownload size={14} className="mr-1.5" />
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
            <Document size={14} className="mr-1.5" />
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
            <Message size={14} className="mr-1.5" />
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
                <More size={14} className="mr-1.5" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <Document size={16} color="#14462a" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <Printer size={16} color="#14462a" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(5, 150, 105, 0.08)' }}
                >
                  <Eye size={16} color="#059669" />
                </div>
                <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>View public page</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                >
                  <CloseSquare size={16} color="#DC2626" />
                </div>
                <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>Cancel invoice</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Payment Status Bar (for partially paid/pending) */}
      {invoice.status !== "Paid" && amountPaid > 0 && (
        <div className="rounded-xl p-4" style={{ border: '1px solid #E4E6EB', backgroundColor: 'rgba(240, 242, 245, 0.5)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                Payment Progress: {paidPercentage}%
              </p>
              <p className="text-sm" style={{ color: '#B0B3B8' }}>
                ₵{amountPaid.toFixed(2)} paid of ₵{total.toFixed(2)} total
              </p>
            </div>
            <Button size="sm" className="rounded-full px-5 py-2 h-auto" style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}>
              <DollarSquare size={14} className="mr-1.5" />
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
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{formatInvoiceNumber(invoice.invoiceNumber)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Issue Date</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.issueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Due Date</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.dueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Payment Terms</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.paymentTerms}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Billed to</span>
                <span className="text-sm" style={{ color: '#14462a', fontWeight: 500 }}>{invoice.billTo.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Client Name</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.billTo.name}</span>
              </div>
              {invoice.billTo.company && (
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#B0B3B8' }}>Company</span>
                  <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.billTo.company}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#B0B3B8' }}>Currency</span>
                <span className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{invoice.primaryCurrency.toUpperCase()}</span>
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
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4">
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
                  <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{calculateItemTotal(item).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals - Clean Right-Aligned */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm space-y-3">
            <div className="grid grid-cols-2 gap-8 items-center py-2">
              <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Subtotal</span>
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{subtotal.toFixed(2)}</span>
            </div>
            {totalTax > 0 && (
              <div className="grid grid-cols-2 gap-8 items-center py-2">
                <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Tax</span>
                <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{totalTax.toFixed(2)}</span>
              </div>
            )}
            {totalDiscount > 0 && (
              <div className="grid grid-cols-2 gap-8 items-center py-2">
                <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Discount</span>
                <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>-₵{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-8 items-center py-2">
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>Total</span>
              <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{total.toFixed(2)}</span>
            </div>
            {amountPaid > 0 && (
              <div className="grid grid-cols-2 gap-8 items-center py-2">
                <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Amount Paid</span>
                <span className="text-base text-right" style={{ color: '#059669', fontWeight: 500 }}>-₵{amountPaid.toFixed(2)}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-8 items-center pt-4">
              <span className="text-base font-semibold text-right" style={{ color: '#2D2D2D' }}>Balance Due</span>
              <span className="text-base font-bold text-right" style={{ color: balanceDue > 0 ? '#2D2D2D' : '#059669' }}>₵{balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {invoice.payments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg mb-4" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment History</h2>
            <div className="space-y-4">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                      <TickSquare size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>
                        {payment.rail === 'mtn_mobile_money' && 'MTN Mobile Money'}
                        {payment.rail === 'bank_transfer' && 'Bank Transfer'}
                        {payment.rail === 'card' && 'Card Payment'}
                        {payment.rail === 'cash' && 'Cash'}
                      </p>
                      <p className="text-xs" style={{ color: '#B0B3B8' }}>
                        Ref: {payment.reference} • {payment.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-medium" style={{ color: '#14462a' }}>₵{payment.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-12">
            <h2 className="text-lg mb-4" style={{ color: '#2D2D2D', fontWeight: 600 }}>Notes</h2>
            <p className="text-sm" style={{ color: '#2D2D2D', lineHeight: '1.6' }}>
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Activity & Attachments - Single Section */}
        <div>
          <h2 className="text-lg mb-6" style={{ color: '#2D2D2D', fontWeight: 600 }}>Activity & Attachments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Activity */}
            <div>
              <h3 className="text-sm mb-4" style={{ color: '#B0B3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log Activity</h3>
              <div className="space-y-6">
                {invoice.activity.map((item, index) => (
                  <div key={index} className="relative flex gap-4">
                    {index !== invoice.activity.length - 1 && (
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

            {/* Attachments */}
            <div>
              <h3 className="text-sm mb-4" style={{ color: '#B0B3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attachments</h3>
              <div className="space-y-6">
                {invoice.attachments.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(240, 242, 245, 0.5)' }}>
                      <Image src="/icons/archive.png" alt="File" width={20} height={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: '#2D2D2D', fontWeight: 500 }}>{f.name}</p>
                      <p className="text-xs" style={{ color: '#B0B3B8' }}>{f.size} • {f.date}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full px-4 h-8 transition-all" 
                      style={{ color: '#2D2D2D', fontWeight: 400 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(20, 70, 42, 0.04)';
                        e.currentTarget.style.color = '#14462a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#2D2D2D';
                      }}
                    >
                      <DocumentDownload size={14} className="mr-1.5" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}