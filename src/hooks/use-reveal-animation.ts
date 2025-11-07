"use client";

import { useEffect } from "react";

export function useRevealAnimation(options?: IntersectionObserverInit) {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );

    elements.forEach((el) => {
      el.classList.add("reveal-hidden");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [options]);
}
