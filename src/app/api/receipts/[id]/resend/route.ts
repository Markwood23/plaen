import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentConfirmationEmail, isEmailConfigured } from "@/lib/email/mailjet";

// POST /api/receipts/[id]/resend - Resend receipt email to customer
export async function POST(
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

    // Get receipt data
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

    if (error || !receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Get payment details and verify user owns this receipt
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, user_id, amount, currency, payment_method, payment_date")
      .eq("id", receipt.payment_id)
      .single();

    if (paymentError || !payment || payment.user_id !== user.id) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Get invoice and customer details
    let invoice = null;
    let customer = null;
    let lineItems: { description: string; quantity: number | null; unit_price: number; amount: number }[] = [];
    if (receipt.invoice_id) {
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select(`
          id,
          invoice_number,
          currency,
          balance_due,
          customer_id
        `)
        .eq("id", receipt.invoice_id)
        .single();
      
      if (invoiceData) {
        invoice = invoiceData;
        
        // Fetch line items
        const { data: lineItemsData } = await supabase
          .from("invoice_line_items")
          .select("description, quantity, unit_price, amount")
          .eq("invoice_id", receipt.invoice_id)
          .order("sort_order");
        if (lineItemsData) {
          lineItems = lineItemsData;
        }
        
        if (invoiceData.customer_id) {
          const { data: customerData } = await supabase
            .from("customers")
            .select("id, name, email")
            .eq("id", invoiceData.customer_id)
            .single();
          customer = customerData;
        }
      }
    }

    // Get customer email from various sources
    const snapshotData = receipt.snapshot_data as Record<string, unknown> | null;
    const payerInfo = snapshotData?.payer as { email?: string; name?: string } | undefined;
    const customerEmail = customer?.email || payerInfo?.email;
    const customerName = customer?.name || payerInfo?.name || "Customer";

    if (!customerEmail) {
      return NextResponse.json({ error: "No customer email found for this receipt" }, { status: 400 });
    }

    // Get business profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("full_name, business_name, email")
      .eq("id", user.id)
      .single();

    const businessName = userProfile?.business_name || userProfile?.full_name || "Your Business";

    // Check email configuration
    if (!isEmailConfigured()) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Format amounts
    const amountMajor = (payment.amount / 100).toFixed(2);
    const remainingMinor = invoice?.balance_due || 0;
    const remainingMajor = (remainingMinor / 100).toFixed(2);

    // Format line items for email
    const emailLineItems = lineItems.length > 0 
      ? lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity || 1,
          unitPrice: (item.unit_price || 0) / 100,
          total: (item.amount || 0) / 100,
        }))
      : undefined;

    // Send the receipt email
    await sendPaymentConfirmationEmail({
      recipientEmail: customerEmail,
      recipientName: customerName,
      invoiceNumber: invoice?.invoice_number || "N/A",
      amountPaid: amountMajor,
      currency: payment.currency || "GHS",
      paymentMethod: payment.payment_method || "Payment",
      paymentDate: payment.payment_date 
        ? new Date(payment.payment_date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
      remainingBalance: remainingMinor > 0 ? remainingMajor : undefined,
      receiptLink: `${process.env.NEXT_PUBLIC_APP_URL}/receipts`,
      businessName,
      businessEmail: userProfile?.email || undefined,
      receiptNumber: receipt.receipt_number,
      lineItems: emailLineItems,
    });

    return NextResponse.json({ success: true, message: "Receipt sent successfully" });
  } catch (error) {
    console.error("Error in POST /api/receipts/[id]/resend:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
