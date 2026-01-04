"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  TextBold,
  TextItalic,
  TextUnderline,
  Code1,
  Link2,
  Hashtag,
  TextalignLeft,
  TextalignCenter,
  Add,
  TickSquare,
  Minus,
  CloseCircle,
  Text,
  QuoteUp,
  Receipt21,
  Chart,
  Wallet2,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmbedPicker,
  InvoiceSelector,
  InvoiceBlock,
  MetricBlock,
  ChartBlock,
  type EmbeddedBlock,
  type InvoiceBlockData,
  type MetricBlockData,
  type ChartBlockData,
} from "./embedded-blocks";

interface NoteEditorProps {
  content: string;
  onChange: (html: string, text: string) => void;
  onEmbeddedBlocksChange?: (blocks: EmbeddedBlock[]) => void;
  initialEmbeddedBlocks?: EmbeddedBlock[];
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function NoteEditor({
  content,
  onChange,
  onEmbeddedBlocksChange,
  initialEmbeddedBlocks = [],
  placeholder = "Start writing your note...",
  editable = true,
  className = "",
}: NoteEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  // Embedded blocks state
  const [embeddedBlocks, setEmbeddedBlocks] = useState<EmbeddedBlock[]>(initialEmbeddedBlocks);
  const [showEmbedPicker, setShowEmbedPicker] = useState(false);
  const [showInvoiceSelector, setShowInvoiceSelector] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder + " Type / for commands...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#14462a] underline cursor-pointer hover:opacity-80",
        },
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: "bg-yellow-200 rounded px-0.5",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onChange(html, text);
      
      // Check for slash command
      const { selection } = editor.state;
      const currentNode = selection.$anchor.parent;
      const nodeText = currentNode.textContent;
      
