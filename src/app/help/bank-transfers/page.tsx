"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Bank, Global, SecuritySafe, InfoCircle } from "iconsax-react";

const transferTypes = [
  {
    name: "Domestic Transfers",
    description: "Bank transfers within the same country, usually processed within 1-2 business days.",
    features: [
      "Lower fees than international transfers",
      "Faster processing times",
      "Direct bank-to-bank transfer",
      "Real-time status updates"
    ]
  },
  {
    name: "International Transfers", 
    description: "Cross-border payments using SWIFT network, typically taking 3-5 business days.",
    features: [
      "Global reach to 200+ countries",
      "Competitive exchange rates",
      "Full transaction tracking",
      "Regulatory compliance included"
    ]
  }
];

const supportedCountries = [
  "Ghana", "Nigeria", "Kenya", "South Africa", "Uganda", "Tanzania",
  "United States", "United Kingdom", "Canada", "Germany", "France", "Netherlands"
];

export default function BankTransfersPage() {
  return (
    <HelpArticleLayout
      title="Bank Transfers"
      description="Accept direct bank transfers from your clients anywhere in the world. Bank transfers are secure, reliable, and perfect for larger transactions."
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
      <h2>What Are Bank Transfers?</h2>
      <p>
        Bank transfers allow your clients to send payments directly from their bank account to yours. 
        This payment method is widely trusted, especially for business-to-business transactions and 
        larger amounts where clients prefer the security and familiarity of traditional banking.
      </p>

      <p>
        With Plaen, you can accept both domestic and international bank transfers. We handle all the 
        complexity of banking networks, compliance, and reconciliation, so you can focus on your business 
        while we ensure you get paid safely and on time.
      </p>

      <h2>Types of Bank Transfers</h2>

      <div className="not-prose my-12 space-y-8">
        {transferTypes.map((transfer) => (
          <div key={transfer.name} className="border-l-4 border-gray-200 pl-6">
            <h3 className="text-xl font-semibold text-black mb-3">{transfer.name}</h3>
            <p className="text-gray-700 mb-4">{transfer.description}</p>
            
            <div className="space-y-2">
              {transfer.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <TickCircle size={16} color="#14462a" variant="Bulk" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>How Bank Transfers Work</h2>
      <p>
        When you send an invoice with bank transfer as a payment option, your client will receive 
        detailed banking instructions including your account details, reference numbers, and any 
        specific information needed for the transfer.
      </p>

      <h3>Step 1: Client Initiates Transfer</h3>
      <p>
        Your client logs into their online banking or visits their bank branch to initiate the transfer. 
        They'll use the banking details provided in your invoice, including the reference number to 
        ensure proper identification of the payment.
      </p>

      <h3>Step 2: Transfer Processing</h3>
      <p>
        The bank processes the transfer through secure banking networks. Domestic transfers typically 
        clear within 1-2 business days, while international transfers may take 3-5 business days 
        depending on the countries involved.
      </p>

      <h3>Step 3: Automatic Reconciliation</h3>
      <p>
        Once the transfer arrives in your account, Plaen automatically matches it to the corresponding 
        invoice using the reference number. Both you and your client receive confirmation, and the 
        invoice is marked as paid.
      </p>

      <h2>Setting Up Bank Transfers</h2>
      <p>
        To accept bank transfers, you'll need to provide your banking details in your Plaen account:
      </p>

      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Bank Account"</strong></li>
        <li>Enter your bank name and branch</li>
        <li>Add your account number</li>
        <li>For international transfers, add your SWIFT code</li>
        <li>Verify and save your details</li>
      </ol>

      <h2>Supported Countries</h2>
      <p>
        We currently support bank transfers in the following countries and regions:
      </p>

      <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {supportedCountries.map((country) => (
            <div key={country} className="flex items-center gap-2">
              <TickCircle size={16} color="#14462a" variant="Bulk" />
              <span className="text-gray-700 text-sm">{country}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-white border border-gray-200 p-4">
          <InfoCircle size={20} color="#6B7280" variant="Bulk" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium text-black mb-1">Expanding Coverage</p>
            <p>
              We're constantly adding support for more countries and banking networks. 
              Contact us if your country isn't listed above.
            </p>
          </div>
        </div>
      </div>

      <h2>Bank Transfer Fees</h2>
      <p>
        Bank transfer fees vary depending on the type of transfer:
      </p>
      <ul>
        <li><strong>Domestic transfers:</strong> Usually free or minimal fees</li>
        <li><strong>International transfers:</strong> Fees depend on banks involved</li>
        <li><strong>Currency conversion:</strong> Additional fees may apply</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-[#D9770615] bg-[#D9770608] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#D97706]">💡 Tip:</strong> For local clients in Ghana, 
          mobile money is often faster and cheaper than bank transfers for smaller amounts.
        </p>
      </div>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Always include the invoice reference number</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Verify bank details are correct before enabling</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Use bank transfers for amounts over GHS 5,000</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Allow extra time for international transfers</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
