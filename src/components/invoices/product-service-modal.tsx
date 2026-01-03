"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, NumberInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Box1, 
  Briefcase, 
  Warning2,
  TickCircle,
  CloseCircle
} from "iconsax-react"
import type { ProductService, ProductServiceInput } from "@/hooks/useProductsServices"

interface ProductServiceModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: ProductServiceInput) => Promise<ProductService>
  initialData?: ProductService | null
  mode?: 'create' | 'edit'
}

export function ProductServiceModal({ 
  open, 
  onClose, 
  onSave, 
  initialData = null,
  mode = 'create'
}: ProductServiceModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<ProductServiceInput>({
    name: "",
    description: "",
    details: "",
    type: "service",
    unit_price: 0,
    currency: "GHS",
    default_tax: 0,
    default_discount: 0,
    discount_type: "percent",
    sku: "",
    is_active: true,
    category: ""
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || "",
          details: initialData.details || "",
          type: initialData.type,
          unit_price: initialData.unit_price,
          currency: initialData.currency || "GHS",
          default_tax: initialData.default_tax || 0,
          default_discount: initialData.default_discount || 0,
          discount_type: initialData.discount_type || "percent",
          sku: initialData.sku || "",
          is_active: initialData.is_active,
          category: initialData.category || ""
        })
      } else {
        setFormData({
          name: "",
          description: "",
          details: "",
          type: "service",
          unit_price: 0,
          currency: "GHS",
          default_tax: 0,
          default_discount: 0,
          discount_type: "percent",
          sku: "",
          is_active: true,
          category: ""
        })
      }
      setTouched({})
      setError(null)
      setSuccess(false)
    }
  }, [open, initialData])

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }
    if (formData.unit_price < 0) {
      setError("Price cannot be negative")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onSave(formData)
      setSuccess(true)
      
      // Close after a short delay to show success
      setTimeout(() => {
        onClose()
      }, 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const updateField = <K extends keyof ProductServiceInput>(
    field: K, 
    value: ProductServiceInput[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-[#E4E6EB]">
          <DialogTitle className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
            {formData.type === 'product' ? (
              <Box1 size={20} variant="Bold" color="#14462a" />
            ) : (
              <Briefcase size={20} variant="Bold" color="#14462a" />
            )}
            {mode === 'create' ? 'Create New' : 'Edit'} {formData.type === 'product' ? 'Product' : 'Service'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#B0B3B8]">
            {mode === 'create' 
              ? 'Add a new product or service to quickly select on invoices' 
              : 'Update the details of this item'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Type Selection */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateField('type', 'service')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                formData.type === 'service'
                  ? 'border-[#14462a] bg-[#14462a]/5'
                  : 'border-[#E4E6EB] hover:border-[#14462a]/50'
              }`}
            >
              <Briefcase 
                size={20} 
                variant={formData.type === 'service' ? 'Bold' : 'Linear'} 
                color={formData.type === 'service' ? '#14462a' : '#65676B'} 
              />
              <span className={`font-medium ${formData.type === 'service' ? 'text-[#14462a]' : 'text-[#65676B]'}`}>
                Service
              </span>
            </button>
            <button
              type="button"
              onClick={() => updateField('type', 'product')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                formData.type === 'product'
                  ? 'border-[#14462a] bg-[#14462a]/5'
                  : 'border-[#E4E6EB] hover:border-[#14462a]/50'
              }`}
            >
              <Box1 
                size={20} 
                variant={formData.type === 'product' ? 'Bold' : 'Linear'} 
                color={formData.type === 'product' ? '#14462a' : '#65676B'} 
              />
              <span className={`font-medium ${formData.type === 'product' ? 'text-[#14462a]' : 'text-[#65676B]'}`}>
                Product
              </span>
            </button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2D2D2D]">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder={formData.type === 'service' ? "e.g., Website Development" : "e.g., Software License"}
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => markTouched('name')}
              className={`h-11 rounded-xl transition-colors ${
                touched.name && !formData.name.trim()
                  ? 'border-red-500'
                  : 'border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a]'
              }`}
            />
            {touched.name && !formData.name.trim() && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <Warning2 size={10} />
                Name is required
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2D2D2D]">
              Short Description
            </Label>
            <Input
              placeholder="Brief description for invoice line items"
              value={formData.description || ""}
              onChange={(e) => updateField('description', e.target.value)}
              className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2D2D2D]">
              Detailed Information
            </Label>
            <Textarea
              placeholder="Additional details that appear on the invoice..."
              value={formData.details || ""}
              onChange={(e) => updateField('details', e.target.value)}
              rows={2}
              className="rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors resize-none"
            />
          </div>

          {/* Price and Currency Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">
                Unit Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676B] font-medium">
                  {formData.currency === 'GHS' ? '₵' : formData.currency === 'USD' ? '$' : '€'}
                </span>
                <NumberInput
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={formData.unit_price === 0 ? '' : formData.unit_price}
                  onChange={(e) => updateField('unit_price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => updateField('currency', v)}>
                <SelectTrigger className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS (₵)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tax and Discount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">Default Tax %</Label>
              <NumberInput
                min={0}
                max={100}
                step={0.1}
                placeholder="0"
                value={formData.default_tax === 0 ? '' : formData.default_tax}
                onChange={(e) => updateField('default_tax', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">Default Discount</Label>
              <div className="flex gap-2">
                <NumberInput
                  min={0}
                  step={0.01}
                  placeholder="0"
                  value={formData.default_discount === 0 ? '' : formData.default_discount}
                  onChange={(e) => updateField('default_discount', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors flex-1"
                />
                <Select value={formData.discount_type} onValueChange={(v) => updateField('discount_type', v as 'percent' | 'fixed')}>
                  <SelectTrigger className="h-11 w-20 rounded-xl border-[#E4E6EB] hover:border-[#14462a] transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">%</SelectItem>
                    <SelectItem value="fixed">₵</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SKU and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">SKU / Code</Label>
              <Input
                placeholder="e.g., WEB-001"
                value={formData.sku || ""}
                onChange={(e) => updateField('sku', e.target.value)}
                className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#2D2D2D]">Category</Label>
              <Input
                placeholder="e.g., Development"
                value={formData.category || ""}
                onChange={(e) => updateField('category', e.target.value)}
                className="h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] focus:border-[#14462a] transition-colors"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => updateField('is_active', checked as boolean)}
              className="h-5 w-5 rounded border-[#E4E6EB] data-[state=checked]:bg-[#14462a] data-[state=checked]:border-[#14462a]"
            />
            <Label htmlFor="is_active" className="text-sm text-[#65676B] cursor-pointer">
              Active (available for selection on invoices)
            </Label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600">
              <CloseCircle size={16} variant="Bold" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-600">
              <TickCircle size={16} variant="Bold" />
              <span className="text-sm">
                {mode === 'create' ? 'Item created successfully!' : 'Item updated successfully!'}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-[#E4E6EB] flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={saving}
            className="flex-1 h-11 rounded-xl border-[#E4E6EB] hover:border-[#14462a] hover:bg-[#14462a]/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || !formData.name.trim()}
            className="flex-1 h-11 rounded-xl transition-all"
            style={{ backgroundColor: '#14462a', color: 'white' }}
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Create Item' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
