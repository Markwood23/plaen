import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { 
  Building, 
  Global, 
  Heart, 
  People, 
  DocumentText1,
  Mobile,
  ArrowRight2,
  Briefcase,
} from "iconsax-react";
import Link from "next/link";

// Values data
const values = [
  {
    title: "Clarity over complexity",
    description: "Every feature earns its place. We remove friction, not capability.",
    icon: DocumentText1,
    color: "#14462a",
  },
  {
    title: "Professionalism for all",
    description: "Formal structure shouldn't require formal incorporation. Anyone can operate with legitimacy.",
    icon: Briefcase,
    color: "#D97706",
  },
  {
    title: "Context matters",
    description: "Payments carry meaning. Finance notes preserve the story behind every transaction.",
    icon: Heart,
    color: "#0D9488",
  },
  {
    title: "Regional reality",
    description: "Built for African operators with mobile money, multi-currency, and local payment access.",
    icon: Global,
    color: "#14462a",
  },
];

// Stats data
const stats = [
  { value: "10K+", label: "Active users" },
  { value: "98%", label: "Satisfaction" },
  { value: "5+", label: "Currencies" },
  { value: "<3min", label: "To invoice" },
];

export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        {/* Hero + Mission - shared background */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div
              className="absolute left-1/2 top-[-10%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-100/50 to-transparent blur-3xl"
              style={{ animation: "floatBlob 18s ease-in-out infinite" }}
            />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent z-0" />

          <main>
            {/* Hero */}
            <div
              data-animate="fade-up"
              className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-20 pt-32 text-center"
            >
              <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                About Plaen
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                Money + Meaning.<br />Built-in Professionalism.
              </h1>
              <p className="max-w-2xl text-lg leading-7 text-gray-600">
                Plaen pairs professional structure with human context. Anyone can operate with legitimacy—freelancers, individuals, and businesses—while keeping finance notes beside every invoice and payment.
              </p>
            </div>

            {/* Mission statement */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24" data-animate="fade-up">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Official flows for African operators
                  </h2>
                  <p className="text-base leading-7 text-gray-600">
                    Designed around regional reality: mobile money, bank transfer, and crypto. We combine local payment access with global-grade, official-by-design documents.
                  </p>
                  <p className="text-base leading-7 text-gray-600">
                    Independent operators deserve the same professional infrastructure as large corporations—without the overhead or gatekeeping.
                  </p>
                </div>
                <blockquote className="border-l-4 border-[#14462a] pl-6 text-lg italic text-gray-700">
                  "We're building a calm workspace where payments carry meaning. Professional output by default, with finance notes that keep every decision in context."
                </blockquote>
              </div>
            </div>
          </main>
        </section>

        {/* Stats - simple row */}
        <section className="border-t border-gray-100 bg-white py-16" data-animate="fade-up">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-[#14462a]">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values - clean grid, no cards */}
        <section className="border-t border-gray-100 bg-gray-50/50 py-20" data-animate="fade-up">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                Principles that guide us
              </h2>
              <p className="mx-auto max-w-2xl text-base text-gray-600">
                Everything we build reflects these core beliefs about professional work and financial clarity.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="flex items-start gap-4">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${value.color}15` }}
                    >
                      <Icon size={20} color={value.color} variant="Bulk" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{value.title}</h3>
                      <p className="text-sm leading-6 text-gray-600">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What makes Plaen different - simple list */}
        <section className="border-t border-gray-100 bg-white py-20" data-animate="fade-up">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                  What makes Plaen different
                </h2>
                <p className="text-base leading-7 text-gray-600">
                  We've experienced the friction of informal invoicing firsthand. Plaen exists because we needed it ourselves.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Global size={24} color="#14462a" variant="Bulk" />
                  <div>
                    <p className="font-medium text-gray-900">5+ currencies</p>
                    <p className="text-sm text-gray-500">GHS, NGN, KES, ZAR, USD and growing</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <People size={24} color="#D97706" variant="Bulk" />
                  <div>
                    <p className="font-medium text-gray-900">Personal & Business</p>
                    <p className="text-sm text-gray-500">Choose your setup, no restrictions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Building size={24} color="#0D9488" variant="Bulk" />
                  <div>
                    <p className="font-medium text-gray-900">No registration required</p>
                    <p className="text-sm text-gray-500">Clients pay without creating accounts</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mobile size={24} color="#14462a" variant="Bulk" />
                  <div>
                    <p className="font-medium text-gray-900">Local payment methods</p>
                    <p className="text-sm text-gray-500">Mobile money, bank transfer, crypto</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 bg-white py-24" data-animate="fade-up">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-3xl bg-[#14462a] p-12 text-white text-center relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />
              </div>
              
              <div className="relative space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ready to operate with built-in professionalism?
                </h2>
                <p className="mx-auto max-w-2xl text-base text-white/80">
                  Join operators attaching Money + Meaning to every invoice. Start free and add context as you grow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <SmartButton size="lg" className="bg-white text-[#14462a] hover:bg-gray-100">
                      Get started free
                      <ArrowRight2 size={16} color="#14462a" className="ml-2" />
                    </SmartButton>
                  </Link>
                  <Link href="/contact">
                    <SmartButton size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                      Talk to our team
                    </SmartButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}
