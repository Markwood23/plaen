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
import { 
  ArrowLeft2, 
  DocumentDownload, 
  TickCircle, 
  Receipt21,
  Sms,
  Call,
  Building,
  Copy,
  More,
  Printer,
  RefreshCircle,
  Clock,
  CloseCircle,
  InfoCircle,
  Coin1
} from "iconsax-react";
import { CedisCircle } from "@/components/icons/cedis-icon";
import Link from "next/link";
import { use, useState } from "react";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copiedRef, setCopiedRef] = useState(false);
  const { maskAmount } = useBalanceVisibility();

  const copyReference = () => {
    navigator.clipboard.writeText(payment.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Mock data - will be replaced with API call
  const payment = {
    id: id,
    reference: "MM12594",
    paymentDate: "Dec 15, 2024, 10:30 AM",
    status: "Paid",
    
    // Invoice details
    invoice: {
      id: "A7K9X2",
      invoiceNumber: "PL-A7K9X2",
      invoiceDate: "Dec 1, 2024",
      dueDate: "Dec 31, 2024",
      contact: "Frank Murlo",
      email: "frank@murloindustries.com",
      phone: "+233 24 123 4567",
      company: "Murlo Industries",
      invoiceAmount: 9275.05,
    },
    
    // Payment details
    amountPaid: 9275.05,
    rail: "MTN MoMo",
    railDetails: {
      provider: "MTN Mobile Money",
      phoneNumber: "+233 24 XXX XX67",
    },
    
    // Transaction details
    transactionId: "TXN-20241215-001",
    processingFee: 18.55,
    netAmount: 9256.50,
    
    // Timing
    daysToPayment: 14,
    isOnTime: false, // >3 days
    
    // Receipt
    receiptUrl: "/receipts/MM12594.pdf",
    
    // Activity
    activity: [
      { date: "Dec 15, 2024, 10:32 AM", action: "Payment confirmed", description: "Transaction successfully processed", type: "confirmed" },
      { date: "Dec 15, 2024, 10:31 AM", action: "Payment received", description: "Amount received from MTN MoMo", type: "received" },
      { date: "Dec 15, 2024, 10:30 AM", action: "Payment initiated", description: "Customer initiated payment via MTN Mobile Money", type: "initiated" },
    ],
  };

  const getRailIcon = () => {
    let icon = '/icons/transfer-money.png';
    let bgColor = '#F9F9F9';
    let alt = 'Payment';
    
    if (payment.rail.includes("MoMo") || payment.rail.includes("Money") || payment.rail.includes("Vodafone") || payment.rail.includes("AirtelTigo")) {
      icon = '/icons/mobile.png';
      bgColor = '#FFF4E6';
      alt = 'Mobile Money';
    } else if (payment.rail.includes("Bank")) {
      icon = '/icons/bank.png';
      bgColor = '#E8F4FD';
      alt = 'Bank Transfer';
    } else if (payment.rail.includes("Card")) {
      icon = '/icons/credit-card.png';
      bgColor = '#F3E8FF';
      alt = 'Card';
    } else if (payment.rail.includes("Cash")) {
      icon = '/icons/transfer-money.png';
      bgColor = '#E8F9F1';
      alt = 'Cash';
    }
    
    return { icon, bgColor, alt };
  };

  const getRailBgColor = () => {
    if (payment.rail.includes("MoMo") || payment.rail.includes("Money") || payment.rail.includes("Vodafone") || payment.rail.includes("AirtelTigo")) {
      return '#FFF4E6';
    } else if (payment.rail.includes("Bank")) {
      return '#E8F4FD';
    } else if (payment.rail.includes("Card")) {
      return '#F3E8FF';
    } else if (payment.rail.includes("Cash")) {
      return '#E8F9F1';
    }
    return '#F9F9F9';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "confirmed":
        return <TickCircle size={12} color="#14462a" />;
      case "received":
        return <CedisCircle size={12} color="#14462a" />;
      case "initiated":
        return <RefreshCircle size={12} color="#14462a" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-white" />;
    }
  };

  const getActivityIconBackground = (type: string) => {
    switch (type) {
      case "confirmed":
        return 'rgba(13, 148, 136, 0.08)';
      case "received":
        return 'rgba(20, 70, 42, 0.08)';
      case "initiated":
        return 'rgba(20, 70, 42, 0.08)';
      default:
        return 'rgba(240, 242, 245, 0.5)';
    }
  };

  const { icon, bgColor, alt } = getRailIcon();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href="/payments">
                <ArrowLeft2 size={16} color="#2D2D2D" />
                Back
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 600 }}>
                  Payment {payment.reference}
                </h1>
                {payment.status === "Paid" && (
                  <Badge variant="paid">
                    <TickCircle size={12} color="#14462a" /> Paid
                  </Badge>
                )}
                {payment.status === "Partially Paid" && (
                  <Badge variant="pending">
                    <Coin1 size={12} color="#D97706" /> Partial Payment
                  </Badge>
                )}
                {payment.status === "Failed" && (
                  <Badge variant="failed">
                    <CloseCircle size={12} color="#DC2626" /> Failed
                  </Badge>
                )}
                {payment.isOnTime && (
                  <Badge variant="partial">
                    <Clock size={12} color="#14462a" /> On-time (≤3 days)
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                  {maskAmount(`₵${payment.amountPaid.toFixed(2)}`)}
                </p>
                <span style={{ color: '#B0B3B8' }}>•</span>
                <p className="text-sm" style={{ color: '#B0B3B8' }}>
                  {payment.paymentDate}
                </p>
                {!payment.isOnTime && (
                  <>
                    <span style={{ color: '#B0B3B8' }}>•</span>
                    <p className="text-sm" style={{ color: '#B0B3B8' }}>
                      {payment.daysToPayment} days to pay
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full gap-2 hover:bg-[rgba(24,119,242,0.04)] hover:text-[#14462a] hover:border-[#14462a] transition-all" 
              style={{ borderColor: '#E4E6EB' }}
              onClick={copyReference}
            >
              {copiedRef ? (
                <>
                  <TickCircle size={16} color="#14462a" />
                  <span style={{ color: '#14462a' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Reference
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              className="rounded-full gap-2 shadow-sm hover:shadow-md transition-all" 
              style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
            >
              <DocumentDownload size={16} />
              Download Receipt
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full hover:bg-[rgba(20,70,42,0.06)] hover:text-[#14462a] hover:border-[#14462a] transition-all" 
                  style={{ borderColor: '#E4E6EB' }}
                >
                  <More size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                  >
                    <Printer size={16} color="#14462a" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                    Print Receipt
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
                  >
                    <Sms size={16} color="#14462a" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>
                    Email Receipt
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                  >
                    <InfoCircle size={16} color="#DC2626" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>
                    Report Issue
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary Card */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="mb-6 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment Summary</h2>
            </div>
            
            <div className="space-y-4">
              {/* Amount Paid */}
              <div className="flex items-start justify-between py-3">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Amount Paid</p>
                  <p className="text-2xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 600 }}>
                    {maskAmount(`₵${payment.amountPaid.toFixed(2)}`)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Invoice Amount</p>
                  <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>
                    {maskAmount(`₵${payment.invoice.invoiceAmount.toFixed(2)}`)}
                  </p>
                </div>
              </div>

              {/* Payment Rail */}
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Payment Method</p>
                <div className="flex items-center gap-2">
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
                  <span style={{ color: '#2D2D2D', fontWeight: 500 }}>{payment.rail}</span>
                </div>
              </div>

              {/* Reference */}
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Reference Number</p>
                <code className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: getRailBgColor(), color: '#2D2D2D' }}>
                  {payment.reference}
                </code>
              </div>

              {/* Transaction ID */}
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Transaction ID</p>
                <p className="text-sm font-mono" style={{ color: '#2D2D2D' }}>{payment.transactionId}</p>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Payment Date</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{payment.paymentDate}</p>
              </div>

              {/* Days to Payment */}
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Time to Pay</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{payment.daysToPayment} days</p>
                  {payment.isOnTime && (
                    <Badge variant="partial">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details Card */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Related Invoice</h2>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="rounded-full gap-2 hover:bg-[rgba(24,119,242,0.04)] hover:text-[#14462a] hover:border-[#14462a] transition-all" 
                style={{ borderColor: '#E4E6EB' }}
              >
                <Link href={`/invoices/${payment.invoice.id}`}>
                  View Invoice
                  <ArrowLeft2 size={14} className="rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Invoice Number</p>
                <Link 
                  href={`/invoices/${payment.invoice.id}`}
                  className="text-sm hover:underline"
                  style={{ color: '#14462a', fontWeight: 500 }}
                >
                  #{payment.invoice.id}
                </Link>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Issue Date</p>
                <p className="text-sm" style={{ color: '#2D2D2D' }}>{payment.invoice.invoiceDate}</p>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Due Date</p>
                <p className="text-sm" style={{ color: '#2D2D2D' }}>{payment.invoice.dueDate}</p>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>Invoice Total</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(`₵${payment.invoice.invoiceAmount.toFixed(2)}`)}</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="mb-6 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Payment Activity</h2>
            </div>
            
            <div className="space-y-4">
              {payment.activity.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: getActivityIconBackground(item.type) }}
                    >
                      {getActivityIcon(item.type)}
                    </div>
                    {index < payment.activity.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ backgroundColor: '#E4E6EB' }} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm mb-1" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.action}</p>
                    {item.description && (
                      <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>{item.description}</p>
                    )}
                    <p className="text-xs" style={{ color: '#B0B3B8' }}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Customer Details Card */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white', paddingBottom: '112px' }}>
            <div className="mb-6 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Customer Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="py-3">
                <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Name</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{payment.invoice.contact}</p>
              </div>

              {payment.invoice.company && (
                <div className="py-3">
                  <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Company</p>
                  <div className="flex items-center gap-2">
                    <Building size={16} color="#B0B3B8" />
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>{payment.invoice.company}</p>
                  </div>
                </div>
              )}

              <div className="py-3">
                <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Email</p>
                <div className="flex items-center gap-2">
                  <Sms size={16} color="#B0B3B8" />
                  <p className="text-sm" style={{ color: '#2D2D2D' }}>{payment.invoice.email}</p>
                </div>
              </div>

              <div className="py-3">
                <p className="text-sm mb-1" style={{ color: '#B0B3B8', fontWeight: 500 }}>Phone</p>
                <div className="flex items-center gap-2">
                  <Call size={16} color="#B0B3B8" />
                  <p className="text-sm" style={{ color: '#2D2D2D' }}>{payment.invoice.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Fees Card */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white', paddingBottom: '90px' }}>
            <div className="mb-6 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Transaction Details</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8' }}>Gross Amount</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(`₵${payment.amountPaid.toFixed(2)}`)}</p>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#B0B3B8' }}>Processing Fee</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 500 }}>{maskAmount(`₵${payment.processingFee.toFixed(2)}`)}</p>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>Net Amount</p>
                <p className="text-sm" style={{ color: '#2D2D2D', fontWeight: 600 }}>{maskAmount(`₵${payment.netAmount.toFixed(2)}`)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="mb-4 pb-4" style={{ borderBottom: '2px solid rgba(20, 70, 42, 0.1)' }}>
              <h2 className="text-lg" style={{ color: '#2D2D2D', fontWeight: 600 }}>Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center gap-3 py-3 pr-3 rounded-xl transition-all hover:bg-[rgba(24,119,242,0.04)] group"
              >
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <DocumentDownload size={20} color="#14462a" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium transition-all group-hover:text-[#14462a]" style={{ color: '#2D2D2D' }}>
                    Download Receipt
                  </p>
                  <p className="text-xs" style={{ color: '#B0B3B8' }}>Save as PDF</p>
                </div>
              </button>

              <button 
                className="w-full flex items-center gap-3 py-3 pr-3 rounded-xl transition-all hover:bg-[rgba(24,119,242,0.04)] group"
              >
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                >
                  <Printer size={20} color="#14462a" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium transition-all group-hover:text-[#14462a]" style={{ color: '#2D2D2D' }}>
                    Print Receipt
                  </p>
                  <p className="text-xs" style={{ color: '#B0B3B8' }}>Print or save locally</p>
                </div>
              </button>

              <button 
                className="w-full flex items-center gap-3 py-3 pr-3 rounded-xl transition-all hover:bg-[rgba(24,119,242,0.04)] group"
              >
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
                >
                  <Sms size={20} color="#14462a" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium transition-all group-hover:text-[#14462a]" style={{ color: '#2D2D2D' }}>
                    Email Receipt
                  </p>
                  <p className="text-xs" style={{ color: '#B0B3B8' }}>Send to customer</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
