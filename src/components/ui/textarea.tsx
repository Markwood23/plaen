import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-base text-gray-900 shadow-sm outline-none transition-all duration-200",
        "placeholder:text-gray-400 selection:bg-[#14462a]/20 selection:text-[#14462a]",
        "hover:border-gray-300 hover:bg-white",
        "focus:border-[#14462a] focus:bg-white focus:ring-4 focus:ring-[#14462a]/10",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 disabled:hover:border-gray-200",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100 aria-invalid:bg-red-50/50",
        "resize-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
