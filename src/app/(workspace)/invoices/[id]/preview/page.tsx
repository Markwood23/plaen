"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft2, 
  DocumentDownload, 
  Send2,
  Printer,
  TickSquare,
  Clock,
  DollarSquare,
  Sms,
  Call,
  Building,
  Global,
  Calendar,
  Card
} from "iconsax-react";
import Link from "next/link";
import { use } from "react";

export default function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data - will be replaced with API call
  const invoice = {
    id: id,
    invoiceNumber: "INV-2025-001",
    issueDate: "Nov 15, 2025",
    dueDate: "Dec 15, 2025",
    paymentTerms: "Net 30",
    status: "Partially Paid",
    
    // From
    from: {
      businessName: "Your Business Name",
      email: "hello@yourbusiness.com",
      phone: "+233 24 000 0000",
      address: "123 Business Street\nAccra, Ghana",
      taxId: "TIN-123456789",
      website: "www.yourbusiness.com"
    },
    
    // Bill To
    billTo: {
      name: "Frank Murlo",
      email: "frank.murlo@email.com",
      phone: "+233 24 123 4567",
      company: "Murlo Industries",
      address: "456 Client Avenue\nAccra, Ghana",
    },
    
    // Currency
    primaryCurrency: "ghs",
    secondaryCurrency: "",
    exchangeRate: "",
    
    // Line Items
    items: [
      {
        id: 1,
        description: "Website Design & Development",
        details: "Complete website design and development service including responsive design, 5 pages, SEO optimization, and 3 months support",
        quantity: 1,
        unitPrice: 2500.00,
        tax: 15,
        discount: 0,
        discountType: "percent"
      },
      {
        id: 2,
        description: "Logo Design Package",
        details: "Professional logo design with 3 revisions, includes vector files, brand guidelines, and multiple format exports",
        quantity: 2,
        unitPrice: 500.00,
        tax: 15,
        discount: 10,
        discountType: "percent"
      },
    ],
    
    // Payment Methods
    paymentMethods: ["MTN Mobile Money", "Bank Transfer", "Card Payment"],
    
    // Notes
    notes: "Thank you for your business! Payment is due within 30 days. For questions, contact us at hello@yourbusiness.com",
    termsAndConditions: "1. Payment is due within 30 days of invoice date\n2. Late payments may incur additional fees\n3. All prices are in Ghana Cedis (GHS)\n4. Goods remain property of seller until full payment is received",
  };

  // Calculate totals
  const calculateItemTotal = (item: typeof invoice.items[0]) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * item.tax) / 100;
    const discountAmount = item.discountType === "percent" 
      ? (subtotal * item.discount) / 100 
      : item.discount;
    return subtotal + taxAmount - discountAmount;
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = invoice.items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
  const totalDiscount = invoice.items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (item.discountType === "percent" 
      ? (itemSubtotal * item.discount) / 100 
      : item.discount);
  }, 0);
  const total = subtotal + totalTax - totalDiscount;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-[#14462a] text-white hover:bg-[#14462a]/90">
            <TickSquare size={14} className="mr-1" /> Paid
          </Badge>
        );
      case "Partially Paid":
        return (
          <Badge className="bg-[#F9F9F9] text-[#14462a] border-[#EBECE7] hover:bg-[#EBECE7]">
            <DollarSquare size={14} className="mr-1" /> Partially Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-[#F9F9F9] text-[#949494] border-[#EBECE7] hover:bg-[#EBECE7]">
            <Clock size={14} className="mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Action Bar - Hidden on print */}
      <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
              <Link href={`/invoices/${id}`}>
                <ArrowLeft2 size={16} />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
                onClick={handlePrint}
              >
                <Printer size={14} className="mr-1.5" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.8)]"
                style={{ borderColor: '#E4E6EB', color: '#2D2D2D', fontWeight: 400 }}
              >
                <DocumentDownload size={14} className="mr-1.5" />
                Download PDF
              </Button>
              <Button 
                size="sm" 
                className="rounded-full px-5 h-9" 
                style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
              >
                <Send2 size={14} className="mr-1.5" />
                Send to Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-5xl mx-auto px-6 py-12 print:py-0">
        <div className="bg-white print:border-0">
          {/* Header */}
          <div className="px-12 py-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H12V12H3V3Z" fill="#14462a"/>
                    <path d="M14 3H21L17.5 12H14V3Z" fill="#14462a"/>
                    <path d="M12 14H21V21H12V14Z" fill="#14462a"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>{invoice.from.businessName}</h1>
                <p className="text-sm" style={{ color: '#B0B3B8' }}>{invoice.from.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Invoice</p>
                <p className="text-2xl font-bold mb-4" style={{ color: '#2D2D2D' }}>{invoice.invoiceNumber}</p>
                <div className="flex justify-end">
                  <span 
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                    style={{ 
                      backgroundColor: invoice.status === 'Paid' ? '#E8F9F1' : invoice.status === 'Partially Paid' ? '#FFF4E6' : '#F9F9F9',
                      color: invoice.status === 'Paid' ? '#059669' : invoice.status === 'Partially Paid' ? '#F59E0B' : '#B0B3B8'
                    }}
                  >
                    {invoice.status === 'Paid' && <TickSquare size={16} />}
                    {invoice.status === 'Partially Paid' && <Clock size={16} />}
                    {invoice.status === 'Pending' && <Clock size={16} />}
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-8 mb-8">
              <div>
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Issue Date</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{invoice.issueDate}</p>
              </div>
              <div className="h-px w-8" style={{ borderTop: '1px solid #E4E6EB' }}></div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Due Date</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{invoice.dueDate}</p>
              </div>
              <div className="h-px w-8" style={{ borderTop: '1px solid #E4E6EB' }}></div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#B0B3B8' }}>Payment Terms</p>
                <p className="text-base font-medium" style={{ color: '#2D2D2D' }}>{invoice.paymentTerms}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Bill To</p>
              <p className="text-base font-medium mb-1" style={{ color: '#2D2D2D' }}>{invoice.billTo.name}</p>
              {invoice.billTo.company && (
                <p className="text-sm" style={{ color: '#B0B3B8' }}>{invoice.billTo.company}</p>
              )}
              <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>{invoice.billTo.email}</p>
            </div>

            {/* Line Items - Table Style */}
            <div className="mb-8 mt-12">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 mb-6" style={{ borderBottom: '1px solid #E4E6EB' }}>
                <div className="col-span-6">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Description</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Qty</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Rate</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium" style={{ color: '#B0B3B8' }}>Amount</p>
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <p className="text-base mb-1" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.description}</p>
                      {item.details && (
                        <p className="text-sm" style={{ color: '#B0B3B8' }}>{item.details}</p>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>{item.quantity}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-base" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{calculateItemTotal(item).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals - Clean Right-Aligned */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-3">
                <div className="grid grid-cols-2 gap-8 items-center py-2">
                  <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Subtotal</span>
                  <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{subtotal.toFixed(2)}</span>
                </div>
                {totalTax > 0 && (
                  <div className="grid grid-cols-2 gap-8 items-center py-2">
                    <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Tax</span>
                    <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>₵{totalTax.toFixed(2)}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="grid grid-cols-2 gap-8 items-center py-2">
                    <span className="text-base text-right" style={{ color: '#B0B3B8' }}>Discount</span>
                    <span className="text-base text-right" style={{ color: '#2D2D2D', fontWeight: 500 }}>-₵{totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="grid grid-cols-2 gap-8 items-center pt-4">
                  <span className="text-lg font-semibold text-right" style={{ color: '#2D2D2D' }}>Total</span>
                  <span className="text-2xl font-bold text-right" style={{ color: '#2D2D2D' }}>₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pay Invoice Button - Part of PDF */}
            {invoice.status !== 'Paid' && (
              <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E4E6EB' }}>
                <a
                  href={`${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#14462a' }}
                >
                  <Card size={20} />
                  Pay Invoice Now
                </a>
                <p className="text-sm mt-3" style={{ color: '#B0B3B8' }}>
                  Or copy payment link: {typeof window !== 'undefined' ? window.location.origin : ''}/pay/{id}
                </p>
              </div>
            )}

            {/* Payment Methods */}
            {invoice.paymentMethods && invoice.paymentMethods.length > 0 && (
              <div className="mt-8">
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Accepted Payment Methods</p>
                <p className="text-base" style={{ color: '#2D2D2D' }}>{invoice.paymentMethods.join(', ')}</p>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8">
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Notes</p>
                <p className="text-base leading-relaxed" style={{ color: '#2D2D2D' }}>{invoice.notes}</p>
              </div>
            )}

            {/* Terms */}
            {invoice.termsAndConditions && (
              <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E4E6EB' }}>
                <p className="text-sm mb-2" style={{ color: '#B0B3B8' }}>Terms & Conditions</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#B0B3B8' }}>{invoice.termsAndConditions}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #E4E6EB' }}>
              <p className="text-sm" style={{ color: '#B0B3B8' }}>
                Thank you for your business!
              </p>
              <p className="text-sm mt-2" style={{ color: '#B0B3B8' }}>
                Questions? Contact us at {invoice.from.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
