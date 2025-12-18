"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft2, ArrowRight2, Calendar } from "iconsax-react";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags?: string[];
  featured?: boolean;
  image?: string;
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
    setCurrentPage(1);
  }, [orderedPosts]);

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
            <h2 className="text-2xl font-semibold text-[#14462a]">Latest research and tutorials</h2>
            <p className="max-w-2xl text-sm leading-6 text-gray-600 mt-2">
              Fresh perspectives on offer-based billing, currency management, and the systems founders use to keep receivables predictable.
            </p>
          </div>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#14462a] transition">
            See platform features →
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-[#14462a]/30 hover:shadow-lg">
                <div className="relative aspect-[3/2] bg-gradient-to-br from-[#14462a]/5 to-[#14462a]/15">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                    {post.category}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 text-xs text-gray-600 backdrop-blur-sm">
                    <Calendar size={12} color="#6B7280" variant="Bold" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-lg font-semibold text-black group-hover:text-[#14462a] transition">{post.title}</h3>
                  <p className="flex-1 text-sm leading-6 text-gray-600 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span className="text-[#14462a] font-medium">{post.readTime}</span>
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
                  : "border-gray-200 text-gray-600 hover:border-[#14462a] hover:text-[#14462a]"
              }`}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ArrowLeft2 size={16} color="currentColor" />
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-9 w-9 rounded-full border text-sm font-medium transition ${
                  pageNumber === safePage
                    ? "border-[#14462a] bg-[#14462a] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#14462a] hover:text-[#14462a]"
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
                  : "border-gray-200 text-gray-600 hover:border-[#14462a] hover:text-[#14462a]"
              }`}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ArrowRight2 size={16} color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
