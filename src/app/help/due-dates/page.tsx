"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { Calendar, Clock, TickCircle, Warning2 } from "iconsax-react";

const paymentTerms = [
  {
    name: "Due Immediately",
    description: "Payment expected upon receipt of invoice",
    bestFor: "Small amounts, trusted clients, digital services",
    icon: TickCircle,
    color: "#14462a"
  },
  {
    name: "Net 15",
    description: "Payment due within 15 days of invoice date",
    bestFor: "Small to medium projects, regular clients",
    icon: Clock,
    color: "#14462a"
  },
  {
    name: "Net 30",
    description: "Payment due within 30 days of invoice date",
    bestFor: "Large projects, corporate clients, standard business practice",
    icon: Calendar,
    color: "#6B7280"
  },
  {
    name: "Custom Date",
    description: "Specific calendar date agreed upon with client",
    bestFor: "Milestone payments, specific project deadlines",
    icon: Warning2,
    color: "#D97706"
  }
];

export default function DueDatesPage() {
  return (
    <HelpArticleLayout
      title="Setting Due Dates and Terms"
      description="Learn how to set appropriate payment terms and due dates to optimize cash flow while maintaining good client relationships."
      category="Creating Invoices"
      categoryColor="#14462a"
      readTime="2 min read"
      relatedArticles={[
        {
          title: "Invoice builder guide",
          description: "Master the invoice builder",
          slug: "invoice-builder",
          readTime: "5 min read"
        },
        {
          title: "Understanding payments",
          description: "Track and manage payments",
          slug: "payments",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>Understanding Payment Terms</h2>
      <p>
        Payment terms specify when your client should pay the invoice. 
        The right terms balance your cash flow needs with client convenience 
        and relationship management.
      </p>

      <h2>Common Payment Terms</h2>
      
      <div className="not-prose my-8 space-y-4">
        {paymentTerms.map((term) => {
          const Icon = term.icon;
          return (
            <div key={term.name} className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${term.color}15` }}
                >
                  <Icon size={20} color={term.color} variant="Bulk" />
                </div>
                <h3 className="font-semibold text-black">{term.name}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {term.description}
              </p>
              <div className="text-xs text-gray-500">
                <strong>Best for:</strong> {term.bestFor}
              </div>
            </div>
          );
        })}
      </div>

      <h2>Setting Due Dates in Plaen</h2>
      
      <h3>Default Payment Terms</h3>
      <ol>
        <li>Go to <strong>Settings → Invoice Preferences</strong></li>
        <li>Select your preferred default payment terms</li>
        <li>This will apply to all new invoices automatically</li>
        <li>You can override defaults for individual invoices</li>
      </ol>

      <h3>Per-Invoice Customization</h3>
      <p>
        While creating an invoice, you can:
      </p>
      <ul>
        <li>Choose from preset terms (Due immediately, Net 15, Net 30, Net 60)</li>
        <li>Select a custom due date from the calendar</li>
        <li>Set different terms for different clients</li>
        <li>Add payment term notes or conditions</li>
      </ul>

      <h2>Choosing the Right Terms</h2>
      
      <h3>Factors to Consider</h3>
      
      <h4>Project Size and Value</h4>
      <ul>
        <li><strong>Small projects (&lt; GHS 1,000):</strong> Due immediately or Net 15</li>
        <li><strong>Medium projects (GHS 1,000-10,000):</strong> Net 15 to Net 30</li>
        <li><strong>Large projects (&gt; GHS 10,000):</strong> Net 30 or milestone payments</li>
      </ul>

      <h4>Client Relationship</h4>
      <ul>
        <li><strong>New clients:</strong> Shorter terms or upfront payment</li>
        <li><strong>Trusted clients:</strong> Standard Net 30 terms</li>
        <li><strong>Long-term clients:</strong> Flexible terms based on history</li>
      </ul>

      <h4>Industry Standards</h4>
      <ul>
        <li><strong>Creative services:</strong> Often Net 15 to Net 30</li>
        <li><strong>Consulting:</strong> Usually Net 30</li>
        <li><strong>Digital products:</strong> Due immediately or Net 15</li>
        <li><strong>Corporate clients:</strong> Often require Net 30 or longer</li>
      </ul>

      <h2>Payment Reminders</h2>
      <p>
        Plaen can automatically remind clients about upcoming and overdue payments:
      </p>

      <h3>Reminder Schedule</h3>
      <ul>
        <li><strong>Before due date:</strong> Optional reminder 3-7 days before</li>
        <li><strong>On due date:</strong> Payment due notification</li>
        <li><strong>After due date:</strong> Overdue reminders at intervals you choose</li>
      </ul>

      <h3>Configuring Reminders</h3>
      <ol>
        <li>Go to <strong>Settings → Reminders</strong></li>
        <li>Enable automatic payment reminders</li>
        <li>Set your preferred reminder schedule</li>
        <li>Customize reminder email templates</li>
      </ol>

      <h2>Handling Late Payments</h2>
      <p>
        When payments are overdue:
      </p>

      <h3>Grace Period</h3>
      <p>
        Consider offering a short grace period (3-5 days) before marking 
        an invoice as overdue. This accounts for bank processing times.
      </p>

      <h3>Late Payment Fees</h3>
      <p>
        You can configure late payment fees:
      </p>
      <ul>
        <li><strong>Percentage:</strong> e.g., 2% per month overdue</li>
        <li><strong>Fixed amount:</strong> e.g., GHS 50 flat late fee</li>
        <li><strong>Compound:</strong> Increasing fees over time</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Tip:</strong> Clearly state late payment terms 
          on your invoice. This sets expectations and provides legal backing if needed.
        </p>
      </div>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Be consistent with your terms across similar clients</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Discuss payment terms before starting work</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Consider deposits for large or new client projects</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Follow up personally before sending formal reminders</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
