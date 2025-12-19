"use client";

import React from "react";

interface CedisIconProps {
  size?: number;
  color?: string;
  variant?: "Linear" | "Bold" | "Bulk";
  className?: string;
}

// Circular Cedis icon - matches iconsax-react style
export function CedisCircle({ 
  size = 24, 
  color = "currentColor", 
  variant = "Linear",
  className = "" 
}: CedisIconProps) {
  if (variant === "Bold" || variant === "Bulk") {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
      >
        <circle cx="12" cy="12" r="10" fill={variant === "Bulk" ? `${color}20` : color} />
        <text 
          x="12" 
          y="16.5" 
          textAnchor="middle" 
          fill={variant === "Bulk" ? color : "white"} 
          fontSize="12" 
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ₵
        </text>
      </svg>
    );
  }

  // Linear variant
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
      <text 
        x="12" 
        y="16.5" 
        textAnchor="middle" 
        fill={color} 
        fontSize="12" 
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        ₵
      </text>
    </svg>
  );
}

// For use in buttons where we need smaller inline icons
export function CedisInline({ 
  size = 14, 
  color = "currentColor", 
  className = "" 
}: Omit<CedisIconProps, "variant">) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
      <text 
        x="12" 
        y="16.5" 
        textAnchor="middle" 
        fill={color} 
        fontSize="12" 
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        ₵
      </text>
    </svg>
  );
}

export default CedisCircle;
