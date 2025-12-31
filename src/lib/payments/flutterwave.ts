/**
 * Flutterwave Payment Integration
 * Handles all Flutterwave API interactions for payment processing
 */

// Types
import type { PaymentMethod } from '@/types/database'

export interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  environment: 'test' | 'live';
}

export interface InitiatePaymentParams {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  payment_options?: string;
  meta?: Record<string, any>;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface PaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

export interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: 'successful' | 'failed' | 'pending';
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
    meta?: Record<string, any>;
  };
}

export interface MobileMoneyPaymentParams {
  tx_ref: string;
  amount: number;
  currency: string;
  phone_number: string;
  network: 'MTN' | 'VODAFONE' | 'TIGO' | 'AIRTEL';
  email: string;
  fullname?: string;
  meta?: Record<string, any>;
  redirect_url?: string;
}

export interface MobileMoneyResponse {
  status: string;
  message: string;
  meta?: {
    authorization?: {
      mode: string;
      redirect: string;
    };
  };
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    processor_response: string;
  };
}

// Config check
export function isFlutterwaveConfigured(): boolean {
  return !!(
    process.env.FLUTTERWAVE_SECRET_KEY &&
    process.env.FLUTTERWAVE_PUBLIC_KEY
  );
}

// Get Flutterwave config
function getConfig(): FlutterwaveConfig {
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const encryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY || '';
  const environment = (process.env.FLUTTERWAVE_ENVIRONMENT || 'test') as 'test' | 'live';

  if (!publicKey || !secretKey) {
    throw new Error('Flutterwave API keys not configured');
  }

  return { publicKey, secretKey, encryptionKey, environment };
}

// Base API URL
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3';

/**
 * Make authenticated request to Flutterwave API
 */
async function flutterwaveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, any>
): Promise<T> {
  const config = getConfig();

  const response = await fetch(`${FLUTTERWAVE_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${config.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Flutterwave API request failed');
  }

  return data;
}

/**
 * Initialize a standard payment (redirect to Flutterwave checkout)
 */
export async function initializePayment(
  params: InitiatePaymentParams
): Promise<PaymentResponse> {
  return flutterwaveRequest<PaymentResponse>('/payments', 'POST', params);
}

/**
 * Initialize Mobile Money payment (Ghana)
 * Supports MTN, Vodafone, AirtelTigo
 */
export async function initiateMobileMoneyPayment(
  params: MobileMoneyPaymentParams
): Promise<MobileMoneyResponse> {
  // For Ghana Mobile Money
  return flutterwaveRequest<MobileMoneyResponse>('/charges?type=mobile_money_ghana', 'POST', params);
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(transactionId: string | number): Promise<VerifyPaymentResponse> {
  return flutterwaveRequest<VerifyPaymentResponse>(`/transactions/${transactionId}/verify`);
}

/**
 * Get payment status by transaction reference
 */
export async function getPaymentByTxRef(txRef: string): Promise<VerifyPaymentResponse> {
  return flutterwaveRequest<VerifyPaymentResponse>(`/transactions/verify_by_reference?tx_ref=${txRef}`);
}

/**
 * Verify Flutterwave webhook signature
 * Flutterwave sends a verif-hash header that should match your secret hash
 */
export function verifyWebhookSignature(
  requestBody: string,
  signature: string | null
): boolean {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  
  if (!secretHash) {
    console.warn('FLUTTERWAVE_WEBHOOK_SECRET_HASH not configured');
    return false;
  }

  return signature === secretHash;
}

/**
 * Parse webhook event type from Flutterwave
 */
export function parseWebhookEvent(body: any): {
  event: string;
  data: any;
} {
  return {
    event: body.event,
    data: body.data,
  };
}

/**
 * Generate a unique transaction reference
 */
export function generateTxRef(invoiceId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `PL-${invoiceId.slice(0, 8)}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Map Flutterwave payment status to our internal status
 */
export function mapPaymentStatus(flwStatus: string): 'pending' | 'success' | 'failed' {
  switch (flwStatus.toLowerCase()) {
    case 'successful':
      return 'success';
    case 'failed':
    case 'cancelled':
      return 'failed';
    default:
      return 'pending';
  }
}

/**
 * Map payment method string to rail type
 */
export function mapPaymentRail(paymentType: string): PaymentMethod {
  switch (paymentType.toLowerCase()) {
    case 'mobilemoneygh':
    case 'mobile_money_ghana':
    case 'momo':
      return 'mobile_money';
    case 'card':
      return 'card';
    case 'bank_transfer':
    case 'bank transfer':
      return 'bank_transfer';
    default:
      return 'other';
  }
}

/**
 * Get supported payment methods based on currency
 */
export function getSupportedPaymentMethods(currency: string): string[] {
  switch (currency.toUpperCase()) {
    case 'GHS':
      return ['card', 'mobilemoneyghana'];
    case 'NGN':
      return ['card', 'ussd', 'banktransfer'];
    case 'KES':
      return ['card', 'mpesa'];
    case 'ZAR':
      return ['card'];
    case 'USD':
    case 'EUR':
    case 'GBP':
      return ['card'];
    default:
      return ['card'];
  }
}

// Types exported at top of file
