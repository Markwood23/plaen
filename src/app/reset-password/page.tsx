"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { TickCircle, Eye, EyeSlash, ShieldTick, Danger } from "iconsax-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setValidating(false);
        setError("No reset token provided. Please request a new password reset link.");
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const result = await response.json();
        
        if (result.valid) {
          setTokenValid(true);
        } else {
          setError(result.error || "Invalid or expired reset link. Please request a new one.");
        }
      } catch {
        setError("Failed to validate reset link. Please try again.");
      } finally {
        setValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to reset password");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const year = new Date().getFullYear();

  // Loading state
  if (validating) {
    return (
      <>
        <MarketingHeader />
        <main className="relative bg-white min-h-screen">
          <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-6 pt-32 pb-20">
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 animate-pulse">
                <ShieldTick size={32} color="#9CA3AF" />
              </div>
              <p className="text-base text-gray-600">Validating reset link...</p>
            </div>
          </div>
        </main>
        <MarketingFooter year={year} />
      </>
    );
  }

  // Invalid token state
  if (!tokenValid && !submitted) {
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <Danger size={32} color="#DC2626" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Invalid Reset Link
                </h1>
                <p className="text-base leading-7 text-gray-600">
                  {error}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
              <SmartButton 
                className="w-full"
                onClick={() => router.push("/forgot-password")}
              >
                Request new reset link
              </SmartButton>
              <div className="mt-4 text-center">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-black transition"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <MarketingFooter year={year} />
      </>
    );
  }

  // Success state
  if (submitted) {
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14462a]/10">
                <TickCircle size={32} color="#14462a" variant="Bold" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Password reset successful
                </h1>
                <p className="text-base leading-7 text-gray-600">
                  Your password has been updated. You can now log in with your new password.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
              <SmartButton 
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Continue to login
              </SmartButton>
            </div>
          </div>
        </main>
        <MarketingFooter year={year} />
      </>
    );
  }

  // Form state
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
              New Password
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Reset your password
              </h1>
              <p className="text-base leading-7 text-gray-600">
                Enter your new password below
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
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => (
                    <div 
                      key={req.label} 
                      className={`flex items-center gap-2 text-xs ${req.met ? "text-green-600" : "text-gray-400"}`}
                    >
                      <TickCircle size={14} variant={req.met ? "Bold" : "Linear"} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                    <TickCircle size={14} variant={passwordsMatch ? "Bold" : "Linear"} />
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>

              <SmartButton 
                type="submit" 
                className="w-full" 
                disabled={!allRequirementsMet || !passwordsMatch || loading}
              >
                {loading ? "Resetting..." : "Reset password"}
              </SmartButton>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldTick size={14} color="#9CA3AF" variant="Bulk" />
              Secure connection
            </span>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
