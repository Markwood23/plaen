"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "rounded-full px-3 py-2 flex items-center gap-2 w-fit",
        className
      )}
      style={{ backgroundColor: 'rgba(247, 249, 250, 0.5)' }}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "rounded-full px-5 h-9 text-sm font-normal transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      style={{
        backgroundColor: 'transparent',
        color: '#2D2D2D',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (e.currentTarget.getAttribute('data-state') !== 'active') {
          e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.04)';
          e.currentTarget.style.color = '#1877F2';
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (e.currentTarget.getAttribute('data-state') !== 'active') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#2D2D2D';
        }
      }}
      {...(props as any)}
      ref={(el: HTMLButtonElement | null) => {
        if (el) {
          const isActive = el.getAttribute('data-state') === 'active';
          if (isActive) {
            el.style.backgroundColor = 'rgba(24, 119, 242, 0.08)';
            el.style.color = '#1877F2';
            el.style.fontWeight = '500';
          } else if (!isHovered) {
            el.style.backgroundColor = 'transparent';
            el.style.color = '#2D2D2D';
            el.style.fontWeight = '400';
          }
        }
      }}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
