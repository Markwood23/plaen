"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import type { Icon } from "iconsax-react";

interface EmptyStateProps {
  /** Iconsax icon component */
  icon: Icon | LucideIcon;
  /** Icon color - defaults to muted gray */
  iconColor?: string;
  /** Main title text */
  title: string;
  /** Description text below title */
  description: string;
  /** Primary action button text */
  actionLabel?: string;
  /** Primary action click handler */
  onAction?: () => void;
  /** Link href for primary action (alternative to onClick) */
  actionHref?: string;
  /** Secondary action button text */
  secondaryLabel?: string;
  /** Secondary action click handler */
  onSecondaryAction?: () => void;
  /** Additional custom content */
  children?: ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom class name */
  className?: string;
}

export function EmptyState({
  icon: IconComponent,
  iconColor = "#B0B3B8",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryLabel,
  onSecondaryAction,
  children,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      iconSize: 32,
      iconContainerSize: "h-14 w-14",
      titleSize: "text-base",
      descSize: "text-sm",
      spacing: "py-8",
    },
    md: {
      iconSize: 40,
      iconContainerSize: "h-20 w-20",
      titleSize: "text-lg",
      descSize: "text-sm",
      spacing: "py-12",
    },
    lg: {
      iconSize: 48,
      iconContainerSize: "h-24 w-24",
      titleSize: "text-xl",
      descSize: "text-base",
      spacing: "py-16",
    },
  };

  const config = sizeConfig[size];

  const ActionButton = () => {
    if (!actionLabel) return null;
    
    if (actionHref) {
      return (
        <Button asChild className="mt-4">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      );
    }
    
    return (
      <Button onClick={onAction} className="mt-4">
        {actionLabel}
      </Button>
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${config.spacing} ${className}`}>
      {/* Icon container with subtle background */}
      <div 
        className={`${config.iconContainerSize} rounded-full flex items-center justify-center mb-4`}
        style={{ backgroundColor: "rgba(176, 179, 184, 0.1)" }}
      >
        <IconComponent 
          size={config.iconSize} 
          color={iconColor} 
          variant="Bulk" 
        />
      </div>
      
      {/* Title */}
      <h3 
        className={`${config.titleSize} font-semibold mb-2`}
        style={{ color: "#2D2D2D" }}
      >
        {title}
      </h3>
      
      {/* Description */}
      <p 
        className={`${config.descSize} max-w-sm`}
        style={{ color: "#65676B" }}
      >
        {description}
      </p>
      
      {/* Actions */}
      <div className="flex items-center gap-3 mt-6">
        <ActionButton />
        {secondaryLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction} className="mt-4">
            {secondaryLabel}
          </Button>
        )}
      </div>
      
      {/* Custom content */}
      {children}
    </div>
  );
}

/**
 * Pre-configured empty states for common use cases
 */
export function EmptyInvoices({ onCreateInvoice }: { onCreateInvoice?: () => void }) {
  const { Receipt21 } = require("iconsax-react");
  return (
    <EmptyState
      icon={Receipt21}
      iconColor="#14462a"
      title="No invoices yet"
      description="Create your first invoice to start getting paid. It only takes a minute!"
      actionLabel="Create Invoice"
      actionHref="/invoices/new"
    />
  );
}

export function EmptyContacts({ onAddContact }: { onAddContact?: () => void }) {
  const { People } = require("iconsax-react");
  return (
    <EmptyState
      icon={People}
      iconColor="#14462a"
      title="No contacts yet"
      description="Add your first client or customer to start sending invoices."
      actionLabel="Add Contact"
      actionHref="/contacts/new"
    />
  );
}

export function EmptyPayments() {
  const { Coin1 } = require("iconsax-react");
  return (
    <EmptyState
      icon={Coin1}
      iconColor="#14462a"
      title="No payments yet"
      description="Payments will appear here once your clients pay their invoices."
    />
  );
}

export function EmptyNotes({ onCreateNote }: { onCreateNote?: () => void }) {
  const { Note } = require("iconsax-react");
  return (
    <EmptyState
      icon={Note}
      iconColor="#6366F1"
      title="No notes yet"
      description="Create financial documents and notes with live data from your invoices and payments."
      actionLabel="Create Note"
      actionHref="/notes/new"
    />
  );
}

export function EmptyReceipts() {
  const { ReceiptItem } = require("iconsax-react");
  return (
    <EmptyState
      icon={ReceiptItem}
      iconColor="#14462a"
      title="No receipts yet"
      description="Receipts are automatically generated when payments are recorded."
    />
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  const { SearchNormal1 } = require("iconsax-react");
  return (
    <EmptyState
      icon={SearchNormal1}
      title="No results found"
      description={query ? `No results matching "${query}". Try a different search term.` : "Try adjusting your filters or search terms."}
      size="sm"
    />
  );
}

export function EmptyTableData({ message = "No data available" }: { message?: string }) {
  const { DocumentText } = require("iconsax-react");
  return (
    <EmptyState
      icon={DocumentText}
      title={message}
      description="Data will appear here once it's available."
      size="sm"
    />
  );
}
