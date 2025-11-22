"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MoreHorizontalIcon,
  MailAtSign01Icon,
  Call02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FileValidationIcon,
  PencilEdit01Icon,
  Tag01Icon,
  ZapIcon,
  Clock01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Building03Icon,
  CheckmarkSquare02Icon,
  Download01Icon,
  Search01Icon
} from "hugeicons-react";
import Link from "next/link";
import { useState } from "react";
import { ContactDetailModal } from "@/components/contacts/contact-detail-modal";

const contactsData = [
  { 
    id: 1, 
    name: "Frank Murlo", 
    email: "frank.murlo@email.com", 
    phone: "+233 24 123 4567", 
    company: "Murlo Industries", 
    totalInvoices: 12, 
    totalPaid: "$8,475.69", 
    status: "Active", 
    avatar: "",
    tags: ["VIP", "Corporate"],
    category: "Corporate",
    paymentTerms: "Net 30",
    paymentBehavior: "Fast",
    notes: "Prefers mobile money payments. Always pays within 2 weeks."
  },
  { 
    id: 2, 
    name: "Bill Norton", 
    email: "bill.norton@email.com", 
    phone: "+233 24 234 5678", 
    company: "Norton & Co", 
    totalInvoices: 8, 
    totalPaid: "$5,477.14", 
    status: "Active", 
    avatar: "",
    tags: ["Regular"],
    category: "Freelance",
    paymentTerms: "Net 15",
    paymentBehavior: "On-time",
    notes: "Monthly retainer client. Invoices first week of month."
  },
  { 
    id: 3, 
    name: "Jane Smith", 
    email: "jane.smith@email.com", 
    phone: "+233 24 345 6789", 
    company: "Smith Ventures", 
    totalInvoices: 15, 
    totalPaid: "$12,250.00", 
    status: "Active", 
    avatar: "",
    tags: ["VIP"],
    category: "Corporate",
    paymentTerms: "Net 30",
    paymentBehavior: "Fast",
    notes: "Long-term client since 2023. Excellent payment history."
  },
  { 
    id: 4, 
    name: "Acme Corp", 
    email: "contact@acme.com", 
    phone: "+233 24 456 7890", 
    company: "Acme Corporation", 
    totalInvoices: 24, 
    totalPaid: "$32,200.00", 
    status: "Active", 
    avatar: "",
    tags: ["VIP", "International"],
    category: "Corporate",
    paymentTerms: "Net 45",
    paymentBehavior: "On-time",
    notes: "Large corporate client. Finance team requires detailed invoices."
  },
  { 
    id: 5, 
    name: "Sarah Johnson", 
    email: "sarah.j@email.com", 
    phone: "+233 24 567 8901", 
    company: "Johnson LLC", 
    totalInvoices: 6, 
    totalPaid: "$4,925.00", 
    status: "Inactive", 
    avatar: "",
    tags: [],
    category: "Freelance",
    paymentTerms: "Due on receipt",
    paymentBehavior: "Slow",
    notes: "Last project completed 3 months ago. Follow up for new opportunities."
  },
  { 
    id: 6, 
    name: "Michael Chen", 
    email: "m.chen@email.com", 
    phone: "+233 24 678 9012", 
    company: "Chen Solutions", 
    totalInvoices: 18, 
    totalPaid: "$16,680.75", 
    status: "Active", 
    avatar: "",
    tags: ["Tech"],
    category: "Corporate",
    paymentTerms: "Net 30",
    paymentBehavior: "Fast",
    notes: "Tech startup. Prefers crypto payments. Very responsive."
  },
  { 
    id: 7, 
    name: "Emma Williams", 
    email: "emma.w@email.com", 
    phone: "+233 24 789 0123", 
    company: "Williams Group", 
    totalInvoices: 22, 
    totalPaid: "$23,250.50", 
    status: "Active", 
    avatar: "",
    tags: ["VIP", "Regular"],
    category: "Corporate",
    paymentTerms: "Net 30",
    paymentBehavior: "On-time",
    notes: "Consistent monthly projects. Send invoice by 25th of each month."
  },
  { 
    id: 8, 
    name: "Robert Martinez", 
    email: "robert.m@email.com", 
    phone: "+233 24 890 1234", 
    company: "Martinez Inc", 
    totalInvoices: 4, 
    totalPaid: "$1,890.00", 
    status: "Inactive", 
    avatar: "",
    tags: ["New"],
    category: "Freelance",
    paymentTerms: "Net 15",
    paymentBehavior: "Slow",
    notes: "New client. Monitor payment patterns closely."
  },
  { 
    id: 9, 
    name: "Digital Ventures", 
    email: "hello@digital.com", 
    phone: "+233 24 901 2345", 
    company: "Digital Ventures LLC", 
    totalInvoices: 30, 
    totalPaid: "$46,800.00", 
    status: "Active", 
    avatar: "",
    tags: ["VIP", "International", "Tech"],
    category: "International",
    paymentTerms: "Net 30",
    paymentBehavior: "Fast",
    notes: "Largest client. Weekly projects. Pays via bank transfer."
  },
  { 
    id: 10, 
    name: "Lisa Anderson", 
    email: "lisa.a@email.com", 
    phone: "+233 24 012 3456", 
    company: "Anderson Co", 
    totalInvoices: 10, 
    totalPaid: "$7,500.25", 
    status: "Active", 
    avatar: "",
    tags: ["Regular"],
    category: "Freelance",
    paymentTerms: "Net 15",
    paymentBehavior: "On-time",
    notes: "Quarterly projects. Prefers detailed project breakdowns."
  },
];

