/**
 * Centralized Icon Constants for Plaen
 * 
 * This file defines the single source of truth for icons used across the app.
 * Each feature/concept has ONE unique icon - no duplications allowed.
 * 
 * ICON ASSIGNMENT (DO NOT DUPLICATE):
 * ====================================
 * Dashboard    → Category2       (grid/overview)
 * Invoices     → Receipt21       (invoice/bill document)
 * Contacts     → People          (people/users)
 * Payments     → WalletMoney     (money transactions)
 * Receipts     → ReceiptText     (receipt document)
 * Notes        → Note            (note/memo)
 * Settings     → Setting2        (gear)
 * Support      → MessageQuestion (help/question)
 * Billing      → Wallet          (wallet for billing)
 * 
 * STATUS ICONS:
 * =============
 * Paid/Verified/Success → TickCircle
 * Pending/Waiting       → Clock
 * Failed/Cancelled      → CloseCircle
 * Flagged/Warning       → Danger
 * Refunded/Processing   → RefreshCircle
 * Partial               → MinusCirlce
 * 
 * PAYMENT METHOD ICONS:
 * =====================
 * Mobile Money → Mobile
 * Bank         → Bank (Building for company)
 * Card         → Card
 * Crypto       → Bitcoin
 */

import {
  // Navigation & Features
  Category2,        // Dashboard - grid/overview icon
  Receipt21,        // Invoices - invoice/bill specific
  People,           // Contacts - people/users
  WalletMoney,      // Payments - money transactions  
  ReceiptText,      // Receipts - receipt specific
  Note,             // Notes - note/memo icon
  Setting2,         // Settings - gear icon
  MessageQuestion,  // Support - help/question
  Wallet,           // Billing - wallet for billing
  
  // Status Icons
  TickCircle,       // Success/Paid/Verified/Completed
  CloseCircle,      // Failed/Cancelled/Error
  Clock,            // Pending/Waiting
  Danger,           // Warning/Flagged/Alert
  RefreshCircle,    // Refunded/Processing
  MinusCirlce,      // Partial/Incomplete
  
  // Action Icons
  Add,              // Create/Add new
  Edit2,            // Edit/Modify
  Trash,            // Delete/Remove
  Eye,              // View/Preview
  SearchNormal1,    // Search
  Filter,           // Filter
  ArrowSwapVertical,// Sort
  DocumentDownload, // Export/Download
  DocumentUpload,   // Import/Upload
  Copy,             // Copy/Duplicate
  Share,            // Share
  Archive,          // Archive
  
  // Payment Method Icons
  Mobile,           // Mobile Money (generic)
  Bank,             // Bank Transfer
  Card,             // Card Payments
  Bitcoin,          // Crypto
  
  // Documents & Content
  Book1,            // Documentation/Guide/Help articles
  Paperclip,        // Attachments
  Folder,           // Folders/Organization
  
  // Navigation UI
  ArrowRight2,      // Navigate forward/chevron
  ArrowLeft2,       // Navigate back
  ArrowDown2,       // Expand/dropdown
  ArrowUp2,         // Collapse
  More,             // More options (3 dots)
  Calendar,         // Date picker
  Star,             // Favorite/Important
  Tag,              // Tags/Labels
  
  // Communication
  Sms,              // Email/Message
  Call,             // Phone
  Message,          // Chat/Live chat
  Send2,            // Send
  
  // Profile & Security
  User,             // User profile
  ShieldTick,       // Security/Verified
  Lock,             // Password/Locked
  Key,              // API Keys
  Notification,     // Notifications
  
  // Business
  Building,         // Company/Business
  Chart,            // Analytics/Charts
  MoneyRecive,      // Income/Received
  MoneySend,        // Outgoing/Sent
  DollarSquare,     // Currency
  
  // Misc UI
  InfoCircle,       // Info tooltip
  Flash,            // Quick/Fast
  ExportSquare,     // External link
  Link2,            // Link/URL
} from "iconsax-react";

