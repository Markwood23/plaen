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
  title: {
    default: "Plaen - Structure, made accessible",
    template: "%s | Plaen"
  },
  description: "A clean, modern workspace for financial interactions. Create professional invoices and get paid with mobile money, bank transfers, and crypto.",
  keywords: ["invoicing", "payments", "mobile money", "africa", "freelancer", "business"],
  authors: [{ name: "Plaen Team" }],
  creator: "Plaen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plaen.app",
    title: "Plaen - Structure, made accessible",
    description: "A clean, modern workspace for financial interactions. Create professional invoices and get paid.",
    siteName: "Plaen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plaen - Structure, made accessible",
    description: "A clean, modern workspace for financial interactions. Create professional invoices and get paid.",
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
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
