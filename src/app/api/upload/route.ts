import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Bucket configurations for server-side validation
const BUCKET_CONFIG = {
  avatars: {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  logos: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  },
  attachments: {
    maxSize: 10 * 1024 * 1024,
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
} as const

type BucketName = keyof typeof BUCKET_CONFIG

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = formData.get('bucket') as BucketName | null
    const folder = formData.get('folder') as string | null
    const customFileName = formData.get('fileName') as string | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!bucket || !BUCKET_CONFIG[bucket]) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }
    
    const config = BUCKET_CONFIG[bucket]
    
    // Validate file size
    if (file.size > config.maxSize) {
      const maxMB = config.maxSize / (1024 * 1024)
      return NextResponse.json({ error: `File size exceeds ${maxMB}MB limit` }, { status: 400 })
    }
    
    // Validate file type
    if (!(config.allowedTypes as readonly string[]).includes(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} is not allowed` }, { status: 400 })
    }
    
    // Generate filename
    const ext = file.name.split('.').pop() || ''
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const fileName = customFileName || `${timestamp}-${random}.${ext}`
    
    // Build path: userId/[folder/]filename
    const pathParts = [user.id]
    if (folder) pathParts.push(folder)
    pathParts.push(fileName)
    const filePath = pathParts.join('/')
    
    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)
    
    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    // If this is an avatar or logo, update the user's profile
    if (bucket === 'avatars') {
      await supabase
        .from('users')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id)
    } else if (bucket === 'logos') {
      await supabase
        .from('users')
        .update({ logo_url: urlData.publicUrl })
        .eq('id', user.id)
    }
    
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/upload - Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { bucket, path } = await request.json()
    
    if (!bucket || !path) {
      return NextResponse.json({ error: 'Bucket and path are required' }, { status: 400 })
    }
    
    // Verify the path belongs to the user
    if (!path.startsWith(user.id + '/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    
    // If this was an avatar or logo, clear the URL
    if (bucket === 'avatars') {
      await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id)
    } else if (bucket === 'logos') {
      await supabase
        .from('users')
        .update({ logo_url: null })
        .eq('id', user.id)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
