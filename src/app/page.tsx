import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { 
  Activity, 
  DocumentText1, 
  Global, 
  Lock1, 
  ShieldTick, 
  Mobile, 
  Timer1, 
  TickCircle, 
  ReceiptText,
  Magicpen
} from "iconsax-react";
import { IconFrame } from "@/components/ui/icon-frame";
import { Pillars } from "@/components/marketing/pillars";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { HomePageEffects } from "@/components/marketing/home-page-effects";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

// Accent color palette for icons
const accentColors = {
  emerald: "#059669",   // Fresh green - invoicing/success
  indigo: "#4F46E5",    // Deep purple - contacts/people  
  amber: "#D97706",     // Warm amber - payments/money
  rose: "#E11D48",      // Vibrant rose - receipts/docs
  sky: "#0284C7",       // Bright sky - reminders/notifications
  violet: "#7C3AED",    // Rich violet - analytics
  teal: "#0D9488",      // Teal - security/trust
  orange: "#EA580C",    // Orange - speed/time
};

const modules = [
  {
    title: "Personal or Business",
    copy: "Choose your setup. Freelancers add their name and payout method. Companies add branding, logo, and tax details. Your information automatically populates future invoices.",
    badge: "Tailored onboarding",
    color: accentColors.indigo,
  },
  {
    title: "Invoice Builder",
    copy: "A quiet, black-and-white interface. Add items, quantities, and rates. See totals update in real time. Preview a clean, ready-to-share document in one click.",
    badge: "The heart of Plaen",
    color: accentColors.emerald,
  },
  {
    title: "Send & Get Paid",
  copy: "Share via link, email, or WhatsApp. Recipients don't need an account. They open a secure link, review, and pay through mobile money, bank, or crypto.",
    badge: "Smooth & transparent",
    color: accentColors.amber,
  },
];

const stats = [
  {
    label: "Currencies supported",
    value: "5",
    detail: "GHS, NGN, KES, ZAR, USD",
    icon: Global,
    accent: "bg-gradient-to-r from-gray-900 to-gray-700",
  },
  {
    label: "Invoice completion",
    value: "< 3 min",
    detail: "Average setup time",
    icon: Timer1,
    accent: "bg-gradient-to-r from-gray-900/90 to-gray-600",
  },
];

const steps = [
  {
    title: "Capture context",
    description:
      "Import a client or create inline. Choose personal or business sender details. Plaen keeps both on hand.",
    color: accentColors.indigo,
  },
  {
    title: "Compose & preview",
    description:
      "Add line items, taxes, and notes. Toggle dual currency, attach documentation, and preview the public invoice instantly.",
    color: accentColors.emerald,
  },
  {
    title: "Share & track",
    description:
      "Send a focused payment page. Track opens, enable automatic reminders, and generate receipts the moment funds land.",
    color: accentColors.amber,
  },
];

