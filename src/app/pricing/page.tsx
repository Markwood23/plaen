"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { 
  TickCircle, 
  Card, 
  RefreshCircle, 
  ShieldTick, 
  TrendUp,
  DocumentText1,
  Mobile,
  Building,
  Bitcoin,
  Clock,
  User,
  Crown,
  People,
  Add,
  Minus,
  ArrowRight2,
  ReceiptText,
  Global,
  Notification,
} from "iconsax-react";

// Preview components for pricing tiers
function FreePreview() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg bg-[#14462a]/10 px-3 py-2">
        <DocumentText1 size={16} color="#14462a" variant="Bulk" />
        <span className="text-xs font-medium text-[#14462a]">Unlimited invoices</span>
      </div>
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-lg bg-amber-50 p-2 text-center">
          <Mobile size={14} color="#D97706" className="mx-auto mb-1" />
          <span className="text-[8px] text-amber-700">MoMo</span>
        </div>
        <div className="flex-1 rounded-lg bg-[#14462a]/10 p-2 text-center">
          <Building size={14} color="#14462a" className="mx-auto mb-1" />
          <span className="text-[8px] text-[#14462a]">Bank</span>
        </div>
        <div className="flex-1 rounded-lg bg-orange-50 p-2 text-center">
          <Bitcoin size={14} color="#EA580C" className="mx-auto mb-1" />
          <span className="text-[8px] text-orange-700">Crypto</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-[#14462a]/10 px-3 py-2">
        <ReceiptText size={16} color="#14462a" variant="Bulk" />
        <span className="text-xs font-medium text-[#14462a]">Auto receipts</span>
      </div>
    </div>
  );
}

function ProPreview() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg bg-[#14462a]/10 px-3 py-2">
        <Crown size={16} color="#14462a" variant="Bulk" />
        <span className="text-xs font-medium text-[#14462a]">Custom branding</span>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-gray-500">Revenue this month</span>
          <TrendUp size={12} color="#0D9488" />
        </div>
        <div className="h-8 flex items-end gap-0.5">
          {[30, 45, 35, 55, 40, 60, 50].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 rounded-t bg-gradient-to-t from-[#14462a] to-[#14462a]/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2">
        <Global size={16} color="#0D9488" variant="Bulk" />
        <span className="text-xs font-medium text-teal-700">Multiple workspaces</span>
      </div>
    </div>
  );
}

function TeamsPreview() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg bg-[#14462a]/10 px-3 py-2">
        <People size={16} color="#14462a" variant="Bulk" />
        <span className="text-xs font-medium text-[#14462a]">Team collaboration</span>
      </div>
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold"
            style={{ 
              backgroundColor: ['#14462a', '#0D9488', '#14462a', '#0D9488'][i-1] + '20',
              color: ['#14462a', '#0D9488', '#14462a', '#0D9488'][i-1]
            }}
          >
            {['KA', 'AO', 'DM', 'SA'][i-1]}
          </div>
        ))}
        <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
          +5
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2">
        <ShieldTick size={16} color="#0D9488" variant="Bulk" />
        <span className="text-xs font-medium text-teal-700">Role permissions</span>
      </div>
    </div>
  );
}

const pricingTiers = [
  {
    name: "Free",
    price: "₵0",
    cadence: "forever",
    description: "Create and send unlimited invoices. Pay only when you get paid.",
    features: [
      "Unlimited invoices",
      "All payment methods",
      "Automatic receipts",
      "Documentation timeline",
      "Finance notes",
    ],
    highlighted: true,
    href: "/signup",
    buttonLabel: "Get started free",
    color: "#0D9488",
    preview: FreePreview,
  },
  {
    name: "Pro",
    price: "₵19",
    cadence: "/month",
    description: "Advanced features for growing businesses and power users.",
    features: [
      "Everything in Free",
      "Custom branding & themes",
      "Analytics and reports",
      "Multiple workspaces",
      "Priority support",
    ],
    highlighted: false,
    href: "/coming-soon",
    buttonLabel: "Join waitlist",
    badge: "Coming Soon",
    color: "#7C3AED",
    preview: ProPreview,
  },
  {
    name: "Teams",
    price: "₵49",
    cadence: "/month",
    description: "Collaboration features for teams that invoice together.",
    features: [
      "Everything in Pro",
      "Shared client library",
      "Role permissions",
      "Centralized billing",
      "Team analytics",
    ],
    highlighted: false,
    href: "/contact",
    buttonLabel: "Talk to Plaen",
    badge: "Future",
    color: "#D97706",
    preview: TeamsPreview,
  },
];

const faqs = [
  {
    question: "Is Plaen really free?",
    answer:
      "Yes. You can create and send unlimited invoices for free. Transaction fees apply only when you receive payments, varying by payment method and region.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "Mobile Money (MTN, AirtelTigo, M-Pesa), Bank Transfer, Card, and Crypto. Your clients choose how they want to pay.",
  },
  {
    question: "Do I need a business to use Plaen?",
    answer:
      "No. Plaen works for individuals, freelancers, and businesses. Choose Personal or Business setup based on your needs.",
  },
  {
    question: "When are Pro and Teams features available?",
    answer:
      "We're building these features based on user feedback. Join the waitlist to be notified when they launch.",
  },
];

