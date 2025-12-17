"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, FileText, Mail, Phone, Building2, MapPin, Hash, Calendar, DollarSign, Clock, Zap, TrendingUp, Check, RotateCcw } from "lucide-react";
import { useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalInvoices: number;
  totalPaid: string;
  status: string;
  avatar: string;
  tags: string[];
  category: string;
  paymentTerms: string;
  paymentBehavior: string;
  notes: string;
  // Extended fields for detail view
  billingAddress?: string;
  taxId?: string;
};

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
  dueDate: string;
  purpose?: string;
  balanceDue?: string;
};

// Removed Transfer type - invoice-first approach only

interface ContactDetailModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (contact: Contact) => void;
  mode?: "view" | "edit" | "create";
}

// Mock invoice history data
const mockInvoiceHistory: Invoice[] = [
  { id: "INV-1024", date: "2024-11-10", amount: "$2,450.00", status: "Paid", dueDate: "2024-11-25", purpose: "Web design services", balanceDue: "$0.00" },
  { id: "INV-1018", date: "2024-10-15", amount: "$1,850.00", status: "Partially Paid", dueDate: "2024-10-30", purpose: "Monthly retainer", balanceDue: "$850.00" },
  { id: "INV-1009", date: "2024-09-20", amount: "$3,200.00", status: "Paid", dueDate: "2024-10-05", purpose: "Consulting services", balanceDue: "$0.00" },
  { id: "INV-0998", date: "2024-08-18", amount: "$2,100.00", status: "Paid", dueDate: "2024-09-02", purpose: "Development work", balanceDue: "$0.00" },
];

const availableTags = ["VIP", "New", "International", "Tech", "Regular", "Corporate"];
const categories = ["Corporate", "Freelance", "International"];
const paymentTermsOptions = ["Due on receipt", "Net 15", "Net 30", "Net 45", "Net 60"];
const paymentBehaviorOptions = ["Fast", "On-time", "Slow"];

