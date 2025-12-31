"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  ArrowLeft2,
  More,
  DocumentDownload,
  Share,
  Paperclip,
  Archive,
  Trash,
  Add,
  Text,
  TextBlock,
  Element3,
  Hashtag,
  Link2,
  Image,
  Code,
  Grid1,
  Chart,
  Note,
  Sms,
  TickCircle,
  CloseCircle,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createNote, updateNote } from "@/hooks/useNotesData";
import { useAutoSave, AutoSaveIndicator } from "@/hooks/useAutoSave";

export default function NewNotePage() {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  // Memoize the note data object for auto-save
  const noteData = useMemo(() => ({
    title,
    content,
    tags,
  }), [title, content, tags]);

  // Auto-save handler - creates note first time, then updates
  const handleAutoSave = useCallback(async (data: typeof noteData) => {
    if (!data.title.trim()) {
      return { success: true }; // Don't save if no title
    }

    if (!noteId) {
      // First save - create the note
      const result = await createNote({
        title: data.title,
        content: data.content,
        tags: data.tags,
      });
      if (result.success && result.note) {
        setNoteId(result.note.id);
        setIsCreated(true);
      }
      return result;
    } else {
      // Subsequent saves - update the note
      return await updateNote(noteId, {
        title: data.title,
        content: data.content,
        tags: data.tags,
      });
    }
  }, [noteId]);

  // Auto-save hook - only enabled after title is entered
  const { status, lastSavedAt, error, forceSave } = useAutoSave({
    data: noteData,
    onSave: handleAutoSave,
    debounceMs: 2000,
    enabled: title.trim().length > 0,
  });

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

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    await forceSave();
    setIsSaving(false);
    router.push("/notes");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <NextLink href="/notes">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
            >
              <ArrowLeft2 size={16} color="#2D2D2D" variant="Linear" />
            </Button>
          </NextLink>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#2D2D2D" }}>
              {isCreated ? "Editing Note" : "New Note"}
            </h1>
            <AutoSaveIndicator status={status} lastSavedAt={lastSavedAt} error={error} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full h-9 px-4"
            style={{ borderColor: "#E4E6EB" }}
            onClick={() => router.push("/notes")}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full h-9 px-4"
            style={{ backgroundColor: "#14462a", color: "white" }}
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
          >
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-[rgba(20,70,42,0.06)]"
              >
                <More size={16} color="#B0B3B8" variant="Linear" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Paperclip size={16} color="#2D2D2D" variant="Linear" className="mr-2 group-hover:text-[#14462a]" />
                <span className="group-hover:text-[#14462a]">Pin Note</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Share size={16} color="#2D2D2D" variant="Linear" className="mr-2 group-hover:text-[#14462a]" />
                <span className="group-hover:text-[#14462a]">Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <DocumentDownload size={16} color="#2D2D2D" variant="Linear" className="mr-2 group-hover:text-[#14462a]" />
                <span className="group-hover:text-[#14462a]">Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Archive size={16} color="#2D2D2D" variant="Linear" className="mr-2 group-hover:text-[#14462a]" />
                <span className="group-hover:text-[#14462a]">Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-red-50 group transition-all">
                <Trash size={16} color="#DC2626" variant="Linear" className="mr-2" />
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ color: "#2D2D2D" }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
            style={{
              backgroundColor: "rgba(20, 70, 42, 0.08)",
              color: "#14462a",
            }}
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:opacity-70"
            >
              <CloseCircle size={12} color="#14462a" variant="Linear" />
            </button>
          </Badge>
        ))}
        {isAddingTag ? (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                }
              }}
              className="h-7 w-32 text-xs rounded-full px-3"
              style={{ borderColor: "#E4E6EB" }}
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 rounded-full"
              onClick={handleAddTag}
            >
              <TickCircle size={14} color="#0D9488" variant="Linear" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 rounded-full"
              onClick={() => {
                setIsAddingTag(false);
                setNewTag("");
              }}
            >
              <CloseCircle size={14} color="#B0B3B8" variant="Linear" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
            style={{
              backgroundColor: "rgba(176, 179, 184, 0.08)",
              color: "#B0B3B8",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(176, 179, 184, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(176, 179, 184, 0.08)";
            }}
          >
            <Add size={12} color="#B0B3B8" variant="Linear" />
            Add Tag
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-1 p-2 mb-4 rounded-full"
        style={{ backgroundColor: "#F7F9FA" }}
      >
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Text size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <TextBlock size={16} color="#2D2D2D" variant="Linear" />
          </Button>
        </div>
        <div
          className="h-6 w-px mx-1"
          style={{ backgroundColor: "#E4E6EB" }}
        />
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Element3 size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Hashtag size={16} color="#2D2D2D" variant="Linear" />
          </Button>
        </div>
        <div
          className="h-6 w-px mx-1"
          style={{ backgroundColor: "#E4E6EB" }}
        />
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Link2 size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Image size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Code size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Grid1 size={16} color="#2D2D2D" variant="Linear" />
          </Button>
        </div>
        <div
          className="h-6 w-px mx-1"
          style={{ backgroundColor: "#E4E6EB" }}
        />
        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full hover:bg-[rgba(20,70,42,0.06)] text-xs font-medium"
                style={{ color: "#14462a" }}
              >
                <Add size={16} color="#14462a" variant="Linear" className="mr-1.5" />
                Insert Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Chart size={16} color="#14462a" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm group-hover:text-[#14462a]">AR Metrics</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Live accounts receivable data
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Note size={16} color="#0D9488" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm group-hover:text-[#14462a]">Invoice Table</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Recent invoices with filters
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[rgba(20,70,42,0.06)] group transition-all">
                <Sms size={16} color="#F59E0B" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm group-hover:text-[#14462a]">Payment Summary</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Payment method breakdown
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Paperclip size={16} color="#2D2D2D" variant="Linear" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Sms size={16} color="#2D2D2D" variant="Linear" />
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="mb-6">
        <Textarea
          placeholder="Start writing your note... You can add rich text formatting, tables, and live data blocks from the toolbar above."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] border-0 px-0 resize-none text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ color: "#2D2D2D" }}
        />
      </div>

      {/* Helper Text */}
      <div
        className="text-sm text-center py-8"
        style={{ color: "#B0B3B8" }}
      >
        💡 Tip: Use the "Insert Block" button to add live financial data to your note
      </div>
    </div>
  );
}
