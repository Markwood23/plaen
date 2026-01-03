"use client";

import { 
  InvoiceTemplateProps, 
  formatCurrency, 
  formatDate, 
  getStatusColor, 
  getStatusText 
} from './types';
import { TickCircle, Clock, Coin1, Card, Building, Call, Sms } from 'iconsax-react';

/**
 * Professional Template - Corporate style with detailed breakdowns
 * Best for B2B invoices and enterprise clients
 */
export function ProfessionalTemplate({ data, showPayButton = true, maskAmounts = false }: InvoiceTemplateProps) {
  const statusColors = getStatusColor(data.status);
  const mask = (value: string) => maskAmounts ? '••••••' : value;
  
  const StatusIcon = () => {
    if (data.status === 'paid') return <TickCircle size={14} color="currentColor" />;
    if (data.status === 'partially_paid') return <Coin1 size={14} color="currentColor" />;
    return <Clock size={14} color="currentColor" />;
  };

  return (
    <div className="bg-white">
      {/* Header Bar */}
      <div className="px-12 py-6" style={{ backgroundColor: '#14462a' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data.business.logo_url ? (
              <img 
                src={data.business.logo_url} 
                alt={data.business.name}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 text-white text-lg font-bold">
                {data.business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-white">{data.business.name}</h1>
              {data.business.tax_id && (
                <p className="text-xs text-white/70">Tax ID: {data.business.tax_id}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">INVOICE</p>
            <p className="text-sm text-white/70">{data.invoice_number}</p>
          </div>
        </div>
      </div>

      <div className="px-12 py-8 print:px-0">
        {/* Info Cards Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Bill To Card */}
          <div className="rounded-xl p-5" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#14462a' }}>
              Bill To
            </p>
            {data.customer ? (
              <>
                <p className="text-base font-semibold mb-1" style={{ color: '#111827' }}>{data.customer.name}</p>
                {data.customer.company && (
                  <p className="text-sm flex items-center gap-2" style={{ color: '#6B7280' }}>
                    <Building size={14} color="#9CA3AF" />
                    {data.customer.company}
                  </p>
                )}
                {data.customer.email && (
                  <p className="text-sm flex items-center gap-2 mt-1" style={{ color: '#6B7280' }}>
                    <Sms size={14} color="#9CA3AF" />
                    {data.customer.email}
                  </p>
                )}
                {data.customer.phone && (
                  <p className="text-sm flex items-center gap-2 mt-1" style={{ color: '#6B7280' }}>
                    <Call size={14} color="#9CA3AF" />
                    {data.customer.phone}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm" style={{ color: '#9CA3AF' }}>No customer assigned</p>
            )}
          </div>

          {/* Invoice Details Card */}
          <div className="rounded-xl p-5" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#14462a' }}>
              Invoice Details
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Issue Date</span>
                <span className="text-sm font-medium" style={{ color: '#111827' }}>{formatDate(data.issue_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Due Date</span>
                <span className="text-sm font-medium" style={{ color: '#111827' }}>{formatDate(data.due_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Currency</span>
                <span className="text-sm font-medium" style={{ color: '#111827' }}>{data.currency}</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="rounded-xl p-5" style={{ backgroundColor: statusColors.bg }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: statusColors.text }}>
              Status
            </p>
            <div className="flex items-center gap-2 mb-3">
              <StatusIcon />
              <span className="text-lg font-semibold" style={{ color: statusColors.text }}>
                {getStatusText(data.status)}
              </span>
            </div>
            <div className="pt-3" style={{ borderTop: `1px solid ${statusColors.text}20` }}>
              <p className="text-xs" style={{ color: statusColors.text }}>Amount Due</p>
              <p className="text-xl font-bold" style={{ color: statusColors.text }}>
                {mask(formatCurrency(data.balance_due, data.currency))}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table - Full Professional */}
        <div className="mb-8 rounded-xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
          {/* Table Header */}
          <div 
            className="grid grid-cols-12 gap-4 py-4 px-5"
            style={{ backgroundColor: '#14462a' }}
          >
            <div className="col-span-1">
              <p className="text-xs font-semibold uppercase text-white/80">#</p>
            </div>
            <div className="col-span-5">
              <p className="text-xs font-semibold uppercase text-white/80">Description</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs font-semibold uppercase text-white/80">Quantity</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold uppercase text-white/80">Unit Price</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold uppercase text-white/80">Amount</p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {data.line_items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 py-4 px-5">
                <div className="col-span-1">
                  <span 
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#14462a10', color: '#14462a' }}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="col-span-5">
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm" style={{ color: '#374151' }}>{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm" style={{ color: '#374151' }}>
                    {mask(formatCurrency(item.unit_price, data.currency))}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-semibold" style={{ color: '#111827' }}>
                    {mask(formatCurrency(item.amount, data.currency))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
            <div className="py-4 px-5">
              <div className="flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>Subtotal</span>
                    <span className="font-medium" style={{ color: '#374151' }}>
                      {mask(formatCurrency(data.subtotal, data.currency))}
                    </span>
                  </div>
                  
                  {data.discount_amount && data.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#6B7280' }}>
                        Discount {data.discount_type === 'percentage' ? `(${data.discount_value}%)` : ''}
                      </span>
                      <span className="font-medium" style={{ color: '#DC2626' }}>
                        -{mask(formatCurrency(data.discount_amount, data.currency))}
                      </span>
                    </div>
                  )}
                  
                  {data.tax_amount && data.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#6B7280' }}>
                        Tax {data.tax_rate ? `(${data.tax_rate}%)` : ''}
                      </span>
                      <span className="font-medium" style={{ color: '#374151' }}>
                        {mask(formatCurrency(data.tax_amount, data.currency))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Grand Total */}
            <div className="py-4 px-5" style={{ backgroundColor: '#14462a' }}>
              <div className="flex justify-end">
                <div className="w-72 flex justify-between items-center">
                  <span className="text-base font-semibold text-white">Total Due</span>
                  <span className="text-2xl font-bold text-white">
                    {mask(formatCurrency(data.balance_due, data.currency))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        {showPayButton && data.payment_url && data.status !== 'paid' && data.status !== 'cancelled' && data.balance_due > 0 && (
          <div className="mb-8 text-center print:hidden">
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#14462a' }}
            >
              <Card size={20} color="currentColor" />
              Pay Invoice
            </a>
          </div>
        )}

        {/* Notes & Terms - Two Column */}
        {(data.notes || data.terms) && (
          <div className="grid grid-cols-2 gap-8 mt-8 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
            {data.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#14462a' }}>Notes</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>
                  {data.notes}
                </p>
              </div>
            )}
            {data.terms && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#14462a' }}>Terms & Conditions</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>
                  {data.terms}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 flex justify-between items-center" style={{ borderTop: '1px solid #E5E7EB' }}>
          <div>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {data.business.name} • {data.business.email}
            </p>
          </div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Thank you for your business
          </p>
        </div>
      </div>
    </div>
  );
}
