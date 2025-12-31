import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight2 } from "iconsax-react";
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
  Magicpen,
  Building,
  User,
  Add,
  Send2,
  Wallet,
  Bitcoin,
  Bank,
  MoneyRecive,
  Edit2,
  Eye,
  Share,
  Sms,
  Whatsapp,
  Link2,
  Monitor,
  Cloud
} from "iconsax-react";
import { IconFrame } from "@/components/ui/icon-frame";
import { Pillars } from "@/components/marketing/pillars";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { HomePageEffects } from "@/components/marketing/home-page-effects";

// ============ MODULE PREVIEWS ============

// Personal vs Business account selector preview
function AccountTypePreview() {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1 rounded-xl border-2 border-[#14462a] bg-[#14462a]/5 p-3 transition-all">
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#14462a] flex items-center justify-center">
          <TickCircle size={12} color="#fff" variant="Bold" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#14462a]/10 flex items-center justify-center">
            <User size={16} color="#14462a" variant="Bold" />
          </div>
          <span className="text-[10px] font-semibold text-[#14462a]">Personal</span>
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-gray-300">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Building size={16} color="#6B7280" variant="Linear" />
          </div>
          <span className="text-[10px] font-medium text-gray-500">Business</span>
        </div>
      </div>
    </div>
  );
}

// Mini invoice builder interface preview
function InvoiceBuilderPreview() {
  return (
    <div className="space-y-2">
      {/* Mini toolbar */}
      <div className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-1">
        <div className="flex gap-1">
          <div className="h-4 w-4 rounded bg-white flex items-center justify-center">
            <Edit2 size={8} color="#6B7280" />
          </div>
          <div className="h-4 w-4 rounded bg-white flex items-center justify-center">
            <Eye size={8} color="#6B7280" />
          </div>
        </div>
        <div className="h-3 w-12 rounded-full bg-teal-500" />
      </div>
      {/* Line items */}
      <div className="space-y-1.5 rounded-lg border border-gray-200 bg-white p-2">
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-gray-600">Design Services</span>
          <span className="font-semibold text-gray-800">₵1,200</span>
        </div>
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-gray-600">Development</span>
          <span className="font-semibold text-gray-800">₵2,400</span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-1.5 flex items-center justify-between text-[9px]">
          <span className="font-medium text-gray-700">Total</span>
          <span className="font-bold text-[#14462a]">₵3,600</span>
        </div>
      </div>
    </div>
  );
}

// Payment methods sharing preview
function SendPaymentPreview() {
  return (
    <div className="space-y-3">
      {/* Share options */}
      <div className="flex justify-center gap-2">
        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
          <Link2 size={14} color="#0284C7" variant="Bold" />
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Sms size={14} color="#3B82F6" variant="Bold" />
        </div>
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <Whatsapp size={14} color="#22C55E" variant="Bold" />
        </div>
      </div>
      {/* Payment methods */}
      <div className="flex items-center justify-center gap-1">
        <div className="rounded-md bg-amber-100 px-1.5 py-0.5 flex items-center gap-1">
          <MoneyRecive size={10} color="#D97706" />
          <span className="text-[7px] font-medium text-amber-700">MoMo</span>
        </div>
        <div className="rounded-md bg-gray-100 px-1.5 py-0.5 flex items-center gap-1">
          <Bank size={10} color="#6B7280" />
          <span className="text-[7px] font-medium text-gray-600">Bank</span>
        </div>
        <div className="rounded-md bg-orange-100 px-1.5 py-0.5 flex items-center gap-1">
          <Bitcoin size={10} color="#EA580C" />
          <span className="text-[7px] font-medium text-orange-700">Crypto</span>
        </div>
      </div>
    </div>
  );
}

// ============ FEATURE HIGHLIGHTS PREVIEWS ============

// Professional verification badges preview
function ProfessionalismPreview() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#14462a] to-teal-600 flex items-center justify-center shadow-lg">
          <ShieldTick size={20} color="#fff" variant="Bold" />
        </div>
        <span className="text-[7px] text-gray-500">Verified</span>
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <TickCircle size={12} color="#14462a" variant="Bold" />
          <div className="h-1.5 w-16 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <TickCircle size={12} color="#14462a" variant="Bold" />
          <div className="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <TickCircle size={12} color="#14462a" variant="Bold" />
          <div className="h-1.5 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Calm invoice composition preview
function CalmInvoicePreview() {
  return (
    <div className="relative">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="space-y-2">
          <div className="h-1.5 w-20 rounded bg-gray-800" />
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-3/4 rounded bg-gray-100" />
          <div className="h-1 w-5/6 rounded bg-gray-100" />
        </div>
        <div className="mt-3 flex justify-end">
          <div className="rounded bg-gray-900 px-2 py-0.5">
            <span className="text-[8px] font-semibold text-white">₵4,200</span>
          </div>
        </div>
      </div>
      {/* Cursor indicator */}
      <div className="absolute -right-1 top-1/2 h-4 w-0.5 animate-pulse rounded-full bg-[#14462a]" />
    </div>
  );
}

