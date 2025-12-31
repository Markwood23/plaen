/**
 * Supabase Storage Upload Utilities
 * 
 * Handles file uploads to different buckets:
 * - avatars: User profile pictures (2MB, images only)
 * - logos: Business logos for invoices (5MB, images + SVG)
 * - attachments: Invoice documents (10MB, images + docs)
 */

import { createClient } from '@/lib/supabase/client'

export type BucketName = 'avatars' | 'logos' | 'attachments'

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface UploadOptions {
  bucket: BucketName
  file: File
  userId: string
  folder?: string  // Optional subfolder within user's directory
  fileName?: string  // Optional custom filename (defaults to original)
}

// Bucket configurations
const BUCKET_CONFIG = {
  avatars: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  logos: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  },
  attachments: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv', 'text/plain'
    ],
  },
}

/**
 * Validate file before upload
 */
function validateFile(file: File, bucket: BucketName): { valid: boolean; error?: string } {
  const config = BUCKET_CONFIG[bucket]
  
  if (file.size > config.maxSize) {
    const maxMB = config.maxSize / (1024 * 1024)
    return { valid: false, error: `File size exceeds ${maxMB}MB limit` }
  }
  
  if (!config.allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` }
  }
  
  return { valid: true }
}

/**
 * Generate a unique filename
 */
function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop() || ''
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}.${ext}`
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { bucket, file, userId, folder, fileName } = options
  
  // Validate file
  const validation = validateFile(file, bucket)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  
  const supabase = createClient()
  
  // Build the file path: userId/[folder/]filename
  const finalFileName = fileName || generateFileName(file.name)
  const pathParts = [userId]
  if (folder) pathParts.push(folder)
  pathParts.push(finalFileName)
  const filePath = pathParts.join('/')
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Replace if exists
      })
    
    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    }
  } catch (err) {
    console.error('Upload exception:', err)
    return { success: false, error: 'Failed to upload file' }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: BucketName, path: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (err) {
    console.error('Delete exception:', err)
    return { success: false, error: 'Failed to delete file' }
  }
}

/**
 * Upload avatar specifically
 */
export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
  // For avatars, we use a fixed filename so it's always the same URL
  return uploadFile({
    bucket: 'avatars',
    file,
    userId,
    fileName: 'avatar.' + (file.name.split('.').pop() || 'jpg'),
  })
}

/**
 * Upload business logo specifically
 */
export async function uploadLogo(file: File, userId: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'logos',
    file,
    userId,
    fileName: 'logo.' + (file.name.split('.').pop() || 'png'),
  })
}

/**
 * Upload invoice attachment
 */
export async function uploadAttachment(file: File, userId: string, invoiceId?: string): Promise<UploadResult> {
  return uploadFile({
    bucket: 'attachments',
    file,
    userId,
    folder: invoiceId ? `invoices/${invoiceId}` : 'general',
  })
}

/**
 * Get signed URL for private attachments
 */
export async function getSignedUrl(bucket: BucketName, path: string, expiresIn = 3600): Promise<{ url?: string; error?: string }> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) {
      return { error: error.message }
    }
    
    return { url: data.signedUrl }
  } catch (err) {
    console.error('Signed URL error:', err)
    return { error: 'Failed to generate signed URL' }
  }
}
