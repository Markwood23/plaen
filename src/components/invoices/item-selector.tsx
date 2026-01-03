"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { 
  Add, 
  SearchNormal1, 
  Box1, 
  Briefcase,
  ArrowDown2,
  Edit2,
  CloseCircle
} from "iconsax-react"
import type { ProductService } from "@/hooks/useProductsServices"

interface ItemSelectorProps {
  products: ProductService[]
  loading?: boolean
  onSelect: (product: ProductService | null) => void  // null means "enter manually"
  onCreateNew: () => void
  onEdit?: (product: ProductService) => void
  placeholder?: string
  className?: string
  maskAmount?: (value: string) => string
}

export function ItemSelector({
  products,
  loading = false,
  onSelect,
  onCreateNew,
  onEdit,
  placeholder = "Search or select an item...",
  className = "",
  maskAmount = (v) => v
}: ItemSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    
    const searchLower = search.toLowerCase()
    return products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.details?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      )
    })
  }, [products, search])

  // Group products by type
  const groupedProducts = useMemo(() => {
    const services = filteredProducts.filter(p => p.type === 'service')
    const productItems = filteredProducts.filter(p => p.type === 'product')
    return { services, products: productItems }
  }, [filteredProducts])

  // Total items for keyboard navigation
  const totalItems = filteredProducts.length + 2 // +2 for "Create new" and "Enter manually"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0)
  }, [search])

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedElement = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`)
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev - 1 + totalItems) % totalItems)
        break
      case 'Enter':
        e.preventDefault()
        handleSelect(highlightedIndex)
        break
      case 'Escape':
        setIsOpen(false)
        setSearch("")
        break
    }
  }

  const handleSelect = (index: number) => {
    if (index === 0) {
      // "Create new" option
      onCreateNew()
    } else if (index === 1) {
      // "Enter manually" option
      onSelect(null)
    } else {
      // Product selection
      const productIndex = index - 2
      if (productIndex >= 0 && productIndex < filteredProducts.length) {
        onSelect(filteredProducts[productIndex])
      }
    }
    setIsOpen(false)
    setSearch("")
  }

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : '€'
    return maskAmount(`${symbol}${price.toFixed(2)}`)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger / Search Input */}
      <div
        className={`flex items-center h-11 px-3 rounded-xl border cursor-pointer transition-all ${
          isOpen 
            ? 'border-[#14462a] ring-2 ring-[#14462a]/10' 
            : 'border-[#E4E6EB] hover:border-[#14462a]'
        } bg-white`}
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
      >
        <SearchNormal1 size={18} color="#B0B3B8" className="mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-[#2D2D2D] placeholder:text-[#B0B3B8]"
        />
        <ArrowDown2 
          size={16} 
          color="#B0B3B8" 
          className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E4E6EB] shadow-lg z-50 overflow-hidden"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          {/* Create New Option */}
          <div
            data-index={0}
            onClick={() => handleSelect(0)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
              highlightedIndex === 0 ? 'bg-[#14462a]/5' : 'hover:bg-[#F7F9FA]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#14462a]/10 flex items-center justify-center">
              <Add size={18} color="#14462a" />
            </div>
            <div>
              <span className="font-medium text-[#14462a] text-sm">Create new product/service</span>
              <p className="text-xs text-[#B0B3B8]">Save for future use</p>
            </div>
          </div>

          {/* Enter Manually Option */}
          <div
            data-index={1}
            onClick={() => handleSelect(1)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#E4E6EB] ${
              highlightedIndex === 1 ? 'bg-[#14462a]/5' : 'hover:bg-[#F7F9FA]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#F7F9FA] flex items-center justify-center">
              <Edit2 size={18} color="#65676B" />
            </div>
            <div>
              <span className="font-medium text-[#2D2D2D] text-sm">Enter manually</span>
              <p className="text-xs text-[#B0B3B8]">One-time item, won&apos;t be saved</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-4 py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#14462a] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-[#B0B3B8]">Loading items...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && search && (
            <div className="px-4 py-8 text-center">
              <CloseCircle size={32} color="#B0B3B8" className="mx-auto mb-2" />
              <p className="text-sm text-[#B0B3B8]">
                No items found for &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={onCreateNew}
                className="mt-2 text-sm text-[#14462a] font-medium hover:underline"
              >
                Create &ldquo;{search}&rdquo; as new item
              </button>
            </div>
          )}

          {/* Empty State - No products at all */}
          {!loading && products.length === 0 && !search && (
            <div className="px-4 py-8 text-center">
              <Box1 size={32} color="#B0B3B8" className="mx-auto mb-2" />
              <p className="text-sm text-[#B0B3B8]">
                No saved products or services yet
              </p>
              <p className="text-xs text-[#B0B3B8] mt-1">
                Create your first item to quickly add it to invoices
              </p>
            </div>
          )}

          {/* Services Section */}
          {groupedProducts.services.length > 0 && (
            <>
              <div className="px-4 py-2 bg-[#F7F9FA] border-b border-[#E4E6EB]">
                <span className="text-xs font-semibold text-[#B0B3B8] uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase size={12} color="#B0B3B8" />
                  Services
                </span>
              </div>
              {groupedProducts.services.map((product, idx) => {
                const globalIndex = idx + 2
                return (
                  <ProductItem
                    key={product.id}
                    product={product}
                    index={globalIndex}
                    isHighlighted={highlightedIndex === globalIndex}
                    onSelect={() => handleSelect(globalIndex)}
                    onEdit={onEdit}
                    formatPrice={formatPrice}
                  />
                )
              })}
            </>
          )}

          {/* Products Section */}
          {groupedProducts.products.length > 0 && (
            <>
              <div className="px-4 py-2 bg-[#F7F9FA] border-b border-[#E4E6EB]">
                <span className="text-xs font-semibold text-[#B0B3B8] uppercase tracking-wide flex items-center gap-1.5">
                  <Box1 size={12} color="#B0B3B8" />
                  Products
                </span>
              </div>
              {groupedProducts.products.map((product, idx) => {
                const globalIndex = groupedProducts.services.length + idx + 2
                return (
                  <ProductItem
                    key={product.id}
                    product={product}
                    index={globalIndex}
                    isHighlighted={highlightedIndex === globalIndex}
                    onSelect={() => handleSelect(globalIndex)}
                    onEdit={onEdit}
                    formatPrice={formatPrice}
                  />
                )
              })}
            </>
          )}

          {/* Keyboard hint */}
          {filteredProducts.length > 0 && (
            <div className="px-4 py-2 border-t border-[#E4E6EB] bg-[#F7F9FA]">
              <p className="text-xs text-[#B0B3B8] text-center">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">↑↓</kbd>
                  navigate
                </span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">Enter</kbd>
                  select
                </span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">Esc</kbd>
                  close
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Separate component for product items
function ProductItem({
  product,
  index,
  isHighlighted,
  onSelect,
  onEdit,
  formatPrice
}: {
  product: ProductService
  index: number
  isHighlighted: boolean
  onSelect: () => void
  onEdit?: (product: ProductService) => void
  formatPrice: (price: number, currency: string) => string
}) {
  return (
    <div
      data-index={index}
      onClick={onSelect}
      className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
        isHighlighted ? 'bg-[#14462a]/5' : 'hover:bg-[#F7F9FA]'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        product.type === 'service' ? 'bg-blue-50' : 'bg-amber-50'
      }`}>
        {product.type === 'service' ? (
          <Briefcase size={16} color="#3B82F6" />
        ) : (
          <Box1 size={16} color="#F59E0B" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-[#2D2D2D] truncate">
            {product.name}
          </span>
          {product.sku && (
            <span className="text-xs text-[#B0B3B8] bg-[#F7F9FA] px-1.5 py-0.5 rounded">
              {product.sku}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-[#B0B3B8] truncate mt-0.5">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className="font-semibold text-sm text-[#14462a]">
            {formatPrice(product.unit_price, product.currency)}
          </span>
          {product.default_tax > 0 && (
            <span className="block text-xs text-[#B0B3B8]">
              +{product.default_tax}% tax
            </span>
          )}
        </div>
        
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(product)
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#E4E6EB] transition-all"
            title="Edit item"
          >
            <Edit2 size={14} color="#65676B" />
          </button>
        )}
      </div>
    </div>
  )
}
