/**
 * Payment State Management Hook
 * Handles payment flow state machine and transitions
 */

import { useState, useCallback, useEffect } from 'react';

export type PaymentMethod = 'momo' | 'bank' | 'card' | 'external';
export type PaymentStatus = 
  | 'idle' 
  | 'selecting' 
  | 'processing' 
  | 'pending' 
  | 'success' 
  | 'declined' 
  | 'offline' 
  | 'expired'
  | 'already_paid';

export interface PaymentState {
  status: PaymentStatus;
  method: PaymentMethod | null;
  amount: number;
  error: string | null;
  transactionId: string | null;
  receiptData: ReceiptData | null;
}

export interface ReceiptData {
  transactionId: string;
  amount: number;
  method: PaymentMethod | string;
  timestamp: string;
  invoiceNumber: string;
  reference: string;
  receiptNumber?: string;
  payerName?: string;
  payerEmail?: string;
  businessName?: string;
  currency?: string;
  remainingBalance?: number;
}

interface UsePayStateReturn {
  state: PaymentState;
  selectMethod: (method: PaymentMethod) => void;
  setAmount: (amount: number) => void;
  initiatePayment: () => Promise<void>;
  retryPayment: () => Promise<void>;
  resetPayment: () => void;
  isLoading: boolean;
  canPay: boolean;
}

export function usePayState(
  invoiceId: string,
  initialAmount: number,
  onPaymentComplete?: (data: ReceiptData) => void
): UsePayStateReturn {
  const [state, setState] = useState<PaymentState>({
    status: 'idle',
    method: null,
    amount: initialAmount,
    error: null,
    transactionId: null,
    receiptData: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Check if invoice is already paid or expired on mount
  useEffect(() => {
    checkInvoiceStatus();
  }, [invoiceId]);

  const checkInvoiceStatus = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`);
      const data = await response.json();
      
      if (data.status === 'paid') {
        setState(prev => ({ ...prev, status: 'already_paid' }));
      } else if (data.status === 'expired') {
        setState(prev => ({ ...prev, status: 'expired' }));
      }
    } catch (error) {
      console.error('Failed to check invoice status:', error);
    }
  };

  const selectMethod = useCallback((method: PaymentMethod) => {
    setState(prev => ({
      ...prev,
      method,
      status: 'selecting',
      error: null,
    }));

    // Track method selection
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('payment_method_selected', {
        invoice_id: invoiceId,
        method,
      });
    }
  }, [invoiceId]);

  const setAmount = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      amount,
      error: null,
    }));
  }, []);

  const initiatePayment = useCallback(async () => {
    if (!state.method || state.amount <= 0) {
      setState(prev => ({
        ...prev,
        error: 'Please select a payment method and enter an amount',
      }));
      return;
    }

    setIsLoading(true);
    setState(prev => ({ ...prev, status: 'processing', error: null }));

    // Track payment initiation
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('payment_initiated', {
        invoice_id: invoiceId,
        method: state.method,
        amount: state.amount,
      });
    }

    try {
      // Check for offline
      if (!navigator.onLine) {
        setState(prev => ({
          ...prev,
          status: 'offline',
          error: 'No internet connection. Please check your connection and try again.',
        }));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: invoiceId,
          method: state.method,
          amount: state.amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Set transaction ID and move to pending
      setState(prev => ({
        ...prev,
        transactionId: data.transaction_id,
        status: 'pending',
      }));

      // If provider requires a redirect (e.g., Flutterwave checkout), go there.
      if (data.redirect_url && typeof window !== 'undefined') {
        window.location.href = data.redirect_url;
        return;
      }

      // Poll for payment status
      pollPaymentStatus(data.transaction_id);
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'declined',
        error: error instanceof Error ? error.message : 'Payment failed. Please try again.',
      }));

      // Track failure
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('payment_failed', {
          invoice_id: invoiceId,
          method: state.method,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [state.method, state.amount, invoiceId]);

  const pollPaymentStatus = async (transactionId: string) => {
    const maxAttempts = 60; // Poll for up to 5 minutes (5s intervals)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/payments/${transactionId}/status`);
        const data = await response.json();

        if (data.status === 'success') {
          const receiptData: ReceiptData = {
            transactionId: data.transaction_id,
            amount: data.amount,
            method: state.method!,
            timestamp: data.timestamp,
            invoiceNumber: data.invoice_number,
            reference: data.reference,
            receiptNumber: data.receipt_number,
            payerName: data.payer_name,
            payerEmail: data.payer_email,
            businessName: data.business_name,
            currency: data.currency || 'GHS',
            remainingBalance: data.remaining_balance,
          };

          setState(prev => ({
            ...prev,
            status: 'success',
            receiptData,
          }));

          // Track success
          if (typeof window !== 'undefined' && (window as any).analytics) {
            (window as any).analytics.track('payment_completed', {
              invoice_id: invoiceId,
              method: state.method,
              amount: state.amount,
              transaction_id: transactionId,
            });
          }

          onPaymentComplete?.(receiptData);
          return;
        }

        if (data.status === 'failed' || data.status === 'declined') {
          setState(prev => ({
            ...prev,
            status: 'declined',
            error: data.message || 'Payment was declined',
          }));
          return;
        }

        // Continue polling if still pending
        if (data.status === 'pending' && attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        } else if (attempts >= maxAttempts) {
          setState(prev => ({
            ...prev,
            error: 'Payment is taking longer than expected. Please check back later.',
          }));
        }
      } catch (error) {
        console.error('Failed to poll payment status:', error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        }
      }
    };

    poll();
  };

  const retryPayment = useCallback(async () => {
    setState(prev => ({
      ...prev,
      status: 'selecting',
      error: null,
      transactionId: null,
    }));
  }, []);

  const resetPayment = useCallback(() => {
    setState({
      status: 'idle',
      method: null,
      amount: initialAmount,
      error: null,
      transactionId: null,
      receiptData: null,
    });
  }, [initialAmount]);

  const canPay = state.method !== null && 
                 state.amount > 0 && 
                 state.status !== 'processing' && 
                 state.status !== 'pending' &&
                 state.status !== 'already_paid' &&
                 state.status !== 'expired';

  return {
    state,
    selectMethod,
    setAmount,
    initiatePayment,
    retryPayment,
    resetPayment,
    isLoading,
    canPay,
  };
}
