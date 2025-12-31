"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TickCircle, 
  Danger,
  Mobile,
  Bank,
  Card,
  Money,
  Wallet
} from "iconsax-react";

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  balanceDue: number;
  currency: string;
  onSuccess?: () => void;
}

const PAYMENT_METHODS = [
  { id: 'mobile_money', label: 'Mobile Money', icon: Mobile, description: 'MTN, AirtelTigo, Vodafone' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Bank, description: 'Direct bank transfer' },
  { id: 'card', label: 'Card Payment', icon: Card, description: 'Credit/Debit card' },
  { id: 'cash', label: 'Cash', icon: Money, description: 'Physical cash payment' },
  { id: 'crypto', label: 'Cryptocurrency', icon: Wallet, description: 'Bitcoin, USDT, etc.' },
];

export function RecordPaymentModal({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  balanceDue,
  currency,
  onSuccess,
}: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<string>(balanceDue.toFixed(2));
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [payerName, setPayerName] = useState<string>("");
  const [payerPhone, setPayerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currencySymbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (numAmount > balanceDue) {
      setError(`Amount cannot exceed balance due (${currencySymbol}${balanceDue.toFixed(2)})`);
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/allocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          payment_method: paymentMethod,
          reference: reference || undefined,
          payment_date: paymentDate || undefined,
          payer_name: payerName || undefined,
          payer_phone: payerPhone || undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to record payment');
      }

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
        // Reset form
        setAmount(balanceDue.toFixed(2));
        setPaymentMethod("");
        setReference("");
        setPayerName("");
        setPayerPhone("");
        setNotes("");
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
              <TickCircle size={32} color="#0D9488" variant="Bold" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Recorded!</h3>
            <p className="text-gray-500 text-center">
              {currencySymbol}{parseFloat(amount).toFixed(2)} payment has been recorded for {invoiceNumber}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for invoice {invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              <Danger size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Balance Due Info */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Balance Due</span>
              <span className="text-lg font-semibold text-gray-900">
                {currencySymbol}{balanceDue.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currencySymbol}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={balanceDue}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter amount up to {currencySymbol}{balanceDue.toFixed(2)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-3">
                        <Icon size={18} color="#14462a" />
                        <div>
                          <span className="font-medium">{method.label}</span>
                          <span className="text-xs text-gray-400 ml-2">{method.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Reference & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., TXN123456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>

          {/* Payer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payerName">Payer Name</Label>
              <Input
                id="payerName"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Who made the payment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payerPhone">Payer Phone</Label>
              <Input
                id="payerPhone"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this payment"
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full"
              style={{ backgroundColor: '#14462a' }}
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
