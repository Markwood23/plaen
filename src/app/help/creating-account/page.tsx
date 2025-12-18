"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, User, Building, SecuritySafe, Sms } from "iconsax-react";

const steps = [
  {
    step: 1,
    title: "Visit the signup page",
    description: "Go to plaen.co/signup to begin creating your account."
  },
  {
    step: 2,
    title: "Enter your email",
    description: "Use a professional email address that you check regularly."
  },
  {
    step: 3,
    title: "Create a password",
    description: "Choose a strong password with at least 8 characters."
  },
  {
    step: 4,
    title: "Choose account type",
    description: "Select Personal for freelancers or Business for companies."
  },
  {
    step: 5,
    title: "Complete your profile",
    description: "Add your name, contact details, and profile information."
  }
];

export default function CreatingAccountPage() {
  return (
    <HelpArticleLayout
      title="Creating Your Account"
      description="A step-by-step guide to setting up your Plaen account and getting ready to send your first invoice."
      category="Getting Started"
      categoryColor="#14462a"
      readTime="2 min read"
      relatedArticles={[
        {
          title: "Account types",
          description: "Personal vs Business accounts",
          slug: "account-types",
          readTime: "3 min read"
        },
        {
          title: "Your first invoice",
          description: "Send your first invoice in minutes",
          slug: "first-invoice",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>Quick Start</h2>
      <p>
        Creating your Plaen account takes less than 2 minutes. Follow these simple steps 
        to get started with professional invoicing.
      </p>

      <div className="not-prose my-12 space-y-6">
        {steps.map((item) => (
          <div key={item.step} className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#14462a] text-sm font-semibold text-white">
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold text-black">{item.title}</h3>
              <p className="text-gray-700 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Choosing Your Account Type</h2>
      <p>
        During signup, you'll choose between two account types:
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B4530915]">
              <User size={20} color="#B45309" variant="Bulk" />
            </div>
            <h3 className="font-semibold text-black">Personal</h3>
          </div>
          <p className="text-sm text-gray-700">
            For freelancers and individuals billing under their own name.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14462a15]">
              <Building size={20} color="#14462a" variant="Bulk" />
            </div>
            <h3 className="font-semibold text-black">Business</h3>
          </div>
          <p className="text-sm text-gray-700">
            For registered companies with business branding needs.
          </p>
        </div>
      </div>

      <h2>Email Verification</h2>
      <p>
        After signing up, you'll receive a verification email. Click the link in the email 
        to verify your account and unlock all features.
      </p>

      <div className="not-prose my-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Sms size={20} color="#6B7280" variant="Bulk" className="flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <strong className="text-black">Can't find the email?</strong> Check your spam folder or 
          request a new verification email from the login page.
        </div>
      </div>

      <h2>Completing Your Profile</h2>
      <p>
        After verification, complete your profile to personalize your invoices:
      </p>

      <ul>
        <li><strong>Full name:</strong> As it should appear on invoices</li>
        <li><strong>Phone number:</strong> For account recovery and client contact</li>
        <li><strong>Address:</strong> Your business or billing address</li>
        <li><strong>Profile photo:</strong> Optional, adds a personal touch</li>
      </ul>

      <h3>For Business Accounts</h3>
      <p>
        If you chose a Business account, you'll also need:
      </p>
      <ul>
        <li><strong>Business name:</strong> Your registered company name</li>
        <li><strong>Business logo:</strong> Upload your company logo</li>
        <li><strong>Registration number:</strong> If applicable in your country</li>
        <li><strong>Tax ID:</strong> For tax-compliant invoices</li>
      </ul>

      <h2>Account Security</h2>
      <p>
        We take security seriously. Here's how we protect your account:
      </p>

      <div className="not-prose my-8 space-y-4">
        <div className="flex items-start gap-3">
          <SecuritySafe size={20} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <div>
            <strong className="text-black">Secure passwords</strong>
            <p className="text-sm text-gray-700 mt-1">
              All passwords are encrypted and never stored in plain text.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <SecuritySafe size={20} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <div>
            <strong className="text-black">Session management</strong>
            <p className="text-sm text-gray-700 mt-1">
              Active sessions are monitored and you can log out remotely.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <SecuritySafe size={20} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <div>
            <strong className="text-black">Data encryption</strong>
            <p className="text-sm text-gray-700 mt-1">
              All data is encrypted in transit and at rest.
            </p>
          </div>
        </div>
      </div>

      <h2>What's Next?</h2>
      <p>
        Once your account is set up, you're ready to:
      </p>
      <ul>
        <li>Set up your payment methods (mobile money, bank transfer)</li>
        <li>Create your first invoice</li>
        <li>Add your first client</li>
        <li>Customize your invoice template</li>
      </ul>

      <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h4 className="font-semibold text-black mb-2">🎉 Welcome to Plaen!</h4>
        <p className="text-gray-700 text-sm">
          You're all set to start sending professional invoices and getting paid faster. 
          Check out our guide on creating your first invoice to get started.
        </p>
      </div>
    </HelpArticleLayout>
  );
}
