"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sms, TickCircle, CloseCircle, RefreshCircle, Danger } from "iconsax-react";
import { SmartButton } from "@/components/ui/smart-button";

// Loading fallback component
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-brand border-t-transparent rounded-full" />
    </div>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const userId = searchParams?.get("userId") || "";
  const name = searchParams?.get("name") || "";
  const token = searchParams?.get("token"); // For link-based verification

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [tokenVerifying, setTokenVerifying] = useState(!!token);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle token-based verification
  useEffect(() => {
    async function verifyToken() {
      if (!token) return;
      
      setTokenVerifying(true);
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        
        if (data.valid) {
          setTokenValid(true);
          setSuccess(true);
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 2000);
        } else {
          setTokenValid(false);
          setError(data.error || "Invalid or expired verification link");
        }
      } catch {
        setTokenValid(false);
        setError("Verification failed. Please try again.");
      } finally {
        setTokenVerifying(false);
      }
    }
    
    if (token) {
      verifyToken();
    }
  }, [token, router]);

  // Start cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Send OTP on initial load (only for OTP flow, not token flow)
  useEffect(() => {
    if (email && !success && !token) {
      sendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = async () => {
    if (cooldown > 0 || !email) return;
    
    setResending(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, userId }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setError(data.error || "Failed to send verification code");
      } else {
        setCooldown(60); // 60 second cooldown
      }
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (digit && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        verifyOTP(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus last filled input or submit if complete
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      
      if (pastedData.length === 6) {
        verifyOTP(pastedData);
      }
    }
  };

  const verifyOTP = async (code: string) => {
    setVerifying(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, userId }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setError(data.error || "Invalid verification code");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2000);
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, start, middle, end) => 
        start + middle.replace(/./g, "•") + end
      )
    : "";

  // Token verification loading state
  if (tokenVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // Token verification failed state
  if (token && tokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Danger size={32} color="#DC2626" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Verification Link
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "This verification link is invalid or has expired."}
            </p>
            <SmartButton 
              className="w-full"
              onClick={() => router.push("/signup")}
            >
              Sign up again
            </SmartButton>
            <div className="mt-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-black transition"
              >
                Already verified? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {success ? (
            // Success state
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TickCircle size={32} color="#16A34A" variant="Bold" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. Redirecting you to login...
              </p>
              <div className="animate-spin w-6 h-6 border-2 border-brand border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            // Verification form
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Icon */}
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sms size={32} color="#14462a" variant="Bold" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Verify your email
              </h1>
              <p className="text-gray-600 text-center mb-8">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-900">{maskedEmail}</span>
              </p>

              {/* OTP Input */}
              <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={verifying || success}
                    className={`
                      w-12 h-14 text-center text-xl font-bold rounded-xl border-2 
                      transition-all duration-200 outline-none
                      ${error 
                        ? "border-red-300 bg-red-50" 
                        : digit 
                          ? "border-brand bg-brand/5" 
                          : "border-gray-200 bg-gray-50"
                      }
                      focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10
                      disabled:opacity-50
                    `}
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-6 justify-center">
                  <CloseCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading indicator */}
              {verifying && (
                <div className="flex items-center gap-2 text-brand text-sm mb-6 justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-brand border-t-transparent rounded-full" />
                  <span>Verifying...</span>
                </div>
              )}

              {/* Resend code */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Didn&apos;t receive the code?
                </p>
                <button
                  onClick={sendOTP}
                  disabled={cooldown > 0 || resending}
                  className={`
                    inline-flex items-center gap-2 text-sm font-medium transition-colors
                    ${cooldown > 0 || resending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-brand hover:text-brand-dark"
                    }
                  `}
                >
                  <RefreshCircle size={16} className={resending ? "animate-spin" : ""} />
                  {cooldown > 0 
                    ? `Resend in ${cooldown}s` 
                    : resending 
                      ? "Sending..." 
                      : "Resend code"
                  }
                </button>
              </div>
            </div>
          )}

          {/* Help text */}
          {!success && (
            <p className="text-center text-gray-500 text-sm mt-6">
              Make sure to check your spam folder if you don&apos;t see the email.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
