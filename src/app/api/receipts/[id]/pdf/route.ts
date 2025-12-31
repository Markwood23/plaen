import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptPDF } from "@/lib/receipts/pdf-template";

// GET /api/receipts/[id]/pdf - Generate PDF for a receipt
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

    // Get user/business info
    const { data: userProfile } = await supabase
      .from("users")
      .select("full_name, business_name, email")
      .eq("id", user.id)
      .single();

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
        invoice = {
          invoice_number: invoiceData.invoice_number,
          issue_date: invoiceData.issue_date,
          due_date: invoiceData.due_date,
          subtotal: (invoiceData.subtotal || 0) / 100,
          discount: (invoiceData.discount_amount || 0) / 100,
          tax: (invoiceData.tax_amount || 0) / 100,
          total: (invoiceData.total || 0) / 100,
          status: invoiceData.status,
          notes: invoiceData.notes,
        };

        // Get customer separately
        if (invoiceData.customer_id) {
          const { data: customerData } = await supabase
            .from("customers")
            .select("id, name, email, phone, company")
            .eq("id", invoiceData.customer_id)
            .single();
          
          if (customerData) {
            customer = {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              company: customerData.company,
            };
          }
        }
      }
    }

    // Parse snapshot data for line items
    const snapshotData = (receipt.snapshot_data as Record<string, unknown>) || {};
    const verificationTail =
      snapshotData &&
      typeof snapshotData === 'object' &&
      !Array.isArray(snapshotData) &&
      (snapshotData as any).verification &&
      typeof (snapshotData as any).verification.tail === 'string'
        ? String((snapshotData as any).verification.tail)
        : undefined;

    const lineItems = (snapshotData.line_items as Array<{
      label: string;
      description?: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }>) || [];

    // Build receipt data for PDF
    const receiptData = {
      receipt_number: receipt.receipt_number,
      created_at: receipt.created_at || new Date().toISOString(),
      payment: {
        amount: (payment.amount || 0) / 100,
        currency: payment.currency || 'GHS',
        method: payment.payment_method || 'other',
        date: payment.payment_date || receipt.created_at || new Date().toISOString(),
        payer_name: payment.payer_name,
        payer_email: payment.payer_email,
      },
      invoice: invoice,
      customer: customer,
      snapshot_data: {
        line_items: lineItems,
        verification: verificationTail ? { tail: verificationTail } : undefined,
      },
    };

    const businessData = {
      name: userProfile?.business_name || userProfile?.full_name || 'Plaen User',
      email: userProfile?.email,
      address: null as string | null, // Address not available in current schema
    };

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      ReceiptPDF({ receipt: receiptData, business: businessData })
    );

    // Return PDF as downloadable response
    const filename = `receipt-${receipt.receipt_number}.pdf`;
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating receipt PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
