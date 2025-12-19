"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { 
  TickCircle, 
  DocumentText, 
  Edit2, 
  Gallery, 
  Wallet,
  Calendar,
  ReceiptEdit,
  Brush
} from "iconsax-react";

const builderSections = [
  {
    icon: Edit2,
    title: "Header Section",
    description: "Your business details and invoice number",
    color: "#14462a"
  },
  {
    icon: ReceiptEdit,
    title: "Client Details",
    description: "Who you're billing",
    color: "#B45309"
  },
  {
    icon: DocumentText,
    title: "Line Items",
    description: "Services and products",
    color: "#0D9488"
  },
  {
    icon: Wallet,
    title: "Payment Options",
    description: "How clients can pay",
    color: "#D97706"
  }
];

export default function InvoiceBuilderPage() {
  return (
    <HelpArticleLayout
      title="Invoice Builder Guide"
      description="Master the invoice builder to create professional, detailed invoices that help you get paid faster."
      category="Creating Invoices"
      categoryColor="#0D9488"
      readTime="5 min read"
      relatedArticles={[
        {
          title: "Adding items and totals",
          description: "Line items, taxes, and discounts",
          slug: "items-totals",
          readTime: "3 min read"
        },
        {
          title: "Saving drafts",
          description: "Work on invoices over time",
          slug: "drafts",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>Invoice Builder Overview</h2>
      <p>
        The invoice builder is your workspace for creating professional invoices. 
        It's designed to be intuitive while giving you full control over every 
        detail of your invoice.
      </p>

      <div className="not-prose my-12 grid gap-4 sm:grid-cols-2">
        {builderSections.map((section) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.title}
              className="rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <Icon size={20} color={section.color} variant="Bulk" />
                </div>
                <h3 className="font-semibold text-black">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-700">{section.description}</p>
            </div>
          );
        })}
      </div>

      <h2>Header Section</h2>
      <p>
        The header establishes your professional identity and invoice details:
      </p>

      <h3>Your Business Info</h3>
      <ul>
        <li><strong>Name/Business name:</strong> Pulled from your profile</li>
        <li><strong>Logo:</strong> Displayed if you have a Business account</li>
        <li><strong>Contact details:</strong> Email, phone, address</li>
      </ul>

      <h3>Invoice Details</h3>
      <ul>
        <li><strong>Invoice number:</strong> Auto-generated or custom</li>
        <li><strong>Invoice date:</strong> When the invoice is issued</li>
        <li><strong>Due date:</strong> When payment is expected</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Invoice numbering:</strong> Plaen automatically 
          generates unique invoice numbers with the PL- prefix (e.g., PL-A7K9X2, PL-B3M4N8). You can customize 
          the format in Settings → Invoice Preferences.
        </p>
      </div>

      <h2>Client Details Section</h2>
      <p>
        Enter who you're billing. You can:
      </p>
      <ul>
        <li>Select an existing client from your contacts</li>
        <li>Add a new client (they're automatically saved)</li>
        <li>Edit client details for this specific invoice</li>
      </ul>

      <h3>Required Information</h3>
      <ul>
        <li><strong>Client name:</strong> Individual or company</li>
        <li><strong>Email address:</strong> For invoice delivery</li>
      </ul>

      <h3>Optional Information</h3>
      <ul>
        <li><strong>Phone number:</strong> For follow-up</li>
        <li><strong>Billing address:</strong> For records</li>
        <li><strong>Company registration:</strong> If required</li>
      </ul>

      <h2>Line Items Section</h2>
      <p>
        This is where you detail what you're charging for:
      </p>

      <h3>Adding Line Items</h3>
      <ol>
        <li>Click <strong>"Add Item"</strong> to create a new row</li>
        <li>Enter a description of the service or product</li>
        <li>Set the quantity and unit price</li>
        <li>The total is calculated automatically</li>
      </ol>

      <h3>Line Item Fields</h3>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">Field</th>
              <th className="px-4 py-3 text-left font-semibold text-black">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-gray-700 font-medium">Description</td>
              <td className="px-4 py-3 text-gray-700">What you're charging for</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700 font-medium">Quantity</td>
              <td className="px-4 py-3 text-gray-700">Number of units, hours, etc.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700 font-medium">Rate</td>
              <td className="px-4 py-3 text-gray-700">Price per unit</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700 font-medium">Amount</td>
              <td className="px-4 py-3 text-gray-700">Qty × Rate (auto-calculated)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Tips for Line Items</h3>
      <div className="not-prose my-6 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#0D9488" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Be specific in descriptions—helps clients understand value</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#0D9488" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Group related items together</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#0D9488" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Include dates or project phases for clarity</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#0D9488" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Save common items for quick reuse</span>
        </div>
      </div>

      <h2>Totals Section</h2>
      <p>
        The totals section shows:
      </p>
      <ul>
        <li><strong>Subtotal:</strong> Sum of all line items</li>
        <li><strong>Discounts:</strong> If applicable</li>
        <li><strong>Tax:</strong> If you charge tax</li>
        <li><strong>Total:</strong> Final amount due</li>
      </ul>

      <h2>Payment Options Section</h2>
      <p>
        Select how your client can pay. Offering multiple options improves 
        payment speed:
      </p>

      <div className="not-prose my-6 space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B15] flex items-center justify-center">
              <span className="text-xs font-bold text-[#F59E0B]">MM</span>
            </div>
            <span className="font-medium text-black">Mobile Money</span>
          </div>
          <span className="text-sm text-gray-500">Instant</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#14462a15] flex items-center justify-center">
              <span className="text-xs font-bold text-[#14462a]">BT</span>
            </div>
            <span className="font-medium text-black">Bank Transfer</span>
          </div>
          <span className="text-sm text-gray-500">1-3 days</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#0D948815] flex items-center justify-center">
              <span className="text-xs font-bold text-[#0D9488]">₿</span>
            </div>
            <span className="font-medium text-black">Cryptocurrency</span>
          </div>
          <span className="text-sm text-gray-500">Minutes</span>
        </div>
      </div>

      <h2>Notes Section</h2>
      <p>
        Add additional information to your invoice:
      </p>
      <ul>
        <li><strong>Notes:</strong> Thank you messages, project details</li>
        <li><strong>Terms:</strong> Payment conditions, late fees</li>
        <li><strong>Footer:</strong> Company registration, tax ID</li>
      </ul>

      <h2>Preview and Send</h2>
      <p>
        Before sending, use the <strong>Preview</strong> button to see exactly what 
        your client will receive. Check for:
      </p>
      <ul>
        <li>Spelling and accuracy</li>
        <li>Correct amounts and calculations</li>
        <li>Professional appearance</li>
        <li>All necessary details included</li>
      </ul>

      <h2>Keyboard Shortcuts</h2>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">Shortcut</th>
              <th className="px-4 py-3 text-left font-semibold text-black">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3"><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + S</kbd></td>
              <td className="px-4 py-3 text-gray-700">Save draft</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + P</kbd></td>
              <td className="px-4 py-3 text-gray-700">Preview invoice</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd/Ctrl + Enter</kbd></td>
              <td className="px-4 py-3 text-gray-700">Send invoice</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd></td>
              <td className="px-4 py-3 text-gray-700">Move to next field</td>
            </tr>
          </tbody>
        </table>
      </div>
    </HelpArticleLayout>
  );
}
