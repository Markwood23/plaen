import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-[#14462a]/20 selection:text-[#14462a]",
        "h-11 w-full min-w-0 rounded-xl border-2 border-gray-200 bg-gray-50/50 px-3.5 py-2 text-base text-gray-900",
        "shadow-sm transition-all duration-200 outline-none",
        "hover:border-gray-300 hover:bg-white",
        "focus:border-[#14462a] focus:bg-white focus:ring-4 focus:ring-[#14462a]/10",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100 aria-invalid:bg-red-50/50",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
