"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  TickCircle, 
  Danger,
  Send2,
  Copy,
  Link21,
  Sms,
  ExportSquare
} from "iconsax-react";

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  customerEmail?: string;
  customerName?: string;
  total: number;
  currency: string;
  onSuccess?: () => void;
}

export function SendInvoiceModal({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  customerEmail = "",
  customerName = "",
  total,
  currency,
  onSuccess,
}: SendInvoiceModalProps) {
  const [email, setEmail] = useState<string>(customerEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successTitle, setSuccessTitle] = useState<string>('Payment Link Ready');
  const [successDescription, setSuccessDescription] = useState<string>('Your client can now view and pay this invoice');
  const wasOpenRef = useRef(false);

  const currencySymbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;

  // Reset state only when the modal transitions from closed -> open.
  // Avoid resetting mid-session when parent refetch changes props.
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setEmail(customerEmail);
      setError(null);
      setSuccess(false);
      setPublicUrl(null);
      setCopied(false);
      setSuccessTitle('Payment Link Ready');
      setSuccessDescription('Your client can now view and pay this invoice');
    }

    wasOpenRef.current = open;
  }, [open, customerEmail]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic email validation if provided
    const trimmedEmailForValidation = email.trim();
    if (trimmedEmailForValidation && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmailForValidation)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const trimmedEmail = email.trim();
      const emailRequested = Boolean(trimmedEmail);
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail || null,
          sendEmail: Boolean(trimmedEmail),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If already sent, still show the public URL
        if (data.public_url) {
          setPublicUrl(data.public_url);
          setSuccess(true);
          setSuccessTitle('Payment Link Ready');
          setSuccessDescription('This invoice already has a payment link');
        } else {
          throw new Error(data.error || 'Failed to send invoice');
        }
        setLoading(false);
        return;
      }

      setPublicUrl(data.public_url);
      setSuccess(true);

      if (emailRequested) {
        if (data.email_sent) {
          setSuccessTitle('Invoice Sent');
          setSuccessDescription(customerName ? `Email sent to ${customerName}` : 'Email sent to your client');
        } else {
          setSuccessTitle('Payment Link Ready');
          const detail = typeof data.email_error === 'string' && data.email_error ? ` (${data.email_error})` : '';
          setSuccessDescription(`Email was not sent${detail}. Share the payment link below.`);
        }
      } else {
        setSuccessTitle('Payment Link Ready');
        setSuccessDescription('No email sent. Share the payment link below.');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invoice');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInNewTab = () => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl border-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
              <Send2 size={20} color="#14462a" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Send Invoice
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-0.5">
                {invoiceNumber} • {currencySymbol}{total.toFixed(2)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="p-6 space-y-6">
            {/* Success State */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}>
                <TickCircle size={32} color="#14462a" variant="Bold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{successTitle}</h3>
                <p className="text-sm text-gray-500 mt-1">{successDescription}</p>
              </div>
            </div>

            {/* Public Link */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Payment Link</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <Link21 size={16} color="#6B7280" />
                  <span className="text-sm text-gray-600 truncate">{publicUrl}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyLink}
                  className="rounded-xl px-4 h-10 border-gray-200 hover:bg-gray-50"
                >
                  <Copy size={16} className={copied ? "text-green-600" : "text-gray-600"} />
                  <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Share this link with your client so they can pay online
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={openInNewTab}
                className="flex-1 rounded-full h-11 border-gray-200 hover:bg-gray-50"
              >
                <ExportSquare size={16} className="mr-2" />
                Preview
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full h-11 text-white"
                style={{ backgroundColor: '#14462a' }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-5">
            {/* Customer Info */}
            {customerName && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-gray-700 border border-gray-200">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
                  {customerEmail && (
                    <p className="text-xs text-gray-500 truncate">{customerEmail}</p>
                  )}
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Send to Email <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <Sms size={18} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#14462a] focus:ring-[#14462a]"
                />
              </div>
              <p className="text-xs text-gray-500">
                Leave blank to generate a payment link without sending an email
              </p>
            </div>

            {/* Invoice Summary */}
            <div className="p-4 rounded-xl bg-gray-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invoice Number</span>
                <span className="text-sm font-medium text-gray-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-sm font-semibold text-gray-900">{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700">
                <Danger size={18} variant="Bold" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 rounded-full h-11 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full h-11 text-white"
                style={{ backgroundColor: '#14462a' }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send2 size={18} />
                    <span>Send Invoice</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
