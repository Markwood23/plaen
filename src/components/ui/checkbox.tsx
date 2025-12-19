"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-md border-2 border-gray-300 bg-white shadow-sm outline-none transition-all duration-200",
        "hover:border-[#14462a]/50 hover:bg-[#14462a]/5",
        "data-[state=checked]:bg-[#14462a] data-[state=checked]:border-[#14462a] data-[state=checked]:text-white data-[state=checked]:shadow-md",
        "focus-visible:border-[#14462a] focus-visible:ring-4 focus-visible:ring-[#14462a]/20",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white",
        "aria-invalid:border-red-400 aria-invalid:ring-red-100",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current animate-in zoom-in-50 duration-200"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