      if (nodeText.endsWith('/')) {
        // Show slash menu
        const coords = editor.view.coordsAtPos(selection.anchor);
        setSlashMenuPosition({ top: coords.bottom + 8, left: coords.left });
        setShowSlashMenu(true);
      } else {
        setShowSlashMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] px-0",
      },
      handleKeyDown: (view, event) => {
        // Close slash menu on escape
        if (event.key === 'Escape' && showSlashMenu) {
          setShowSlashMenu(false);
          return true;
        }
        return false;
      },
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  
  // Notify parent of embedded blocks changes
  useEffect(() => {
    onEmbeddedBlocksChange?.(embeddedBlocks);
  }, [embeddedBlocks, onEmbeddedBlocksChange]);
  
  // Handle slash menu item selection
  const handleSlashCommand = useCallback((command: string) => {
    if (!editor) return;
    
    // Remove the slash character
    editor.commands.deleteRange({
      from: editor.state.selection.anchor - 1,
      to: editor.state.selection.anchor,
    });
    
    setShowSlashMenu(false);
    
    switch (command) {
      case 'invoice':
        setShowInvoiceSelector(true);
        break;
      case 'metric':
        insertMetric('total_revenue');
        break;
      case 'chart':
        insertChart('revenue_trend');
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'task':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
    }
  }, [editor]);
  
  // Add invoice block
  const addInvoiceBlock = useCallback((invoice: InvoiceBlockData) => {
    const newBlock: EmbeddedBlock = {
      id: `invoice-${Date.now()}`,
      type: 'invoice',
      data: invoice as unknown as Record<string, unknown>,
      createdAt: new Date().toISOString(),
    };
    setEmbeddedBlocks(prev => [...prev, newBlock]);
    
    // Insert placeholder in editor
    if (editor) {
      editor.chain().focus().insertContent(`<p data-embed-id="${newBlock.id}">[Invoice: ${invoice.invoiceNumber}]</p>`).run();
    }
  }, [editor]);
  
  // Insert metric block
  const insertMetric = useCallback(async (metricType: string) => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        let value = 0;
        let change: number | undefined;
        
        switch (metricType) {
          case 'total_revenue':
            value = data.totalRevenue || 0;
            change = data.revenueChange;
            break;
          case 'outstanding':
            value = data.totalOutstanding || 0;
            change = data.outstandingChange;
            break;
          case 'paid_invoices':
            value = data.paidInvoices || 0;
            break;
          case 'overdue_count':
            value = data.overdueInvoices || 0;
            break;
        }
        
        const metricData: MetricBlockData = {
          metricType: metricType as MetricBlockData['metricType'],
          value,
          change,
          period: 'Current',
        };
        
        const newBlock: EmbeddedBlock = {
          id: `metric-${Date.now()}`,
          type: 'metric',
          data: metricData as unknown as Record<string, unknown>,
          createdAt: new Date().toISOString(),
        };
        setEmbeddedBlocks(prev => [...prev, newBlock]);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);
  
  // Insert chart block
  const insertChart = useCallback(async (chartType: string) => {
    try {
      const res = await fetch('/api/dashboard/chart-data');
      if (res.ok) {
        const data = await res.json();
        
        const chartData: ChartBlockData = {
          chartType: chartType as ChartBlockData['chartType'],
          title: chartType === 'revenue_trend' ? 'Revenue Trend' : 'Invoice Status',
          data: data.monthlyRevenue || [
            { label: 'Jan', value: 0 },
            { label: 'Feb', value: 0 },
            { label: 'Mar', value: 0 },
          ],
        };
        
        const newBlock: EmbeddedBlock = {
          id: `chart-${Date.now()}`,
          type: 'chart',
          data: chartData as unknown as Record<string, unknown>,
          createdAt: new Date().toISOString(),
        };
        setEmbeddedBlocks(prev => [...prev, newBlock]);
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    }
  }, []);
  
  // Remove embedded block
  const removeBlock = useCallback((blockId: string) => {
    setEmbeddedBlocks(prev => prev.filter(b => b.id !== blockId));
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className={`note-editor ${className}`}>
      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div
          ref={slashMenuRef}
          className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-64"
          style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
        >
          <div className="px-3 py-1 text-xs font-medium text-[#B0B3B8]">INSERT</div>
          <button
            onClick={() => handleSlashCommand('invoice')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Receipt21 size={16} color="#14462a" />
            <span className="text-sm">Invoice</span>
          </button>
          <button
            onClick={() => handleSlashCommand('metric')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Wallet2 size={16} color="#14462a" />
            <span className="text-sm">Metric</span>
          </button>
          <button
            onClick={() => handleSlashCommand('chart')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Chart size={16} color="#14462a" />
            <span className="text-sm">Chart</span>
          </button>
          <div className="border-t border-gray-100 my-1" />
          <div className="px-3 py-1 text-xs font-medium text-[#B0B3B8]">FORMAT</div>
          <button
            onClick={() => handleSlashCommand('h1')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Text size={16} color="#2D2D2D" />
            <span className="text-sm">Heading 1</span>
          </button>
          <button
            onClick={() => handleSlashCommand('h2')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Text size={16} color="#6B7280" />
            <span className="text-sm">Heading 2</span>
          </button>
          <button
            onClick={() => handleSlashCommand('bullet')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <TextalignLeft size={16} color="#2D2D2D" />
            <span className="text-sm">Bullet List</span>
          </button>
          <button
            onClick={() => handleSlashCommand('task')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <TickSquare size={16} color="#2D2D2D" />
            <span className="text-sm">Task List</span>
          </button>
          <button
            onClick={() => handleSlashCommand('quote')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <QuoteUp size={16} color="#2D2D2D" />
            <span className="text-sm">Quote</span>
          </button>
          <button
            onClick={() => handleSlashCommand('divider')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(20,70,42,0.04)] text-left"
          >
            <Minus size={16} color="#2D2D2D" />
            <span className="text-sm">Divider</span>
          </button>
        </div>
      )}

      {/* Embed Picker Modal */}
      <EmbedPicker
        isOpen={showEmbedPicker}
        onClose={() => setShowEmbedPicker(false)}
        onSelect={(type, subType) => {
          setShowEmbedPicker(false);
          if (type === 'invoice') {
            setShowInvoiceSelector(true);
          } else if (type === 'metric') {
            insertMetric(subType || 'total_revenue');
          } else if (type === 'chart') {
            insertChart(subType || 'revenue_trend');
          }
        }}
      />

      {/* Invoice Selector Modal */}
      <InvoiceSelector
        isOpen={showInvoiceSelector}
        onClose={() => setShowInvoiceSelector(false)}
        onSelect={addInvoiceBlock}
      />

      {/* Link Input Modal */}
      {showLinkInput && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Link</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
              >
                <CloseCircle size={20} color="#B0B3B8" />
              </Button>
            </div>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14462a]/20 focus:border-[#14462a]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLink();
                }
              }}
            />
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-[#14462a] hover:bg-[#0d3520]"
                onClick={setLink}
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 p-2 mb-4 rounded-full bg-[#F7F9FA] overflow-x-auto">
          {/* Text Formatting */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
                editor.isActive("bold") ? "bg-white text-[#14462a]" : ""
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
            >
              <TextBold size={16} color={editor.isActive("bold") ? "#14462a" : "#2D2D2D"} variant={editor.isActive("bold") ? "Bold" : "Linear"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
                editor.isActive("italic") ? "bg-white text-[#14462a]" : ""
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
            >
              <TextItalic size={16} color={editor.isActive("italic") ? "#14462a" : "#2D2D2D"} variant={editor.isActive("italic") ? "Bold" : "Linear"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
                editor.isActive("underline") ? "bg-white text-[#14462a]" : ""
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"
            >
              <TextUnderline size={16} color={editor.isActive("underline") ? "#14462a" : "#2D2D2D"} variant={editor.isActive("underline") ? "Bold" : "Linear"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
                editor.isActive("strike") ? "bg-white text-[#14462a]" : ""
              }`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Minus size={16} color={editor.isActive("strike") ? "#14462a" : "#2D2D2D"} />
            </Button>
          </div>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Headings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full hover:bg-white text-xs font-medium gap-1"
              >
                <Text size={14} color="#2D2D2D" />
                Text
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="rounded-xl p-1.5 min-w-[160px]"
            >
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`rounded-lg cursor-pointer ${
                  editor.isActive("heading", { level: 1 }) ? "bg-[#14462a]/10" : ""
                }`}
              >
                <span className="text-xl font-bold">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`rounded-lg cursor-pointer ${
                  editor.isActive("heading", { level: 2 }) ? "bg-[#14462a]/10" : ""
                }`}
              >
                <span className="text-lg font-semibold">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`rounded-lg cursor-pointer ${
                  editor.isActive("heading", { level: 3 }) ? "bg-[#14462a]/10" : ""
                }`}
              >
                <span className="text-base font-medium">Heading 3</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`rounded-lg cursor-pointer ${
                  editor.isActive("paragraph") ? "bg-[#14462a]/10" : ""
                }`}
              >
                <span>Paragraph</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("bulletList") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <TextalignLeft size={16} color={editor.isActive("bulletList") ? "#14462a" : "#2D2D2D"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("orderedList") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <TextalignCenter size={16} color={editor.isActive("orderedList") ? "#14462a" : "#2D2D2D"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("taskList") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            title="Todo List"
          >
            <TickSquare size={16} color={editor.isActive("taskList") ? "#14462a" : "#2D2D2D"} />
          </Button>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Blocks */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("blockquote") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <QuoteUp size={16} color={editor.isActive("blockquote") ? "#14462a" : "#2D2D2D"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("codeBlock") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code1 size={16} color={editor.isActive("codeBlock") ? "#14462a" : "#2D2D2D"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("highlight") ? "bg-yellow-100 text-yellow-700" : ""
            }`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight"
          >
            <Hashtag size={16} color={editor.isActive("highlight") ? "#a16207" : "#2D2D2D"} />
          </Button>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Link */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full hover:bg-white ${
              editor.isActive("link") ? "bg-white text-[#14462a]" : ""
            }`}
            onClick={() => setShowLinkInput(true)}
            title="Add Link"
          >
            <Link2 size={16} color={editor.isActive("link") ? "#14462a" : "#2D2D2D"} />
          </Button>

          {/* Horizontal rule */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-white"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus size={16} color="#2D2D2D" />
          </Button>

          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Insert Embeds */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full hover:bg-white text-xs font-medium gap-1 bg-[rgba(20,70,42,0.08)]"
              >
                <Add size={14} color="#14462a" />
                Insert
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl p-1.5 min-w-[180px]"
            >
              <DropdownMenuItem
                onClick={() => setShowInvoiceSelector(true)}
                className="rounded-lg cursor-pointer gap-2"
              >
                <Receipt21 size={16} color="#14462a" />
                <span>Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => insertMetric('total_revenue')}
                className="rounded-lg cursor-pointer gap-2"
              >
                <Wallet2 size={16} color="#14462a" />
                <span>Revenue Metric</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => insertMetric('outstanding')}
                className="rounded-lg cursor-pointer gap-2"
              >
                <Wallet2 size={16} color="#F59E0B" />
                <span>Outstanding Metric</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => insertChart('revenue_trend')}
                className="rounded-lg cursor-pointer gap-2"
              >
                <Chart size={16} color="#14462a" />
                <span>Revenue Chart</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Embedded Blocks - Rendered inline */}
      {embeddedBlocks.length > 0 && (
        <div className="embedded-blocks-container my-4 space-y-2">
          {embeddedBlocks.map((block) => {
            if (block.type === 'invoice') {
              return (
                <InvoiceBlock
                  key={block.id}
                  data={block.data as unknown as InvoiceBlockData}
                  onRemove={() => removeBlock(block.id)}
                  editable={editable}
                />
              );
            }
            if (block.type === 'metric') {
              return (
                <MetricBlock
                  key={block.id}
                  data={block.data as unknown as MetricBlockData}
                  onRemove={() => removeBlock(block.id)}
                  editable={editable}
                />
              );
            }
            if (block.type === 'chart') {
              return (
                <ChartBlock
                  key={block.id}
                  data={block.data as unknown as ChartBlockData}
                  onRemove={() => removeBlock(block.id)}
                  editable={editable}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Editor Content */}
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2D2D2D;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #2D2D2D;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #2D2D2D;
        }
        
        .ProseMirror p {
          margin-bottom: 0.75rem;
          line-height: 1.7;
          color: #4A4A4A;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        
        .ProseMirror blockquote {
          border-left: 3px solid #14462a;
          padding-left: 1rem;
          margin-left: 0;
          color: #6B7280;
          font-style: italic;
        }
        
        .ProseMirror pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
        }
        
        .ProseMirror code {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: "JetBrains Mono", monospace;
        }
        
        .ProseMirror pre code {
          background: none;
          padding: 0;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #E4E6EB;
          margin: 1.5rem 0;
        }
        
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .ProseMirror ul[data-type="taskList"] li > label {
          margin-top: 0.25rem;
        }
        
        .ProseMirror ul[data-type="taskList"] li > label input {
          cursor: pointer;
          width: 1rem;
          height: 1rem;
          accent-color: #14462a;
        }
        
        .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div > p {
          text-decoration: line-through;
          color: #9CA3AF;
        }
        
        .ProseMirror mark {
          background-color: #FEF08A;
          border-radius: 0.125rem;
          padding: 0 0.125rem;
        }
        
        .ProseMirror a {
          color: #14462a;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .ProseMirror a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
