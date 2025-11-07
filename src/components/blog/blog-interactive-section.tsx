"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogArticleGrid, type BlogPost } from "@/components/blog/blog-article-grid";
import {
  BookOpen,
  Filter,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface BlogInteractiveSectionProps {
  categories: Category[];
  orderedPosts: BlogPost[];
  primaryFeatured?: BlogPost;
  secondaryFeatured: BlogPost[];
  trendingPosts: BlogPost[];
}

const readTimeOptions: Array<{ label: string; value: number | null }> = [
  { label: "Any", value: null },
  { label: "≤ 5 min", value: 5 },
  { label: "≤ 7 min", value: 7 },
  { label: "≤ 10 min", value: 10 },
];

export function BlogInteractiveSection({
  categories,
  orderedPosts,
  primaryFeatured,
  secondaryFeatured,
  trendingPosts,
}: BlogInteractiveSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.slug ?? "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [maxReadTime, setMaxReadTime] = useState<number | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const advancedWrapperRef = useRef<HTMLDivElement | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === "all") {
      return null;
    }

    return (
      categories.find((category) => category.slug === selectedCategory)?.name ?? null
    );
  }, [categories, selectedCategory]);

  const filteredPosts = useMemo(() => {
    return orderedPosts
      .filter((post) => {
        const matchesCategory =
          !selectedCategoryName || post.category === selectedCategoryName;

        const haystack = [
          post.title,
          post.excerpt,
          post.author,
          post.category,
          post.tags?.join(" ") ?? "",
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

        const minutes = Number.parseInt(post.readTime, 10);
        const matchesReadTime =
          maxReadTime == null || !Number.isFinite(minutes) || minutes <= maxReadTime;

        return matchesCategory && matchesQuery && matchesReadTime;
      })
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();

        return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
      });
  }, [
    maxReadTime,
    normalizedQuery,
    orderedPosts,
    selectedCategoryName,
    sortOrder,
  ]);

  const advancedFiltersActive = sortOrder !== "desc" || maxReadTime !== null;
  const isFiltering = normalizedQuery.length > 0 || selectedCategory !== "all" || advancedFiltersActive;

  useEffect(() => {
    if (!advancedOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        advancedWrapperRef.current &&
        !advancedWrapperRef.current.contains(event.target as Node)
      ) {
        setAdvancedOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [advancedOpen]);

  return (
    <>
      {/* Filters */}
      <section className="relative z-30 border-y border-gray-200 bg-white/80" data-animate="fade-up">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = selectedCategory === category.slug;

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-xs text-gray-500">{category.count}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative flex-1 sm:min-w-[320px]">
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-full border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 focus:border-black focus:ring-black"
                  aria-label="Search articles"
                />
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative" ref={advancedWrapperRef}>
                <Button
                  variant="outline"
                  className={`inline-flex items-center gap-2 rounded-full border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 transition hover:border-black hover:text-black ${
                    advancedFiltersActive ? "border-black text-black" : ""
                  }`}
                  onClick={() => setAdvancedOpen((previous) => !previous)}
                  aria-expanded={advancedOpen}
                  aria-haspopup="dialog"
                >
                  <Filter className="h-4 w-4" />
                  Advanced filters
                </Button>

                {advancedOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 space-y-4 rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_16px_40px_rgba(15,15,15,0.08)]">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Sort by</p>
                      <div className="flex gap-2">
                        {([
                          { label: "Newest", value: "desc" },
                          { label: "Oldest", value: "asc" },
                        ] as const).map((option) => {
                          const isSelected = sortOrder === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setSortOrder(option.value)}
                              className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Max read time</p>
                      <div className="flex flex-wrap gap-2">
                        {readTimeOptions.map((option) => {
                          const isSelected = maxReadTime === option.value;
                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => setMaxReadTime(option.value)}
                              className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isFiltering && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">
                {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortOrder("desc");
                  setMaxReadTime(null);
                }}
                className="text-xs text-gray-500 hover:text-black underline"
              >
                Clear all filters
              </button>
            </div>
          )}
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
                    <span>{secondaryFeatured[0]?.author ?? primaryFeatured?.author}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>
                      {secondaryFeatured[0]
                        ? new Date(secondaryFeatured[0].date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : primaryFeatured
                        ? new Date(primaryFeatured.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : null}
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
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-semibold text-black group-hover:text-gray-700">
                        {post.title}
                      </h3>
                      <p className="text-sm leading-6 text-gray-700 line-clamp-3">
                        {post.excerpt}
                      </p>
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
                      <h4 className="text-sm font-semibold text-black group-hover:text-gray-700">
                        {post.title}
                      </h4>
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

      <BlogArticleGrid orderedPosts={filteredPosts} pageSize={3} />
    </>
  );
}
