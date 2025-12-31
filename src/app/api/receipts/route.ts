import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/receipts - List receipts with filters
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
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Query receipt_snapshots with basic fields only (relationships handled via joins)
    let query = supabase
      .from("receipt_snapshots")
      .select(`
        id,
        payment_id,
        invoice_id,
        receipt_number,
        snapshot_data,
        created_at
      `, { count: "exact" });

    // Apply search filter
    if (search) {
      query = query.or(`invoices.invoice_number.ilike.%${search}%`);
    }

    // Apply date filters
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: receipts, error, count } = await query;

    if (error) {
      console.error("Error fetching receipts:", error);
      return NextResponse.json({
        receipts: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Get payment IDs to filter by user
    const paymentIds = (receipts || []).map(r => r.payment_id).filter(Boolean);
    
    // Get payments for user verification and details
    const { data: payments } = await supabase
      .from("payments")
      .select("id, user_id, amount, currency, payment_method, payment_date")
      .in("id", paymentIds.length > 0 ? paymentIds : ['no-match'])
      .eq("user_id", user.id);
    
    const paymentMap = new Map((payments || []).map(p => [p.id, p]));
    
    // Filter receipts to only those belonging to user's payments
    const userReceipts = (receipts || []).filter(r => paymentMap.has(r.payment_id));
    
    // Get invoice details
    const invoiceIds = userReceipts.map(r => r.invoice_id).filter((id): id is string => id !== null);
    const { data: invoices } = await supabase
      .from("invoices")
      .select("id, invoice_number, customer_id")
      .in("id", invoiceIds.length > 0 ? invoiceIds : ['no-match']);
    
    // Get customer names
    const customerIds = (invoices || []).map(i => i.customer_id).filter((id): id is string => id !== null);
    const { data: customers } = await supabase
      .from("customers")
      .select("id, name")
      .in("id", customerIds.length > 0 ? customerIds : ['no-match']);
    
    const customerMap = new Map((customers || []).map(c => [c.id, c]));
    const invoiceMap = new Map((invoices || []).map(i => [i.id, { ...i, customer: customerMap.get(i.customer_id || '') }]));

    // Transform receipts for response
    const transformedReceipts = userReceipts.map((receipt) => {
      const payment = paymentMap.get(receipt.payment_id);
      const invoice = receipt.invoice_id ? invoiceMap.get(receipt.invoice_id) : null;
      const customer = invoice?.customer;
      const snapshotData = receipt.snapshot_data as Record<string, unknown> || {};
      
      return {
        id: receipt.id,
        receipt_id: receipt.receipt_number,
        invoice_id: receipt.invoice_id,
        invoice_number: invoice?.invoice_number || "N/A",
        vendor: customer?.name || "Unknown",
        category: "payment",
        amount: (payment?.amount || 0) / 100,
        currency: payment?.currency || "GHS",
        date: payment?.payment_date || receipt.created_at,
        status: "verified" as const,
        payment_method: payment?.payment_method || "N/A",
        snapshot_data: snapshotData,
        created_at: receipt.created_at,
        updated_at: receipt.created_at,
      };
    });

    return NextResponse.json({
      receipts: transformedReceipts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/receipts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/receipts - Create a receipt (typically done automatically on payment)
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
    const { payment_id, invoice_id, snapshot_data } = body;

    if (!payment_id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    // Verify the payment belongs to the user
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, user_id")
      .eq("id", payment_id)
      .eq("user_id", user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Generate receipt number
    const receiptNumber = `REC-${Date.now().toString(36).toUpperCase()}-${payment_id.substring(0, 4).toUpperCase()}`;

    const { data: receipt, error } = await supabase
      .from("receipt_snapshots")
      .insert({
        payment_id,
        invoice_id: invoice_id || null,
        receipt_number: receiptNumber,
        snapshot_data: snapshot_data || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating receipt:", error);
      return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 });
    }

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/receipts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
