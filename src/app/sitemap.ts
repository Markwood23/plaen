import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL("https://plaen.app");
  const pages = [
    "/",
    "/about",
    "/blog",
    "/contact",
    "/help",
    "/how-it-works",
    "/pricing",
    "/privacy",
    "/terms",
    "/testimonials",
  ];

  const now = new Date().toISOString();

  return pages.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
