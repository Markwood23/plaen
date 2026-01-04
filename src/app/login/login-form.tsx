"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Danger, TickCircle } from "iconsax-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verified = searchParams.get("verified") === "true";
  const redirectTo = searchParams.get("redirect") || "/dashboard";
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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Use API route for login - this captures IP/user-agent for security alerts
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Set session on client-side Supabase
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      });

      // Redirect to dashboard
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
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
