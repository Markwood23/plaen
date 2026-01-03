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
 * Standard Template - Classic business format with clear sections
 * Good for traditional business communications
 */
export function StandardTemplate({ data, showPayButton = true, maskAmounts = false }: InvoiceTemplateProps) {
  const statusColors = getStatusColor(data.status);
  
  const mask = (value: string) => maskAmounts ? '••••••' : value;
  
  const StatusIcon = () => {
    if (data.status === 'paid') return <TickCircle size={16} color="currentColor" />;
    if (data.status === 'partially_paid') return <Coin1 size={16} color="currentColor" />;
    return <Clock size={16} color="currentColor" />;
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-12 py-10 print:px-0">
        <div className="flex items-start justify-between mb-8">
          {/* Business Info */}
          <div>
            {data.business.logo_url ? (
              <img 
                src={data.business.logo_url} 
                alt={data.business.name}
                className="h-12 w-auto mb-4 object-contain"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-bold"
                style={{ backgroundColor: '#14462a' }}
              >
                {data.business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#2D2D2D' }}>
              {data.business.name}
            </h1>
            {data.business.email && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.business.email}</p>
            )}
            {data.business.phone && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.business.phone}</p>
            )}
            {data.business.address && (
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{data.business.address}</p>
            )}
          </div>
          
          {/* Invoice Info */}
          <div className="text-right">
            <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Invoice</p>
            <p className="text-2xl font-bold mb-4" style={{ color: '#2D2D2D' }}>{data.invoice_number}</p>
            <span 
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
              style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
            >
              <StatusIcon />
              {getStatusText(data.status)}
            </span>
          </div>
        </div>

        {/* Dates Row */}
        <div className="flex items-center gap-8 mb-8 flex-wrap pb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Issue Date</p>
            <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatDate(data.issue_date)}</p>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: '#E5E7EB' }} />
          <div>
            <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Due Date</p>
            <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{formatDate(data.due_date)}</p>
          </div>
        </div>

        {/* Bill To */}
        {data.customer && (
          <div className="mb-8">
            <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Bill To</p>
            <p className="text-lg font-semibold mb-1" style={{ color: '#2D2D2D' }}>{data.customer.name}</p>
            {data.customer.company && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.company}</p>
            )}
            {data.customer.email && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.email}</p>
            )}
            {data.customer.phone && (
              <p className="text-sm" style={{ color: '#6B7280' }}>{data.customer.phone}</p>
            )}
          </div>
        )}

        {/* Line Items Table */}
        <div className="mb-8">
          {/* Table Header */}
          <div 
            className="grid grid-cols-12 gap-4 py-3 px-4 rounded-t-lg"
            style={{ backgroundColor: '#F9FAFB' }}
          >
            <div className="col-span-6">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Description</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Qty</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Rate</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Amount</p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="border border-gray-200 border-t-0 rounded-b-lg divide-y divide-gray-100">
            {data.line_items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 py-4 px-4">
                <div className="col-span-6">
                  <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-base" style={{ color: '#2D2D2D' }}>{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-base" style={{ color: '#2D2D2D' }}>
                    {mask(formatCurrency(item.unit_price, data.currency))}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                    {mask(formatCurrency(item.amount, data.currency))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-base" style={{ color: '#6B7280' }}>Subtotal</span>
              <span className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                {mask(formatCurrency(data.subtotal, data.currency))}
              </span>
            </div>
            
            {data.discount_amount && data.discount_amount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-base" style={{ color: '#6B7280' }}>
                  Discount {data.discount_type === 'percentage' ? `(${data.discount_value}%)` : ''}
                </span>
                <span className="text-base font-medium" style={{ color: '#DC2626' }}>
                  -{mask(formatCurrency(data.discount_amount, data.currency))}
                </span>
              </div>
            )}
            
            {data.tax_amount && data.tax_amount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-base" style={{ color: '#6B7280' }}>
                  Tax {data.tax_rate ? `(${data.tax_rate}%)` : ''}
                </span>
                <span className="text-base font-medium" style={{ color: '#2D2D2D' }}>
                  {mask(formatCurrency(data.tax_amount, data.currency))}
                </span>
              </div>
            )}
            
            <div className="flex justify-between pt-4" style={{ borderTop: '2px solid #E5E7EB' }}>
              <span className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>Total</span>
              <span className="text-2xl font-bold" style={{ color: '#2D2D2D' }}>
                {mask(formatCurrency(data.total, data.currency))}
              </span>
            </div>

            {data.amount_paid && data.amount_paid > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-base" style={{ color: '#14462a' }}>Amount Paid</span>
                <span className="text-base font-medium" style={{ color: '#14462a' }}>
                  -{mask(formatCurrency(data.amount_paid, data.currency))}
                </span>
              </div>
            )}

            {data.balance_due > 0 && data.balance_due !== data.total && (
              <div className="flex justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}>
                <span className="text-base font-semibold" style={{ color: '#DC2626' }}>Balance Due</span>
                <span className="text-xl font-bold" style={{ color: '#DC2626' }}>
                  {mask(formatCurrency(data.balance_due, data.currency))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button */}
        {showPayButton && data.payment_url && data.status !== 'paid' && data.status !== 'cancelled' && data.balance_due > 0 && (
          <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E5E7EB' }}>
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity print:hidden"
              style={{ backgroundColor: '#14462a' }}
            >
              <Card size={20} color="currentColor" />
              Pay Invoice Now
            </a>
            <p className="text-sm mt-3 print:block" style={{ color: '#6B7280' }}>
              Payment link: {data.payment_url}
            </p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mt-8">
            <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Notes</p>
            <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: '#2D2D2D' }}>
              {data.notes}
            </p>
          </div>
        )}

        {/* Terms */}
        {data.terms && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Terms & Conditions</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B7280' }}>
              {data.terms}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #E5E7EB' }}>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Thank you for your business!
          </p>
          {data.footer && (
            <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>{data.footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
