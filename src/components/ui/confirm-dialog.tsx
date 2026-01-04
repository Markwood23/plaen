"use client"

import * as React from "react"
import { AlertTriangle, Trash2, Send, AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ConfirmDialogVariant = "danger" | "warning" | "info" | "success"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: ConfirmDialogVariant
  loading?: boolean
  icon?: React.ReactNode
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    buttonVariant: "default" as const,
  },
  info: {
    icon: Send,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    buttonVariant: "default" as const,
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    buttonVariant: "default" as const,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
  loading = false,
  icon,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error("Confirm action failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const isProcessing = loading || isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader className="flex flex-col items-center text-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full",
              config.iconBg
            )}
          >
            {icon || <Icon className={cn("w-7 h-7", config.iconColor)} />}
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-base">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 h-11"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isProcessing}
            className={cn(
              "flex-1 h-11",
              variant === "danger" && "bg-red-600 hover:bg-red-700 text-white",
              variant === "warning" && "bg-amber-600 hover:bg-amber-700 text-white",
              variant === "info" && "bg-blue-600 hover:bg-blue-700 text-white",
              variant === "success" && "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easier usage
interface UseConfirmDialogOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmDialogVariant
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean
    options: UseConfirmDialogOptions | null
    resolve: ((value: boolean) => void) | null
  }>({
    open: false,
    options: null,
    resolve: null,
  })

  const confirm = React.useCallback((options: UseConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirm = React.useCallback(() => {
    dialogState.resolve?.(true)
    setDialogState({ open: false, options: null, resolve: null })
  }, [dialogState.resolve])

  const handleCancel = React.useCallback(() => {
    dialogState.resolve?.(false)
    setDialogState({ open: false, options: null, resolve: null })
  }, [dialogState.resolve])

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      dialogState.resolve?.(false)
      setDialogState({ open: false, options: null, resolve: null })
    }
  }, [dialogState.resolve])

  const ConfirmDialogComponent = React.useMemo(() => {
    if (!dialogState.options) return null

    return (
      <ConfirmDialog
        open={dialogState.open}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...dialogState.options}
      />
    )
  }, [dialogState.open, dialogState.options, handleOpenChange, handleConfirm, handleCancel])

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  }
}
