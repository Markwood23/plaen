"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft01Icon, 
  Add01Icon, 
  Delete02Icon, 
  SentIcon,
  Building03Icon,
  FileValidationIcon,
  Calendar03Icon,
  UserIcon,
  Invoice03Icon,
  CreditCardIcon,
  InformationCircleIcon,
  PencilEdit01Icon
} from "hugeicons-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateInvoicePage() {
  const [template, setTemplate] = useState("standard");
  const [selectedContact, setSelectedContact] = useState<string>("");
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

  // Sample contacts - in production, this would come from your database/API
  const savedContacts = [
    { id: "1", name: "Frank Murlo", email: "frank.murlo@email.com", phone: "+233 24 123 4567", company: "Murlo Industries" },
    { id: "2", name: "Bill Norton", email: "bill.norton@email.com", phone: "+233 24 234 5678", company: "Norton & Co" },
    { id: "3", name: "Jane Smith", email: "jane.smith@email.com", phone: "+233 24 345 6789", company: "Smith Ventures" },
    { id: "4", name: "Acme Corp", email: "contact@acme.com", phone: "+233 24 456 7890", company: "Acme Corporation" },
  ];

  // Sample products/services - in production, this would come from your database/API
  const savedProductsServices = [
    { 
      id: "1", 
      name: "Website Design & Development", 
      description: "Complete website design and development service",
      details: "Includes responsive design, 5 pages, SEO optimization, and 3 months support",
      type: "service",
      unitPrice: 2500.00,
      defaultTax: 15,
      defaultDiscount: 0,
      discountType: "percent" as "percent" | "fixed"
    },
    { 
      id: "2", 
      name: "Logo Design Package", 
      description: "Professional logo design with 3 revisions",
      details: "Includes vector files, brand guidelines, and multiple format exports",
      type: "service",
      unitPrice: 500.00,
      defaultTax: 15,
      defaultDiscount: 0,
      discountType: "percent" as "percent" | "fixed"
    },
    { 
      id: "3", 
      name: "Monthly Retainer - Social Media Management", 
      description: "Monthly social media management and content creation",
      details: "15 posts per month, analytics reports, community management",
      type: "service",
      unitPrice: 800.00,
      defaultTax: 15,
      defaultDiscount: 10,
      discountType: "percent" as "percent" | "fixed"
    },
    { 
      id: "4", 
      name: "Consulting - Per Hour", 
      description: "Business consulting services",
      details: "Strategy, operations, and growth consulting",
      type: "service",
      unitPrice: 150.00,
      defaultTax: 15,
      defaultDiscount: 0,
      discountType: "percent" as "percent" | "fixed"
    },
    { 
      id: "5", 
      name: "Premium Software License", 
      description: "Annual premium software license",
      details: "Full access to all features, priority support, unlimited users",
      type: "product",
      unitPrice: 1200.00,
      defaultTax: 15,
      defaultDiscount: 100,
      discountType: "fixed" as "percent" | "fixed"
    },
  ];

  const handleContactSelect = (contactId: string) => {
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
      // Autofill with selected contact
      const contact = savedContacts.find(c => c.id === contactId);
      if (contact) {
        setCustomerData({
          name: contact.name,
          email: contact.email,
          company: contact.company,
          phone: contact.phone,
          address: "",
          notes: ""
        });
      }
    }
  };

  // Handle product/service selection for line item
  const handleProductServiceSelect = (lineItemId: number, productId: string) => {
    if (productId === "custom") {
      // Clear for manual entry
      setLineItems(lineItems.map(item =>
        item.id === lineItemId
          ? { ...item, description: "", details: "", unitPrice: 0, tax: 0, discount: 0, discountType: "percent" as "percent" | "fixed" }
          : item
      ));
    } else {
      // Autofill with selected product/service - populate ALL available fields
      const product = savedProductsServices.find(p => p.id === productId);
      if (product) {
        setLineItems(lineItems.map(item =>
          item.id === lineItemId
            ? { 
                ...item, 
                description: product.name,
                details: product.details || product.description,
                unitPrice: product.unitPrice,
                tax: product.defaultTax,
                discount: product.defaultDiscount,
                discountType: product.discountType
              }
            : item
        ));
      }
    }
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
    }
  };

  const updateLineItem = (id: number, field: string, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
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
    <div className="space-y-6">
      {/* Page Header - Adapted for workspace layout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            asChild 
            className="rounded-full px-5 h-9 hover:bg-[rgba(240,242,245,0.5)]"
          >
            <Link href="/invoices">
              <ArrowLeft01Icon size={16} className="mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-[#2D2D2D]">New Invoice</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full px-5 h-10 border-none hover:bg-[rgba(240,242,245,0.5)]"
          >
            <FileValidationIcon size={16} className="mr-2" />
            Save Draft
          </Button>
          <Button 
            className="rounded-full px-5 h-10"
            style={{ backgroundColor: '#1877F2', color: 'white', fontWeight: 500 }}
          >
            <SentIcon size={16} className="mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">
            <Invoice03Icon size={16} />
            Invoice Details
          </TabsTrigger>
          <TabsTrigger value="parties">
            <UserIcon size={16} />
            Parties
          </TabsTrigger>
          <TabsTrigger value="items">
            <FileValidationIcon size={16} />
            Line Items
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCardIcon size={16} />
            Payment & Currency
          </TabsTrigger>
          <TabsTrigger value="additional">
            <InformationCircleIcon size={16} />
            Additional Info
          </TabsTrigger>
        </TabsList>

          {/* Tab 1: Details - Enhanced */}
          <TabsContent value="details" className="space-y-10 mt-8">
            {/* Template Selection */}
            <div className="p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #1877F2' }}>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Invoice Template</h2>
                  <p className="text-sm text-[#B0B3B8]">Choose a professional template that matches your brand</p>
                </div>
                <div className="w-80">
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="border-[#E4E6EB] h-11">
                      <SelectValue>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-medium text-sm">
                            {template === "standard" && "Standard"}
                            {template === "minimal" && "Minimal"}
                            {template === "professional" && "Professional"}
                            {template === "modern" && "Modern"}
                          </span>
                          <span className="text-xs text-[#B0B3B8]">
                            {template === "standard" && "Classic business format"}
                            {template === "minimal" && "Clean and simple"}
                            {template === "professional" && "Corporate style"}
                            {template === "modern" && "Contemporary design"}
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

            <div className="h-px bg-[#E4E6EB]" />

            {/* Invoice Details */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Invoice Information</h2>
                <p className="text-sm text-[#B0B3B8]">Basic details about this invoice</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Invoice Number*</Label>
                  <Input 
                    placeholder="INV-001"
                    className="h-11 font-mono"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Unique identifier for this invoice</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Payment Terms*</Label>
                  <Select defaultValue="net_30">
                    <SelectTrigger className="border-[#E4E6EB] h-11">
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
                  <p className="text-xs text-[#B0B3B8] mt-1.5">When payment is due</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Issue Date*</Label>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-full"
                  >
                    <Calendar03Icon size={16} className="mr-2 text-[#B0B3B8]" />
                    Nov 16, 2025
                  </Button>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Date invoice was created</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Due Date*</Label>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-full"
                  >
                    <Calendar03Icon size={16} className="mr-2 text-[#B0B3B8]" />
                    Dec 16, 2025
                  </Button>
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Calculated based on payment terms</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            {/* Invoice Reference Information */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Additional Reference</h2>
                <p className="text-sm text-[#B0B3B8]">Add reference information for this invoice (optional)</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Reference Name</Label>
                  <Input 
                    placeholder="e.g., Website Redesign, Product Order #123"
                    className="border-[#E4E6EB] h-11"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Project name, order number, or service description</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Reference ID</Label>
                  <Input 
                    placeholder="e.g., PROJ-2025-042, ORD-12345"
                    className="border-[#E4E6EB] h-11"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Internal reference or tracking number</p>
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Invoice Category</Label>
                  <Select>
                    <SelectTrigger className="border-[#E4E6EB] h-11">
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
                    className="border-[#E4E6EB] h-11"
                  />
                  <p className="text-xs text-[#B0B3B8] mt-1.5">Required by some clients for payment processing</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Parties - Enhanced */}
          <TabsContent value="parties" className="space-y-10 mt-8">
            <div className="grid grid-cols-2 gap-12">
              {/* From */}
              <div>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">From (Your Business)</h2>
                    <p className="text-sm text-[#B0B3B8]">Your business details from account settings</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="rounded-full px-4 h-9 hover:bg-[rgba(24,119,242,0.08)]"
                    style={{ color: '#1877F2' }}
                  >
                    <Link href="/workspace/settings">
                      <PencilEdit01Icon size={14} className="mr-1.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
                
                {/* Read-only business info display */}
                <div className="space-y-4 p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #1877F2' }}>
                  <div>
                    <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Business Name</p>
                    <p className="text-sm text-[#2D2D2D] font-medium">Your Business Name</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Email</p>
                    <p className="text-sm text-[#2D2D2D]">your@business.com</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Phone</p>
                    <p className="text-sm text-[#2D2D2D]">+233 XX XXX XXXX</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Address</p>
                    <p className="text-sm text-[#2D2D2D] leading-relaxed">
                      123 Business Street<br />
                      Accra, Greater Accra<br />
                      Ghana
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Tax/VAT Number</p>
                      <p className="text-sm text-[#2D2D2D]">GH123456789</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#B0B3B8] font-medium uppercase tracking-wide mb-1.5">Website</p>
                      <p className="text-sm text-[#2D2D2D]">www.yourbusiness.com</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-[#B0B3B8] mt-3">
                  This information will appear on all your invoices. Update it in Settings.
                </p>
              </div>

              {/* Bill To */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Bill To (Customer)</h2>
                  <p className="text-sm text-[#B0B3B8]">Select from saved contacts or enter new customer details</p>
                </div>
                <div className="space-y-4 p-6" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #059669' }}>
                  {/* Contact Selector */}
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Select Contact</Label>
                    <Select value={selectedContact} onValueChange={handleContactSelect}>
                      <SelectTrigger className="border-[#E4E6EB] h-11">
                        <SelectValue placeholder="Choose from saved contacts or enter manually" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">
                          <div className="flex items-center gap-2">
                            <Add01Icon size={16} />
                            <span>Enter manually</span>
                          </div>
                        </SelectItem>
                        {savedContacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex flex-col items-start gap-0.5 py-1">
                              <span className="font-medium text-sm">{contact.name}</span>
                              <span className="text-xs text-[#B0B3B8]">{contact.company} • {contact.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#B0B3B8] mt-1.5">
                      {selectedContact && selectedContact !== "manual" 
                        ? "Contact details loaded from your saved contacts"
                        : "Select a contact to autofill or enter details manually"}
                    </p>
                  </div>

                  <div className="h-px bg-[#E4E6EB]" />

                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Customer Name*</Label>
                    <Input 
                      placeholder="Client Full Name or Contact Person"
                      className="h-11"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Email Address*</Label>
                    <Input 
                      placeholder="client@company.com"
                      type="email"
                      className="h-11"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    />
                    <p className="text-xs text-[#B0B3B8] mt-1.5">Invoice will be sent to this email</p>
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Company/Organization</Label>
                    <Input 
                      placeholder="Client Company Name"
                      className="h-11"
                      value={customerData.company}
                      onChange={(e) => setCustomerData({...customerData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Phone Number</Label>
                    <Input 
                      placeholder="+233 XX XXX XXXX"
                      className="h-11"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Billing Address</Label>
                    <Textarea 
                      placeholder="Street Address&#10;City, Region&#10;Country"
                      className="resize-none"
                      rows={4}
                      value={customerData.address}
                      onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Customer Notes</Label>
                    <Input 
                      placeholder="e.g., Billing Department, Account #12345"
                      className="h-11"
                      value={customerData.notes}
                      onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Line Items - Enhanced */}
          <TabsContent value="items" className="space-y-10 mt-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#2D2D2D]">Line Items</h2>
                  <p className="text-sm text-[#B0B3B8] mt-1">Add products or services with detailed pricing</p>
                </div>
                <Button 
                  className="rounded-full px-5 h-9"
                  style={{ backgroundColor: '#1877F2', color: 'white', fontWeight: 500 }}
                  onClick={addLineItem}
                >
                  <Add01Icon size={16} className="mr-2" />
                  Add Line Item
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
                  <div className="col-span-2">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide">Discount</Label>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-[#B0B3B8] font-semibold uppercase tracking-wide text-right block">Amount</Label>
                  </div>
                </div>

                {/* Line Item Rows */}
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-start py-4 border-b border-[#E4E6EB]">
                    <div className="col-span-4 space-y-2">
                      <Select onValueChange={(value) => handleProductServiceSelect(item.id, value)}>
                        <SelectTrigger className="border-[#E4E6EB] h-11 w-full">
                          <SelectValue placeholder="Select product/service or type manually" />
                        </SelectTrigger>
                        <SelectContent align="start" className="w-[400px]">
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2">
                              <Add01Icon size={14} />
                              <span>Enter manually</span>
                            </div>
                          </SelectItem>
                          <div className="h-px bg-[#E4E6EB] my-1" />
                          {savedProductsServices.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex flex-col items-start w-full">
                                <span className="font-medium text-[#2D2D2D]">{product.name}</span>
                                <div className="flex items-center gap-2 text-xs text-[#B0B3B8] mt-0.5">
                                  <span className="font-semibold">₵{product.unitPrice.toFixed(2)}</span>
                                  <span>•</span>
                                  <span className="capitalize">{product.type}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input 
                        placeholder="Service or product description"
                        className="border-[#E4E6EB] h-11"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      />
                      <Textarea 
                        placeholder="Additional details (optional)"
                        className="border-[#E4E6EB] resize-none text-xs"
                        rows={2}
                        value={item.details}
                        onChange={(e) => updateLineItem(item.id, "details", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number"
                        min="1"
                        className="border-[#E4E6EB] h-11"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="border-[#E4E6EB] h-11"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        className="border-[#E4E6EB] h-11"
                        value={item.tax === 0 ? '' : item.tax}
                        onChange={(e) => updateLineItem(item.id, "tax", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          className="border-[#E4E6EB] h-11 flex-1"
                          value={item.discount === 0 ? '' : item.discount}
                          onChange={(e) => updateLineItem(item.id, "discount", e.target.value === '' ? 0 : parseFloat(e.target.value))}
                        />
                        <Select 
                          value={item.discountType} 
                          onValueChange={(value) => updateLineItem(item.id, "discountType", value)}
                        >
                          <SelectTrigger className="border-[#E4E6EB] h-11 w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">%</SelectItem>
                            <SelectItem value="fixed">₵</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-between h-11">
                      <div className="text-right w-full">
                        <p className="text-sm font-semibold text-[#2D2D2D]">
                          ₵{calculateLineTotal(item).toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 -mr-2"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                      >
                        <Delete02Icon size={16} className={`${lineItems.length === 1 ? 'text-[#E4E6EB]' : 'text-[#B0B3B8] hover:text-red-600'}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            {/* Totals Summary */}
            <div>
              <div className="flex justify-end">
                <div className="w-[450px] space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#B0B3B8]">Subtotal</span>
                      <span className="text-sm font-medium text-[#2D2D2D]">₵{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#B0B3B8]">Total Tax</span>
                      <span className="text-sm font-medium text-[#2D2D2D]">₵{totals.totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#B0B3B8]">Total Discount</span>
                      <span className="text-sm font-medium text-green-600">-₵{totals.totalDiscount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-px bg-[#E4E6EB]" />
                  <div className="flex justify-between py-3 bg-[#FAFAFA] px-4 rounded-lg">
                    <span className="text-lg font-semibold text-[#2D2D2D]">Total Amount</span>
                    <span className="text-lg font-bold text-[#2D2D2D]">₵{totals.total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[#B0B3B8] text-right">Amount due by Dec 16, 2025</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Payment - Enhanced */}
          <TabsContent value="payment" className="space-y-10 mt-8">
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Accepted Payment Methods</h2>
                <p className="text-sm text-[#B0B3B8]">Select all payment methods you accept for this invoice</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethods.includes(method.id) 
                        ? 'border-[#1877F2] bg-[rgba(24,119,242,0.04)]' 
                        : 'border-[#E4E6EB] hover:border-[#B0B3B8]'
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

            <div className="h-px bg-[#E4E6EB]" />

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Currency Settings</h2>
                <p className="text-sm text-[#B0B3B8]">Configure primary and optional secondary currency</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Primary Currency*</Label>
                  <Select value={primaryCurrency} onValueChange={handlePrimaryCurrencyChange}>
                    <SelectTrigger className="border-[#E4E6EB] h-11">
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
                    <SelectTrigger className="border-[#E4E6EB] h-11">
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
                      className="border-[#E4E6EB] h-11 bg-[#F9F9F9]"
                      value={exchangeRate}
                      readOnly
                      disabled={!secondaryCurrency || secondaryCurrency === "none"}
                    />
                    {loadingRate && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1877F2] border-t-transparent"></div>
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
                  <Button 
                    variant="outline" 
                    className="w-full h-11 justify-start text-left border-[#E4E6EB] font-normal rounded-full"
                  >
                    <Calendar03Icon size={16} className="mr-2 text-[#B0B3B8]" />
                    Nov 16, 2025
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Payment Reminders</h2>
                <p className="text-sm text-[#B0B3B8]">Automatically send payment reminders to customer</p>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'before-7', label: 'Send reminder 7 days before due date', desc: 'Gentle reminder email' },
                  { id: 'due-date', label: 'Send reminder on due date', desc: 'Payment due notification' },
                  { id: 'after-3', label: 'Send reminder 3 days after due date', desc: 'Overdue payment notice' }
                ].map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentReminders.includes(reminder.id)
                        ? 'border-[#1877F2] bg-[rgba(24,119,242,0.04)]'
                        : 'border-[#E4E6EB] hover:border-[#B0B3B8]'
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
          <TabsContent value="additional" className="space-y-10 mt-8">
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Notes & Instructions</h2>
                <p className="text-sm text-[#B0B3B8]">Add custom notes or payment instructions for your client</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Invoice Notes</Label>
                  <Textarea 
                    placeholder="Add any additional notes, thank you message, or special instructions...&#10;&#10;Example: Thank you for your business! Please include invoice number in payment reference."
                    className="border-[#E4E6EB] resize-none"
                    rows={5}
                  />
                </div>
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-2 block">Payment Instructions</Label>
                  <Textarea 
                    placeholder="Specific payment instructions for this invoice...&#10;&#10;Example: Bank Name: ABC Bank&#10;Account Number: 1234567890&#10;Account Name: Your Business Name"
                    className="border-[#E4E6EB] resize-none"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Terms & Conditions</h2>
                <p className="text-sm text-[#B0B3B8]">Standard terms that will appear on the invoice</p>
              </div>
              <Textarea 
                placeholder="Enter your standard terms and conditions...&#10;&#10;Example:&#10;1. Payment is due within 30 days of invoice date&#10;2. Late payments may incur additional fees&#10;3. All prices are in Ghana Cedis (GHS)&#10;4. Goods remain property of seller until full payment"
                className="border-[#E4E6EB] resize-none"
                rows={8}
              />
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Payment Policies</h2>
                <p className="text-sm text-[#B0B3B8]">Configure early payment discounts and late payment fees</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm text-[#2D2D2D] font-medium mb-3 block">Early Payment Discount</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Discount Type</Label>
                      <Select>
                        <SelectTrigger className="border-[#E4E6EB] h-11">
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
                        placeholder="e.g., 5 for 5%"
                        className="border-[#E4E6EB] h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Days Before Due</Label>
                      <Input 
                        type="number"
                        placeholder="e.g., 7 days"
                        className="border-[#E4E6EB] h-11"
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
                        <SelectTrigger className="border-[#E4E6EB] h-11">
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
                        placeholder="e.g., 10 for 10%"
                        className="border-[#E4E6EB] h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#B0B3B8] mb-2 block">Days After Due</Label>
                      <Input 
                        type="number"
                        placeholder="e.g., 7 days"
                        className="border-[#E4E6EB] h-11"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#B0B3B8] mt-2">Example: 10% late fee applied 7 days after due date</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E4E6EB]" />

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Attachments</h2>
                <p className="text-sm text-[#B0B3B8]">Attach supporting documents to this invoice</p>
              </div>
              <div className="border-2 border-solid border-[#E4E6EB] rounded-lg p-8 text-center hover:border-[#1877F2] transition-colors cursor-pointer">
                <Add01Icon size={32} className="text-[#B0B3B8] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#2D2D2D] mb-1">Click to upload files</p>
                <p className="text-xs text-[#B0B3B8]">PDF, PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}
