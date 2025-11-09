import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SmartButton } from "@/components/ui/smart-button";
import { Activity, ArrowRight, CheckCircle2, FileText, Globe2, Lock, Shield, Smartphone, Sparkles, TimerReset, TrendingUp } from "lucide-react";
import { IconFrame } from "@/components/ui/icon-frame";
import { Pillars } from "@/components/marketing/pillars";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { HomePageEffects } from "@/components/marketing/home-page-effects";

const modules = [
  {
    title: "Personal or Business",
    copy: "Choose your setup. Freelancers add their name and payout method. Companies add branding, logo, and tax details. Your information automatically populates future invoices.",
    badge: "Tailored onboarding",
  },
  {
    title: "Invoice Builder",
    copy: "A quiet, black-and-white interface. Add items, quantities, and rates. See totals update in real time. Preview a clean, ready-to-share document in one click.",
    badge: "The heart of Plaen",
  },
  {
    title: "Send & Get Paid",
    copy: "Share via link, email, or WhatsApp. Recipients don't need an account—they open a secure link, review, and pay through mobile money, bank, or crypto.",
    badge: "Smooth & transparent",
  },
];

const stats = [
  {
    label: "Currencies supported",
    value: "5",
    detail: "GHS, NGN, KES, ZAR, USD",
    icon: Globe2,
    accent: "bg-gradient-to-r from-gray-900 to-gray-700",
  },
  {
    label: "Invoice completion",
    value: "< 3 min",
    detail: "Average setup time",
    icon: TimerReset,
    accent: "bg-gradient-to-r from-gray-900/90 to-gray-600",
  },
  {
    label: "Platform uptime",
    value: "99.95%",
    detail: "Mocked reliability",
    icon: Activity,
    accent: "bg-gradient-to-r from-gray-900 to-gray-500",
  },
];

