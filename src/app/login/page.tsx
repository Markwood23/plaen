"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Lock1, Notification } from "iconsax-react";

export default function LoginPage() {
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
          <div className="absolute left-12 top-0 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
          <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
        </div>
        <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-6 py-20">
          <div className="space-y-6 text-center">
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              Welcome back
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Log in to Plaen
              </h1>
              <p className="text-base leading-7 text-gray-600">
                Access your invoices, payments, and Finance Notes.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/help/account-types" className="text-xs font-medium text-[#14462a] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="Enter your password" required />
              </div>
              <SmartButton type="submit" className="w-full">
                Log in
              </SmartButton>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-black underline underline-offset-4 hover:text-gray-700">
                Sign up free
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Lock1 size={14} color="#9CA3AF" variant="Bulk" />
              Secure login
            </span>
            <span className="flex items-center gap-1.5">
              <Notification size={14} color="#9CA3AF" variant="Bulk" />
              Payment alerts
            </span>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
