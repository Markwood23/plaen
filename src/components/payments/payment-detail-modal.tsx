"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TickCircle,
  Receipt21,
  Copy,
  ExportSquare,
  Mobile,
  Building,
  Coin1,
  Calendar,
  User,
  DocumentText,
  CloseCircle,
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface PaymentAllocation {
  id: string;
  amount: number;
  invoice: {
    id: string;
    invoice_number: string;
    total: number;
    customer: {
      id: string;
      name: string;
      email?: string;
    } | null;
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_date: string;
  reference: string | null;
  payer_name: string | null;
  payer_email?: string | null;
  payer_phone?: string | null;
  provider?: string | null;
  notes?: string | null;
  allocations: PaymentAllocation[];
}

interface PaymentDetailModalProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailModal({ payment, open, onOpenChange }: PaymentDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!payment) return null;

  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMethodIcon = (method: string | null) => {
    if (method?.includes("momo") || method?.includes("mobile")) {
      return '/icons/mobile.png';
    } else if (method?.includes("bank") || method?.includes("transfer")) {
      return '/icons/bank.png';
    } else if (method?.includes("card")) {
      return '/icons/credit-card.png';
    }
    return '/icons/transfer-money.png';
  };

  const getMethodLabel = (method: string | null) => {
    if (!method) return 'Unknown';
    const labels: Record<string, string> = {
      'mtn_momo': 'MTN Mobile Money',
      'vodafone_cash': 'Vodafone Cash',
      'airteltigo_money': 'AirtelTigo Money',
      'bank_transfer': 'Bank Transfer',
      'card': 'Card Payment',
      'cash': 'Cash',
      'crypto': 'Cryptocurrency',
    };
    return labels[method] || method.replace(/_/g, ' ');
  };

  const copyReference = () => {
    if (payment.reference) {
      navigator.clipboard.writeText(payment.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contactName = payment.allocations[0]?.invoice?.customer?.name || payment.payer_name || 'Unknown';
  const contactEmail = payment.allocations[0]?.invoice?.customer?.email || payment.payer_email;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-3xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-[#14462a] to-[#1a5a38] p-8 text-white text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <TickCircle size={32} color="white" variant="Bold" />
          </div>
          <p className="text-white/80 text-sm mb-1">Payment Received</p>
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(payment.amount, payment.currency)}
          </h2>
          <p className="text-white/60 text-xs mt-2">
            {formatDate(payment.payment_date)}
          </p>
        </div>

        {/* Payment Details */}
        <div className="p-6 space-y-6">
          {/* Method */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#14462a]/5 flex items-center justify-center">
                <Image 
                  src={getMethodIcon(payment.payment_method)} 
                  alt="Payment method"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <p className="text-xs text-[#65676B]">Payment Method</p>
                <p className="font-medium text-[#2D2D2D]">{getMethodLabel(payment.payment_method)}</p>
              </div>
            </div>
            <Badge variant="paid" className="rounded-full">
              <TickCircle size={12} className="mr-1" /> Confirmed
            </Badge>
          </div>

          <Separator className="bg-gray-100" />

          {/* Contact Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#14462a]/5 flex items-center justify-center">
              <User size={20} color="#14462a" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#65676B]">From</p>
              <p className="font-medium text-[#2D2D2D]">{contactName}</p>
              {contactEmail && (
                <p className="text-xs text-[#65676B]">{contactEmail}</p>
              )}
            </div>
          </div>

          {/* Reference */}
          {payment.reference && (
            <>
              <Separator className="bg-gray-100" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#14462a]/5 flex items-center justify-center">
                  <DocumentText size={20} color="#14462a" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#65676B]">Reference</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-[#2D2D2D] bg-gray-50 px-2 py-1 rounded">
                      {payment.reference}
                    </code>
                    <button 
                      onClick={copyReference}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {copied ? (
                        <TickCircle size={16} color="#14462a" />
                      ) : (
                        <Copy size={16} color="#65676B" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Allocated Invoices */}
          {payment.allocations.length > 0 && (
            <>
              <Separator className="bg-gray-100" />
              <div>
                <p className="text-xs text-[#65676B] mb-3">Applied to Invoices</p>
                <div className="space-y-2">
                  {payment.allocations.map((alloc) => (
                    <Link 
                      key={alloc.id}
                      href={`/invoices/${alloc.invoice?.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#14462a]/10 flex items-center justify-center">
                          <Receipt21 size={16} color="#14462a" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2D2D2D] text-sm">
                            {alloc.invoice?.invoice_number || 'Invoice'}
                          </p>
                          <p className="text-xs text-[#65676B]">
                            {alloc.invoice?.customer?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#14462a]">
                          {formatCurrency(alloc.amount, payment.currency)}
                        </span>
                        <ExportSquare size={16} color="#B0B3B8" className="group-hover:text-[#14462a] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {payment.allocations.length > 0 && (
              <Button 
                asChild
                className="flex-1 rounded-xl bg-[#14462a] hover:bg-[#0d3520]"
              >
                <Link href={`/invoices/${payment.allocations[0]?.invoice?.id}`}>
                  <Receipt21 size={18} className="mr-2" />
                  View Invoice
                </Link>
              </Button>
            )}
            <Button 
              variant="outline"
              className="flex-1 rounded-xl border-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
