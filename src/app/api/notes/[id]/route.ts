import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notes/[id] - Get a single note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: note, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      console.error("Error fetching note:", error);
      return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
    }

    // Transform note for response
    const contentStr = typeof note.content === "string" ? note.content : "";
    const lines = contentStr.split("\n").filter(Boolean);
    const title = lines[0]?.substring(0, 100) || "Untitled Note";
    
    const transformedNote = {
      id: note.id,
      title: title,
      content: note.content,
      preview: contentStr.substring(0, 150),
      entity_type: note.entity_type,
      entity_id: note.entity_id,
      tags: [] as string[],
      category: note.entity_type,
      is_pinned: note.is_pinned || false,
      is_published: Boolean(note.is_published),
      published_at: note.published_at || null,
      word_count: contentStr.split(/\s+/).filter(Boolean).length,
      attachment_count: 0,
      created_at: note.created_at,
      updated_at: note.updated_at,
    };

    return NextResponse.json({ note: transformedNote });
  } catch (error) {
    console.error("Error in GET /api/notes/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/notes/[id] - Update a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, is_pinned } = body;

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    if (content !== undefined) updates.content = content;
    if (is_pinned !== undefined) updates.is_pinned = is_pinned;

    const { data: note, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      console.error("Error updating note:", error);
      return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error in PATCH /api/notes/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/notes/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
