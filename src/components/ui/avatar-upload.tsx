"use client"

import { useState, useRef } from 'react'
import { User, Camera, Trash, GalleryAdd } from 'iconsax-react'
import Image from 'next/image'

interface AvatarUploadProps {
  currentUrl?: string | null
  onUploadComplete?: (url: string) => void
  onDeleteComplete?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  editable?: boolean
  showName?: string
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
}

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 28,
  xl: 36,
}

export function AvatarUpload({
  currentUrl,
  onUploadComplete,
  onDeleteComplete,
  size = 'lg',
  editable = true,
  showName,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = previewUrl || currentUrl

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB')
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
      formData.append('bucket', 'avatars')
      formData.append('fileName', 'avatar.' + (file.name.split('.').pop() || 'jpg'))

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
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/)
      const path = pathMatch?.[1]

      if (!path) {
        throw new Error('Invalid avatar URL')
      }

      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'avatars', path }),
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

  // Get initials from name
  const initials = showName
    ? showName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Circle */}
      <div className={`relative ${sizeClasses[size]} group`}>
        <div
          className={`
            ${sizeClasses[size]} rounded-full overflow-hidden 
            bg-gradient-to-br from-gray-100 to-gray-200
            flex items-center justify-center
            border-2 border-white shadow-lg
            ${uploading ? 'opacity-50' : ''}
          `}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes={size === 'xl' ? '112px' : size === 'lg' ? '80px' : size === 'md' ? '64px' : '40px'}
            />
          ) : initials ? (
            <span className="text-gray-500 font-semibold" style={{ fontSize: iconSizes[size] * 0.6 }}>
              {initials}
            </span>
          ) : (
            <User size={iconSizes[size]} className="text-gray-400" />
          )}
        </div>

        {/* Upload overlay on hover */}
        {editable && !uploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`
              absolute inset-0 rounded-full 
              bg-black/50 opacity-0 group-hover:opacity-100
              flex items-center justify-center
              transition-opacity cursor-pointer
            `}
          >
            <Camera size={iconSizes[size] * 0.6} className="text-white" />
          </button>
        )}

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {editable && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 
              text-xs font-medium text-gray-700 
              bg-white border border-gray-200 rounded-lg
              hover:bg-gray-50 hover:border-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <GalleryAdd size={14} />
            {currentUrl ? 'Change' : 'Upload'}
          </button>
          
          {currentUrl && (
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 
                text-xs font-medium text-red-600 
                bg-white border border-red-200 rounded-lg
                hover:bg-red-50 hover:border-red-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <Trash size={14} />
              Remove
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
