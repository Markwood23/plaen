"use client";

import { useState, useRef } from "react";
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
  Analytics01Icon,
  Calendar03Icon,
  DollarCircleIcon,
  PencilEdit02Icon,
  PrinterIcon,
  Clock01Icon,
  CreditCardIcon,
  UserMultiple02Icon,
  AlertCircleIcon,
  PieChartIcon,
  Wallet01Icon,
  PaintBrush01Icon,
  TextUnderlineIcon,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockInvoiceData = [
  { id: "INV-001", client: "TechCorp Ghana", amount: "$12,500.00", status: "Paid", dueDate: "2024-11-15" },
  { id: "INV-002", client: "StartupXYZ", amount: "$8,200.00", status: "Overdue", dueDate: "2024-10-30" },
  { id: "INV-003", client: "ConsultCo", amount: "$15,000.00", status: "Pending", dueDate: "2024-11-25" },
];

const mockARMetrics = {
  totalOutstanding: "$45,200.00",
  overdue: "$18,700.00",
  dso: 42,
  onTimeRate: "76%",
};

const mockPaymentMethods = [
  { method: "MTN MoMo", count: 42, amount: "$28,450.00", percentage: 62 },
  { method: "Bank Transfer", count: 18, amount: "$15,230.00", percentage: 26 },
  { method: "Cash", count: 8, amount: "$5,420.00", percentage: 12 },
];

const mockClientList = [
  { name: "TechCorp Ghana", outstanding: "$12,500.00", invoices: 3, status: "Good" },
  { name: "StartupXYZ", outstanding: "$8,200.00", invoices: 2, status: "Attention" },
  { name: "ConsultCo", outstanding: "$15,000.00", invoices: 4, status: "Good" },
  { name: "AgencyPlus", outstanding: "$9,500.00", invoices: 2, status: "Overdue" },
];

