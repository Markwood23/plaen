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
  User,
  Edit2,
  Bank,
  ReceiptText,
  Link2,
  Whatsapp,
  Sms,
  ArrowRight2,
} from "iconsax-react";

// ============ STEP PREVIEW COMPONENTS ============

function SetupPreview() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 rounded-xl border-2 border-[#14462a] bg-[#14462a]/5 p-3">
          <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#14462a] flex items-center justify-center">
            <TickCircle size={10} color="#fff" variant="Bold" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-7 w-7 rounded-full bg-[#14462a]/10 flex items-center justify-center">
              <User size={14} color="#14462a" variant="Bold" />
            </div>
            <span className="text-[9px] font-semibold text-[#14462a]">Personal</span>
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
              <Building size={14} color="#6B7280" />
            </div>
            <span className="text-[9px] font-medium text-gray-400">Business</span>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-6 rounded-lg bg-gray-100 px-2 flex items-center">
          <span className="text-[8px] text-gray-500">Your full name</span>
        </div>
        <div className="h-6 rounded-lg bg-gray-100 px-2 flex items-center">
          <span className="text-[8px] text-gray-500">email@example.com</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5">
          <Mobile size={8} color="#D97706" />
          <span className="text-[7px] font-medium text-amber-700">MoMo</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5">
          <Bank size={8} color="#14462a" />
          <span className="text-[7px] font-medium text-teal-700">Bank</span>
        </div>
      </div>
    </div>
  );
}

function BuilderPreview() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-1.5">
        <div className="flex gap-1.5">
          <div className="h-5 w-5 rounded bg-white flex items-center justify-center shadow-sm">
            <Edit2 size={10} color="#14462a" />
          </div>
          <div className="h-5 w-5 rounded bg-white flex items-center justify-center shadow-sm">
            <Eye size={10} color="#6B7280" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-[8px] font-medium text-teal-600">Saved</span>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-semibold text-gray-800">PL-A7K9X2</span>
          <span className="text-[8px] text-gray-400">Dec 15, 2025</span>
        </div>
        <div className="space-y-1.5 border-t border-dashed border-gray-200 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-teal-100 flex items-center justify-center">
                <DocumentText1 size={8} color="#14462a" />
              </div>
              <span className="text-[8px] text-gray-600">Design Services</span>
            </div>
            <span className="text-[8px] font-semibold text-gray-800">₵1,200</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-blue-100 flex items-center justify-center">
                <DocumentText1 size={8} color="#0284C7" />
              </div>
              <span className="text-[8px] text-gray-600">Development</span>
            </div>
            <span className="text-[8px] font-semibold text-gray-800">₵2,400</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[9px] font-medium text-gray-700">Total</span>
          <span className="text-[11px] font-bold text-[#14462a]">₵3,600.00</span>
        </div>
      </div>
    </div>
  );
}

function SendPayPreview() {
  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-lg bg-[#14462a]/10 p-2 text-center">
          <Link2 size={14} color="#14462a" className="mx-auto mb-1" />
          <span className="text-[7px] font-medium text-[#14462a]">Copy Link</span>
        </div>
        <div className="flex-1 rounded-lg bg-green-50 p-2 text-center">
          <Whatsapp size={14} color="#25D366" className="mx-auto mb-1" />
          <span className="text-[7px] font-medium text-green-700">WhatsApp</span>
        </div>
        <div className="flex-1 rounded-lg bg-blue-50 p-2 text-center">
          <Sms size={14} color="#0284C7" className="mx-auto mb-1" />
          <span className="text-[7px] font-medium text-blue-700">Email</span>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock size={12} color="#D97706" />
          </div>
          <div>
            <span className="text-[9px] font-semibold text-gray-800 block">Awaiting Payment</span>
            <span className="text-[7px] text-gray-400">Sent 2 hours ago</span>
          </div>
        </div>
        <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
          <div className="h-4 w-4 rounded bg-amber-100 flex items-center justify-center">
            <Mobile size={8} color="#D97706" />
          </div>
          <div className="h-4 w-4 rounded bg-teal-100 flex items-center justify-center">
            <Bank size={8} color="#14462a" />
          </div>
          <div className="h-4 w-4 rounded bg-orange-100 flex items-center justify-center">
            <Bitcoin size={8} color="#EA580C" />
          </div>
          <span className="text-[7px] text-gray-500 ml-1">Client chooses method</span>
        </div>
      </div>
    </div>
  );
}

