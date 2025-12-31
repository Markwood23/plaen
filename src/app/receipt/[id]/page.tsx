"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Receipt21,
  TickCircle,
  DocumentDownload,
  Verify,
  Calendar,
  Money,
  User,
  Building,
  Copy,
  Shield,
  InfoCircle,
} from "iconsax-react";

interface PublicReceiptData {
  id: string;
  receipt_number: string;
  created_at: string;
  business: {
    name: string;
    logo_url: string | null;
  } | null;
  payer: {
    name: string;
    email: string;
  };
  payment: {
    amount: number;
    currency: string;
    method: string;
    date: string;
    reference_tail: string;
  };
  invoice: {
    invoice_number: string;
    issue_date: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
    status: string;
  } | null;
  items: Array<{
    label: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  verification: {
    hash_tail: string | null;
    algo: string;
    verified_at: string;
  };
}

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    GHS: "₵",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
  };
  const symbol = symbols[currency] || currency + " ";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPaymentMethod(method: string): string {
  const methodMap: Record<string, string> = {
    momo: "Mobile Money",
    bank: "Bank Transfer",
    card: "Card Payment",
    cash: "Cash",
    crypto: "Cryptocurrency",
  };
  return methodMap[method?.toLowerCase()] || method || "Payment";
}

export default function PublicReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [receipt, setReceipt] = useState<PublicReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        setLoading(true);
        const response = await fetch(`/api/receipts/public/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Receipt not found");
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#14462a] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Receipt21 size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Receipt Not Found"}
          </h1>
          <p className="text-gray-500 mb-4">
            This receipt may have been removed or the link is invalid.
          </p>
          <Link
            href="/"
            className="text-[#14462a] hover:underline font-medium"
          >
            Go to Plaen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          {receipt.business?.logo_url ? (
            <Image
              src={receipt.business.logo_url}
              alt={receipt.business.name}
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-xl object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-[#14462a]/10 flex items-center justify-center">
              <Building size={32} color="#14462a" />
            </div>
          )}
          <h1 className="text-xl font-semibold text-gray-900">
            {receipt.business?.name || "Payment Receipt"}
          </h1>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Status Banner */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TickCircle size={24} color="#16A34A" variant="Bold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Payment Confirmed</p>
                <p className="text-xs text-green-600">
                  {receipt.payment.date
                    ? format(new Date(receipt.payment.date), "MMM d, yyyy 'at' h:mm a")
                    : "Payment received"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(receipt.payment.amount, receipt.payment.currency)}
              </p>
              <p className="text-xs text-green-600">{formatPaymentMethod(receipt.payment.method)}</p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6 space-y-6">
            {/* Receipt Number */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <Receipt21 size={18} />
                <span className="text-sm">Receipt Number</span>
              </div>
              <span className="font-mono text-sm font-medium text-gray-900">
                {receipt.receipt_number}
              </span>
            </div>

            {/* Invoice Reference */}
            {receipt.invoice && (
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={18} />
                  <span className="text-sm">Invoice Reference</span>
                </div>
                <span className="font-mono text-sm font-medium text-gray-900">
                  {receipt.invoice.invoice_number}
                </span>
              </div>
            )}

            {/* Paid By (Masked) */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <User size={18} />
                <span className="text-sm">Paid By</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{receipt.payer.name}</p>
                <p className="text-xs text-gray-500">{receipt.payer.email}</p>
              </div>
            </div>

            {/* Payment Reference */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <Money size={18} />
                <span className="text-sm">Reference</span>
              </div>
              <span className="font-mono text-sm text-gray-600">
                ****{receipt.payment.reference_tail}
              </span>
            </div>

            {/* Line Items */}
            {receipt.items.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Items</h3>
                <div className="space-y-2">
                  {receipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-900">{item.label}</span>
                        <span className="text-gray-400 ml-2">×{item.quantity}</span>
                      </div>
                      <span className="text-gray-700">
                        {formatCurrency(item.total, receipt.payment.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                {receipt.invoice && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(receipt.invoice.subtotal, receipt.payment.currency)}</span>
                    </div>
                    {receipt.invoice.discount > 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Discount</span>
                        <span>-{formatCurrency(receipt.invoice.discount, receipt.payment.currency)}</span>
                      </div>
                    )}
                    {receipt.invoice.tax > 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax</span>
                        <span>{formatCurrency(receipt.invoice.tax, receipt.payment.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Paid</span>
                      <span>{formatCurrency(receipt.payment.amount, receipt.payment.currency)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verification Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Verify size={18} color="#14462a" variant="Bold" />
                <span className="text-xs font-medium text-[#14462a]">Verified Receipt</span>
              </div>
              {receipt.verification.hash_tail && (
                <div className="flex items-center gap-2">
                  <Shield size={14} color="#9CA3AF" />
                  <span className="font-mono text-xs text-gray-500">
                    {receipt.verification.algo.toUpperCase()}:...{receipt.verification.hash_tail}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <InfoCircle size={12} />
              Personal information has been partially masked for privacy
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`/api/receipts/${id}/pdf`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#14462a] rounded-xl hover:bg-[#14462a]/90 transition-colors"
          >
            <DocumentDownload size={16} />
            Download PDF
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by{" "}
            <Link href="/" className="text-[#14462a] hover:underline">
              Plaen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
