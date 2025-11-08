import { BadgeCheck, NotebookPen, ScrollText, Share2, Globe2, LayoutDashboard } from "lucide-react";

type Pillar = {
  title: string;
  copy: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const pillars: Pillar[] = [
  {
    title: "Money + Meaning",
    copy:
      "Every send/receive carries who/what/why. Clean, verifiable records you can share, search, and trust.",
    icon: ScrollText,
  },
  {
    title: "Official by Design",
    copy:
      "Receipts feel precise and trustworthy—calm UI, black/white/soft gray, clear hierarchy—no company registration required.",
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
  return (
    <section className={`${subtle ? "bg-white/70" : "bg-gray-50"} border-t border-gray-100 py-20`} data-animate="fade-up">
      <div className="mx-auto max-w-6xl space-y-10 px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
            Narrative pillars
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">{heading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Plaen connects structure to real-world context so independent people and teams can operate with confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition hover:-translate-y-2 hover:border-black/80"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -right-16 top-10 h-36 w-36 rounded-full bg-gradient-to-br from-black to-gray-500 blur-3xl" />
                </div>
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-inner">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-black">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{p.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
