"use client";

import { useState, useEffect } from "react";
import { Receipt21, Chart, TrendUp, TrendDown, Wallet2, CloseCircle, Refresh } from "iconsax-react";
import { CedisCircle } from "@/components/icons/cedis-icon";

// Types for embedded blocks
export interface EmbeddedBlock {
  id: string;
  type: 'invoice' | 'metric' | 'chart';
  data: Record<string, unknown>;
  createdAt: string;
}

export interface InvoiceBlockData {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  total: number;
  currency: string;
  status: string;
  dueDate: string | null;
}

export interface MetricBlockData {
  metricType: 'total_revenue' | 'outstanding' | 'paid_invoices' | 'overdue_count';
  value: number;
  change?: number;
  period?: string;
}

export interface ChartBlockData {
  chartType: 'revenue_trend' | 'invoice_status' | 'monthly_comparison';
  data: Array<{ label: string; value: number }>;
  title: string;
}

// Format currency
function formatCurrency(amount: number, currency: string = 'GHS') {
  const formatted = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency === 'GHS' ? '₵' : '$'}${formatted}`;
}

// Invoice Block Component
export function InvoiceBlock({ 
  data, 
  onRemove,
  editable = true 
}: { 
  data: InvoiceBlockData; 
  onRemove?: () => void;
  editable?: boolean;
}) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(176, 179, 184, 0.15)', text: '#6B7280' },
    sent: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
    viewed: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6' },
    partially_paid: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
    paid: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E' },
    overdue: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
    cancelled: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6B7280' },
  };

  const status = statusColors[data.status] || statusColors.draft;

  return (
    <div 
      className="my-4 rounded-xl border overflow-hidden group relative"
      style={{ borderColor: '#E4E6EB', backgroundColor: '#FAFBFC' }}
      contentEditable={false}
    >
      {editable && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
        >
          <CloseCircle size={16} color="#EF4444" />
        </button>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
              <Receipt21 size={20} color="#14462a" />
            </div>
            <div>
              <div className="font-semibold text-[#2D2D2D]">{data.invoiceNumber}</div>
              <div className="text-sm text-[#6B7280]">{data.clientName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#2D2D2D]">
              {formatCurrency(data.total, data.currency)}
            </div>
            <span 
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {data.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        {data.dueDate && (
          <div className="mt-3 pt-3 text-sm text-[#6B7280]" style={{ borderTop: '1px solid #E4E6EB' }}>
            Due: {new Date(data.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Metric Block Component
export function MetricBlock({ 
  data, 
  onRemove,
  editable = true 
}: { 
  data: MetricBlockData; 
  onRemove?: () => void;
  editable?: boolean;
}) {
  const metricConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    total_revenue: {
      label: 'Total Revenue',
      icon: <Wallet2 size={20} color="#14462a" />,
      color: '#14462a',
    },
    outstanding: {
      label: 'Outstanding',
      icon: <Receipt21 size={20} color="#F59E0B" />,
      color: '#F59E0B',
    },
    paid_invoices: {
      label: 'Paid Invoices',
      icon: <Receipt21 size={20} color="#22C55E" />,
      color: '#22C55E',
    },
    overdue_count: {
      label: 'Overdue',
      icon: <Receipt21 size={20} color="#EF4444" />,
      color: '#EF4444',
    },
  };

  const config = metricConfig[data.metricType] || metricConfig.total_revenue;
  const isPositive = (data.change || 0) >= 0;

  return (
    <div 
      className="my-4 rounded-xl border overflow-hidden group relative inline-block min-w-[200px]"
      style={{ borderColor: '#E4E6EB', backgroundColor: '#FAFBFC' }}
      contentEditable={false}
    >
      {editable && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
        >
          <CloseCircle size={16} color="#EF4444" />
        </button>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${config.color}15` }}
          >
            {config.icon}
          </div>
          <span className="text-sm text-[#6B7280]">{config.label}</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-[#2D2D2D]">
            {data.metricType === 'overdue_count' || data.metricType === 'paid_invoices' 
              ? data.value 
              : formatCurrency(data.value)}
          </div>
          {data.change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendUp size={14} /> : <TrendDown size={14} />}
              {Math.abs(data.change)}%
            </div>
          )}
        </div>
        {data.period && (
          <div className="text-xs text-[#B0B3B8] mt-1">{data.period}</div>
        )}
      </div>
    </div>
  );
}

