"use client";

import { useEffect } from "react";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";

type PageEffectsProps = {
  resetScroll?: boolean;
  handleHashScroll?: boolean;
};

export function PageEffects({ resetScroll = false, handleHashScroll = false }: PageEffectsProps = {}) {
  useRevealAnimation();

  useEffect(() => {
    if (handleHashScroll) {
      const { hash } = window.location;

      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
        return;
      }
    }

    if (resetScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [handleHashScroll, resetScroll]);

  return null;
}

export function HomePageEffects() {
  return <PageEffects resetScroll handleHashScroll />;
}
