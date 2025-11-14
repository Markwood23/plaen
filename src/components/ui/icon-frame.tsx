import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

// Consistent icon wrapper to unify sizing & styling across marketing pages.
// Variants intentionally minimal to keep surface calm.
// size: controls icon glyph size; frame adjusts padding proportionally.
// variant: subtle (gray background), plain (no bg), solid (black bg white icon).
// tone: muted or default for icon color differences without changing variant.

interface IconFrameProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl"; // xl only for sparse decorative usage
  variant?: "plain" | "subtle" | "solid";
  tone?: "default" | "muted";
  pulse?: boolean; // optional small status pulse dot overlay
}

const sizeMap: Record<NonNullable<IconFrameProps["size"]>, { icon: string; padding: string; wrapper: string }> = {
  sm: { icon: "h-4 w-4", padding: "p-1", wrapper: "h-8 w-8" },
  md: { icon: "h-5 w-5", padding: "p-1.5", wrapper: "h-10 w-10" },
  lg: { icon: "h-6 w-6", padding: "p-2", wrapper: "h-12 w-12" },
  xl: { icon: "h-10 w-10", padding: "p-3", wrapper: "h-20 w-20" },
};

export function IconFrame({
  icon: Icon,
  size = "md",
  variant = "subtle",
  tone = "default",
  pulse = false,
  className,
  ...rest
}: IconFrameProps) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        // base: perfect circle, never shrinks, keeps icon centered
        "relative inline-flex aspect-square shrink-0 items-center justify-center rounded-full border leading-none overflow-hidden transition-colors", // base
        variant === "plain" && "border-transparent",
        variant === "subtle" && "border-gray-200 bg-gray-100/70",
        variant === "solid" && "border-black bg-black",
        tone === "muted" && variant !== "solid" && "bg-gray-50",
        s.wrapper,
        s.padding,
        className
      )}
      {...rest}
    >
      <Icon
        className={cn(
          s.icon,
          variant === "solid" ? "text-white" : tone === "muted" ? "text-gray-500" : "text-gray-700"
        )}
      />
      {pulse && (
        <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 shadow ring-2 ring-white" />
      )}
    </span>
  );
}

export default IconFrame;
