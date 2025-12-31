"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Mail, Phone, Building2, MapPin, AlertCircle } from "lucide-react";
import { TickCircle, CloseCircle, Clock, Coin1, Trash } from "iconsax-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactStats {
  total_invoices: number;
  total_revenue: number;
  outstanding_balance: number;
  paid_invoices: number;
}

interface RecentInvoice {
  id: string;
  invoice_number: string;
  total: number;
  status: string;
  due_date: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  notes?: string;
  tags?: string[];
  created_at?: string;
}

interface ContactDetailModalProps {
  contactId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode?: "view" | "edit" | "create";
  initialData?: Partial<Contact>;
}

const availableTags = ["VIP", "New", "International", "Tech", "Regular", "Corporate"];

export function ContactDetailModal({ 
  contactId, 
  isOpen, 
  onClose, 
  onSave, 
  mode = "view",
  initialData
}: ContactDetailModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  
  const [formData, setFormData] = useState<Contact>({
    id: "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    address: initialData?.address || "",
    notes: initialData?.notes || "",
    tags: initialData?.tags || [],
  });

  const fetchContact = useCallback(async () => {
    if (!contactId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/contacts/${contactId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch contact");
      }
      
      setContact(data.customer);
      setStats(data.stats);
      setRecentInvoices(data.recent_invoices || []);
      setFormData({
        id: data.customer.id,
        name: data.customer.name || "",
        email: data.customer.email || "",
        phone: data.customer.phone || "",
        company: data.customer.company || "",
        address: data.customer.address || "",
        notes: data.customer.notes || "",
        tags: data.customer.tags || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact");
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    if (isOpen && contactId && mode !== "create") {
      fetchContact();
    }
  }, [isOpen, contactId, mode, fetchContact]);

  useEffect(() => {
    setEditMode(mode === "edit" || mode === "create");
  }, [mode]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    const formatted = (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return "₵" + formatted;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const url = mode === "create" ? "/api/contacts" : `/api/contacts/${contactId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          notes: formData.notes,
          tags: formData.tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save contact");
      }

      setEditMode(false);
      onSave?.();
      
      if (mode === "create") {
        onClose();
      } else {
        fetchContact();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contactId) return;
    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete contact");
      }

      onSave?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (mode === "create") {
      onClose();
    } else if (contact) {
      setFormData({
        id: contact.id,
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        address: contact.address || "",
        notes: contact.notes || "",
        tags: contact.tags || [],
      });
      setEditMode(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter((t) => t !== tag) 
        : [...(prev.tags || []), tag],
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
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(20, 70, 42, 0.1)', color: '#14462a', borderColor: 'transparent' }}>
            <TickCircle size={14} color="#14462a" variant="Bold" /> Paid
          </Badge>
        );
      case "partially_paid":
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: '#14462a', borderColor: 'transparent' }}>
            <Coin1 size={14} color="#14462a" variant="Bold" /> Partial
          </Badge>
        );
      case "sent":
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', borderColor: 'transparent' }}>
            <Clock size={14} color="#2563EB" variant="Bold" /> Sent
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', borderColor: 'transparent' }}>
            <CloseCircle size={14} color="#DC2626" variant="Bold" /> Overdue
          </Badge>
        );
      case "draft":
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(101, 103, 107, 0.1)', color: '#65676B', borderColor: 'transparent' }}>
            Draft
          </Badge>
        );
      default:
        return (
          <Badge className="gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(101, 103, 107, 0.1)', color: '#65676B', borderColor: 'transparent' }}>
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[70vw] w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2D2D2D]">
            {mode === "create" ? "New Contact" : editMode ? "Edit Contact" : "Contact Details"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 pb-6 border-b border-[#EBECE7]">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
        ) : error && mode !== "create" ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Contact Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#EBECE7]">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarFallback className="bg-[#F9F9F9] text-[#2D2D2D] text-lg font-medium border-2 border-[#EBECE7]">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#2D2D2D]">{formData.name || "Unnamed Contact"}</h3>
                <p className="text-sm text-[#949494]">{formData.company || "No company"}</p>
              </div>
              {!editMode && mode !== "create" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => router.push(`/invoices/new?customerId=${contactId}`)}
                    className="bg-[#14462a] text-white hover:bg-[#14462a]/90"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button
                    onClick={() => { if (formData.email) window.location.href = `mailto:${formData.email}`; }}
                    variant="outline"
                    disabled={!formData.email}
                    className="border-[#EBECE7] hover:bg-[#F9F9F9]"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    onClick={() => { if (formData.phone) window.location.href = `tel:${formData.phone}`; }}
                    variant="outline"
                    disabled={!formData.phone}
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

            {/* Stats Cards - Only show in view/edit mode */}
            {mode !== "create" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
                  <p className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-1">Total Invoices</p>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{stats.total_invoices}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
                  <p className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{formatCurrency(stats.total_revenue)}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
                  <p className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-1">Outstanding</p>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{formatCurrency(stats.outstanding_balance)}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
                  <p className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-1">Paid Invoices</p>
                  <p className="text-2xl font-bold text-[#2D2D2D]">{stats.paid_invoices}</p>
                </div>
              </div>
            )}

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
                  <Label htmlFor="address" className="text-xs font-medium text-[#949494] uppercase tracking-wide">
                    Address
                  </Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#949494]" />
                    <Textarea
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!editMode}
                      className="pl-10 min-h-[80px]"
                      placeholder="Street address, city, postal code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-[#EBECE7]" />

            {/* Tags */}
            <div>
              <Label className="text-xs font-medium text-[#949494] uppercase tracking-wide mb-3 block">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {editMode ? (
                  availableTags.map((tag) => {
                    const isSelected = formData.tags?.includes(tag);
                    const baseClass = "px-3 py-1.5 rounded-md text-xs font-medium border transition-all";
                    const selectedClass = isSelected ? getTagClassName(tag) : "border-[#EBECE7] text-[#949494] hover:border-[#14462a] hover:text-[#14462a]";
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`${baseClass} ${selectedClass}`}
                      >
                        {tag}
                      </button>
                    );
                  })
                ) : formData.tags && formData.tags.length > 0 ? (
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
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!editMode}
                className="mt-1.5 min-h-[100px]"
                placeholder="Add any notes about this contact..."
              />
            </div>

            {/* Recent Invoices - Only show in view/edit mode */}
            {mode !== "create" && recentInvoices.length > 0 && (
              <>
                <Separator className="bg-[#EBECE7]" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Recent Invoices
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/invoices?customerId=${contactId}`)}
                      className="text-[#14462a] hover:text-[#14462a]/80"
                    >
                      View All
                    </Button>
                  </div>
                  
                  <Table className="[&_th]:py-4 [&_td]:py-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Invoice</TableHead>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead className="w-[110px]">Due Date</TableHead>
                        <TableHead className="w-[120px]">Amount</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentInvoices.map((invoice) => (
                        <TableRow 
                          key={invoice.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => router.push(`/invoices/${invoice.id}`)}
                        >
                          <TableCell className="font-medium text-[#2D2D2D]">{invoice.invoice_number}</TableCell>
                          <TableCell className="text-[#949494] font-normal">{formatDate(invoice.created_at)}</TableCell>
                          <TableCell className="text-[#949494] font-normal">{formatDate(invoice.due_date)}</TableCell>
                          <TableCell className="font-medium text-[#2D2D2D]">{formatCurrency(invoice.total)}</TableCell>
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

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EBECE7]">
              <div>
                {!editMode && mode !== "create" && (
                  <Button 
                    variant="ghost" 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash size={16} className="mr-2" />
                    {deleting ? "Deleting..." : "Delete Contact"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={saving} className="border-[#EBECE7]">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving || !formData.name}
                      className="bg-[#14462a] text-white hover:bg-[#14462a]/90"
                    >
                      {saving ? "Saving..." : mode === "create" ? "Create Contact" : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={onClose} className="border-[#EBECE7]">
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
