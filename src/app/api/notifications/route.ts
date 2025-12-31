import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitedResponse } from "@/lib/rate-limit";

// Type assertion to bypass missing notifications table in generated types
// The notifications table was created via migration and exists in the database
const fromNotifications = (supabase: Awaited<ReturnType<typeof createClient>>) => 
  (supabase as any).from("notifications");

// GET /api/notifications - List user's notifications
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = getClientIdentifier(request as any, user.id);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.api.read);
    if (!rateLimitResult.success) {
      return rateLimitedResponse(rateLimitResult);
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    let query = fromNotifications(supabase)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }

    // Also get unread count
    const { count: unreadCount } = await fromNotifications(supabase)
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = getClientIdentifier(request as any, user.id);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.api.write);
    if (!rateLimitResult.success) {
      return rateLimitedResponse(rateLimitResult);
    }

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      // Mark all notifications as read
      const { error } = await fromNotifications(supabase)
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error("Error marking all as read:", error);
        return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
      }
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const { error } = await fromNotifications(supabase)
        .update({ is_read: true })
        .eq("user_id", user.id)
        .in("id", notificationIds);

      if (error) {
        console.error("Error marking notifications as read:", error);
        return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/notifications - Clear notifications
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = getClientIdentifier(request as any, user.id);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.api.write);
    if (!rateLimitResult.success) {
      return rateLimitedResponse(rateLimitResult);
    }

    const { searchParams } = new URL(request.url);
    const clearAll = searchParams.get("all") === "true";
    const notificationId = searchParams.get("id");

    if (clearAll) {
      // Delete all read notifications (keep unread)
      const { error } = await fromNotifications(supabase)
        .delete()
        .eq("user_id", user.id)
        .eq("is_read", true);

      if (error) {
        console.error("Error clearing notifications:", error);
        return NextResponse.json({ error: "Failed to clear notifications" }, { status: 500 });
      }
    } else if (notificationId) {
      // Delete specific notification
      const { error } = await fromNotifications(supabase)
        .delete()
        .eq("user_id", user.id)
        .eq("id", notificationId);

      if (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