// Simple Bar Chart Component
export function ChartBlock({ 
  data, 
  onRemove,
  editable = true 
}: { 
  data: ChartBlockData; 
  onRemove?: () => void;
  editable?: boolean;
}) {
  const maxValue = Math.max(...data.data.map(d => d.value), 1);

  return (
    <div 
      className="my-4 rounded-xl border overflow-hidden group relative"
      style={{ borderColor: '#E4E6EB', backgroundColor: '#FAFBFC' }}
      contentEditable={false}
    >
      {editable && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
        >
          <CloseCircle size={16} color="#EF4444" />
        </button>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
            <Chart size={18} color="#14462a" />
          </div>
          <span className="font-semibold text-[#2D2D2D]">{data.title}</span>
        </div>
        <div className="space-y-3">
          {data.data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">{item.label}</span>
                <span className="font-medium text-[#2D2D2D]">{formatCurrency(item.value)}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: '#14462a'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Embed Picker Modal
interface EmbedPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'invoice' | 'metric' | 'chart', subType?: string) => void;
}

export function EmbedPicker({ isOpen, onClose, onSelect }: EmbedPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#2D2D2D]">Insert Block</h3>
          <p className="text-sm text-[#6B7280]">Add data visualizations to your note</p>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Invoice */}
          <button
            onClick={() => onSelect('invoice')}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(20,70,42,0.04)] transition-colors text-left"
          >
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
              <Receipt21 size={20} color="#14462a" />
            </div>
            <div>
              <div className="font-medium text-[#2D2D2D]">Invoice</div>
              <div className="text-sm text-[#6B7280]">Embed invoice details</div>
            </div>
          </button>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-[#B0B3B8] px-1">METRICS</div>
            <button
              onClick={() => onSelect('metric', 'total_revenue')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(20,70,42,0.04)] transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
                <Wallet2 size={20} color="#14462a" />
              </div>
              <div>
                <div className="font-medium text-[#2D2D2D]">Total Revenue</div>
                <div className="text-sm text-[#6B7280]">Your total earnings</div>
              </div>
            </button>
            <button
              onClick={() => onSelect('metric', 'outstanding')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(245,158,11,0.04)] transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <Receipt21 size={20} color="#F59E0B" />
              </div>
              <div>
                <div className="font-medium text-[#2D2D2D]">Outstanding Balance</div>
                <div className="text-sm text-[#6B7280]">Unpaid invoice total</div>
              </div>
            </button>
          </div>

          {/* Charts */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-[#B0B3B8] px-1">CHARTS</div>
            <button
              onClick={() => onSelect('chart', 'revenue_trend')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(20,70,42,0.04)] transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)' }}>
                <Chart size={20} color="#14462a" />
              </div>
              <div>
                <div className="font-medium text-[#2D2D2D]">Revenue Trend</div>
                <div className="text-sm text-[#6B7280]">Monthly revenue chart</div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Invoice Selector Modal
interface InvoiceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (invoice: InvoiceBlockData) => void;
}

export function InvoiceSelector({ isOpen, onClose, onSelect }: InvoiceSelectorProps) {
  const [invoices, setInvoices] = useState<InvoiceBlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/invoices?limit=50');
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.invoices || []).map((inv: Record<string, unknown>) => ({
          invoiceId: inv.id as string,
          invoiceNumber: inv.invoice_number as string,
          clientName: (inv.client as Record<string, unknown>)?.name as string || 'Unknown Client',
          total: Number(inv.total) || 0,
          currency: inv.currency as string || 'GHS',
          status: inv.status as string || 'draft',
          dueDate: inv.due_date as string | null,
        }));
        setInvoices(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#2D2D2D]">Select Invoice</h3>
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#14462a]/20"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Refresh size={24} color="#B0B3B8" className="animate-spin" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280]">
              No invoices found
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <button
                key={invoice.invoiceId}
                onClick={() => {
                  onSelect(invoice);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-[rgba(20,70,42,0.04)] transition-colors border border-transparent hover:border-[#E4E6EB]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#2D2D2D]">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-[#6B7280]">{invoice.clientName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#2D2D2D]">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </div>
                    <div className="text-xs text-[#B0B3B8]">{invoice.status}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
