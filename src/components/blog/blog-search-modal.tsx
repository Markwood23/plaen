"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { SearchNormal1, Clock, Book1, ArrowRight2, CloseCircle } from "iconsax-react";
import type { BlogPost } from "@/components/blog/blog-article-grid";

interface BlogSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: BlogPost[];
}

export function BlogSearchModal({ open, onOpenChange, posts }: BlogSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      // Show recent posts when no query
      return posts.slice(0, 5);
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.excerpt,
        post.author,
        post.category,
        post.tags?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    }).slice(0, 8);
  }, [normalizedQuery, posts]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [onOpenChange]
  );

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to allow dialog animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
    }
  }, [open]);

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-full max-w-4xl gap-0 overflow-hidden rounded-2xl border-gray-200 bg-white p-0 shadow-2xl sm:max-w-4xl"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Search articles</DialogTitle>
        </VisuallyHidden>
        
        {/* Search Header */}
        <div className="border-b border-gray-100 p-4">
          <div className="relative">
            <SearchNormal1 
              size={20} 
              color="#9CA3AF" 
              className="absolute left-4 top-1/2 -translate-y-1/2" 
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search articles by title, topic, or author..."
              className="h-12 w-full rounded-xl border-0 bg-gray-50 pl-12 pr-12 text-base text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#14462a]/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <CloseCircle size={18} variant="Bold" />
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">ESC</kbd>
              to close
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">⌘K</kbd>
              to open
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[480px] overflow-y-auto">
          {filteredPosts.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                {normalizedQuery ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""}` : "Recent articles"}
              </p>
              <div className="space-y-1">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    onClick={() => onOpenChange(false)}
                  >
                    <article className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50">
                      {/* Icon */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#14462a]/5 group-hover:bg-[#14462a]/10 transition-colors">
                        <Book1 size={18} color="#14462a" variant="Bulk" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#14462a] transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                          {post.excerpt}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-[#14462a]" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={10} />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight2 
                        size={16} 
                        color="#9CA3AF" 
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-2" 
                      />
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <SearchNormal1 size={24} color="#9CA3AF" />
              </div>
              <h4 className="mt-4 text-sm font-medium text-gray-900">No articles found</h4>
              <p className="mt-1 text-xs text-gray-500">
                Try searching for a different term or browse all articles below.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {posts.length} articles available
            </p>
            <Link 
              href="#articles" 
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#14462a] hover:underline"
            >
              Browse all articles
              <ArrowRight2 size={12} />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
