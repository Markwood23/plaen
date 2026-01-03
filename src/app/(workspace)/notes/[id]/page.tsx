"use client";

import { use, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft2,
  More,
  Paperclip,
  Archive,
  Trash,
  Add,
  TickCircle,
  CloseCircle,
  Cloud,
  CloudCross,
  Refresh,
  Edit2,
  Star,
  Share,
  DocumentDownload,
  Printer,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteEditor } from "@/components/notes/note-editor";
import {
  useStandaloneNote,
  updateStandaloneNote,
  deleteStandaloneNote,
  togglePinNote,
} from "@/hooks/useStandaloneNotes";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { note, loading, error, refetch } = useStandaloneNote(id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = useRef(false);

  // Initialize state from note data
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setHtmlContent(note.content || "");
      setTags(note.tags || []);
    }
  }, [note]);

  // Auto-save logic
  const performSave = useCallback(async () => {
    if (!title.trim() || !note) return;

    setSaveStatus("saving");

    try {
      const result = await updateStandaloneNote(note.id, {
        title,
        content: htmlContent,
        tags,
      });

      if (result.success) {
        setSaveStatus("saved");
        setLastSaved(new Date());
        isDirtyRef.current = false;
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  }, [title, htmlContent, tags, note]);

  // Debounced auto-save in edit mode
  useEffect(() => {
    if (!isEditMode || !title.trim()) return;

    isDirtyRef.current = true;
    setSaveStatus("idle");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, htmlContent, tags, isEditMode, performSave]);

  // Handle editor content change
  const handleContentChange = useCallback((html: string) => {
    setHtmlContent(html);
  }, []);

  // Tags management
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle delete
  const handleDelete = async () => {
    if (!note) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    const result = await deleteStandaloneNote(note.id);
    if (result.success) {
      router.push("/notes");
    } else {
      alert(result.error || "Failed to delete note");
    }
  };

  // Handle pin
  const handleTogglePin = async () => {
    if (!note) return;

    const result = await togglePinNote(note.id, note.is_pinned);
    if (result.success) {
      refetch();
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 px-0">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
        </div>
        <Skeleton className="h-8 sm:h-12 w-3/4 mb-4 sm:mb-6" />
        <div className="flex gap-2 mb-4 sm:mb-6">
          <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
        </div>
        <Skeleton className="h-72 sm:h-96 w-full rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error || !note) {
    return (
      <div className="max-w-4xl mx-auto pb-12 px-0">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Link href="/notes">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full"
            >
              <ArrowLeft2 size={16} color="#2D2D2D" variant="Linear" />
            </Button>
          </Link>
        </div>
        <div className="text-center py-10 sm:py-16 px-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Note Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            {error || "This note could not be found."}
          </p>
          <Button asChild className="bg-[#14462a] hover:bg-[#0d3520] rounded-xl h-9 sm:h-10 text-sm">
            <Link href="/notes">Back to Notes</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (isEditMode) {
    return (
      <div className="max-w-4xl mx-auto pb-12 px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full"
              onClick={() => setIsEditMode(false)}
            >
              <ArrowLeft2 size={16} color="#2D2D2D" variant="Linear" />
            </Button>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-[#2D2D2D]">
                Editing Note
              </h1>
              {/* Save Status Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B0B3B8]">
                {saveStatus === "saving" && (
                  <>
                    <Refresh size={12} color="#B0B3B8" className="animate-spin sm:hidden" />
                    <Refresh size={14} color="#B0B3B8" className="animate-spin hidden sm:block" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Cloud size={12} color="#14462a" className="sm:hidden" />
                    <Cloud size={14} color="#14462a" className="hidden sm:block" />
                    <span className="text-[#14462a]">
                      Saved {formatLastSaved()}
                    </span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <CloudCross size={12} color="#EF4444" className="sm:hidden" />
                    <CloudCross size={14} color="#EF4444" className="hidden sm:block" />
                    <span className="text-red-500">Failed to save</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-11 sm:pl-0">
            <Button
              variant="outline"
              className="rounded-full h-8 sm:h-9 px-3 sm:px-4 border-[#E4E6EB] text-xs sm:text-sm"
              onClick={() => {
                setIsEditMode(false);
                // Reset to original values
                setTitle(note.title || "");
                setHtmlContent(note.content || "");
                setTags(note.tags || []);
              }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full h-8 sm:h-9 px-3 sm:px-4 bg-[#14462a] hover:bg-[#0d3520] text-white text-xs sm:text-sm"
              onClick={async () => {
                await performSave();
                setIsEditMode(false);
                refetch();
              }}
              disabled={!title.trim() || saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Saving..." : "Done"}
            </Button>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl sm:text-3xl font-bold border-0 px-0 focus:outline-none focus:ring-0 placeholder:text-gray-300 text-[#2D2D2D]"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 bg-[rgba(20,70,42,0.08)] text-[#14462a] border-0"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:opacity-70"
              >
                <CloseCircle size={10} color="#14462a" variant="Linear" className="sm:hidden" />
                <CloseCircle size={12} color="#14462a" variant="Linear" className="hidden sm:block" />
              </button>
            </Badge>
          ))}
          {isAddingTag ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="text"
                placeholder="Tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag();
                  }
                  if (e.key === "Escape") {
                    setIsAddingTag(false);
                    setNewTag("");
                  }
                }}
                className="h-6 sm:h-7 w-24 sm:w-32 text-[10px] sm:text-xs rounded-full px-2 sm:px-3 border border-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#14462a]/20 focus:border-[#14462a]"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-full"
                onClick={handleAddTag}
              >
                <TickCircle size={12} color="#14462a" variant="Linear" className="sm:hidden" />
                <TickCircle size={14} color="#14462a" variant="Linear" className="hidden sm:block" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 rounded-full"
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTag("");
                }}
              >
                <CloseCircle size={12} color="#B0B3B8" variant="Linear" className="sm:hidden" />
                <CloseCircle size={14} color="#B0B3B8" variant="Linear" className="hidden sm:block" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1 transition-colors bg-[rgba(176,179,184,0.08)] text-[#B0B3B8] hover:bg-[rgba(176,179,184,0.12)]"
            >
              <Add size={10} color="#B0B3B8" variant="Linear" className="sm:hidden" />
              <Add size={12} color="#B0B3B8" variant="Linear" className="hidden sm:block" />
              Add Tag
            </button>
          )}
        </div>

        {/* Rich Text Editor */}
        <NoteEditor
          content={htmlContent}
          onChange={(html) => handleContentChange(html)}
          placeholder="Start writing your note..."
          editable={true}
        />
      </div>
    );
  }

  // View Mode
  return (
    <div className="max-w-4xl mx-auto pb-12 px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/notes">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full"
            >
              <ArrowLeft2 size={16} color="#2D2D2D" variant="Linear" />
            </Button>
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-[#2D2D2D]">View Note</h1>
            <p className="text-xs sm:text-sm text-[#B0B3B8]">
              Updated {formatDate(note.updated_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-11 sm:pl-0">
          <Button
            variant="outline"
            className="rounded-full h-8 sm:h-9 px-3 sm:px-4 border-[#E4E6EB] text-xs sm:text-sm hidden sm:flex"
            onClick={handlePrint}
          >
            <Printer size={14} color="#2D2D2D" variant="Linear" className="mr-1.5 sm:mr-2" />
            Print
          </Button>
          <Button
            className="rounded-full h-8 sm:h-9 px-3 sm:px-4 bg-[#14462a] hover:bg-[#0d3520] text-white text-xs sm:text-sm"
            onClick={() => setIsEditMode(true)}
          >
            <Edit2 size={14} color="white" variant="Linear" className="mr-1.5 sm:mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full hover:bg-[rgba(20,70,42,0.06)]"
              >
                <More size={16} color="#B0B3B8" variant="Linear" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-2xl p-2 w-40 sm:w-auto"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all"
                onClick={handleTogglePin}
              >
                <Star
                  size={14}
                  color={note.is_pinned ? "#F59E0B" : "#2D2D2D"}
                  variant={note.is_pinned ? "Bold" : "Linear"}
                  className="mr-2"
                />
                <span className="text-sm">{note.is_pinned ? "Unpin" : "Pin"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all sm:hidden" onClick={handlePrint}>
                <Printer
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2"
                />
                <span className="text-sm">Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Share
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2"
                />
                <span className="text-sm">Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <DocumentDownload
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2"
                />
                <span className="text-sm">Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Archive
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2"
                />
                <span className="text-sm">Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-red-50 group transition-all"
                onClick={handleDelete}
              >
                <Trash
                  size={14}
                  color="#DC2626"
                  variant="Linear"
                  className="mr-2"
                />
                <span className="text-sm text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Note Title */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-3xl font-bold text-[#2D2D2D]">{note.title}</h1>
          {note.is_pinned && <Star size={18} color="#F59E0B" variant="Bold" className="sm:hidden" />}
          {note.is_pinned && <Star size={24} color="#F59E0B" variant="Bold" className="hidden sm:block" />}
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {note.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-[rgba(20,70,42,0.08)] text-[#14462a] border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Note Content */}
      <div className="prose prose-sm max-w-none">
        <NoteEditor
          content={note.content || ""}
          onChange={() => {}}
          editable={false}
        />
      </div>

      {/* Metadata */}
      <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-100 text-xs sm:text-sm text-[#B0B3B8]">
        <p>Created {formatDate(note.created_at)}</p>
        <p>{note.word_count || 0} words</p>
      </div>
    </div>
  );
}
