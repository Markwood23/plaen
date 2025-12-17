import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import {
  TickCircle,
  Bitcoin,
  Building,
  Clock,
  Eye,
  DocumentLike,
  DocumentText1,
  Refresh,
  Setting2,
  Share,
  Mobile,
  TrendUp,
} from "iconsax-react";

const steps = [
  {
    title: "Choose Your Setup",
    description:
      "Personal or Business. Freelancers add their name and payout method. Companies add branding, logo, and tax details. Your information automatically populates future invoices.",
    icon: Setting2,
    color: "#4F46E5", // Indigo
  },
  {
    title: "Build Your Invoice",
    description:
      "A quiet, black-and-white interface. Add items, quantities, and rates. See totals update in real time. Preview a clean, ready-to-share document in one click.",
    icon: DocumentLike,
    color: "#059669", // Green
  },
  {
    title: "Send & Get Paid",
    description:
      "Share via link, email, or WhatsApp. Recipients don't need an account. They open a secure link, review, and pay through mobile money, bank, or crypto.",
    icon: Share,
    color: "#D97706", // Amber
  },
];

const features = [
  {
    heading: "No Account Needed to Pay",
  copy: "Your clients receive a clean, secure link. They review the invoice and complete payment with no signup and no friction.",
    bullets: [
      { text: "Mobile Money (MTN, AirtelTigo, M-Pesa)", icon: Mobile },
      { text: "Bank Transfer", icon: Building },
      { text: "Crypto Payments", icon: Bitcoin },
    ],
    color: "#0284C7", // Sky
  },
  {
    heading: "Real-Time Updates",
    copy: "See totals calculate as you type. Preview exactly what your client will see. Every field is clearly spaced and perfectly aligned.",
    bullets: [
      { text: "Live total calculations", icon: Clock },
      { text: "Clean preview mode", icon: Eye },
      { text: "Professional formatting", icon: DocumentLike },
    ],
    color: "#059669", // Green
  },
  {
    heading: "Automatic Records",
    copy: "Every payment generates a timestamped receipt. Your documentation stays organized without manual updates.",
    bullets: [
      { text: "Instant receipts", icon: DocumentText1 },
      { text: "Payment timeline", icon: Refresh },
      { text: "Verifiable records", icon: TickCircle },
    ],
    color: "#F59E0B", // Orange
  },
];

