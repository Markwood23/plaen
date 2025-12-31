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
  More,
  Sms,
  Call,
  ArrowLeft2,
  ArrowRight2,
  Receipt21,
  Edit2,
  Tag,
  Trash,
  Building,
  TickCircle,
  DocumentDownload,
  SearchNormal1,
  Profile2User,
  RefreshCircle
} from "iconsax-react";
import { useState, useEffect } from "react";
import { ContactDetailModal } from "@/components/contacts/contact-detail-modal";
import { useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { useContactsData } from "@/hooks/useContactsData";
import { EmptyState } from "@/components/ui/empty-state";

// Loading skeletons
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="group relative rounded-2xl p-6 animate-pulse" style={{ backgroundColor: 'rgba(176, 179, 184, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="h-6 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  );
}

export default function ContactsPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { maskAmount } = useBalanceVisibility();

  const { contacts, loading, error, pagination, refetch, setFilters, filters } = useContactsData({
    page: 1,
    limit: 10,
  });

  // Update filters when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchQuery || undefined,
        page: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'GHS') => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency;
    return `${symbol}${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate stats from contacts
  const activeContacts = contacts.filter(c => c.status === 'Active');
  const totalInvoices = contacts.reduce((sum, c) => sum + (c.totalInvoices || 0), 0);
  const totalRevenue = contacts.reduce((sum, c) => sum + (c.totalPaid || 0), 0);

  // Handle select all
  const allSelected = contacts.length > 0 && selectedRows.length === contacts.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(contacts.map(contact => contact.id));
    }
  };

  const toggleSelectRow = (id: string) => {
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

  const openContactModal = (contactId: string | null, mode: "view" | "edit" | "create") => {
    setSelectedContactId(contactId);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleSaveContact = () => {
    setModalOpen(false);
    refetch();
  };

  // Check if user has no contacts at all (for empty state)
  const isNewUser = !loading && contacts.length === 0 && !searchQuery;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 600 }}>Contacts</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage your clients and customers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: 'white' }}
            onClick={() => refetch()}
          >
            <RefreshCircle size={16} color="#65676B" className="mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => openContactModal(null, "create")}
            className="rounded-full px-6 py-2.5 h-auto shadow-sm transition-all hover:shadow-md"
            style={{ backgroundColor: '#14462a', color: 'white', fontWeight: 500 }}
          >
            + New Contact
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            {/* Total Contacts */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <Profile2User size={24} color="#14462a" variant="Bulk" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <span className="text-xs font-semibold" style={{ color: '#14462a' }}>{pagination.total}</span>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Contacts</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {pagination.total}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>All registered contacts</p>
            </div>

            {/* Active Contacts */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <TickCircle size={24} color="#14462a" variant="Bulk" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <span className="text-xs font-semibold" style={{ color: '#14462a' }}>
                    {pagination.total > 0 ? Math.round((activeContacts.length / contacts.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Active Contacts</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {activeContacts.length}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>
                With recent activity
              </p>
            </div>

            {/* Total Invoices */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <Receipt21 size={24} color="#14462a" variant="Bulk" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <span className="text-xs font-semibold" style={{ color: '#14462a' }}>{totalInvoices}</span>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Invoices</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {totalInvoices}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>
                Avg {contacts.length > 0 ? Math.round(totalInvoices / contacts.length) : 0} per contact
              </p>
            </div>

            {/* Total Revenue */}
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <svg className="h-6 w-6" style={{ color: '#14462a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Revenue</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>
                {maskAmount(formatCurrency(totalRevenue))}
              </p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>From all contacts</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filter Card - Only show if user has contacts */}
      {!isNewUser && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Contacts</h3>
              <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Refine your search results</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" 
              style={{ color: '#14462a' }}
            >
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
                <SearchNormal1 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#B0B3B8' }} />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search name, email or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md"
                  style={{ backgroundColor: 'white', color: '#2D2D2D' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-xs mb-2 font-medium" style={{ color: '#65676B' }}>
                Category
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="category" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="corporate">
                    <div className="flex items-center gap-2">
                      <Building size={14} color="#14462a" />
                      Corporate
                    </div>
                  </SelectItem>
                  <SelectItem value="freelance">
                    <div className="flex items-center gap-2">
                      <Profile2User size={14} color="#14462a" />
                      Freelance
                    </div>
                  </SelectItem>
                  <SelectItem value="international">
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5" style={{ color: '#14462a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="h-11 w-full rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-2">
                  <SelectItem value="all" className="rounded-xl px-3 py-2.5 cursor-pointer">
                    <span className="font-medium" style={{ color: '#2D2D2D' }}>All statuses</span>
                  </SelectItem>
                  <SelectItem value="active" className="rounded-xl px-3 py-2.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1" style={{ backgroundColor: '#14462a' }}></div>
                      <span className="font-medium" style={{ color: '#2D2D2D' }}>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive" className="rounded-xl px-3 py-2.5 cursor-pointer">
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
      )}

      {/* Contact Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)', borderColor: 'rgba(20, 70, 42, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                <TickCircle size={16} color="#14462a" />
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
                <Sms size={16} color="currentColor" className="mr-2" /> Email Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-0 shadow-sm transition-all hover:shadow-md hover:scale-105" 
                style={{ backgroundColor: 'white' }}
              >
                <DocumentDownload size={16} color="currentColor" className="mr-2" /> Export
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

        {loading ? (
          <TableSkeleton rows={5} />
        ) : isNewUser ? (
          <EmptyState
            icon={Profile2User}
            iconColor="#14462a"
            title="No contacts yet"
            description="Add your first contact to start building your client network. Contacts help you manage clients and track their invoices."
            actionLabel="Add Your First Contact"
            actionHref="#"
            onAction={() => openContactModal(null, "create")}
          />
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={SearchNormal1}
            title="No results found"
            description={searchQuery ? `No contacts matching "${searchQuery}"` : "No contacts match your filters. Try adjusting your search criteria."}
            size="sm"
          />
        ) : (
          <>
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
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow 
                    key={contact.id} 
                    data-state={selectedRows.includes(contact.id) ? "selected" : undefined}
                    className="cursor-pointer hover:bg-gray-50" 
                    style={{ borderColor: '#E4E6EB' }}
                    onClick={() => openContactModal(contact.id, "view")}
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
                          <AvatarFallback className="text-xs" style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)', color: '#14462a', fontWeight: 600 }}>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-xs text-[#65676B]">{contact.company || '-'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#65676B]">{contact.email || '-'}</TableCell>
                    <TableCell className="text-[#65676B]">{contact.phone || '-'}</TableCell>
                    <TableCell className="font-medium">
                      {maskAmount(formatCurrency(contact.totalPaid || 0))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={contact.status === 'Active' ? "success" : "outline"}>
                        {contact.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                            <More size={16} color="#B0B3B8" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer"
                            onClick={() => openContactModal(contact.id, "view")}
                          >
                            <Profile2User size={16} color="#14462a" className="mr-2" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer"
                            onClick={() => openContactModal(contact.id, "edit")}
                          >
                            <Edit2 size={16} color="#14462a" className="mr-2" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {contact.email && (
                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
                              <Sms size={16} color="#14462a" className="mr-2" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem className="rounded-xl p-3 cursor-pointer text-red-600">
                            <Trash size={16} color="#DC2626" className="mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm" style={{ color: '#65676B' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} contacts
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    <ArrowLeft2 size={16} color="#65676B" />
                  </Button>
                  <span className="text-sm px-3" style={{ color: '#2D2D2D' }}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  >
                    <ArrowRight2 size={16} color="#65676B" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contactId={selectedContactId}
        mode={modalMode}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
}
