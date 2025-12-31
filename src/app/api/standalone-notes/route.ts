import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/standalone-notes - List all standalone notes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("q") || searchParams.get("search");
    const category = searchParams.get("category");
    const pinned = searchParams.get("pinned");
    const archived = searchParams.get("archived");
    const tag = searchParams.get("tag");

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("standalone_notes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    // Filter out archived by default
    if (archived !== "true") {
      query = query.eq("is_archived", false);
    }

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (pinned === "true") {
      query = query.eq("is_pinned", true);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    // Order by pinned first, then by updated_at
    query = query
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: notes, error, count } = await query;

    if (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }

    // Transform notes for response
    const transformedNotes = (notes || []).map((note) => {
      const contentStr = note.content || "";
      return {
        id: note.id,
        title: note.title || "Untitled",
        content: note.content,
        blocks: note.blocks,
        preview: contentStr.substring(0, 200),
        tags: note.tags || [],
        category: note.category,
        is_pinned: note.is_pinned || false,
        is_archived: note.is_archived || false,
        word_count: note.word_count || contentStr.split(/\s+/).filter(Boolean).length,
        attachment_count: 0, // Future feature
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
    console.error("Error in GET /api/standalone-notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/standalone-notes - Create a new standalone note
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, blocks, tags, category, is_pinned } = body;

    // Calculate word count
    const wordCount = (content || "").split(/\s+/).filter(Boolean).length;

    const { data: note, error } = await supabase
      .from("standalone_notes")
      .insert({
        user_id: user.id,
        title: title || "Untitled",
        content: content || "",
        blocks: blocks || [],
        tags: tags || [],
        category: category || null,
        is_pinned: is_pinned || false,
        word_count: wordCount,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/standalone-notes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
