"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SearchNormal1, CloseCircle } from "iconsax-react"

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: "sm" | "md" | "lg"
  onClear?: () => void
  showClearButton?: boolean
  fullWidth?: boolean
  containerClassName?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      size = "md",
      onClear,
      showClearButton = true,
      fullWidth = false,
      value,
      onChange,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("")
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("")
      }
      onClear?.()
      // Create a synthetic event for controlled components
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    const sizeClasses = {
      sm: "h-9 text-sm pl-9 pr-9",
      md: "h-11 text-sm pl-11 pr-11",
      lg: "h-12 text-base pl-12 pr-12",
    }

    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 20,
    }

    const iconPositions = {
      sm: "left-2.5",
      md: "left-3.5",
      lg: "left-4",
    }

    const clearPositions = {
      sm: "right-2.5",
      md: "right-3.5",
      lg: "right-4",
    }

    return (
      <div className={cn("relative", fullWidth && "w-full", containerClassName)}>
        <SearchNormal1
          size={iconSizes[size]}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-[#B0B3B8] pointer-events-none",
            iconPositions[size]
          )}
        />
        <input
          type="text"
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            // Base styles
            "rounded-xl border-0 bg-[#F9F9F9] text-[#2D2D2D]",
            "placeholder:text-[#B0B3B8]",
            // Focus styles
            "focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#14462a]/10",
            // Hover styles
            "hover:bg-[#F5F5F5]",
            // Transition
            "transition-all duration-200",
            // Size variants
            sizeClasses[size],
            // Width
            fullWidth ? "w-full" : "w-[280px]",
            className
          )}
          {...props}
        />
        {showClearButton && currentValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-[#B0B3B8]",
              "hover:text-[#2D2D2D] transition-colors",
              clearPositions[size]
            )}
            aria-label="Clear search"
          >
            <CloseCircle size={iconSizes[size]} variant="Bold" />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"
