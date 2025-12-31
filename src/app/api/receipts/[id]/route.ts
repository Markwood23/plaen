import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/receipts/[id] - Get a single receipt
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

    // Get receipt basic data
    const { data: receipt, error } = await supabase
      .from("receipt_snapshots")
      .select(`
        id,
        payment_id,
        invoice_id,
        receipt_number,
        snapshot_data,
        created_at
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
      }
      console.error("Error fetching receipt:", error);
      return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 });
    }

    // Get payment details and verify user owns this receipt
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, user_id, amount, currency, payment_method, payment_date, payer_name, payer_email")
      .eq("id", receipt.payment_id)
      .single();

    if (paymentError || !payment || payment.user_id !== user.id) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Get invoice details if linked
    let invoice = null;
    let customer = null;
    if (receipt.invoice_id) {
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select(`
          id,
          invoice_number,
          issue_date,
          due_date,
          subtotal,
          discount_amount,
          tax_amount,
          total,
          balance_due,
          currency,
          status,
          notes,
          customer_id
        `)
        .eq("id", receipt.invoice_id)
        .single();
      
      if (invoiceData) {
        invoice = invoiceData;
        // Get customer separately
        if (invoiceData.customer_id) {
          const { data: customerData } = await supabase
            .from("customers")
            .select("id, name, email, phone, company")
            .eq("id", invoiceData.customer_id)
            .single();
          customer = customerData;
        }
      }
    }

    const snapshotData = receipt.snapshot_data as Record<string, unknown> || {};

    // Transform receipt for response
    const transformedReceipt = {
      id: receipt.id,
      receipt_number: receipt.receipt_number,
      payment_id: receipt.payment_id,
      invoice_id: receipt.invoice_id,
      snapshot_data: snapshotData,
      payment: {
        amount: payment.amount / 100,
        currency: payment.currency,
        method: payment.payment_method,
        date: payment.payment_date,
        payer_name: payment.payer_name,
        payer_email: payment.payer_email,
      },
      invoice: invoice ? {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: (invoice.subtotal || 0) / 100,
        discount: (invoice.discount_amount || 0) / 100,
        tax: (invoice.tax_amount || 0) / 100,
        total: (invoice.total || 0) / 100,
        balance: (invoice.balance_due || 0) / 100,
        currency: invoice.currency,
        status: invoice.status,
        notes: invoice.notes,
      } : null,
      customer: customer ? {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      } : null,
      created_at: receipt.created_at,
    };

    return NextResponse.json({ receipt: transformedReceipt });
  } catch (error) {
    console.error("Error in GET /api/receipts/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/receipts/[id] - Receipts should NOT be deletable (immutable)
// But we provide this endpoint with an error message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "Receipts are immutable and cannot be deleted" },
    { status: 403 }
  );
}

// PATCH /api/receipts/[id] - Receipts should NOT be modifiable (immutable)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "Receipts are immutable and cannot be modified" },
    { status: 403 }
  );
}
