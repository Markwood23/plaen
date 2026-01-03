// Invoice Template Types

export type InvoiceTemplateType = 'standard' | 'minimal' | 'professional' | 'modern';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number; // In minor units (cents/pesewas)
  amount: number; // In minor units (cents/pesewas)
}

export interface InvoiceCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
}

export interface InvoiceBusiness {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  website?: string | null;
  tax_id?: string | null;
}

export interface InvoiceTemplateData {
  // Invoice Info
  invoice_number: string;
  public_id?: string | null;
  issue_date: string;
  due_date: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'cancelled' | null;
  
  // Financial
  currency: string;
  subtotal: number; // In minor units
  discount_value?: number | null;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_amount?: number | null; // In minor units
  tax_rate?: number | null;
  tax_amount?: number | null; // In minor units
  total: number; // In minor units
  amount_paid?: number | null; // In minor units
  balance_due: number; // In minor units
  
  // Content
  line_items: InvoiceLineItem[];
  notes?: string | null;
  terms?: string | null;
  footer?: string | null;
  
  // Related
  customer: InvoiceCustomer | null;
  business: InvoiceBusiness;
  
  // Payment
  payment_url?: string | null;
}

export interface InvoiceTemplateProps {
  data: InvoiceTemplateData;
  showPayButton?: boolean;
  maskAmounts?: boolean;
  className?: string;
}

// Template metadata for selector
export interface InvoiceTemplateInfo {
  id: InvoiceTemplateType;
  name: string;
  description: string;
  previewImage?: string;
}

export const INVOICE_TEMPLATES: InvoiceTemplateInfo[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Classic business format with clear sections',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple with essential details only',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with detailed breakdowns',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with visual accents',
  },
];

// Utility functions
export function formatCurrency(amount: number, currency: string): string {
  const curr = currency?.toUpperCase() || 'GHS';
  const symbol = curr === 'GHS' ? '₵' : curr === 'USD' ? '$' : curr + ' ';
  const majorUnits = (amount || 0) / 100;
  return `${symbol}${majorUnits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: string | null): { bg: string; text: string; border?: string } {
  switch (status) {
    case 'paid':
      return { bg: 'rgba(20, 70, 42, 0.1)', text: '#14462a' };
    case 'partially_paid':
      return { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' };
    case 'overdue':
      return { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626' };
    case 'sent':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
    case 'cancelled':
      return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
    default:
      return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
  }
}

export function getStatusText(status: string | null): string {
  switch (status) {
    case 'paid': return 'Paid';
    case 'partially_paid': return 'Partially Paid';
    case 'overdue': return 'Overdue';
    case 'sent': return 'Sent';
    case 'cancelled': return 'Cancelled';
    default: return 'Draft';
  }
}
