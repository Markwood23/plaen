"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  MoreVerticalIcon,
  Download01Icon,
  Share08Icon,
  PinIcon,
  ArchiveIcon,
  Delete02Icon,
  Add01Icon,
  TextIcon,
  TextFontIcon,
  ListViewIcon,
  TextNumberSignIcon,
  Link01Icon,
  Image01Icon,
  CodeIcon,
  Table01Icon,
  ChartHistogramIcon,
  FileValidationIcon,
  Invoice01Icon,
  AtIcon,
  Attachment02Icon,
  CheckmarkSquare02Icon,
  Cancel01Icon,
} from "hugeicons-react";
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
          <Link href="/notes">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
            >
              <ArrowLeft01Icon size={16} />
            </Button>
          </Link>
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
                <MoreVerticalIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <PinIcon size={16} className="mr-2" />
                <span>Pin Note</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Share08Icon size={16} className="mr-2" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Download01Icon size={16} className="mr-2" />
                <span>Export PDF</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <ArchiveIcon size={16} className="mr-2" />
                <span>Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer text-red-600">
                <Delete02Icon size={16} className="mr-2" />
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
              <Cancel01Icon size={12} />
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
              <CheckmarkSquare02Icon size={14} style={{ color: "#059669" }} />
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
              <Cancel01Icon size={14} style={{ color: "#B0B3B8" }} />
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
            <Add01Icon size={12} />
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
            <TextIcon size={16} strokeWidth={3} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <TextFontIcon size={16} style={{ fontStyle: 'italic' }} />
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
            <ListViewIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <TextNumberSignIcon size={16} />
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
            <Link01Icon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Image01Icon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <CodeIcon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <Table01Icon size={16} />
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
                <Add01Icon size={16} className="mr-1.5" />
                Insert Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64">
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <ChartHistogramIcon size={16} className="mr-2" style={{ color: "#14462a" }} />
                <div>
                  <div className="font-medium text-sm">AR Metrics</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Live accounts receivable data
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <FileValidationIcon size={16} className="mr-2" style={{ color: "#059669" }} />
                <div>
                  <div className="font-medium text-sm">Invoice Table</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>
                    Recent invoices with filters
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer">
                <Invoice01Icon size={16} className="mr-2" style={{ color: "#F59E0B" }} />
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
            <Attachment02Icon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
          >
            <AtIcon size={16} />
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
