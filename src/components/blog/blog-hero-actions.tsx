"use client";

import { useState } from "react";
import Link from "next/link";
import { SmartButton } from "@/components/ui/smart-button";
import { BlogSearchModal } from "@/components/blog/blog-search-modal";
import type { BlogPost } from "@/components/blog/blog-article-grid";

interface BlogHeroActionsProps {
  posts: BlogPost[];
}

export function BlogHeroActions({ posts }: BlogHeroActionsProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <SmartButton 
          size="lg" 
          className="px-6"
          onClick={() => setSearchOpen(true)}
        >
          Explore articles
        </SmartButton>
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

      <BlogSearchModal 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        posts={posts} 
      />
    </>
  );
}
