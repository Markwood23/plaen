"use client";

import { 
  InvoiceTemplateProps, 
  formatCurrency, 
  formatDate, 
  getStatusText 
} from './types';
import { Card } from 'iconsax-react';

/**
 * Minimal Template - Clean and simple with essential details only
 * Best for freelancers and creative professionals
 */
export function MinimalTemplate({ data, showPayButton = true, maskAmounts = false }: InvoiceTemplateProps) {
  const mask = (value: string) => maskAmounts ? '••••••' : value;
  
  return (
    <div className="bg-white">
      <div className="px-12 py-10 print:px-0">
        {/* Super Simple Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-1" style={{ color: '#111827' }}>
              Invoice
            </h1>
            <p className="text-base" style={{ color: '#9CA3AF' }}>{data.invoice_number}</p>
          </div>
          
          {/* Status Badge - Minimal */}
          {data.status && data.status !== 'draft' && (
            <span 
              className="text-xs font-medium uppercase tracking-wider px-3 py-1"
              style={{ 
                color: data.status === 'paid' ? '#14462a' : data.status === 'overdue' ? '#DC2626' : '#6B7280',
              }}
            >
              {getStatusText(data.status)}
            </span>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          {/* From */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>From</p>
            <p className="text-base font-medium mb-1" style={{ color: '#111827' }}>{data.business.name}</p>
            {data.business.email && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.business.email}</p>
            )}
          </div>
          
          {/* To */}
          {data.customer && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>To</p>
              <p className="text-base font-medium mb-1" style={{ color: '#111827' }}>{data.customer.name}</p>
              {data.customer.email && (
                <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.email}</p>
              )}
            </div>
          )}
        </div>

        {/* Dates - Inline */}
        <div className="flex gap-12 mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Date</p>
            <p className="text-sm" style={{ color: '#111827' }}>{formatDate(data.issue_date)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Due</p>
            <p className="text-sm" style={{ color: '#111827' }}>{formatDate(data.due_date)}</p>
          </div>
        </div>

        {/* Line Items - Simple List */}
        <div className="mb-12">
          <div className="space-y-4">
            {data.line_items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-start justify-between py-4"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <div className="flex-1">
                  <p className="text-base" style={{ color: '#111827' }}>{item.description}</p>
                  <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                    {item.quantity} × {mask(formatCurrency(item.unit_price, data.currency))}
                  </p>
                </div>
                <p className="text-base font-medium ml-8" style={{ color: '#111827' }}>
                  {mask(formatCurrency(item.amount, data.currency))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals - Right Aligned, Simple */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-2">
            {(data.discount_amount && data.discount_amount > 0) && (
              <>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#9CA3AF' }}>Subtotal</span>
                  <span style={{ color: '#6B7280' }}>{mask(formatCurrency(data.subtotal, data.currency))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#9CA3AF' }}>Discount</span>
                  <span style={{ color: '#DC2626' }}>-{mask(formatCurrency(data.discount_amount, data.currency))}</span>
                </div>
              </>
            )}
            
            {(data.tax_amount && data.tax_amount > 0) && (
              <div className="flex justify-between text-sm">
                <span style={{ color: '#9CA3AF' }}>Tax</span>
                <span style={{ color: '#6B7280' }}>{mask(formatCurrency(data.tax_amount, data.currency))}</span>
              </div>
            )}
            
            {/* Total - Prominent */}
            <div className="flex justify-between pt-4 mt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
              <span className="text-base" style={{ color: '#111827' }}>Total</span>
              <span className="text-2xl font-semibold" style={{ color: '#111827' }}>
                {mask(formatCurrency(data.total, data.currency))}
              </span>
            </div>

            {/* Balance Due if different */}
            {data.balance_due > 0 && data.balance_due !== data.total && (
              <div className="flex justify-between pt-2">
                <span className="text-sm" style={{ color: '#DC2626' }}>Balance Due</span>
                <span className="text-lg font-semibold" style={{ color: '#DC2626' }}>
                  {mask(formatCurrency(data.balance_due, data.currency))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button - Simple */}
        {showPayButton && data.payment_url && data.status !== 'paid' && data.status !== 'cancelled' && data.balance_due > 0 && (
          <div className="mb-12 print:hidden">
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#111827' }}
            >
              <Card size={18} color="currentColor" />
              Pay Now
            </a>
          </div>
        )}

        {/* Notes - If present */}
        {data.notes && (
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid #F3F4F6' }}>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>
              {data.notes}
            </p>
          </div>
        )}

        {/* Footer - Subtle */}
        <div className="mt-16 text-center">
          <p className="text-xs" style={{ color: '#D1D5DB' }}>
            {data.business.name}
          </p>
        </div>
      </div>
    </div>
  );
}