// Re-export all icons with semantic names
export {
  // Navigation Icons (one per feature - NEVER DUPLICATE)
  Category2 as DashboardIcon,
  Receipt21 as InvoicesIcon,
  People as ContactsIcon,
  WalletMoney as PaymentsIcon,
  ReceiptText as ReceiptsIcon,
  Note as NotesIcon,
  Setting2 as SettingsIcon,
  MessageQuestion as SupportIcon,
  Wallet as BillingIcon,
  
  // Status Icons
  TickCircle as SuccessIcon,
  TickCircle as PaidIcon,
  TickCircle as VerifiedIcon,
  CloseCircle as FailedIcon,
  CloseCircle as CancelledIcon,
  Clock as PendingIcon,
  Danger as FlaggedIcon,
  Danger as WarningIcon,
  RefreshCircle as RefundedIcon,
  MinusCirlce as PartialIcon,
  
  // Action Icons  
  Add as AddIcon,
  Edit2 as EditIcon,
  Trash as DeleteIcon,
  Eye as ViewIcon,
  SearchNormal1 as SearchIcon,
  Filter as FilterIcon,
  ArrowSwapVertical as SortIcon,
  DocumentDownload as ExportIcon,
  DocumentUpload as ImportIcon,
  Copy as CopyIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  
  // Payment Methods
  Mobile as MobileMoneyIcon,
  Bank as BankIcon,
  Card as CardIcon,
  Bitcoin as CryptoIcon,
  
  // Documents & Content
  Book1 as GuideIcon,
  Book1 as ArticleIcon,
  Paperclip as AttachmentIcon,
  Folder as FolderIcon,
  
  // Navigation UI
  ArrowRight2 as ChevronRightIcon,
  ArrowLeft2 as ChevronLeftIcon,
  ArrowDown2 as ChevronDownIcon,
  ArrowUp2 as ChevronUpIcon,
  More as MoreIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
  Tag as TagIcon,
  
  // Communication
  Sms as EmailIcon,
  Call as PhoneIcon,
  Message as ChatIcon,
  Send2 as SendIcon,
  
  // Profile & Security
  User as UserIcon,
  ShieldTick as SecurityIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Notification as NotificationIcon,
  
  // Business
  Building as CompanyIcon,
  Chart as ChartIcon,
  MoneyRecive as IncomeIcon,
  MoneySend as OutgoingIcon,
  DollarSquare as CurrencyIcon,
  
  // Misc
  InfoCircle as InfoIcon,
  Flash as QuickIcon,
  ExportSquare as ExternalLinkIcon,
  Link2 as LinkIcon,
};

// Navigation config for sidebar - use this across all navigation components
export const NAV_ICONS = {
  dashboard: Category2,
  invoices: Receipt21,
  contacts: People,
  payments: WalletMoney,
  receipts: ReceiptText,
  notes: Note,
  settings: Setting2,
  support: MessageQuestion,
  billing: Wallet,
} as const;

// Status badge icon mapping
export const STATUS_ICONS = {
  paid: TickCircle,
  verified: TickCircle,
  completed: TickCircle,
  success: TickCircle,
  pending: Clock,
  waiting: Clock,
  failed: CloseCircle,
  cancelled: CloseCircle,
  error: CloseCircle,
  flagged: Danger,
  warning: Danger,
  alert: Danger,
  refunded: RefreshCircle,
  processing: RefreshCircle,
  partial: MinusCirlce,
} as const;

// Payment method icons
export const PAYMENT_METHOD_ICONS = {
  mobileMoney: Mobile,
  mtn: Mobile,
  vodafone: Mobile,
  airtel: Mobile,
  bank: Bank,
  bankTransfer: Bank,
  card: Card,
  visa: Card,
  mastercard: Card,
  crypto: Bitcoin,
  bitcoin: Bitcoin,
  usdt: Bitcoin,
  usdc: Bitcoin,
} as const;