function ReceiptPreview() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center">
            <TickCircle size={12} color="#fff" variant="Bold" />
          </div>
          <div>
            <span className="text-[9px] font-semibold text-teal-800 block">Payment Received</span>
            <span className="text-[7px] text-teal-600">Dec 17, 2025 at 2:34 PM</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-teal-200">
          <span className="text-[8px] text-teal-700">MTN Mobile Money</span>
          <span className="text-[10px] font-bold text-teal-800">GHS 3,600.00</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          <span className="text-[7px] text-gray-600">Receipt generated automatically</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-[7px] text-gray-600">Added to documentation timeline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-[7px] text-gray-600">Finance note created</span>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Choose Your Setup",
    description:
      "Personal or Business. Freelancers add their name and payout method. Companies add branding, logo, and tax details. Your information automatically populates future invoices.",
    icon: Setting2,
    color: "#14462a",
    preview: SetupPreview,
  },
  {
    number: "02",
    title: "Build Your Invoice",
    description:
      "A quiet, black-and-white interface. Add items, quantities, and rates. See totals update in real time. Preview a clean, ready-to-share document in one click.",
    icon: DocumentLike,
    color: "#D97706",
    preview: BuilderPreview,
  },
  {
    number: "03",
    title: "Send & Get Paid",
    description:
      "Share via link, email, or WhatsApp. Recipients don't need an account. They open a secure link, review, and pay through mobile money, bank, or crypto.",
    icon: Share,
    color: "#14462a",
    preview: SendPayPreview,
  },
  {
    number: "04",
    title: "Automatic Records",
    description:
      "Every payment generates a timestamped receipt. Your documentation stays organized without manual updates. Finance notes keep context alongside every transaction.",
    icon: ReceiptText,
    color: "#14462a",
    preview: ReceiptPreview,
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
    color: "#14462a",
  },
  {
    heading: "Real-Time Updates",
    copy: "See totals calculate as you type. Preview exactly what your client will see. Every field is clearly spaced and perfectly aligned.",
    bullets: [
      { text: "Live total calculations", icon: Clock },
      { text: "Clean preview mode", icon: Eye },
      { text: "Professional formatting", icon: DocumentLike },
    ],
    color: "#D97706",
  },
  {
    heading: "Automatic Records",
    copy: "Every payment generates a timestamped receipt. Your documentation stays organized without manual updates.",
    bullets: [
      { text: "Instant receipts", icon: DocumentText1 },
      { text: "Payment timeline", icon: Refresh },
      { text: "Verifiable records", icon: TickCircle },
    ],
    color: "#14462a",
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
          {/* Hero + Steps Section - shared background */}
          <section className="relative overflow-hidden">
            {/* Shared background effects */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
              <div
                className="absolute left-1/2 top-[-10%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-100/50 to-transparent blur-3xl"
                style={{ animation: "floatBlob 18s ease-in-out infinite" }}
              />
            </div>
            {/* Fade to white at bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent z-0" />

            {/* Hero content */}
            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-32 text-center" data-animate="fade-up">
              <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                How it Works
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                From draft to receipt in four clear steps.
              </h1>
              <p className="max-w-2xl text-lg leading-7 text-gray-600">
                Each stage reinforces legitimacy and clarity: structure your profile, compose with live feedback, share a frictionless link, and keep contextual records.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <SmartButton size="lg" className="px-8">
                    Start for free
                    <ArrowRight2 size={16} color="#fff" className="ml-2" />
                  </SmartButton>
                </Link>
                <Link href="/contact">
                  <SmartButton size="lg" variant="outline" className="border-gray-200 px-8 text-black transition hover:border-black hover:bg-gray-50">
                    Talk to our team
                  </SmartButton>
                </Link>
              </div>
            </div>

            {/* Steps - inside same section */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24" data-animate="fade-up">
              <div className="grid gap-5 sm:grid-cols-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const bgColors = ['bg-[#14462a]/10', 'bg-amber-50', 'bg-sky-50', 'bg-teal-50'];
                  const iconColors = ['#14462a', '#D97706', '#0284C7', '#14462a'];
                  return (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgColors[index]}`}
                        >
                          <Icon size={20} color={iconColors[index]} variant="Bulk" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-xs leading-relaxed text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Video/Demo Section */}
          <section className="border-t border-gray-100 bg-white py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-gray-500">
                  See it in action
                </Badge>
                <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Professional structure + human context.
                </h2>
                <p className="mx-auto max-w-2xl text-base text-gray-600">
                  Watch how Plaen pairs format, flow, and finance notes so every payment tells a durable story.
                </p>
              </div>

              <div className="mx-auto max-w-4xl">
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-2xl shadow-gray-200/50">
                  <img 
                    src="/home-p.png" 
                    alt="Plaen Dashboard Demo" 
                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14462a] shadow-xl transition group-hover:scale-110">
                      <svg className="h-8 w-8 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-3">
                <div className="group space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14462a]/10 transition group-hover:bg-[#14462a]">
                    <Setting2 size={24} color="#14462a" variant="Bulk" className="transition group-hover:hidden" />
                    <Setting2 size={24} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Built-in Professionalism</h3>
                  <p className="text-sm leading-6 text-gray-600">
                    Operate with clarity and trust. Professional output without needing formal incorporation.
                  </p>
                </div>

                <div className="group space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D97706]/10 transition group-hover:bg-[#D97706]">
                    <Mobile size={24} color="#D97706" variant="Bulk" className="transition group-hover:hidden" />
                    <Mobile size={24} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Frictionless Access</h3>
                  <p className="text-sm leading-6 text-gray-600">
                    Recipients review structured context and pay through local methods with no signup barrier.
                  </p>
                </div>

                <div className="group space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14462a]/10 transition group-hover:bg-[#14462a]">
                    <Share size={24} color="#14462a" variant="Bulk" className="transition group-hover:hidden" />
                    <Share size={24} color="white" variant="Bulk" className="hidden transition group-hover:block" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Context Layers</h3>
                  <p className="text-sm leading-6 text-gray-600">
                    Finance notes, attachments, and payment timelines keep everything auditable and human.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="border-t border-gray-100 bg-gray-50 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="rounded-full border-gray-200 bg-white px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  What makes it work
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Smooth, transparent, and human.
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">
                  Every interaction feels deliberate. From the interface to the payment flow, Plaen removes friction without sacrificing professionalism.
                </p>
              </div>

              <div className="grid gap-16 lg:grid-cols-3">
                {features.map((feature, index) => {
                  return (
                    <div key={feature.heading} className="relative">
                      {/* Vertical accent line */}
                      <div 
                        className="absolute left-0 top-0 h-12 w-1 rounded-full"
                        style={{ backgroundColor: feature.color }}
                      />
                      
                      <div className="pl-6">
                        <h3 className="text-xl font-semibold text-black mb-3">{feature.heading}</h3>
                        <p className="text-sm leading-6 text-gray-600 mb-6">{feature.copy}</p>
                        
                        <ul className="space-y-3">
                          {feature.bullets.map((bullet) => {
                            const BulletIcon = bullet.icon;
                            return (
                              <li 
                                key={bullet.text} 
                                className="flex items-center gap-3 text-sm text-gray-700"
                              >
                                <BulletIcon size={18} color={feature.color} variant="Bulk" />
                                {bullet.text}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 py-24" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="group relative overflow-hidden rounded-3xl bg-[#14462a] p-12 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />
                </div>
                
                <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-lg space-y-4">
                    <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Professional structure for everyone.
                    </h3>
                    <p className="text-base leading-7 text-white/80">
                      Whether you're sending your first invoice or your hundredth, Plaen gives you the workspace to do it with confidence. No formal business required.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link href="/signup">
                        <SmartButton size="lg" className="bg-white text-[#14462a] hover:bg-gray-100">
                          Start for free
                          <ArrowRight2 size={16} color="#14462a" className="ml-2" />
                        </SmartButton>
                      </Link>
                      <Link href="/pricing">
                        <SmartButton size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                          Explore pricing
                        </SmartButton>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 lg:gap-8">
                    <div className="text-center lg:text-right">
                      <p className="text-4xl font-bold tracking-tight">2.6</p>
                      <p className="text-sm text-white/70">Avg. days to payment</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-4xl font-bold tracking-tight">98%</p>
                      <p className="text-sm text-white/70">User satisfaction</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-4xl font-bold tracking-tight">&lt;3min</p>
                      <p className="text-sm text-white/70">To create invoice</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-4xl font-bold tracking-tight">5+</p>
                      <p className="text-sm text-white/70">Currencies supported</p>
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
