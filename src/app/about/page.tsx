import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { Building2, Globe2, Heart, Users } from "lucide-react";
import { Pillars } from "@/components/marketing/pillars";
import Link from "next/link";

export default function AboutPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.14),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-10%] top-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 24s ease-in-out infinite", animationDelay: "-8s" }}
          />
        </div>

        <main>
          <section
            data-animate="fade-up"
            className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pb-24 pt-20 text-center"
          >
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              About Plaen
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Money + Meaning. Built-in Professionalism.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              Plaen pairs professional structure with human context. Anyone can operate with legitimacy: freelancers, individuals, and businesses, while keeping finance notes beside every invoice and payment.
            </p>
          </section>

          <Pillars subtle heading="Our narrative" />

          <section className="border-t border-gray-200 bg-white/80 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Official flows for African operators
                  </h2>
                  <p className="text-base leading-7 text-gray-600">
                    Plaen is designed around regional reality: mobile money, bank transfer, and crypto. We combine local payment access with global-grade, official-by-design documents and context.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
                      <Globe2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">5+ currencies supported</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">Personal & business</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">No registration required</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">Made with care</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-3xl bg-gray-50 p-8">
                  <blockquote className="space-y-4">
                    <p className="text-lg leading-8 text-gray-700 italic">
                      "We're building a calm workspace where payments carry meaning. Professional output by default, with finance notes that keep every decision and receipt in context."
                    </p>
                    <footer className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200" />
                      <div>
                        <div className="font-medium text-black">Plaen Team</div>
                        <div className="text-sm text-gray-500">Founders</div>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 bg-gray-50 py-24" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6 text-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                  Ready to operate with built-in professionalism?
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">
                  Join operators attaching Money + Meaning to every invoice. Start free, keep the calm surface, and add context as you grow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <SmartButton size="lg">
                      Talk to our team
                    </SmartButton>
                  </Link>
                  <Link href="/pricing">
                    <SmartButton size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                      View pricing
                    </SmartButton>
                  </Link>
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