export function ContactDetailModal({ contact, isOpen, onClose, onSave, mode = "view" }: ContactDetailModalProps) {
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");
  const [formData, setFormData] = useState<Contact>(
    contact || {
      id: 0,
      name: "",
      email: "",
      phone: "",
      company: "",
      totalInvoices: 0,
      totalPaid: "$0.00",
      status: "Active",
      avatar: "",
      tags: [],
      category: "Corporate",
      paymentTerms: "Net 30",
      paymentBehavior: "On-time",
      notes: "",
      billingAddress: "",
      taxId: "",
    }
  );

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setEditMode(false);
    onClose();
  };

  const handleCancel = () => {
    if (mode === "create") {
      onClose();
    } else {
      setFormData(contact!);
      setEditMode(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const getTagClassName = (tag: string) => {
    if (tag === "VIP") return "bg-[#14462a] text-white border-[#14462a]";
    if (tag === "New") return "bg-blue-50 text-blue-700 border-blue-200";
    if (tag === "International") return "bg-purple-50 text-purple-700 border-purple-200";
    if (tag === "Tech") return "bg-green-50 text-green-700 border-green-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

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
      case "Pending":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-[#EBECE7]">
            <Clock className="h-3.5 w-3.5" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[70vw] w-full max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-[#2D2D2D]">
              {mode === "create" ? "New Contact" : editMode ? "Edit Contact" : "Contact Details"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 hover:bg-[#F9F9F9] transition-colors"
            >
              <X className="h-5 w-5 text-[#949494]" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Contact Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#EBECE7]">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="bg-[#F9F9F9] text-[#2D2D2D] text-lg font-medium border-2 border-[#EBECE7]">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#2D2D2D]">{formData.name || "Unnamed Contact"}</h3>
              <p className="text-sm text-[#949494]">{formData.company}</p>
              {!editMode && (
                <div className="flex items-center gap-2 mt-2">
                  {formData.status === "Active" ? (
                    <Badge className="bg-[#14462a] text-white border-[#14462a] font-medium">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-[#949494] border-[#EBECE7] font-medium">
                      Inactive
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-[#EBECE7] text-[#2D2D2D]">
                    {formData.category}
                  </Badge>
                </div>
              )}
            </div>
            {!editMode && mode !== "create" && (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Primary Action - Create Invoice */}
                <Button
                  onClick={() => {
                    // Create Invoice for this customer
                    console.log("Create invoice for:", formData.name);
                    // In real app: router.push(`/invoices/new?customerId=${formData.id}`);
                  }}
                  className="bg-[#14462a] text-white hover:bg-[#14462a]/90"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                
                {/* Secondary Actions */}
                <Button
                  onClick={() => {
                    window.location.href = `mailto:${formData.email}`;
                  }}
                  variant="outline"
                  className="border-[#EBECE7] hover:bg-[#F9F9F9]"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = `tel:${formData.phone}`;
                  }}
                  variant="outline"
                  className="border-[#EBECE7] hover:bg-[#F9F9F9]"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  className="border-[#EBECE7] hover:bg-[#F9F9F9]"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editMode}
                  className="mt-1.5"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  disabled={!editMode}
                  className="mt-1.5"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Email
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949494]" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editMode}
                    className="pl-10"
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Phone
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949494]" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editMode}
                    className="pl-10"
                    placeholder="+233 24 123 4567"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="billingAddress" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Billing Address
                </Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#949494]" />
                  <Textarea
                    id="billingAddress"
                    value={formData.billingAddress || ""}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    disabled={!editMode}
                    className="pl-10 min-h-[80px]"
                    placeholder="Street address, city, postal code"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taxId" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Tax ID / Business Number
                </Label>
                <div className="relative mt-1.5">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949494]" />
                  <Input
                    id="taxId"
                    value={formData.taxId || ""}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    disabled={!editMode}
                    className="pl-10"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#EBECE7]" />

          {/* Payment & Relationship Settings */}
          <div>
            <h4 className="text-sm font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment & Relationship
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={!editMode}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentTerms" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Default Payment Terms
                </Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                  disabled={!editMode}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentBehavior" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                  Payment Behavior
                </Label>
                <Select
                  value={formData.paymentBehavior}
                  onValueChange={(value) => setFormData({ ...formData, paymentBehavior: value })}
                  disabled={!editMode}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentBehaviorOptions.map((behavior) => (
                      <SelectItem key={behavior} value={behavior}>
                        <div className="flex items-center gap-2">
                          {behavior === "Fast" && <Zap className="h-3.5 w-3.5 text-green-600" />}
                          {behavior === "On-time" && <Clock className="h-3.5 w-3.5 text-[#14462a]" />}
                          {behavior === "Slow" && <TrendingUp className="h-3.5 w-3.5 text-orange-600 rotate-180" />}
                          {behavior}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-3 block">
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {editMode ? (
                availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        isSelected
                          ? getTagClassName(tag)
                          : "border-[#EBECE7] text-[#949494] hover:border-[#14462a] hover:text-[#14462a]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })
              ) : formData.tags.length > 0 ? (
                formData.tags.map((tag, idx) => (
                  <Badge key={idx} className={getTagClassName(tag)}>
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-[#949494]">No tags</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
              Internal Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={!editMode}
              className="mt-1.5 min-h-[100px]"
              placeholder="Add any notes about this contact (payment preferences, communication style, project history, etc.)"
            />
          </div>

          {/* Invoice History - Only show in view/edit mode, not create */}
          {mode !== "create" && (
            <>
              <Separator className="bg-[#EBECE7]" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Invoice History
                  </h4>
                  <div className="text-sm text-[#949494]">
                    {formData.totalInvoices} invoices · {formData.totalPaid} total paid
                  </div>
                </div>
                
                <Table className="[&_th]:py-4 [&_td]:py-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Invoice</TableHead>
                      <TableHead className="w-[110px]">Date</TableHead>
                      <TableHead className="w-[110px]">Due Date</TableHead>
                      <TableHead className="min-w-[180px]">Purpose</TableHead>
                      <TableHead className="w-[120px]">Amount</TableHead>
                      <TableHead className="w-[110px]">Balance Due</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoiceHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium text-[#2D2D2D]">{invoice.id}</TableCell>
                        <TableCell className="text-[#949494] font-normal">{invoice.date}</TableCell>
                        <TableCell className="text-[#949494] font-normal">{invoice.dueDate}</TableCell>
                        <TableCell className="text-[#2D2D2D]">{invoice.purpose || "—"}</TableCell>
                        <TableCell className="font-medium text-[#2D2D2D]">{invoice.amount}</TableCell>
                        <TableCell className="font-medium text-[#2D2D2D]">{invoice.balanceDue || "$0.00"}</TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBECE7]">
            {editMode ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="border-[#EBECE7]">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#14462a] text-white hover:bg-[#14462a]/90"
                >
                  {mode === "create" ? "Create Contact" : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={onClose} className="border-[#EBECE7]">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