const transactionFees = [
  { method: "Mobile Money", fee: "1.5%", icon: Mobile, color: "#D97706" },
  { method: "Bank Transfer", fee: "1.0%", icon: Building, color: "#0D9488" },
  { method: "Card", fee: "2.9%", icon: Card, color: "#0284C7" },
  { method: "Crypto", fee: "0.5%", icon: Bitcoin, color: "#EA580C" },
];

export default function PricingPage() {
  const year = new Date().getFullYear();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <MarketingHeader />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.14),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
        </div>

        <main>
          {/* Hero */}
          <section
            data-animate="fade-up"
            className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pb-16 pt-32 text-center"
          >
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              Pricing
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
              Structure should be free to start.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              Plaen is free for all users to create and send invoices. You only pay transaction fees when you get paid—fair and transparent.
            </p>
          </section>

          {/* Pricing Cards */}
          <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-8 lg:grid-cols-3">
                {pricingTiers.map((tier) => {
                  const Preview = tier.preview;
                  return (
                    <article
                      key={tier.name}
                      className={`group relative flex flex-col rounded-3xl border bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_32px_100px_rgba(0,0,0,0.12)] ${
                        tier.highlighted 
                          ? "border-[#14462a] ring-2 ring-[#14462a]/10" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {tier.highlighted && (
                        <span className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#14462a] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white">
                          <TickCircle size={14} color="#fff" variant="Bold" />
                          Recommended
                        </span>
                      )}
                      {tier.badge && !tier.highlighted && (
                        <span 
                          className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]"
                          style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                        >
                          {tier.badge}
                        </span>
                      )}
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-black">{tier.name}</h3>
                          <div 
                            className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${tier.color}15` }}
                          >
                            {tier.name === "Free" && <User size={20} color={tier.color} variant="Bulk" />}
                            {tier.name === "Pro" && <Crown size={20} color={tier.color} variant="Bulk" />}
                            {tier.name === "Teams" && <People size={20} color={tier.color} variant="Bulk" />}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
                      </div>

                      <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-black">{tier.price}</span>
                        <span className="text-sm text-gray-500">{tier.cadence}</span>
                      </div>

                      {/* Preview */}
                      <div 
                        className="mb-6 rounded-2xl p-4"
                        style={{ backgroundColor: `${tier.color}08` }}
                      >
                        <Preview />
                      </div>

                      <ul className="mb-8 flex-1 space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                            <TickCircle size={18} color={tier.color} variant="Bold" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link href={tier.href} className="mt-auto">
                        <Button
                          size="lg"
                          className={`w-full transition-all ${
                            tier.highlighted 
                              ? "bg-[#14462a] text-white hover:bg-[#0d3420]" 
                              : "border border-gray-200 bg-white text-black hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {tier.buttonLabel}
                          <ArrowRight2 size={16} color={tier.highlighted ? "#fff" : "#000"} className="ml-2" />
                        </Button>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Transaction Fees */}
          <section className="border-t border-gray-100 bg-white py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  Transaction Fees
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Pay only when you get paid.
                </h2>
                <p className="mx-auto max-w-2xl text-base text-gray-600">
                  Simple, transparent fees based on payment method. No hidden costs or monthly minimums.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {transactionFees.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.method}
                      className="text-center"
                    >
                      <div 
                        className="mx-auto mb-4 h-12 w-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon size={24} color={item.color} variant="Bulk" />
                      </div>
                      <h3 className="font-medium text-gray-900">{item.method}</h3>
                      <p 
                        className="mt-1 text-2xl font-bold"
                        style={{ color: item.color }}
                      >
                        {item.fee}
                      </p>
                      <p className="text-xs text-gray-500">per transaction</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="border-t border-gray-100 bg-gray-50 py-20" data-animate="fade-up">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-start">
              <div className="max-w-md space-y-6">
                <Badge variant="outline" className="rounded-full border-gray-200 bg-white px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  FAQs
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Questions? We've got answers.
                </h2>
                <p className="text-base leading-7 text-gray-600">
                  Everything you need to know about Plaen pricing and features. Can't find what you're looking for?
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="border-gray-200 hover:border-gray-400">
                    Contact support
                    <ArrowRight2 size={16} color="#000" className="ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex-1 space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={faq.question}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-black">{faq.question}</span>
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: openFaq === index ? '#14462a' : '#f3f4f6' }}
                      >
                        {openFaq === index ? (
                          <Minus size={16} color="#fff" />
                        ) : (
                          <Add size={16} color="#6B7280" />
                        )}
                      </div>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === index ? 'max-h-40 pb-5' : 'max-h-0'
                      }`}
                    >
                      <p className="px-5 text-sm leading-6 text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 py-24" data-animate="fade-up">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Ready to start invoicing professionally?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
                Join thousands of freelancers and businesses who trust Plaen for their invoicing needs. Free to start, fair when you succeed.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#14462a] px-8 text-white hover:bg-[#0d3420]">
                    Get started free
                    <ArrowRight2 size={16} color="#fff" className="ml-2" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-gray-200 px-8 hover:border-gray-400">
                    See how it works
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}
