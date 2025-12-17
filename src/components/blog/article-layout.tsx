"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  Clock,
  Share2,
} from "lucide-react";

export type RelatedPost = {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
};

export type ArticleLayoutProps = {
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  hero?: React.ReactNode;
  relatedPosts?: RelatedPost[];
  children: React.ReactNode;
};

export function ArticleLayout({
  title,
  description,
  category,
  author,
  date,
  readTime,
  tags,
  hero,
  relatedPosts,
  children,
}: ArticleLayoutProps) {
  const year = new Date().getFullYear();
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <MarketingHeader />
      <div className="relative min-h-screen bg-white text-black">
        <main>
          <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-6">
                <Breadcrumb
                  items={[
                    { label: "Blog", href: "/blog" },
                    { label: title },
                  ]}
                />
              </div>

              <div className="mb-8">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                  {category}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                {title}
              </h1>

              <p className="mb-8 text-xl leading-8 text-gray-600">{description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <span className="font-medium text-black">{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                    <BookmarkPlus className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="mx-auto max-w-3xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline" data-animate="fade-up">
                {hero ?? (
                  <div className="mb-10 aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="flex h-full items-center justify-center">
                      <div className="rounded-lg bg-white/80 p-6 text-sm text-gray-600">
                        Article illustration coming soon
                      </div>
                    </div>
                  </div>
                )}
                {children}
              </div>

              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link href="/blog">
                    <Button variant="outline" className="border-gray-200 text-black hover:border-black hover:bg-gray-50">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Blog
                    </Button>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>Tags:</span>
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {relatedPosts && relatedPosts.length > 0 && (
            <section className="border-t border-gray-200 bg-gray-50 py-16" data-animate="fade-up">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <article className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">
                        <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="flex h-full items-center justify-center">
                            <div className="rounded-lg bg-white/80 p-3 text-sm text-gray-600">
                              {post.category}
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="mb-2">
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              {post.category}
                            </span>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-black group-hover:text-gray-700">
                            {post.title}
                          </h3>
                          <p className="text-sm leading-5 text-gray-600">{post.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}
