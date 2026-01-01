"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Lock1, Notification, Danger, TickCircle } from "iconsax-react";
import { signIn } from "@/lib/auth/actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";
  const urlError = searchParams.get("error");
  const [error, setError] = useState<string | null>(() => {
    if (urlError === "invalid_link") return "Invalid or expired link. Please try again.";
    if (urlError === "verification_failed") return "Verification failed. Please try again or request a new link.";
    return null;
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn(formData);
      
      // If we get here without redirect, there was an error
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      // Redirect happened (success) or unexpected error
      // signIn redirects on success, so this may not execute
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
      {verified && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          <TickCircle size={18} color="#16A34A" variant="Bold" />
          <span>Email verified successfully! You can now log in.</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <Danger size={18} color="#DC2626" />
          <span>{error}</span>
        </div>
      )}
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-[#14462a] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Enter your password" 
            required 
            disabled={loading}
          />
        </div>
        <SmartButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </SmartButton>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-black underline underline-offset-4 hover:text-gray-700">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

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
        <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-6 pt-32 pb-20">
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

          <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-3xl bg-gray-100" />}>
            <LoginForm />
          </Suspense>

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
