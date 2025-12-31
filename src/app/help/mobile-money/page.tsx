"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Mobile, Clock, SecuritySafe, Global } from "iconsax-react";

const mobileMoneyProviders = [
  {
    name: "MTN Mobile Money",
    countries: ["Ghana", "Nigeria", "Uganda", "Rwanda"],
    description: "The largest mobile money network in Africa with over 50 million active users.",
    color: "#F59E0B",
    features: [
      "Instant transfers and payments",
      "Available 24/7 including weekends",
      "No bank account required",
      "Low transaction fees"
    ]
  },
  {
    name: "Vodafone Cash", 
    countries: ["Ghana", "Tanzania", "DRC"],
    description: "Reliable mobile money service with strong presence across multiple African markets.",
    color: "#DC2626",
    features: [
      "Fast payment processing",
      "Secure PIN-based authentication", 
      "Wide agent network coverage",
      "Integration with banking services"
    ]
  },
  {
    name: "AirtelTigo Money",
    countries: ["Ghana"],
    description: "Merged mobile money service combining Airtel and Tigo networks in Ghana.",
    color: "#14462a",
    features: [
      "Unified payment platform",
      "Enhanced network coverage",
      "Competitive transaction rates",
      "Reliable customer support"
    ]
  }
];

const advantages = [
  {
    title: "Instant Payments",
    description: "Mobile money payments are processed in real-time, often within seconds.",
    icon: Clock,
    color: "#F59E0B",
  },
  {
    title: "Universal Access",
    description: "No bank account required—clients only need a mobile phone.",
    icon: Mobile,
    color: "#14462a",
  },
  {
    title: "High Security",
    description: "Protected by PIN authentication and encrypted transactions.",
    icon: SecuritySafe,
    color: "#6B7280",
  },
  {
    title: "Wide Coverage",
    description: "Available across Africa with extensive agent networks.",
    icon: Global,
    color: "#14462a",
  }
];

export default function MobileMoneyPage() {
  return (
    <HelpArticleLayout
      title="Mobile Money Payments"
      description="Accept mobile money payments from clients across Africa using MTN, Vodafone, AirtelTigo, and other popular services. Fast, secure, and accessible."
      category="Payments"
      categoryColor="#D97706"
      readTime="4 min read"
      relatedArticles={[
        {
          title: "MTN Mobile Money setup",
          description: "Detailed MTN setup guide",
          slug: "mtn-setup",
          readTime: "3 min read"
        },
        {
          title: "Getting paid faster",
          description: "Tips for faster payments",
          slug: "mobile-money-faster",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>What is Mobile Money?</h2>
      <p>
        Mobile money is a digital payment service that allows people to send, receive, and store money 
        using their mobile phones. It's particularly popular in Africa where it has revolutionized 
        financial services by providing access to digital payments without requiring a traditional bank account.
      </p>

      <p>
        For businesses, mobile money represents one of the fastest and most accessible ways to receive 
        payments from clients. With over 300 million mobile money accounts across Africa, it's often 
        the preferred payment method for both individuals and small businesses.
      </p>

      <h2>Why Mobile Money Matters</h2>

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

      <h2>Supported Mobile Money Providers</h2>
      <p>
        We support the most popular mobile money networks to give your clients 
        convenient payment options:
      </p>

      <div className="not-prose my-12 space-y-8">
        {mobileMoneyProviders.map((provider) => (
          <div 
            key={provider.name} 
            className="border-l-4 pl-6"
            style={{ borderColor: provider.color }}
          >
            <h3 className="text-xl font-semibold text-black mb-2">{provider.name}</h3>
            <p className="text-gray-700 mb-4">{provider.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              Available in: {provider.countries.join(", ")}
            </div>
            <div className="space-y-2">
              {provider.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <TickCircle size={16} color={provider.color} variant="Bulk" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>How Mobile Money Payments Work</h2>

      <h3>For Your Clients</h3>
      <ol>
        <li>Client receives your invoice via email or link</li>
        <li>They select mobile money as their payment method</li>
        <li>They choose their provider (MTN, Vodafone, AirtelTigo)</li>
        <li>They enter their mobile number and authorize payment</li>
        <li>Payment is confirmed instantly</li>
      </ol>

      <h3>For You</h3>
      <ol>
        <li>You receive instant notification of payment</li>
        <li>Invoice is automatically marked as paid</li>
        <li>Funds are available in your mobile money wallet</li>
        <li>You can withdraw to bank or use directly</li>
      </ol>

      <h2>Setting Up Mobile Money</h2>
      <ol>
        <li>Go to <strong>Settings → Payment Methods</strong></li>
        <li>Click <strong>"Add Mobile Money"</strong></li>
        <li>Select your mobile money provider</li>
        <li>Enter your registered phone number</li>
        <li>Verify with the code sent to your phone</li>
        <li>Enable for invoices</li>
      </ol>

      <div className="not-prose my-6 rounded-lg border border-[#F59E0B15] bg-[#F59E0B08] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#F59E0B]">💡 Tip:</strong> You can add multiple mobile money 
          accounts from different providers to give clients more options.
        </p>
      </div>

      <h2>Transaction Fees</h2>
      <p>
        Mobile money transaction fees are typically lower than traditional banking:
      </p>
      <ul>
        <li><strong>Receiving payments:</strong> Usually 0.5-1% of transaction value</li>
        <li><strong>Transfers between providers:</strong> May vary by amount</li>
        <li><strong>Withdrawal to bank:</strong> Small fee depending on amount</li>
      </ul>

      <h2>Transaction Limits</h2>
      <p>
        Mobile money accounts have daily and monthly limits:
      </p>
      <ul>
        <li><strong>Basic accounts:</strong> Lower limits, minimal verification</li>
        <li><strong>Verified accounts:</strong> Higher limits with KYC verification</li>
        <li><strong>Business accounts:</strong> Highest limits for registered businesses</li>
      </ul>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">📝 Note:</strong> For regular business payments, 
          consider upgrading to a verified or business mobile money account to access 
          higher transaction limits.
        </p>
      </div>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Make mobile money your primary payment option for local clients</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Keep your mobile money account verified for higher limits</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Offer multiple providers when possible</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Monitor transactions and set up notifications</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
