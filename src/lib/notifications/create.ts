import { createClient } from "@/lib/supabase/server";

export type NotificationType = 
  | "invoice_paid"
  | "payment_received"
  | "invoice_overdue"
  | "invoice_sent"
  | "invoice_viewed"
  | "new_customer"
  | "reminder_sent"
  | "system";

export type EntityType = "invoice" | "payment" | "customer" | "receipt";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  entityType?: EntityType;
  entityId?: string;
}

// Type assertion to bypass missing notifications table in generated types
// The notifications table was created via migration and exists in the database
const fromNotifications = (supabase: Awaited<ReturnType<typeof createClient>>) => 
  (supabase as any).from("notifications");

/**
 * Creates a notification for a user
 * This function should be called from server-side code (API routes, webhooks)
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, link, entityType, entityId } = params;

  try {
    const supabase = await createClient();

    const { data, error } = await fromNotifications(supabase)
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link,
        entity_type: entityType,
        entity_id: entityId,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

/**
 * Batch create notifications (e.g., for overdue invoices)
 */
export async function createNotifications(notifications: CreateNotificationParams[]) {
  if (notifications.length === 0) return [];

  try {
    const supabase = await createClient();

    const { data, error } = await fromNotifications(supabase)
      .insert(
        notifications.map((n) => ({
          user_id: n.userId,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link,
          entity_type: n.entityType,
          entity_id: n.entityId,
          is_read: false,
        }))
      )
      .select();

    if (error) {
      console.error("Error creating notifications:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to create notifications:", error);
    return [];
  }
}

// Helper functions for common notification types

export async function notifyInvoicePaid(
  userId: string,
  invoiceNumber: string,
  amount: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "invoice_paid",
    title: "Invoice Paid",
    message: `Invoice ${invoiceNumber} has been paid in full (${amount})`,
    link: `/invoices/${invoiceId}`,
    entityType: "invoice",
    entityId: invoiceId,
  });
}

export async function notifyPaymentReceived(
  userId: string,
  amount: string,
  invoiceNumber: string,
  paymentId: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "payment_received",
    title: "Payment Received",
    message: `You received ${amount} for invoice ${invoiceNumber}`,
    link: `/payments/${paymentId}`,
    entityType: "payment",
    entityId: paymentId,
  });
}

export async function notifyInvoiceOverdue(
  userId: string,
  invoiceNumber: string,
  customerName: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "invoice_overdue",
    title: "Invoice Overdue",
    message: `Invoice ${invoiceNumber} to ${customerName} is now overdue`,
    link: `/invoices/${invoiceId}`,
    entityType: "invoice",
    entityId: invoiceId,
  });
}

export async function notifyInvoiceSent(
  userId: string,
  invoiceNumber: string,
  customerEmail: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "invoice_sent",
    title: "Invoice Sent",
    message: `Invoice ${invoiceNumber} was sent to ${customerEmail}`,
    link: `/invoices/${invoiceId}`,
    entityType: "invoice",
    entityId: invoiceId,
  });
}

export async function notifyInvoiceViewed(
  userId: string,
  invoiceNumber: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "invoice_viewed",
    title: "Invoice Viewed",
    message: `Invoice ${invoiceNumber} was viewed by the customer`,
    link: `/invoices/${invoiceId}`,
    entityType: "invoice",
    entityId: invoiceId,
  });
}

export async function notifyNewCustomer(
  userId: string,
  customerName: string,
  customerId: string
) {
  return createNotification({
    userId,
    type: "new_customer",
    title: "New Contact Added",
    message: `${customerName} has been added to your contacts`,
    link: `/contacts`,
    entityType: "customer",
    entityId: customerId,
  });
}

export async function notifyReminderSent(
  userId: string,
  invoiceNumber: string,
  customerName: string,
  invoiceId: string
) {
  return createNotification({
    userId,
    type: "reminder_sent",
    title: "Reminder Sent",
    message: `Payment reminder sent to ${customerName} for ${invoiceNumber}`,
    link: `/invoices/${invoiceId}`,
    entityType: "invoice",
    entityId: invoiceId,
  });
}
