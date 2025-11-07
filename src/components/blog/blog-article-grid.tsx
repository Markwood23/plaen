"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
};

interface BlogArticleGridProps {
  orderedPosts: BlogPost[];
  pageSize?: number;
}

function computePaginationBoundaries(totalItems: number, pageSize: number, currentPage: number) {
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(1, Math.ceil(totalItems / pageSize)));
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = (safePage - 1) * pageSize + Math.min(pageSize, Math.max(totalItems - (safePage - 1) * pageSize, 0));

  return { safePage, startIndex, endIndex };
}

export function BlogArticleGrid({ orderedPosts, pageSize = 3 }: BlogArticleGridProps) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(orderedPosts.length / pageSize)), [orderedPosts.length, pageSize]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const { safePage, startIndex, endIndex } = useMemo(
    () => computePaginationBoundaries(orderedPosts.length, pageSize, currentPage),
    [orderedPosts.length, pageSize, currentPage]
  );

  useEffect(() => {
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const paginatedPosts = useMemo(
    () => orderedPosts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [orderedPosts, safePage, pageSize]
  );

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  return (
    <section className="border-t border-gray-200 bg-white py-20" data-animate="fade-up">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black">Latest research and tutorials</h2>
            <p className="max-w-2xl text-sm leading-6 text-gray-600">
              Fresh perspectives on offer-based billing, currency management, and the systems founders use to keep receivables predictable.
            </p>
          </div>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-black">
            See platform features
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 transition hover:-translate-y-1 hover:border-black/30">
                <div className="relative aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-gray-500">
                    {post.category}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-lg font-semibold text-black group-hover:text-gray-700">{post.title}</h3>
                  <p className="flex-1 text-sm leading-6 text-gray-700 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-5 text-sm text-gray-600">
          <span>
            {orderedPosts.length === 0
              ? "No stories yet"
              : `Showing ${startIndex}-${endIndex} of ${orderedPosts.length} stories`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${
                safePage === 1
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
                  : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
              }`}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-9 w-9 rounded-full border text-sm font-medium transition ${
                  pageNumber === safePage
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                }`}
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition ${
                safePage === totalPages
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
                  : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
              }`}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
