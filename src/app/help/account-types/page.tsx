"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { User, Building, TickCircle, CloseCircle } from "iconsax-react";

const accountTypes = [
  {
    name: "Personal Account",
    description: "Perfect for freelancers and independent professionals who bill clients under their own name.",
    icon: User,
    color: "#B45309",
    features: [
      "Create unlimited invoices",
      "Accept mobile money and bank transfers",
      "Personal branding with your name",
      "Simple, streamlined dashboard",
      "Track payments and expenses",
      "Export reports for taxes"
    ]
  },
  {
    name: "Business Account",
    description: "Designed for registered businesses, agencies, and companies with multiple team members.",
    icon: Building,
    color: "#14462a",
    features: [
      "Everything in Personal, plus:",
      "Add your company logo and branding",
      "Include business registration details",
      "Multiple payment methods per invoice",
      "Advanced reporting and analytics",
      "Priority customer support"
    ]
  }
];

export default function AccountTypesPage() {
  return (
    <HelpArticleLayout
      title="Account Types"
      description="Understand the differences between Personal and Business accounts to choose the right option for your invoicing needs."
      category="Account Settings"
      categoryColor="#6B7280"
      readTime="3 min read"
      relatedArticles={[
        {
          title: "Creating your account",
          description: "Step-by-step guide to signing up",
          slug: "creating-account",
          readTime: "2 min read"
        },
        {
          title: "Getting started",
          description: "Your first steps with Plaen",
          slug: "getting-started",
          readTime: "5 min read"
        }
      ]}
    >
      <h2>Choosing the Right Account Type</h2>
      <p>
        Plaen offers two account types to match your invoicing needs: Personal and Business. 
        Both types give you access to our powerful invoicing tools, but with features tailored 
        to different use cases.
      </p>

      <div className="not-prose my-12 space-y-8">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div 
              key={type.name}
              className="rounded-2xl border border-gray-200 p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <Icon size={24} color={type.color} variant="Bulk" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-black">{type.name}</h3>
                  <p className="text-gray-700 mt-1">{type.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {type.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <TickCircle size={18} color={type.color} variant="Bulk" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h2>Personal Account</h2>
      <p>
        The Personal account is designed for individual professionals who work independently. 
        This includes freelancers, consultants, contractors, and anyone who bills clients 
        under their own name rather than a registered business.
      </p>

      <h3>Best for:</h3>
      <ul>
        <li>Freelance designers, writers, and developers</li>
        <li>Independent consultants and coaches</li>
        <li>Solo service providers</li>
        <li>Side hustle invoicing</li>
      </ul>

      <h2>Business Account</h2>
      <p>
        The Business account is built for registered companies and organizations that need 
        professional business branding on their invoices. It includes features for adding 
        company details, logos, and business registration information.
      </p>

      <h3>Best for:</h3>
      <ul>
        <li>Registered businesses and LLCs</li>
        <li>Creative agencies and studios</li>
        <li>Professional service firms</li>
        <li>Small and medium businesses</li>
      </ul>

      <h2>Switching Account Types</h2>
      <p>
        You can switch between Personal and Business accounts at any time from your 
        account settings. When you switch:
      </p>
      <ul>
        <li>All your existing invoices are preserved</li>
        <li>Your payment methods remain connected</li>
        <li>You'll need to update your profile with the new account type details</li>
        <li>Previous invoices will retain their original branding</li>
      </ul>

      <div className="not-prose my-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h4 className="font-semibold text-black mb-2">💡 Tip</h4>
        <p className="text-gray-700 text-sm">
          Not sure which to choose? Start with a Personal account—it's quick to set up 
          and you can always upgrade to Business later as your needs grow.
        </p>
      </div>

      <h2>Comparison at a Glance</h2>
      
      <div className="not-prose my-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">Feature</th>
              <th className="px-4 py-3 text-center font-semibold text-black">Personal</th>
              <th className="px-4 py-3 text-center font-semibold text-black">Business</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-gray-700">Unlimited invoices</td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Mobile money payments</td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Company logo</td>
              <td className="px-4 py-3 text-center"><CloseCircle size={18} color="#9CA3AF" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Business registration</td>
              <td className="px-4 py-3 text-center"><CloseCircle size={18} color="#9CA3AF" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Advanced analytics</td>
              <td className="px-4 py-3 text-center"><CloseCircle size={18} color="#9CA3AF" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">Priority support</td>
              <td className="px-4 py-3 text-center"><CloseCircle size={18} color="#9CA3AF" variant="Bulk" className="mx-auto" /></td>
              <td className="px-4 py-3 text-center"><TickCircle size={18} color="#14462a" variant="Bulk" className="mx-auto" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </HelpArticleLayout>
  );
}
