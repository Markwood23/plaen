"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Download, 
  Send, 
  Edit, 
  Bell, 
  DollarSign, 
  Check, 
  Clock, 
  X, 
  RotateCcw,
  FileText,
  Calendar,
  User,
  Receipt as ReceiptIcon,
  Hash,
  CreditCard,
  Mail,
  Phone,
  Building2,
  Paperclip,
  Plus,
  Activity,
  Settings,
  Banknote,
  Copy
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  // Mock data - will be replaced with API call
  const invoice = {
    id: id,
    invoiceNumber: "INV-12302",
    issueDate: "Nov 15, 2024",
    dueDate: "Dec 15, 2024",
    paymentTerms: "Net 30",
    status: "Partially Paid",
    
    // Business/Issuer Information
    issuer: {
      businessName: "Your Business Name",
      name: "John Doe",
      email: "hello@plaen.tech",
      phone: "+233 24 000 0000",
      address: "123 Business Street, Accra, Ghana",
      taxId: "TIN-123456789",
    },
    
    // Customer Information
    customer: {
      name: "Kwame Mensah",
      email: "kwame@example.com",
      phone: "+233 24 123 4567",
      company: "Mensah Consulting Ltd.",
      address: "456 Client Avenue, Accra, Ghana",
    },
    
    // Currency & Exchange Rate
    currency: {
      primary: 'GHS',
      secondary: 'USD',
      dualCurrency: false,
      exchangeRate: 10.9421,
      rateSource: 'Google Finance',
      rateDate: '2025-11-14',
      preferredCurrency: 'GHS'
    },
    
    // Line Items
    items: [
      {
        id: "1",
        description: "Website Design & Development",
        quantity: 1,
        unitPrice: "₵49,239.45",
        unitPriceGHS: "₵49,239.45",
        tax: "₵0.00",
        taxRate: 0,
        discount: "₵0.00",
        total: "₵49,239.45",
        totalGHS: "₵49,239.45",
      },
      {
        id: "2",
        description: "Logo Design (3 concepts)",
        quantity: 3,
        unitPrice: "₵2,735.53",
        unitPriceGHS: "₵2,735.53",
        tax: "₵0.00",
        taxRate: 0,
        discount: "₵0.00",
        total: "₵8,206.58",
        totalGHS: "₵8,206.58",
      },
      {
        id: "3",
        description: "Monthly Maintenance (3 months)",
        quantity: 3,
        unitPrice: "₵1,641.32",
        unitPriceGHS: "₵1,641.32",
        tax: "₵0.00",
        taxRate: 0,
        discount: "₵547.11",
        total: "₵4,376.85",
        totalGHS: "₵4,376.85",
      },
    ],
    
    // Totals
    subtotal: "₵61,822.88",
    subtotalGHS: "₵61,822.88",
    discount: "₵547.11",
    discountGHS: "₵547.11",
    tax: "₵0.00",
    taxGHS: "₵0.00",
    total: "₵61,275.77",
    totalGHS: "₵61,275.77",
    amountPaid: "₵44,852.61",
    amountPaidGHS: "₵44,852.61",
    balanceDue: "₵16,423.16",
    balanceDueGHS: "₵16,423.16",
    
    // Payment Terms & Conditions
    paymentMethods: ["MTN MoMo", "Bank Transfer", "Card", "Crypto"],
    earlyPaymentDiscount: "2% if paid within 7 days",
    lateFeePolicy: "1.5% monthly after 30 days grace period",
    
    // Purpose & Notes
    purposeCategory: "Services",
    purposeNote: "Q4 2024 website project and branding deliverables",
    projectReference: "PRJ-2024-045",
    notes: "Thank you for your business! Payment is due within 30 days. For questions, contact us at hello@plaen.tech",
    termsAndConditions: "Full payment required before final deliverables. Late payments subject to 1.5% monthly fee. All work remains property of issuer until paid in full.",
    privateNotes: "Client requested rush delivery - add 20% to next invoice",
    
    // Payment allocations
    payments: [
      {
        id: "1",
        date: "Nov 18, 2024",
        amount: "₵27,355.25",
        rail: "MTN MoMo",
        reference: "MM12594830",
        status: "Confirmed",
      },
      {
        id: "2",
        date: "Nov 25, 2024",
        amount: "₵17,497.36",
        rail: "Bank Transfer",
        reference: "BNK12302847",
        status: "Confirmed",
      },
    ],
    
    // Activity log
    activity: [
      { date: "Nov 25, 2024 3:45 PM", action: "Payment received", description: "₵17,497.36 via Bank Transfer" },
      { date: "Nov 18, 2024 10:22 AM", action: "Payment received", description: "₵27,355.25 via MTN MoMo" },
      { date: "Nov 15, 2024 2:15 PM", action: "Invoice sent", description: "Sent to kwame@example.com" },
      { date: "Nov 15, 2024 2:10 PM", action: "Invoice created", description: "Draft created" },
    ],
    
    attachments: [],
  };

  // Helper: compute paid percentage for progress UI
  const parseMoney = (s: string) => Number((s || "0").replace(/[^0-9.-]/g, ""));
  const paidPct = Math.min(
    100,
    Math.max(0, Math.round((parseMoney(invoice.amountPaid) / Math.max(1, parseMoney(invoice.total))) * 100))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-[#14462a] text-white border-[#14462a]">
            <Check className="h-3.5 w-3.5" /> Paid
          </Badge>
        );
      case "Partially Paid":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <DollarSign className="h-3.5 w-3.5" /> Partially Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <Clock className="h-3.5 w-3.5" /> Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <X className="h-3.5 w-3.5" /> Cancelled
          </Badge>
        );
      case "Refunded":
        return (
          <Badge className="bg-gray-400 text-white border-gray-400">
            <RotateCcw className="h-3.5 w-3.5" /> Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const canEdit = invoice.payments.length === 0; // Lock after first payment per PRD

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm text-[#949494]">
          <Link href="/invoices" className="hover:text-[#14462a] transition-colors">
            Invoices
          </Link>
          <span>/</span>
          <span className="text-[#14462a] font-medium">{invoice.invoiceNumber}</span>
        </div>
      </div>

      {/* Title bar with actions */}
      <div className="flex items-start justify-between pb-4 border-b border-[#EBECE7]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-[#14462a]">{invoice.invoiceNumber}</h1>
            <span className="text-sm text-[#949494]">for</span>
            <span className="text-lg font-medium text-[#14462a]">{invoice.total}</span>
            {getStatusBadge(invoice.status)}
          </div>
          
          {/* Action buttons row */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Note
            </Button>
            {canEdit && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/invoices/${invoice.id}/edit`}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit Invoice
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send Invoice
            </Button>
            {(invoice.status === "Pending" || invoice.status === "Partially Paid") && (
              <Button variant="outline" size="sm">
                <Bell className="h-3.5 w-3.5 mr-1.5" />
                Hold Invoice
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  More
                  <MoreHorizontal className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy Invoice Link</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/receipts/${invoice.id}`}>
                    <ReceiptIcon className="h-4 w-4 mr-2" />
                    View Receipt
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Cancel Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-[#F9F9F9] p-1 text-[#949494]">
          <TabsTrigger 
            value="overview" 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14462a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#14462a] data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="payments"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14462a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#14462a] data-[state=active]:shadow-sm"
          >
            <Banknote className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger 
            value="activity"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14462a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#14462a] data-[state=active]:shadow-sm"
          >
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger 
            value="attachments"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14462a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#14462a] data-[state=active]:shadow-sm"
          >
            <Paperclip className="h-4 w-4" />
            Attachments
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14462a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#14462a] data-[state=active]:shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#14462a]">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Fact chips */}
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-[#EBECE7]">
                <div className="inline-flex items-center gap-2 rounded-md bg-[#F9F9F9] px-3 py-2 text-sm font-medium text-[#14462a]">
                  <Hash className="h-4 w-4 text-[#949494]" />
                  {invoice.invoiceNumber}
                </div>
                <div className="h-4 w-px bg-[#EBECE7]" />
                <div className="inline-flex items-center gap-2 text-sm">
                  <span className="text-[#949494]">Issued</span>
                  <span className="font-medium text-[#14462a]">{invoice.issueDate}</span>
                </div>
                <div className="h-4 w-px bg-[#EBECE7]" />
                <div className="inline-flex items-center gap-2 text-sm">
                  <span className="text-[#949494]">Due</span>
                  <span className="font-medium text-[#14462a]">{invoice.dueDate}</span>
                </div>
                <div className="h-4 w-px bg-[#EBECE7]" />
                <div className="inline-flex items-center gap-2 rounded-md bg-[#F9F9F9] px-3 py-2 text-sm font-medium text-[#14462a]">
                  <Clock className="h-4 w-4 text-[#949494]" />
                  {invoice.paymentTerms}
                </div>
                <div className="h-4 w-px bg-[#EBECE7]" />
                {getStatusBadge(invoice.status)}
              </div>

              {/* Parties compact layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* From */}
                <div className="rounded-lg border border-[#EBECE7] p-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EBECE7]">
                    <Building2 className="h-4 w-4 text-[#949494]" />
                    <span className="text-xs font-semibold text-[#949494] uppercase tracking-wide">From</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="text-base font-semibold text-[#14462a]">{invoice.issuer.businessName}</div>
                      <div className="text-sm text-[#949494] mt-0.5">{invoice.issuer.name}</div>
                    </div>
                    {invoice.issuer.address && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-3.5 w-3.5 text-[#949494] mt-0.5 shrink-0" />
                        <div className="text-sm text-[#949494]">{invoice.issuer.address}</div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#949494] shrink-0" />
                      <div className="text-sm text-[#14462a]">{invoice.issuer.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#949494] shrink-0" />
                      <div className="text-sm text-[#949494]">{invoice.issuer.phone}</div>
                    </div>
                    {invoice.issuer.taxId && (
                      <div className="flex items-center gap-2 pt-2 mt-2 border-t border-[#EBECE7]">
                        <Hash className="h-3.5 w-3.5 text-[#949494] shrink-0" />
                        <div className="text-xs text-[#949494]">Tax ID: {invoice.issuer.taxId}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bill To */}
                <div className="rounded-lg border border-[#EBECE7] p-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EBECE7]">
                    <User className="h-4 w-4 text-[#949494]" />
                    <span className="text-xs font-semibold text-[#949494] uppercase tracking-wide">Bill To</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="text-base font-semibold text-[#14462a]">{invoice.customer.name}</div>
                      {invoice.customer.company && (
                        <div className="text-sm text-[#949494] mt-0.5">{invoice.customer.company}</div>
                      )}
                    </div>
                    {invoice.customer.address && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-3.5 w-3.5 text-[#949494] mt-0.5 shrink-0" />
                        <div className="text-sm text-[#949494]">{invoice.customer.address}</div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#949494] shrink-0" />
                      <div className="text-sm text-[#14462a]">{invoice.customer.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#949494] shrink-0" />
                      <div className="text-sm text-[#949494]">{invoice.customer.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual currency info (when enabled) */}
              {invoice.currency?.dualCurrency && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#EBECE7] bg-[#F9F9F9] text-xs">
                  <div className="font-medium text-[#14462a]">
                    1 {invoice.currency.primary} = {invoice.currency.exchangeRate} {invoice.currency.secondary}
                  </div>
                  <div className="h-3 w-px bg-[#EBECE7]" />
                  <div className="text-[#949494]">
                    {invoice.currency.rateSource} • {invoice.currency.rateDate}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Line Items Table */}
              <div>
                <h3 className="text-sm font-semibold text-[#14462a] mb-4">Items</h3>
                <div className="border border-[#EBECE7] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F9F9F9] border-[#EBECE7] hover:bg-[#F9F9F9]">
                        <TableHead className="text-[#14462a] font-semibold">Description</TableHead>
                        <TableHead className="text-[#14462a] font-semibold text-center w-24">Qty</TableHead>
                        <TableHead className="text-right text-[#14462a] font-semibold w-32">Unit Price</TableHead>
                        <TableHead className="text-right text-[#14462a] font-semibold w-32">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item, idx) => (
                        <TableRow key={item.id} className="border-[#EBECE7] hover:bg-[#F9F9F9]/50">
                          <TableCell className="text-[#14462a] font-medium py-4">{item.description}</TableCell>
                          <TableCell className="text-[#949494] text-center py-4">{item.quantity}</TableCell>
                          <TableCell className="text-right text-[#949494] py-4">{item.unitPrice}</TableCell>
                          <TableCell className="text-right text-[#14462a] font-semibold py-4">{item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Totals */}
              <div className="border border-[#EBECE7] rounded-lg overflow-hidden bg-[#F9F9F9]/30">
                <div className="space-y-0 divide-y divide-[#EBECE7]">
                  <div className="flex justify-between px-6 py-4">
                    <span className="text-sm text-[#949494]">Sub Total</span>
                    <span className="text-sm text-[#14462a] font-semibold">{invoice.subtotal}</span>
                  </div>
                  {invoice.discount !== "$0.00" && (
                    <div className="flex justify-between px-6 py-4">
                      <span className="text-sm text-[#949494]">Discount</span>
                      <span className="text-sm text-[#14462a]">-{invoice.discount}</span>
                    </div>
                  )}
                  {invoice.tax !== "$0.00" && (
                    <div className="flex justify-between px-6 py-4">
                      <span className="text-sm text-[#949494]">Tax</span>
                      <span className="text-sm text-[#14462a]">{invoice.tax}</span>
                    </div>
                  )}
                  <div className="flex justify-between px-6 py-4 bg-[#F9F9F9]">
                    <span className="text-base text-[#14462a] font-semibold">Total Amount</span>
                    <span className="text-lg text-[#14462a] font-bold">{invoice.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment History Preview */}
          {invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-[#14462a]">Recent Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Balance summary */}
                <div className="rounded-lg border border-[#EBECE7] p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#949494]">Paid {paidPct}%</span>
                    <span className="text-[#14462a] font-medium">Balance {invoice.balanceDue}</span>
                  </div>
                  <Progress value={paidPct} className="h-2" />
                </div>

                {invoice.payments.slice(0, 2).map((payment) => (
                  <div key={payment.id} className="p-3 bg-[#F9F9F9] rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-semibold text-[#14462a]">{payment.amount}</div>
                        <div className="text-xs text-[#949494] mt-0.5">{payment.date}</div>
                      </div>
                      <Badge className="bg-[#14462a] text-white border-[#14462a] text-xs">
                        <Check className="h-3 w-3" /> {payment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-[#14462a] border-[#EBECE7] font-medium">
                        {payment.rail}
                      </Badge>
                      <span className="text-[#949494] font-mono">ref …{payment.reference.slice(-4)}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveTab("payments")}
                >
                  View All Payments
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[#14462a]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(invoice.status === "Pending" || invoice.status === "Partially Paid") && (
                <Button 
                  className="w-full justify-start bg-[#14462a] hover:bg-[#14462a]/90 text-white"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start hover:bg-[#F9F9F9]">
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-[#F9F9F9]"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  } catch {}
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copiedLink ? "Link Copied" : "Copy Invoice Link"}
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-[#F9F9F9]">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {invoice.status === "Paid" && (
                <Button variant="outline" className="w-full justify-start hover:bg-[#F9F9F9]" asChild>
                  <Link href={`/receipts/${invoice.id}`}>
                    <ReceiptIcon className="h-4 w-4 mr-2" />
                    View Receipt
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>

    {/* Payments Tab */}
    <TabsContent value="payments" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#14462a]">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#EBECE7] hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rail</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.payments.map((payment) => (
                <TableRow key={payment.id} className="border-[#EBECE7]">
                  <TableCell className="text-[#949494]">{payment.date}</TableCell>
                  <TableCell className="font-semibold">{payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[#14462a] border-[#EBECE7] font-medium">
                      {payment.rail}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#949494] font-mono text-xs">
                    ...{payment.reference.slice(-4)}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#14462a] text-white border-[#14462a]">
                      <Check className="h-3.5 w-3.5" /> {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Activity Tab */}
    <TabsContent value="activity" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#14462a]">Activity Log</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {invoice.activity.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline connector */}
                {index !== invoice.activity.length - 1 && (
                  <div className="absolute left-[7px] top-8 bottom-0 w-px bg-[#EBECE7]" />
                )}
                
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                  <div className="h-4 w-4 rounded-full bg-[#14462a] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#14462a] mb-0.5">{item.action}</div>
                      <div className="text-sm text-[#949494] leading-relaxed">{item.description}</div>
                    </div>
                    <div className="text-xs text-[#949494] whitespace-nowrap">{item.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Attachments Tab */}
    <TabsContent value="attachments" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#14462a]">Attachments</CardTitle>
          <Button size="sm" className="bg-[#14462a] hover:bg-[#14462a]/90 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Upload File
          </Button>
        </CardHeader>
        <CardContent>
          {invoice.attachments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F9F9F9] mb-4">
                <Paperclip className="h-8 w-8 text-[#949494]" />
              </div>
              <h3 className="text-base font-semibold text-[#14462a] mb-2">No attachments</h3>
              <p className="text-sm text-[#949494] mb-6 max-w-sm mx-auto">
                Upload contracts, receipts, or other documents related to this invoice.
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Attachment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoice.attachments.map((attachment: any, idx: number) => (
                <div key={idx} className="border border-[#EBECE7] rounded-lg p-4 hover:border-[#14462a] transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F9F9F9]">
                      <FileText className="h-5 w-5 text-[#14462a]" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[#14462a] truncate">{attachment.name}</h4>
                    <p className="text-xs text-[#949494]">{attachment.size}</p>
                    <p className="text-xs text-[#949494]">Uploaded {attachment.date}</p>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* Settings/Details Tab */}
    <TabsContent value="settings" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#14462a]">Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs font-medium text-[#949494] mb-2">Payment Terms</div>
              <div className="text-sm text-[#14462a]">{invoice.paymentTerms}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#949494] mb-2">Currency</div>
              <div className="text-sm text-[#14462a]">
                {invoice.currency.dualCurrency 
                  ? `${invoice.currency.primary} / ${invoice.currency.secondary}`
                  : invoice.currency.primary
                }
              </div>
            </div>
            {invoice.currency.dualCurrency && (
              <>
                <div>
                  <div className="text-xs font-medium text-[#949494] mb-2">Exchange Rate</div>
                  <div className="text-sm text-[#14462a]">
                    1 {invoice.currency.primary} = {invoice.currency.exchangeRate} {invoice.currency.secondary}
                  </div>
                  <div className="text-xs text-[#949494] mt-1">
                    {invoice.currency.rateSource} • {invoice.currency.rateDate}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#14462a]">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {invoice.paymentMethods.map((method, idx) => (
                <Badge key={idx} variant="outline" className="text-[#14462a] border-[#EBECE7]">
                  {method}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#14462a]">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoice.earlyPaymentDiscount && (
              <div>
                <div className="text-xs font-medium text-[#949494] mb-2">Early Payment Discount</div>
                <div className="text-sm text-[#14462a]">{invoice.earlyPaymentDiscount}</div>
              </div>
            )}
            {invoice.lateFeePolicy && (
              <div>
                <div className="text-xs font-medium text-[#949494] mb-2">Late Fee Policy</div>
                <div className="text-sm text-[#14462a]">{invoice.lateFeePolicy}</div>
              </div>
            )}
            {invoice.termsAndConditions && (
              <div>
                <div className="text-xs font-medium text-[#949494] mb-2">Full Terms</div>
                <div className="text-sm text-[#949494] leading-relaxed">{invoice.termsAndConditions}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
    </div>
  );
}

