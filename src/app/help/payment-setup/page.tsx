"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { Mobile, Bank, Bitcoin } from "iconsax-react";

const paymentMethods = [
  {
    icon: Mobile,
    name: "Mobile Money",
    description: "MTN, Vodafone, AirtelTigo",
    color: "#F59E0B",
    speed: "Instant",
    fees: "Low"
  },
  {
    icon: Bank,
    name: "Bank Transfer",
    description: "Local and international",
    color: "#14462a",
    speed: "1-3 days",
    fees: "Variable"
  },
  {
    icon: Bitcoin,
    name: "Cryptocurrency",
    description: "Bitcoin, USDC, Ethereum",
    color: "#14462a",
    speed: "Minutes",
    fees: "Low"
  }
];

export default function PaymentSetupPage() {
  return (
    <HelpArticleLayout
      title="Setting Up Payment Methods"
      description="Configure your preferred payment methods to receive money from clients quickly and securely."
      category="Payments"
      categoryColor="#D97706"
      readTime="3 min read"
      relatedArticles={[
        {
          title: "Mobile money payments",
          description: "Accept MTN, Vodafone, AirtelTigo",
          slug: "mobile-money",
          readTime: "4 min read"
        },
        {
          title: "Bank transfers",
          description: "Set up bank payment options",
          slug: "bank-transfers",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>Available Payment Methods</h2>
      <p>
        Plaen supports multiple payment methods so your clients can pay in the way 
        that's most convenient for them. Offering multiple options can significantly 
        improve payment speed.
      </p>

      <div className="not-prose my-12 space-y-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div 
              key={method.name}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${method.color}15` }}
                >
                  <Icon size={24} color={method.color} variant="Bulk" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-700">Speed: <span className="font-medium text-black">{method.speed}</span></div>
                <div className="text-gray-500">Fees: {method.fees}</div>
              </div>
            </div>
          );
        })}
      </div>

      <h2>Setting Up Mobile Money</h2>
      <p>
        Mobile money is the fastest and most popular payment method for clients in Ghana.
      </p>

      <h3>MTN Mobile Money</h3>
      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Mobile Money"</strong></li>
        <li>Select <strong>MTN Mobile Money</strong></li>
        <li>Enter your MTN phone number</li>
        <li>Verify with the code sent to your phone</li>
        <li>Save and enable for invoices</li>
      </ol>

      <h3>Vodafone Cash</h3>
      <ol>
        <li>Follow the same steps as MTN</li>
        <li>Select <strong>Vodafone Cash</strong></li>
        <li>Enter your Vodafone number</li>
        <li>Complete verification</li>
      </ol>

      <h3>AirtelTigo Money</h3>
      <ol>
        <li>Select <strong>AirtelTigo Money</strong></li>
        <li>Enter your AirtelTigo number</li>
        <li>Verify and enable</li>
      </ol>

      <h2>Setting Up Bank Transfer</h2>
      <p>
        Bank transfers are ideal for larger payments and international clients.
      </p>

      <h3>Local Bank Account</h3>
      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Bank Account"</strong></li>
        <li>Enter your bank name</li>
        <li>Add your account number</li>
        <li>Enter branch code (if required)</li>
        <li>Verify account details</li>
      </ol>

      <h3>Required Information</h3>
      <ul>
        <li><strong>Bank name:</strong> e.g., GCB Bank, Ecobank, Stanbic</li>
        <li><strong>Account name:</strong> As registered with the bank</li>
        <li><strong>Account number:</strong> Your bank account number</li>
        <li><strong>Branch:</strong> Your bank branch (if applicable)</li>
      </ul>

      <h3>International Transfers</h3>
      <p>
        For international clients, you may also need:
      </p>
      <ul>
        <li><strong>SWIFT/BIC code:</strong> For international wire transfers</li>
        <li><strong>IBAN:</strong> If your bank supports it</li>
        <li><strong>Correspondent bank:</strong> For USD transactions</li>
      </ul>

      <h2>Setting Up Cryptocurrency</h2>
      <p>
        Accept crypto for fast, borderless payments.
      </p>

      <h3>Adding a Crypto Wallet</h3>
      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Cryptocurrency"</strong></li>
        <li>Select the cryptocurrencies you want to accept</li>
        <li>Enter your wallet addresses</li>
        <li>Enable for invoices</li>
      </ol>

      <h3>Supported Cryptocurrencies</h3>
      <ul>
        <li><strong>Bitcoin (BTC):</strong> Most widely accepted</li>
        <li><strong>USD Coin (USDC):</strong> Stable value, pegged to USD</li>
        <li><strong>Ethereum (ETH):</strong> Popular, fast transactions</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-[#14462a15] bg-[#14462a08] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#14462a]">💡 Stablecoins recommended:</strong> USDC maintains 
          a stable value tied to USD, eliminating price volatility concerns for you and your clients.
        </p>
      </div>

      <h2>Managing Payment Methods</h2>

      <h3>Default Payment Methods</h3>
      <p>
        Set which payment methods appear by default on new invoices:
      </p>
      <ol>
        <li>Go to <strong>Settings → Invoice Preferences</strong></li>
        <li>Find <strong>"Default Payment Methods"</strong></li>
        <li>Check the methods you want enabled by default</li>
        <li>Drag to reorder (top = most prominent)</li>
      </ol>

      <h3>Per-Invoice Customization</h3>
      <p>
        You can customize payment methods for each invoice:
      </p>
      <ul>
        <li>Enable/disable specific methods for a client</li>
        <li>Add special instructions for payment</li>
        <li>Set preferred payment method for the client</li>
      </ul>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Offer Multiple Options</h4>
          <p className="text-sm text-gray-700">
            Clients are more likely to pay quickly when they can use their preferred method.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Highlight Mobile Money for Ghana</h4>
          <p className="text-sm text-gray-700">
            Most Ghanaian clients prefer mobile money for its speed and convenience.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Use Bank for Large Amounts</h4>
          <p className="text-sm text-gray-700">
            For invoices over GHS 10,000, bank transfer may be more practical.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Verify All Details</h4>
          <p className="text-sm text-gray-700">
            Double-check account numbers and wallet addresses to avoid payment issues.
          </p>
        </div>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Payment Not Received?</h3>
      <p>
        If a client says they've paid but you haven't received it:
      </p>
      <ul>
        <li>Ask for their transaction reference/receipt</li>
        <li>Check the correct account was used</li>
        <li>Allow time for processing (especially bank transfers)</li>
        <li>Contact our support if issues persist</li>
      </ul>
    </HelpArticleLayout>
  );
}
