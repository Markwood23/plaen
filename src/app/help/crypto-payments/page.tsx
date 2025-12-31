"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Bitcoin, SecuritySafe, Flash, Global, Warning2 } from "iconsax-react";

const supportedCryptos = [
  {
    name: "Bitcoin (BTC)",
    description: "The world's first and most trusted cryptocurrency, perfect for large transactions.",
    icon: "₿",
    color: "#F59E0B",
    features: [
      "Highest liquidity and acceptance",
      "Proven track record since 2009", 
      "Global recognition and trust",
      "Ideal for larger payments"
    ]
  },
  {
    name: "USD Coin (USDC)",
    description: "A stable cryptocurrency pegged to the US Dollar, providing price stability.",
    icon: "$",
    color: "#14462a",
    features: [
      "Price stable (pegged to USD)",
      "Fast and cheap transfers",
      "Widely accepted globally",
      "Perfect for business payments"
    ]
  },
  {
    name: "Ethereum (ETH)",
    description: "The second-largest cryptocurrency with broad ecosystem support.",
    icon: "Ξ",
    color: "#14462a",
    features: [
      "Smart contract functionality",
      "Large developer ecosystem",
      "High transaction volume", 
      "DeFi integration capabilities"
    ]
  }
];

const advantages = [
  {
    title: "Global Payments",
    description: "Accept payments from anywhere in the world without traditional banking restrictions.",
    icon: Global,
    color: "#14462a",
  },
  {
    title: "Fast Settlement",
    description: "Receive payments in minutes rather than days, with real-time confirmations.",
    icon: Flash,
    color: "#F59E0B",
  },
  {
    title: "Lower Fees",
    description: "Cryptocurrency payments typically cost 1-3% compared to 3-5% for traditional methods.",
    icon: Bitcoin,
    color: "#14462a",
  },
  {
    title: "Enhanced Security",
    description: "Blockchain technology provides cryptographic security and immutable records.",
    icon: SecuritySafe,
    color: "#6B7280",
  }
];

export default function CryptoPaymentsPage() {
  return (
    <HelpArticleLayout
      title="Cryptocurrency Payments"
      description="Accept Bitcoin, Ethereum, stablecoins, and other cryptocurrencies from clients worldwide. Fast, secure, and borderless transactions."
      category="Payments"
      categoryColor="#D97706"
      readTime="5 min read"
      relatedArticles={[
        {
          title: "Setting up payment methods",
          description: "Configure how you get paid",
          slug: "payment-setup",
          readTime: "3 min read"
        },
        {
          title: "Bank transfers",
          description: "Accept traditional bank payments",
          slug: "bank-transfers",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>What Are Cryptocurrency Payments?</h2>
      <p>
        Cryptocurrency payments allow your clients to pay you using digital currencies like Bitcoin, 
        Ethereum, or stablecoins. These payments are processed on blockchain networks, providing 
        transparency, security, and global accessibility without traditional banking infrastructure.
      </p>

      <p>
        Unlike traditional payments that require bank accounts and can take days to process, cryptocurrency 
        payments settle in minutes and can be sent from anywhere in the world. This makes them particularly 
        valuable for international business and clients in regions with limited banking access.
      </p>

      <h2>Why Accept Cryptocurrency?</h2>

      <div className="not-prose my-12 grid gap-6 sm:grid-cols-2">
        {advantages.map((advantage) => {
          const Icon = advantage.icon;
          return (
            <div 
              key={advantage.title} 
              className="border-l-4 pl-5"
              style={{ borderColor: advantage.color }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} color={advantage.color} variant="Bulk" />
                <h3 className="font-semibold text-black">{advantage.title}</h3>
              </div>
              <p className="text-gray-700 text-sm">{advantage.description}</p>
            </div>
          );
        })}
      </div>

      <h2>Supported Cryptocurrencies</h2>
      <p>
        We support the most popular and stable cryptocurrencies to give your clients options while 
        ensuring reliable, secure payments:
      </p>

      <div className="not-prose my-12 space-y-8">
        {supportedCryptos.map((crypto) => (
          <div 
            key={crypto.name} 
            className="border-l-4 pl-6"
            style={{ borderColor: crypto.color }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white"
                style={{ backgroundColor: crypto.color }}
              >
                {crypto.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black">{crypto.name}</h3>
                <p className="text-gray-700">{crypto.description}</p>
              </div>
            </div>
            
            <div className="ml-16 space-y-2">
              {crypto.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <TickCircle size={16} color={crypto.color} variant="Bulk" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>How Crypto Payments Work</h2>

      <h3>Step 1: Enable Cryptocurrency</h3>
      <p>
        Add your cryptocurrency wallet addresses in Settings → Payment Methods. You can add 
        separate wallets for each supported cryptocurrency.
      </p>

      <h3>Step 2: Client Selects Crypto</h3>
      <p>
        When viewing your invoice, the client chooses to pay with cryptocurrency and selects 
        their preferred coin (BTC, USDC, or ETH).
      </p>

      <h3>Step 3: Payment Processing</h3>
      <p>
        The client sends the exact amount to your wallet address. The blockchain confirms 
        the transaction, typically within minutes.
      </p>

      <h3>Step 4: Invoice Updated</h3>
      <p>
        Once confirmed, Plaen automatically updates the invoice status to paid and notifies 
        both you and your client.
      </p>

      <h2>Setting Up Crypto Payments</h2>
      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Cryptocurrency"</strong></li>
        <li>Select the cryptocurrencies you want to accept</li>
        <li>Enter your wallet address for each cryptocurrency</li>
        <li>Verify and save</li>
      </ol>

      <div className="not-prose my-6 flex items-start gap-3 rounded-lg border border-[#DC262615] bg-[#DC262608] p-4">
        <Warning2 size={20} color="#DC2626" variant="Bulk" className="flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <strong className="text-[#DC2626]">Important:</strong> Double-check your wallet addresses 
          before saving. Cryptocurrency sent to the wrong address cannot be recovered.
        </div>
      </div>

      <h2>Price Volatility</h2>
      <p>
        Cryptocurrency prices can fluctuate. Here's how to handle it:
      </p>
      <ul>
        <li><strong>Use stablecoins:</strong> USDC maintains a 1:1 USD value</li>
        <li><strong>Convert quickly:</strong> Convert to fiat soon after receiving</li>
        <li><strong>Price at time of payment:</strong> Invoice shows equivalent at payment time</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-[#14462a15] bg-[#14462a08] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#14462a]">💡 Recommendation:</strong> For business payments, 
          consider accepting USDC (USD Coin) which maintains stable value and eliminates 
          volatility concerns.
        </p>
      </div>

      <h2>Transaction Fees</h2>
      <p>
        Cryptocurrency network fees (gas fees) are typically paid by the sender. Fee levels vary:
      </p>
      <ul>
        <li><strong>Bitcoin:</strong> Variable, usually $1-10 depending on network congestion</li>
        <li><strong>Ethereum:</strong> Variable gas fees, can be higher during busy periods</li>
        <li><strong>USDC:</strong> Uses Ethereum network or cheaper alternatives like Polygon</li>
      </ul>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Use a secure, non-custodial wallet you control</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Keep your wallet addresses up to date</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Consider accepting stablecoins for stable value</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Record transactions for tax purposes</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
