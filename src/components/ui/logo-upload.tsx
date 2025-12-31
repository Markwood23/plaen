"use client"

import { useState, useRef } from 'react'
import { DocumentUpload, Trash, Building4 } from 'iconsax-react'
import Image from 'next/image'

interface LogoUploadProps {
  currentUrl?: string | null
  onUploadComplete?: (url: string) => void
  onDeleteComplete?: () => void
  disabled?: boolean
  businessName?: string
}

export function LogoUpload({
  currentUrl,
  onUploadComplete,
  onDeleteComplete,
  disabled = false,
  businessName,
}: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = previewUrl || currentUrl

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, SVG, or WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'logos')
      formData.append('fileName', 'logo.' + (file.name.split('.').pop() || 'png'))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setPreviewUrl(null) // Clear preview, use actual URL
      onUploadComplete?.(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUrl) return

    setUploading(true)
    setError(null)

    try {
      // Extract path from URL
      const urlObj = new URL(currentUrl)
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/logos\/(.+)/)
      const path = pathMatch?.[1]

      if (!path) {
        throw new Error('Invalid logo URL')
      }

      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'logos', path }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed')
      }

      onDeleteComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setUploading(false)
    }
  }

  // Get initials from business name
  const initials = businessName
    ? businessName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  return (
    <div className="flex items-start gap-4">
      {/* Logo Preview */}
      <div className="relative h-20 w-20 flex-shrink-0">
        <div
          className={`
            h-20 w-20 rounded-2xl overflow-hidden 
            bg-gradient-to-br from-gray-100 to-gray-200
            flex items-center justify-center
            border border-gray-200
            ${uploading ? 'opacity-50' : ''}
          `}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Business logo"
              fill
              className="object-contain p-2"
              sizes="80px"
            />
          ) : initials ? (
            <span className="text-gray-400 font-bold text-xl">
              {initials}
            </span>
          ) : (
            <Building4 size={24} className="text-gray-400" />
          )}
        </div>

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/30">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Upload controls */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="
              inline-flex items-center gap-2 px-4 py-2
              text-sm font-medium text-gray-700
              bg-white border border-gray-200 rounded-xl
              hover:bg-gray-50 hover:border-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <DocumentUpload size={16} />
            {currentUrl ? 'Change Logo' : 'Upload Logo'}
          </button>

          {currentUrl && (
            <button
              onClick={handleDelete}
              disabled={uploading || disabled}
              className="
                inline-flex items-center gap-2 px-4 py-2
                text-sm font-medium text-red-600
                bg-white border border-red-200 rounded-xl
                hover:bg-red-50 hover:border-red-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <Trash size={16} />
              Remove
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Square image, PNG or SVG, min 200×200px, max 5MB
        </p>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/svg+xml,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
