import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SmartButton } from "@/components/ui/smart-button";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { Lovely, Calendar, Setting2, Sms } from "iconsax-react";

export default function ComingSoonPage() {
  const year = new Date().getFullYear();
  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-10%] bottom-[-10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 22s ease-in-out infinite", animationDelay: "-6s" }}
          />
        </div>

        <main className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 pb-24 pt-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
            <Lovely size={14} color="#E11D48" variant="Bold" /> Coming Soon
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">This part of Plaen isn\'t live yet.</h1>
          <p className="max-w-2xl text-lg leading-7 text-gray-600">
            We\'re polishing the workspace experience. You can still explore the product narrative while we stage the full app/dashboard rollout.
          </p>
          {/* Small timeline */}
          <div className="grid w-full gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#14462a]/10 flex items-center justify-center">
                  <Setting2 size={18} color="#14462a" variant="Bulk" />
                </div>
                <div className="text-sm font-medium text-black">In progress</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">Core workspace, payments, and receipts.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#14462a]/10 flex items-center justify-center">
                  <Calendar size={18} color="#14462a" variant="Bulk" />
                </div>
                <div className="text-sm font-medium text-black">Staged releases</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">We\'ll open access incrementally for feedback.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#D97706]/10 flex items-center justify-center">
                  <Sms size={18} color="#D97706" variant="Bulk" />
                </div>
                <div className="text-sm font-medium text-black">Get notified</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">We\'ll email when your access is ready.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <SmartButton size="lg">Return home</SmartButton>
            </Link>
            <Link href="/blog">
              <SmartButton size="lg" variant="outline" className="border-gray-200 text-black hover:border-black hover:bg-gray-50">Read updates</SmartButton>
            </Link>
          </div>
          <p className="text-sm text-gray-500">Want early access? Reach out via the contact page—responses within one business day.</p>
        </main>
        <MarketingFooter year={year} />
      </div>
    </>
  );
}
