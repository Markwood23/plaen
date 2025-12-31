import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const ATTACHMENTS_BUCKET = 'attachments'
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

function sanitizeFilename(name: string) {
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(0, 160)
}

function isAllowedMimeType(mimeType: string) {
  return (
    mimeType === 'application/pdf' ||
    mimeType === 'image/png' ||
    mimeType === 'image/jpeg'
  )
}

// GET /api/attachments?entity_id=...&entity_type=invoice
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entity_id')
    const entityType = searchParams.get('entity_type')

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: 'Missing entity_id or entity_type' },
        { status: 400 }
      )
    }

    const { data: attachments, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('user_id', user.id)
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching attachments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const admin = createAdminClient()

    const enriched = await Promise.all(
      (attachments || []).map(async (att) => {
        const storagePath = att.file_url
        const { data: signed, error: signedError } = await admin.storage
          .from(ATTACHMENTS_BUCKET)
          .createSignedUrl(storagePath, 60 * 60)

        if (signedError) {
          console.warn('Failed to create signed URL:', signedError)
        }

        return {
          ...att,
          download_url: signed?.signedUrl || null,
        }
      })
    )

    return NextResponse.json({ attachments: enriched })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/attachments (multipart/form-data): file, entity_id, entity_type
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const entityId = formData.get('entity_id')
    const entityType = formData.get('entity_type')
    const file = formData.get('file')

    if (typeof entityId !== 'string' || typeof entityType !== 'string') {
      return NextResponse.json(
        { error: 'Missing entity_id or entity_type' },
        { status: 400 }
      )
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    if (!file.size || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      )
    }

    const mimeType = file.type || 'application/octet-stream'
    if (!isAllowedMimeType(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type (PDF, PNG, JPG only)' },
        { status: 400 }
      )
    }

    const safeName = sanitizeFilename(file.name || 'attachment')
    const random = crypto.randomUUID()
    const storagePath = `${user.id}/${entityType}/${entityId}/${random}-${safeName}`

    const admin = createAdminClient()

    const arrayBuffer = await file.arrayBuffer()
    const uploadBytes = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await admin.storage
      .from(ATTACHMENTS_BUCKET)
      .upload(storagePath, uploadBytes, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    const { data: inserted, error: insertError } = await supabase
      .from('attachments')
      .insert({
        entity_id: entityId,
        entity_type: entityType,
        file_name: file.name,
        file_url: storagePath,
        mime_type: mimeType,
        file_size: file.size,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError || !inserted) {
      console.error('Insert error:', insertError)
      await admin.storage.from(ATTACHMENTS_BUCKET).remove([storagePath])
      return NextResponse.json(
        { error: insertError?.message || 'Failed to save attachment' },
        { status: 500 }
      )
    }

    const { data: signed, error: signedError } = await admin.storage
      .from(ATTACHMENTS_BUCKET)
      .createSignedUrl(storagePath, 60 * 60)

    if (signedError) {
      console.warn('Failed to create signed URL:', signedError)
    }

    return NextResponse.json({
      attachment: {
        ...inserted,
        download_url: signed?.signedUrl || null,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
