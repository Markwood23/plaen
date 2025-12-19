import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-[#14462a]/20 selection:text-[#14462a]",
        "h-11 w-full min-w-0 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-2 text-base text-gray-900",
        "shadow-sm transition-all duration-200 outline-none",
        "hover:border-gray-300 hover:bg-white",
        "focus:border-[#14462a] focus:bg-white focus:ring-4 focus:ring-[#14462a]/10",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100 aria-invalid:bg-red-50/50",
        "md:text-sm",
        // Number input spinner styling
        "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        "[appearance:textfield]",
        className
      )}
      {...props}
    />
  )
}

// Number input with custom increment/decrement buttons
function NumberInput({ 
  className, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  ...props 
}: React.ComponentProps<"input"> & { 
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const handleIncrement = () => {
    const currentValue = typeof value === 'string' ? parseFloat(value) || 0 : (value ?? 0);
    const newValue = currentValue + step;
    if (max !== undefined && newValue > max) return;
    
    const syntheticEvent = {
      target: { value: String(newValue) }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
  };

  const handleDecrement = () => {
    const currentValue = typeof value === 'string' ? parseFloat(value) || 0 : (value ?? 0);
    const newValue = currentValue - step;
    if (min !== undefined && newValue < min) return;
    
    const syntheticEvent = {
      target: { value: String(newValue) }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
  };

  return (
    <div className="relative">
      <input
        type="number"
        data-slot="input"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={cn(
          "file:text-foreground placeholder:text-gray-400 selection:bg-[#14462a]/20 selection:text-[#14462a]",
          "h-11 w-full min-w-0 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 pr-10 py-2 text-base text-gray-900",
          "shadow-sm transition-all duration-200 outline-none",
          "hover:border-gray-300 hover:bg-white",
          "focus:border-[#14462a] focus:bg-white focus:ring-4 focus:ring-[#14462a]/10",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
          "aria-invalid:border-red-400 aria-invalid:ring-red-100 aria-invalid:bg-red-50/50",
          "md:text-sm",
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          "[appearance:textfield]",
          className
        )}
        {...props}
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
        <button
          type="button"
          onClick={handleIncrement}
          className="flex items-center justify-center w-7 h-4 text-gray-500 hover:text-[#14462a] hover:bg-[#14462a]/5 rounded-t-md transition-colors"
          tabIndex={-1}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="flex items-center justify-center w-7 h-4 text-gray-500 hover:text-[#14462a] hover:bg-[#14462a]/5 rounded-b-md transition-colors"
          tabIndex={-1}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export { Input, NumberInput }
