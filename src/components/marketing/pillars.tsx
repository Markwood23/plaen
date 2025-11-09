import { BadgeCheck, NotebookPen, ScrollText, Share2, Globe2, LayoutDashboard } from "lucide-react";
import { IconFrame } from "@/components/ui/icon-frame";

import type { LucideIcon } from "lucide-react";

type Pillar = {
  title: string;
  copy: string;
  icon: LucideIcon;
};

const pillars: Pillar[] = [
  {
    title: "Money + Meaning",
    copy:
      "Every send/receive carries who/what/why. Clean, verifiable records you can share, search, and trust.",
    icon: ScrollText,
  },
  {
    title: "Built-in Professionalism",
    copy:
      "Clean, trustworthy output (layout, hierarchy, monochrome focus) without needing a registered company.",
    icon: BadgeCheck,
  },
  {
    title: "Frictionless to Share & Pay",
    copy:
      "Share via WhatsApp or email. Recipients don’t need accounts; links open to focused, secure pages.",
    icon: Share2,
  },
  {
    title: "Africa‑first rails, global taste",
    copy:
      "Works with cash, Mobile Money, bank, card via partners—and a document‑only mode when you just need the record.",
    icon: Globe2,
  },
  {
    title: "Finance OS on top",
    copy:
      "Once structured, Plaen surfaces cashflow, categories, budgets, and Finance Notes & Docs for narrative reporting.",
    icon: LayoutDashboard,
  },
];

export function Pillars({ heading = "The product narrative", subtle = false }: { heading?: string; subtle?: boolean }) {
  // Define layout spans for a more editorial asymmetric feel on large screens
  const spans = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-5", "lg:col-span-6", "lg:col-span-6"];
  return (
    <section className={`${subtle ? "bg-white/70" : "bg-gray-50"} border-t border-gray-100 py-24`} data-animate="fade-up">
      <div className="mx-auto max-w-7xl space-y-14 px-6">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500 shadow-sm">
            Narrative pillars
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            {heading}
          </h2>
          <p className="text-pretty max-w-xl text-sm leading-6 text-gray-600">
            We bundle structure + context into five foundations that evolve into your Finance OS.
          </p>
        </div>

        {/* Grid */}
        <div className="grid auto-rows-[1fr] gap-7 sm:grid-cols-2 lg:grid-cols-12">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-[0_16px_60px_rgba(15,15,15,0.06)] backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-black/70 hover:shadow-[0_28px_100px_rgba(15,15,15,0.12)] ${spans[i]}`}
              >
                {/* Hover ambient */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -right-16 top-12 h-40 w-40 rounded-full bg-gradient-to-br from-black/10 to-gray-600/40 blur-3xl" />
                </div>

                <div className="relative mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconFrame icon={Icon} size="md" variant="subtle" className="transition group-hover:bg-black group-hover:border-black group-hover:text-white" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500">Pillar {`0${i + 1}`}</span>
                      <h3 className="mt-1 text-base font-semibold text-black">{p.title}</h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-gray-500 shadow-sm">
                    Core
                  </span>
                </div>

                <p className="relative z-10 mt-2 line-clamp-5 text-sm leading-6 text-gray-600">
                  {p.copy}
                </p>

                {/* Bottom accent bar */}
                <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-black via-gray-700 to-gray-500 transition-all duration-700 group-hover:w-full"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
