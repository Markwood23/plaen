"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Lock1, Sms, TickCircle, ArrowLeft2, Danger } from "iconsax-react";

export default function ForgotPasswordPage() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || 'Failed to send reset link');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MarketingHeader />
      <main className="relative bg-white min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-12 top-0 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
          <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
        </div>
        <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-6 pt-32 pb-20">
          {!submitted ? (
            <>
              <div className="space-y-6 text-center">
                <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  Password Reset
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                    Forgot your password?
                  </h1>
                  <p className="text-base leading-7 text-gray-600">
                    No worries. Enter your email and we'll send you a link to reset it.
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
                {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    <Danger size={18} color="#DC2626" />
                    <span>{error}</span>
                  </div>
                )}
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={loading}
                    />
                  </div>
                  <SmartButton type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                  </SmartButton>
                </form>
                <div className="mt-6 text-center">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition"
                  >
                    <ArrowLeft2 size={14} />
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14462a]/10">
                  <TickCircle size={32} color="#14462a" variant="Bold" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                    Check your email
                  </h1>
                  <p className="text-base leading-7 text-gray-600">
                    We've sent a password reset link to <strong className="text-black">{email}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                    <Sms size={20} color="#14462a" variant="Bulk" className="mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">Didn't receive the email?</p>
                      <p className="mt-1">Check your spam folder, or <button onClick={() => setSubmitted(false)} className="font-medium text-[#14462a] hover:underline">try again</button> with a different email.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition"
                  >
                    <ArrowLeft2 size={14} />
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Lock1 size={14} color="#9CA3AF" variant="Bulk" />
              Secure reset
            </span>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
