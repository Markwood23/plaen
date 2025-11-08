import { BadgeCheck, NotebookPen, ScrollText } from "lucide-react";

type Pillar = {
  title: string;
  copy: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const pillars: Pillar[] = [
  {
    title: "Money + Meaning",
    copy:
      "Attach purpose to payments. Pair clean invoices with context—who, why, and terms—so money tells a story, not just a number.",
    icon: ScrollText,
  },
  {
    title: "Official by Design",
    copy:
      "Be taken seriously without a registered company. Plaen gives you verifiable, professional documents and flows by default.",
    icon: BadgeCheck,
  },
  {
    title: "Finance Notes",
    copy:
      "Keep lightweight notes next to every invoice and payment: decisions, receipts, context. Searchable, shareable, human.",
    icon: NotebookPen,
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
