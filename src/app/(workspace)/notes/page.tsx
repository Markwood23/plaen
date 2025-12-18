"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DocumentText,
  Add,
  SearchNormal1,
  Filter,
  More,
  Calendar,
  Tag,
  Chart,
  Clock,
  Paperclip,
  Archive,
  Trash,
  DocumentDownload,
  Share,
  Folder,
  Star,
  ArrowRight2,
  People,
  Category2,
  Element3,
  ArrowSwapVertical,
  TickSquare,
  CloseSquare,
  Eye,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for notes
const mockNotes = [
  {
    id: "1",
    title: "Q4 2024 AR Review",
    preview: "Outstanding invoices analysis showing $45.2K overdue across 12 clients. DSO trending upward...",
    category: "AR Analysis",
    tags: ["monthly-review", "ar", "q4-2024"],
    createdAt: "2024-11-15T10:30:00Z",
    updatedAt: "2024-11-18T14:22:00Z",
    author: "John Doe",
    isPinned: true,
    hasPaperclipments: true,
    attachmentCount: 3,
    wordCount: 1247,
    icon: Chart,
    iconColor: "#14462a",
  },
  {
    id: "2",
    title: "Mobile Money Payment Trends",
    preview: "Analysis of MoMo vs Bank transfer adoption. 68% of payments now via MTN MoMo, up 15% from last quarter...",
    category: "Payment Analysis",
    tags: ["momo", "trends", "ghana"],
    createdAt: "2024-11-12T09:15:00Z",
    updatedAt: "2024-11-17T11:45:00Z",
    author: "John Doe",
    isPinned: false,
    hasPaperclipments: false,
    attachmentCount: 0,
    wordCount: 892,
    icon: Chart,
    iconColor: "#0D9488",
  },
  {
    id: "3",
    title: "Client Notes: TechCorp Ghana",
    preview: "Preferred payment: MTN MoMo. NET 15 terms. Contact: Kwame Mensah (CFO). Always requests itemized receipts...",
    category: "Client Notes",
    tags: ["client", "techcorp", "ghana"],
    createdAt: "2024-11-10T15:20:00Z",
    updatedAt: "2024-11-16T10:30:00Z",
    author: "John Doe",
    isPinned: true,
    hasPaperclipments: true,
    attachmentCount: 2,
    wordCount: 456,
    icon: People,
    iconColor: "#14462a",
  },
  {
    id: "4",
    title: "Tax Records - October 2024",
    preview: "Monthly tax documentation with invoice snapshots, payment receipts, and withholding certificates...",
    category: "Tax Records",
    tags: ["tax", "october", "compliance"],
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-11-01T16:45:00Z",
    author: "John Doe",
    isPinned: false,
    hasPaperclipments: true,
    attachmentCount: 12,
    wordCount: 623,
    icon: Paperclip,
    iconColor: "#F59E0B",
  },
  {
    id: "5",
    title: "Payment Terms Strategy",
    preview: "Reviewing client payment terms to improve cash flow. Proposal: NET 15 standard, NET 30 for enterprise clients...",
    category: "Strategy",
    tags: ["strategy", "payment-terms", "cash-flow"],
    createdAt: "2024-10-28T14:30:00Z",
    updatedAt: "2024-11-14T09:20:00Z",
    author: "John Doe",
    isPinned: false,
    hasPaperclipments: false,
    attachmentCount: 0,
    wordCount: 678,
    icon: DocumentText,
    iconColor: "#14462a",
  },
  {
    id: "6",
    title: "Overdue Invoice Action Plan",
    preview: "12 invoices >60 days overdue. Created reminder schedule and payment plan templates...",
    category: "Collections",
    tags: ["overdue", "collections", "action-plan"],
    createdAt: "2024-10-25T11:00:00Z",
    updatedAt: "2024-11-13T15:10:00Z",
    author: "John Doe",
    isPinned: false,
    hasPaperclipments: true,
    attachmentCount: 5,
    wordCount: 1089,
    icon: DocumentText,
    iconColor: "#DC2626",
  },
];

