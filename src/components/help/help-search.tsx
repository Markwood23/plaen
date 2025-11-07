"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type HelpArticleSummary = {
  title: string;
  slug: string;
  category: string;
  readTime?: string;
  description?: string;
  isPopular?: boolean;
};

interface HelpSearchProps {
  articles: HelpArticleSummary[];
}

export function HelpSearch({ articles }: HelpSearchProps) {
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    return articles
      .filter((article) => {
        const haystack = `${article.title} ${article.category} ${article.description ?? ""}`.toLowerCase();
        return haystack.includes(trimmed);
      })
      .slice(0, 6);
  }, [articles, query]);

  return (
  <div className="relative z-20 mx-auto w-full max-w-lg text-left">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for help articles..."
        className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
        aria-label="Search help articles"
      />

      {query.trim().length > 0 && (
  <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 space-y-2 rounded-3xl border border-gray-200 bg-white p-4 text-left shadow-[0_16px_40px_rgba(15,15,15,0.08)]">
          {filteredArticles.length === 0 ? (
            <p className="text-sm text-gray-500">No articles match “{query.trim()}”.</p>
          ) : (
            filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/help/${article.slug}`}
                className="flex items-start justify-between gap-3 rounded-2xl border border-transparent px-3 py-2 text-sm transition hover:border-gray-200 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-black">{article.title}</p>
                  <p className="text-xs text-gray-500">
                    {article.category}
                    {article.readTime ? ` • ${article.readTime}` : ""}
                    {article.isPopular ? " • Popular" : ""}
                  </p>
                  {article.description && (
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{article.description}</p>
                  )}
                </div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-gray-400">Open</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
