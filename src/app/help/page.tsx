import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { HelpSearch, type HelpArticleSummary } from "@/components/help/help-search";
import {
  Book1,
  DocumentText,
  Card,
  Setting2,
  MessageQuestion,
  ArrowRight2,
  ArrowRight3,
  User,
  Mobile,
} from "iconsax-react";

const categories = [
  {
    name: "Getting Started",
    icon: Book1,
    description: "Set up your account and create your first invoice",
    color: "#14462a",
    articles: [
      { title: "Creating your Plaen account", slug: "creating-account", readTime: "2 min" },
      { title: "Personal vs Business setup", slug: "account-types", readTime: "3 min" },
      { title: "Setting up payment methods", slug: "payment-setup", readTime: "4 min" },
      { title: "Your first invoice", slug: "first-invoice", readTime: "5 min" },
    ]
  },
  {
    name: "Creating Invoices",
    icon: DocumentText,
    description: "Everything about building professional invoices",
    color: "#14462a",
    articles: [
      { title: "Invoice builder walkthrough", slug: "invoice-builder", readTime: "6 min" },
      { title: "Adding items and calculating totals", slug: "items-totals", readTime: "3 min" },
      { title: "Setting due dates and terms", slug: "due-dates", readTime: "2 min" },
      { title: "Dual currency invoicing", slug: "dual-currency", readTime: "4 min" },
      { title: "Saving and managing drafts", slug: "drafts", readTime: "3 min" },
    ]
  },
  {
    name: "Payments & Processing",
    icon: Card,
    description: "How payments work and managing transactions",
    color: "#D97706",
    articles: [
      { title: "Mobile money payments", slug: "mobile-money", readTime: "5 min" },
      { title: "Bank transfer setup", slug: "bank-transfers", readTime: "4 min" },
      { title: "Cryptocurrency payments", slug: "crypto-payments", readTime: "6 min" },
      { title: "Payment confirmations and receipts", slug: "receipts", readTime: "3 min" },
      { title: "Handling payment issues", slug: "payment-issues", readTime: "5 min" },
    ]
  },
  {
    name: "Account Settings",
    icon: Setting2,
    description: "Manage your profile and preferences",
    color: "#6B7280",
    articles: [
      { title: "Updating your profile", slug: "update-profile", readTime: "2 min" },
      { title: "Company branding and logo", slug: "branding", readTime: "4 min" },
      { title: "Tax settings and compliance", slug: "tax-settings", readTime: "5 min" },
      { title: "Currency preferences", slug: "currency-settings", readTime: "2 min" },
    ]
  }
];

const popularArticles = [
  {
    title: "How to get paid faster with mobile money",
    description: "Learn why mobile money payments are processed faster than traditional methods",
    category: "Payments",
    categoryColor: "#D97706",
    readTime: "5 min",
    slug: "mobile-money-faster",
    popular: true
  },
  {
    title: "Creating professional invoices as a freelancer",
    description: "Best practices for freelancers to create invoices that look professional",
    category: "Getting Started",
    categoryColor: "#14462a",
    readTime: "7 min",
    slug: "freelancer-invoices",
    popular: true
  },
  {
    title: "Understanding dual currency invoicing",
    description: "When and how to use GHS and USD on the same invoice",
    category: "Creating Invoices",
    categoryColor: "#14462a",
    readTime: "4 min",
    slug: "dual-currency-guide",
    popular: true
  },
  {
    title: "Setting up MTN Mobile Money for business",
    description: "Step-by-step guide to accepting MTN Mobile Money payments",
    category: "Payments",
    categoryColor: "#D97706",
    readTime: "6 min",
    slug: "mtn-setup",
    popular: true
  }
];

const helpArticles: HelpArticleSummary[] = (() => {
  const map = new Map<string, HelpArticleSummary>();

  popularArticles.forEach((article) => {
    map.set(article.slug, {
      title: article.title,
      slug: article.slug,
      category: article.category,
      readTime: article.readTime,
      description: article.description,
      isPopular: article.popular,
    });
  });

  categories.forEach((category) => {
    category.articles.forEach((article) => {
      const existing = map.get(article.slug);
      const merged: HelpArticleSummary = {
        title: article.title,
        slug: article.slug,
        category: category.name,
        readTime: article.readTime,
        description: existing?.description,
        isPopular: existing?.isPopular,
      };
      map.set(article.slug, merged);
    });
  });

  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
})();

