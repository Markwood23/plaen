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
  Calendar,
  Money,
  User,
  Building,
  Sms,
  Call,
  DocumentText,
  Copy,
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
  } | null;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
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
    return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      momo: "Mobile Money",
      bank: "Bank Transfer",
      card: "Card Payment",
      cash: "Cash",
      external: "External Payment",
    };
    return methods[method] || method;
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
      <div className="min-h-screen bg-white">
        <div className="print:hidden" style={{ borderBottom: "1px solid #E4E6EB" }}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Receipt21 size={48} color="#B0B3B8" className="mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Receipt Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "This receipt could not be found."}</p>
          <Button variant="outline" asChild>
            <Link href="/receipts">Back to Receipts</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print Styles */}
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

      {/* Action Bar */}
      <div className="print:hidden" style={{ borderBottom: "1px solid #E4E6EB" }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href="/receipts">
                <ArrowLeft2 size={16} color="currentColor" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: "#E4E6EB", color: "#2D2D2D", fontWeight: 400 }}
                onClick={handlePrint}
              >
                <Printer size={14} color="currentColor" className="mr-1.5" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: "#E4E6EB", color: "#2D2D2D", fontWeight: 400 }}
                onClick={handleDownloadPDF}
              >
                <DocumentDownload size={14} color="currentColor" className="mr-1.5" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0">
        <div className="bg-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(20, 70, 42, 0.08)" }}>
                  <TickCircle size={24} color="#14462a" variant="Bold" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#2D2D2D" }}>Payment Receipt</h1>
                  <p className="text-sm" style={{ color: "#B0B3B8" }}>Payment confirmed</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: "#B0B3B8" }}>Receipt Number</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold" style={{ color: "#2D2D2D" }}>{receipt.receipt_number}</p>
                <button
                  onClick={copyReceiptNumber}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  title="Copy receipt number"
                >
                  <Copy size={14} color={copied ? "#14462a" : "#B0B3B8"} />
                </button>
              </div>
              {copied && <p className="text-xs mt-1" style={{ color: "#14462a" }}>Copied!</p>}
            </div>
          </div>

          {/* Amount Paid */}
          <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: "rgba(20, 70, 42, 0.04)", border: "1px solid rgba(20, 70, 42, 0.1)" }}>
            <p className="text-sm mb-2" style={{ color: "#B0B3B8" }}>Amount Paid</p>
            <p className="text-4xl font-bold" style={{ color: "#14462a" }}>
              {maskAmount(formatCurrency(receipt.payment.amount, receipt.payment.currency))}
            </p>
            <p className="text-sm mt-2" style={{ color: "#65676B" }}>
              Paid on {formatDateTime(receipt.payment.date)} via {formatPaymentMethod(receipt.payment.method)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Payment Details */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "#F9F9F9" }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#2D2D2D" }}>
                <Money size={16} color="#14462a" />
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#B0B3B8" }}>Method</span>
                  <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{formatPaymentMethod(receipt.payment.method)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#B0B3B8" }}>Date</span>
                  <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{formatDate(receipt.payment.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#B0B3B8" }}>Currency</span>
                  <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{receipt.payment.currency}</span>
                </div>
              </div>
            </div>

            {/* Customer/Payer Details */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "#F9F9F9" }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#2D2D2D" }}>
                <User size={16} color="#14462a" />
                Payer Details
              </h3>
              <div className="space-y-3">
                {(receipt.customer?.name || receipt.payment.payer_name) && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "#B0B3B8" }}>Name</span>
                    <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>
                      {receipt.customer?.name || receipt.payment.payer_name}
                    </span>
                  </div>
                )}
                {receipt.customer?.company && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "#B0B3B8" }}>Company</span>
                    <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{receipt.customer.company}</span>
                  </div>
                )}
                {(receipt.customer?.email || receipt.payment.payer_email) && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "#B0B3B8" }}>Email</span>
                    <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>
                      {receipt.customer?.email || receipt.payment.payer_email}
                    </span>
                  </div>
                )}
                {receipt.customer?.phone && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "#B0B3B8" }}>Phone</span>
                    <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{receipt.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Reference */}
          {receipt.invoice && (
            <div className="rounded-xl p-5 mb-8" style={{ border: "1px solid #E4E6EB" }}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#2D2D2D" }}>
                <DocumentText size={16} color="#14462a" />
                Invoice Reference
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: "#B0B3B8" }}>Invoice Number</p>
                  <Link href={`/invoices/${receipt.invoice.id}`} className="text-sm font-medium hover:underline" style={{ color: "#14462a" }}>
                    {receipt.invoice.invoice_number}
                  </Link>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#B0B3B8" }}>Invoice Total</p>
                  <p className="text-sm font-medium" style={{ color: "#2D2D2D" }}>
                    {maskAmount(formatCurrency(receipt.invoice.total, receipt.invoice.currency))}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#B0B3B8" }}>Balance Due</p>
                  <p className="text-sm font-medium" style={{ color: receipt.invoice.balance > 0 ? "#F59E0B" : "#14462a" }}>
                    {maskAmount(formatCurrency(receipt.invoice.balance, receipt.invoice.currency))}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "#B0B3B8" }}>Status</p>
                  <Badge
                    variant={receipt.invoice.status === "paid" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {receipt.invoice.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 text-center" style={{ borderTop: "1px solid #E4E6EB" }}>
            <p className="text-sm" style={{ color: "#B0B3B8" }}>
              This receipt was generated on {formatDateTime(receipt.created_at)}
            </p>
            <p className="text-sm mt-2" style={{ color: "#B0B3B8" }}>
              Powered by <span className="font-medium">Plaen</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
