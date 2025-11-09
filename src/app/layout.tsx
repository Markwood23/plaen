import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Interface font - Inter as specified in Plaen brand document
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Brand font - Aeonik (using system fallback for development)
// TODO: Replace with actual Aeonik font files for production
// For now using geometric sans fallback that matches Aeonik's characteristics
// const aeonik = localFont({
//   src: "./fonts/aeonik.woff2",
//   variable: "--font-aeonik",
// });

export const metadata: Metadata = {
  metadataBase: new URL("https://plaen.app"),
  title: {
    default: "Plaen | Process money with context",
    template: "%s | Plaen",
  },
  description:
    "Process money with context. Official by Design invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
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
      "Official by Design invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
    siteName: "Plaen",
  },
  twitter: {
    card: "summary_large_image",
  title: "Plaen | Process money with context",
    description:
      "Official by Design invoicing, frictionless paylinks, tamper‑evident receipts, and Finance Notes & Docs.",
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
      <body
        className={`${inter.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
