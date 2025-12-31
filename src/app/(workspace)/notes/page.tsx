"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Note,
  Add,
  SearchNormal1,
  More,
  Clock,
  Paperclip,
  Archive,
  Trash,
  DocumentDownload,
  Share,
  Star,
  ArrowRight2,
  ArrowLeft2,
  Category2,
  Element3,
  ArrowSwapVertical,
  TickCircle,
  Eye,
  Edit2,
  RefreshCircle,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotesData, deleteNote } from "@/hooks/useNotesData";
import { EmptyState } from "@/components/ui/empty-state";

// Loading skeletons
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded-full" />
          <div className="h-4 w-48 bg-gray-200 rounded flex-1" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
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

function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ backgroundColor: 'white', border: '1px solid #E4E6EB' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 rounded mb-1" />
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function FinanceNotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { notes, loading, error, pagination, refetch, setFilters, filters } = useNotesData({
    page: 1,
    limit: 12,
  });

  // Update filters when search or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        ...filters,
        search: searchQuery || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        page: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Calculate KPIs from notes
  const totalNotes = pagination.total;
  const pinnedNotes = notes.filter((n) => n.is_pinned).length;
  const notesThisMonth = notes.filter((n) => {
    const noteDate = new Date(n.created_at);
    const now = new Date();
    return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
  }).length;
  const totalAttachments = notes.reduce((sum, n) => sum + (n.attachment_count || 0), 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Handle select all
  const allSelected = notes.length > 0 && selectedRows.length === notes.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(notes.map(n => n.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (noteId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;
    
    const result = await deleteNote(noteId);
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Failed to delete note');
    }
  };

  // Check if user has no notes at all (for empty state)
  const isNewUser = !loading && notes.length === 0 && !searchQuery && selectedCategory === 'all';

  const renderNoteCard = (note: typeof notes[0]) => {
    return (
      <Link
        key={note.id}
        href={`/notes/${note.id}`}
        className="block rounded-2xl p-5 transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: "white",
          border: "1px solid #E4E6EB",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
          >
            <Note size={20} color="#14462a" />
          </div>
          <div className="flex items-center gap-2">
            {note.is_pinned && (
              <Star size={16} color="#F59E0B" variant="Bold" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-[rgba(20,70,42,0.06)]"
                  onClick={(e) => e.preventDefault()}
                >
                  <More size={16} color="#B0B3B8" variant="Linear" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2">
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                  <Eye size={16} className="mr-2" color="#14462a" />
                  <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                  <Edit2 size={16} className="mr-2" color="#14462a" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600"
                  onClick={(e) => { e.preventDefault(); handleDelete(note.id); }}
                >
                  <Trash size={16} className="mr-2" color="#DC2626" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h3 className="text-base font-semibold mb-2 line-clamp-2" style={{ color: "#2D2D2D" }}>
          {note.title}
        </h3>

        <p className="text-sm mb-4 line-clamp-3" style={{ color: "#B0B3B8" }}>
          {note.preview || note.content?.substring(0, 150) || 'No content'}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-xs"
                style={{ backgroundColor: "rgba(20, 70, 42, 0.08)", color: "#14462a" }}
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 2 && (
              <Badge
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-xs"
                style={{ backgroundColor: "rgba(176, 179, 184, 0.12)", color: "#B0B3B8" }}
              >
                +{note.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #E4E6EB" }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#B0B3B8" }}>
            <div className="flex items-center gap-1">
              <Clock size={14} color="#B0B3B8" />
              <span>{formatDate(note.updated_at)}</span>
            </div>
            {note.attachment_count > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip size={14} />
                <span>{note.attachment_count}</span>
              </div>
            )}
          </div>
          {note.word_count > 0 && (
            <span className="text-xs" style={{ color: "#B0B3B8" }}>
              {note.word_count} words
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: '#2D2D2D', fontWeight: 600 }}>Finance Notes</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Document AR insights, client notes, and financial observations</p>
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
            size="sm"
            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105"
            style={{ backgroundColor: '#14462a', color: 'white' }}
            asChild
          >
            <Link href="/notes/new">
              <Add size={16} color="white" className="mr-2" />
              New Note
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <Note size={24} color="#14462a" variant="Bulk" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <span className="text-xs font-semibold" style={{ color: '#14462a' }}>{totalNotes}</span>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Total Notes</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{totalNotes}</p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>All your notes</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}>
                  <Star size={24} color="#F59E0B" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Pinned</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{pinnedNotes}</p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Important notes</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(13, 148, 136, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}>
                  <Clock size={24} color="#0D9488" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>This Month</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{notesThisMonth}</p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Notes created</p>
            </div>

            <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(20, 70, 42, 0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}>
                  <Paperclip size={24} color="#14462a" variant="Bulk" />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: '#65676B', fontWeight: 500 }}>Attachments</p>
              <p className="text-3xl tracking-tight" style={{ color: '#2D2D2D', fontWeight: 700 }}>{totalAttachments}</p>
              <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>Files attached</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters - Only show if user has notes */}
      {!isNewUser && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>Filter Notes</h3>
              <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>Search and filter your notes</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white" 
                style={{ color: '#14462a' }}
              >
                Clear all
              </button>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-all ${viewMode === "grid" ? "bg-[rgba(20,70,42,0.08)]" : ""}`}
                >
                  <Category2 size={16} color={viewMode === "grid" ? "#14462a" : "#B0B3B8"} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 transition-all ${viewMode === "table" ? "bg-[rgba(20,70,42,0.08)]" : ""}`}
                >
                  <Element3 size={16} color={viewMode === "table" ? "#14462a" : "#B0B3B8"} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Search</label>
              <div className="relative">
                <SearchNormal1 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#B0B3B8' }} />
                <Input
                  placeholder="Search notes by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-0 shadow-sm transition-all focus:shadow-md"
                  style={{ backgroundColor: 'white', color: '#2D2D2D' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color: '#65676B' }}>Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 rounded-xl border-0 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'white' }}>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ar_analysis">AR Analysis</SelectItem>
                  <SelectItem value="payment_analysis">Payment Analysis</SelectItem>
                  <SelectItem value="client_notes">Client Notes</SelectItem>
                  <SelectItem value="tax_records">Tax Records</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Notes Display */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        {loading ? (
          viewMode === "grid" ? <div className="p-6"><GridSkeleton count={6} /></div> : <TableSkeleton rows={5} />
        ) : isNewUser ? (
          <EmptyState
            icon={Note}
            iconColor="#14462a"
            title="No notes yet"
            description="Create your first note to document AR insights, client observations, or financial analyses."
            actionLabel="Create Your First Note"
            actionHref="/notes/new"
          />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={SearchNormal1}
            title="No results found"
            description={searchQuery ? `No notes matching "${searchQuery}"` : "No notes match your filters. Try adjusting your search criteria."}
            size="sm"
          />
        ) : viewMode === "grid" ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(renderNoteCard)}
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allSelected}
                      {...(someSelected && { 'data-state': 'indeterminate' })}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow
                    key={note.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => window.location.href = `/notes/${note.id}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedRows.includes(note.id)}
                        onCheckedChange={() => toggleSelectRow(note.id)}
                        aria-label={`Select ${note.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
                        >
                          <Note size={16} color="#14462a" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate flex items-center gap-2" style={{ color: "#2D2D2D" }}>
                            {note.title}
                            {note.is_pinned && <Star size={14} color="#F59E0B" variant="Bold" />}
                          </div>
                          <div className="text-xs truncate max-w-[300px]" style={{ color: "#B0B3B8" }}>
                            {note.preview || note.content?.substring(0, 60) || 'No content'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full">
                        {note.category || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {note.tags?.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-full px-2 py-0.5 text-xs"
                            style={{ backgroundColor: "rgba(20, 70, 42, 0.08)", color: "#14462a" }}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(note.tags?.length || 0) > 2 && (
                          <span className="text-xs" style={{ color: "#B0B3B8" }}>+{(note.tags?.length || 0) - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: "#65676B" }}>
                      {formatDate(note.updated_at)}
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: "#65676B" }}>
                      {note.word_count || 0}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(20,70,42,0.06)]">
                            <More size={16} color="#B0B3B8" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
                          <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                            <Link href={`/notes/${note.id}`}>
                              <Eye size={16} color="#14462a" className="mr-2" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer">
                            <Link href={`/notes/${note.id}/edit`}>
                              <Edit2 size={16} color="#14462a" className="mr-2" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem 
                            className="rounded-xl p-3 cursor-pointer text-red-600"
                            onClick={() => handleDelete(note.id)}
                          >
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
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notes
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page <= 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    <ArrowLeft2 size={16} />
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
                    <ArrowRight2 size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
