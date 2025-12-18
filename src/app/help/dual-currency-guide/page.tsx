"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { Calculator } from "iconsax-react";

export default function DualCurrencyGuidePage() {
  return (
    <HelpArticleLayout
      title="Understanding Dual Currency Invoicing"
      description="When and how to use GHS and USD on the same invoice for international clients and currency flexibility."
      category="Creating Invoices"
      categoryColor="#0D9488"
      readTime="4 min read"
      relatedArticles={[
        {
          title: "Dual currency invoicing",
          description: "Set up dual currency",
          slug: "dual-currency",
          readTime: "4 min read"
        },
        {
          title: "Adding items and totals",
          description: "Line items and calculations",
          slug: "items-totals",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>What is Dual Currency Invoicing?</h2>
      <p>
        Dual currency invoicing allows you to display prices in both Ghana Cedis (GHS) 
        and US Dollars (USD) on the same invoice. This gives clients payment flexibility 
        while protecting your business from currency fluctuations.
      </p>

      <h2>When to Use Dual Currency</h2>
      
      <h3>International Clients</h3>
      <ul>
        <li>Clients who prefer to see USD amounts</li>
        <li>Companies with USD budgets or accounting</li>
        <li>Expatriate businesses in Ghana</li>
        <li>International organizations and NGOs</li>
      </ul>

      <h3>High-Value Services</h3>
      <ul>
        <li>Large consulting projects</li>
        <li>Software development contracts</li>
        <li>Long-term service agreements</li>
        <li>Export/import businesses</li>
      </ul>

      <h3>Currency Hedging</h3>
      <ul>
        <li>Protecting against GHS volatility</li>
        <li>Offering payment options in stable currency</li>
        <li>Accommodating client preferences</li>
        <li>International contract requirements</li>
      </ul>

      <h2>How Dual Currency Works in Plaen</h2>
      <p>
        When you enable dual currency, Plaen:
      </p>
      <ul>
        <li>Automatically calculates equivalent amounts in both currencies</li>
        <li>Displays both currencies on the invoice</li>
        <li>Records the exchange rate used</li>
        <li>Allows payment in either currency</li>
      </ul>

      <h2>Setting Up Dual Currency</h2>
      <p>
        Follow these steps to enable dual currency invoicing:
      </p>
      
      <ol>
        <li>Go to Settings → Invoice Configuration</li>
        <li>Enable "Dual Currency Display"</li>
        <li>Set your primary currency (usually GHS)</li>
        <li>Set your secondary currency (usually USD)</li>
        <li>Configure automatic exchange rate updates</li>
      </ol>

      <h3>Exchange Rate Options</h3>
      <ul>
        <li><strong>Live rates:</strong> Automatically updated from Bank of Ghana</li>
        <li><strong>Fixed rates:</strong> Lock in rates for specific contracts</li>
        <li><strong>Manual rates:</strong> Set your own exchange rate</li>
        <li><strong>Rate date:</strong> Use rates from invoice date or custom date</li>
      </ul>

      <h2>Dual Currency Invoice Examples</h2>

      <h3>Primary GHS, Secondary USD</h3>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Web Development Services</span>
            <div className="text-right">
              <div className="font-semibold text-black">GHS 12,000</div>
              <div className="text-gray-500 text-xs">($750 USD)</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Monthly Maintenance (6 months)</span>
            <div className="text-right">
              <div className="font-semibold text-black">GHS 3,600</div>
              <div className="text-gray-500 text-xs">($225 USD)</div>
            </div>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">Total</span>
            <div className="text-right">
              <div className="text-black">GHS 15,600</div>
              <div className="text-gray-700 text-sm">($975 USD)</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Exchange rate: 1 USD = 16.00 GHS (November 6, 2024)
          </div>
        </div>
      </div>

      <h3>Equal Prominence Display</h3>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Consulting Services</span>
            <div className="text-right font-semibold text-black">
              <div>$2,500 USD</div>
              <div>GHS 40,000</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-4">
            Client may pay in either currency • Rate: 1 USD = 16.00 GHS
          </div>
        </div>
      </div>

      <h2>Payment Considerations</h2>
      
      <h3>Currency Preference</h3>
      <p>
        Let clients choose their payment currency:
      </p>
      <ul>
        <li>GHS for local mobile money and bank transfers</li>
        <li>USD for international wire transfers</li>
        <li>Either currency for cryptocurrency payments</li>
      </ul>

      <h3>Exchange Rate Risk</h3>
      <p>
        Understand who bears the exchange rate risk:
      </p>
      <ul>
        <li><strong>Fixed rate:</strong> You bear the risk if rates change</li>
        <li><strong>Rate at payment:</strong> Client bears the risk</li>
        <li><strong>Locked rate:</strong> Both parties know the exact amount</li>
      </ul>

      <h2>Accounting Considerations</h2>
      <p>
        When using dual currency invoicing:
      </p>
      <ul>
        <li>Record income in your primary accounting currency</li>
        <li>Track exchange rate gains/losses if rates change</li>
        <li>Keep records of rates used for each invoice</li>
        <li>Consult your accountant for tax implications</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Pro tip:</strong> For large or long-term projects, 
          consider including a clause in your contract about how exchange rate changes 
          will be handled.
        </p>
      </div>

      <h2>Common Questions</h2>

      <h3>What if the exchange rate changes between invoice and payment?</h3>
      <p>
        By default, the rate is locked when the invoice is created. You can choose to 
        accept payment at the current rate or the invoice rate.
      </p>

      <h3>Can I show more than two currencies?</h3>
      <p>
        Currently, Plaen supports dual currency (two currencies). Contact us if you 
        need support for additional currencies.
      </p>

      <h3>How do I handle partial payments in different currencies?</h3>
      <p>
        Plaen tracks payments in whichever currency they're received and calculates 
        the remaining balance in your primary currency.
      </p>
    </HelpArticleLayout>
  );
}
