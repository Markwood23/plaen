"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, DocumentText, UserAdd, DollarCircle, Send2 } from "iconsax-react";

const invoiceSteps = [
  {
    icon: UserAdd,
    title: "Add client details",
    description: "Enter your client's name, email, and billing address.",
    color: "#B45309"
  },
  {
    icon: DocumentText,
    title: "Add line items",
    description: "Describe your services with quantities and prices.",
    color: "#0D9488"
  },
  {
    icon: DollarCircle,
    title: "Set payment options",
    description: "Choose how you want to receive payment.",
    color: "#D97706"
  },
  {
    icon: Send2,
    title: "Send invoice",
    description: "Review and send directly to your client.",
    color: "#14462a"
  }
];

export default function FirstInvoicePage() {
  return (
    <HelpArticleLayout
      title="Creating Your First Invoice"
      description="Learn how to create and send a professional invoice to your client in just a few minutes."
      category="Getting Started"
      categoryColor="#14462a"
      readTime="4 min read"
      relatedArticles={[
        {
          title: "Setting up payment methods",
          description: "Configure how you get paid",
          slug: "payment-setup",
          readTime: "3 min read"
        },
        {
          title: "Invoice builder guide",
          description: "Master the invoice builder",
          slug: "invoice-builder",
          readTime: "5 min read"
        }
      ]}
    >
      <h2>Overview</h2>
      <p>
        Creating an invoice with Plaen is simple and takes just a few minutes. 
        This guide walks you through each step to create and send your first 
        professional invoice.
      </p>

      <div className="not-prose my-12 grid gap-6 sm:grid-cols-2">
        {invoiceSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex gap-4">
              <div 
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <Icon size={20} color={step.color} variant="Bulk" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Step {index + 1}</span>
                </div>
                <h3 className="font-semibold text-black">{step.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2>Step 1: Start a New Invoice</h2>
      <p>
        From your dashboard, click the <strong>"Create Invoice"</strong> button. This opens 
        the invoice builder where you'll enter all the details for your invoice.
      </p>

      <h2>Step 2: Add Client Information</h2>
      <p>
        Enter your client's details in the "Bill To" section:
      </p>
      <ul>
        <li><strong>Client name:</strong> Individual or company name</li>
        <li><strong>Email address:</strong> Where the invoice will be sent</li>
        <li><strong>Billing address:</strong> Optional but recommended</li>
        <li><strong>Phone number:</strong> For payment follow-up</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Tip:</strong> Save client details for future invoices. 
          Next time, just select them from your contacts list.
        </p>
      </div>

      <h2>Step 3: Add Line Items</h2>
      <p>
        Line items are the services or products you're billing for. For each item, add:
      </p>
      <ul>
        <li><strong>Description:</strong> What you're charging for</li>
        <li><strong>Quantity:</strong> Number of units or hours</li>
        <li><strong>Rate:</strong> Price per unit</li>
        <li><strong>Amount:</strong> Automatically calculated</li>
      </ul>

      <h3>Writing Good Descriptions</h3>
      <p>
        Be specific about what you delivered. Good descriptions help clients understand 
        the value and reduce payment questions.
      </p>

      <div className="not-prose my-6 space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-black text-sm">Good example:</strong>
            <p className="text-sm text-gray-700">"Website design - 5-page responsive site with contact form and SEO optimization"</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 bg-gray-50">
          <TickCircle size={18} color="#9CA3AF" variant="Bulk" className="flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-black text-sm">Avoid:</strong>
            <p className="text-sm text-gray-700">"Web work"</p>
          </div>
        </div>
      </div>

      <h2>Step 4: Set Payment Terms</h2>
      <p>
        Choose when payment is due:
      </p>
      <ul>
        <li><strong>Due on receipt:</strong> Payment expected immediately</li>
        <li><strong>Net 15:</strong> Due within 15 days</li>
        <li><strong>Net 30:</strong> Due within 30 days (most common)</li>
        <li><strong>Custom date:</strong> Specific due date</li>
      </ul>

      <h2>Step 5: Select Payment Methods</h2>
      <p>
        Choose how your client can pay. Offering multiple options increases the 
        likelihood of faster payment:
      </p>
      <ul>
        <li><strong>Mobile Money:</strong> MTN, Vodafone, AirtelTigo</li>
        <li><strong>Bank Transfer:</strong> Local and international</li>
        <li><strong>Cryptocurrency:</strong> Bitcoin, USDC, Ethereum</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-[#D9770615] bg-[#D9770608] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#D97706]">⚡ Pro tip:</strong> Mobile money is the fastest 
          payment method for clients in Ghana. Consider making it your primary option.
        </p>
      </div>

      <h2>Step 6: Review and Send</h2>
      <p>
        Before sending, review your invoice for:
      </p>
      <ul>
        <li>Correct client information</li>
        <li>Accurate line item descriptions and amounts</li>
        <li>Proper payment terms and due date</li>
        <li>Your contact information is correct</li>
      </ul>

      <p>
        When everything looks good, click <strong>"Send Invoice"</strong>. Your client 
        will receive an email with a link to view and pay the invoice.
      </p>

      <h2>After Sending</h2>
      <p>
        Once sent, you can track your invoice status from the dashboard:
      </p>
      <ul>
        <li><strong>Sent:</strong> Invoice delivered to client's email</li>
        <li><strong>Viewed:</strong> Client has opened the invoice</li>
        <li><strong>Partial:</strong> Part of the amount has been paid</li>
        <li><strong>Paid:</strong> Full payment received</li>
      </ul>

      <h2>Quick Tips for Success</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Send invoices promptly after completing work</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Use clear, professional descriptions</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Offer multiple payment options</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Follow up if payment is overdue</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
