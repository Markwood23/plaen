import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home2, ArrowLeft2 } from "iconsax-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-[#14462a]">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight text-black">
          Page not found
        </h2>
        <p className="text-base text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/dashboard">
            <Button size="lg">
              <Home2 size={16} color="currentColor" variant="Bulk" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              <ArrowLeft2 size={16} color="currentColor" variant="Bulk" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