const mockExpenses = [
  { category: "Software & Tools", amount: "$2,450.00", percentage: 35 },
  { category: "Equipment", amount: "$1,800.00", percentage: 26 },
  { category: "Marketing", amount: "$1,200.00", percentage: 17 },
  { category: "Other", amount: "$1,550.00", percentage: 22 },
];

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState("Q4 2024 AR Review");
  const [tags, setTags] = useState(["monthly-review", "ar", "q4-2024"]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    blockId: string;
  } | null>(null);
  
  const [styleMenu, setStyleMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    blockId: string;
  } | null>(null);
  
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Content blocks instead of single content string
  const [blocks, setBlocks] = useState<Array<{
    id: string;
    type: 'text' | 'invoice-table' | 'ar-metrics' | 'payment-methods' | 'client-list' | 'expenses';
    content?: string;
    style?: {
      backgroundColor?: string;
      borderLeft?: string;
      borderColor?: string;
    };
  }>>([
    { id: '1', type: 'text', content: 'This quarter has shown significant improvements in our accounts receivable management. We\'ve implemented several new strategies that have positively impacted our collection efficiency.\n\n## Key Highlights\n\n- Reduced DSO (Days Sales Outstanding) from 52 to 42 days\n- Improved on-time payment rate to 76%\n- Successfully collected $28,500 in overdue invoices\n\n## Analysis\n\nThe implementation of automated payment reminders has been particularly effective. We\'re seeing a 23% increase in on-time payments compared to Q3 2024.\n\n### Outstanding Invoices\n\nBelow is a summary of our current outstanding invoices:' },
    { id: '2', type: 'invoice-table' },
    { id: '3', type: 'ar-metrics' },
  ]);

  const [showInvoiceTable, setShowInvoiceTable] = useState(true);
  const [showARMetrics, setShowARMetrics] = useState(true);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [content, setContent] = useState(`This quarter has shown significant improvements in our accounts receivable management. We've implemented several new strategies that have positively impacted our collection efficiency.

## Key Highlights

- Reduced DSO (Days Sales Outstanding) from 52 to 42 days
- Improved on-time payment rate to 76%
- Successfully collected $28,500 in overdue invoices

## Analysis

The implementation of automated payment reminders has been particularly effective. We're seeing a 23% increase in on-time payments compared to Q3 2024.

### Outstanding Invoices

Below is a summary of our current outstanding invoices:`);

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
    setIsEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Close context menu when clicking outside
  const handleClickOutside = () => {
    setContextMenu(null);
    setStyleMenu(null);
  };

  // Add widget at cursor position in text block
  const addWidgetAtCursor = (blockId: string, widgetType: 'invoice-table' | 'ar-metrics' | 'payment-methods' | 'client-list' | 'expenses') => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'text') return;

    const content = block.content || '';
    const beforeCursor = content.substring(0, cursorPosition);
    const afterCursor = content.substring(cursorPosition);

    // Create new blocks: text before cursor, widget, text after cursor
    const newBlocks = [...blocks];
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    const updatedBlocks = [
      { ...block, content: beforeCursor },
      { id: Date.now().toString(), type: widgetType as any },
      { id: (Date.now() + 1).toString(), type: 'text' as const, content: afterCursor },
    ];

    newBlocks.splice(blockIndex, 1, ...updatedBlocks);
    setBlocks(newBlocks);
    setContextMenu(null);
  };

  const addBlock = (afterBlockId: string, type: 'text' | 'invoice-table' | 'ar-metrics' | 'payment-methods' | 'client-list' | 'expenses') => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '' : undefined,
    };
    
    const index = blocks.findIndex(b => b.id === afterBlockId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, content } : b));
  };

  const updateBlockStyle = (blockId: string, style: { backgroundColor?: string; borderLeft?: string; borderColor?: string }) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, style: { ...b.style, ...style } } : b));
    setStyleMenu(null);
  };

  const applyStylePreset = (blockId: string, preset: 'default' | 'info' | 'success' | 'warning' | 'error') => {
    const presets = {
      default: {},
      info: { backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #1877F2' },
      success: { backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #059669' },
      warning: { backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #F59E0B' },
      error: { backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #EF4444' },
    };
    updateBlockStyle(blockId, presets[preset]);
  };

  // Parse markdown inline formatting
  const parseMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Pattern for bold (**text**), italic (*text*), code (`text`), underline (<u>text</u>), and links ([text](url))
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(<u>(.+?)<\/u>)|(\[(.+?)\]\((.+?)\))/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // Bold
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else if (match[3]) {
        // Italic
        parts.push(<em key={match.index}>{match[4]}</em>);
      } else if (match[5]) {
        // Code
        parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded text-sm" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>{match[6]}</code>);
      } else if (match[7]) {
        // Underline
        parts.push(<u key={match.index}>{match[8]}</u>);
      } else if (match[9]) {
        // Link
        parts.push(<a key={match.index} href={match[11]} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{match[10]}</a>);
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Text formatting functions
  const applyTextFormat = (blockId: string, format: 'bold' | 'italic' | 'underline' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol') => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'text') return;

    const content = block.content || '';
    const selectedText = content.substring(start, end);
    
    if (!selectedText) return; // No text selected

    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        const ulLines = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        formattedText = ulLines;
        break;
      case 'ol':
        const olLines = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        formattedText = olLines;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    updateBlockContent(blockId, newContent);

    // Restore focus and adjust selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = (blockId: string) => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'text') return;

    const content = block.content || '';
    const selectedText = content.substring(start, end);
    
    const url = prompt('Enter URL:');
    if (!url) return;

    const linkText = selectedText || 'link text';
    const formattedText = `[${linkText}](${url})`;

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    updateBlockContent(blockId, newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderWidget = (blockType: string, showRemoveButton = false, onRemove?: () => void) => {
    const widgetWrapper = (title: string, icon: React.ReactNode, color: string, content: React.ReactNode) => (
      <div className="relative group">
        {showRemoveButton && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-sm font-semibold" style={{ color: "#2D2D2D" }}>{title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              <Cancel01Icon size={16} style={{ color: "#B0B3B8" }} />
            </Button>
          </div>
        )}
        {content}
      </div>
    );

    switch (blockType) {
      case 'invoice-table':
        return widgetWrapper(
          "Invoice Table Widget",
          <FileValidationIcon size={16} style={{ color: "#059669" }} />,
          "#059669",
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "#E4E6EB" }}>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Invoice ID</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Client</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Amount</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Due Date</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoiceData.map((invoice) => (
                  <TableRow key={invoice.id} style={{ borderColor: "#E4E6EB" }}>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{invoice.id}</TableCell>
                    <TableCell style={{ color: "#2D2D2D" }}>{invoice.client}</TableCell>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{invoice.amount}</TableCell>
                    <TableCell className="text-[#65676B]">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="rounded-full gap-1" 
                        style={{ 
                          backgroundColor: invoice.status === "Paid" ? "#1877F2" : invoice.status === "Overdue" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)", 
                          color: invoice.status === "Paid" ? "white" : invoice.status === "Overdue" ? "#EF4444" : "#F59E0B",
                          borderColor: invoice.status === "Paid" ? "#1877F2" : "transparent"
                        }}
                      >
                        {invoice.status === "Paid" && <CheckmarkSquare02Icon size={14} />}
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'ar-metrics':
        return widgetWrapper(
          "AR Metrics Widget",
          <ChartHistogramIcon size={16} style={{ color: "#1877F2" }} />,
          "#1877F2",
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Outstanding", value: mockARMetrics.totalOutstanding, icon: DollarCircleIcon, color: "#1877F2", bg: "rgba(24, 119, 242, 0.04)" },
              { label: "Overdue Amount", value: mockARMetrics.overdue, icon: Analytics01Icon, color: "#EF4444", bg: "rgba(239, 68, 68, 0.04)" },
              { label: "DSO", value: `${mockARMetrics.dso} days`, icon: Calendar03Icon, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.04)" },
              { label: "On-Time Rate", value: mockARMetrics.onTimeRate, icon: CheckmarkSquare02Icon, color: "#059669", bg: "rgba(5, 150, 105, 0.04)" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label} 
                  className="rounded-2xl p-5 transition-all hover:shadow-sm" 
                  style={{ 
                    backgroundColor: metric.bg,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <Icon size={20} style={{ color: metric.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: metric.color }}>{metric.value}</div>
                  <div className="text-sm font-medium" style={{ color: "#B0B3B8" }}>{metric.label}</div>
                </div>
              );
            })}
          </div>
        );

      case 'payment-methods':
        return widgetWrapper(
          "Payment Methods Widget",
          <CreditCardIcon size={16} style={{ color: "#7C3AED" }} />,
          "#7C3AED",
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "#E4E6EB" }}>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Payment Method</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Transactions</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Total Amount</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaymentMethods.map((payment) => (
                  <TableRow key={payment.method} style={{ borderColor: "#E4E6EB" }}>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{payment.method}</TableCell>
                    <TableCell className="text-[#65676B]">{payment.count}</TableCell>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{payment.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "#F0F2F5" }}>
                          <div className="h-2 rounded-full" style={{ width: `${payment.percentage}%`, backgroundColor: "#7C3AED" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#2D2D2D" }}>{payment.percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'client-list':
        return widgetWrapper(
          "Client Overview Widget",
          <UserMultiple02Icon size={16} style={{ color: "#F59E0B" }} />,
          "#F59E0B",
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "#E4E6EB" }}>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Client Name</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Outstanding</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Invoices</TableHead>
                  <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClientList.map((client) => (
                  <TableRow key={client.name} style={{ borderColor: "#E4E6EB" }}>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{client.name}</TableCell>
                    <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{client.outstanding}</TableCell>
                    <TableCell className="text-[#65676B]">{client.invoices}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="rounded-full" 
                        style={{ 
                          backgroundColor: client.status === "Good" ? "rgba(5, 150, 105, 0.08)" : client.status === "Attention" ? "rgba(245, 158, 11, 0.08)" : "rgba(239, 68, 68, 0.08)", 
                          color: client.status === "Good" ? "#059669" : client.status === "Attention" ? "#F59E0B" : "#EF4444"
                        }}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      case 'expenses':
        return widgetWrapper(
          "Expense Breakdown Widget",
          <Wallet01Icon size={16} style={{ color: "#EF4444" }} />,
          "#EF4444",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockExpenses.map((expense) => (
              <div 
                key={expense.category}
                className="rounded-2xl p-5" 
                style={{ 
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  border: "1px solid #E4E6EB"
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold" style={{ color: "#2D2D2D" }}>{expense.category}</div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#EF4444" }}>
                    {expense.percentage}%
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: "#2D2D2D" }}>{expense.amount}</div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "#F0F2F5" }}>
                  <div className="h-2 rounded-full" style={{ width: `${expense.percentage}%`, backgroundColor: "#EF4444" }} />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Preview Mode
  if (!isEditMode) {
    return (
      <div className="min-h-screen bg-white">
        {/* Action Bar */}
        <div className="print:hidden" style={{ borderBottom: "1px solid #E4E6EB" }}>
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/notes">
                <Button variant="ghost" size="sm" className="gap-2 -ml-2 rounded-full hover:bg-[rgba(240,242,245,0.5)]">
                  <ArrowLeft01Icon size={16} />
                  Back
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setIsEditMode(true)}>
                  <PencilEdit02Icon size={16} />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handlePrint}>
                  <PrinterIcon size={16} />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <Download01Icon size={16} />
                  Export PDF
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
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
          </div>
        </div>

        {/* PDF Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 print:py-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 print:text-5xl" style={{ color: "#2D2D2D" }}>
              {title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4 print:hidden">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "rgba(24, 119, 242, 0.08)", color: "#1877F2" }}>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm" style={{ color: "#B0B3B8" }}>
              <div className="flex items-center gap-1.5">
                <Clock01Icon size={16} />
                <span>Updated 2 hours ago</span>
              </div>
              <span>•</span>
              <span>1,247 words</span>
            </div>
          </div>

          <div className="h-px mb-8" style={{ backgroundColor: "#E4E6EB" }} />

          <div className="prose prose-lg max-w-none">
            {/* Render Blocks */}
            {blocks.map((block) => {
              if (block.type === 'text') {
                return (
                  <div 
                    key={block.id} 
                    className="p-6 rounded-lg mb-4"
                    style={{ 
                      color: "#2D2D2D", 
                      lineHeight: "1.8",
                      ...block.style
                    }}
                  >
                    {block.content?.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("# ")) {
                        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4" style={{ color: "#2D2D2D" }}>{parseMarkdown(paragraph.replace("# ", ""))}</h1>;
                      } else if (paragraph.startsWith("## ")) {
                        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4" style={{ color: "#2D2D2D" }}>{parseMarkdown(paragraph.replace("## ", ""))}</h2>;
                      } else if (paragraph.startsWith("### ")) {
                        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3" style={{ color: "#2D2D2D" }}>{parseMarkdown(paragraph.replace("### ", ""))}</h3>;
                      } else if (paragraph.startsWith("- ")) {
                        const items = paragraph.split("\n");
                        return (
                          <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                            {items.map((item, i) => (<li key={i} style={{ color: "#2D2D2D" }}>{parseMarkdown(item.replace("- ", ""))}</li>))}
                          </ul>
                        );
                      } else if (/^\d+\.\s/.test(paragraph)) {
                        const items = paragraph.split("\n");
                        return (
                          <ol key={index} className="list-decimal pl-6 mb-4 space-y-2">
                            {items.map((item, i) => (<li key={i} style={{ color: "#2D2D2D" }}>{parseMarkdown(item.replace(/^\d+\.\s/, ""))}</li>))}
                          </ol>
                        );
                      } else {
                        return <p key={index} className="mb-4 text-base" style={{ color: "#2D2D2D" }}>{parseMarkdown(paragraph)}</p>;
                      }
                    })}
                  </div>
                );
              } else {
                return <div key={block.id} className="my-8">{renderWidget(block.type)}</div>;
              }
            })}
          </div>

          {/* Old rendering - Remove these */}
          {/* Invoice Table */}
          {false && showInvoiceTable && (
              <div className="my-8 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: "#E4E6EB" }}>
                      <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Invoice ID</TableHead>
                      <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Client</TableHead>
                      <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Amount</TableHead>
                      <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Due Date</TableHead>
                      <TableHead className="font-semibold" style={{ color: "#2D2D2D" }}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoiceData.map((invoice) => (
                      <TableRow key={invoice.id} style={{ borderColor: "#E4E6EB" }}>
                        <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{invoice.id}</TableCell>
                        <TableCell style={{ color: "#2D2D2D" }}>{invoice.client}</TableCell>
                        <TableCell className="font-medium" style={{ color: "#2D2D2D" }}>{invoice.amount}</TableCell>
                        <TableCell className="text-[#65676B]">{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className="rounded-full gap-1" 
                            style={{ 
                              backgroundColor: invoice.status === "Paid" ? "#1877F2" : invoice.status === "Overdue" ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)", 
                              color: invoice.status === "Paid" ? "white" : invoice.status === "Overdue" ? "#EF4444" : "#F59E0B",
                              borderColor: invoice.status === "Paid" ? "#1877F2" : "transparent"
                            }}
                          >
                            {invoice.status === "Paid" && <CheckmarkSquare02Icon size={14} />}
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid #E4E6EB" }}>
            <div className="text-sm" style={{ color: "#B0B3B8" }}>
              <div className="mb-2">Created on Nov 18, 2025</div>
              <div>Last edited 2 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full" onClick={() => setIsEditMode(false)}>
            <Cancel01Icon size={16} />
          </Button>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#2D2D2D" }}>Edit Note</h1>
            <p className="text-xs" style={{ color: "#B0B3B8" }}>Auto-saving changes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full h-9 px-4" style={{ borderColor: "#E4E6EB" }} onClick={() => setIsEditMode(false)}>
            Cancel
          </Button>
          <Button className="rounded-full h-9 px-4" style={{ backgroundColor: "#1877F2", color: "white" }} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

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

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs flex items-center gap-1.5" style={{ backgroundColor: "rgba(24, 119, 242, 0.08)", color: "#1877F2" }}>
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
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
              onKeyPress={(e) => { if (e.key === "Enter") handleAddTag(); }}
              className="h-7 w-32 text-xs rounded-full px-3"
              style={{ borderColor: "#E4E6EB" }}
              autoFocus
            />
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full" onClick={handleAddTag}>
              <CheckmarkSquare02Icon size={14} style={{ color: "#059669" }} />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full" onClick={() => { setIsAddingTag(false); setNewTag(""); }}>
              <Cancel01Icon size={14} style={{ color: "#B0B3B8" }} />
            </Button>
          </div>
        ) : (
          <button onClick={() => setIsAddingTag(true)} className="px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors" style={{ backgroundColor: "rgba(176, 179, 184, 0.08)", color: "#B0B3B8" }}>
            <Add01Icon size={12} />
            Add Tag
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 mb-4" style={{ backgroundColor: "white" }}>
        <div className="flex items-center gap-1 p-2 rounded-full" style={{ backgroundColor: "#F7F9FA" }}>
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'bold');
              }}
              disabled={!activeBlockId}
              title="Bold (Ctrl+B)"
            >
              <TextIcon size={16} strokeWidth={3} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'italic');
              }}
              disabled={!activeBlockId}
              title="Italic (Ctrl+I)"
            >
              <TextFontIcon size={16} style={{ fontStyle: 'italic' }} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'underline');
              }}
              disabled={!activeBlockId}
              title="Underline (Ctrl+U)"
            >
              <TextUnderlineIcon size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'code');
              }}
              disabled={!activeBlockId}
              title="Code"
            >
              <CodeIcon size={16} />
            </Button>
          </div>
          <div className="h-6 w-px mx-1" style={{ backgroundColor: "#E4E6EB" }} />
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'ul');
              }}
              disabled={!activeBlockId}
              title="Bullet List"
            >
              <ListViewIcon size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) applyTextFormat(activeBlockId, 'ol');
              }}
              disabled={!activeBlockId}
              title="Numbered List"
            >
              <TextNumberSignIcon size={16} />
            </Button>
          </div>
          <div className="h-6 w-px mx-1" style={{ backgroundColor: "#E4E6EB" }} />
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeBlockId) insertLink(activeBlockId);
              }}
              disabled={!activeBlockId}
              title="Insert Link"
            >
              <Link01Icon size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              disabled={true}
              title="Insert Image (Coming soon)"
            >
              <Image01Icon size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-white"
              disabled={true}
              title="Attach File (Coming soon)"
            >
              <Attachment02Icon size={16} />
            </Button>
          </div>
          <div className="h-6 w-px mx-1" style={{ backgroundColor: "#E4E6EB" }} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full h-8 px-3 hover:bg-white text-xs font-medium" style={{ color: "#1877F2" }}>
                <Add01Icon size={16} className="mr-1.5" />
                Insert Widget
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64">
              <DropdownMenuItem 
                className="rounded-xl px-3 py-2.5 cursor-pointer"
                onClick={() => setShowARMetrics(true)}
                disabled={showARMetrics}
              >
                <ChartHistogramIcon size={16} className="mr-2" style={{ color: "#1877F2" }} />
                <div>
                  <div className="font-medium text-sm">AR Metrics</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>Live accounts receivable data</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-xl px-3 py-2.5 cursor-pointer"
                onClick={() => setShowInvoiceTable(true)}
                disabled={showInvoiceTable}
              >
                <FileValidationIcon size={16} className="mr-2" style={{ color: "#059669" }} />
                <div>
                  <div className="font-medium text-sm">Invoice Table</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>Recent invoices overview</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-xl px-3 py-2.5 cursor-pointer"
                onClick={() => setShowPaymentMethods(true)}
                disabled={showPaymentMethods}
              >
                <CreditCardIcon size={16} className="mr-2" style={{ color: "#7C3AED" }} />
                <div>
                  <div className="font-medium text-sm">Payment Methods</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>Payment method breakdown</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-xl px-3 py-2.5 cursor-pointer"
                onClick={() => setShowClientList(true)}
                disabled={showClientList}
              >
                <UserMultiple02Icon size={16} className="mr-2" style={{ color: "#F59E0B" }} />
                <div>
                  <div className="font-medium text-sm">Client Overview</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>Top clients and status</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-xl px-3 py-2.5 cursor-pointer"
                onClick={() => setShowExpenses(true)}
                disabled={showExpenses}
              >
                <Wallet01Icon size={16} className="mr-2" style={{ color: "#EF4444" }} />
                <div>
                  <div className="font-medium text-sm">Expense Breakdown</div>
                  <div className="text-xs" style={{ color: "#B0B3B8" }}>Expense categories summary</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Render Blocks in Edit Mode */}
      <div className="space-y-4" onClick={handleClickOutside}>
        {blocks.map((block, blockIndex) => (
          <div key={block.id}>
            {block.type === 'text' ? (
              <div 
                className="relative group p-6 rounded-lg"
                style={block.style}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    blockId: block.id
                  });
                }}
              >
                <Textarea
                  ref={(el) => { textareaRefs.current[block.id] = el; }}
                  placeholder="Start writing your note... (Right-click to add widget or style block)"
                  value={block.content || ''}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  onFocus={() => {
                    if (blurTimeoutRef.current) {
                      clearTimeout(blurTimeoutRef.current);
                    }
                    setActiveBlockId(block.id);
                  }}
                  onBlur={() => {
                    // Delay clearing activeBlockId to allow toolbar buttons to work
                    blurTimeoutRef.current = setTimeout(() => {
                      setActiveBlockId(null);
                    }, 200);
                  }}
                  onKeyDown={(e) => {
                    // Keyboard shortcuts
                    if (e.ctrlKey || e.metaKey) {
                      if (e.key === 'b') {
                        e.preventDefault();
                        applyTextFormat(block.id, 'bold');
                      } else if (e.key === 'i') {
                        e.preventDefault();
                        applyTextFormat(block.id, 'italic');
                      } else if (e.key === 'u') {
                        e.preventDefault();
                        applyTextFormat(block.id, 'underline');
                      } else if (e.key === 'k') {
                        e.preventDefault();
                        insertLink(block.id);
                      }
                    }
                  }}
                  className="min-h-[200px] border-0 px-0 resize-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  style={{ color: "#2D2D2D" }}
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStyleMenu({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        blockId: block.id
                      });
                    }}
                  >
                    <PaintBrush01Icon size={16} style={{ color: "#B0B3B8" }} />
                  </Button>
                  {blocks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Cancel01Icon size={16} style={{ color: "#B0B3B8" }} />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                {renderWidget(block.type, true, () => removeBlock(block.id))}
              </div>
            )}

            {/* Insert Widget Button */}
            <div className="flex items-center gap-2 py-2 group">
              <div className="flex-1 h-px" style={{ backgroundColor: "#E4E6EB" }} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    style={{ color: "#B0B3B8" }}
                  >
                    <Add01Icon size={14} className="mr-1" />
                    Insert Widget
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="rounded-2xl p-2 w-56">
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'text')}
                  >
                    <FileValidationIcon size={16} className="mr-2" style={{ color: "#2D2D2D" }} />
                    Text Block
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'ar-metrics')}
                  >
                    <ChartHistogramIcon size={16} className="mr-2" style={{ color: "#1877F2" }} />
                    AR Metrics
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'invoice-table')}
                  >
                    <FileValidationIcon size={16} className="mr-2" style={{ color: "#059669" }} />
                    Invoice Table
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'payment-methods')}
                  >
                    <CreditCardIcon size={16} className="mr-2" style={{ color: "#7C3AED" }} />
                    Payment Methods
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'client-list')}
                  >
                    <UserMultiple02Icon size={16} className="mr-2" style={{ color: "#F59E0B" }} />
                    Client Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 cursor-pointer text-sm"
                    onClick={() => addBlock(block.id, 'expenses')}
                  >
                    <Wallet01Icon size={16} className="mr-2" style={{ color: "#EF4444" }} />
                    Expense Breakdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex-1 h-px" style={{ backgroundColor: "#E4E6EB" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Context Menu for Adding Widgets */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-lg border p-2"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            borderColor: "#E4E6EB",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-semibold px-3 py-2" style={{ color: "#B0B3B8" }}>
            INSERT WIDGET AT CURSOR
          </div>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => addWidgetAtCursor(contextMenu.blockId, 'ar-metrics')}
          >
            <ChartHistogramIcon size={16} style={{ color: "#1877F2" }} />
            AR Metrics
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => addWidgetAtCursor(contextMenu.blockId, 'invoice-table')}
          >
            <FileValidationIcon size={16} style={{ color: "#059669" }} />
            Invoice Table
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => addWidgetAtCursor(contextMenu.blockId, 'payment-methods')}
          >
            <CreditCardIcon size={16} style={{ color: "#7C3AED" }} />
            Payment Methods
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => addWidgetAtCursor(contextMenu.blockId, 'client-list')}
          >
            <UserMultiple02Icon size={16} style={{ color: "#F59E0B" }} />
            Client Overview
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => addWidgetAtCursor(contextMenu.blockId, 'expenses')}
          >
            <Wallet01Icon size={16} style={{ color: "#EF4444" }} />
            Expense Breakdown
          </button>
        </div>
      )}

      {/* Style Menu for Block Styling */}
      {styleMenu && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-lg border p-2"
          style={{
            left: styleMenu.x,
            top: styleMenu.y,
            borderColor: "#E4E6EB",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-semibold px-3 py-2" style={{ color: "#B0B3B8" }}>
            BLOCK STYLE
          </div>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => applyStylePreset(styleMenu.blockId, 'default')}
          >
            <div className="h-4 w-4 rounded border" style={{ borderColor: "#E4E6EB" }} />
            Default
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => applyStylePreset(styleMenu.blockId, 'info')}
          >
            <div className="h-4 w-4 rounded" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #1877F2' }} />
            Info (Blue)
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => applyStylePreset(styleMenu.blockId, 'success')}
          >
            <div className="h-4 w-4 rounded" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #059669' }} />
            Success (Green)
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => applyStylePreset(styleMenu.blockId, 'warning')}
          >
            <div className="h-4 w-4 rounded" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #F59E0B' }} />
            Warning (Orange)
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
            onClick={() => applyStylePreset(styleMenu.blockId, 'error')}
          >
            <div className="h-4 w-4 rounded" style={{ backgroundColor: 'rgba(247, 249, 250, 0.3)', borderLeft: '3px solid #EF4444' }} />
            Error (Red)
          </button>
        </div>
      )}
    </div>
  );
}
