"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import {
  ArrowLeft2,
  DocumentDownload,
  Printer,
  TickCircle,
  Receipt21,
  Copy,
  ExportSquare,
  ShieldTick,
} from "iconsax-react";

interface ReceiptDetail {
  id: string;
  receipt_number: string;
  payment_id: string;
  invoice_id: string | null;
  snapshot_data: Record<string, unknown>;
  payment: {
    amount: number;
    currency: string;
    method: string;
    date: string;
    payer_name: string | null;
    payer_email: string | null;
    reference?: string | null;
  };
  invoice: {
    id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string | null;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    balance: number;
    currency: string;
    status: string;
    notes: string | null;
    line_items?: {
      id: string;
      description: string;
      quantity: number;
      unit_price: number;
      total: number;
    }[];
  } | null;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
  } | null;
  business?: {
    name: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    logo_url: string | null;
  } | null;
  created_at: string;
}

export default function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { maskAmount } = useBalanceVisibility();
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        setLoading(true);
        const response = await fetch(`/api/receipts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Receipt not found");
          } else if (response.status === 401) {
            setError("Please log in to view this receipt");
          } else {
            setError("Failed to load receipt");
          }
          return;
        }
        
        const data = await response.json();
        setReceipt(data.receipt);
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [id]);

  const formatCurrency = (amount: number, currency: string = "GHS") => {
    const symbol = currency === "GHS" ? "₵" : currency === "USD" ? "$" : currency + " ";
    return `${symbol}${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      momo: "Mobile Money",
      mtn_momo: "MTN Mobile Money",
      vodafone_cash: "Vodafone Cash",
      airteltigo_money: "AirtelTigo Money",
      bank: "Bank Transfer",
      bank_transfer: "Bank Transfer",
      card: "Card Payment",
      cash: "Cash",
      external: "External Payment",
    };
    return methods[method] || method.replace(/_/g, ' ');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/receipts/${id}/pdf`);
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${receipt?.receipt_number || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  const copyReceiptNumber = () => {
    if (receipt?.receipt_number) {
      navigator.clipboard.writeText(receipt.receipt_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="max-w-md mx-auto pt-8 px-4">
          <Skeleton className="h-[600px] w-full rounded-3xl bg-[#1a1a1a]" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <Receipt21 size={48} color="#6B7280" className="mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Receipt Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "This receipt could not be found."}</p>
          <Button variant="outline" asChild className="border-gray-700 text-white hover:bg-gray-800">
            <Link href="/receipts">Back to Receipts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const businessName = receipt.business?.name || "Your Business";
  const customerName = receipt.customer?.name || receipt.payment.payer_name || "Customer";

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-12">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .receipt-paper {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Action Bar */}
      <div className="print:hidden bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800">
              <Link href="/receipts">
                <ArrowLeft2 size={16} color="#9CA3AF" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={handlePrint}
              >
                <Printer size={14} color="#D1D5DB" className="mr-1.5" />
                Print
              </Button>
              <Button
                size="sm"
                className="rounded-xl bg-[#14462a] hover:bg-[#1a5a38]"
                onClick={handleDownloadPDF}
              >
                <DocumentDownload size={14} color="white" className="mr-1.5" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt */}
      <div className="max-w-md mx-auto pt-8 px-4">
        <div className="receipt-paper bg-white rounded-t-3xl overflow-hidden shadow-2xl">
          
          {/* Header - Clean White with Logo */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex justify-between items-start">
              {/* Business Logo/Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14462a] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {businessName.charAt(0)}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 text-lg">{businessName}</span>
              </div>
              {/* Receipt Info */}
              <div className="text-right">
                <p className="text-xs text-gray-400">Receipt № {receipt.receipt_number}</p>
                <p className="text-xs text-gray-400">{formatDateTime(receipt.payment.date)}</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="px-8 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful!</h1>
            <p className="text-sm text-gray-500">
              Your payment <span className="font-medium text-[#14462a]">№ {receipt.receipt_number}</span> has been processed
            </p>
          </div>

          {/* Dashed Separator */}
          <div className="px-8">
            <div className="border-t-2 border-dashed border-gray-200 relative">
              <div className="absolute -left-4 -top-3 w-6 h-6 bg-[#0f0f0f] rounded-full" />
              <div className="absolute -right-4 -top-3 w-6 h-6 bg-[#0f0f0f] rounded-full" />
            </div>
          </div>

          {/* Line Items */}
          {receipt.invoice?.line_items && receipt.invoice.line_items.length > 0 ? (
            <div className="px-8 py-6">
              <div className="space-y-4">
                {receipt.invoice.line_items.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <span className="text-gray-400 text-sm w-4">{index + 1}</span>
                      <div>
                        <p className="text-gray-900 font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.quantity} × {maskAmount(formatCurrency(item.unit_price, receipt.invoice?.currency || receipt.payment.currency))}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">
                      {maskAmount(formatCurrency(item.total, receipt.invoice?.currency || receipt.payment.currency))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-8 py-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <span className="text-gray-400 text-sm w-4">1</span>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      Payment for Invoice {receipt.invoice?.invoice_number || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatPaymentMethod(receipt.payment.method)}
                    </p>
                  </div>
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {maskAmount(formatCurrency(receipt.payment.amount, receipt.payment.currency))}
                </span>
              </div>
            </div>
          )}

          {/* Dashed Separator */}
          <div className="px-8">
            <div className="border-t-2 border-dashed border-gray-200" />
          </div>

          {/* Totals Section */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {maskAmount(formatCurrency(receipt.payment.amount, receipt.payment.currency))}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-700">{formatPaymentMethod(receipt.payment.method)}</span>
              </div>
              {receipt.payment.reference && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference</span>
                  <span className="text-gray-700 font-mono text-xs">{receipt.payment.reference}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer/Payer Info */}
          <div className="px-8 py-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Paid By</p>
                <p className="text-sm font-medium text-gray-900">{customerName}</p>
                {receipt.customer?.email && (
                  <p className="text-xs text-gray-500 mt-0.5">{receipt.customer.email}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Received By</p>
                <p className="text-sm font-medium text-gray-900">{businessName}</p>
              </div>
            </div>
          </div>

          {/* Invoice Link */}
          {receipt.invoice && (
            <div className="px-8 pb-6">
              <Link 
                href={`/invoices/${receipt.invoice.id}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Related Invoice</p>
                  <p className="font-semibold text-gray-900">{receipt.invoice.invoice_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={receipt.invoice.status === "paid" ? "paid" : "secondary"}
                    className="capitalize"
                  >
                    {receipt.invoice.status}
                  </Badge>
                  <ExportSquare size={16} color="#9CA3AF" />
                </div>
              </Link>
              
              {receipt.invoice.balance > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Remaining Balance</span>
                    <span className="font-semibold text-amber-700">
                      {maskAmount(formatCurrency(receipt.invoice.balance, receipt.invoice.currency))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification Badge */}
          <div className="px-8 pb-6">
            <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#14462a]/5 border border-[#14462a]/10">
              <ShieldTick size={18} color="#14462a" variant="Bold" />
              <span className="text-sm font-medium text-[#14462a]">Payment Verified</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <button 
              onClick={copyReceiptNumber}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
            >
              {copied ? (
                <>
                  <TickCircle size={12} color="#14462a" />
                  <span className="text-[#14462a]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy receipt number</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-300 mt-4">
              Powered by <span className="font-semibold text-gray-400">Plaen</span>
            </p>
          </div>
        </div>

        {/* Tear-off effect at bottom */}
        <div className="relative">
          <div className="h-6 bg-white" style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 5 0, 10 10 Q 15 20, 20 10 Q 25 0, 30 10 Q 35 20, 40 10 Q 45 0, 50 10 Q 55 20, 60 10 Q 65 0, 70 10 Q 75 20, 80 10 Q 85 0, 90 10 Q 95 20, 100 10 L 100 0 L 0 0 Z\' fill=\'white\'/%3E%3C/svg%3E")',
            WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 5 0, 10 10 Q 15 20, 20 10 Q 25 0, 30 10 Q 35 20, 40 10 Q 45 0, 50 10 Q 55 20, 60 10 Q 65 0, 70 10 Q 75 20, 80 10 Q 85 0, 90 10 Q 95 20, 100 10 L 100 0 L 0 0 Z\' fill=\'white\'/%3E%3C/svg%3E")',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }} />
        </div>
      </div>
    </div>
  );
}