// Secure payment link preview
function SecurePaymentPreview() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 border border-teal-200">
        <Lock1 size={12} color="#14462a" variant="Bold" />
        <span className="text-[9px] font-medium text-teal-700">plaen.co/pay/inv_28x...</span>
      </div>
      <div className="flex items-center gap-1.5 text-[8px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          No login required
        </span>
      </div>
    </div>
  );
}

// Live feedback totals preview
function LiveFeedbackPreview() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-700">₵3,400</span>
        </div>
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-gray-500">Tax (12.5%)</span>
          <span className="text-gray-700">₵425</span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-semibold border-t border-gray-200 pt-1.5">
          <span className="text-gray-800">Total</span>
          <span className="text-[#14462a] flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            ₵3,825
          </span>
        </div>
      </div>
      <div className="h-12 w-px bg-gray-200" />
      <div className="text-center">
        <div className="text-[8px] text-gray-500 mb-1">GHS</div>
        <div className="text-[11px] font-bold text-amber-600">₵45,900</div>
      </div>
    </div>
  );
}

// Receipt ledger preview
function ReceiptLedgerPreview() {
  const receipts = [
    { status: 'verified', amount: '₵2,400' },
    { status: 'verified', amount: '₵1,800' },
    { status: 'pending', amount: '₵3,200' },
  ];
  return (
    <div className="space-y-1.5">
      {receipts.map((r, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-2 py-1.5 shadow-sm">
          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
            r.status === 'verified' ? 'bg-teal-100' : 'bg-amber-100'
          }`}>
            {r.status === 'verified' ? (
              <TickCircle size={10} color="#14462a" variant="Bold" />
            ) : (
              <Timer1 size={10} color="#D97706" variant="Bold" />
            )}
          </div>
          <div className="flex-1">
            <div className="h-1 w-16 rounded bg-gray-200" />
          </div>
          <span className="text-[8px] font-semibold text-gray-700">{r.amount}</span>
        </div>
      ))}
    </div>
  );
}

// Multi-device preview
function MultiDevicePreview() {
  return (
    <div className="flex items-end justify-center gap-3">
      {/* Mobile */}
      <div className="h-14 w-7 rounded-lg border-2 border-gray-300 bg-white p-0.5 shadow-sm">
        <div className="h-full w-full rounded-md bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-sm bg-[#14462a]" />
        </div>
      </div>
      {/* Desktop */}
      <div className="flex flex-col items-center">
        <div className="h-10 w-16 rounded-t-lg border-2 border-b-0 border-gray-300 bg-white p-1 shadow-sm">
          <div className="h-full w-full rounded-sm bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="h-2 w-4 rounded-sm bg-[#14462a]" />
          </div>
        </div>
        <div className="h-1.5 w-20 rounded-b-sm bg-gray-300" />
        <div className="h-0.5 w-8 rounded-b bg-gray-400" />
      </div>
      {/* Tablet */}
      <div className="h-12 w-9 rounded-lg border-2 border-gray-300 bg-white p-0.5 shadow-sm">
        <div className="h-full w-full rounded-md bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="h-2 w-3 rounded-sm bg-[#14462a]" />
        </div>
      </div>
    </div>
  );
}

// Accent color palette for icons
const accentColors = {
  warmAmber: "#B45309", // Warm amber - contacts/people  
  amber: "#D97706",     // Bright amber - payments/money
  rose: "#E11D48",      // Vibrant rose - receipts/docs
  sky: "#0284C7",       // Bright sky - reminders/notifications
  teal: "#14462a",      // Teal - analytics/security/success
  brand: "#14462a",     // Brand green - primary
  orange: "#EA580C",    // Orange - speed/time
};

const modules = [
  {
    title: "Personal or Business",
    copy: "Choose your setup. Freelancers add their name and payout method. Companies add branding, logo, and tax details. Your information automatically populates future invoices.",
    badge: "Tailored onboarding",
    color: accentColors.warmAmber,
    preview: AccountTypePreview,
  },
  {
    title: "Invoice Builder",
    copy: "A quiet, black-and-white interface. Add items, quantities, and rates. See totals update in real time. Preview a clean, ready-to-share document in one click.",
    badge: "The heart of Plaen",
    color: accentColors.teal,
    preview: InvoiceBuilderPreview,
  },
  {
    title: "Send & Get Paid",
  copy: "Share via link, email, or WhatsApp. Recipients don't need an account. They open a secure link, review, and pay through mobile money, bank, or crypto.",
    badge: "Smooth & transparent",
    color: accentColors.amber,
    preview: SendPaymentPreview,
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
    color: accentColors.warmAmber,
  },
  {
    title: "Compose & preview",
    description:
      "Add line items, taxes, and notes. Toggle dual currency, attach documentation, and preview the public invoice instantly.",
    color: accentColors.teal,
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
      <HomePageEffects />
      <MarketingHeader />
      <div className="relative min-h-screen bg-white text-black overflow-x-hidden">

      <main>
        {/* Hero - Clean & Minimal */}
        <section className="relative mx-auto max-w-4xl px-6 pt-32 pb-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl lg:text-6xl">
            Invoicing made simple.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Create professional invoices, accept mobile money and bank payments, 
            and keep verified receipts — all in one calm workspace.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <SmartButton size="lg" className="px-8">
                Start for free
                <ArrowRight2 size={16} color="currentColor" className="ml-2" />
              </SmartButton>
            </Link>
            <Link href="/how-it-works">
              <SmartButton size="lg" variant="outline" className="border-gray-300 px-8 text-gray-700 hover:bg-gray-50">
                See how it works
              </SmartButton>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required · Free for your first 10 invoices
          </p>
        </section>

        {/* Dashboard Preview */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-2 shadow-2xl shadow-gray-300/30 overflow-hidden">
            <div className="rounded-xl overflow-hidden">
              <img 
                src="/home-p.png" 
                alt="Plaen Dashboard - Your invoicing workspace" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Trusted By - Sliding logos */}
        <section className="border-y border-gray-100 bg-gray-50/50 py-10">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
              Trusted by freelancers and businesses
            </p>
            <div className="relative overflow-hidden">
              {/* Fade edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-gray-50 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-gray-50 to-transparent" />
              {/* Marquee */}
              <div className="flex animate-[marquee_25s_linear_infinite]" style={{ width: 'max-content' }}>
                {[...trustedBrands, ...trustedBrands].map((brand, i) => (
                  <span 
                    key={`${brand}-${i}`} 
                    className="mx-8 text-base font-semibold text-gray-400 whitespace-nowrap sm:mx-12 sm:text-lg"
                  >
                    {brand}
                  </span>
                ))}
              </div>
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
            <div className="grid gap-5">
              {/* Row 1: 60/40 split */}
              <div className="grid gap-5 lg:grid-cols-10">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl lg:col-span-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Preview visualization */}
                    <div className="flex-shrink-0 h-28 sm:h-auto sm:w-40 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                      <ProfessionalismPreview />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Built-in Professionalism</h3>
                      <p className="text-sm leading-relaxed text-gray-500">
                        Operate with global-grade clarity even without a registered entity. Plaen gives you legitimacy through format, flow, and consistency.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl lg:col-span-4">
                  {/* Preview visualization */}
                  <div className="mb-5 h-28 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                    <CalmInvoicePreview />
                  </div>
                  {/* Content */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Calm Invoice Builder</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    A monochrome surface engineered for focus. Totals, taxes, context notes update instantly without visual noise.
                  </p>
                </article>
              </div>

              {/* Row 2: 40/60 split */}
              <div className="grid gap-5 lg:grid-cols-10">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl lg:col-span-4">
                  {/* Preview visualization */}
                  <div className="mb-5 h-24 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                    <SecurePaymentPreview />
                  </div>
                  {/* Content */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Frictionless Payment Access</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Recipients open a secure link, review structured context, and complete payment with no account barrier.
                  </p>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl lg:col-span-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Preview visualization */}
                    <div className="flex-shrink-0 h-24 sm:h-auto sm:w-48 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                      <LiveFeedbackPreview />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Live Composition Feedback</h3>
                      <p className="text-sm leading-relaxed text-gray-500">
                        Totals, previews, and context sync as you type, reducing errors and reinforcing trust before sending.
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              {/* Row 3: 50/50 split */}
              <div className="grid gap-5 lg:grid-cols-2">
                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
                  {/* Preview visualization */}
                  <div className="mb-5 h-28 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                    <ReceiptLedgerPreview />
                  </div>
                  {/* Content */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Finance Notes & Receipts</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Each payment triggers a verifiable receipt and keeps contextual notes attached, building a searchable narrative over time.
                  </p>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
                  {/* Preview visualization */}
                  <div className="mb-5 h-28 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                    <MultiDevicePreview />
                  </div>
                  {/* Content */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Device-Agnostic Workspace</h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Access structured financial context on mobile, desktop, or tablet without losing fidelity.
                  </p>
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
                  <TickCircle size={16} color={accentColors.teal} variant="Bold" /> Tailored setup for individuals and businesses
                </span>
                <span className="flex items-center gap-2">
                  <TickCircle size={16} color={accentColors.teal} variant="Bold" /> Clean interface with real-time updates
                </span>
                <span className="flex items-center gap-2">
                  <TickCircle size={16} color={accentColors.teal} variant="Bold" /> Secure payment links, no account needed
                </span>
              </div>
            </div>

            <div className="grid flex-1 gap-5">
              {modules.map((module) => {
                const Preview = module.preview;
                return (
                  <div
                    key={module.title}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Preview visualization */}
                      <div className="flex-shrink-0 h-28 sm:h-auto sm:w-44 flex items-center justify-center rounded-xl bg-gray-50 p-4">
                        <Preview />
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <span 
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] font-medium"
                          style={{
                            backgroundColor: `${module.color}10`,
                            borderColor: `${module.color}30`,
                            color: module.color,
                          }}
                        >
                          {module.badge}
                        </span>
                        <h3 className="mt-3 text-base font-semibold text-gray-900">{module.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">{module.copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
