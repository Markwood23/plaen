"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft2, 
  DocumentDownload, 
  Send2,
  Printer,
  Setting4
} from "iconsax-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState, Suspense } from "react";
import { useInvoiceDetail } from "@/hooks/useInvoicesData";
import { SendInvoiceModal } from "@/components/invoices/send-invoice-modal";
import { useSearchParams } from "next/navigation";
import { 
  InvoiceTemplateRenderer, 
  InvoiceTemplateType, 
  InvoiceTemplateData,
  INVOICE_TEMPLATES
} from "@/components/invoices/templates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function InvoicePreviewContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [sendOpen, setSendOpen] = useState(false);
  
  // Fetch real invoice data
  const { invoice: invoiceData, loading, error, refetch } = useInvoiceDetail(id);

  useEffect(() => {
    if (searchParams.get('send') === '1') {
      setSendOpen(true);
    }
  }, [searchParams]);

  const origin = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Uses browser print-to-PDF
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="px-12 py-10">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-3 gap-8 mb-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Invoice not found</p>
          <Button variant="outline" asChild>
            <Link href="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals from line items
  const lineItems = invoiceData.line_items || [];
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const total = invoiceData.total || subtotal;
  const balanceDue = invoiceData.balance_due || 0;

  const paymentUrl = invoiceData.public_id ? `${origin}/pay/${invoiceData.public_id}` : null;

  // Get customer info
  const customer = invoiceData.customer;

  // Template state - default to 'modern', could be stored on invoice
  const [template, setTemplate] = useState<InvoiceTemplateType>('modern');

  // Prepare template data
  const templateData: InvoiceTemplateData = {
    invoice_number: invoiceData.invoice_number,
    public_id: invoiceData.public_id,
    issue_date: invoiceData.issue_date,
    due_date: invoiceData.due_date,
    status: invoiceData.status as InvoiceTemplateData['status'],
    currency: invoiceData.currency || 'GHS',
    subtotal: subtotal,
    total: total,
    balance_due: balanceDue,
    line_items: lineItems.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.quantity * item.unit_price,
    })),
    notes: invoiceData.notes,
    customer: customer ? {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: null,
      company: customer.company,
    } : null,
    business: {
      name: 'Plaen', // TODO: Get from user settings
      email: null,
      phone: null,
      logo_url: null,
    },
    payment_url: paymentUrl,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Action Bar - Hidden on print */}
      <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href={`/invoices/${id}`}>
                <ArrowLeft2 size={16} color="currentColor" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {/* Template Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full px-4 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                    style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                  >
                    <Setting4 size={14} color="currentColor" className="mr-1.5" />
                    {INVOICE_TEMPLATES.find(t => t.id === template)?.name || 'Template'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {INVOICE_TEMPLATES.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={template === t.id ? 'bg-gray-100' : ''}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-gray-500">{t.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                onClick={handlePrint}
              >
                <Printer size={14} color="currentColor" className="mr-1.5" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                onClick={handleDownloadPDF}
              >
                <DocumentDownload size={14} color="currentColor" className="mr-1.5" />
                Download PDF
              </Button>
              {invoiceData.status !== 'paid' && (
                <Button 
                  size="sm" 
                  className="rounded-full px-5 h-9" 
                  style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
                  onClick={() => setSendOpen(true)}
                >
                  <Send2 size={14} color="currentColor" className="mr-1.5" />
                  Send to Customer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SendInvoiceModal
        open={sendOpen}
        onOpenChange={(open) => {
          setSendOpen(open);
          if (!open) {
            refetch();
          }
        }}
        invoiceId={id}
        invoiceNumber={invoiceData.invoice_number}
        customerEmail={invoiceData.customer?.email || ''}
        customerName={invoiceData.customer?.name || ''}
        total={(total || 0) / 100}
        currency={invoiceData.currency || 'GHS'}
      />

      {/* Invoice Document - Using Template */}
      <div className="max-w-5xl mx-auto px-6 py-12 print:py-0 print:px-0">
        <div className="bg-white print:border-0">
          <InvoiceTemplateRenderer
            template={template}
            data={templateData}
            showPayButton={true}
            maskAmounts={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="px-12 py-10">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-3 gap-8 mb-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    }>
      <InvoicePreviewContent id={id} />
    </Suspense>
  );
}
