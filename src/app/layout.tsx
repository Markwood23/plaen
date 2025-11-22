import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// Interface font - Plus Jakarta Sans for UI/dashboard
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Display font - Outfit for marketing/headers
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plaen.app"),
  title: {
    default: "Plaen | Process money with context",
    template: "%s | Plaen",
  },
  description:
    "Process money with context. Clean invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
  keywords: [
    "invoicing",
    "payments",
    "mobile money",
    "africa",
    "official by design",
    "finance notes",
    "paylinks",
  ],
  authors: [{ name: "Plaen Team" }],
  creator: "Plaen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plaen.app",
  title: "Plaen | Process money with context",
    description:
  "Clean invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
    siteName: "Plaen",
  },
  twitter: {
    card: "summary_large_image",
  title: "Plaen | Process money with context",
    description:
  "Clean invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
    creator: "@plaenapp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${outfit.variable} antialiased overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
