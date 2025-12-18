import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { Book1, People, Clock, ArrowRight2 } from "iconsax-react";
import type { BlogPost } from "@/components/blog/blog-article-grid";
import { BlogInteractiveSection } from "@/components/blog/blog-interactive-section";

const categories = [
  { name: "All", slug: "all", count: 12 },
  { name: "Invoicing", slug: "invoicing", count: 5 },
  { name: "Payments", slug: "payments", count: 3 },
  { name: "Business Tips", slug: "business", count: 4 },
];

const stats = [
  {
    label: "Monthly readers",
    value: "24k",
    description: "Leaders and operators across Africa",
    icon: People,
    color: "#B45309",
  },
  {
    label: "Guides published",
    value: "190+",
    description: "Deep dives on invoicing best practices",
    icon: Book1,
    color: "#0D9488",
  },
  {
    label: "Average read time",
    value: "6 min",
    description: "Bite-sized insights you can act on",
    icon: Clock,
    color: "#D97706",
  },
];

const blogPosts = [
  {
    id: "mobile-money-africa",
    title: "The Rise of Mobile Money in African Business",
    excerpt: "How mobile money is transforming the way businesses get paid across Africa, and why traditional invoicing tools are falling behind.",
    author: "Plaen Team",
    date: "2024-11-01",
    category: "Payments",
    readTime: "5 min read",
    featured: true,
    image: "/blog/mobile-money.jpg",
    tags: ["Mobile Money", "Africa", "Payments"],
  },
  {
    id: "freelancer-invoice-guide",
    title: "The Complete Guide to Professional Freelance Invoicing",
    excerpt: "Everything freelancers need to know about creating professional invoices that get paid faster.",
    author: "Sarah Johnson",
    date: "2024-10-28",
    category: "Invoicing",
    readTime: "8 min read",
    featured: true,
    image: "/blog/freelance-guide.jpg",
    tags: ["Freelancing", "Invoicing", "Tips"],
  },
  {
    id: "payment-methods-comparison",
    title: "Bank Transfer vs Mobile Money vs Crypto: Which is Best?",
    excerpt: "A comprehensive comparison of payment methods available to African businesses and freelancers.",
    author: "David Mensah",
    date: "2024-10-25",
    category: "Payments",
    readTime: "6 min read",
    featured: false,
    image: "/blog/payment-comparison.jpg",
    tags: ["Payments", "Comparison", "Business"],
  },
  {
    id: "invoice-design-psychology",
    title: "The Psychology of Invoice Design: Why Clean Matters",
    excerpt: "How the visual design of your invoices affects payment behavior and what you can do about it.",
    author: "Ama Osei",
    date: "2024-10-22",
    category: "Business Tips",
    readTime: "4 min read",
    featured: false,
    image: "/blog/design-psychology.jpg",
    tags: ["Design", "Psychology", "Business"],
  },
  {
    id: "ghs-usd-invoicing",
    title: "Dual Currency Invoicing: GHS and USD Best Practices",
    excerpt: "How to handle multi-currency invoicing in Ghana and when to offer dual currency options.",
    author: "Kwame Asante",
    date: "2024-10-20",
    category: "Invoicing",
    readTime: "7 min read",
    featured: false,
    image: "/blog/dual-currency.jpg",
    tags: ["Currency", "Ghana", "Invoicing"],
  },
  {
    id: "payment-terms-guide",
    title: "Setting Payment Terms That Actually Work",
    excerpt: "The art and science of choosing payment terms that protect your cash flow without scaring away clients.",
    author: "Plaen Team",
    date: "2024-10-18",
    category: "Business Tips",
    readTime: "5 min read",
    featured: false,
    image: "/blog/payment-terms.jpg",
    tags: ["Payment Terms", "Cash Flow", "Business"],
  },
];