// Categories/folders
const categories = [
  { name: "All Notes", count: 24, icon: DocumentText, color: "#2D2D2D" },
  { name: "AR Analysis", count: 8, icon: Chart, color: "#14462a" },
  { name: "Payment Analysis", count: 5, icon: Chart, color: "#0D9488" },
  { name: "Client Notes", count: 6, icon: People, color: "#14462a" },
  { name: "Tax Records", count: 3, icon: Paperclip, color: "#F59E0B" },
  { name: "Strategy", count: 2, icon: DocumentText, color: "#14462a" },
];
export default function FinanceNotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showPaperclipmentsOnly, setShowPaperclipmentsOnly] = useState(false);

  // Calculate KPIs
  const totalNotes = mockNotes.length;
  const pinnedNotes = mockNotes.filter((n) => n.isPinned).length;
  const notesThisMonth = mockNotes.filter((n) => {
    const noteDate = new Date(n.createdAt);
    const now = new Date();
    return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
  }).length;
  const totalPaperclipments = mockNotes.reduce((sum, n) => sum + n.attachmentCount, 0);

  // Filter notes based on criteria
  const filterNotes = (notes: typeof mockNotes) => {
    return notes.filter((note) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          note.title.toLowerCase().includes(query) ||
          note.preview.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query)) ||
          note.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && note.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => note.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Pinned filter
      if (showPinnedOnly && !note.isPinned) {
        return false;
      }

      // Paperclipments filter
      if (showPaperclipmentsOnly && !note.hasPaperclipments) {
        return false;
      }

      return true;
    });
  };

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

  const renderNoteCard = (note: typeof mockNotes[0]) => {
    const Icon = note.icon;
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
            style={{ backgroundColor: `${note.iconColor}12` }}
          >
            <Icon
              size={20}
              style={{ color: note.iconColor }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={(e) => e.preventDefault()}
              >
                <More size={16} color="#B0B3B8" variant="Linear" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Paperclip size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                <span>{note.isPinned ? "Unpin" : "Pin"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Share size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <DocumentDownload size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                <span>Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Archive size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                <span>Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600">
                <Trash size={16} className="mr-2" color="#DC2626" variant="Linear" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3
          className="text-base font-semibold mb-2 line-clamp-2"
          style={{ color: "#2D2D2D" }}
        >
          {note.title}
        </h3>

        <p
          className="text-sm mb-4 line-clamp-3"
          style={{ color: "#B0B3B8" }}
        >
          {note.preview}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={{
                backgroundColor: "rgba(20, 70, 42, 0.08)",
                color: "#14462a",
              }}
            >
              {tag}
            </Badge>
          ))}
          {note.tags.length > 2 && (
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={{
                backgroundColor: "rgba(176, 179, 184, 0.12)",
                color: "#B0B3B8",
              }}
            >
              +{note.tags.length - 2}
            </Badge>
          )}
        </div>

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #E4E6EB" }}
        >
          <div className="flex items-center gap-3 text-xs" style={{ color: "#B0B3B8" }}>
            <div className="flex items-center gap-1">
              <Clock size={14} color="#B0B3B8" variant="Linear" />
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            {note.hasPaperclipments && (
              <div className="flex items-center gap-1">
                <DocumentText size={14} />
                <span>{note.attachmentCount}</span>
              </div>
            )}
          </div>
          <span className="text-xs" style={{ color: "#B0B3B8" }}>
            {note.wordCount} words
          </span>
        </div>
      </Link>
    );
  };

  const renderNotesTable = (notes: typeof mockNotes) => {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Title <ArrowSwapVertical size={14} color="#B0B3B8" variant="Linear" />
                </button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-[#14462a] transition-colors">
                  Updated <ArrowSwapVertical size={14} color="#B0B3B8" variant="Linear" />
                </button>
              </TableHead>
              <TableHead>Words</TableHead>
              <TableHead>Files</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <TableRow
                  key={note.id}
                  className="cursor-pointer"
                  onClick={() => window.location.href = `/notes/${note.id}`}
                >
                  <TableCell>
                    {note.isPinned && (
                      <Paperclip size={16} color="#F59E0B" variant="Linear" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${note.iconColor}12` }}
                      >
                        <Icon size={16} style={{ color: note.iconColor }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate" style={{ color: "#2D2D2D" }}>
                          {note.title}
                        </div>
                        <div className="text-sm truncate max-w-[300px]" style={{ color: "#B0B3B8" }}>
                          {note.preview}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-full"
                      style={{
                        backgroundColor: `${note.iconColor}08`,
                        color: note.iconColor,
                      }}
                    >
                      {note.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{
                            backgroundColor: "rgba(20, 70, 42, 0.08)",
                            color: "#14462a",
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{
                            backgroundColor: "rgba(176, 179, 184, 0.12)",
                            color: "#B0B3B8",
                          }}
                        >
                          +{note.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#65676B]">{formatDate(note.updatedAt)}</TableCell>
                  <TableCell className="text-[#65676B]">{note.wordCount}</TableCell>
                  <TableCell>
                    {note.hasPaperclipments && (
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: "#B0B3B8" }}>
                        <DocumentText size={14} />
                        <span>{note.attachmentCount}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center rounded-full p-1.5 transition-all hover:bg-[rgba(24,119,242,0.04)]">
                          <More size={16} color="#B0B3B8" variant="Linear" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2">
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Eye size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                          <span>View Note</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Paperclip size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                          <span>{note.isPinned ? "Unpin" : "Pin"}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Share size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <DocumentDownload size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                          <span>Export PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                          <Archive size={16} className="mr-2" color="#2D2D2D" variant="Linear" />
                          <span>Archive</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600">
                          <Trash size={16} className="mr-2" color="#DC2626" variant="Linear" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold mb-1"
              style={{ color: "#2D2D2D" }}
            >
              Finance Notes & Docs
            </h1>
            <p className="text-sm" style={{ color: "#B0B3B8" }}>
              Organize financial insights, records, and documentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center rounded-full p-1" style={{ backgroundColor: "#F7F9FA" }}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full transition-all ${viewMode === "table" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setViewMode("table")}
              >
                <Element3 size={16} color="#2D2D2D" variant="Linear" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Category2 size={16} color="#2D2D2D" variant="Linear" />
              </Button>
            </div>

            <Link href="/notes/new">
              <Button
                className="rounded-full h-10 px-5"
                style={{ backgroundColor: "#14462a", color: "white", fontWeight: 600 }}
              >
                <Add size={16} color="white" variant="Linear" className="mr-2" />
                New Note
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-10 px-4"
              style={{ borderColor: "#E4E6EB", color: "#2D2D2D" }}
            >
              <DocumentDownload size={14} color="#2D2D2D" variant="Linear" className="mr-1.5" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-10 px-4"
              style={{ borderColor: "#E4E6EB", color: "#2D2D2D" }}
            >
              <Share size={14} color="#2D2D2D" variant="Linear" className="mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Notes",
              value: totalNotes,
              icon: DocumentText,
              color: "#14462a",
              bg: "rgba(20, 70, 42, 0.04)",
            },
            {
              label: "Pinned",
              value: pinnedNotes,
              icon: Paperclip,
              color: "#F59E0B",
              bg: "rgba(245, 158, 11, 0.04)",
            },
            {
              label: "This Month",
              value: notesThisMonth,
              icon: Calendar,
              color: "#0D9488",
              bg: "rgba(13, 148, 136, 0.04)",
            },
            {
              label: "Paperclipments",
              value: totalPaperclipments,
              icon: DocumentText,
              color: "#14462a",
              bg: "rgba(20, 70, 42, 0.04)",
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
                style={{
                  backgroundColor: kpi.bg,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${kpi.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: "#2D2D2D" }}>
                  {kpi.value}
                </div>
                <div className="text-sm font-medium" style={{ color: "#B0B3B8" }}>
                  {kpi.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#FAFBFC" }}
        >
          <div className="flex-1 relative">
            <SearchNormal1
              size={16}
              color="#B0B3B8"
              variant="Linear"
              className="absolute left-4 top-1/2 -translate-y-1/2"
            />
            <Input
              type="text"
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-10 rounded-full border-0 shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: "#FAFBFC",
                color: "#2D2D2D",
              }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-10 px-4"
            style={{ borderColor: "#E4E6EB", backgroundColor: "#FAFBFC" }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} color="#2D2D2D" variant="Linear" className="mr-1.5" />
            {showFilters ? "Hide Filters" : "Filter"}
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div
            className="rounded-2xl p-6 mt-4"
            style={{ backgroundColor: "#FAFBFC" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "#2D2D2D" }}>
                  Filter Notes
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#B0B3B8" }}>
                  Refine your notes by category, tags, and more
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-3 text-xs"
                style={{ color: "#14462a" }}
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedTags([]);
                  setShowPinnedOnly(false);
                  setShowPaperclipmentsOnly(false);
                }}
              >
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs mb-2 font-medium" style={{ color: "#65676B" }}>
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "AR Analysis", "Payment Analysis", "Client Notes", "Tax Records"].map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs h-8"
                      style={selectedCategory === cat ? {
                        backgroundColor: "#14462a",
                        color: "white",
                        borderColor: "#14462a"
                      } : {
                        backgroundColor: "white",
                        borderColor: "#E4E6EB",
                        color: "#2D2D2D"
                      }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === "all" ? "All" : cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tag Filters */}
              <div>
                <label className="block text-xs mb-2 font-medium" style={{ color: "#65676B" }}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {["ar", "momo", "q4-2024", "trends", "ghana"].map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs h-8"
                      style={selectedTags.includes(tag) ? {
                        backgroundColor: "#14462a",
                        color: "white",
                        borderColor: "#14462a"
                      } : {
                        backgroundColor: "white",
                        borderColor: "#E4E6EB",
                        color: "#2D2D2D"
                      }}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="block text-xs mb-2 font-medium" style={{ color: "#65676B" }}>
                  Quick Filters
                </label>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={showPinnedOnly ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl justify-start h-8 text-xs"
                    style={showPinnedOnly ? {
                      backgroundColor: "#14462a",
                      color: "white",
                      borderColor: "#14462a"
                    } : {
                      backgroundColor: "white",
                      borderColor: "#E4E6EB",
                      color: "#2D2D2D"
                    }}
                    onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                  >
                    <Paperclip size={14} color="#2D2D2D" variant="Linear" className="mr-1.5" />
                    Pinned only
                  </Button>
                  <Button
                    variant={showPaperclipmentsOnly ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl justify-start h-8 text-xs"
                    style={showPaperclipmentsOnly ? {
                      backgroundColor: "#14462a",
                      color: "white",
                      borderColor: "#14462a"
                    } : {
                      backgroundColor: "white",
                      borderColor: "#E4E6EB",
                      color: "#2D2D2D"
                    }}
                    onClick={() => setShowPaperclipmentsOnly(!showPaperclipmentsOnly)}
                  >
                    <DocumentText size={14} color="#2D2D2D" variant="Linear" className="mr-1.5" />
                    With attachments
                  </Button>
                </div>
              </div>

              {/* Active Filters Summary */}
              <div>
                <label className="block text-xs mb-2 font-medium" style={{ color: "#65676B" }}>
                  Active Filters
                </label>
                <div className="text-xs" style={{ color: "#B0B3B8" }}>
                  {selectedCategory !== "all" && (
                    <div className="mb-1">Category: {selectedCategory}</div>
                  )}
                  {selectedTags.length > 0 && (
                    <div className="mb-1">Tags: {selectedTags.length}</div>
                  )}
                  {showPinnedOnly && (
                    <div className="mb-1">Pinned only</div>
                  )}
                  {showPaperclipmentsOnly && (
                    <div className="mb-1">With attachments</div>
                  )}
                  {selectedCategory === "all" && selectedTags.length === 0 && !showPinnedOnly && !showPaperclipmentsOnly && (
                    <div>No filters applied</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mb-6" style={{ backgroundColor: "#FAFBFC" }}>
          <TabsTrigger value="all">
            <DocumentText size={16} color="#2D2D2D" variant="Linear" />
            All Notes
          </TabsTrigger>
          <TabsTrigger value="ar">
            <Chart size={16} color="#2D2D2D" variant="Linear" />
            AR Analysis
          </TabsTrigger>
          <TabsTrigger value="payment">
            <Chart size={16} color="#2D2D2D" variant="Linear" />
            Payment Analysis
          </TabsTrigger>
          <TabsTrigger value="client">
            <People size={16} color="#2D2D2D" variant="Linear" />
            Client Notes
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Paperclip size={16} color="#2D2D2D" variant="Linear" />
            Tax Records
          </TabsTrigger>
        </TabsList>

        {/* All Notes Tab */}
        <TabsContent value="all" className="flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <>
              {/* Pinned Notes Section */}
              {filterNotes(mockNotes).filter((n) => n.isPinned).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Paperclip size={16} color="#F59E0B" variant="Linear" />
                    <h2 className="text-sm font-semibold" style={{ color: "#B0B3B8" }}>
                      PINNED
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterNotes(mockNotes).filter((note) => note.isPinned).map(renderNoteCard)}
                  </div>
                </div>
              )}

              {/* All Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: "#B0B3B8" }}>
                    ALL NOTES ({filterNotes(mockNotes).length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterNotes(mockNotes).map(renderNoteCard)}
                </div>
              </div>
            </>
          ) : (
            renderNotesTable(filterNotes(mockNotes))
          )}
        </TabsContent>

        {/* AR Analysis Tab */}
        <TabsContent value="ar" className="flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.filter((note) => note.category === "AR Analysis").map(renderNoteCard)}
            </div>
          ) : (
            renderNotesTable(mockNotes.filter((note) => note.category === "AR Analysis"))
          )}
        </TabsContent>

        {/* Payment Analysis Tab */}
        <TabsContent value="payment" className="flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.filter((note) => note.category === "Payment Analysis").map(renderNoteCard)}
            </div>
          ) : (
            renderNotesTable(mockNotes.filter((note) => note.category === "Payment Analysis"))
          )}
        </TabsContent>

        {/* Client Notes Tab */}
        <TabsContent value="client" className="flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.filter((note) => note.category === "Client Notes").map(renderNoteCard)}
            </div>
          ) : (
            renderNotesTable(mockNotes.filter((note) => note.category === "Client Notes"))
          )}
        </TabsContent>

        {/* Tax Records Tab */}
        <TabsContent value="tax" className="flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.filter((note) => note.category === "Tax Records").map(renderNoteCard)}
            </div>
          ) : (
            renderNotesTable(mockNotes.filter((note) => note.category === "Tax Records"))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
