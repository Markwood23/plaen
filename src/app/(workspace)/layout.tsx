"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Files,
  Users,
  CreditCard,
  Wallet,
  Bell,
  Settings,
  ShieldCheck,
  Search,
  BarChart3,
  GraduationCap,
} from "lucide-react";

const navGroups = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/invoices", label: "Invoices", icon: Files, comingSoon: true },
      { href: "/clients", label: "Clients", icon: Users, comingSoon: true },
      { href: "/payouts", label: "Payouts", icon: Wallet, comingSoon: true },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3, comingSoon: true },
      { href: "/templates", label: "Templates", icon: GraduationCap, comingSoon: true },
      { href: "/reminders", label: "Reminders", icon: Bell, comingSoon: true },
      { href: "/documentation", label: "Documentation", icon: Files, comingSoon: true },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/settings", label: "Settings", icon: Settings, comingSoon: true },
      { href: "/admin", label: "Admin Workspace", icon: ShieldCheck, comingSoon: true },
    ],
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const flattenedNav = useMemo(
    () => navGroups.flatMap((group) => group.items.map((item) => item.href)),
    []
  );

  const isWorkspaceRoute = flattenedNav.some((href) => pathname?.startsWith(href));

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-gray-50 px-6 py-8 lg:flex lg:flex-col">
        <div>
          <div className="mb-10">
            <Link href="/dashboard" className="text-2xl font-medium text-black">
              plæn.
            </Link>
            <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
              Structure, made accessible.
            </p>
          </div>

          <nav className="space-y-10">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                  {group.title}
                </p>
                <ul className="space-y-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-sm transition",
                            active
                              ? "border-black bg-black text-white"
                              : "text-gray-700 hover:border-gray-200 hover:bg-white"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </span>
                          {item.comingSoon && !active && (
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                              Soon
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-8">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-black">Need a quick tour?</p>
            <p className="mt-1 text-xs text-gray-500">
              Explore the spec modules while we wire live services.
            </p>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search invoices, clients, activity..."
                  className="w-72 border-gray-200 pl-10"
                />
              </div>
              <span className="text-sm text-gray-500 sm:hidden">
                Welcome back to Plaen.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-black">Mark Duah</p>
                <p className="text-xs text-gray-500">Business workspace</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                MD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          {isWorkspaceRoute ? (
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
