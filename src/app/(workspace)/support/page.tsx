"use client";

import { useState } from "react";
import {
  SearchNormal1,
  Book1,
  Message,
  Sms,
  Call,
  ExportSquare,
  ArrowRight2,
  MessageQuestion,
  Receipt21,
  Setting2,
  Flash,
  Clock,
  TickCircle,
  CloseCircle,
  ArrowLeft2,
  UserAdd,
  Wallet,
  Send2,
  Mobile,
  Bank,
  Bitcoin,
  Card,
  ShieldTick,
  WalletMoney,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Rich article content with proper styling like marketing pages
const articleContent: Record<string, {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  content: React.ReactNode;
}> = {
  "first-invoice": {
    title: "Creating Your First Invoice",
    description: "Learn how to create and send a professional invoice to your client in just a few minutes.",
    category: "Getting Started",
    categoryColor: "#14462a",
    readTime: "4 min read",
    content: (
      <>
        {/* Steps Grid */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {[
            { icon: UserAdd, title: "Add client details", description: "Enter your client's name, email, and billing address.", color: "#B45309", step: 1 },
            { icon: Receipt21, title: "Add line items", description: "Describe your services with quantities and prices.", color: "#14462a", step: 2 },
            { icon: Wallet, title: "Set payment options", description: "Choose how you want to receive payment.", color: "#D97706", step: 3 },
            { icon: Send2, title: "Send invoice", description: "Review and send directly to your client.", color: "#14462a", step: 4 },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div 
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <Icon size={20} color={step.color} variant="Bulk" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Step {step.step}</span>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Creating an invoice with Plaen is simple and takes just a few minutes. 
          This guide walks you through each step to create and send your first 
          professional invoice.
        </p>

        {/* Tip Box */}
        <div className="rounded-xl border border-[#14462a]/20 bg-[#14462a]/5 p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong className="text-[#14462a]">💡 Pro Tip:</strong> Save frequently used items as templates 
            to speed up future invoicing. You can also set up automatic payment reminders.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Writing Good Descriptions</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Be specific about what you delivered. Good descriptions help clients understand 
          the value and reduce payment questions.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
            <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-900">Good example:</span>
              <p className="text-sm text-gray-600">&quot;Website design - 5-page responsive site with contact form and SEO optimization&quot;</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 bg-gray-50">
            <CloseCircle size={18} color="#9CA3AF" variant="Bulk" className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-900">Avoid:</span>
              <p className="text-sm text-gray-600">&quot;Web work&quot;</p>
            </div>
          </div>
        </div>

        {/* Success Checklist */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Tips for Success</h3>
        <div className="space-y-2">
          {[
            "Send invoices promptly after completing work",
            "Use clear, professional descriptions",
            "Offer multiple payment options",
            "Follow up if payment is overdue",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-3">
              <TickCircle size={16} color="#14462a" variant="Bulk" />
              <span className="text-sm text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  "mobile-money": {
    title: "Mobile Money Payments",
    description: "Accept payments via MTN MoMo, Vodafone Cash, and AirtelTigo Money - the most popular payment methods in Ghana.",
    category: "Mobile Money",
    categoryColor: "#F59E0B",
    readTime: "5 min read",
    content: (
      <>
        {/* Provider Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { name: "MTN MoMo", color: "#FFCC00", bgColor: "#FFCC0015", users: "20M+ users" },
            { name: "Vodafone Cash", color: "#E60000", bgColor: "#E6000015", users: "8M+ users" },
            { name: "AirtelTigo", color: "#0066CC", bgColor: "#0066CC15", users: "5M+ users" },
          ].map((provider) => (
            <div key={provider.name} className="p-4 rounded-xl border border-gray-200 text-center">
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: provider.bgColor }}
              >
                <Mobile size={24} color={provider.color} variant="Bulk" />
              </div>
              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{provider.users}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Mobile Money?</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Mobile Money is the most popular payment method in Ghana, with over 30 million active users. 
          It&apos;s fast, secure, and accessible to everyone with a mobile phone.
        </p>

        {/* Benefits Grid */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {[
            { title: "Instant Payments", desc: "Funds arrive in seconds, not days", icon: Flash },
            { title: "Low Fees", desc: "Typically 1-2% transaction fee", icon: Wallet },
            { title: "Wide Reach", desc: "Available to 90% of Ghanaians", icon: UserAdd },
            { title: "Secure", desc: "PIN-protected transactions", icon: ShieldTick },
          ].map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <Icon size={20} color="#F59E0B" variant="Bulk" className="flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{benefit.title}</h4>
                  <p className="text-xs text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-amber-700">⚡ Pro tip:</strong> Mobile money is the fastest 
            payment method for clients in Ghana. Consider making it your primary option.
          </p>
        </div>
      </>
    ),
  },
  "mtn-setup": {
    title: "MTN Mobile Money Setup",
    description: "Step-by-step guide to accepting MTN MoMo payments on your invoices.",
    category: "Setup Guide",
    categoryColor: "#FFCC00",
    readTime: "3 min read",
    content: (
      <>
        {/* Requirements */}
        <div className="rounded-xl border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
          <div className="space-y-2">
            {[
              "Active MTN Mobile Money account",
              "Verified MTN number",
              "Business registration (for merchant accounts)",
            ].map((req) => (
              <div key={req} className="flex items-center gap-3">
                <TickCircle size={16} color="#14462a" variant="Bulk" />
                <span className="text-sm text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Steps</h3>
        <div className="space-y-4 mb-6">
          {[
            { step: 1, title: "Go to Settings", desc: "Navigate to Settings → Payments in your Plaen dashboard" },
            { step: 2, title: "Add Mobile Money", desc: "Click 'Add Mobile Money' and select MTN MoMo" },
            { step: 3, title: "Enter Your Number", desc: "Input your MTN number registered with Mobile Money" },
            { step: 4, title: "Verify with OTP", desc: "Enter the OTP sent to your phone to confirm ownership" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-[#FFCC00]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#B45309]">{item.step}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#FFCC00]/30 bg-[#FFCC00]/10 p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-[#B45309]">📱 Note:</strong> Make sure your MTN number is registered 
            for Mobile Money. You can dial *170# to check your account status.
          </p>
        </div>
      </>
    ),
  },
  "payment-setup": {
    title: "Understanding Payment Methods",
    description: "Learn about all the payment options available to help you get paid faster.",
    category: "Getting Started",
    categoryColor: "#14462a",
    readTime: "5 min read",
    content: (
      <>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Plaen supports multiple payment methods to help you get paid faster. Offering multiple 
          options increases the likelihood of receiving payment quickly.
        </p>

        {/* Payment Methods */}
        <div className="space-y-4 mb-6">
          {[
            { icon: Mobile, title: "Mobile Money", desc: "MTN MoMo, Vodafone Cash, AirtelTigo Money", color: "#F59E0B", popular: true },
            { icon: Bank, title: "Bank Transfer", desc: "Direct bank transfers in GHS and USD", color: "#14462a", popular: false },
            { icon: Card, title: "Card Payments", desc: "Visa, Mastercard via Paystack/Flutterwave", color: "#14462a", popular: false },
            { icon: Bitcoin, title: "Cryptocurrency", desc: "Bitcoin, USDT, USDC, Ethereum", color: "#F7931A", popular: false },
          ].map((method) => {
            const Icon = method.icon;
            return (
              <div key={method.title} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${method.color}15` }}
                >
                  <Icon size={24} color={method.color} variant="Bulk" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{method.title}</h4>
                    {method.popular && (
                      <Badge variant="warning">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-teal-700">💡 Recommendation:</strong> Enable at least 2-3 payment 
            methods to give your clients flexibility and increase your chances of getting paid faster.
          </p>
        </div>
      </>
    ),
  },
  "invoice-builder": {
    title: "How to Create an Invoice",
    description: "Master the invoice builder to create professional invoices in minutes.",
    category: "Invoices & Payments",
    categoryColor: "#14462a",
    readTime: "5 min read",
    content: (
      <>
        <p className="text-gray-600 mb-6 leading-relaxed">
          The invoice builder is designed to be intuitive and fast. Here&apos;s everything you 
          need to know to create professional invoices.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Components</h3>
        <div className="space-y-3 mb-6">
          {[
            { title: "Line Items", desc: "Add products/services with descriptions, quantities, and prices" },
            { title: "Taxes", desc: "Apply VAT (15%) or custom tax rates to line items" },
            { title: "Discounts", desc: "Add percentage or fixed amount discounts" },
            { title: "Notes", desc: "Include payment terms, thank you messages, or special instructions" },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-teal-50 border border-teal-100">
              <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h3>
        <div className="space-y-2">
          {[
            "Use clear, descriptive line item names",
            "Include your business logo for professionalism",
            "Set reasonable payment terms (Net 15 or Net 30)",
            "Always preview before sending",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-3">
              <TickCircle size={16} color="#14462a" variant="Bulk" />
              <span className="text-sm text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  "creating-account": {
    title: "Setting Up Your Account",
    description: "Quick guide to creating and configuring your Plaen account.",
    category: "Getting Started",
    categoryColor: "#14462a",
    readTime: "3 min read",
    content: (
      <>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Getting started with Plaen takes less than 5 minutes. Follow these simple steps 
          to set up your account and start invoicing.
        </p>

        <div className="space-y-4 mb-6">
          {[
            { step: 1, title: "Sign Up", desc: "Create your account with email or Google sign-in" },
            { step: 2, title: "Verify Email", desc: "Check your inbox and click the verification link" },
            { step: 3, title: "Complete Profile", desc: "Add your business name, logo, and contact details" },
            { step: 4, title: "Set Up Payments", desc: "Configure your preferred payment methods" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-xl border border-gray-200">
              <div className="h-10 w-10 rounded-full bg-[#14462a]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#14462a]">{item.step}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#14462a]/20 bg-[#14462a]/5 p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-[#14462a]">✨ Tip:</strong> Complete your profile fully to 
            unlock all features and make your invoices look more professional.
          </p>
        </div>
      </>
    ),
  },
};

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book1,
    color: "#14462a",
    articles: [
      { title: "Creating your first invoice", slug: "first-invoice", views: "2.4K" },
      { title: "Setting up your account", slug: "creating-account", views: "1.8K" },
      { title: "Understanding payment methods", slug: "payment-setup", views: "1.5K" },
      { title: "Mobile Money setup guide", slug: "mtn-setup", views: "3.2K" },
    ],
  },
  {
    title: "Invoices & Payments",
    icon: Receipt21,
    color: "#14462a",
    articles: [
      { title: "How to create an invoice", slug: "invoice-builder", views: "4.1K" },
      { title: "Setting payment terms", slug: "payment-terms-guide", views: "2.7K" },
      { title: "Understanding due dates", slug: "due-dates", views: "1.9K" },
      { title: "Working with drafts", slug: "drafts", views: "1.2K" },
    ],
  },
  {
    title: "Mobile Money",
    icon: Flash,
    color: "#F59E0B",
    articles: [
      { title: "Mobile Money payments", slug: "mobile-money", views: "5.3K" },
      { title: "Making Mobile Money faster", slug: "mobile-money-faster", views: "2.8K" },
      { title: "MTN Mobile Money setup", slug: "mtn-setup", views: "3.2K" },
      { title: "Crypto payments guide", slug: "crypto-payments", views: "1.6K" },
    ],
  },
  {
    title: "Account & Settings",
    icon: Setting2,
    color: "#14462a",
    articles: [
      { title: "Account types explained", slug: "account-types", views: "1.4K" },
      { title: "Dual currency invoicing", slug: "dual-currency", views: "2.1K" },
      { title: "Bank transfer setup", slug: "bank-transfers", views: "1.7K" },
    ],
  },
];

const popularArticles = [
  { title: "Creating your first invoice", slug: "first-invoice", views: "2.4K", category: "Getting Started" },
  { title: "Mobile Money payments", slug: "mobile-money", views: "5.3K", category: "Payments" },
  { title: "MTN Mobile Money setup", slug: "mtn-setup", views: "3.2K", category: "Setup" },
  { title: "How to create an invoice", slug: "invoice-builder", views: "4.1K", category: "Invoices" },
  { title: "Understanding payment methods", slug: "payment-setup", views: "2.7K", category: "Payments" },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const openArticle = (slug: string) => {
    if (articleContent[slug]) {
      setSelectedArticle(slug);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const currentArticle = selectedArticle ? articleContent[selectedArticle] : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header - Centered Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "#2D2D2D" }}>
          How can we help you?
        </h1>
        <p className="text-lg mb-8" style={{ color: "#B0B3B8" }}>
          Search our knowledge base or get in touch with our support team
        </p>

        {/* Search - Centered */}
        <div className="max-w-2xl mx-auto relative">
          <SearchNormal1
            size={20}
            color="#B0B3B8"
            className="absolute left-5 top-1/2 -translate-y-1/2"
          />
          <Input
            type="text"
            placeholder="Search for help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-14 rounded-full text-base shadow-lg border-0"
            style={{ backgroundColor: "white", color: "#2D2D2D" }}
          />
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Message,
            title: "Live Chat",
            description: "Chat with our support team",
            action: "Start Chat",
            color: "#14462a",
            available: true,
          },
          {
            icon: Sms,
            title: "Email Support",
            description: "support@plaen.tech",
            action: "Send Email",
            color: "#14462a",
            available: true,
          },
          {
            icon: Call,
            title: "Phone Support",
            description: "Mon-Fri, 9am-5pm GMT",
            action: "Call Us",
            color: "#14462a",
            available: false,
          },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.title}
              className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}10` }}
                >
                  <Icon size={24} color={option.color} variant="Bulk" />
                </div>
                {option.available && (
                  <Badge variant="partial">
                    <div className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ backgroundColor: "#14462a" }} />
                    Available
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "#2D2D2D" }}>
                {option.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#B0B3B8" }}>
                {option.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full h-10"
                disabled={!option.available}
              >
                {option.action}
                <ExportSquare size={14} color="currentColor" className="ml-2" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(245, 158, 11, 0.12)" }}
          >
            <MessageQuestion size={20} color="#F59E0B" variant="Bulk" />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: "#2D2D2D" }}>
            Popular Articles
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {popularArticles.map((article, index) => (
            <div key={article.slug}>
              <button
                onClick={() => openArticle(article.slug)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(20, 70, 42, 0.08)" }}
                  >
                    <Book1 size={20} color="#14462a" variant="Bulk" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-medium mb-1 group-hover:text-[#14462a] transition-colors"
                      style={{ color: "#2D2D2D" }}
                    >
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "#B0B3B8" }}>
                      <span>{article.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} color="#B0B3B8" />
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ArrowRight2
                  size={20}
                  color="#B0B3B8"
                  className="group-hover:translate-x-1 group-hover:text-[#14462a] transition-all"
                />
              </button>
              {index < popularArticles.length - 1 && (
                <div className="h-px mx-5 bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#2D2D2D" }}>
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}12` }}
                  >
                    <Icon size={20} color={category.color} variant="Bulk" />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: "#2D2D2D" }}>
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {category.articles.map((article) => (
                    <button
                      key={article.slug}
                      onClick={() => openArticle(article.slug)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                    >
                      <span
                        className="text-sm group-hover:text-[#14462a] transition-colors"
                        style={{ color: "#2D2D2D" }}
                      >
                        {article.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#B0B3B8" }}>
                          {article.views}
                        </span>
                        <ArrowRight2
                          size={14}
                          color="#14462a"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="rounded-3xl p-10 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(20, 70, 42, 0.06) 0%, rgba(20, 70, 42, 0.02) 100%)",
          border: "1px solid rgba(20, 70, 42, 0.15)",
        }}
      >
        <h3 className="text-2xl font-semibold mb-3" style={{ color: "#2D2D2D" }}>
          Still need help?
        </h3>
        <p className="text-base mb-6" style={{ color: "#65676B" }}>
          Our support team is here to help you with any questions or issues
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="rounded-full h-12 px-8 shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: "#14462a", color: "white" }}
          >
            <Message size={18} color="white" className="mr-2" />
            Contact Support
          </Button>
          <Button
            variant="outline"
            className="rounded-full h-12 px-8"
            style={{ borderColor: "#14462a", color: "#14462a" }}
          >
            <Book1 size={18} color="#14462a" className="mr-2" />
            View All Guides
          </Button>
        </div>
      </div>

      {/* Article Modal - Beautiful styled like marketing pages */}
      {selectedArticle && currentArticle && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={closeArticle}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Styled like marketing article */}
            <div 
              className="p-8 pb-6"
              style={{ 
                background: `linear-gradient(135deg, ${currentArticle.categoryColor}08 0%, ${currentArticle.categoryColor}02 100%)`,
                borderBottom: `1px solid ${currentArticle.categoryColor}15`
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={closeArticle}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft2 size={16} color="currentColor" />
                  Back to Help
                </button>
                <button
                  onClick={closeArticle}
                  className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  <CloseCircle size={22} color="#65676B" />
                </button>
              </div>
              
              <Badge 
                className="mb-4"
                style={{ 
                  backgroundColor: `${currentArticle.categoryColor}15`,
                  color: currentArticle.categoryColor,
                  border: "none"
                }}
              >
                {currentArticle.category}
              </Badge>
              
              <h2 className="text-2xl font-bold mb-3" style={{ color: "#14462a" }}>
                {currentArticle.title}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {currentArticle.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} color="#9CA3AF" variant="Bulk" />
                {currentArticle.readTime}
              </div>
            </div>

            {/* Modal Content - Rich styled content */}
            <div className="flex-1 overflow-y-auto p-8">
              {currentArticle.content}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Was this article helpful?
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full px-4 hover:bg-[#14462a]/5 hover:border-[#14462a]/30">
                    <TickCircle size={16} color="#14462a" variant="Bulk" className="mr-1.5" />
                    Yes, helpful
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-4 hover:bg-red-50 hover:border-red-200">
                    <CloseCircle size={16} color="#DC2626" variant="Bulk" className="mr-1.5" />
                    Not really
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
