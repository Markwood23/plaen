/**
 * Payment API Layer
 * Handles all payment-related API calls
 */

export interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  
  from: {
    business_name: string;
    email: string;
    phone: string;
    address?: string;
  };
  
  bill_to: {
    name: string;
    company?: string;
    email?: string;
  };
  
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    details?: string;
  }>;
  
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    amount_paid: number;
    balance_due: number;
  };
  
  payment_methods: Array<'momo' | 'bank' | 'card' | 'external'>;
  
  // Optional fields from PRD
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
  }>;
  payment_history?: Array<{
    id: string;
    date: string;
    amount: number;
    method: string;
    reference: string;
    status: string;
  }>;
}

export interface PaymentInitiateRequest {
  invoice_id: string;
  method: 'momo' | 'bank' | 'card' | 'external';
  amount: number;
  metadata?: Record<string, any>;
}

export interface PaymentInitiateResponse {
  transaction_id: string;
  status: 'pending' | 'requires_action';
  redirect_url?: string;
  message?: string;
}

export interface PaymentStatusResponse {
  transaction_id: string;
  status: 'pending' | 'success' | 'failed' | 'declined';
  amount: number;
  timestamp: string;
  invoice_number: string;
  reference: string;
  message?: string;
}

export interface RecordExternalPaymentRequest {
  invoice_id: string;
  amount: number;
  payment_date: string;
  reference: string;
  notes?: string;
}

class PaymentAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch invoice details by ID (public endpoint - no auth required)
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/pay/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch invoice' }));
      throw new Error(error.message || 'Failed to fetch invoice');
    }

    return response.json();
  }

  /**
   * Check invoice status (paid, expired, etc.)
   */
  async getInvoiceStatus(invoiceId: string): Promise<{ status: string; expires_at?: string }> {
    const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check invoice status');
    }

    return response.json();
  }

  /**
   * Initiate a payment
   */
  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    const response = await fetch(`${this.baseUrl}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment initiation failed' }));
      throw new Error(error.message || 'Payment initiation failed');
    }

    return response.json();
  }

  /**
   * Get payment status by transaction ID
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${this.baseUrl}/payments/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    return response.json();
  }

  /**
   * Record an external payment (e.g., cash, check)
   */
  async recordExternalPayment(request: RecordExternalPaymentRequest): Promise<{ success: boolean; payment_id: string }> {
    const response = await fetch(`${this.baseUrl}/payments/external`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to record payment' }));
      throw new Error(error.message || 'Failed to record payment');
    }

    return response.json();
  }

  /**
   * Download receipt PDF
   */
  async downloadReceipt(transactionId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/payments/${transactionId}/receipt`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to download receipt');
    }

    return response.blob();
  }
}

// Export singleton instance
export const paymentAPI = new PaymentAPI();

// Export class for testing
export { PaymentAPI };
