"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { TickCircle, Lock1, ShieldTick, Mobile } from "iconsax-react";

const reasons = [
  "Dual-currency invoice builder with context notes",
  "Mobile money, bank, and USD payouts from one link",
  "Finance Notes & Docs with tamper-evident receipts",
];

const features = [
  { label: "Personal + Business profiles", icon: ShieldTick, color: "#0D9488" },
  { label: "Secure payment links", icon: Lock1, color: "#4F46E5" },
  { label: "Instant notifications", icon: Mobile, color: "#D97706" },
];

export default function SignupPage() {
  const year = new Date().getFullYear();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

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
              Get started free
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                Create your Plaen workspace.
              </h1>
              <p className="text-lg leading-7 text-gray-600">
                Official invoices, Finance Notes, receipts, and payment links that payers trust. Start in minutes; no card required.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-2">
                  <TickCircle size={16} color="#059669" variant="Bold" />
                  {reason}
                </li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map(({ label, icon: Icon, color }) => (
                <div key={label} className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:border-gray-200 hover:bg-white hover:shadow-lg">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}12` }}
                  >
                    <Icon size={20} color={color} variant="Bulk" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-gray-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Ama Mensah" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="you@company.com" required />
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
                Create free account
              </SmartButton>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-black underline underline-offset-4 hover:text-gray-700">
                Log in
              </Link>
            </p>
            <div className="mt-8 space-y-2 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <p className="flex items-center gap-2">
                <TickCircle size={16} color="#059669" variant="Bold" /> No credit card required
              </p>
              <p className="flex items-center gap-2">
                <ShieldTick size={16} color="#0D9488" variant="Bold" /> SOC2-ready infrastructure
              </p>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
