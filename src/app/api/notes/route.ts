import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notes - List notes with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const pinned = searchParams.get("pinned");
    const sortBy = searchParams.get("sortBy") || "updated_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("notes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    // Apply filters
    if (search) {
      query = query.ilike("content", `%${search}%`);
    }

    if (pinned === "true") {
      query = query.eq("is_pinned", true);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: notes, error, count } = await query;

    if (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }

    // Transform notes for response
    // Note: The notes table stores entity notes (attached to invoices, contacts, etc.)
    // Title is derived from content, no tags/published fields in schema
    const transformedNotes = (notes || []).map((note) => {
      const contentStr = typeof note.content === "string" ? note.content : "";
      // Extract title from first line or generate from content
      const lines = contentStr.split("\n").filter(Boolean);
      const title = lines[0]?.substring(0, 100) || "Untitled Note";
      
      return {
        id: note.id,
        title: title,
        content: note.content,
        preview: contentStr.substring(0, 150),
        entity_type: note.entity_type,
        entity_id: note.entity_id,
        tags: [] as string[],
        category: note.entity_type, // Use entity_type as category
        is_pinned: note.is_pinned || false,
        is_published: Boolean(note.is_published),
        published_at: note.published_at || null,
        word_count: contentStr.split(/\s+/).filter(Boolean).length,
        attachment_count: 0,
        created_at: note.created_at,
        updated_at: note.updated_at,
      };
    });

    return NextResponse.json({
      notes: transformedNotes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
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
    const { content, entity_type, entity_id, is_pinned } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!entity_type || !entity_id) {
      return NextResponse.json({ error: "entity_type and entity_id are required" }, { status: 400 });
    }

    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        content: content,
        entity_type: entity_type,
        entity_id: entity_id,
        is_pinned: is_pinned || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
