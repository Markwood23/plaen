"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { marketingNavItems } from "@/lib/marketing-nav";

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight" onClick={closeMobile}>
          plæn.
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          {marketingNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${isActive ? "text-black" : "hover:text-black"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost" className="text-sm text-gray-600 hover:bg-gray-50 hover:text-black">
              Sign in
            </Button>
          </Link>
          <Link href="/signup" className="hidden md:inline-flex">
            <Button className="bg-black text-white transition hover:bg-gray-900">
              Get started
            </Button>
          </Link>
          <button
            type="button"
            onClick={toggleMobile}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition hover:border-black hover:text-black md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed left-0 right-0 top-[73px] bottom-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={closeMobile}
          />
          
          {/* Dropdown Menu */}
          <div className="fixed left-0 right-0 top-[73px] z-50 mx-4 md:hidden">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,15,15,0.12)]">
              <nav className="space-y-1 p-2">
                {marketingNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      pathname === item.href
                        ? "bg-gray-100 text-black"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="space-y-2 border-t border-gray-100 p-3">
                <Link href="/login" onClick={closeMobile}>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm text-gray-600 hover:bg-gray-50 hover:text-black"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobile}>
                  <Button className="w-full bg-black text-sm text-white hover:bg-gray-900">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
