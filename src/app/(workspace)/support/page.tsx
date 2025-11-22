"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  CreditCard,
  Users,
  Settings,
  Shield,
  Zap,
  Clock,
} from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const helpCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    color: "#1877F2",
    articles: [
      { title: "Creating your first invoice", href: "/help/first-invoice", views: "2.4K" },
      { title: "Setting up your account", href: "/help/creating-account", views: "1.8K" },
      { title: "Understanding payment methods", href: "/help/payment-setup", views: "1.5K" },
      { title: "Mobile Money setup guide", href: "/help/mtn-setup", views: "3.2K" },
    ],
  },
  {
    title: "Invoices & Payments",
    icon: FileText,
    color: "#059669",
    articles: [
      { title: "How to create an invoice", href: "/help/invoice-builder", views: "4.1K" },
      { title: "Setting payment terms", href: "/help/payment-terms-guide", views: "2.7K" },
      { title: "Understanding due dates", href: "/help/due-dates", views: "1.9K" },
      { title: "Working with drafts", href: "/help/drafts", views: "1.2K" },
    ],
  },
  {
    title: "Mobile Money",
    icon: Zap,
    color: "#F59E0B",
    articles: [
      { title: "Mobile Money payments", href: "/help/mobile-money", views: "5.3K" },
      { title: "Making Mobile Money faster", href: "/help/mobile-money-faster", views: "2.8K" },
      { title: "MTN Mobile Money setup", href: "/help/mtn-setup", views: "3.2K" },
      { title: "Crypto payments guide", href: "/help/crypto-payments", views: "1.6K" },
    ],
  },
  {
    title: "Account & Settings",
    icon: Settings,
    color: "#7C3AED",
    articles: [
      { title: "Account types explained", href: "/help/account-types", views: "1.4K" },
      { title: "Dual currency invoicing", href: "/help/dual-currency", views: "2.1K" },
      { title: "Bank transfer setup", href: "/help/bank-transfers", views: "1.7K" },
    ],
  },
];

const popularArticles = [
  { title: "Creating your first invoice", href: "/help/first-invoice", views: "2.4K", category: "Getting Started" },
  { title: "Mobile Money payments", href: "/help/mobile-money", views: "5.3K", category: "Payments" },
  { title: "MTN Mobile Money setup", href: "/help/mtn-setup", views: "3.2K", category: "Setup" },
  { title: "How to create an invoice", href: "/help/invoice-builder", views: "4.1K", category: "Invoices" },
  { title: "Setting payment terms", href: "/help/payment-terms-guide", views: "2.7K", category: "Invoices" },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "#2D2D2D" }}>
          How can we help you?
        </h1>
        <p className="text-lg mb-8" style={{ color: "#B0B3B8" }}>
          Search our knowledge base or get in touch with our support team
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5"
            style={{ color: "#B0B3B8" }}
          />
          <Input
            type="text"
            placeholder="Search for help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-14 rounded-full text-base shadow-md"
            style={{
              backgroundColor: "white",
              borderColor: "#E4E6EB",
              color: "#2D2D2D",
            }}
          />
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Chat with our support team",
            action: "Start Chat",
            color: "#1877F2",
            available: true,
          },
          {
            icon: Mail,
            title: "Email Support",
            description: "support@plaen.tech",
            action: "Send Email",
            color: "#059669",
            available: true,
          },
          {
            icon: Phone,
            title: "Phone Support",
            description: "Mon-Fri, 9am-5pm GMT",
            action: "Call Us",
            color: "#7C3AED",
            available: false,
          },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.title}
              className="p-6 cursor-pointer transition-all"
              style={{ paddingTop: '24px', paddingBottom: '24px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}12` }}
                >
                  <Icon className="h-6 w-6" style={{ color: option.color }} />
                </div>
                {option.available && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2.5 py-0.5 text-xs"
                    style={{ backgroundColor: "rgba(5, 150, 105, 0.08)", color: "#059669" }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ backgroundColor: "#059669" }} />
                    Available
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "#2D2D2D" }}>
                {option.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#B0B3B8" }}>
                {option.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full h-9"
                style={{ borderColor: "#E4E6EB" }}
                disabled={!option.available}
              >
                {option.action}
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(245, 158, 11, 0.12)" }}
          >
            <HelpCircle className="h-4 w-4" style={{ color: "#F59E0B" }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: "#2D2D2D" }}>
            Popular Articles
          </h2>
        </div>
        <div className="space-y-0">
          {popularArticles.map((article, index) => (
            <div key={article.href}>
              <a
                href={article.href}
                className="flex items-center justify-between p-5 hover:bg-[#FAFBFC] transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(24, 119, 242, 0.08)" }}
                  >
                    <FileText className="h-5 w-5" style={{ color: "#1877F2" }} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-medium mb-1 group-hover:text-[#1877F2] transition-colors"
                      style={{ color: "#2D2D2D" }}
                    >
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "#B0B3B8" }}>
                      <span>{article.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  style={{ color: "#B0B3B8" }}
                />
              </a>
              {index < popularArticles.length - 1 && (
                <div className="h-px mx-5" style={{ backgroundColor: "#E4E6EB" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#2D2D2D" }}>
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="space-y-4"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}12` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: "#2D2D2D" }}>
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <a
                      key={article.href}
                      href={article.href}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFBFC] transition-colors group"
                    >
                      <span
                        className="text-sm group-hover:text-[#1877F2] transition-colors"
                        style={{ color: "#2D2D2D" }}
                      >
                        {article.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "#B0B3B8" }}>
                          {article.views}
                        </span>
                        <ChevronRight
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "#1877F2" }}
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          backgroundColor: "rgba(24, 119, 242, 0.04)",
          border: "1px solid rgba(24, 119, 242, 0.2)",
        }}
      >
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2D2D2D" }}>
          Still need help?
        </h3>
        <p className="text-sm mb-6" style={{ color: "#B0B3B8" }}>
          Our support team is here to help you with any questions
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            className="rounded-full h-11 px-6"
            style={{ backgroundColor: "#1877F2", color: "white" }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button
            variant="outline"
            className="rounded-full h-11 px-6"
            style={{ borderColor: "#1877F2", color: "#1877F2" }}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View All Guides
          </Button>
        </div>
      </div>
    </div>
  );
}
