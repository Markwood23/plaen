"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteEditor } from "@/components/notes/note-editor";
import {
  createStandaloneNote,
  updateStandaloneNote,
} from "@/hooks/useStandaloneNotes";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function NewNotePage() {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = useRef(false);

  // Auto-save logic
  const performSave = useCallback(async () => {
    if (!title.trim()) return;
    
    setSaveStatus("saving");
    
    try {
      if (!noteId) {
        // First save - create the note
        const result = await createStandaloneNote({
          title,
          content: htmlContent,
          tags,
        });
        
        if (result.success && result.note) {
          setNoteId(result.note.id);
          setSaveStatus("saved");
          setLastSaved(new Date());
          isDirtyRef.current = false;
        } else {
          setSaveStatus("error");
        }
      } else {
        // Update existing note
        const result = await updateStandaloneNote(noteId, {
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
      }
    } catch {
      setSaveStatus("error");
    }
  }, [title, htmlContent, tags, noteId]);

  // Debounced auto-save
  useEffect(() => {
    if (!title.trim()) return;
    
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
  }, [title, htmlContent, tags, performSave]);

  // Handle editor content change
  const handleContentChange = useCallback((html: string, text: string) => {
    setHtmlContent(html);
    setTextContent(text);
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

  // Manual save
  const handleSave = async () => {
    if (!title.trim()) return;
    await performSave();
    router.push("/notes");
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
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
            <h1 className="text-base sm:text-lg font-semibold text-[#2D2D2D]">
              {noteId ? "Editing Note" : "New Note"}
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
                  <span className="text-[#14462a]">Saved {formatLastSaved()}</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <CloudCross size={12} color="#EF4444" className="sm:hidden" />
                  <CloudCross size={14} color="#EF4444" className="hidden sm:block" />
                  <span className="text-red-500">Failed to save</span>
                </>
              )}
              {saveStatus === "idle" && title.trim() && isDirtyRef.current && (
                <>
                  <span>Unsaved changes</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-11 sm:pl-0">
          <Button
            variant="outline"
            className="rounded-full h-8 sm:h-9 px-3 sm:px-4 border-[#E4E6EB] text-xs sm:text-sm"
            onClick={() => router.push("/notes")}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full h-8 sm:h-9 px-3 sm:px-4 bg-[#14462a] hover:bg-[#0d3520] text-white text-xs sm:text-sm"
            onClick={handleSave}
            disabled={!title.trim() || saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Saving..." : "Save"}
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
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Paperclip
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2 group-hover:text-[#14462a]"
                />
                <span className="text-sm group-hover:text-[#14462a]">Pin Note</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Archive
                  size={14}
                  color="#2D2D2D"
                  variant="Linear"
                  className="mr-2 group-hover:text-[#14462a]"
                />
                <span className="text-sm group-hover:text-[#14462a]">Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 sm:py-2.5 cursor-pointer hover:bg-red-50 group transition-all">
                <Trash size={14} color="#DC2626" variant="Linear" className="mr-2" />
                <span className="text-sm text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
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
        onChange={handleContentChange}
        placeholder="Start writing your note... Use the toolbar above for formatting, or select text to see more options."
      />

      {/* Helper Text */}
      <div className="text-xs sm:text-sm text-center py-4 sm:py-8 text-[#B0B3B8] px-4">
        💡 <span className="hidden sm:inline">Tip: Select text to reveal formatting options, or use keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)</span>
        <span className="sm:hidden">Tip: Select text to format</span>
      </div>
    </div>
  );
}