const steps = [
  {
    title: "Capture context",
    description:
      "Import a client or create inline. Choose personal or business sender details—Plaen keeps both on hand.",
  },
  {
    title: "Compose & preview",
    description:
      "Add line items, taxes, and notes. Toggle dual currency, attach documentation, and preview the public invoice instantly.",
  },
  {
    title: "Share & track",
    description:
      "Send a focused payment page. Track opens, enable automatic reminders, and generate receipts the moment funds land.",
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
      <div className="relative min-h-screen bg-white text-black">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10">
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
          className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-24 pt-20 lg:flex-row lg:items-center"
        >
          <div className="max-w-xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.3em] text-gray-500">
              <IconFrame icon={Sparkles} size="sm" variant="plain" /> Money + Meaning
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
              Process money with context.
            </h1>
            <p className="text-lg leading-7 text-gray-600 sm:text-xl">
              Every send or receive becomes a clean, verifiable record—who, what, why—shareable as a focused link or PDF. Structure arrives first; Finance Notes & Docs build the narrative over time.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/contact">
                <SmartButton size="lg" className="group px-8">
                  Talk to our team
                </SmartButton>
              </Link>
              <Link href="/how-it-works">
                <SmartButton size="lg" variant="outline" className="border-gray-200 px-8 text-black transition hover:border-black hover:bg-gray-50">
                  See demo
                </SmartButton>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3" data-animate="fade-up">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/85 p-5 shadow-[0_30px_90px_rgba(15,15,15,0.12)] transition-all hover:-translate-y-2 hover:border-black/80"
                    style={{ animation: `cardRise 0.9s ease ${index * 0.08}s both` }}
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className={`absolute -right-16 top-8 h-36 w-36 rounded-full blur-3xl ${stat.accent}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{stat.label}</p>
                      <IconFrame icon={Icon} size="md" variant="subtle" />
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
            <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_30px_120px_rgba(15,15,15,0.12)]">
              <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-black">Invoice preview</span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="h-4 w-4" /> Protected link
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount due</p>
                    <p className="text-2xl font-semibold text-black">GHS 8,437.50</p>
                  </div>
                  <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">Due in 6 days</span>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-medium text-black">Payment options</p>
                  <div className="mt-3 grid gap-3">
                    {["Mobile money", "Bank transfer", "Card / Crypto"].map((method) => (
                      <div
                        key={method}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-600 transition hover:border-gray-300"
                      >
                        {method}
                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-medium text-black">Activity</p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>Invoice viewed • 2 minutes ago</li>
                    <li>Reminder scheduled • Due date +3</li>
                    <li>Receipt queued on payment</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <span className="flex items-center gap-2 text-gray-500">
                  <TrendingUp className="h-4 w-4" /> Instant reconciliation
                </span>
                <Button size="sm" className="bg-black text-white hover:bg-gray-900">
                  Send invoice
                </Button>
              </div>
            </div>

            <div className="absolute -right-8 -top-10 hidden w-56 rotate-3 rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-xl lg:block">
              <p className="text-xs uppercase tracking-wide text-gray-500">Reminder cadence</p>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p className="flex items-center justify-between">
                  3 days before <span className="text-gray-400">Scheduled</span>
                </p>
                <p className="flex items-center justify-between">
                  On due date <span className="text-gray-400">Scheduled</span>
                </p>
                <p className="flex items-center justify-between">
                  7 days after <span className="text-gray-400">Draft</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="border-y border-gray-200 bg-white/70 py-6" data-animate="fade-up">
          <div className="relative mx-auto max-w-6xl overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white/70 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white/70 to-transparent" />
            <div className="flex gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-[0.4em] text-gray-500" style={{ animation: "marquee 24s linear infinite" }}>
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
        <section id="product" className="border-t border-gray-100 bg-white/80 py-20" data-animate="fade-up">
          <div className="mx-auto max-w-5xl space-y-12 px-6">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Structure with human context</h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600">
                Each invoice couples financial clarity with meaning—why, for whom, and under what terms—so payments become durable records.
              </p>
            </div>

            {/* Asymmetric Grid Layout */}
            <div className="grid gap-6">
              {/* Row 1: 60/40 split */}
              <div className="grid gap-6 lg:grid-cols-10">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-6">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={Shield} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Official by Design</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Operate with global-grade clarity even without a registered entity. Plaen gives you legitimacy through format, flow, and consistency.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <CheckCircle2 className="h-5 w-5 text-gray-600" />
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
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={FileText} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Calm Invoice Builder</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      A monochrome surface engineered for focus. Totals, taxes, context notes—updated instantly without visual noise.
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
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={Smartphone} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Frictionless Payment Access</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Recipients open a secure link, review structured context, and complete payment—no account barrier, no confusion.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span>Secure link</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)] transition hover:-translate-y-1 hover:border-black/80 hover:shadow-[0_24px_80px_rgba(15,15,15,0.12)] lg:col-span-6">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={Activity} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Live Composition Feedback</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Totals, previews, and context sync as you type—reducing errors and reinforcing trust before sending.
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
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={CheckCircle2} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Finance Notes & Receipts</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Each payment triggers a verifiable receipt and keeps contextual notes attached—building a searchable narrative over time.
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
                    <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                  </div>
                  <div className="relative space-y-4">
                    <IconFrame icon={Globe2} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <h3 className="text-lg font-semibold text-black">Device-Agnostic Workspace</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Access structured financial context anywhere—mobile, desktop, or tablet—without losing fidelity.
                    </p>
                    {/* Visual mockup area */}
                    <div className="mt-6 flex items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                      <Smartphone className="h-6 w-6 text-gray-400" />
                      <div className="h-6 w-6 rounded border-2 border-gray-400" />
                      <Globe2 className="h-6 w-6 text-gray-400" />
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
              <h2 className="text-3xl font-semibold tracking-tight text-black">Calm surface. Durable records.</h2>
              <p className="text-base leading-7 text-gray-600">
                A monochrome, low‑noise interface guides you from context capture to receipt—fast, deliberate, human. No clutter; just official output ready to share or search.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Tailored setup for individuals and businesses
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Clean interface with real-time updates
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Secure payment links, no account needed
                </span>
              </div>
            </div>

            <div className="grid flex-1 gap-6 sm:grid-cols-2">
              {modules.map((module) => (
                <div
                  key={module.title}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition-transform hover:-translate-y-2"
                >
                  <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gray-500">
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
              <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Draft → Context → Receipt in seconds.
              </h2>
              <p className="text-base leading-7 text-gray-600">
                Capture purpose and items, compose with live feedback, share frictionless links or document‑only records, and accumulate Finance Notes & Docs—your finance memory.
              </p>
            </div>

            <div className="relative flex-1">
              <div className="absolute left-[1.25rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-black via-gray-300 to-transparent lg:block" />
              <ol className="space-y-6">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,15,15,0.08)] transition-all hover:-translate-y-1.5 hover:border-black/80"
                    data-animate="fade-up"
                    style={{ animation: `timelineFade 0.8s ease ${index * 0.12}s both` }}
                  >
                    <div className="absolute -left-[3.1rem] top-6 hidden h-3 w-3 rounded-full border-4 border-white bg-black lg:block" />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                          {`0${index + 1}`}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-black">{step.title}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-500">
                            {index === 0 ? "Context" : index === 1 ? "Composition" : "Payment"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
                        {index === 0 ? "Personal & business profiles" : index === 1 ? "Templates & dual currency" : "Reminders & receipts"}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600 lg:ml-13">{step.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-500">
                      {index === 0 && (
                        <>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Clients import</span>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Sender presets</span>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Preview sync</span>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Documentation</span>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Shareable link</span>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Auto reminders</span>
                          <span className="rounded-full border border-gray-200 px-3 py-1">Receipt ledger</span>
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
  <section id="pricing" className="relative overflow-hidden border-t border-gray-100 bg-gray-900 py-24 text-white" data-animate="fade-up">
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
              Send, request, or document a transfer in seconds. Get a hosted receipt page and PDF with a tamper‑evident snapshot. Share links; recipients don’t need an account.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
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
