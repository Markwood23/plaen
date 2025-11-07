import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { ArrowRight, Building2, Globe2, Heart, Users } from "lucide-react";
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
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              About Plaen
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Structure, made accessible.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              We believe professional financial tools shouldn't require formal business registration. Plaen democratizes access to structure—for freelancers, individuals, and businesses alike.
            </p>
          </section>

          <section className="border-t border-gray-200 bg-white/80 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Built for the African market
                  </h2>
                  <p className="text-base leading-7 text-gray-600">
                    Plaen was designed with African payment methods and business practices in mind. From mobile money to crypto, we support the payment methods that matter in our markets.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                      <Globe2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">5+ currencies supported</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">Personal & business</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">No registration required</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-black">Made with care</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                  <blockquote className="space-y-4">
                    <p className="text-lg leading-8 text-gray-700 italic">
                      "We wanted to create a platform that feels as professional as the global tools, but works with the payment methods and business realities of African markets."
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
                  Ready to experience Plaen?
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">
                  Join the growing community of professionals who trust Plaen for their invoicing needs. No setup fees, no hidden costs.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-black text-white transition hover:bg-gray-900">
                      Talk to our team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                      View pricing
                    </Button>
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