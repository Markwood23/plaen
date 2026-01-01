/**
 * Payment Receipt Component
 * Beautiful receipt UI matching the email template design
 */

"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Printer, ArrowLeft, Check, Copy } from "lucide-react";
import type { ReceiptData } from "@/hooks/usePayState";
import { telemetry } from "@/lib/telemetry";
import { paymentAPI } from "@/lib/api/payments";
import { useState } from "react";

interface ReceiptProps {
  data: ReceiptData;
  onBack?: () => void;
}

export function Receipt({ data, onBack }: ReceiptProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const blob = await paymentAPI.downloadReceipt(data.transactionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${data.receiptNumber || data.transactionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      telemetry.receiptDownloaded(data.transactionId, 'pdf');
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

  const handlePrint = () => {
    window.print();
    telemetry.receiptDownloaded(data.transactionId, 'print');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format method name
  const methodName = {
    momo: 'Mobile Money',
    mtn_momo: 'MTN Mobile Money',
    vodafone_cash: 'Vodafone Cash',
    airteltigo_money: 'AirtelTigo Money',
    bank: 'Bank Transfer',
    bank_transfer: 'Bank Transfer',
    card: 'Card Payment',
    external: 'External Payment',
    cash: 'Cash',
  }[data.method] || (typeof data.method === 'string' ? data.method.replace(/_/g, ' ') : 'Payment');

  // Format date
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Currency symbol
  const currency = data.currency || 'GHS';
  const currencySymbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency + ' ';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Dark Receipt Card - matching email template */}
      <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Success Header */}
        <div className="px-8 pt-12 pb-8 text-center bg-gradient-to-b from-[#1F1F1F] to-[#1A1A1A]">
          {/* Success Icon - Amber gradient like email */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful</h1>
          <p className="text-gray-500 text-sm">Thank you for your payment!</p>
        </div>

        {/* Receipt Number Badge */}
        {data.receiptNumber && (
          <div className="flex justify-center pb-6">
            <div 
              className="inline-flex items-center gap-2 bg-[#262626] rounded-full px-5 py-2.5 cursor-pointer hover:bg-[#333] transition-colors"
              onClick={() => copyToClipboard(data.receiptNumber!, 'receipt')}
            >
              <span className="text-gray-400 text-sm">📄</span>
              <span className="text-white font-semibold font-mono">#{data.receiptNumber}</span>
              {copiedField === 'receipt' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500" />
              )}
            </div>
          </div>
        )}

        {/* Transaction Details Card */}
        <div className="px-8 pb-6">
          <div className="bg-[#262626] rounded-2xl p-6 space-y-5">
            {/* Time / Date */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Time / Date</span>
              <span className="text-white text-sm font-medium">{formattedDate}</span>
            </div>

            {/* Reference Number */}
            {data.reference && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Ref Number</span>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => copyToClipboard(data.reference, 'reference')}
                >
                  <span className="text-white text-sm font-medium font-mono">{data.reference}</span>
                  {copiedField === 'reference' ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </div>
              </div>
            )}

            {/* Invoice Number */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Invoice</span>
              <span className="text-white text-sm font-medium">{data.invoiceNumber}</span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Payment Method</span>
              <span className="text-white text-sm font-medium">{methodName}</span>
            </div>

            {/* Payer Name */}
            {data.payerName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Sender Name</span>
                <span className="text-white text-sm font-medium">{data.payerName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Amount Section */}
        <div className="px-8 pb-6">
          <div className="bg-[#262626] rounded-2xl p-6">
            {/* Amount */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-white text-lg font-semibold">{currencySymbol}{data.amount.toFixed(2)}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white text-xl font-bold">{currencySymbol}{data.amount.toFixed(2)}</span>
            </div>

            {/* Remaining Balance (if partial payment) */}
            {data.remainingBalance && data.remainingBalance > 0 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-amber-500 text-sm font-medium">Remaining Balance</span>
                <span className="text-amber-500 font-semibold">{currencySymbol}{data.remainingBalance.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 space-y-3 print:hidden">
          <Button
            onClick={handleDownload}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#14462a] to-[#1a5a38] hover:from-[#1a5a38] hover:to-[#14462a] text-white font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-full h-12 rounded-xl border-gray-700 bg-transparent text-white hover:bg-[#262626]"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 text-center border-t border-[#262626]">
          {data.businessName && (
            <>
              <p className="text-gray-500 text-xs mb-1">Payment received by</p>
              <p className="text-white text-sm font-semibold mb-4">{data.businessName}</p>
            </>
          )}
          <p className="text-gray-600 text-xs">
            Powered by <a href="https://plaen.tech" className="text-[#14462a] font-medium hover:underline">Plaen</a>
          </p>
        </div>
      </div>

      {/* Back Button (outside card) */}
      {onBack && (
        <div className="mt-6 print:hidden">
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoice
          </Button>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: #1A1A1A !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