export default function BlogPage() {
  const year = new Date().getFullYear();
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);
  const primaryFeatured = featuredPosts[0];
  const secondaryFeatured = featuredPosts.slice(1);
  const orderedPosts: BlogPost[] = [...regularPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const trendingPosts = orderedPosts.slice(0, 3);

  return (
    <>
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
          {/* SEO: Blog narrative coverage handled via layout defaults; consider dynamic OG image per post in future */}
          {/* Hero */}
          <section data-animate="fade-up" className="mx-auto max-w-6xl px-6 pb-24 pt-32">
            <div className="grid items-center gap-16 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  <Book1 size={14} color="#0D9488" variant="Bold" /> Weekly insights
                </div>
                <div className="space-y-6">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                    Field notes on making transfers official.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-gray-700">
                    Essays and guides covering Money + Meaning, frictionless paylinks, Africa-first rails, tamper-evident receipts, and using Finance Notes & Docs to build a durable finance memory.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="#articles">
                    <SmartButton size="lg" className="px-6">
                      Explore articles
                    </SmartButton>
                  </Link>
                  <Link href="/blog/freelancer-invoice-guide">
                    <SmartButton
                      size="lg"
                      variant="outline"
                      className="border-gray-300 bg-white px-6 text-gray-700 hover:border-black hover:text-black"
                    >
                      Download invoicing guide
                    </SmartButton>
                  </Link>
                </div>
                <div className="grid gap-6 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.07)] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="flex flex-col gap-3 border-gray-100">
                        <div 
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${stat.color}12` }}
                        >
                          <Icon size={20} color={stat.color} variant="Bulk" />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-semibold text-black">{stat.value}</p>
                          <p className="text-sm leading-6 text-gray-600">{stat.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {primaryFeatured && (
                <Link href={`/blog/${primaryFeatured.id}`}>
                  <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition hover:-translate-y-2 hover:border-black/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.1),transparent_70%)] opacity-60" />
                    <div className="relative flex h-full flex-col justify-between gap-10 p-12">
                      <div className="flex flex-col gap-4">
                        <span className="self-start rounded-full border border-gray-200 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
                          {primaryFeatured.category}
                        </span>
                        <h3 className="text-3xl font-semibold leading-tight text-black group-hover:text-gray-700">
                          {primaryFeatured.title}
                        </h3>
                        <p className="text-base leading-7 text-gray-700">
                          {primaryFeatured.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200" />
                          <div>
                            <p className="font-medium text-gray-700">{primaryFeatured.author}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(primaryFeatured.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 group-hover:border-black group-hover:text-black">
                          Read story
                          <ArrowRight2 size={12} color="currentColor" className="transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}
            </div>
          </section>

          <section id="articles">
            <BlogInteractiveSection
              categories={categories}
              orderedPosts={orderedPosts}
              primaryFeatured={primaryFeatured}
              secondaryFeatured={secondaryFeatured}
              trendingPosts={trendingPosts}
            />
          </section>

          {/* Removed pillars here to avoid duplication; blog content itself expresses the narrative */}

          {/* Newsletter */}
          <section className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white py-24" data-animate="fade-up">
            <div className="mx-auto max-w-5xl px-6">
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_90px_rgba(15,15,15,0.06)]">
                <div className="grid md:grid-cols-[1.4fr,1fr]">
                  <div className="p-10 md:p-12 space-y-6">
                    <span className="inline-flex items-center rounded-full bg-[#14462a]/10 px-4 py-1.5 text-xs font-medium text-[#14462a]">
                      Newsletter
                    </span>
                    <h2 className="text-3xl font-semibold text-[#14462a]">Monthly context delivery</h2>
                    <p className="text-base leading-7 text-gray-600">
                      One calm email: practical tactics for documented transfers, on‑time rate improvements, and evolving Finance Notes into narrative reports.
                    </p>
                    <ul className="space-y-3 text-sm leading-6 text-gray-600">
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#14462a]" />
                        Playbooks for attaching meaning to everyday transfers
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#14462a]" />
                        On‑time rate tactics and paylink conversion insights
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#14462a]" />
                        Zero spam. One email. Durable value.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center bg-gradient-to-br from-[#14462a]/5 to-[#14462a]/10 p-10 md:p-12">
                    <form className="flex flex-col gap-4" action="#" method="post">
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        className="rounded-xl border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-[#14462a] focus:ring-[#14462a]"
                        required
                      />
                      <Button type="submit" className="rounded-xl py-3 text-white">
                        Subscribe now
                      </Button>
                      <p className="text-xs text-gray-500 text-center">You can unsubscribe at any time.</p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}