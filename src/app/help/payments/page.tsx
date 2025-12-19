"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, CloseCircle, Clock, Coin1, RefreshCircle } from "iconsax-react";

const paymentStatuses = [
  {
    status: "Pending",
    description: "Invoice sent, awaiting payment",
    color: "#F59E0B",
    icon: Clock
  },
  {
    status: "Processing",
    description: "Payment initiated, being processed",
    color: "#0D9488",
    icon: RefreshCircle
  },
  {
    status: "Paid",
    description: "Full payment received",
    color: "#14462a",
    icon: TickCircle
  },
  {
    status: "Partial",
    description: "Part of the amount paid",
    color: "#6B7280",
    icon: Coin1
  },
  {
    status: "Failed",
    description: "Payment attempt unsuccessful",
    color: "#DC2626",
    icon: CloseCircle
  }
];

export default function PaymentsPage() {
  return (
    <HelpArticleLayout
      title="Understanding Payments"
      description="Learn how payment tracking works, understand payment statuses, and manage your incoming payments effectively."
      category="Payments"
      categoryColor="#D97706"
      readTime="4 min read"
      relatedArticles={[
        {
          title: "Setting up payment methods",
          description: "Configure how you get paid",
          slug: "payment-setup",
          readTime: "3 min read"
        },
        {
          title: "Mobile money payments",
          description: "Accept MTN, Vodafone, AirtelTigo",
          slug: "mobile-money",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>Payment Tracking Overview</h2>
      <p>
        Plaen automatically tracks payments against your invoices, giving you 
        real-time visibility into your cash flow and outstanding amounts.
      </p>

      <h2>Payment Statuses</h2>
      <p>
        Each invoice has a payment status that updates automatically:
      </p>

      <div className="not-prose my-8 space-y-4">
        {paymentStatuses.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.status}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
            >
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon size={20} color={item.color} variant="Bulk" />
              </div>
              <div>
                <h3 className="font-semibold text-black">{item.status}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2>How Payment Tracking Works</h2>

      <h3>Automatic Matching</h3>
      <p>
        When a client pays using the payment link in their invoice, Plaen 
        automatically:
      </p>
      <ul>
        <li>Records the payment amount and date</li>
        <li>Updates the invoice status</li>
        <li>Sends you a notification</li>
        <li>Marks the invoice as paid (if full amount)</li>
      </ul>

      <h3>Manual Payment Recording</h3>
      <p>
        For payments received outside Plaen (cash, check, direct transfer):
      </p>
      <ol>
        <li>Open the invoice</li>
        <li>Click <strong>"Record Payment"</strong></li>
        <li>Enter the amount received</li>
        <li>Add payment method and reference</li>
        <li>Save the payment record</li>
      </ol>

      <h2>Payment Notifications</h2>
      <p>
        Stay informed about your payments:
      </p>
      <ul>
        <li><strong>Payment received:</strong> Instant notification when paid</li>
        <li><strong>Payment failed:</strong> Alert if a payment attempt fails</li>
        <li><strong>Overdue reminder:</strong> When invoices pass their due date</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">📱 Mobile notifications:</strong> Enable push 
          notifications in your account settings to get instant payment alerts on your phone.
        </p>
      </div>

      <h2>Viewing Payment History</h2>
      <p>
        Access your complete payment history from the dashboard:
      </p>
      <ol>
        <li>Go to <strong>Payments</strong> in the main navigation</li>
        <li>View all payments with filters for date, status, and client</li>
        <li>Click any payment to see full details</li>
        <li>Export payment data for accounting</li>
      </ol>

      <h3>Payment Details</h3>
      <p>
        Each payment record includes:
      </p>
      <ul>
        <li>Amount received</li>
        <li>Payment method used</li>
        <li>Transaction reference</li>
        <li>Date and time</li>
        <li>Linked invoice</li>
        <li>Payer information</li>
      </ul>

      <h2>Partial Payments</h2>
      <p>
        Plaen supports partial payments for flexible billing:
      </p>
      <ul>
        <li>Accept deposits before starting work</li>
        <li>Allow milestone payments</li>
        <li>Track remaining balance automatically</li>
        <li>Send reminders for outstanding amounts</li>
      </ul>

      <h3>How Partial Payments Work</h3>
      <ol>
        <li>Client pays any amount less than total</li>
        <li>Invoice status changes to "Partial"</li>
        <li>Balance due is calculated automatically</li>
        <li>Client can pay remaining amount later</li>
        <li>Status changes to "Paid" when complete</li>
      </ol>

      <h2>Payment Timeline</h2>
      <p>
        Different payment methods have different processing times:
      </p>

      <div className="not-prose my-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">Method</th>
              <th className="px-4 py-3 text-left font-semibold text-black">Processing Time</th>
              <th className="px-4 py-3 text-left font-semibold text-black">When You'll See It</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-gray-700">Mobile Money</td>
              <td className="px-4 py-3 text-gray-700">Instant</td>
              <td className="px-4 py-3 text-gray-700">Immediately</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Bank Transfer (local)</td>
              <td className="px-4 py-3 text-gray-700">1-2 business days</td>
              <td className="px-4 py-3 text-gray-700">When cleared</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Bank Transfer (intl)</td>
              <td className="px-4 py-3 text-gray-700">3-5 business days</td>
              <td className="px-4 py-3 text-gray-700">When cleared</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Cryptocurrency</td>
              <td className="px-4 py-3 text-gray-700">Minutes to hours</td>
              <td className="px-4 py-3 text-gray-700">After confirmations</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Handling Payment Issues</h2>

      <h3>Payment Not Showing</h3>
      <p>
        If a client says they've paid but you don't see it:
      </p>
      <ol>
        <li>Ask the client for their payment receipt/reference</li>
        <li>Check if payment went to the correct account</li>
        <li>Allow processing time (especially for bank transfers)</li>
        <li>Record the payment manually if verified</li>
      </ol>

      <h3>Failed Payments</h3>
      <p>
        If a payment fails:
      </p>
      <ul>
        <li>Client is notified automatically</li>
        <li>They can retry with the same or different method</li>
        <li>Contact support if issues persist</li>
      </ul>

      <h2>Reporting and Analytics</h2>
      <p>
        Track your payment performance:
      </p>
      <ul>
        <li><strong>Total received:</strong> This month, quarter, year</li>
        <li><strong>Outstanding:</strong> Unpaid invoice amounts</li>
        <li><strong>Average payment time:</strong> Days from invoice to payment</li>
        <li><strong>Payment methods:</strong> Which methods clients prefer</li>
      </ul>

      <h2>Exporting Payment Data</h2>
      <p>
        Export your payment history for accounting:
      </p>
      <ol>
        <li>Go to <strong>Payments → Export</strong></li>
        <li>Select date range</li>
        <li>Choose format (CSV, PDF)</li>
        <li>Download and use in your accounting software</li>
      </ol>
    </HelpArticleLayout>
  );
}
