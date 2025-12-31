import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { NotePDF } from '@/lib/notes/pdf-template';

// GET /api/notes/[id]/pdf - Export note as PDF
export async function GET(
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

    const { data: note, error } = await supabase
      .from('notes')
      .select('id, content, created_at, updated_at, is_published, published_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }
      console.error('Error fetching note for PDF:', error);
      return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
    }

    const contentStr = typeof note.content === 'string' ? note.content : JSON.stringify(note.content, null, 2);
    const lines = contentStr.split('\n').filter(Boolean);
    const title = lines[0]?.substring(0, 100) || 'Untitled Note';

    const pdfBuffer = await renderToBuffer(
      NotePDF({
        title,
        content: contentStr,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        isPublished: note.is_published,
        publishedAt: note.published_at,
      })
    );

    const filename = `note-${id}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/notes/[id]/pdf:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
