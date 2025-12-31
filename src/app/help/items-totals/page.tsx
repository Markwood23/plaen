"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Add, PercentageSquare, Math } from "iconsax-react";

export default function ItemsTotalsPage() {
  return (
    <HelpArticleLayout
      title="Adding Items and Totals"
      description="Learn how to add line items, apply discounts, include taxes, and calculate accurate invoice totals."
      category="Creating Invoices"
      categoryColor="#14462a"
      readTime="3 min read"
      relatedArticles={[
        {
          title: "Invoice builder guide",
          description: "Master the invoice builder",
          slug: "invoice-builder",
          readTime: "5 min read"
        },
        {
          title: "Dual currency invoicing",
          description: "Show GHS and USD amounts",
          slug: "dual-currency",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>Line Items Basics</h2>
      <p>
        Line items are the individual services or products you're billing for. 
        Each line item includes a description, quantity, rate, and total amount.
      </p>

      <h3>Adding a Line Item</h3>
      <ol>
        <li>Click <strong>"Add Item"</strong> in the invoice builder</li>
        <li>Enter a description of the service or product</li>
        <li>Set the quantity (hours, units, etc.)</li>
        <li>Enter the rate (price per unit)</li>
        <li>The amount is calculated automatically</li>
      </ol>

      <div className="not-prose my-8 rounded-xl border border-gray-200 p-6 bg-gray-50">
        <h4 className="font-semibold text-black mb-4">Example Line Items</h4>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-start pb-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-black">Logo Design - 3 concepts with 2 revisions</div>
              <div className="text-gray-500">1 × GHS 2,500.00</div>
            </div>
            <div className="font-semibold text-black">GHS 2,500.00</div>
          </div>
          <div className="flex justify-between items-start pb-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-black">Website Development - 5-page responsive site</div>
              <div className="text-gray-500">1 × GHS 8,000.00</div>
            </div>
            <div className="font-semibold text-black">GHS 8,000.00</div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-black">Monthly Maintenance</div>
              <div className="text-gray-500">3 × GHS 500.00</div>
            </div>
            <div className="font-semibold text-black">GHS 1,500.00</div>
          </div>
        </div>
      </div>

      <h2>Writing Effective Descriptions</h2>
      <p>
        Clear descriptions help clients understand exactly what they're paying for 
        and reduce payment questions:
      </p>

      <div className="not-prose my-6 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TickCircle size={18} color="#14462a" variant="Bulk" />
            <span className="font-medium text-black">Good</span>
          </div>
          <p className="text-sm text-gray-700">
            "Brand identity package: Logo design (3 concepts, 2 revisions), business card layout, letterhead template, social media profile images"
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-500">Avoid</span>
          </div>
          <p className="text-sm text-gray-500">
            "Design work"
          </p>
        </div>
      </div>

      <h2>Quantity Types</h2>
      <p>
        Use quantities that make sense for your services:
      </p>
      <ul>
        <li><strong>Hours:</strong> For time-based billing (consulting, development)</li>
        <li><strong>Units:</strong> For countable items (articles, designs)</li>
        <li><strong>Projects:</strong> For fixed-scope work (website, logo)</li>
        <li><strong>Months:</strong> For recurring services (maintenance, hosting)</li>
      </ul>

      <h2>Applying Discounts</h2>
      <p>
        You can apply discounts to your invoice in two ways:
      </p>

      <h3>Percentage Discount</h3>
      <p>
        Apply a percentage off the subtotal. Useful for:
      </p>
      <ul>
        <li>Volume discounts (10% off orders over GHS 5,000)</li>
        <li>Returning client discounts</li>
        <li>Promotional pricing</li>
      </ul>

      <h3>Fixed Amount Discount</h3>
      <p>
        Subtract a specific amount. Useful for:
      </p>
      <ul>
        <li>Referral credits</li>
        <li>Prepaid deposits</li>
        <li>Negotiated price reductions</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Tip:</strong> Name your discounts clearly 
          (e.g., "10% returning client discount" or "Deposit paid on 1 Nov") so 
          clients understand the reduction.
        </p>
      </div>

      <h2>Adding Taxes</h2>
      <p>
        If you need to charge tax, you can add it to your invoice:
      </p>

      <h3>Setting Up Tax</h3>
      <ol>
        <li>Go to <strong>Settings → Invoice Preferences</strong></li>
        <li>Enable <strong>"Include Tax"</strong></li>
        <li>Set your default tax rate (e.g., 15% VAT)</li>
        <li>Choose whether tax is included or added to prices</li>
      </ol>

      <h3>Per-Invoice Tax</h3>
      <p>
        You can also set tax per invoice:
      </p>
      <ul>
        <li>Toggle tax on/off for specific invoices</li>
        <li>Use different rates for different clients</li>
        <li>Add multiple tax types if required</li>
      </ul>

      <h2>Understanding Totals</h2>
      <p>
        Your invoice total is calculated as:
      </p>

      <div className="not-prose my-8 rounded-xl border border-gray-200 p-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal (sum of line items)</span>
            <span className="text-black">GHS 12,000.00</span>
          </div>
          <div className="flex justify-between text-[#14462a]">
            <span>Discount (10%)</span>
            <span>- GHS 1,200.00</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <span className="text-gray-700">Subtotal after discount</span>
            <span className="text-black">GHS 10,800.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">VAT (15%)</span>
            <span className="text-black">GHS 1,620.00</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-base">
            <span className="text-black">Total Due</span>
            <span className="text-black">GHS 12,420.00</span>
          </div>
        </div>
      </div>

      <h2>Currency Display</h2>
      <p>
        When using dual currency mode, your totals will show both currencies:
      </p>
      <ul>
        <li>Primary currency displayed prominently</li>
        <li>Secondary currency shown as reference</li>
        <li>Exchange rate noted at the bottom</li>
      </ul>

      <h2>Saving Line Items</h2>
      <p>
        Save commonly used line items for quick reuse:
      </p>
      <ol>
        <li>Create a line item as usual</li>
        <li>Click the <strong>save icon</strong> next to the item</li>
        <li>Give it a name for easy identification</li>
        <li>Access saved items from the <strong>"Add Item"</strong> dropdown</li>
      </ol>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Break down large projects into clear phases or deliverables</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Include dates for time-based services</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Always double-check calculations before sending</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Explain any discounts or adjustments clearly</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
