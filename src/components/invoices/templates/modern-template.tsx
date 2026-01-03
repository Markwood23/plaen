"use client";

import { 
  InvoiceTemplateProps, 
  formatCurrency, 
  formatDate, 
  getStatusColor, 
  getStatusText 
} from './types';
import { TickCircle, Clock, Coin1, Card } from 'iconsax-react';

/**
 * Modern Template - Contemporary design with visual accents
 * Best for tech companies, startups, and modern businesses
 */
export function ModernTemplate({ data, showPayButton = true, maskAmounts = false }: InvoiceTemplateProps) {
  const statusColors = getStatusColor(data.status);
  const mask = (value: string) => maskAmounts ? '••••••' : value;
  
  const StatusIcon = () => {
    if (data.status === 'paid') return <TickCircle size={16} color="currentColor" />;
    if (data.status === 'partially_paid') return <Coin1 size={16} color="currentColor" />;
    return <Clock size={16} color="currentColor" />;
  };

  return (
    <div className="bg-white">
      <div className="px-12 py-10 print:px-0">
        {/* Header - Modern Asymmetric */}
        <div className="flex items-start justify-between mb-12">
          <div>
            {/* Logo/Brand */}
            {data.business.logo_url ? (
              <img 
                src={data.business.logo_url} 
                alt={data.business.name}
                className="h-10 w-auto mb-4 object-contain"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white text-xl font-bold"
                style={{ backgroundColor: '#14462a' }}
              >
                {data.business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
              {data.business.name}
            </h1>
          </div>
          
          {/* Invoice Title & Status */}
          <div className="text-right">
            <div className="inline-block">
              <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>Invoice</p>
              <p className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>{data.invoice_number}</p>
              <div className="flex justify-end">
                <span 
                  className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                >
                  <StatusIcon />
                  {getStatusText(data.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Pills */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <span className="text-xs font-medium uppercase" style={{ color: '#9CA3AF' }}>Issued</span>
            <span className="text-sm font-medium" style={{ color: '#374151' }}>{formatDate(data.issue_date)}</span>
          </div>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: data.status === 'overdue' ? 'rgba(220, 38, 38, 0.1)' : '#F3F4F6' }}
          >
            <span className="text-xs font-medium uppercase" style={{ color: data.status === 'overdue' ? '#DC2626' : '#9CA3AF' }}>Due</span>
            <span className="text-sm font-medium" style={{ color: data.status === 'overdue' ? '#DC2626' : '#374151' }}>{formatDate(data.due_date)}</span>
          </div>
        </div>

        {/* Bill To - Card Style */}
        {data.customer && (
          <div 
            className="rounded-2xl p-6 mb-10"
            style={{ backgroundColor: 'rgba(20, 70, 42, 0.03)', border: '1px solid rgba(20, 70, 42, 0.08)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#14462a' }}>
              Billed To
            </p>
            <p className="text-lg font-semibold mb-1" style={{ color: '#111827' }}>{data.customer.name}</p>
            {data.customer.company && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.company}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3">
              {data.customer.email && (
                <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.email}</p>
              )}
              {data.customer.phone && (
                <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Line Items - Modern Card Style */}
        <div className="mb-10">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 mb-2">
            <div className="col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Description</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Qty</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Rate</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Amount</p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {data.line_items.map((item, index) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-4 py-4 px-4 rounded-xl transition-colors"
                style={{ backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'transparent' }}
              >
                <div className="col-span-6">
                  <p className="text-base font-medium" style={{ color: '#111827' }}>{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-base" style={{ color: '#374151' }}>{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-base" style={{ color: '#374151' }}>
                    {mask(formatCurrency(item.unit_price, data.currency))}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-base font-semibold" style={{ color: '#111827' }}>
                    {mask(formatCurrency(item.amount, data.currency))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals - Modern Card */}
        <div className="flex justify-end mb-10">
          <div 
            className="w-80 rounded-2xl overflow-hidden"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Subtotal</span>
                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                  {mask(formatCurrency(data.subtotal, data.currency))}
                </span>
              </div>
              
              {data.discount_amount && data.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#6B7280' }}>
                    Discount {data.discount_type === 'percentage' ? `(${data.discount_value}%)` : ''}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#DC2626' }}>
                    -{mask(formatCurrency(data.discount_amount, data.currency))}
                  </span>
                </div>
              )}
              
              {data.tax_amount && data.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#6B7280' }}>
                    Tax {data.tax_rate ? `(${data.tax_rate}%)` : ''}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>
                    {mask(formatCurrency(data.tax_amount, data.currency))}
                  </span>
                </div>
              )}
            </div>
            
            {/* Total Bar */}
            <div 
              className="px-5 py-4 flex justify-between items-center"
              style={{ backgroundColor: '#14462a' }}
            >
              <span className="text-base font-medium text-white">Total</span>
              <span className="text-2xl font-bold text-white">
                {mask(formatCurrency(data.total, data.currency))}
              </span>
            </div>

            {/* Balance Due if different */}
            {data.balance_due > 0 && data.balance_due !== data.total && (
              <div 
                className="px-5 py-3 flex justify-between items-center"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}
              >
                <span className="text-sm font-medium" style={{ color: '#DC2626' }}>Balance Due</span>
                <span className="text-lg font-bold" style={{ color: '#DC2626' }}>
                  {mask(formatCurrency(data.balance_due, data.currency))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button - Prominent */}
        {showPayButton && data.payment_url && data.status !== 'paid' && data.status !== 'cancelled' && data.balance_due > 0 && (
          <div className="mb-10 print:hidden">
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#14462a' }}
            >
              <Card size={20} color="currentColor" />
              Pay Invoice Now
            </a>
            <p className="text-sm mt-3 print:block" style={{ color: '#9CA3AF' }}>
              {data.payment_url}
            </p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mt-10 pt-8" style={{ borderTop: '1px solid #F3F4F6' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Notes</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>
              {data.notes}
            </p>
          </div>
        )}

        {/* Terms */}
        {data.terms && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Terms & Conditions</p>
            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#9CA3AF' }}>
              {data.terms}
            </p>
          </div>
        )}

        {/* Footer - Modern */}
        <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #F3F4F6' }}>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Thank you for your business!
          </p>
          <p className="text-xs mt-2" style={{ color: '#D1D5DB' }}>
            Powered by Plaen
          </p>
        </div>
      </div>
    </div>
  );
}
