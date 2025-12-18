"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { DollarCircle, Global, TrendUp } from "iconsax-react";

export default function DualCurrencyPage() {
  return (
    <HelpArticleLayout
      title="Dual Currency Invoicing"
      description="Set up and use dual currency invoicing to show both GHS and USD amounts, giving clients payment flexibility."
      category="Creating Invoices"
      categoryColor="#0D9488"
      readTime="4 min read"
      relatedArticles={[
        {
          title: "Understanding dual currency",
          description: "When and how to use dual currency",
          slug: "dual-currency-guide",
          readTime: "4 min read"
        },
        {
          title: "Adding items and totals",
          description: "Line items, taxes, and discounts",
          slug: "items-totals",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>What is Dual Currency Invoicing?</h2>
      <p>
        Dual currency invoicing displays both Ghana Cedis (GHS) and US Dollars (USD) 
        on the same invoice, allowing clients to pay in their preferred currency 
        while protecting your business from exchange rate fluctuations.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Global size={20} color="#6B7280" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">Global Flexibility</h3>
          <p className="mt-2 text-sm text-gray-700">
            Accommodate international clients and local businesses with USD budgets
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <TrendUp size={20} color="#6B7280" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">Risk Protection</h3>
          <p className="mt-2 text-sm text-gray-700">
            Hedge against currency volatility while offering payment options
          </p>
        </div>
      </div>

      <h2>Setting Up Dual Currency</h2>
      
      <h3>Enable Dual Currency Mode</h3>
      <ol>
        <li>Go to <strong>Settings → Invoice Preferences</strong></li>
        <li>Find the <strong>"Currency Settings"</strong> section</li>
        <li>Toggle on <strong>"Dual Currency Display"</strong></li>
        <li>Select <strong>GHS</strong> as primary, <strong>USD</strong> as secondary</li>
        <li>Choose your exchange rate source</li>
      </ol>

      <h3>Exchange Rate Options</h3>
      <div className="not-prose my-6 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">Live Rates (Recommended)</h4>
          <p className="text-sm text-gray-700 mt-1">
            Automatically updated from Bank of Ghana. Rates refresh daily and 
            are locked when invoices are created.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">Fixed Rates</h4>
          <p className="text-sm text-gray-700 mt-1">
            Set a specific exchange rate for consistent pricing. Useful for 
            contracts or when you want rate stability.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">Manual Rates</h4>
          <p className="text-sm text-gray-700 mt-1">
            Enter custom rates per invoice. Gives maximum control but 
            requires manual updates.
          </p>
        </div>
      </div>

      <h2>Invoice Display Options</h2>
      
      <h3>Primary/Secondary Display</h3>
      <p>
        Show one currency prominently with the other as reference:
      </p>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Website Development</span>
            <div className="text-right">
              <div className="font-semibold text-black">GHS 12,000</div>
              <div className="text-gray-500 text-xs">($750 USD)</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">SEO Optimization</span>
            <div className="text-right">
              <div className="font-semibold text-black">GHS 4,000</div>
              <div className="text-gray-500 text-xs">($250 USD)</div>
            </div>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">Total</span>
            <div className="text-right">
              <div className="text-black">GHS 16,000</div>
              <div className="text-gray-700 text-sm">($1,000 USD)</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-4 text-center">
          Exchange rate: 1 USD = 16.00 GHS (Nov 6, 2024)
        </div>
      </div>

      <h3>Equal Prominence Display</h3>
      <p>
        Show both currencies with equal importance:
      </p>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Consulting Services</span>
            <div className="text-right font-semibold text-black">
              <div>$2,500 USD</div>
              <div>GHS 40,000</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center mt-4">
          Pay in either currency • Rate: 1 USD = 16.00 GHS
        </div>
      </div>

      <h2>Creating Dual Currency Invoices</h2>
      
      <h3>Standard Workflow</h3>
      <ol>
        <li>Create invoice normally with line items and rates</li>
        <li>Choose <strong>"Dual Currency"</strong> in the currency selector</li>
        <li>Select or confirm the exchange rate to use</li>
        <li>Preview both currency displays</li>
        <li>Send invoice with both amounts shown</li>
      </ol>

      <h3>Rate Validation</h3>
      <p>
        Before sending, Plaen shows you:
      </p>
      <ul>
        <li>Current exchange rate being used</li>
        <li>Rate source and last update time</li>
        <li>Total amounts in both currencies</li>
        <li>Option to lock in the current rate</li>
      </ul>

      <h2>Payment Handling</h2>
      
      <h3>Accepting Payments in Both Currencies</h3>
      <p>
        Configure payment methods for dual currency:
      </p>
      <ul>
        <li><strong>GHS payments:</strong> Mobile money, local bank transfers</li>
        <li><strong>USD payments:</strong> International bank transfers, PayPal, crypto</li>
        <li><strong>Either currency:</strong> Flexible payment options</li>
      </ul>

      <h3>Currency Preference Settings</h3>
      <p>
        You can set preferences for each client:
      </p>
      <ul>
        <li>Default currency preference per client</li>
        <li>Accepted currencies for payment</li>
        <li>Automatic currency matching to payment method</li>
      </ul>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Lock Rates for Large Projects</h4>
          <p className="text-sm text-gray-700">
            For multi-month projects, consider locking the exchange rate at the start 
            to avoid billing surprises.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Know Your Client</h4>
          <p className="text-sm text-gray-700">
            Ask clients which currency they prefer for budgeting and display that one prominently.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Document Rate Sources</h4>
          <p className="text-sm text-gray-700">
            Always show the exchange rate source and date for transparency.
          </p>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
