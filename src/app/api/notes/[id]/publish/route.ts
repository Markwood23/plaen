import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notes/[id]/publish - Publish a note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure note exists and belongs to user
    const { data: existing, error: existingError } = await supabase
      .from('notes')
      .select('id, is_published, published_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (existingError) {
      if (existingError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }
      console.error('Error fetching note for publish:', existingError);
      return NextResponse.json({ error: 'Failed to publish note' }, { status: 500 });
    }

    if (existing?.is_published) {
      return NextResponse.json({
        note: {
          id: existing.id,
          is_published: true,
          published_at: existing.published_at,
        },
      });
    }

    const publishedAt = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from('notes')
      .update({ is_published: true, published_at: publishedAt })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, is_published, published_at')
      .single();

    if (updateError) {
      console.error('Error publishing note:', updateError);
      return NextResponse.json({ error: 'Failed to publish note' }, { status: 500 });
    }

    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error('Error in POST /api/notes/[id]/publish:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
