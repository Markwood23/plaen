/**
 * Payment Receipt Component
 * Shown after successful payment
 */

"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Printer, ArrowLeft } from "lucide-react";
import type { ReceiptData } from "@/hooks/usePayState";
import { telemetry } from "@/lib/telemetry";
import { paymentAPI } from "@/lib/api/payments";

interface ReceiptProps {
  data: ReceiptData;
  onBack?: () => void;
}

export function Receipt({ data, onBack }: ReceiptProps) {
  const handleDownload = async () => {
    try {
      const blob = await paymentAPI.downloadReceipt(data.transactionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${data.transactionId}.pdf`;
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

  // Format method name
  const methodName = {
    momo: 'Mobile Money',
    bank: 'Bank Transfer',
    card: 'Card Payment',
    external: 'External Payment',
  }[data.method] || data.method;

  // Format date
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center py-8">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#F9F9F9' }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: '#2D2D2D' }} />
        </div>
        <h1 className="pay-page-header mb-2">Payment Successful</h1>
        <p className="text-body text-[#B0B3B8]">
          Your payment has been received and processed
        </p>
      </div>

      {/* Amount */}
      <div className="text-center py-6 border-y" style={{ borderColor: '#EBECE7' }}>
        <p className="text-caption mb-2 text-[#B0B3B8]">Amount Paid</p>
        <p className="pay-amount">₵{data.amount.toFixed(2)}</p>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="pay-section-header">Payment Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#EBECE7' }}>
            <span className="text-body-sm text-[#B0B3B8]">Transaction ID</span>
            <span className="text-mono text-body-sm">{data.transactionId}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#EBECE7' }}>
            <span className="text-body-sm text-[#B0B3B8]">Invoice Number</span>
            <span className="text-body-sm text-emphasis">{data.invoiceNumber}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#EBECE7' }}>
            <span className="text-body-sm text-[#B0B3B8]">Payment Method</span>
            <span className="text-body-sm text-emphasis">{methodName}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#EBECE7' }}>
            <span className="text-body-sm text-[#B0B3B8]">Reference</span>
            <span className="text-mono text-body-sm">{data.reference}</span>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <span className="text-body-sm text-[#B0B3B8]">Date & Time</span>
            <span className="text-body-sm">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 print:hidden">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full h-12"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="w-full h-12"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>

        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full h-12"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoice
          </Button>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