export default function HowItWorksPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="min-h-screen bg-white text-black">
        <main className="relative">
          {/* Hero Section with Patterns */}
          <section className="relative overflow-hidden">
            {/* Background Patterns - Contained within hero */}
            <div className="pointer-events-none absolute inset-0 z-0">
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
              
              {/* Floating Gradient Orbs */}
              <div
                className="absolute left-1/2 top-[-10%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-100/50 to-transparent blur-3xl"
                style={{ animation: "floatBlob 18s ease-in-out infinite" }}
              />
              <div
                className="absolute right-[-5%] top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-gray-100/40 to-transparent blur-3xl"
                style={{ animation: "floatBlob 24s ease-in-out infinite", animationDelay: "-8s" }}
              />
              
              {/* Dot Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-[size:48px_48px]" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-24 pt-20 text-center" data-animate="fade-up">
          <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
            How it Works
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
            A narrative-driven flow from draft to receipt.
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-gray-600">
            Each stage reinforces legitimacy and clarity: structure your profile, compose with live feedback, attach meaning, share a frictionless link, and keep contextual finance notes alongside verifiable receipts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <SmartButton size="lg" className="px-8">
                Talk to our team
              </SmartButton>
            </Link>
            <Link href="/signup">
              <SmartButton size="lg" variant="outline" className="border-gray-200 px-8 text-black transition hover:border-black hover:bg-gray-50">
                Create account
              </SmartButton>
            </Link>
          </div>
          </div>
        </section>

        <section className="bg-white/75 py-20" data-animate="fade-up" aria-labelledby="how-flow">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,15,15,0.06)] transition-all hover:-translate-y-2"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div 
                      className="absolute -right-16 top-10 h-36 w-36 rounded-full blur-3xl" 
                      style={{
                        background: `radial-gradient(circle, ${step.color}30 0%, ${step.color}15 50%, transparent 100%)`,
                      }}
                    />
                  </div>
                  <span 
                    className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full transition group-hover:text-white"
                    style={{
                      backgroundColor: `${step.color}10`,
                    }}
                  >
                    <Icon size={20} color={step.color} variant="Bulk" />
                  </span>
                  <h3 className="relative text-lg font-semibold text-black">{step.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-gray-600">{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

  {/* Removed duplicate Pillars to reduce repetition; narrative woven into sections below */}

        <section className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-24" data-animate="fade-up">
          <div className="mx-auto max-w-6xl px-6">
            <div className="space-y-4 text-center">
              <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
                Why Plaen
              </Badge>
              <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Professional structure + human context.
              </h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600">
                Independent operators deserve legitimacy. Plaen pairs format, flow, and finance notes so every payment tells a durable story.
              </p>
            </div>

            {/* Video placeholder */}
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                <div className="flex aspect-video items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14462a] transition group-hover:scale-110 group-hover:bg-[#14462a]/90">
                    <svg className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute left-8 top-8 h-16 w-32 rounded-lg bg-gray-200/50" />
                <div className="absolute right-12 top-12 h-12 w-24 rounded-lg bg-gray-200/50" />
                <div className="absolute bottom-8 left-12 h-10 w-40 rounded-lg bg-gray-200/50" />
                <div className="absolute bottom-12 right-8 h-14 w-28 rounded-lg bg-gray-200/50" />
              </div>
            </div>

            {/* Three solutions */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="group space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0D9488]/10 transition group-hover:bg-[#0D9488]">
                  <Setting2 size={20} color="#0D9488" variant="Bulk" className="transition group-hover:hidden" />
                  <Setting2 size={20} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                </div>
                <h3 className="font-semibold text-black">Built-in Professionalism</h3>
                <p className="text-sm leading-6 text-gray-600">
                  Operate with clarity and trust. Professional output without needing formal incorporation.
                </p>
              </div>

              <div className="group space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D97706]/10 transition group-hover:bg-[#D97706]">
                  <Mobile size={20} color="#D97706" variant="Bulk" className="transition group-hover:hidden" />
                  <Mobile size={20} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                </div>
                <h3 className="font-semibold text-black">Frictionless Access</h3>
                <p className="text-sm leading-6 text-gray-600">
                  Recipients review structured context and pay through local methods with no signup barrier and no cognitive load.
                </p>
              </div>

              <div className="group space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5]/10 transition group-hover:bg-[#4F46E5]">
                  <Share size={20} color="#4F46E5" variant="Bulk" className="transition group-hover:hidden" />
                  <Share size={20} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                </div>
                <h3 className="font-semibold text-black">Context Layers</h3>
                <p className="text-sm leading-6 text-gray-600">
                  Finance notes, documentation attachments, and payment timelines keep everything auditable and human.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50 py-24" data-animate="fade-up">
          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row">
            <div className="max-w-md space-y-6">
              <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                What makes it work
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Smooth, transparent, and human.
              </h2>
              <p className="text-base leading-7 text-gray-600">
                Every interaction feels deliberate. From the interface to the payment flow, Plaen removes friction without sacrificing professionalism.
              </p>
            </div>

            <ol className="flex-1 space-y-6">
              {features.map((feature, index) => (
                <li
                  key={feature.heading}
                  data-animate="fade-up"
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,15,15,0.08)] transition-all hover:-translate-y-1.5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p 
                        className="text-xs uppercase tracking-[0.3em] font-medium"
                        style={{ color: feature.color }}
                      >
                        Feature {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-black">{feature.heading}</h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{feature.copy}</p>
                    </div>
                    <ul className="grid gap-2 text-xs font-medium text-gray-500 lg:items-end lg:text-right">
                      {feature.bullets.map((bullet) => {
                        const Icon = bullet.icon;
                        return (
                          <li key={bullet.text} className="inline-flex items-center justify-center gap-2 lg:justify-end">
                            <Icon 
                              size={16}
                              color={feature.color}
                              variant="Bulk"
                            />
                            {bullet.text}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-24" data-animate="fade-up">
          <div className="mx-auto max-w-6xl px-6">
            <div className="group relative overflow-hidden rounded-3xl bg-gray-50 p-12 transition-all">
              {/* Subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-md space-y-4">
                  <Badge variant="outline" className="rounded-full border-gray-200 bg-white px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-gray-500">
                    Ready to start
                  </Badge>
                  <h3 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Professional structure for everyone.
                  </h3>
                  <p className="text-base leading-7 text-gray-600">
                    Whether you're sending your first invoice or your hundredth, Plaen gives you the workspace to do it with confidence. No formal business required.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/contact">
                      <SmartButton size="lg">
                        Talk with our team
                      </SmartButton>
                    </Link>
                    <Link href="/pricing">
                      <SmartButton size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                        Explore pricing
                      </SmartButton>
                    </Link>
                  </div>
                </div>
                
                <div className="lg:min-w-[320px]">
                  {/* Payment Time Chart - No background card */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Avg. Payment Time</p>
                        <p className="mt-1 text-4xl font-bold tracking-tight text-black">2.6 days</p>
                        <p className="mt-1 text-xs text-gray-500">Based on 30 recent invoices</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-2.5">
                        <TrendUp size={20} className="text-gray-600" />
                      </div>
                    </div>
                    
                    {/* Chart visualization */}
                    <div className="flex items-end gap-1.5 pt-4" style={{ height: '120px' }}>
                      {[40, 65, 45, 80, 60, 75, 55, 70, 50, 85, 65, 75].map((height, i) => (
                        <div
                          key={i}
                          className="group/bar flex-1 rounded-t-sm transition-all"
                          style={{ 
                            height: `${height}%`,
                            background: `linear-gradient(to top, #14462a, #14462aCC)`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>
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
