/**
 * Payment Methods Component
 * Handles method selection and displays appropriate payment forms
 * Lazy loads payment SDKs only when method is selected
 */

"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Smartphone, Banknote, CreditCard, FileText, Loader2, Info, Copy, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { PaymentMethod } from "@/hooks/usePayState";

// Lazy load payment SDKs
const loadMoMoSDK = () => import('@/lib/sdk/momo');
const loadCardSDK = () => import('@/lib/sdk/card');

interface PayMethodsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  amount: number;
  onInitiatePayment: (data: any) => void;
  isProcessing: boolean;
  availableMethods: Array<'momo' | 'bank' | 'card' | 'external'>;
  invoiceNumber: string;
}

export function PayMethods({
  selectedMethod,
  onSelectMethod,
  amount,
  onInitiatePayment,
  isProcessing,
  availableMethods,
  invoiceNumber,
}: PayMethodsProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSDKError] = useState<string | null>(null);

  // Load SDK when method is selected
  useEffect(() => {
    if (!selectedMethod) return;

    const loadSDK = async () => {
      try {
        setSdkLoaded(false);
        setSDKError(null);

        if (selectedMethod === 'momo') {
          await loadMoMoSDK();
        } else if (selectedMethod === 'card') {
          await loadCardSDK();
        }

        setSdkLoaded(true);
      } catch (error) {
        console.error('Failed to load payment SDK:', error);
        setSDKError('Failed to load payment provider. Please try again.');
      }
    };

    if (selectedMethod === 'momo' || selectedMethod === 'card') {
      loadSDK();
    } else {
      setSdkLoaded(true); // Bank and external don't need SDKs
    }
  }, [selectedMethod]);

  // Color mapping for each payment method
  const getMethodColor = (methodId: PaymentMethod) => {
    const colors = {
      'momo': '#FFF4E6',    // Soft orange for mobile
      'bank': '#E8F4FD',    // Soft blue for bank
      'card': '#F3E8FF',    // Soft purple for cards
      'external': '#E8F9F1', // Soft green for external
    };
    return colors[methodId] || '#F9F9F9';
  };

  const paymentMethods = [
    {
      id: 'momo' as const,
      name: 'Mobile Money',
      description: 'MTN, Vodafone, AirtelTigo',
      icon: '/icons/mobile.png',
      iconType: 'image' as const,
      available: availableMethods.includes('momo'),
    },
    {
      id: 'bank' as const,
      name: 'Bank Transfer',
      description: 'Direct bank deposit',
      icon: '/icons/bank.png',
      iconType: 'image' as const,
      available: availableMethods.includes('bank'),
    },
    {
      id: 'card' as const,
      name: 'Card Payment',
      description: 'Visa, Mastercard',
      icon: '/icons/credit-card.png',
      iconType: 'image' as const,
      available: availableMethods.includes('card'),
    },
    {
      id: 'external' as const,
      name: 'Record Payment',
      description: 'Already paid externally',
      icon: '/icons/transfer-money.png',
      iconType: 'image' as const,
      available: availableMethods.includes('external'),
    },
  ].filter(method => method.available);

  // Get currently selected method details
  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <div>
        <h3 className="pay-section-header">Select Payment Method</h3>
        
        <Select 
          value={selectedMethod || undefined} 
          onValueChange={(value) => onSelectMethod(value as PaymentMethod)}
        >
          <SelectTrigger className="h-auto min-h-[64px] py-4 border-2 transition-colors rounded-full" style={{ borderColor: '#E4E6EB' }}>
            {currentMethod ? (
              <div className="flex items-center gap-3 text-left w-full">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: getMethodColor(currentMethod.id) }}
                >
                  <Image 
                    src={currentMethod.icon} 
                    alt={currentMethod.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <span className="text-lg font-bold font-outfit" style={{ color: '#212121' }}>
                    {currentMethod.name}
                  </span>
                  <span className="text-body font-medium font-outfit text-[#B0B3B8]">
                    {currentMethod.description}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                  <Image 
                    src="/icons/transfer-money.png" 
                    alt="Payment" 
                    width={32} 
                    height={32}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold font-outfit" style={{ color: '#212121' }}>
                    Choose how you'd like to pay
                  </span>
                  <span className="text-body font-medium font-outfit text-[#B0B3B8]">
                    Select a payment method below
                  </span>
                </div>
              </div>
            )}
          </SelectTrigger>
          <SelectContent align="start" className="w-[var(--radix-select-trigger-width)] rounded-3xl overflow-hidden">
            {paymentMethods.map((method) => (
              <SelectItem 
                key={method.id} 
                value={method.id} 
                className="h-auto py-4 pl-3 pr-12 cursor-pointer hover:bg-[#F9F9F9] data-[state=checked]:bg-[#F9F9F9] focus:bg-[#F9F9F9] rounded-2xl"
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: getMethodColor(method.id) }}
                  >
                    <Image 
                      src={method.icon} 
                      alt={method.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-base font-medium font-outfit" style={{ color: '#212121' }}>
                      {method.name}
                    </span>
                    <span className="text-body font-medium font-outfit text-[#B0B3B8]">
                      {method.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Method-specific forms */}
      {selectedMethod && (
        <div className="pt-4 -mx-4 px-4">
          {!sdkLoaded && (selectedMethod === 'momo' || selectedMethod === 'card') ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" style={{ opacity: 0.5 }} />
              <span className="ml-3 text-body-sm text-[#B0B3B8]">Loading payment provider...</span>
            </div>
          ) : sdkError ? (
            <div className="py-6 px-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
              <p className="text-body-sm" style={{ color: '#212121' }}>{sdkError}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3"
                onClick={() => setSDKError(null)}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {selectedMethod === 'momo' && <MoMoForm onSubmit={onInitiatePayment} isProcessing={isProcessing} />}
              {selectedMethod === 'bank' && <BankTransferInfo amount={amount} onSubmit={onInitiatePayment} isProcessing={isProcessing} invoiceNumber={invoiceNumber} />}
              {selectedMethod === 'card' && <CardForm onSubmit={onInitiatePayment} isProcessing={isProcessing} />}
              {selectedMethod === 'external' && <ExternalPaymentForm onSubmit={onInitiatePayment} isProcessing={isProcessing} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Mobile Money Form
function MoMoForm({ onSubmit, isProcessing }: { onSubmit: (data: any) => void; isProcessing: boolean }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'mtn' | 'vodafone' | 'airtel'>('mtn');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const providers = [
    { value: 'mtn', label: 'MTN Mobile Money', logo: '/logos/mtn-mobile-money.png' },
    { value: 'vodafone', label: 'Vodafone Cash', logo: '/logos/vodafone-cash.png' },
    { value: 'airtel', label: 'AirtelTigo Cash', logo: '/logos/tigo-cash.png' },
  ];

  // Format phone number as xxx-xxx-xxxx
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = numbers.slice(0, 10);
    
    // Format as xxx-xxx-xxxx
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove dashes before submitting
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    onSubmit({ phoneNumber: cleanNumber, provider });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-label mb-2 block">Network Provider</Label>
        <Select value={provider} onValueChange={(value: any) => setProvider(value)}>
          <SelectTrigger className="!h-14 rounded-full">
            <SelectValue>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-[0.5px] border-white shadow-sm overflow-hidden relative">
                  <Image 
                    src={providers.find(p => p.value === provider)?.logo || providers[0].logo}
                    alt={providers.find(p => p.value === provider)?.label || providers[0].label}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-base font-medium font-outfit">{providers.find(p => p.value === provider)?.label || providers[0].label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-3xl overflow-hidden">
            {providers.map((p) => (
              <SelectItem 
                key={p.value} 
                value={p.value}
                className="h-auto py-4 pl-3 pr-12 cursor-pointer hover:bg-[#F9F9F9] data-[state=checked]:bg-[#F9F9F9] focus:bg-[#F9F9F9] rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-[0.5px] border-white shadow-sm overflow-hidden relative">
                    <Image 
                      src={p.logo}
                      alt={p.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-base font-medium font-outfit">{p.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-label mb-2 block">Mobile Money Number</Label>
        <Input
          type="tel"
          placeholder="024-000-0000"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="h-14 rounded-full text-base font-medium font-outfit"
          required
        />
      </div>

      <div className="rounded-lg p-3 flex items-start gap-2" style={{ backgroundColor: '#F9F9F9' }}>
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ opacity: 0.6 }} />
        <p className="text-body-sm leading-snug text-[#B0B3B8]">
          You'll receive a prompt on your phone. Enter your PIN to approve the payment.
        </p>
      </div>

      <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
        <Checkbox
          id="momo-terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          className="mt-0.5"
        />
        <Label
          htmlFor="momo-terms"
          className="text-body-sm cursor-pointer font-medium font-outfit flex-1"
          style={{ color: '#212121', lineHeight: '1.4' }}
        >
          I authorize this payment and understand that all transactions are secure, final, and non-refundable.
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-white hover:opacity-90 rounded-full text-base font-bold font-outfit"
        disabled={isProcessing || !phoneNumber || !acceptedTerms}
        style={{ 
          backgroundColor: '#1877F2',
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Continue to Payment'
        )}
      </Button>
    </form>
  );
}

// Bank Transfer Info
function BankTransferInfo({ amount, onSubmit, isProcessing, invoiceNumber }: { amount: number; onSubmit: (data: any) => void; isProcessing: boolean; invoiceNumber: string }) {
  const [transferCompleted, setTransferCompleted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Format invoice number (e.g., INV-2024-001 becomes #2024001)
  const formatInvoiceNumber = (invoiceNum: string) => {
    const parts = invoiceNum.split('-');
    if (parts.length === 3) {
      return `#${parts[1]}${parts[2]}`;
    }
    // If already in new format or custom format, return as-is
    return invoiceNum;
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ method: 'bank_transfer', amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#F9F9F9' }}>
        <h4 className="text-label">Transfer Details</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E4E6EB' }}>
            <span className="text-body-sm text-[#B0B3B8]">Bank</span>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-emphasis">GCB Bank</span>
              <button
                type="button"
                onClick={() => handleCopy('GCB Bank', 'bank')}
                className="p-1 hover:bg-white rounded transition-colors"
                aria-label="Copy bank name"
              >
                {copiedField === 'bank' ? (
                  <Check className="h-4 w-4" style={{ color: '#1877F2' }} />
                ) : (
                  <Copy className="h-4 w-4 text-[#B0B3B8]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E4E6EB' }}>
            <span className="text-body-sm text-[#B0B3B8]">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="text-mono">1234567890</span>
              <button
                type="button"
                onClick={() => handleCopy('1234567890', 'account')}
                className="p-1 hover:bg-white rounded transition-colors"
                aria-label="Copy account number"
              >
                {copiedField === 'account' ? (
                  <Check className="h-4 w-4" style={{ color: '#1877F2' }} />
                ) : (
                  <Copy className="h-4 w-4 text-[#B0B3B8]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E4E6EB' }}>
            <span className="text-body-sm text-[#B0B3B8]">Account Name</span>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-emphasis">Plaen Payments</span>
              <button
                type="button"
                onClick={() => handleCopy('Plaen Payments', 'name')}
                className="p-1 hover:bg-white rounded transition-colors"
                aria-label="Copy account name"
              >
                {copiedField === 'name' ? (
                  <Check className="h-4 w-4" style={{ color: '#1877F2' }} />
                ) : (
                  <Copy className="h-4 w-4 text-[#B0B3B8]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-body-sm text-[#B0B3B8]">Reference</span>
            <div className="flex items-center gap-2">
              <span className="text-mono text-emphasis font-outfit" style={{ fontWeight: 600 }}>{formatInvoiceNumber(invoiceNumber)}</span>
              <button
                type="button"
                onClick={() => handleCopy(formatInvoiceNumber(invoiceNumber), 'reference')}
                className="p-1 hover:bg-white rounded transition-colors"
                aria-label="Copy reference"
              >
                {copiedField === 'reference' ? (
                  <Check className="h-4 w-4" style={{ color: '#1877F2' }} />
                ) : (
                  <Copy className="h-4 w-4 text-[#B0B3B8]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-3 flex items-start gap-2" style={{ backgroundColor: '#F9F9F9' }}>
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ opacity: 0.6 }} />
        <p className="text-body-sm leading-snug text-[#B0B3B8]">
          After making the transfer, payment will be confirmed within 24 hours. Include the reference number for faster processing.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
          <Checkbox
            id="transfer-completed"
            checked={transferCompleted}
            onCheckedChange={(checked) => setTransferCompleted(checked as boolean)}
            className="mt-0.5"
          />
          <Label
            htmlFor="transfer-completed"
            className="text-body-sm cursor-pointer font-medium font-outfit flex-1"
            style={{ color: '#212121', lineHeight: '1.4' }}
          >
            I confirm that I have completed this bank transfer
          </Label>
        </div>

        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
          <Checkbox
            id="bank-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label
            htmlFor="bank-terms"
            className="text-body-sm cursor-pointer font-medium font-outfit flex-1"
            style={{ color: '#212121', lineHeight: '1.4' }}
          >
            I understand that all transactions are secure, final, and non-refundable.
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-white hover:opacity-90 rounded-full text-base font-bold font-outfit"
        disabled={isProcessing || !transferCompleted || !acceptedTerms}
        style={{ 
          backgroundColor: '#1877F2',
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Transfer'
        )}
      </Button>
    </form>
  );
}

// Card Form
function CardForm({ onSubmit, isProcessing }: { onSubmit: (data: any) => void; isProcessing: boolean }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCVV] = useState('');
  const [name, setName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Format card number as xxxx xxxx xxxx xxxx
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 16);
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 4);
    
    if (limited.length >= 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    return limited;
  };

  // Format CVV (digits only, max 4)
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setCVV(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove formatting before submitting
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const cleanExpiry = expiry.replace(/\//g, '');
    onSubmit({ cardNumber: cleanCardNumber, expiry: cleanExpiry, cvv, name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-label mb-2 block">Card Number</Label>
        <Input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="h-14 rounded-full text-base font-medium font-outfit tracking-wide"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-label mb-2 block">Expiry</Label>
          <Input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            className="h-14 rounded-full text-base font-medium font-outfit"
            maxLength={5}
            required
          />
        </div>
        <div>
          <Label className="text-label mb-2 block">CVV</Label>
          <Input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={handleCVVChange}
            className="h-14 rounded-full text-base font-medium font-outfit"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-label mb-2 block">Cardholder Name</Label>
        <Input
          type="text"
          placeholder="Name on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-14 rounded-full text-base font-medium font-outfit uppercase"
          required
        />
      </div>

      <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
        <Checkbox
          id="card-terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          className="mt-0.5"
        />
        <Label
          htmlFor="card-terms"
          className="text-body-sm cursor-pointer font-medium font-outfit flex-1"
          style={{ color: '#212121', lineHeight: '1.4' }}
        >
          I authorize this payment and understand that all transactions are secure, final, and non-refundable.
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-white hover:opacity-90 rounded-full text-base font-bold font-outfit"
        disabled={isProcessing || !cardNumber || !expiry || !cvv || !name || !acceptedTerms}
        style={{ 
          backgroundColor: '#1877F2',
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
}

// External Payment Form
function ExternalPaymentForm({ onSubmit, isProcessing }: { onSubmit: (data: any) => void; isProcessing: boolean }) {
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ reference, paymentDate, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-label mb-2 block">Payment Reference</Label>
        <Input
          type="text"
          placeholder="e.g., Check #1234, Cash Receipt"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="h-14 rounded-full text-base font-medium font-outfit"
          required
        />
      </div>

      <div>
        <Label className="text-label mb-2 block">Payment Date</Label>
        <Input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="h-14 rounded-full text-base font-medium font-outfit"
          required
        />
      </div>

      <div>
        <Label className="text-label mb-2 block">Notes (Optional)</Label>
        <Input
          type="text"
          placeholder="Additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-14 rounded-full text-base font-medium font-outfit"
        />
      </div>

      <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#F9F9F9' }}>
        <Checkbox
          id="external-terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          className="mt-0.5"
        />
        <Label
          htmlFor="external-terms"
          className="text-body-sm cursor-pointer font-medium font-outfit flex-1"
          style={{ color: '#212121', lineHeight: '1.4' }}
        >
          I confirm this payment was received and understand that all records are final and non-refundable.
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-white hover:opacity-90 rounded-full text-base font-bold font-outfit"
        disabled={isProcessing || !reference || !paymentDate || !acceptedTerms}
        style={{ 
          backgroundColor: '#1877F2',
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Recording...
          </>
        ) : (
          'Record Payment'
        )}
      </Button>
    </form>
  );
}
