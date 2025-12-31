"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
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
  Category2,
  Receipt21,
  People,
  WalletMoney,
  ReceiptText,
  Note,
  Setting2,
  MessageQuestion,
  HambergerMenu,
  Logout,
  Add,
  User,
  SearchNormal1,
  Notification,
  Eye,
  EyeSlash,
  Wallet,
} from "iconsax-react";
import { BalanceVisibilityProvider, useBalanceVisibility } from "@/contexts/balance-visibility-context";
import { signOut } from "@/lib/auth/actions";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

// Balance toggle button component (must be inside the provider)
function BalanceToggleButton() {
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceVisibility();
  
  return (
    <button 
      onClick={toggleBalanceVisibility}
      className="h-10 w-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
      style={{ 
        backgroundColor: isBalanceHidden ? 'rgba(220, 38, 38, 0.08)' : 'rgba(20, 70, 42, 0.06)',
      }}
      aria-label={isBalanceHidden ? "Show balances" : "Hide balances"}
      title={isBalanceHidden ? "Show balances" : "Hide balances"}
    >
      {isBalanceHidden ? (
        <EyeSlash size={20} color="#DC2626" />
      ) : (
        <Eye size={20} color="#14462a" />
      )}
    </button>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = {
    main: [
      { href: "/dashboard", label: "Dashboard", icon: Category2 },
      { href: "/invoices", label: "Invoices", icon: Receipt21 },
      { href: "/contacts", label: "Contacts", icon: People },
      { href: "/payments", label: "Payments", icon: WalletMoney },
      { href: "/receipts", label: "Receipts", icon: ReceiptText },
      { href: "/notes", label: "Finance Notes & Docs", icon: Note },
    ],
    account: [
      { href: "/settings", label: "Settings", icon: Setting2 },
      { href: "/support", label: "Support", icon: MessageQuestion },
    ],
  } as const;

  return (
    <AuthProvider>
      <BalanceVisibilityProvider>
    <div className="min-h-screen bg-white flex overflow-hidden" style={{ color: '#2D2D2D' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white h-screen" style={{ borderRight: '1px solid #E4E6EB' }}>
        <div className="h-16 px-6 flex items-center" style={{ borderBottom: '1px solid #E4E6EB' }}>
          <Link href="/" className="group">
            <Logo size={28} className="transition-transform group-hover:scale-105" />
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-8 overflow-y-auto">
          <div className="mt-6">
            <div className="px-3 pb-2 text-xs uppercase tracking-wider" style={{ color: '#B0B3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
              Main Menu
            </div>
            <div className="space-y-0.5">
              {nav.main.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-all relative overflow-hidden",
                    pathname.startsWith(item.href)
                      ? "shadow-sm"
                      : "hover:bg-[rgba(240,242,245,0.5)]"
                  )}
                  style={
                    pathname.startsWith(item.href)
                      ? { 
                          backgroundColor: 'rgba(20, 70, 42, 0.08)', 
                          color: '#14462a', 
                          fontWeight: 600,
                          borderLeft: '3px solid #14462a'
                        }
                      : { color: '#65676B', fontWeight: 500 }
                  }
                >
                  <item.icon 
                    size={20} 
                    color={pathname.startsWith(item.href) ? '#14462a' : '#65676B'}
                    variant={pathname.startsWith(item.href) ? 'Bold' : 'Linear'}
                    className="shrink-0 transition-transform group-hover:scale-110"
                  />
                  <span className="truncate">{item.label}</span>
                  {!pathname.startsWith(item.href) && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(20, 70, 42, 0.02))' }} />
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="px-3 pb-2 text-xs uppercase tracking-wider" style={{ color: '#B0B3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
              Account
            </div>
            <div className="space-y-0.5">
              {nav.account.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-all relative overflow-hidden",
                    pathname.startsWith(item.href)
                      ? "shadow-sm"
                      : "hover:bg-[rgba(240,242,245,0.5)]"
                  )}
                  style={
                    pathname.startsWith(item.href)
                      ? { 
                          backgroundColor: 'rgba(20, 70, 42, 0.08)', 
                          color: '#14462a', 
                          fontWeight: 600,
                          borderLeft: '3px solid #14462a'
                        }
                      : { color: '#65676B', fontWeight: 500 }
                  }
                >
                  <item.icon 
                    size={20} 
                    color={pathname.startsWith(item.href) ? '#14462a' : '#65676B'}
                    variant={pathname.startsWith(item.href) ? 'Bold' : 'Linear'}
                    className="shrink-0 transition-transform group-hover:scale-110"
                  />
                  <span className="truncate">{item.label}</span>
                  {!pathname.startsWith(item.href) && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(20, 70, 42, 0.02))' }} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid #E4E6EB' }}>
          <div className="text-sm" style={{ color: '#B0B3B8', fontWeight: 500 }}>
            <div className="font-semibold" style={{ color: '#2D2D2D' }}>Plaen Free</div>
            <div className="text-xs">Version 1.0.0</div>
          </div>
          <Link 
            href="/pricing" 
            className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)', color: '#14462a' }}
          >
            Upgrade
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        {/* Topbar */}
        <header className="h-16 flex items-center gap-4 px-6 shrink-0 backdrop-blur-sm" style={{ borderBottom: '1px solid #E4E6EB', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {/* Mobile: menu trigger */}
          <div className="md:hidden">
            <MobileNav nav={nav} pathname={pathname} />
          </div>
          
          {/* Search - more prominent */}
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <SearchNormal1 
                size={18}
                color="#B0B3B8"
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" 
              />
              <Input 
                placeholder="Search invoices, contacts, payments..." 
                className="h-11 pl-11 pr-4 rounded-2xl border-2 transition-all focus:border-[#14462a] focus:shadow-lg" 
                style={{ 
                  backgroundColor: 'rgba(247, 249, 250, 0.8)', 
                  border: '2px solid #E4E6EB',
                  color: '#2D2D2D',
                  fontWeight: 500
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                <kbd className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#B0B3B8' }}>⌘</kbd>
                <kbd className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#B0B3B8' }}>K</kbd>
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Quick Actions */}
            <Link 
              href="/invoices/new"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-base transition-all hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: '#14462a', color: 'white' }}
            >
              <Add size={16} color="white" />
              New Invoice
            </Link>
            
            {/* Notifications */}
            <button 
              className="relative h-10 w-10 rounded-full flex items-center justify-center transition-all hover:bg-[rgba(240,242,245,0.8)] hover:scale-105"
              aria-label="Notifications"
            >
              <Notification size={20} color="#2D2D2D" />
              {/* Notification badge */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: '#EF4444' }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#EF4444' }} />
              </span>
            </button>
            
            {/* Balance Visibility Toggle */}
            <BalanceToggleButton />
            
            <div className="h-8 w-px mx-1" style={{ backgroundColor: '#E4E6EB' }} />
            
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
      </BalanceVisibilityProvider>
    </AuthProvider>
  );
}

function MobileNav({
  nav,
  pathname,
}: {
  nav: {
    main: ReadonlyArray<{ href: string; label: string; icon: any }>;
    account: ReadonlyArray<{ href: string; label: string; icon: any }>;
  };
  pathname: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation"
          className="inline-flex items-center justify-center rounded-xl px-2.5 py-2 transition-all hover:bg-[rgba(240,242,245,0.8)] hover:scale-105"
          style={{ border: '1px solid #E4E6EB' }}
        >
          <HambergerMenu size={20} color="#2D2D2D" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72" style={{ backgroundColor: 'white' }}>
        <div className="h-16 px-5 flex items-center" style={{ borderBottom: '1px solid #E4E6EB' }}>
          <Link href="/" className="group transition-all hover:opacity-80">
            <Logo size={28} className="transition-transform group-hover:scale-105" />
          </Link>
        </div>
        <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
          {[['Main Menu', nav.main], ['Account', nav.account]].map(([label, items]) => (
            <div key={label as string}>
              <div className="px-3 pb-2 text-xs uppercase tracking-wider" style={{ color: '#B0B3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
                {label as string}
              </div>
              <div className="space-y-1">
                {(items as { href: string; label: string; icon: any }[]).map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-all overflow-hidden"
                      style={
                        isActive
                          ? { 
                              backgroundColor: 'rgba(20, 70, 42, 0.08)', 
                              color: '#14462a', 
                              fontWeight: 600,
                              borderLeft: '3px solid #14462a',
                              paddingLeft: '9px',
                              boxShadow: '0 1px 3px rgba(20, 70, 42, 0.1)'
                            }
                          : { color: '#65676B', fontWeight: 500 }
                      }
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(24,119,242,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <item.icon size={20} className="shrink-0 relative z-10 transition-transform group-hover:scale-110" />
                      <span className="truncate relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu() {
  const { user, profile } = useAuth();
  const email = profile?.email || user?.email || '';
  const displayName = profile?.full_name || profile?.business_name || user?.user_metadata?.full_name || email || 'Account';
  const initials = (displayName || email || 'PL')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full focus-visible:ring-ring/50 focus-visible:ring-[3px]">
          <Avatar>
            <AvatarFallback>{initials || 'PL'}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <DropdownMenuLabel className="px-3 py-2">
          <div className="text-xs" style={{ color: '#65676B' }}>Signed in as</div>
          <div className="font-medium" style={{ color: '#2D2D2D' }}>{displayName}</div>
          {email && (
            <div className="text-xs" style={{ color: '#B0B3B8' }}>{email}</div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
          <Link href="/profile" className="flex items-center">
            <div 
              className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
            >
              <User size={16} color="#14462a" />
            </div>
            <span className="text-base font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
          <Link href="/billing" className="flex items-center">
            <div 
              className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
            >
              <Wallet size={16} color="#0D9488" />
            </div>
            <span className="text-base font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Billing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-3 rounded-xl p-3 cursor-pointer group transition-all hover:bg-[rgba(20,70,42,0.06)]">
          <Link href="/settings" className="flex items-center">
            <div 
              className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(20, 70, 42, 0.08)' }}
            >
              <Setting2 size={16} color="#14462a" />
            </div>
            <span className="text-base font-medium group-hover:text-[#14462a] transition-all" style={{ color: '#2D2D2D' }}>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem asChild className="rounded-xl p-0 cursor-pointer group transition-all hover:bg-red-50">
          <form action={signOut} className="w-full">
            <button type="submit" className="w-full flex items-center gap-3 rounded-xl p-3">
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
              >
                <Logout size={16} color="#DC2626" />
              </div>
              <span className="text-base font-medium group-hover:text-red-600 transition-all" style={{ color: '#DC2626' }}>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
