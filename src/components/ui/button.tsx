import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#14462a] border border-[#14462a]/20 text-white shadow-sm hover:bg-[#0d3520] hover:shadow-md active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-[#14462a]/20",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-red-500/20",
        outline:
          "border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-gray-500/10",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-gray-500/10",
        ghost:
          "bg-transparent hover:bg-gray-100 active:bg-gray-200",
        link: "text-[#14462a] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