export default function ContactsPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<typeof contactsData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(contactsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = contactsData.slice(startIndex, endIndex);

  // Handle select all
  const allSelected = currentContacts.length > 0 && selectedRows.length === currentContacts.length && currentContacts.every(contact => selectedRows.includes(contact.id));
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentContacts.map(contact => contact.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const openContactModal = (contact: typeof contactsData[0] | null, mode: "view" | "edit" | "create") => {
    setSelectedContact(contact);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleSaveContact = (contact: typeof contactsData[0]) => {
    // In a real app, this would save to backend
    console.log("Saving contact:", contact);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 600 }}>Contacts</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage your clients and customers</p>
        </div>
        <Button 
          onClick={() => openContactModal(null, "create")}
          className="rounded-full px-6 py-2.5 h-auto shadow-sm transition-all hover:shadow-md"
          style={{ backgroundColor: '#1877F2', color: 'white', fontWeight: 500 }}
        >
          + New Contact
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contacts */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(24, 119, 242, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(24, 119, 242, 0.12)' }}>
              <svg className="h-6 w-6" style={{ color: '#1877F2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(24, 119, 242, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#1877F2' }}>+15.3%</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Contacts</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {contactsData.length}
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>All registered contacts</p>
        </div>

        {/* Active Contacts */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(5, 150, 105, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}>
              <svg className="h-6 w-6" style={{ color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#059669' }}>
                {Math.round((contactsData.filter(c => c.status === "Active").length / contactsData.length) * 100)}%
              </span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Active Contacts</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {contactsData.filter(c => c.status === "Active").length}
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>
            {Math.round((contactsData.filter(c => c.status === "Active").length / contactsData.length) * 100)}% of total contacts
          </p>
        </div>

        {/* Total Invoices */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(124, 58, 237, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)' }}>
              <svg className="h-6 w-6" style={{ color: '#7C3AED' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#7C3AED' }}>+8.7%</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Invoices</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            {contactsData.reduce((sum, c) => sum + c.totalInvoices, 0)}
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>
            Avg {Math.round(contactsData.reduce((sum, c) => sum + c.totalInvoices, 0) / contactsData.length)} per contact
          </p>
        </div>

        {/* Total Revenue */}
        <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(5, 150, 105, 0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}>
              <svg className="h-6 w-6" style={{ color: '#059669' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#059669' }}>+22.4%</span>
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Revenue</p>
          <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
            $159,449<span style={{ color: '#B0B3B8', fontWeight: 400 }}>.33</span>
          </p>
          <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>From all contacts</p>
        </div>
      </div>

      {/* Search and Filter Card */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Contacts</h3>
            <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" style={{ color: '#1877F2' }}>
            Clear all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Search
            </label>
            <div className="relative group">
              <Search01Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#B0B3B8' }} />
              <Input
                id="search"
                type="text"
                placeholder="Search name, email or company..."
                className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md focus:scale-[1.01]"
                style={{ backgroundColor: '#FAFBFC' }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Category
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="category" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="corporate">
                  <div className="flex items-center gap-2">
                    <Building03Icon size={14} style={{ color: '#1877F2' }} />
                    Corporate
                  </div>
                </SelectItem>
                <SelectItem value="freelance">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" style={{ color: '#1877F2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Freelance
                  </div>
                </SelectItem>
                <SelectItem value="international">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5" style={{ color: '#1877F2' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    International
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
              Status
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="status" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: '#FAFBFC' }}>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                <SelectItem value="all" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <span className="font-medium" style={{ color: '#2D2D2D' }}>All statuses</span>
                </SelectItem>
                <SelectItem value="active" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#059669' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Active</span>
                  </div>
                </SelectItem>
                <SelectItem value="inactive" className="rounded-xl px-3 py-2.5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#B0B3B8' }}></div>
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>Inactive</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Contact Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'rgba(24, 119, 242, 0.04)', borderColor: 'rgba(24, 119, 242, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(24, 119, 242, 0.12)' }}>
                <CheckmarkSquare02Icon size={16} style={{ color: '#1877F2' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>
                  {selectedRows.length} {selectedRows.length === 1 ? 'contact' : 'contacts'} selected
                </p>
                <p className="text-xs" style={{ color: '#65676B' }}>
                  Choose an action to apply
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105" 
                style={{ backgroundColor: 'white' }}
              >
                <MailAtSign01Icon size={16} className="mr-2" /> Email Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105" 
                style={{ backgroundColor: 'white' }}
              >
                <Download01Icon size={16} className="mr-2" /> Export
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl transition-all hover:bg-white"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: '#E4E6EB' }}>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={allSelected}
                    {...(someSelected && { 'data-state': 'indeterminate' })}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.map((contact, idx) => (
                <TableRow 
                  key={contact.id} 
                  data-state={selectedRows.includes(contact.id) ? "selected" : undefined}
                  className="cursor-pointer" 
                  style={{ borderColor: '#E4E6EB' }}
                  onClick={() => openContactModal(contact, "view")}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedRows.includes(contact.id)}
                      onCheckedChange={() => toggleSelectRow(contact.id)}
                      aria-label={`Select ${contact.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback className="text-xs" style={{ backgroundColor: 'rgba(24, 119, 242, 0.08)', color: '#1877F2', fontWeight: 600 }}>
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-[#65676B]">{contact.company}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#65676B]">{contact.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ backgroundColor: 'rgba(24, 119, 242, 0.04)', borderColor: 'rgba(24, 119, 242, 0.2)', color: '#1877F2', fontWeight: 500 }}>
                      {contact.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{contact.totalPaid}</TableCell>
                  <TableCell>
                    <Badge 
                      style={{
                        backgroundColor: contact.status === 'Active' 
                          ? 'rgba(34, 197, 94, 0.1)' 
                          : 'rgba(107, 114, 128, 0.1)',
                        color: contact.status === 'Active' ? '#22C55E' : '#6B7280',
                        borderColor: contact.status === 'Active' ? '#BBF7D0' : '#E5E7EB',
                        fontWeight: 500,
                      }}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-full p-1.5 transition-all hover:bg-[rgba(24,119,242,0.04)]" style={{ color: '#B0B3B8' }}>
                          <MoreHorizontalIcon size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                        <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                          <Link href="/invoices/new" className="flex items-center">
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                              style={{ backgroundColor: 'rgba(24, 119, 242, 0.08)' }}
                            >
                              <FileValidationIcon size={16} style={{ color: '#1877F2' }} />
                            </div>
                            <span className="text-sm font-medium group-hover:text-[#1877F2] transition-all" style={{ color: '#2D2D2D' }}>Create Invoice</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          openContactModal(contact, "edit");
                        }} className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }}
                          >
                            <PencilEdit01Icon size={16} style={{ color: '#F59E0B' }} />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#1877F2] transition-all" style={{ color: '#2D2D2D' }}>Edit Contact</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(5, 150, 105, 0.08)' }}
                          >
                            <MailAtSign01Icon size={16} style={{ color: '#059669' }} />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#1877F2] transition-all" style={{ color: '#2D2D2D' }}>Send Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(24,119,242,0.04)]">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(124, 58, 237, 0.08)' }}
                          >
                            <Call02Icon size={16} style={{ color: '#7C3AED' }} />
                          </div>
                          <span className="text-sm font-medium group-hover:text-[#1877F2] transition-all" style={{ color: '#2D2D2D' }}>Call</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-red-50">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
                          >
                            <Delete02Icon size={16} style={{ color: '#DC2626' }} />
                          </div>
                          <span className="text-sm font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4" style={{ borderTop: '1px solid #E4E6EB' }}>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>
            Showing <span style={{ fontWeight: 500, color: '#2D2D2D' }}>{startIndex + 1}</span> to <span style={{ fontWeight: 500, color: '#2D2D2D' }}>{Math.min(endIndex, contactsData.length)}</span> of{" "}
            <span style={{ fontWeight: 500, color: '#2D2D2D' }}>{contactsData.length}</span> contacts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ArrowLeft01Icon size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="h-8 w-8 p-0 rounded-full"
                style={page === currentPage ? { backgroundColor: '#1877F2', color: 'white' } : {}}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ArrowRight01Icon size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveContact}
        mode={modalMode}
      />
    </div>
  );
}
