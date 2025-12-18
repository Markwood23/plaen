"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Mobile, SecuritySafe, Warning2 } from "iconsax-react";

export default function MtnSetupPage() {
  return (
    <HelpArticleLayout
      title="Setting Up MTN Mobile Money"
      description="Step-by-step guide to connecting your MTN Mobile Money account to receive instant payments from clients."
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
          title: "Getting paid faster",
          description: "Tips for faster payments",
          slug: "mobile-money-faster",
          readTime: "3 min read"
        }
      ]}
    >
      <h2>About MTN Mobile Money</h2>
      <p>
        MTN Mobile Money (MoMo) is the largest mobile money service in Ghana and across Africa, 
        with over 50 million active users. It's the most convenient payment option for most 
        Ghanaian clients and offers instant payment processing.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F59E0B15]">
            <Mobile size={20} color="#F59E0B" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">50M+ Users</h3>
          <p className="mt-2 text-sm text-gray-700">
            Ghana's most popular mobile money service
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#14462a15]">
            <SecuritySafe size={20} color="#14462a" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">Instant Payments</h3>
          <p className="mt-2 text-sm text-gray-700">
            Receive payments in seconds, not days
          </p>
        </div>
      </div>

      <h2>Prerequisites</h2>
      <p>
        Before setting up MTN MoMo in Plaen, ensure you have:
      </p>
      <ul>
        <li>An active MTN Ghana SIM card</li>
        <li>Registered MTN Mobile Money account</li>
        <li>Access to the phone with your MTN number</li>
        <li>Your MTN MoMo PIN</li>
      </ul>

      <div className="not-prose my-6 flex items-start gap-3 rounded-lg border border-[#F59E0B15] bg-[#F59E0B08] p-4">
        <Warning2 size={20} color="#F59E0B" variant="Bulk" className="flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <strong className="text-[#F59E0B]">Don't have MTN MoMo yet?</strong> Dial *170# on your MTN 
          phone and follow the prompts to register. You'll need a valid Ghana Card or passport.
        </div>
      </div>

      <h2>Step-by-Step Setup</h2>

      <h3>Step 1: Navigate to Payment Methods</h3>
      <ol>
        <li>Log in to your Plaen account</li>
        <li>Go to <strong>Settings</strong> in the sidebar</li>
        <li>Click <strong>Payment Methods</strong></li>
        <li>Click <strong>"Add Payment Method"</strong></li>
      </ol>

      <h3>Step 2: Select MTN Mobile Money</h3>
      <ol>
        <li>From the payment methods list, select <strong>"Mobile Money"</strong></li>
        <li>Choose <strong>"MTN Mobile Money"</strong> as your provider</li>
      </ol>

      <h3>Step 3: Enter Your Phone Number</h3>
      <ol>
        <li>Enter your MTN phone number (the one linked to your MoMo account)</li>
        <li>Make sure to use the format: 024XXXXXXX or 054XXXXXXX</li>
        <li>Double-check the number is correct—this is where payments will be sent!</li>
      </ol>

      <h3>Step 4: Verify Your Number</h3>
      <ol>
        <li>Click <strong>"Send Verification Code"</strong></li>
        <li>You'll receive an SMS with a 6-digit code</li>
        <li>Enter the code in Plaen</li>
        <li>Click <strong>"Verify"</strong></li>
      </ol>

      <h3>Step 5: Confirm and Save</h3>
      <ol>
        <li>Review your MTN MoMo details</li>
        <li>Choose whether to make this your default payment method</li>
        <li>Click <strong>"Save Payment Method"</strong></li>
      </ol>

      <div className="not-prose my-6 rounded-lg border border-[#14462a15] bg-[#14462a08] p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#14462a]">✅ Success!</strong> Your MTN Mobile Money is now 
          connected. You can start accepting payments on your next invoice.
        </p>
      </div>

      <h2>Using MTN MoMo on Invoices</h2>
      <p>
        Once set up, you can enable MTN MoMo on your invoices:
      </p>
      <ol>
        <li>Create or edit an invoice</li>
        <li>In the Payment Methods section, check <strong>"MTN Mobile Money"</strong></li>
        <li>Your registered number will appear on the invoice</li>
        <li>Clients can pay directly from the invoice</li>
      </ol>

      <h2>How Clients Pay</h2>
      <p>
        When clients receive your invoice, they can pay via MTN MoMo:
      </p>
      <ol>
        <li>Click the <strong>"Pay Now"</strong> button on the invoice</li>
        <li>Select <strong>"MTN Mobile Money"</strong></li>
        <li>Enter their MTN phone number</li>
        <li>Approve the payment on their phone</li>
        <li>Payment is processed instantly</li>
      </ol>

      <p>
        Alternatively, clients can pay manually:
      </p>
      <ol>
        <li>Dial *170# on their MTN phone</li>
        <li>Select "Transfer Money" → "To Mobile Number"</li>
        <li>Enter your number and the invoice amount</li>
        <li>Confirm with their PIN</li>
      </ol>

      <h2>Transaction Limits</h2>
      <p>
        MTN MoMo has daily transaction limits based on your account type:
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">Account Type</th>
              <th className="px-4 py-3 text-left font-semibold text-black">Daily Limit</th>
              <th className="px-4 py-3 text-left font-semibold text-black">Monthly Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-gray-700">Basic (unverified)</td>
              <td className="px-4 py-3 text-gray-700">GHS 300</td>
              <td className="px-4 py-3 text-gray-700">GHS 1,000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Level 1 (ID verified)</td>
              <td className="px-4 py-3 text-gray-700">GHS 5,000</td>
              <td className="px-4 py-3 text-gray-700">GHS 20,000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Level 2 (enhanced)</td>
              <td className="px-4 py-3 text-gray-700">GHS 10,000</td>
              <td className="px-4 py-3 text-gray-700">GHS 50,000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Business Account</td>
              <td className="px-4 py-3 text-gray-700">Higher limits</td>
              <td className="px-4 py-3 text-gray-700">Negotiable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-black">💡 Tip:</strong> If you regularly receive payments above 
          GHS 5,000, consider upgrading to a Level 2 or Business MTN MoMo account for higher limits.
        </p>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Verification code not received?</h3>
      <ul>
        <li>Check your phone has network signal</li>
        <li>Ensure you entered the correct MTN number</li>
        <li>Wait a few minutes and try again</li>
        <li>Contact MTN support if issues persist</li>
      </ul>

      <h3>Payment not showing?</h3>
      <ul>
        <li>MTN MoMo payments are instant—if not received, check the sender used the correct number</li>
        <li>Ask the sender for their transaction reference</li>
        <li>Check your MTN MoMo balance and transaction history</li>
      </ul>

      <h3>Transaction failed?</h3>
      <ul>
        <li>Client may have insufficient balance</li>
        <li>Transaction may exceed daily/monthly limits</li>
        <li>Network issues—ask client to try again</li>
      </ul>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Keep your MTN number active and topped up</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Upgrade to Level 2 for higher transaction limits</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Set MTN MoMo as your default payment method for local clients</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Enable notifications to know immediately when payments arrive</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
