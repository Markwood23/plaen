"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Flash, Mobile, Clock } from "iconsax-react";

const tips = [
  {
    title: "Make Mobile Money Primary",
    description: "List mobile money as the first payment option on your invoices. Clients tend to choose the first option presented.",
    icon: Mobile,
    color: "#F59E0B"
  },
  {
    title: "Send Invoices at the Right Time",
    description: "Send invoices at the beginning of the day when clients are checking their phones and have available balance.",
    icon: Clock,
    color: "#14462a"
  },
  {
    title: "Use Payment Links",
    description: "Include a direct payment link in your invoice. One click should take clients straight to payment.",
    icon: Flash,
    color: "#14462a"
  }
];

export default function MobileMoneyFasterPage() {
  return (
    <HelpArticleLayout
      title="Getting Paid Faster with Mobile Money"
      description="Tips and strategies to maximize the speed of your mobile money payments and reduce payment delays."
      category="Payments"
      categoryColor="#D97706"
      readTime="3 min read"
      relatedArticles={[
        {
          title: "Mobile money payments",
          description: "Overview of mobile money",
          slug: "mobile-money",
          readTime: "4 min read"
        },
        {
          title: "MTN Mobile Money setup",
          description: "Set up MTN payments",
          slug: "mtn-setup",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>Why Mobile Money is Faster</h2>
      <p>
        Mobile money is the fastest way to receive payments in Ghana. Unlike bank transfers 
        that can take 1-3 days to clear, mobile money payments are processed instantly. 
        Here's how to maximize this advantage.
      </p>

      <h2>Quick Tips for Faster Payments</h2>

      <div className="not-prose my-12 space-y-6">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div 
              key={tip.title}
              className="flex gap-4 rounded-xl border border-gray-200 p-6"
            >
              <div 
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${tip.color}15` }}
              >
                <Icon size={24} color={tip.color} variant="Bulk" />
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">{tip.title}</h3>
                <p className="text-gray-700">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2>Optimize Your Invoice for Mobile Payments</h2>

      <h3>Clear Payment Instructions</h3>
      <p>
        Make it obvious how to pay with mobile money:
      </p>
      <ul>
        <li>Highlight mobile money as the recommended payment method</li>
        <li>Include the exact amount to transfer</li>
        <li>Provide your registered phone number clearly</li>
        <li>Add brief step-by-step instructions if needed</li>
      </ul>

      <h3>Reduce Friction</h3>
      <p>
        Every extra step increases the chance of payment delay:
      </p>
      <ul>
        <li>Use one-click payment links</li>
        <li>Pre-fill as much information as possible</li>
        <li>Support all major mobile money providers</li>
        <li>Make sure your phone number is correct</li>
      </ul>

      <h2>Best Times to Send Invoices</h2>
      <p>
        Timing matters for mobile money payments:
      </p>

      <div className="not-prose my-6 space-y-3">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">✅ Best: Early Morning (8-10 AM)</h4>
          <p className="text-sm text-gray-700 mt-1">
            Clients are starting their day, checking messages, and mobile money balances are often topped up.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">✅ Good: Beginning of Month</h4>
          <p className="text-sm text-gray-700 mt-1">
            Many clients have fresh budgets and are processing payments.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">⚠️ Avoid: Late Friday</h4>
          <p className="text-sm text-gray-700 mt-1">
            Payments sent Friday afternoon often wait until Monday.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black">⚠️ Avoid: Month End</h4>
          <p className="text-sm text-gray-700 mt-1">
            Many businesses have tight cash flow at month end.
          </p>
        </div>
      </div>

      <h2>Follow-Up Strategies</h2>
      <p>
        If payment hasn't arrived within your expected timeframe:
      </p>

      <h3>Day 1-2: Gentle Reminder</h3>
      <p>
        Send a friendly reminder that includes:
      </p>
      <ul>
        <li>The original invoice or a link to it</li>
        <li>Your mobile money number</li>
        <li>A simple "Just checking if you received this"</li>
      </ul>

      <h3>Day 3-5: Direct Follow-Up</h3>
      <p>
        A more direct approach:
      </p>
      <ul>
        <li>Call or WhatsApp the client directly</li>
        <li>Offer to help if there are any issues</li>
        <li>Confirm they have the correct payment details</li>
      </ul>

      <h3>Week 2+: Formal Reminder</h3>
      <p>
        For overdue payments:
      </p>
      <ul>
        <li>Send a formal payment reminder email</li>
        <li>Reference any late payment terms</li>
        <li>Offer alternative payment methods if needed</li>
      </ul>

      <h2>Common Payment Delays and Solutions</h2>

      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">"I didn't receive the invoice"</h4>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> Send invoices via multiple channels (email + WhatsApp) 
            and always confirm receipt.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">"My mobile money balance is low"</h4>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> Offer to accept partial payment now and the rest later, 
            or suggest bank transfer as alternative.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">"I use a different network"</h4>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> Support multiple mobile money providers (MTN, Vodafone, AirtelTigo) 
            so clients can use their preferred network.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">"Transaction failed"</h4>
          <p className="text-sm text-gray-700">
            <strong>Solution:</strong> Verify your mobile money account is active and within limits. 
            Ask client to try again or use alternative provider.
          </p>
        </div>
      </div>

      <h2>Checklist for Faster Payments</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Mobile money is the first/primary payment option</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Payment link is included and working</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Multiple mobile money providers are supported</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Phone number is correct and verified</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Automatic reminders are enabled</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Invoice is sent at an optimal time</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
