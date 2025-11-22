import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { IconFrame } from "@/components/ui/icon-frame";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Building2, CheckCircle2, CreditCard, Shield } from "lucide-react";

const benefits = [
  { label: "Dual-currency invoice builder", icon: BadgeCheck },
  { label: "Finance Notes & Docs", icon: Shield },
  { label: "Accounts Receivable aging", icon: CreditCard },
];

export default function SignupPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <main className="relative bg-white min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
          <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              Sign up
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Create your Plaen workspace.
              </h1>
              <p className="text-lg leading-7 text-gray-600">
                Official invoices, Finance Notes, receipts, and payment links that payers trust. Start in minutes; no card required.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {benefits.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2">
                  <IconFrame icon={Icon} size="sm" variant="subtle" />
                  {label}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" /> Personal and Business profiles live side-by-side so you can issue the right invoice for each project.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8">
            <form className="space-y-6" action="#" method="post">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Ama Mensah" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="you@plaen.tech" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace name</Label>
                <Input id="workspace" placeholder="Studio Plaen" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="At least 8 characters" required />
              </div>
              <SmartButton type="submit" className="w-full">
                Create account
              </SmartButton>
            </form>
            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-black underline underline-offset-4 hover:text-gray-700">
                Log in
              </Link>
            </p>
            <div className="mt-8 space-y-2 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#059669]" /> No card required
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#1877F2]" /> SOC2-ready infrastructure
              </p>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
