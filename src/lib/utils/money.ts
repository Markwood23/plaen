/**
 * Money/Currency Utilities
 * 
 * All monetary values are stored in minor units (cents/pesewas) to avoid
 * floating-point precision issues.
 */

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP' | 'NGN';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; decimals: number; name: string }> = {
  GHS: { symbol: '₵', decimals: 2, name: 'Ghana Cedi' },
  USD: { symbol: '$', decimals: 2, name: 'US Dollar' },
  EUR: { symbol: '€', decimals: 2, name: 'Euro' },
  GBP: { symbol: '£', decimals: 2, name: 'British Pound' },
  NGN: { symbol: '₦', decimals: 2, name: 'Nigerian Naira' },
};

/**
 * Convert major units (e.g., 12.50) to minor units (e.g., 1250)
 */
export function toMinorUnits(amount: number, currency: Currency = 'GHS'): number {
  const { decimals } = CURRENCY_CONFIG[currency];
  const multiplier = Math.pow(10, decimals);
  // Round to avoid floating-point issues
  return Math.round(amount * multiplier);
}

/**
 * Convert minor units (e.g., 1250) to major units (e.g., 12.50)
 */
export function toMajorUnits(minorAmount: number, currency: Currency = 'GHS'): number {
  const { decimals } = CURRENCY_CONFIG[currency];
  const divisor = Math.pow(10, decimals);
  return minorAmount / divisor;
}

/**
 * Format amount for display
 */
export function formatCurrency(
  minorAmount: number,
  currency: Currency = 'GHS',
  options: { showSymbol?: boolean; locale?: string } = {}
): string {
  const { showSymbol = true, locale = 'en-US' } = options;
  const { symbol, decimals } = CURRENCY_CONFIG[currency];
  const majorAmount = toMajorUnits(minorAmount, currency);
  
  const formatted = majorAmount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return showSymbol ? `${symbol}${formatted}` : formatted;
}

/**
 * Parse a string amount to minor units
 */
export function parseAmount(input: string, currency: Currency = 'GHS'): number | null {
  // Remove currency symbols and whitespace
  const cleaned = input.replace(/[₵$€£₦,\s]/g, '').trim();
  
  if (!cleaned) return null;
  
  // Validate: must be a valid decimal number (at most one decimal point)
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return null;
  
  return toMinorUnits(parsed, currency);
}

/**
 * Calculate line item total in minor units
 */
export function calculateLineItemTotal(
  quantity: number,
  unitPriceMinor: number,
  taxRateBps: number = 0,
  discountMinor: number = 0
): { subtotal: number; tax: number; total: number } {
  const subtotal = Math.round(quantity * unitPriceMinor);
  const afterDiscount = Math.max(0, subtotal - discountMinor);
  const tax = Math.round(afterDiscount * (taxRateBps / 10000));
  const total = afterDiscount + tax;
  
  return { subtotal, tax, total };
}

/**
 * Calculate invoice totals from line items
 */
export function calculateInvoiceTotals(
  items: Array<{
    quantity: number;
    unitPriceMinor: number;
    taxRateBps?: number;
    discountMinor?: number;
  }>,
  invoiceDiscountMinor: number = 0,
  invoiceTaxRateBps: number = 0
): {
  subtotal: number;
  itemTax: number;
  itemDiscount: number;
  invoiceDiscount: number;
  invoiceTax: number;
  total: number;
} {
  let subtotal = 0;
  let itemTax = 0;
  let itemDiscount = 0;
  
  for (const item of items) {
    const lineCalc = calculateLineItemTotal(
      item.quantity,
      item.unitPriceMinor,
      item.taxRateBps || 0,
      item.discountMinor || 0
    );
    subtotal += lineCalc.subtotal;
    itemTax += lineCalc.tax;
    itemDiscount += item.discountMinor || 0;
  }
  
  // Apply invoice-level discount and tax
  const afterItemTax = subtotal - itemDiscount + itemTax;
  const afterInvoiceDiscount = Math.max(0, afterItemTax - invoiceDiscountMinor);
  const invoiceTax = Math.round(afterInvoiceDiscount * (invoiceTaxRateBps / 10000));
  const total = afterInvoiceDiscount + invoiceTax;
  
  return {
    subtotal,
    itemTax,
    itemDiscount,
    invoiceDiscount: invoiceDiscountMinor,
    invoiceTax,
    total,
  };
}

/**
 * Calculate balance due after payments
 */
export function calculateBalanceDue(
  totalMinor: number,
  paymentsMinor: number[]
): number {
  const totalPaid = paymentsMinor.reduce((sum, p) => sum + p, 0);
  return Math.max(0, totalMinor - totalPaid);
}

/**
 * Validate amount is positive and within reasonable bounds
 */
export function validateAmount(minorAmount: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(minorAmount)) {
    return { valid: false, error: 'Amount must be a whole number (minor units)' };
  }
  
  if (minorAmount < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }
  
  // Max ~1 billion in major units
  if (minorAmount > 100_000_000_000) {
    return { valid: false, error: 'Amount exceeds maximum allowed' };
  }
  
  return { valid: true };
}
