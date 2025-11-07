import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogArticleGrid, type BlogPost } from "@/components/blog/blog-article-grid";

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
    icon: Users,
  },
  {
    label: "Guides published",
    value: "190+",
    description: "Deep dives on invoicing best practices",
    icon: BookOpen,
  },
  {
    label: "Average read time",
    value: "6 min",
    description: "Bite-sized insights you can act on",
    icon: Clock,
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
          {/* Hero */}
          <section data-animate="fade-up" className="mx-auto max-w-6xl px-6 pb-24 pt-20">
            <div className="grid items-center gap-16 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  <BookOpen className="h-3 w-3" />
                  Weekly Insights
                </div>
                <div className="space-y-6">
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Build smarter billing workflows
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-gray-700">
                    Actionable essays, playbooks, and founder stories on invoicing, payments, and keeping cash flow predictable. Every article is built for African teams running modern businesses.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full bg-black px-6 text-white hover:bg-gray-900">
                    Explore articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-gray-300 bg-white px-6 text-gray-700 hover:border-black hover:text-black"
                  >
                    Download invoicing guide
                  </Button>
                </div>
                <div className="grid gap-6 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.07)] backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="flex flex-col gap-3 border-gray-100">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-100/60">
                          <Icon className="h-5 w-5 text-gray-700" />
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
                          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}
            </div>
          </section>

          {/* Filters */}
          <section className="border-y border-gray-200 bg-white/80" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6 py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <span
                      key={category.slug}
                      className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                        category.slug === "all"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-xs text-gray-500">{category.count}</span>
                    </span>
                  ))}
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                  <div className="relative flex-1 sm:min-w-[320px]">
                    <Input
                      placeholder="Search articles..."
                      className="w-full rounded-full border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 focus:border-black focus:ring-black"
                    />
                    <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                  <Button
                    variant="outline"
                    className="inline-flex items-center gap-2 rounded-full border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 hover:border-black hover:text-black"
                  >
                    <Filter className="h-4 w-4" />
                    Advanced filters
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Featured + Trending */}
          <section className="bg-gray-50 py-20" data-animate="fade-up">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-black">Spotlight stories</h2>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-black">
                    Pitch a story
                  </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-[0_20px_70px_rgba(15,15,15,0.08)]">
                  <div className="grid gap-0 md:grid-cols-2">
                    <div className="relative flex h-full flex-col justify-between gap-6 p-10">
                      <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          Editors pick
                        </span>
                        <h3 className="text-2xl font-semibold leading-tight text-black">
                          {secondaryFeatured[0]?.title ?? primaryFeatured?.title}
                        </h3>
                        <p className="text-base leading-7 text-gray-700">
                          {secondaryFeatured[0]?.excerpt ?? primaryFeatured?.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{secondaryFeatured[0]?.readTime ?? primaryFeatured?.readTime}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                        <span>
                          {secondaryFeatured[0]?.author ?? primaryFeatured?.author}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                        <span>
                          {secondaryFeatured[0]
                            ? new Date(secondaryFeatured[0].date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : primaryFeatured &&
                              new Date(primaryFeatured.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                        </span>
                      </div>
                    </div>
                    <div className="relative hidden min-h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 md:block">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.08),transparent_65%)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-lg backdrop-blur-sm">
                          <Zap className="h-10 w-10 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {secondaryFeatured.slice(1, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <article className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-[0_16px_50px_rgba(15,15,15,0.06)] transition hover:-translate-y-1 hover:border-black/30">
                        <div className="space-y-3">
                          <span className="text-xs uppercase tracking-[0.3em] text-gray-500">{post.category}</span>
                          <h3 className="text-xl font-semibold text-black group-hover:text-gray-700">{post.title}</h3>
                          <p className="text-sm leading-6 text-gray-700 line-clamp-3">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.author}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Trending now</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Updated daily</span>
                </div>
                <div className="space-y-4">
                  {trendingPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <article className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-black/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                          <BookOpen className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <h4 className="text-sm font-semibold text-black group-hover:text-gray-700">{post.title}</h4>
                          <p className="text-xs leading-5 text-gray-600 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-500">
                            <span>{post.category}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <BlogArticleGrid orderedPosts={orderedPosts} pageSize={3} />

          {/* Newsletter */}
          <section className="border-t border-gray-200 bg-white py-20" data-animate="fade-up">
            <div className="mx-auto max-w-5xl px-6">
              <div className="grid gap-10 rounded-3xl border border-gray-200 bg-gray-50/80 p-12 shadow-[0_24px_90px_rgba(15,15,15,0.08)] backdrop-blur-sm md:grid-cols-[1.4fr,1fr]">
                <div className="space-y-6">
                  <span className="text-xs uppercase tracking-[0.35em] text-gray-500">newsletter</span>
                  <h2 className="text-3xl font-semibold text-black">Stay ahead with Plaen research</h2>
                  <p className="text-base leading-7 text-gray-700">
                    Join operators receiving our monthly field notes on pricing incentives, receivables automation, and how scaling teams stay liquid.
                  </p>
                  <ul className="space-y-3 text-sm leading-6 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                      Templates and scripts straight from Plaen advisors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                      Currency and policy updates relevant to Ghanaian founders
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                      Zero spam, one email each month
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    className="rounded-xl border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-black focus:ring-black"
                  />
                  <Button className="rounded-xl bg-black py-3 text-white hover:bg-gray-900">
                    Subscribe now
                  </Button>
                  <p className="text-xs text-gray-500">You can unsubscribe at any time.</p>
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