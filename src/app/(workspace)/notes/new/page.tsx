"use client";

import { useState } from "react";
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
  DocumentText,
  Sms,
  TickSquare,
  CloseSquare,
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

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, you'd save to backend and redirect
      router.push("/notes");
    }, 1000);
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
              New Note
            </h1>
            <p className="text-xs" style={{ color: "#B0B3B8" }}>
              Not saved yet
            </p>
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
                className="h-9 w-9 p-0 rounded-full"
              >
                <More size={16} color="#B0B3B8" variant="Linear" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Paperclip size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                <span>Pin Note</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Share size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <DocumentDownload size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                <span>Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Archive size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                <span>Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600">
                <Trash size={16} color="#DC2626" variant="Linear" className="mr-2" />
                <span>Delete</span>
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
              <CloseSquare size={12} color="#14462a" variant="Linear" />
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
              <TickSquare size={14} color="#059669" variant="Linear" />
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
              <CloseSquare size={14} color="#B0B3B8" variant="Linear" />
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
                className="h-8 px-3 rounded-full hover:bg-white text-xs font-medium"
                style={{ color: "#14462a" }}
              >
                <Add size={16} color="#14462a" variant="Linear" className="mr-1.5" />
                Insert Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Chart size={16} color="#14462a" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm">AR Metrics</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Live accounts receivable data
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <DocumentText size={16} color="#059669" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm">Invoice Table</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Recent invoices with filters
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Sms size={16} color="#F59E0B" variant="Linear" className="mr-2" />
                <div>
                  <div className="font-medium text-sm">Payment Summary</div>
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
