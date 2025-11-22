import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { IconFrame } from "@/components/ui/icon-frame";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Mail, Shield, Smartphone } from "lucide-react";

const reasons = [
  "Invoice builder with dual currency + context notes",
  "Mobile money, bank, and USD payouts from one link",
  "Finance Notes & Docs with tamper-evident receipts",
];

const access = [
  { label: "Personal + Business profiles", icon: Shield },
  { label: "Secure link sharing", icon: Lock },
  { label: "Instant payment notifications", icon: Smartphone },
];

export default function LoginPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <main className="relative bg-white min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-12 top-0 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
          <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              Log in
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Continue in the Plaen workspace.
              </h1>
              <p className="text-lg leading-7 text-gray-600">
                Access the calm surface where invoices, AR aging, payments, and Finance Notes live together.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  {reason}
                </li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-3">
              {access.map(({ label, icon: Icon }) => (
                <div key={label} className="group rounded-2xl p-5 transition-all hover:bg-gray-50">
                  <IconFrame icon={Icon} size="sm" variant="subtle" />
                  <p className="mt-3 text-xs font-medium text-gray-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8">
            <form className="space-y-6" action="#" method="post">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@plaen.tech" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/help/account-types" className="text-xs font-medium text-[#1877F2] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="Enter password" required />
              </div>
              <SmartButton type="submit" className="w-full">
                Log in
              </SmartButton>
            </form>
            <p className="mt-6 text-sm text-gray-600">
              Need an account?{" "}
              <Link href="/signup" className="font-medium text-black underline underline-offset-4 hover:text-gray-700">
                Create Plaen account
              </Link>
            </p>
            <div className="mt-8 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" /> We send a reminder when a payer views, pays, or needs a nudge.
              </p>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
