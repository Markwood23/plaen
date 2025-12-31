"use client";

import { Button } from "@/components/ui/button";
import { Input, NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { 
  ArrowLeft2, 
  Add, 
  Send2,
  Calendar,
  Warning2,
  CloseCircle,
  TickCircle
} from "iconsax-react";
import { Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useInvoiceDetail, updateInvoice } from "@/hooks/useInvoicesData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LineItem {
  id: number;
  description: string;
  details: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  discountType: "percent" | "fixed";
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { maskAmount } = useBalanceVisibility();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Fetch existing invoice data
  const { invoice, loading, error } = useInvoiceDetail(id);

  // Form state
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [currency, setCurrency] = useState("GHS");
  const [hasPayments, setHasPayments] = useState(false);

  // Initialize form with invoice data when loaded
  useEffect(() => {
    if (invoice) {
      setIssueDate(invoice.issue_date ? parseISO(invoice.issue_date) : new Date());
      setDueDate(invoice.due_date ? parseISO(invoice.due_date) : new Date());
      setNotes(invoice.notes || "");
      setCurrency(invoice.currency || "GHS");
      setHasPayments((invoice.allocations?.length || 0) > 0);
      
      // Map line items
      if (invoice.line_items && invoice.line_items.length > 0) {
        setLineItems(invoice.line_items.map((item, index) => ({
          id: index + 1,
          description: item.description || "",
          details: "",
          quantity: item.quantity || 1,
          unitPrice: item.unit_price || 0,
          tax: 0,
          discount: 0,
          discountType: "percent" as const,
        })));
      } else {
        setLineItems([{
          id: 1,
          description: "",
          details: "",
          quantity: 1,
          unitPrice: 0,
          tax: 0,
          discount: 0,
          discountType: "percent",
        }]);
      }
    }
  }, [invoice]);

  // Calculations
  const calculateLineTotal = (item: LineItem) => {
    const baseAmount = item.quantity * item.unitPrice;
    const discountAmount = item.discountType === "percent" 
      ? baseAmount * (item.discount / 100)
      : item.discount;
    const afterDiscount = baseAmount - discountAmount;
    const taxAmount = afterDiscount * (item.tax / 100);
    return afterDiscount + taxAmount;
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = lineItems.reduce((sum, item) => {
    const base = item.quantity * item.unitPrice;
    return sum + (item.discountType === "percent" ? base * (item.discount / 100) : item.discount);
  }, 0);
  const totalTax = lineItems.reduce((sum, item) => {
    const base = item.quantity * item.unitPrice;
    const discount = item.discountType === "percent" ? base * (item.discount / 100) : item.discount;
    return sum + ((base - discount) * (item.tax / 100));
  }, 0);
  const total = subtotal - totalDiscount + totalTax;

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Line item handlers
  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id), 0) + 1;
    setLineItems([...lineItems, {
      id: newId,
      description: "",
      details: "",
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      discount: 0,
      discountType: "percent",
    }]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Handle form submission
  const handleSave = async () => {
    if (lineItems.some(item => !item.description.trim() || item.unitPrice <= 0)) {
      setSubmitError("Please fill in all required line item fields");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const updateData = {
        issue_date: format(issueDate, 'yyyy-MM-dd'),
        due_date: format(dueDate, 'yyyy-MM-dd'),
        notes: notes || undefined,
        line_items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: Math.round(item.unitPrice * 100),
        })),
      };

      const result = await updateInvoice(id, updateData as Parameters<typeof updateInvoice>[1]);

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push(`/invoices/${id}`);
        }, 1500);
      } else {
        setSubmitError(result.error || "Failed to update invoice");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
          <CloseCircle size={32} color="#DC2626" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {error || 'Invoice not found'}
        </h2>
        <Button asChild className="rounded-full" style={{ backgroundColor: '#14462a' }}>
          <Link href="/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
            <Link href={`/invoices/${id}`}>
              <ArrowLeft2 size={16} />
              Back to Invoice
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[#2D2D2D]">
              Edit Invoice {invoice.invoice_number}
            </h1>
            <p className="text-sm text-[#B0B3B8] mt-1">
              Update invoice details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full" 
            asChild
          >
            <Link href={`/invoices/${id}`}>Cancel</Link>
          </Button>
          <Button
            className="rounded-full px-6"
            style={{ backgroundColor: '#14462a' }}
            onClick={handleSave}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Payment Warning */}
      {hasPayments && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This invoice has received payments. Some fields may be restricted to maintain financial accuracy.
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <TickCircle size={16} color="#14462a" />
          <AlertDescription className="text-green-800">
            Invoice updated successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert className="bg-red-50 border-red-200">
          <Warning2 size={16} color="#DC2626" />
          <AlertDescription className="text-red-800">{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Customer Info (Read-only when has payments) */}
      <div className="rounded-2xl border border-[#EBECE7] p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#2D2D2D] mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-[#65676B]">Customer Name</Label>
            <p className="text-sm font-medium text-[#2D2D2D] mt-1">
              {invoice.customer?.name || "No customer"}
            </p>
          </div>
          <div>
            <Label className="text-xs text-[#65676B]">Email</Label>
            <p className="text-sm text-[#2D2D2D] mt-1">
              {invoice.customer?.email || "-"}
            </p>
          </div>
          <div>
            <Label className="text-xs text-[#65676B]">Company</Label>
            <p className="text-sm text-[#2D2D2D] mt-1">
              {invoice.customer?.company || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="rounded-2xl border border-[#EBECE7] p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#2D2D2D] mb-4">Invoice Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-[#65676B]">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1.5 h-11 rounded-xl border-[#E4E6EB]"
                  disabled={hasPayments}
                >
                  <Calendar size={16} className="mr-2 text-[#65676B]" />
                  {format(issueDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={issueDate}
                  onSelect={(date) => date && setIssueDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-xs text-[#65676B]">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1.5 h-11 rounded-xl border-[#E4E6EB]"
                >
                  <Calendar size={16} className="mr-2 text-[#65676B]" />
                  {format(dueDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-2xl border border-[#EBECE7] p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#2D2D2D]">Line Items</h3>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1.5"
            onClick={addLineItem}
            disabled={hasPayments}
          >
            <Add size={14} />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-4 rounded-xl bg-[#FAFBFC]">
              <div className="col-span-4">
                <Label className="text-xs text-[#65676B]">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                  className="mt-1.5 h-10 rounded-xl border-[#E4E6EB]"
                  disabled={hasPayments}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-[#65676B]">Quantity</Label>
                <NumberInput
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                  min={1}
                  className="mt-1.5 h-10 rounded-xl border-[#E4E6EB]"
                  disabled={hasPayments}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-[#65676B]">Unit Price</Label>
                <NumberInput
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                  className="mt-1.5 h-10 rounded-xl border-[#E4E6EB]"
                  disabled={hasPayments}
                />
              </div>
              <div className="col-span-1">
                <Label className="text-xs text-[#65676B]">Tax %</Label>
                <NumberInput
                  value={item.tax}
                  onChange={(e) => updateLineItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="mt-1.5 h-10 rounded-xl border-[#E4E6EB]"
                  disabled={hasPayments}
                />
              </div>
              <div className="col-span-2 text-right">
                <Label className="text-xs text-[#65676B]">Total</Label>
                <p className="text-sm font-medium text-[#2D2D2D] mt-3">
                  {maskAmount(formatCurrency(calculateLineTotal(item)))}
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                {lineItems.length > 1 && !hasPayments && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl text-red-500 hover:bg-red-50"
                    onClick={() => removeLineItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-6 border-t border-[#EBECE7]">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#65676B]">Subtotal</span>
                <span className="text-[#2D2D2D]">{maskAmount(formatCurrency(subtotal))}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#65676B]">Discount</span>
                  <span className="text-red-600">-{maskAmount(formatCurrency(totalDiscount))}</span>
                </div>
              )}
              {totalTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#65676B]">Tax</span>
                  <span className="text-[#2D2D2D]">{maskAmount(formatCurrency(totalTax))}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#EBECE7]">
                <span className="text-[#2D2D2D]">Total</span>
                <span className="text-[#14462a]">{maskAmount(formatCurrency(total))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-[#EBECE7] p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#2D2D2D] mb-4">Notes</h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes or payment instructions..."
          className="min-h-[100px] rounded-xl border-[#E4E6EB]"
        />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          className="rounded-full px-6" 
          asChild
        >
          <Link href={`/invoices/${id}`}>Cancel</Link>
        </Button>
        <Button
          className="rounded-full px-6"
          style={{ backgroundColor: '#14462a' }}
          onClick={handleSave}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
