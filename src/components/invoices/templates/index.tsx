// Invoice Templates - Export all templates and utilities

export * from './types';
export { StandardTemplate } from './standard-template';
export { MinimalTemplate } from './minimal-template';
export { ProfessionalTemplate } from './professional-template';
export { ModernTemplate } from './modern-template';

// Template Renderer Component
import { StandardTemplate } from './standard-template';
import { MinimalTemplate } from './minimal-template';
import { ProfessionalTemplate } from './professional-template';
import { ModernTemplate } from './modern-template';
import { InvoiceTemplateType, InvoiceTemplateProps } from './types';

interface InvoiceTemplateRendererProps extends InvoiceTemplateProps {
  template: InvoiceTemplateType;
}

export function InvoiceTemplateRenderer({ template, ...props }: InvoiceTemplateRendererProps) {
  switch (template) {
    case 'standard':
      return <StandardTemplate {...props} />;
    case 'minimal':
      return <MinimalTemplate {...props} />;
    case 'professional':
      return <ProfessionalTemplate {...props} />;
    case 'modern':
    default:
      return <ModernTemplate {...props} />;
  }
}

// Template Preview Component (for selector)
interface TemplatePreviewProps {
  template: InvoiceTemplateType;
  selected?: boolean;
  onClick?: () => void;
}

export function TemplatePreview({ template, selected = false, onClick }: TemplatePreviewProps) {
  const previews: Record<InvoiceTemplateType, React.ReactNode> = {
    standard: (
      <div className="space-y-2">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-6 h-6 rounded-lg bg-gray-800" />
          <div className="text-right">
            <div className="h-2 w-12 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-16 bg-gray-800 rounded" />
          </div>
        </div>
        {/* Dates */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <div className="h-2 w-10 bg-gray-200 rounded" />
          <div className="h-2 w-10 bg-gray-200 rounded" />
        </div>
        {/* Items */}
        <div className="space-y-1 pt-1">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
        </div>
        {/* Total */}
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <div className="h-4 w-16 bg-gray-800 rounded" />
        </div>
      </div>
    ),
    minimal: (
      <div className="space-y-3">
        {/* Header */}
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-2 w-12 bg-gray-300 rounded" />
        </div>
        {/* Items */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <div className="h-2 w-20 bg-gray-200 rounded" />
            <div className="h-2 w-10 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-2 w-16 bg-gray-200 rounded" />
            <div className="h-2 w-10 bg-gray-300 rounded" />
          </div>
        </div>
        {/* Total */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <div className="h-4 w-14 bg-gray-800 rounded" />
        </div>
      </div>
    ),
    professional: (
      <div className="space-y-2">
        {/* Header Bar */}
        <div className="h-5 w-full rounded-t bg-[#14462a] flex items-center px-1.5">
          <div className="w-3 h-3 rounded bg-white/30" />
        </div>
        {/* Cards */}
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 bg-gray-100 rounded" />
          <div className="h-6 bg-gray-100 rounded" />
          <div className="h-6 bg-green-50 rounded" />
        </div>
        {/* Table */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="h-3 bg-[#14462a]" />
          <div className="h-2 bg-white" />
          <div className="h-2 bg-gray-50" />
          <div className="h-3 bg-[#14462a]" />
        </div>
      </div>
    ),
    modern: (
      <div className="space-y-2">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-5 h-5 rounded-xl bg-[#14462a]" />
          <div className="h-4 w-10 bg-green-100 rounded-full" />
        </div>
        {/* Pills */}
        <div className="flex gap-1">
          <div className="h-3 w-10 bg-gray-100 rounded-full" />
          <div className="h-3 w-10 bg-gray-100 rounded-full" />
        </div>
        {/* Items */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-50 rounded-lg" />
          <div className="h-3 w-full bg-white rounded-lg" />
        </div>
        {/* Total Card */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-2 bg-white" />
          <div className="h-3 bg-[#14462a]" />
        </div>
      </div>
    ),
  };

  const names: Record<InvoiceTemplateType, string> = {
    standard: 'Standard',
    minimal: 'Minimal',
    professional: 'Professional',
    modern: 'Modern',
  };

  const descriptions: Record<InvoiceTemplateType, string> = {
    standard: 'Classic business format',
    minimal: 'Clean and simple',
    professional: 'Corporate style',
    modern: 'Contemporary design',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full p-3 rounded-xl border-2 transition-all text-left
        ${selected 
          ? 'border-[#14462a] bg-[#14462a]/5' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#14462a] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      {/* Preview */}
      <div className="aspect-[3/4] w-full bg-white rounded-lg border border-gray-100 p-2 mb-3">
        {previews[template]}
      </div>
      
      {/* Label */}
      <p className="text-sm font-medium" style={{ color: selected ? '#14462a' : '#374151' }}>
        {names[template]}
      </p>
      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        {descriptions[template]}
      </p>
    </button>
  );
}

// Template Selector Component
interface TemplateSelectorProps {
  value: InvoiceTemplateType;
  onChange: (template: InvoiceTemplateType) => void;
  className?: string;
}

export function TemplateSelector({ value, onChange, className = '' }: TemplateSelectorProps) {
  const templates: InvoiceTemplateType[] = ['standard', 'minimal', 'professional', 'modern'];
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {templates.map((template) => (
        <TemplatePreview
          key={template}
          template={template}
          selected={value === template}
          onClick={() => onChange(template)}
        />
      ))}
    </div>
  );
}
