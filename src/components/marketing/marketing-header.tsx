"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { HambergerMenu, CloseCircle, ArrowRight2 } from "iconsax-react";
import { marketingNavItems } from "@/lib/marketing-nav";

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      {/* Floating Pill Container */}
      <div 
        className={`mx-auto max-w-4xl transition-all duration-500 ${
          scrolled 
            ? "rounded-full border border-gray-200/80 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5" 
            : "rounded-full border border-transparent bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <Link href="/" className="group" onClick={closeMobile}>
            <Logo size={28} className="transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden items-center gap-1 lg:flex absolute left-1/2 -translate-x-1/2">
            {marketingNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-all ${
                    isActive 
                      ? "text-[#14462a]" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#14462a]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 rounded-full px-4">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#14462a] text-sm font-medium text-white hover:bg-[#0d3420] rounded-full px-4">
                Get started
                <ArrowRight2 size={14} color="#ffffff" className="ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobile}
            className="inline-flex items-center justify-center rounded-full bg-gray-100/80 p-2 text-gray-700 transition-all hover:bg-gray-200/80 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <CloseCircle size={20} color="#14462a" variant="Bold" />
            ) : (
              <HambergerMenu size={20} color="#374151" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
          
          {/* Dropdown Menu */}
          <div className="fixed left-4 right-4 top-20 z-50 lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl">
              <nav className="p-2">
                {marketingNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#14462a]/5 text-[#14462a]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                      <ArrowRight2 size={16} color={isActive ? "#14462a" : "#9CA3AF"} />
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 border-t border-gray-100 p-3">
                <Link href="/login" onClick={closeMobile} className="flex-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobile} className="flex-1">
                  <Button className="w-full bg-[#14462a] text-sm font-medium text-white hover:bg-[#0d3420] rounded-xl">
                    Get started
                    <ArrowRight2 size={14} color="#ffffff" className="ml-1" />
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
