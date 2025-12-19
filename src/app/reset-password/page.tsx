"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { Lock1, TickCircle, Eye, EyeSlash, ShieldTick } from "iconsax-react";

export default function ResetPasswordPage() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
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

    // In production, this would call an API to reset password
    setSubmitted(true);
  };

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
              Reset Password
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                Create new password
              </h1>
              <p className="text-base leading-7 text-gray-600">
                Enter a new password for your Plaen account.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div className="space-y-2 rounded-xl bg-gray-50 p-3">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <TickCircle 
                      size={14} 
                      color={req.met ? "#14462a" : "#9CA3AF"} 
                      variant={req.met ? "Bold" : "Linear"} 
                    />
                    <span className={req.met ? "text-gray-900" : "text-gray-500"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
                {passwordsMatch && (
                  <p className="flex items-center gap-1 text-xs text-[#14462a]">
                    <TickCircle size={12} variant="Bold" />
                    Passwords match
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <SmartButton 
                type="submit" 
                className="w-full"
                disabled={!allRequirementsMet || !passwordsMatch}
              >
                Reset password
              </SmartButton>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldTick size={14} color="#9CA3AF" variant="Bulk" />
              Encrypted & secure
            </span>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
