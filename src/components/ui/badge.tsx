import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#14462a] text-white shadow-sm",
        secondary:
          "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200/80",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200/80",
        outline:
          "border-gray-200 text-gray-700 bg-white hover:bg-gray-50",
        success:
          "border-transparent bg-[#14462a]/10 text-[#14462a]",
        warning:
          "border-transparent bg-amber-100 text-amber-700",
        info:
          "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200/80",
        // Status-specific variants
        paid:
          "border-transparent bg-[#14462a]/10 text-[#14462a]",
        pending:
          "border-transparent bg-amber-100 text-amber-700",
        cancelled:
          "border-transparent bg-gray-100 text-gray-600",
        refunded:
          "border-transparent bg-rose-100 text-rose-700",
        failed:
          "border-transparent bg-red-100 text-red-700",
        partial:
          "border-transparent bg-teal-100 text-teal-700",
        verified:
          "border-transparent bg-[#14462a]/10 text-[#14462a]",
        flagged:
          "border-transparent bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
