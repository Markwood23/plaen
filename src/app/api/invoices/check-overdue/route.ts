import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { sendPaymentReminderEmail, isEmailConfigured } from '@/lib/email/mailjet';

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/invoices/check-overdue - Mark overdue invoices and optionally send notifications
// Can be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized request (cron job or admin)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow requests with valid cron secret or from authenticated users
    const isCronRequest = cronSecret && authHeader === `Bearer ${cronSecret}`;
    
    if (!isCronRequest) {
      // Check for authenticated user (admin could call this manually)
      const supabaseAuth = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabaseAuth.auth.getUser(
        request.headers.get('authorization')?.replace('Bearer ', '') || ''
      );
      
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const supabase = getServiceClient();
    const today = new Date().toISOString().split('T')[0];
    const body = await request.json().catch(() => ({}));
    const sendEmails = body.send_emails !== false; // Default to true

    // Find all invoices that are past due date and not yet marked overdue
    // Only consider sent, viewed, or partially_paid invoices
    const { data: overdueInvoices, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        user_id,
        customer_id,
        due_date,
        total,
        balance_due,
        currency,
        status
      `)
      .lt('due_date', today)
      .gt('balance_due', 0)
      .in('status', ['sent', 'viewed', 'partially_paid'])
      .order('due_date', { ascending: true });

    if (fetchError) {
      console.error('Error fetching overdue invoices:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    if (!overdueInvoices || overdueInvoices.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No overdue invoices found',
        updated: 0,
        emails_sent: 0,
      });
    }

    // Update all overdue invoices
    const invoiceIds = overdueInvoices.map(inv => inv.id);
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        status: 'overdue',
        updated_at: new Date().toISOString(),
      })
      .in('id', invoiceIds);

    if (updateError) {
      console.error('Error updating overdue invoices:', updateError);
      return NextResponse.json({ error: 'Failed to update invoices' }, { status: 500 });
    }

    // Send overdue notification emails if configured
    let emailsSent = 0;
    if (sendEmails && isEmailConfigured()) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Get customer and user info for emails
      const customerIds = [...new Set(
        overdueInvoices
          .map(inv => inv.customer_id)
          .filter((id): id is string => typeof id === 'string')
      )];
      
      const userIds = [...new Set(overdueInvoices.map(inv => inv.user_id))];

      const [{ data: customers }, { data: users }] = await Promise.all([
        customerIds.length > 0
          ? supabase.from('customers').select('id, name, email').in('id', customerIds)
          : Promise.resolve({ data: [] as Array<{ id: string; name: string | null; email: string | null }> }),
        supabase.from('users').select('id, full_name, business_name').in('id', userIds),
      ]);

      const customersMap = new Map((customers || []).map(c => [c.id, c]));
      const usersMap = new Map((users || []).map(u => [u.id, u]));

      for (const invoice of overdueInvoices) {
        const customer = invoice.customer_id ? customersMap.get(invoice.customer_id) : null;
        const user = usersMap.get(invoice.user_id);

        if (customer?.email) {
          try {
            const daysOverdue = Math.floor(
              (new Date().getTime() - new Date(invoice.due_date || '').getTime()) / (1000 * 60 * 60 * 24)
            );
            
            await sendPaymentReminderEmail({
              customerEmail: customer.email,
              customerName: customer.name || 'Customer',
              invoiceNumber: invoice.invoice_number || '',
              amount: ((invoice.balance_due || 0) / 100).toFixed(2),
              currency: invoice.currency || 'GHS',
              dueDate: invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A',
              daysOverdue,
              paymentLink: `${baseUrl}/pay/${invoice.id}`,
              businessName: user?.business_name || user?.full_name || 'Plaen User',
            });
            emailsSent++;
          } catch (emailError) {
            console.error(`Failed to send overdue email for invoice ${invoice.id}:`, emailError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Marked ${invoiceIds.length} invoice(s) as overdue`,
      updated: invoiceIds.length,
      emails_sent: emailsSent,
      invoice_ids: invoiceIds,
    });
  } catch (error) {
    console.error('Error in check-overdue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check status (useful for monitoring)
export async function GET() {
  const supabase = getServiceClient();
  const today = new Date().toISOString().split('T')[0];

  // Count potentially overdue invoices (not yet marked)
  const { count: pendingCount } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .lt('due_date', today)
    .gt('balance_due', 0)
    .in('status', ['sent', 'viewed', 'partially_paid']);

  // Count already overdue invoices
  const { count: overdueCount } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'overdue')
    .gt('balance_due', 0);

  return NextResponse.json({
    pending_to_mark_overdue: pendingCount || 0,
    currently_overdue: overdueCount || 0,
    checked_at: new Date().toISOString(),
  });
}
