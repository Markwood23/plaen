'use client';

import { use, useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo';

interface PaymentResult {
  status: 'loading' | 'success' | 'failed' | 'pending' | 'error';
  message: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
}

function PaymentCallbackContent({ invoiceId }: { invoiceId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<PaymentResult>({
    status: 'loading',
    message: 'Verifying your payment...',
  });

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const txRef = searchParams.get('tx_ref');
        const transactionId = searchParams.get('transaction_id');
        const status = searchParams.get('status');

        // If Flutterwave returned with status=cancelled
        if (status === 'cancelled') {
          setResult({
            status: 'failed',
            message: 'Payment was cancelled. You can try again.',
          });
          return;
        }

        if (!txRef && !transactionId) {
          setResult({
            status: 'error',
            message: 'Missing payment reference. Please contact support.',
          });
          return;
        }

        // Verify the payment with our API
        const response = await fetch(`/api/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tx_ref: txRef,
            transaction_id: transactionId,
            invoice_id: invoiceId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setResult({
            status: 'success',
            message: 'Payment successful! Thank you for your payment.',
            transactionId: data.transaction_id || txRef,
            amount: data.amount,
            currency: data.currency,
          });
        } else if (data.status === 'pending') {
          setResult({
            status: 'pending',
            message: 'Your payment is being processed. You will be notified once confirmed.',
            transactionId: txRef || transactionId || undefined,
          });
        } else {
          setResult({
            status: 'failed',
            message: data.message || 'Payment verification failed. Please contact support.',
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setResult({
          status: 'error',
          message: 'Failed to verify payment. Please check your email for confirmation.',
        });
      }
    };

    verifyPayment();
  }, [invoiceId, searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoIcon className="h-8 w-auto" />
        </div>

        {/* Status Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          {result.status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-gray-400" />
              <h1 className="text-xl font-semibold mb-2">Verifying Payment</h1>
              <p className="text-gray-600">{result.message}</p>
            </>
          )}

          {result.status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold mb-2 text-green-800">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">{result.message}</p>
              {result.amount && result.currency && (
                <p className="text-2xl font-bold mb-4">
                  {result.currency} {result.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              )}
              {result.transactionId && (
                <p className="text-sm text-gray-500 mb-6">
                  Reference: {result.transactionId}
                </p>
              )}
              <Button 
                onClick={() => router.push(`/pay/${invoiceId}`)}
                className="w-full"
              >
                View Invoice
              </Button>
            </>
          )}

          {result.status === 'pending' && (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold mb-2 text-yellow-800">Payment Processing</h1>
              <p className="text-gray-600 mb-4">{result.message}</p>
              {result.transactionId && (
                <p className="text-sm text-gray-500 mb-6">
                  Reference: {result.transactionId}
                </p>
              )}
              <Button 
                variant="outline"
                onClick={() => router.push(`/pay/${invoiceId}`)}
                className="w-full"
              >
                Back to Invoice
              </Button>
            </>
          )}

          {result.status === 'failed' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold mb-2 text-red-800">Payment Failed</h1>
              <p className="text-gray-600 mb-6">{result.message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push(`/pay/${invoiceId}`)}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:support@plaen.co'}
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            </>
          )}

          {result.status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-600" />
              </div>
              <h1 className="text-xl font-semibold mb-2">Something Went Wrong</h1>
              <p className="text-gray-600 mb-6">{result.message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push(`/pay/${invoiceId}`)}
                  className="w-full"
                >
                  Back to Invoice
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:support@plaen.co'}
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by <span className="font-medium">Plaen</span>
        </p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: invoiceId } = use(params);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <LogoIcon className="h-8 w-auto" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-gray-400" />
            <h1 className="text-xl font-semibold mb-2">Verifying Payment</h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentCallbackContent invoiceId={invoiceId} />
    </Suspense>
  );
}
