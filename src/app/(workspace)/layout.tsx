"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Receipt,
  Users,
  CreditCard,
  FileText,
  Inbox,
  PieChart,
  Layers,
  User,
  Settings,
  Headphones,
  Menu,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardIcon } from "@/components/icons/dashboard-icon";
import { InvoiceIcon } from "@/components/icons/invoice-icon";
import { ContactsIcon } from "@/components/icons/contacts-icon";
import { PaymentsIcon } from "@/components/icons/payments-icon";
import { NotesIcon } from "@/components/icons/notes-icon";
import { InboxIcon } from "@/components/icons/inbox-icon";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = {
    main: [
      { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { href: "/invoices", label: "Invoices", icon: InvoiceIcon },
      { href: "/coming-soon", label: "Contacts", icon: ContactsIcon },
      { href: "/payments", label: "Payments", icon: PaymentsIcon },
      { href: "/coming-soon", label: "Notes", icon: NotesIcon },
      { href: "/coming-soon", label: "Inbox", icon: InboxIcon },
    ],
    business: [
      { href: "/coming-soon", label: "Reports", icon: PieChart },
      { href: "/coming-soon", label: "Teams", icon: Layers },
    ],
    account: [
      { href: "/coming-soon", label: "Profile", icon: User },
      { href: "/coming-soon", label: "Settings", icon: Settings },
      { href: "/coming-soon", label: "Support", icon: Headphones },
    ],
  } as const;

  return (
    <div className="min-h-screen bg-white text-[#212121] flex overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[#EBECE7] bg-white h-screen">
        <div className="h-14 px-4 flex items-center border-b border-[#EBECE7]">
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H12V12H3V3Z" fill="currentColor"/>
              <path d="M14 3H21L17.5 12H14V3Z" fill="currentColor"/>
              <path d="M12 14H21V21H12V14Z" fill="currentColor"/>
            </svg>
            <span className="font-semibold tracking-tight">Plaen</span>
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-10 overflow-y-auto">
          <div className="mt-8">
            <div className="px-3 pb-3 text-[10px] font-medium uppercase tracking-wide text-[#949494]">
              Main Menu
            </div>
            <div className="space-y-1">
              {nav.main.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-[#F9F9F9] text-gray-900"
                      : "hover:bg-gray-100 text-[#949494]"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="px-3 pb-3 text-[10px] font-medium uppercase tracking-wide text-[#949494]">
              Business
            </div>
            <div className="space-y-1">
              {nav.business.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-[#F9F9F9] text-gray-900"
                      : "hover:bg-gray-100 text-[#949494]"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="px-3 pb-3 text-[10px] font-medium uppercase tracking-wide text-[#949494]">
              Account
            </div>
            <div className="space-y-1">
              {nav.account.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-[#F9F9F9] text-gray-900"
                      : "hover:bg-gray-100 text-[#949494]"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-[#EBECE7] text-xs text-[#949494]">v0</div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        {/* Topbar */}
        <header className="h-14 border-b border-[#EBECE7] flex items-center gap-3 px-4 shrink-0">
          {/* Mobile: menu trigger */}
          <div className="md:hidden">
            <MobileNav nav={nav} pathname={pathname} />
          </div>
          {/* Brand on mobile, section on desktop */}
          <div className="font-medium md:font-semibold">
            <span className="md:hidden">Plaen</span>
            <span className="hidden md:inline">Workspace</span>
          </div>
          {/* Search (md+) */}
          <div className="hidden md:flex ml-4 w-full max-w-md">
            <Input placeholder="Search invoices, customers…" className="h-9" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({
  nav,
  pathname,
}: {
  nav: {
    main: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
    business: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
    account: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
  };
  pathname: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation"
          className="inline-flex items-center justify-center rounded-md border border-[#EBECE7] px-2.5 py-2 hover:bg-gray-50"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="h-14 px-4 flex items-center border-b border-[#EBECE7]">
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H12V12H3V3Z" fill="currentColor"/>
              <path d="M14 3H21L17.5 12H14V3Z" fill="currentColor"/>
              <path d="M12 14H21V21H12V14Z" fill="currentColor"/>
            </svg>
            <span className="font-semibold tracking-tight">Plaen</span>
          </Link>
        </div>
        <nav className="p-2 space-y-6">
          {[['Main Menu', nav.main], ['Business', nav.business], ['Account', nav.account]].map(([label, items]) => (
            <div key={label as string}>
              <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-wide text-[#949494]">
                {label as string}
              </div>
              <div className="space-y-1">
                {(items as { href: string; label: string; icon: LucideIcon }[]).map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                      pathname.startsWith(item.href)
                        ? "bg-[#F9F9F9] text-gray-900"
                        : "hover:bg-gray-100 text-[#949494]"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full focus-visible:ring-ring/50 focus-visible:ring-[3px]">
          <Avatar>
            <AvatarImage alt="User" src="/avatar.png" />
            <AvatarFallback>PL</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Signed in as
          <div className="font-medium">you@plaen.app</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/coming-soon">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/coming-soon">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/coming-soon">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