export default function HelpPage() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Default SEO from layout applies; Help content uses narrative-aligned headings */}
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.14),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
        </div>

        <main>
          {/* Hero Section */}
          <section
            data-animate="fade-up"
            className="relative z-30 mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-32 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              <MessageQuestion size={16} color="#6B7280" variant="Bulk" /> Help Center
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
              Support for structure + context.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-700">
              Explore guides on building official invoices, attaching finance notes, and enabling frictionless payments so every transaction retains its meaning.
            </p>

            <HelpSearch articles={helpArticles} />
          </section>

          {/* Quick Actions */}
          <section className="relative z-10 border-t border-gray-200 bg-white/80 py-12" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Link href="/help/getting-started">
                  <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-6 shadow-[0_8px_30px_rgba(15,15,15,0.06)] transition hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_16px_40px_rgba(15,15,15,0.1)]">
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -right-8 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-xl" />
                    </div>
                      <div className="relative mb-4 h-10 w-10 rounded-full bg-[#14462a]/10 border border-[#14462a]/20 flex items-center justify-center transition group-hover:bg-[#14462a] group-hover:border-[#14462a] group-hover:scale-105">
                        <User size={20} color="#14462a" variant="Bulk" className="group-hover:hidden" />
                        <User size={20} color="white" variant="Bulk" className="hidden group-hover:block" />
                      </div>
                    <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">I'm new to Plaen</h3>
                    <p className="mb-4 flex-1 text-sm text-gray-700 leading-relaxed">Get started with account setup and your first invoice</p>
                    {/* Progress visualization */}
                    <div className="mb-4 flex gap-1">
                      {[1, 2, 3, 4].map((step, i) => (
                        <div key={step} className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-700 group-hover:w-full"
                            style={{ width: i === 0 ? '100%' : '0%' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-700">
                      Start here <ArrowRight2 size={16} color="currentColor" className="ml-1 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>

                <Link href="/help/payments">
                  <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-6 shadow-[0_8px_30px_rgba(15,15,15,0.06)] transition hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_16px_40px_rgba(15,15,15,0.1)]">
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -right-8 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-xl" />
                    </div>
                    <div className="relative mb-4 h-10 w-10 rounded-full bg-[#14462a]/10 border border-[#14462a]/20 flex items-center justify-center transition group-hover:bg-[#14462a] group-hover:border-[#14462a] group-hover:scale-105">
                      <Mobile size={20} color="#14462a" variant="Bulk" className="group-hover:hidden" />
                      <Mobile size={20} color="white" variant="Bulk" className="hidden group-hover:block" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">Payment questions</h3>
                    <p className="mb-4 flex-1 text-sm text-gray-700 leading-relaxed">Learn about mobile money, bank transfers, and crypto</p>
                    {/* Payment method indicators */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="h-6 w-6 rounded-full bg-[#FFCC00] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-black">MM</div>
                        <div className="h-6 w-6 rounded-full bg-[#14462a] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white">BK</div>
                        <div className="h-6 w-6 rounded-full bg-[#F7931A] border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white">₿</div>
                      </div>
                      <span className="text-xs text-gray-500">3 payment methods</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-700">
                      Explore payments <ArrowRight2 size={16} color="currentColor" className="ml-1 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>

                <Link href="/contact">
                  <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 p-6 shadow-[0_8px_30px_rgba(15,15,15,0.06)] transition hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_16px_40px_rgba(15,15,15,0.1)]">
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -right-8 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-xl" />
                    </div>
                    <div className="relative mb-4 h-10 w-10 rounded-full bg-[#14462a]/10 border border-[#14462a]/20 flex items-center justify-center transition group-hover:bg-[#14462a] group-hover:border-[#14462a] group-hover:scale-105">
                      <MessageQuestion size={20} color="#14462a" variant="Bulk" className="group-hover:hidden" />
                      <MessageQuestion size={20} color="white" variant="Bulk" className="hidden group-hover:block" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">Still need help?</h3>
                    <p className="mb-4 flex-1 text-sm text-gray-700 leading-relaxed">Contact our support team directly</p>
                    {/* Response time indicator */}
                    <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-[#14462a] animate-pulse" />
                        <span>Online now</span>
                      </div>
                      <div className="h-3 w-px bg-gray-300" />
                      <span>&lt; 2h response</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-700">
                      Get support <ArrowRight2 size={16} color="currentColor" className="ml-1 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Removed pillars to avoid repetition; help content focuses on execution of the narrative */}

          {/* Popular Articles */}
          <section className="bg-white py-16" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">Popular articles</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {popularArticles.map((article) => (
                  <Link key={article.slug} href={`/help/${article.slug}`}>
                    <article className="group flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                      <div className="mb-3 flex items-center gap-3">
                        <span 
                          className="rounded-full px-3 py-1 text-xs font-medium"
                          style={{ 
                            backgroundColor: `${article.categoryColor}15`,
                            color: article.categoryColor 
                          }}
                        >
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">
                        {article.title}
                      </h3>
                      <p className="mb-4 flex-1 text-sm text-gray-700">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Read article</span>
                        <ArrowRight2 size={16} color="#9CA3AF" className="transition group-hover:translate-x-1 group-hover:text-black" />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* All Categories */}
          <section className="border-t border-gray-200 bg-gray-50 py-16" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">Browse by category</h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_16px_60px_rgba(15,15,15,0.05)]">
                      <div className="mb-6 flex items-center gap-4">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          <Icon size={20} color={category.color} variant="Bulk" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-black">{category.name}</h3>
                          <p className="text-sm text-gray-700">{category.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {category.articles.map((article) => (
                          <li key={article.slug}>
                            <Link href={`/help/${article.slug}`}>
                              <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-gray-300 hover:bg-white hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                  <ArrowRight3 size={16} color="#9CA3AF" className="transition group-hover:translate-x-1 group-hover:text-black" />
                                  <span className="text-sm font-medium text-black group-hover:text-gray-700">
                                    {article.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">{article.readTime}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="border-t border-gray-200 bg-white py-16" data-animate="fade-up">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                <h2 className="mb-4 text-2xl font-semibold text-black">
                  Need deeper narrative context?
                </h2>
                <p className="mb-8 text-lg text-gray-700">
                  Ask us how to apply Money + Meaning and Finance Notes to your workflow. We’ll guide structure without friction.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <SmartButton size="lg">
                      Contact support
                    </SmartButton>
                  </Link>
                  <Link href="/how-it-works">
                    <SmartButton size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                      See product tour
                    </SmartButton>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}