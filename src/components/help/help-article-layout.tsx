"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SmartButton } from "@/components/ui/smart-button";
import {
  ArrowLeft2,
  ArrowRight2,
  Clock,
  TickCircle,
} from "iconsax-react";

export type RelatedArticle = {
  title: string;
  description: string;
  slug: string;
  readTime: string;
};

export type HelpArticleLayoutProps = {
  title: string;
  description: string;
  category: string;
  categoryColor?: string;
  readTime: string;
  relatedArticles?: RelatedArticle[];
  children: React.ReactNode;
};

export function HelpArticleLayout({
  title,
  description,
  category,
  categoryColor = "#14462a",
  readTime,
  relatedArticles,
  children,
}: HelpArticleLayoutProps) {
  const year = new Date().getFullYear();
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
        </div>

        <main>
          {/* Article Header */}
          <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-6">
                <Breadcrumb
                  items={[
                    { label: "Help Center", href: "/help" },
                    { label: category, href: "/help" },
                    { label: title },
                  ]}
                />
              </div>

              <div className="mb-6">
                <span 
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{ 
                    backgroundColor: `${categoryColor}15`,
                    color: categoryColor 
                  }}
                >
                  {category}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                {title}
              </h1>

              <p className="mb-6 text-xl leading-8 text-gray-600">{description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={16} color="currentColor" variant="Bulk" />
                  {readTime}
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-16">
            <div className="mx-auto max-w-3xl px-6">
              <div 
                className="article-content" 
                data-animate="fade-up"
              >
                {children}
              </div>

              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link href="/help">
                    <SmartButton variant="outline" className="border-gray-200 text-black hover:border-black hover:bg-gray-50">
                      <ArrowLeft2 size={16} color="currentColor" variant="Bulk" className="mr-2" />
                      Back to Help Center
                    </SmartButton>
                  </Link>

                  <Link href="/contact">
                    <SmartButton variant="ghost" className="text-gray-500 hover:text-black">
                      Still need help?
                      <ArrowRight2 size={16} color="currentColor" className="ml-1" />
                    </SmartButton>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section className="border-t border-gray-200 bg-gray-50 py-16" data-animate="fade-up">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedArticles.map((article) => (
                    <Link key={article.slug} href={`/help/${article.slug}`}>
                      <article className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} color="currentColor" variant="Bulk" />
                          {article.readTime}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">
                          {article.title}
                        </h3>
                        <p className="mb-4 text-sm leading-6 text-gray-600">{article.description}</p>
                        <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-black">
                          Read article
                          <ArrowRight2 size={14} color="currentColor" className="ml-1 transition group-hover:translate-x-1" />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="border-t border-gray-200 bg-white py-16" data-animate="fade-up">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                <div className="mb-4 flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-[#14462a]/10 flex items-center justify-center">
                    <TickCircle size={24} color="#14462a" variant="Bulk" />
                  </div>
                </div>
                <h2 className="mb-4 text-2xl font-semibold text-black">
                  Was this article helpful?
                </h2>
                <p className="mb-8 text-lg text-gray-700">
                  Let us know if you found what you were looking for.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <SmartButton size="lg">
                    Yes, it helped
                  </SmartButton>
                  <Link href="/contact">
                    <SmartButton size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                      Contact support
                    </SmartButton>
                  </Link>
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