const trustedBrands = [
  "SikaWorks",
  "Acme Collective",
  "Hyperlane",
  "Orbit Labs",
  "Studio Kree8",
  "Horizon VC",
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Page SEO */}
      {/* Next.js App Router will use layout metadata; keeping page content narrative-aligned */}
      <HomePageEffects />
      <MarketingHeader />
  <div className="relative min-h-screen bg-white text-black overflow-x-hidden">
  {/* Ambient gradients (clip overflow to avoid extra page height) */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-10%] top-1/4 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 22s ease-in-out infinite", animationDelay: "-6s" }}
          />
          <div
            className="absolute left-[-12%] bottom-[-10%] h-[300px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 26s ease-in-out infinite", animationDelay: "-12s" }}
          />
        </div>

      <main>
        {/* Hero */}
        <section
          data-animate="fade-up"
          className="relative mx-auto flex max-w-6xl flex-col gap-14 px-4 sm:px-6 pb-24 pt-20 lg:flex-row lg:items-center"
        >
          <div className="max-w-xl space-y-8">
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gray-500">
              <Magicpen size={14} className="mr-1" /> Structured invoicing + AR
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl lg:text-6xl">
              Calm finance surface for invoices, AR, and payment notes.
            </h1>
            <p className="text-lg leading-7 text-gray-600 sm:text-xl">
              Compose dual-currency invoices, share protected payment pages, and keep verified receipts in one workspace.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/signup">
                <SmartButton size="lg" className="group px-8">
                  Create free account
                </SmartButton>
              </Link>
              <Link href="/contact">
                <SmartButton size="lg" variant="outline" className="border-gray-200 px-8 text-black transition hover:border-black hover:bg-gray-50">
                  Talk to Plaen
                </SmartButton>
              </Link>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <TickCircle size={16} color={accentColors.emerald} variant="Bold" /> Mobile money, bank transfer, USD, and crypto from one link
              </p>
              <p className="flex items-center gap-2">
                <Lock1 size={16} className="text-gray-400" /> Tamper-evident receipts with Finance Notes & Docs
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 sm:gap-6" data-animate="fade-up">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/85 p-6 shadow-[0_30px_90px_rgba(15,15,15,0.12)] transition-all hover:-translate-y-2 hover:border-black/80"
                    style={{ animation: `cardRise 0.9s ease ${index * 0.08}s both` }}
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className={`absolute -right-16 top-8 h-36 w-36 rounded-full blur-3xl ${stat.accent}`} />
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] leading-4 uppercase tracking-[0.3em] text-gray-500">{stat.label}</p>
                      <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Icon size={18} className="text-gray-600" />
                      </div>
                    </div>
                    <p className="mt-6 text-3xl font-semibold text-black">{stat.value}</p>
                    <p className="mt-2 text-xs text-gray-500">{stat.detail}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gray-600">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      Continuously monitored
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative hidden flex-1 justify-center lg:flex" data-animate="fade-up">
            <DashboardPreview />
          </div>
        </section>

        {/* Marquee */}
  <section className="border-y border-gray-200 bg-white/70 py-6" data-animate="fade-up">
          <div className="relative mx-auto max-w-6xl overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white/70 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white/70 to-transparent" />
            <div className="flex gap-10 whitespace-nowrap text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-gray-500" style={{ animation: "marquee 10s linear infinite" }}>
              {trustedBrands.concat(trustedBrands).map((brand, index) => (
                <span key={`${brand}-${index}`} className="inline-flex items-center gap-3">
                  {brand}
                  <span className="block h-1 w-1 rounded-full bg-gray-400" />
                </span>
              ))}
            </div>
          </div>
        </section>

  {/* Product Narrative Pillars */}
  <Pillars heading="Five product pillars" />

        {/* Feature Highlights (legacy feature framing kept, now follows narrative) */}
        <section id="product" className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-20" data-animate="fade-up">
          <div className="mx-auto max-w-5xl space-y-12 px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">Structure with human context</h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600">
                Each invoice couples financial clarity with meaning (why, for whom, and under what terms) so payments become durable records.
              </p>
            </div>

            {/* Asymmetric Grid Layout */}
            <div className="grid gap-6">
              {/* Row 1: 60/40 split */}
              <div className="grid gap-6 lg:grid-cols-10">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-6">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.teal}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.teal}12`, border: `1px solid ${accentColors.teal}25` }}
                    >
                      <ShieldTick size={24} color={accentColors.teal} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Built-in Professionalism</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Operate with global-grade clarity even without a registered entity. Plaen gives you legitimacy through format, flow, and consistency.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <TickCircle size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-32 rounded bg-gray-200" />
                        <div className="mt-2 h-2 w-24 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-4">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.emerald}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.emerald}12`, border: `1px solid ${accentColors.emerald}25` }}
                    >
                      <DocumentText1 size={24} color={accentColors.emerald} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Calm Invoice Builder</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      A monochrome surface engineered for focus. Totals, taxes, context notes update instantly without visual noise.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 space-y-2">
                      <div className="h-2 w-full rounded bg-gray-200" />
                      <div className="h-2 w-3/4 rounded bg-gray-100" />
                      <div className="h-2 w-5/6 rounded bg-gray-200" />
                    </div>
                  </div>
                </article>
              </div>

              {/* Row 2: 40/60 split */}
              <div className="grid gap-6 lg:grid-cols-10">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-4">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.amber}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.amber}12`, border: `1px solid ${accentColors.amber}25` }}
                    >
                      <Mobile size={24} color={accentColors.amber} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Frictionless Payment Access</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Recipients open a secure link, review structured context, and complete payment with no account barrier and no confusion.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock1 size={16} />
                        <span>Secure link</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-6">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.violet}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.violet}12`, border: `1px solid ${accentColors.violet}25` }}
                    >
                      <Activity size={24} color={accentColors.violet} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Live Composition Feedback</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Totals, previews, and context sync as you type, reducing errors and reinforcing trust before sending.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-full rounded bg-gray-200" />
                        <div className="h-2 w-2/3 rounded bg-gray-100" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-lg font-semibold text-black">$2,450</div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Row 3: 50/50 split */}
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)]">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.rose}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.rose}12`, border: `1px solid ${accentColors.rose}25` }}
                    >
                      <ReceiptText size={24} color={accentColors.rose} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Finance Notes & Receipts</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Each payment triggers a verifiable receipt and keeps contextual notes attached, building a searchable narrative over time.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <div className="h-2 flex-1 rounded bg-gray-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)]">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full blur-2xl" style={{ backgroundColor: `${accentColors.sky}20` }} />
                  </div>
                  <div className="relative space-y-4">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${accentColors.sky}12`, border: `1px solid ${accentColors.sky}25` }}
                    >
                      <Global size={24} color={accentColors.sky} variant="Bulk" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Device-Agnostic Workspace</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Access structured financial context on mobile, desktop, or tablet without losing fidelity.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                      <Mobile size={24} className="text-gray-400" />
                      <div className="h-6 w-6 rounded border-2 border-gray-400" />
                      <Global size={24} className="text-gray-400" />
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="border-t border-gray-100 bg-gray-50 py-24" data-animate="fade-up">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
            <div className="max-w-sm space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight text-[#14462a]">Calm surface. Durable records.</h2>
              <p className="text-base leading-7 text-gray-600">
                A monochrome, low noise interface guides you from context capture to receipt: fast, deliberate, human. No clutter; just official output ready to share or search.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <TickCircle size={16} color={accentColors.emerald} variant="Bold" /> Tailored setup for individuals and businesses
                </span>
                <span className="flex items-center gap-2">
                  <TickCircle size={16} color={accentColors.emerald} variant="Bold" /> Clean interface with real-time updates
                </span>
                <span className="flex items-center gap-2">
                  <TickCircle size={16} color={accentColors.emerald} variant="Bold" /> Secure payment links, no account needed
                </span>
              </div>
            </div>

            <div className="grid flex-1 gap-6 sm:grid-cols-2">
              {modules.map((module) => (
                <div
                  key={module.title}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition-transform hover:-translate-y-2"
                >
                  <span 
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] font-medium"
                    style={{
                      backgroundColor: `${module.color}10`,
                      borderColor: `${module.color}30`,
                      color: module.color,
                    }}
                  >
                    {module.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-black">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{module.copy}</p>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-gray-800 transition group-hover:text-black">
                    Explore module
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="border-t border-gray-100 bg-white py-24" id="docs" data-animate="fade-up">
          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-start">
            <div className="max-w-md space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                Flow intelligence
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Draft → Context → Receipt in seconds.
              </h2>
              <p className="text-base leading-7 text-gray-600">
                Capture purpose and items, compose with live feedback, share frictionless links or document only records, and accumulate Finance Notes & Docs: your finance memory.
              </p>
            </div>

            <div className="relative flex-1">
              <div className="absolute left-[1.25rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[#14462a]/30 lg:block" />
              <ol className="space-y-6">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,15,15,0.08)] transition-all hover:-translate-y-1.5 hover:border-gray-300"
                    data-animate="fade-up"
                    style={{ animation: `timelineFade 0.8s ease ${index * 0.12}s both` }}
                  >
                    <div 
                      className="absolute -left-[3.1rem] top-6 hidden h-3 w-3 rounded-full border-4 border-white lg:block" 
                      style={{ backgroundColor: step.color }}
                    />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-center gap-3">
                        <span 
                          className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold"
                          style={{
                            backgroundColor: `${step.color}15`,
                            borderColor: `${step.color}30`,
                            color: step.color,
                          }}
                        >
                          {`0${index + 1}`}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-black">{step.title}</h3>
                          <p 
                            className="mt-1 text-xs uppercase tracking-[0.3em] font-medium"
                            style={{ color: step.color }}
                          >
                            {index === 0 ? "Context" : index === 1 ? "Composition" : "Payment"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <span 
                          className="inline-flex h-2 w-2 rounded-full" 
                          style={{ backgroundColor: step.color }}
                        />
                        {index === 0 ? "Personal & business profiles" : index === 1 ? "Templates & dual currency" : "Reminders & receipts"}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600 lg:ml-13">{step.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-500">
                      {index === 0 && (
                        <>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Clients import
                          </span>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Sender presets
                          </span>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Preview sync
                          </span>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Documentation
                          </span>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Shareable link
                          </span>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Auto reminders
                          </span>
                          <span 
                            className="rounded-full border px-3 py-1 font-medium"
                            style={{
                              backgroundColor: `${step.color}08`,
                              borderColor: `${step.color}20`,
                              color: step.color,
                            }}
                          >
                            Receipt ledger
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

  {/* CTA */}
  <section id="pricing" className="relative overflow-hidden border-t border-blue-600/20 bg-[#14462a] py-24 text-white" data-animate="fade-up">
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            
            {/* Radial Gradients */}
            <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />
            
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:32px_32px]" />
          </div>

          <div className="relative mx-auto max-w-4xl space-y-10 px-6 text-center">
            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              Make it official
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Money + Meaning starts here.
            </h2>
            <p className="mx-auto max-w-2xl text-base text-white/70">
              Send, request, or document a transfer in seconds. Get a hosted receipt page and PDF with a tamper evident snapshot. Share links; recipients don’t need an account.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <SmartButton size="lg" className="group bg-white px-8 text-black transition hover:bg-gray-100">
                  Make this transfer official
                </SmartButton>
              </Link>
              <Link href="/how-it-works">
                <SmartButton size="lg" variant="outline" className="border-white bg-transparent px-8 text-white transition hover:bg-white/10 hover:border-white">
                  See how it works
                </SmartButton>
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
