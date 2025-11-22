"use client";

import { useEffect } from "react";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";

export function MarketingPageEffects() {
  useRevealAnimation();

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return null;
}
