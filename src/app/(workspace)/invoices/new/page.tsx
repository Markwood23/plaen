"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input, NumberInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  ArrowLeft2, 
  Add, 
  Send2,
  Building,
  Receipt21,
  Calendar,
  User,
  Card,
  InfoCircle,
  Edit2,
  Warning2,
  Note,
  UserAdd,
  Sms,
  Call
} from "iconsax-react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useContactsData } from "@/hooks/useContactsData";
import { useSettingsData } from "@/hooks/useSettingsData";
import { useProductsServices, type ProductService, type ProductServiceInput } from "@/hooks/useProductsServices";
import { createInvoice } from "@/hooks/useInvoicesData";
import { InvoiceTemplateType } from "@/components/invoices/templates";
import { ItemSelector } from "@/components/invoices/item-selector";
import { ProductServiceModal } from "@/components/invoices/product-service-modal";

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Allow various phone formats: +233 XX XXX XXXX, (XXX) XXX-XXXX, etc.
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phone === "" || (phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9);
};

const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

const isValidQuantity = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

const isValidPercentage = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 100;
};

export default function CreateInvoicePage() {
  const router = useRouter();
  const [template, setTemplate] = useState<InvoiceTemplateType>("modern");
  const [selectedContact, setSelectedContact] = useState<string>("");
  const { maskAmount } = useBalanceVisibility();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickAttachments = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentsSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowed = new Set(['application/pdf', 'image/png', 'image/jpeg']);
    const maxBytes = 10 * 1024 * 1024;
    const valid: File[] = [];

    for (const f of files) {
      if (f.size > maxBytes) {
        setAttachmentError('One or more files exceed 10MB');
        continue;
      }
      if (!allowed.has(f.type)) {
        setAttachmentError('Only PDF, PNG, JPG files are supported');
        continue;
      }
      valid.push(f);
    }

    if (valid.length > 0) {
      setAttachmentFiles((prev) => [...prev, ...valid]);
    }

    // Reset input so selecting same file again triggers change
    e.target.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Fetch real contacts from API
  const { contacts: savedContacts, loading: contactsLoading, refetch: refetchContacts } = useContactsData({ limit: 100 });
  
  // Fetch user profile/settings for "From" section
  const { settings: userSettings, loading: settingsLoading } = useSettingsData();
  
  // Fetch products/services from API
  const { 
    products: savedProducts, 
    loading: productsLoading, 
    createProduct, 
    updateProduct,
    refetch: refetchProducts 
  } = useProductsServices({ is_active: true });
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductService | null>(null);
  
  // Add New Customer Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [customerCreateError, setCustomerCreateError] = useState<string | null>(null);
  
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    notes: ""
  });

  // Line Items State
  const [lineItems, setLineItems] = useState([
    { 
      id: 1, 
      description: "", 
      details: "",
      quantity: 1, 
      unitPrice: 0, 
      tax: 0, 
      discount: 0,
      discountType: "percent" as "percent" | "fixed"
    }
  ]);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['mtn', 'bank']);

  // Payment Reminders State
  const [paymentReminders, setPaymentReminders] = useState<string[]>(['due-date']);

  // Currency State
  const [primaryCurrency, setPrimaryCurrency] = useState("ghs");
  const [secondaryCurrency, setSecondaryCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [loadingRate, setLoadingRate] = useState(false);

  // Invoice Number is generated server-side when invoice is created
  // Show a preview placeholder based on user's prefix
  const invoiceNumberPreview = userSettings?.invoice_prefix 
    ? `${userSettings.invoice_prefix}-XXXX` 
    : "GH-XXXX";

  // Date State
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  const [exchangeRateDate, setExchangeRateDate] = useState<Date>(new Date());

  // Validation State
  const [errors, setErrors] = useState<{
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    lineItems?: { [key: number]: { description?: string; quantity?: string; unitPrice?: string; tax?: string; discount?: string } };
    paymentMethods?: string;
    general?: string;
  }>({});
  const [touched, setTouched] = useState<{
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    lineItems?: { [key: number]: { description?: boolean; quantity?: boolean; unitPrice?: boolean; tax?: boolean; discount?: boolean } };
  }>({});

  // Mark field as touched
  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validate customer name
  const validateCustomerName = useCallback((name: string): string | undefined => {
    if (!name.trim()) return "Customer name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  }, []);

  // Validate customer email
  const validateCustomerEmail = useCallback((email: string): string | undefined => {
    if (!email.trim()) return "Email address is required";
    if (!isValidEmail(email)) return "Please enter a valid email address";
    return undefined;
  }, []);

  // Validate customer phone
  const validateCustomerPhone = useCallback((phone: string): string | undefined => {
    if (phone && !isValidPhone(phone)) return "Please enter a valid phone number";
    return undefined;
  }, []);

  // Validate all line items
  const validateLineItems = useCallback((): { [key: number]: { description?: string; quantity?: string; unitPrice?: string; tax?: string; discount?: string } } => {
    const itemErrors: { [key: number]: { description?: string; quantity?: string; unitPrice?: string; tax?: string; discount?: string } } = {};
    
    lineItems.forEach(item => {
      const errors: { description?: string; quantity?: string; unitPrice?: string; tax?: string; discount?: string } = {};
      
      if (!item.description.trim()) errors.description = "Description is required";
      if (!isValidQuantity(item.quantity)) errors.quantity = "Quantity must be greater than 0";
      if (!isPositiveNumber(item.unitPrice)) errors.unitPrice = "Invalid price";
      if (item.unitPrice <= 0) errors.unitPrice = "Price must be greater than 0";
      if (!isValidPercentage(item.tax)) errors.tax = "Tax must be 0-100%";
      if (item.discountType === "percent" && !isValidPercentage(item.discount)) {
        errors.discount = "Discount must be 0-100%";
      } else if (item.discountType === "fixed" && !isPositiveNumber(item.discount)) {
        errors.discount = "Invalid discount";
      }
      
      if (Object.keys(errors).length > 0) {
        itemErrors[item.id] = errors;
      }
    });
    
    return itemErrors;
  }, [lineItems]);

  // Validate entire form before submission
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate customer info
    const nameError = validateCustomerName(customerData.name);
    if (nameError) newErrors.customerName = nameError;
    
    const emailError = validateCustomerEmail(customerData.email);
    if (emailError) newErrors.customerEmail = emailError;
    
    const phoneError = validateCustomerPhone(customerData.phone);
    if (phoneError) newErrors.customerPhone = phoneError;
    
    // Validate line items
    const lineItemErrors = validateLineItems();
    if (Object.keys(lineItemErrors).length > 0) {
      newErrors.lineItems = lineItemErrors;
    }
    
    // Validate payment methods
    if (paymentMethods.length === 0) {
      newErrors.paymentMethods = "Please select at least one payment method";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      customerName: true,
      customerEmail: true,
      customerPhone: true,
    });
    
    if (!validateForm()) {
      // Scroll to first error
      setErrors(prev => ({ ...prev, general: "Please fix the errors before previewing the invoice" }));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setAttachmentError(null);
    
    try {
      // Find or use selected contact ID
      let customerId: string | undefined;
      if (selectedContact && selectedContact !== "manual") {
        customerId = selectedContact;
      }
      
      // Calculate totals for invoice-level storage
      const calculatedTotals = calculateTotals();
      
      // Prepare invoice data
      const invoiceData = {
        customer_id: customerId,
        issue_date: format(issueDate, 'yyyy-MM-dd'),
        due_date: format(dueDate, 'yyyy-MM-dd'),
        currency: primaryCurrency.toUpperCase(),
        notes: customerData.notes || undefined,
        // Store tax and discount at invoice level (in minor units)
        tax_amount: Math.round(calculatedTotals.totalTax * 100),
        discount_amount: Math.round(calculatedTotals.totalDiscount * 100),
        line_items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          // Store in minor units (e.g., pesewas/cents) to match DB + payment flows
          unit_price: Math.round(item.unitPrice * 100),
        })),
      };
      
      const result = await createInvoice(invoiceData);
      
      if (result.success && result.invoice) {
        const invoiceId = result.invoice.id;

        // Upload attachments (best-effort) after invoice creation
        if (attachmentFiles.length > 0) {
          await Promise.all(
            attachmentFiles.map(async (file) => {
              const formData = new FormData();
              formData.set('entity_id', invoiceId);
              formData.set('entity_type', 'invoice');
              formData.set('file', file);

              const res = await fetch('/api/attachments', {
                method: 'POST',
                body: formData,
              });

              if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || 'Attachment upload failed');
              }
            })
          ).catch((err) => {
            console.error('Attachment upload error:', err);
            setAttachmentError(err instanceof Error ? err.message : 'Attachment upload failed');
          });
        }

        // Redirect to preview (send happens from the preview screen)
        router.push(`/invoices/${invoiceId}/preview`);
      } else {
        setSubmitError(result.error || 'Failed to create invoice');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle creating a new customer inline
  const handleCreateCustomer = async () => {
    if (!newCustomerData.name.trim()) {
      setCustomerCreateError("Customer name is required");
      return;
    }
    
    setCreatingCustomer(true);
    setCustomerCreateError(null);
    
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustomerData.name,
          email: newCustomerData.email || null,
          phone: newCustomerData.phone || null,
          company: newCustomerData.company || null,
          address: newCustomerData.address ? { line1: newCustomerData.address } : {},
          notes: newCustomerData.notes || null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create customer");
      }
      
      // Refresh the contacts list
      await refetchContacts();
      
      // Select the new customer
      setSelectedContact(data.customer.id);
      
      // Fill in the customer data form
      setCustomerData({
        name: data.customer.name,
        email: data.customer.email || "",
        company: data.customer.company || "",
        phone: data.customer.phone || "",
        address: data.customer.address?.line1 || "",
        notes: data.customer.notes || "",
      });
      
      // Close modal and reset form
      setShowAddCustomerModal(false);
      setNewCustomerData({
        name: "",
        email: "",
        company: "",
        phone: "",
        address: "",
        notes: ""
      });
    } catch (err) {
      setCustomerCreateError(err instanceof Error ? err.message : "Failed to create customer");
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleContactSelect = (contactId: string) => {
    if (contactId === "add-new") {
      // Open the add customer modal
      setShowAddCustomerModal(true);
      return;
    }
    
    setSelectedContact(contactId);
    if (contactId === "manual") {
      // Clear form for manual entry
      setCustomerData({
        name: "",
        email: "",
        company: "",
        phone: "",
        address: "",
        notes: ""
      });
    } else {
      // Autofill with selected contact from API
      const contact = savedContacts.find(c => c.id === contactId);
      if (contact) {
        setCustomerData({
          name: contact.name,
          email: contact.email || "",
          company: contact.company || "",
          phone: contact.phone || "",
          address: contact.address || "",
          notes: contact.notes || ""
        });
      }
    }
  };

  // Handle product/service selection for line item
  const handleProductSelect = (lineItemId: number, product: ProductService | null) => {
    if (product === null) {
      // Clear for manual entry
      setLineItems(lineItems.map(item =>
        item.id === lineItemId
          ? { ...item, description: "", details: "", unitPrice: 0, tax: 0, discount: 0, discountType: "percent" as "percent" | "fixed" }
          : item
      ));
    } else {
      // Autofill with selected product/service - populate ALL available fields
      setLineItems(lineItems.map(item =>
        item.id === lineItemId
          ? { 
              ...item, 
              description: product.name,
              details: product.details || product.description || "",
              unitPrice: product.unit_price,
              tax: product.default_tax,
              discount: product.default_discount,
              discountType: product.discount_type
            }
          : item
      ));
    }
  };

  // Handle creating a new product from the modal
  const handleCreateProduct = async (data: ProductServiceInput): Promise<ProductService> => {
    const product = await createProduct(data);
    await refetchProducts();
    return product;
  };

  // Handle updating an existing product
  const handleUpdateProduct = async (data: ProductServiceInput): Promise<ProductService> => {
    if (!editingProduct) throw new Error("No product to update");
    const product = await updateProduct(editingProduct.id, data);
    await refetchProducts();
    return product;
  };

  // Line Item Functions
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
      discountType: "percent" as "percent" | "fixed"
    }]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
      // Clear errors for removed item
      if (errors.lineItems?.[id]) {
        const newLineItemErrors = { ...errors.lineItems };
        delete newLineItemErrors[id];
        setErrors(prev => ({ ...prev, lineItems: newLineItemErrors }));
      }
    }
  };

  const updateLineItem = (id: number, field: string, value: string | number) => {
    let processedValue = value;
    
    // Validate and constrain numeric fields
    if (field === 'quantity') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      processedValue = Math.max(0, numValue); // Cannot be negative
    }
    if (field === 'unitPrice') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      processedValue = Math.max(0, numValue); // Cannot be negative
    }
    if (field === 'tax') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      processedValue = Math.min(100, Math.max(0, numValue)); // 0-100%
    }
    if (field === 'discount') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      const item = lineItems.find(i => i.id === id);
      if (item?.discountType === 'percent') {
        processedValue = Math.min(100, Math.max(0, numValue)); // 0-100% for percentage
      } else {
        processedValue = Math.max(0, numValue); // Cannot be negative for fixed
      }
    }
    
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: processedValue } : item
    ));
  };

  const calculateLineTotal = (item: typeof lineItems[0]) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * item.tax) / 100;
    const discountAmount = item.discountType === "percent" 
      ? (subtotal * item.discount) / 100 
      : item.discount;
    return subtotal + taxAmount - discountAmount;
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalTax = lineItems.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.tax) / 100), 0);
    const totalDiscount = lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (item.discountType === "percent" 
        ? (itemSubtotal * item.discount) / 100 
        : item.discount);
    }, 0);
    const total = subtotal + totalTax - totalDiscount;
    
    return { subtotal, totalTax, totalDiscount, total };
  };

  const totals = calculateTotals();

  // Toggle payment method
  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  // Toggle payment reminder
  const togglePaymentReminder = (reminderId: string) => {
    setPaymentReminders(prev => 
      prev.includes(reminderId) 
        ? prev.filter(id => id !== reminderId)
        : [...prev, reminderId]
    );
  };

  // Fetch exchange rate from API
  const fetchExchangeRate = async (from: string, to: string) => {
    if (!from || !to || from === to) {
      setExchangeRate("");
      return;
    }

    setLoadingRate(true);
    try {
      // Using exchangerate-api.com free tier (no API key needed for basic usage)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
      const data = await response.json();
      
      if (data.rates && data.rates[to.toUpperCase()]) {
        const rate = data.rates[to.toUpperCase()];
        setExchangeRate(rate.toFixed(4));
      } else {
        setExchangeRate("");
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      setExchangeRate("");
    } finally {
      setLoadingRate(false);
    }
  };

  // Handle secondary currency change
  const handleSecondaryCurrencyChange = (value: string) => {
    setSecondaryCurrency(value);
    if (value && value !== "none") {
      fetchExchangeRate(primaryCurrency, value);
    } else {
      setExchangeRate("");
    }
  };

  // Handle primary currency change
  const handlePrimaryCurrencyChange = (value: string) => {
    setPrimaryCurrency(value);
    if (secondaryCurrency && secondaryCurrency !== "none") {
      fetchExchangeRate(value, secondaryCurrency);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            asChild 
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-[rgba(240,242,245,0.8)] shrink-0"
          >
            <Link href="/invoices">
              <ArrowLeft2 size={16} color="#2D2D2D" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>New Invoice</h1>
            <p className="text-xs sm:text-sm mt-0.5 hidden sm:block" style={{ color: '#B0B3B8' }}>Create a professional invoice for your client</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {errors.general && (
            <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 sm:gap-1.5 mr-1 sm:mr-2">
              <Warning2 size={14} />
              <span className="hidden sm:inline">{errors.general}</span>
              <span className="sm:hidden">Error</span>
            </p>
          )}
          {submitError && (
            <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 sm:gap-1.5 mr-1 sm:mr-2">
              <Warning2 size={14} />
              <span className="hidden sm:inline">{submitError}</span>
              <span className="sm:hidden">Error</span>
            </p>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full px-3 sm:px-5 h-8 sm:h-10 border-[#E4E6EB] hover:bg-[rgba(240,242,245,0.5)] hover:border-[#B0B3B8] text-xs sm:text-sm"
            disabled={submitting}
          >
            <Note size={14} color="currentColor" className="sm:mr-2" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>
          <Button 
            size="sm"
            className="rounded-full px-3 sm:px-5 h-8 sm:h-10 shadow-sm transition-all hover:shadow-md hover:scale-105 text-xs sm:text-sm"
            style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            <Send2 size={14} color="currentColor" className="sm:mr-2" />
            <span className="hidden sm:inline">{submitting ? 'Creating...' : 'Preview'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="details" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <Receipt21 size={14} color="currentColor" className="sm:mr-1" />
            <span className="hidden sm:inline">Invoice Details</span>
            <span className="sm:hidden">Details</span>
          </TabsTrigger>
          <TabsTrigger value="parties" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <User size={14} color="currentColor" className="sm:mr-1" />
            <span className="hidden sm:inline">Parties</span>
            <span className="sm:hidden">Parties</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <Note size={14} color="currentColor" className="sm:mr-1" />
            <span className="hidden sm:inline">Line Items</span>
            <span className="sm:hidden">Items</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <Card size={14} color="currentColor" className="sm:mr-1" />
            <span className="hidden sm:inline">Payment</span>
            <span className="sm:hidden">Pay</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <InfoCircle size={14} color="currentColor" className="sm:mr-1" />
            <span className="hidden sm:inline">Additional</span>
            <span className="sm:hidden">More</span>
          </TabsTrigger>
        </TabsList>

          {/* Tab 1: Details - Enhanced */}
          <TabsContent value="details" className="space-y-6 sm:space-y-8 mt-4 sm:mt-8">
            {/* Template Selection */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300" style={{ backgroundColor: 'rgba(20, 70, 42, 0.03)' }}>
              <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-[#2D2D2D] mb-1">Invoice Template</h2>
                  <p className="text-xs sm:text-sm text-[#B0B3B8]">Choose a professional template that matches your brand</p>
                </div>
                <div className="w-full sm:w-72">
                  <Select value={template} onValueChange={(v) => setTemplate(v as InvoiceTemplateType)}>
                    <SelectTrigger className="border-[#E4E6EB] h-10 sm:h-11 rounded-lg sm:rounded-xl bg-white hover:border-[#14462a] transition-colors text-sm">
                      <SelectValue>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-medium text-sm">
                            {template === "standard" && "Standard"}
                            {template === "minimal" && "Minimal"}
                            {template === "professional" && "Professional"}
                            {template === "modern" && "Modern"}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        <div className="flex flex-col items-start gap-0.5 py-1">
                          <span className="font-medium text-sm">Standard</span>
                          <span className="text-xs text-[#B0B3B8]">Classic business format</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="minimal">
                        <div className="flex flex-col items-start gap-0.5 py-1">
                          <span className="font-medium text-sm">Minimal</span>
                          <span className="text-xs text-[#B0B3B8]">Clean and simple</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="professional">
                        <div className="flex flex-col items-start gap-0.5 py-1">
                          <span className="font-medium text-sm">Professional</span>
                          <span className="text-xs text-[#B0B3B8]">Corporate style</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="modern">
                        <div className="flex flex-col items-start gap-0.5 py-1">
                          <span className="font-medium text-sm">Modern</span>
                          <span className="text-xs text-[#B0B3B8]">Contemporary design</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Select the layout style for your invoice</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-4 sm:mb-5">
                <h2 className="text-sm sm:text-base font-semibold text-[#2D2D2D] mb-1">Invoice Information</h2>
                <p className="text-xs sm:text-sm text-[#B0B3B8]">Basic details about this invoice</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <Label className="text-xs sm:text-sm text-[#2D2D2D] font-medium mb-1.5 sm:mb-2 block">Invoice Number</Label>
                  <Input 
                    value={invoiceNumberPreview}
                    readOnly
                    className="h-10 sm:h-11 font-mono rounded-lg sm:rounded-xl border-[#E4E6EB] bg-gray-50 text-[#65676B] cursor-not-allowed text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-[#B0B3B8] mt-1 sm:mt-1.5">Auto-generated when saved</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-[#2D2D2D] font-medium mb-1.5 sm:mb-2 block">Payment Terms*</Label>
                  <Select defaultValue="net_30">
                    <SelectTrigger className="border-[#E4E6EB] h-10 sm:h-11 rounded-lg sm:rounded-xl hover:border-[#14462a] transition-colors text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net_15">Net 15 days</SelectItem>
                      <SelectItem value="net_30">Net 30 days</SelectItem>
                      <SelectItem value="net_60">Net 60 days</SelectItem>
                      <SelectItem value="net_90">Net 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] sm:text-xs text-[#B0B3B8] mt-1 sm:mt-1.5">When payment is due</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-[#2D2D2D] font-medium mb-1.5 sm:mb-2 block">Issue Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 sm:h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-lg sm:rounded-xl hover:border-[#14462a] transition-colors bg-white text-sm"
                      >
                        <Calendar size={14} color="#B0B3B8" className="mr-2" />
                        {issueDate ? format(issueDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={issueDate}
                        onSelect={(date) => {
                          if (date) {
                            setIssueDate(date);
                            // Auto-adjust due date if it's before the new issue date
                            if (dueDate < date) {
                              const newDueDate = new Date(date);
                              newDueDate.setDate(newDueDate.getDate() + 30);
                              setDueDate(newDueDate);
                            }
                          }
                        }}
                        disabled={(date) => {
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return date < thirtyDaysAgo;
                        }}
                        showOutsideDays={false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-[10px] sm:text-xs text-[#B0B3B8] mt-1 sm:mt-1.5">Date invoice was created (up to 30 days back)</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-[#2D2D2D] font-medium mb-1.5 sm:mb-2 block">Due Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 sm:h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-lg sm:rounded-xl hover:border-[#14462a] transition-colors bg-white text-sm"
                      >
                        <Calendar size={14} color="#B0B3B8" className="mr-2" />
                        {dueDate ? format(dueDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                        disabled={(date) => date < issueDate}
                        showOutsideDays={false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-[10px] sm:text-xs text-[#B0B3B8] mt-1 sm:mt-1.5">Must be on or after issue date</p>
                </div>
              </div>
            </div>

            {/* Invoice Reference Information */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Additional Reference</h2>
                <p className="text-sm text-[#B0B3B8]">Add reference information for this invoice (optional)</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Reference Name</Label>
                  <Input 
                    placeholder="e.g., Website Redesign, Product Order #123"
                    className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Project name, order number, or service description</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Reference ID</Label>
                  <Input 
                    placeholder="e.g., PROJ-2025-042, ORD-12345"
                    className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Internal reference or tracking number</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Invoice Category</Label>
                  <Select>
                    <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service Invoice</SelectItem>
                      <SelectItem value="product">Product Sale</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="subscription">Subscription/Recurring</SelectItem>
                      <SelectItem value="milestone">Milestone Payment</SelectItem>
                      <SelectItem value="retainer">Retainer</SelectItem>
                      <SelectItem value="mixed">Mixed (Products & Services)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Purchase Order (PO) Number</Label>
                  <Input 
                    placeholder="Client's PO number if applicable"
                    className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Required by some clients for payment processing</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Parties - Enhanced */}
          <TabsContent value="parties" className="space-y-8 mt-8">
            <div className="grid grid-cols-2 gap-8">
              {/* From */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(20, 70, 42, 0.03)' }}>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">From (Your Business)</h2>
                    <p className="text-sm text-[#B0B3B8]">Your business details from settings</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    asChild 
                    size="sm"
                    className="rounded-full px-4 h-8 hover:bg-[rgba(20,70,42,0.08)]"
                    style={{ color: '#14462a' }}
                  >
                    <Link href="/settings">
                      <Edit2 size={14} color="currentColor" className="mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
                
                {/* Read-only business info display */}
                <div className="space-y-4 p-5 rounded-xl bg-white border border-[#E4E6EB]">
                  {settingsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1">Business Name</p>
                        <p className="text-sm text-[#2D2D2D] font-medium">
                          {userSettings?.business_name || userSettings?.full_name || <span className="text-[#B0B3B8] italic">Not set</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm text-[#2D2D2D]">
                          {userSettings?.email || <span className="text-[#B0B3B8] italic">Not set</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-sm text-[#2D2D2D]">
                          {userSettings?.phone || <span className="text-[#B0B3B8] italic">Not set</span>}
                        </p>
                      </div>
                      {(userSettings?.address?.line1 || userSettings?.address?.city || userSettings?.address?.country) && (
                        <div>
                          <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1">Address</p>
                          <p className="text-sm text-[#2D2D2D] leading-relaxed">
                            {userSettings.address.line1 && <>{userSettings.address.line1}<br /></>}
                            {userSettings.address.line2 && <>{userSettings.address.line2}<br /></>}
                            {[userSettings.address.city, userSettings.address.state].filter(Boolean).join(', ')}
                            {(userSettings.address.city || userSettings.address.state) && <br />}
                            {userSettings.address.country}
                          </p>
                        </div>
                      )}
                      {userSettings?.tax_id && (
                        <div>
                          <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1">Tax/VAT Number</p>
                          <p className="text-sm text-[#2D2D2D]">{userSettings.tax_id}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <p className="text-xs text-[#B0B3B8] mt-3">
                  Update your business details in Settings.
                </p>
              </div>

              {/* Bill To */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(13, 148, 136, 0.03)' }}>
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Bill To (Customer)</h2>
                  <p className="text-sm text-[#B0B3B8]">Select from contacts or enter new details</p>
                </div>
                <div className="space-y-4 p-5 rounded-xl bg-white border border-[#E4E6EB]">
                  {/* Contact Selector */}
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Select Contact</Label>
                    <Select value={selectedContact} onValueChange={handleContactSelect} disabled={contactsLoading}>
                      <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                        <SelectValue placeholder={contactsLoading ? "Loading contacts..." : "Choose from saved contacts or enter manually"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add-new">
                          <div className="flex items-center gap-2 text-[#14462a]">
                            <UserAdd size={16} color="#14462a" />
                            <span className="font-medium">Add New Customer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="manual">
                          <div className="flex items-center gap-2">
                            <Edit2 size={16} color="currentColor" />
                            <span>Enter manually</span>
                          </div>
                        </SelectItem>
                        {savedContacts.length > 0 && (
                          <div className="h-px bg-[#E4E6EB] my-1" />
                        )}
                        {savedContacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex flex-col items-start gap-0.5 py-1">
                              <span className="font-medium text-sm">{contact.name}</span>
                              <span className="text-xs text-[#B0B3B8]">{contact.company || 'No company'} • {contact.email || 'No email'}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#B0B3B8] mt-1.5">
                      {selectedContact && selectedContact !== "manual" 
                        ? "Contact details loaded from your saved contacts"
                        : savedContacts.length === 0 && !contactsLoading
                          ? "No contacts yet. Enter details manually or add contacts first."
                          : "Select a contact to autofill or enter details manually"}
                    </p>
                  </div>

                  <div className="h-px bg-[#E4E6EB]" />

                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Customer Name*</Label>
                    <Input 
                      placeholder="Client Full Name or Contact Person"
                      className={`h-11 rounded-xl transition-colors ${
                        touched.customerName && errors.customerName 
                          ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                      }`}
                      value={customerData.name}
                      onChange={(e) => {
                        setCustomerData({...customerData, name: e.target.value});
                        if (touched.customerName) {
                          setErrors(prev => ({ ...prev, customerName: validateCustomerName(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        markTouched('customerName');
                        setErrors(prev => ({ ...prev, customerName: validateCustomerName(customerData.name) }));
                      }}
                    />
                    {touched.customerName && errors.customerName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <Warning2 size={12} />
                        {errors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Email Address*</Label>
                    <Input 
                      placeholder="client@company.com"
                      type="email"
                      className={`h-11 rounded-xl transition-colors ${
                        touched.customerEmail && errors.customerEmail 
                          ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                      }`}
                      value={customerData.email}
                      onChange={(e) => {
                        setCustomerData({...customerData, email: e.target.value});
                        if (touched.customerEmail) {
                          setErrors(prev => ({ ...prev, customerEmail: validateCustomerEmail(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        markTouched('customerEmail');
                        setErrors(prev => ({ ...prev, customerEmail: validateCustomerEmail(customerData.email) }));
                      }}
                    />
                    {touched.customerEmail && errors.customerEmail ? (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <Warning2 size={12} />
                        {errors.customerEmail}
                      </p>
                    ) : (
                      <p className="text-xs text-[#B0B3B8] mt-1.5">Invoice will be sent to this email</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Company/Organization</Label>
                    <Input 
                      placeholder="Client Company Name"
                      className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      value={customerData.company}
                      onChange={(e) => setCustomerData({...customerData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Phone Number</Label>
                    <Input 
                      placeholder="+233 XX XXX XXXX"
                      className={`h-11 rounded-xl transition-colors ${
                        touched.customerPhone && errors.customerPhone 
                          ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                      }`}
                      value={customerData.phone}
                      onChange={(e) => {
                        setCustomerData({...customerData, phone: e.target.value});
                        if (touched.customerPhone) {
                          setErrors(prev => ({ ...prev, customerPhone: validateCustomerPhone(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        markTouched('customerPhone');
                        setErrors(prev => ({ ...prev, customerPhone: validateCustomerPhone(customerData.phone) }));
                      }}
                    />
                    {touched.customerPhone && errors.customerPhone && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <Warning2 size={12} />
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Billing Address</Label>
                    <Textarea 
                      placeholder="Street Address&#10;City, Region&#10;Country"
                      className="resize-none rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      rows={4}
                      value={customerData.address}
                      onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Customer Notes</Label>
                    <Input 
                      placeholder="e.g., Billing Department, Account #12345"
                      className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      value={customerData.notes}
                      onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Line Items - Enhanced */}
          <TabsContent value="items" className="space-y-8 mt-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-[#2D2D2D]">Line Items</h2>
                  <p className="text-sm text-[#B0B3B8] mt-1">Add products or services with detailed pricing</p>
                </div>
                <Button 
                  size="sm"
                  className="rounded-full px-5 h-9 shadow-sm transition-all hover:shadow-md hover:scale-105"
                  style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
                  onClick={addLineItem}
                >
                  <Add size={16} color="currentColor" className="mr-2" />
                  Add Item
                </Button>
              </div>
              
              {/* Enhanced Table */}
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-[#E4E6EB]">
                  <div className="col-span-4">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Description</Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Quantity</Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Unit Price</Label>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Tax %</Label>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Disc %</Label>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide text-right block">Amount</Label>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide text-center block"></Label>
                  </div>
                </div>

                {/* Line Item Rows */}
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-start py-4 border-b border-[#E4E6EB]">
                    <div className="col-span-4 space-y-2">
                      <ItemSelector
                        products={savedProducts}
                        loading={productsLoading}
                        value={item.description}
                        onSelect={(product) => handleProductSelect(item.id, product)}
                        onCreateNew={() => {
                          setEditingProduct(null);
                          setShowProductModal(true);
                        }}
                        onEdit={(product) => {
                          setEditingProduct(product);
                          setShowProductModal(true);
                        }}
                        placeholder="Search products/services..."
                        maskAmount={maskAmount}
                      />
                      <div>
                        <Input 
                          placeholder="Service or product description *"
                          className={`h-11 rounded-xl transition-colors ${
                            errors.lineItems?.[item.id]?.description 
                              ? 'border-red-500 hover:border-red-500 focus:border-red-500' 
                              : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                          }`}
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        />
                        {errors.lineItems?.[item.id]?.description && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <Warning2 size={10} />
                            {errors.lineItems[item.id].description}
                          </p>
                        )}
                      </div>
                      <Textarea 
                        placeholder="Additional details (optional)"
                        className="border-[#E4E6EB] resize-none text-xs rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                        rows={2}
                        value={item.details}
                        onChange={(e) => updateLineItem(item.id, "details", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <NumberInput 
                        min={1}
                        step={1}
                        placeholder="1"
                        className={`h-11 rounded-xl transition-colors ${
                          errors.lineItems?.[item.id]?.quantity 
                            ? 'border-red-500 hover:border-red-500 focus:border-red-500' 
                            : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                        }`}
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                      {errors.lineItems?.[item.id]?.quantity && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <Warning2 size={10} />
                          Min: 1
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        className={`h-11 rounded-xl transition-colors ${
                          errors.lineItems?.[item.id]?.unitPrice 
                            ? 'border-red-500 hover:border-red-500 focus:border-red-500' 
                            : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
                        }`}
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                      {errors.lineItems?.[item.id]?.unitPrice && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <Warning2 size={10} />
                          Required
                        </p>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Input 
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        placeholder="%"
                        className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                        value={item.tax === 0 ? '' : item.tax}
                        onChange={(e) => updateLineItem(item.id, "tax", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <div className="relative">
                        <Input 
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          placeholder="0"
                          className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors pr-7"
                          value={item.discount === 0 ? '' : item.discount}
                          onChange={(e) => updateLineItem(item.id, "discount", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#B0B3B8]">%</span>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end h-11">
                      <p className="text-sm font-semibold text-[#2D2D2D]">
                        {maskAmount(`₵${calculateLineTotal(item).toFixed(2)}`)}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center h-11">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-9 w-9 p-0 rounded-lg transition-colors ${
                          lineItems.length === 1 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-red-50'
                        }`}
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        title={lineItems.length === 1 ? "Cannot remove the only item" : "Remove item"}
                      >
                        <Trash2 className={`h-4 w-4 ${lineItems.length === 1 ? 'text-gray-300' : 'text-red-500'}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(20, 70, 42, 0.03)' }}>
              <div className="flex justify-end">
                <div className="w-[400px] space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#65676B]">Subtotal</span>
                    <span className="text-sm font-medium text-[#2D2D2D]">{maskAmount(`₵${totals.subtotal.toFixed(2)}`)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#65676B]">Total Tax</span>
                    <span className="text-sm font-medium text-[#2D2D2D]">{maskAmount(`₵${totals.totalTax.toFixed(2)}`)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#65676B]">Total Discount</span>
                    <span className="text-sm font-medium text-[#14462a]">{maskAmount(`-₵${totals.totalDiscount.toFixed(2)}`)}</span>
                  </div>
                  <div className="h-px bg-[#E4E6EB]" />
                  <div className="flex justify-between py-3 bg-white px-4 rounded-xl border border-[#E4E6EB]">
                    <span className="text-base font-semibold text-[#2D2D2D]">Total Amount</span>
                    <span className="text-xl font-bold text-[#14462a]">{maskAmount(`₵${totals.total.toFixed(2)}`)}</span>
                  </div>
                  <p className="text-xs text-[#B0B3B8] text-right">Amount due by Dec 16, 2025</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Payment - Enhanced */}
          <TabsContent value="payment" className="space-y-8 mt-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Accepted Payment Methods</h2>
                    <p className="text-sm text-[#B0B3B8]">Select all payment methods you accept for this invoice</p>
                  </div>
                  {errors.paymentMethods && (
                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                      <Warning2 size={14} />
                      {errors.paymentMethods}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'mtn', name: 'MTN Mobile Money', desc: 'Pay via MTN MoMo' },
                  { id: 'vodafone', name: 'Vodafone Cash', desc: 'Pay via Vodafone' },
                  { id: 'airtel', name: 'AirtelTigo Money', desc: 'Pay via AirtelTigo' },
                  { id: 'bank', name: 'Bank Transfer', desc: 'Direct bank payment' },
                  { id: 'card', name: 'Card Payment', desc: 'Credit/Debit card' },
                  { id: 'crypto', name: 'Cryptocurrency', desc: 'Bitcoin, USDT, etc.' },
                  { id: 'paypal', name: 'PayPal', desc: 'PayPal account' },
                  { id: 'cash', name: 'Cash', desc: 'Cash payment' },
                  { id: 'cheque', name: 'Cheque', desc: 'Bank cheque' }
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                      paymentMethods.includes(method.id) 
                        ? 'border-[#14462a] bg-[rgba(20,70,42,0.03)]' 
                        : 'border-[#E4E6EB] hover:border-[#B0B3B8] bg-white'
                    }`}
                    onClick={() => togglePaymentMethod(method.id)}
                  >
                    <Checkbox 
                      id={method.id}
                      checked={paymentMethods.includes(method.id)}
                      onCheckedChange={() => togglePaymentMethod(method.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={method.id}
                        className="text-sm font-medium text-[#2D2D2D] cursor-pointer"
                      >
                        {method.name}
                      </Label>
                      <p className="text-xs text-[#B0B3B8] mt-0.5">{method.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(13, 148, 136, 0.03)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Currency Settings</h2>
                <p className="text-sm text-[#B0B3B8]">Configure primary and optional secondary currency</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Primary Currency*</Label>
                  <Select value={primaryCurrency} onValueChange={handlePrimaryCurrencyChange}>
                    <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ghs">GHS (₵) - Ghana Cedi</SelectItem>
                      <SelectItem value="usd">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                      <SelectItem value="gbp">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="ngn">NGN (₦) - Nigerian Naira</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Main currency for this invoice</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Secondary Currency</Label>
                  <Select value={secondaryCurrency} onValueChange={handleSecondaryCurrencyChange}>
                    <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                      <SelectValue placeholder="None (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="usd">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                      <SelectItem value="gbp">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="ngn">NGN (₦) - Nigerian Naira</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Show amounts in dual currency</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">
                    Exchange Rate {secondaryCurrency && secondaryCurrency !== "none" && `(1 ${primaryCurrency.toUpperCase()} = ${secondaryCurrency.toUpperCase()})`}
                  </Label>
                  <div className="relative">
                    <Input 
                      type="text"
                      placeholder="Select secondary currency"
                      className="border-[#E4E6EB] h-11 bg-[#F9F9F9] rounded-xl"
                      value={exchangeRate}
                      readOnly
                      disabled={!secondaryCurrency || secondaryCurrency === "none"}
                    />
                    {loadingRate && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#14462a] border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">
                    {exchangeRate && secondaryCurrency && secondaryCurrency !== "none" 
                      ? `Auto-updated: 1 ${primaryCurrency.toUpperCase()} = ${exchangeRate} ${secondaryCurrency.toUpperCase()}` 
                      : "Rate auto-fills when secondary currency is selected"
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Exchange Rate Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-xl hover:border-[#14462a] transition-colors bg-white"
                      >
                        <Calendar size={16} color="#B0B3B8" className="mr-2" />
                        {exchangeRateDate ? format(exchangeRateDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={exchangeRateDate}
                        onSelect={(date) => date && setExchangeRateDate(date)}
                        showOutsideDays={false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(245, 158, 11, 0.03)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Payment Reminders</h2>
                <p className="text-sm text-[#B0B3B8]">Automatically send payment reminders to customer</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'before-7', label: 'Send reminder 7 days before due date', desc: 'Gentle reminder email' },
                  { id: 'due-date', label: 'Send reminder on due date', desc: 'Payment due notification' },
                  { id: 'after-3', label: 'Send reminder 3 days after due date', desc: 'Overdue payment notice' }
                ].map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                      paymentReminders.includes(reminder.id)
                        ? 'border-[#F59E0B] bg-[rgba(245,158,11,0.03)]'
                        : 'border-[#E4E6EB] hover:border-[#B0B3B8] bg-white'
                    }`}
                    onClick={() => togglePaymentReminder(reminder.id)}
                  >
                    <Checkbox 
                      id={reminder.id}
                      checked={paymentReminders.includes(reminder.id)}
                      onCheckedChange={() => togglePaymentReminder(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={reminder.id}
                        className="text-sm font-medium text-[#2D2D2D] cursor-pointer"
                      >
                        {reminder.label}
                      </Label>
                      <p className="text-xs text-[#B0B3B8] mt-0.5">{reminder.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Additional - Enhanced */}
          <TabsContent value="additional" className="space-y-8 mt-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Notes & Instructions</h2>
                <p className="text-sm text-[#B0B3B8]">Add custom notes or payment instructions for your client</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Invoice Notes</Label>
                  <Textarea 
                    placeholder="Add any additional notes, thank you message, or special instructions...&#10;&#10;Example: Thank you for your business! Please include invoice number in payment reference."
                    className="border-[#E4E6EB] resize-none rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                    rows={5}
                  />
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Payment Instructions</Label>
                  <Textarea 
                    placeholder="Specific payment instructions for this invoice...&#10;&#10;Example: Bank Name: ABC Bank&#10;Account Number: 1234567890&#10;Account Name: Your Business Name"
                    className="border-[#E4E6EB] resize-none rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Terms & Conditions</h2>
                <p className="text-sm text-[#B0B3B8]">Standard terms that will appear on the invoice</p>
              </div>
              <Textarea 
                placeholder="Enter your standard terms and conditions...&#10;&#10;Example:&#10;1. Payment is due within 30 days of invoice date&#10;2. Late payments may incur additional fees&#10;3. All prices are in Ghana Cedis (GHS)&#10;4. Goods remain property of seller until full payment"
                className="border-[#E4E6EB] resize-none rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                rows={8}
              />
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(13, 148, 136, 0.03)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Payment Policies</h2>
                <p className="text-sm text-[#B0B3B8]">Configure early payment discounts and late payment fees</p>
              </div>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-3 block">Early Payment Discount</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Discount Type</Label>
                      <Select>
                        <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Discount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Discount Amount</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={1}
                        placeholder="e.g., 5 for 5%"
                        className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Days Before Due</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={1}
                        placeholder="e.g., 7 days"
                        className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#B0B3B8] mt-2">Example: 5% discount if paid 7 days before due date</p>
                </div>

                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-3 block">Late Payment Fee</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Fee Type</Label>
                      <Select>
                        <SelectTrigger className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] transition-colors">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Late Fee</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Fee Amount</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={1}
                        placeholder="e.g., 10 for 10%"
                        className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Days After Due</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={1}
                        placeholder="e.g., 7 days"
                        className="border-[#E4E6EB] h-11 rounded-xl hover:border-[#14462a] focus:border-[#14462a] transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#B0B3B8] mt-2">Example: 10% late fee applied 7 days after due date</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}>
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#2D2D2D] mb-1">Attachments</h2>
                <p className="text-sm text-[#B0B3B8]">Attach supporting documents to this invoice</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleAttachmentsSelected}
              />

              <div
                className="border-2 border-dashed border-[#E4E6EB] rounded-xl p-8 text-center hover:border-[#14462a] hover:bg-[rgba(20,70,42,0.02)] transition-all cursor-pointer"
                onClick={handlePickAttachments}
                role="button"
                tabIndex={0}
              >
                <Add size={32} color="#B0B3B8" className="mx-auto mb-3" />
                <p className="text-sm font-medium text-[#2D2D2D] mb-1">Click to upload files</p>
                <p className="text-xs text-[#B0B3B8]">PDF, PNG, JPG up to 10MB each</p>
              </div>

              {attachmentError && (
                <p className="text-xs mt-3" style={{ color: '#DC2626' }}>
                  {attachmentError}
                </p>
              )}

              {attachmentFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachmentFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center justify-between rounded-xl border border-[#E4E6EB] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#2D2D2D] truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-[#B0B3B8]">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-sm"
                        style={{ color: '#DC2626', fontWeight: 500 }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      
      {/* Add New Customer Modal */}
      <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserAdd size={20} color="#14462a" />
              Add New Customer
            </DialogTitle>
            <DialogDescription>
              Create a new customer to add to this invoice. They&apos;ll be saved to your contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {customerCreateError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                <Warning2 size={16} />
                {customerCreateError}
              </div>
            )}
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Customer Name *</Label>
              <Input
                placeholder="e.g. John Doe or ABC Company"
                value={newCustomerData.name}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                className="h-10 rounded-lg"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Email Address</Label>
              <div className="relative">
                <Sms size={16} color="#B0B3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  className="h-10 rounded-lg pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Phone</Label>
                <div className="relative">
                  <Call size={16} color="#B0B3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="h-10 rounded-lg pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Company</Label>
                <div className="relative">
                  <Building size={16} color="#B0B3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Company name"
                    value={newCustomerData.company}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, company: e.target.value })}
                    className="h-10 rounded-lg pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Address</Label>
              <Textarea
                placeholder="Street address, city, country"
                value={newCustomerData.address}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCustomerModal(false);
                setNewCustomerData({ name: "", email: "", company: "", phone: "", address: "", notes: "" });
                setCustomerCreateError(null);
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={creatingCustomer || !newCustomerData.name.trim()}
              className="rounded-lg bg-[#14462a] hover:bg-[#0d3320]"
            >
              {creatingCustomer ? "Creating..." : "Create & Select"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product/Service Modal */}
      <ProductServiceModal
        open={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
        mode={editingProduct ? 'edit' : 'create'}
      />
    </div>
  );
}
