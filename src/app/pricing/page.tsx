import { SmartButton } from "@/components/ui/smart-button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { BadgeCheck, CreditCard, RefreshCcw, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { IconFrame } from "@/components/ui/icon-frame";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Create and send unlimited official invoices. Pay only when you get paid.",
    features: [
      "Unlimited invoices",
      "All payment methods",
      "Tamper‑evident receipts",
      "Finance Notes & Docs",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "Coming Soon",
    cadence: "",
    description: "Advanced features for growing businesses.",
    features: [
      "Custom branding & themes",
      "Analytics and reports",
      "Multiple workspaces",
      "Priority support",
    ],
    highlighted: false,
  },
  {
    name: "Teams",
    price: "Future",
    cadence: "",
    description: "Collaboration features for teams.",
    features: [
      "Shared client library",
      "Role permissions",
      "Centralized billing",
      "Team analytics",
    ],
    highlighted: false,
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
      "We're shipping Pro (analytics, custom branding, advanced Finance Notes) and Teams (shared client library, roles & permissions, workspace insights) in staged releases. We prioritise what active users request most. Join the waitlist to influence order and get early access invites.",
  },
];

export default function PricingPage() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Page-level SEO could override title/description if needed; defaults already narrative-aligned */}
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-10%] top-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 24s ease-in-out infinite", animationDelay: "-8s" }}
          />
        </div>

      <main>
        <section
          data-animate="fade-up"
          className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pb-24 pt-20 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
            Pricing
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Built-in professionalism starts free.
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-gray-600">
            Create and send unlimited invoices with human context. Pay only transaction fees when you get paid. Fair, transparent, and ready for growth.
          </p>
        </section>

        <section className="border-t border-gray-200 bg-white/80 py-20" data-animate="fade-up">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`relative rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition hover:-translate-y-2 hover:border-black/80 ${
                  tier.highlighted ? "border-black" : ""
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-black bg-black px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white">
                    Recommended
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">{tier.name}</h3>
                  <IconFrame icon={BadgeCheck} size="sm" variant={tier.highlighted ? "solid" : "subtle"} />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1 text-3xl font-semibold text-black">
                  {tier.price}
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">{tier.cadence}</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <IconFrame icon={Shield} size="sm" variant="plain" tone="muted" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/coming-soon" className="block mt-8">
                  <SmartButton
                    size="lg"
                    className="w-full bg-black text-white hover:bg-gray-900"
                  >
                    Coming soon
                  </SmartButton>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50 py-24" data-animate="fade-up">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-start">
            <div className="max-w-md space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                Value breakdown
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Money + Meaning at every tier.
              </h2>
              <p className="text-sm leading-6 text-gray-600">
                Free keeps you official from day one. Future plans add collaboration and analytics without changing Plaen’s calm, monochrome surface.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <IconFrame icon={CreditCard} size="sm" variant="plain" tone="muted" /> Local payments routed via trusted providers
                </li>
                <li className="flex items-center gap-2">
                  <IconFrame icon={TrendingUp} size="sm" variant="plain" tone="muted" /> Analytics that surface payment health trends
                </li>
                <li className="flex items-center gap-2">
                  <IconFrame icon={RefreshCcw} size="sm" variant="plain" tone="muted" /> Smooth upgrades with zero downtime for payers
                </li>
              </ul>
            </div>

            <div className="flex-1 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
              <h3 className="text-base font-semibold text-black">FAQs</h3>
              <div className="mt-6 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-black">{faq.question}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}
