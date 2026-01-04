import { Suspense } from "react";
import { VerifyEmailContent } from "./verify-email-content";

// Loading fallback component
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#14462a] border-t-transparent rounded-full" />
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
