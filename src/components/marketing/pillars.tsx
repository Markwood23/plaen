import { IconFrame } from "@/components/ui/icon-frame";
import { FileText, Users2, Wallet, Receipt, Bell } from "lucide-react";

const pillars = [
  {
    icon: FileText,
    title: "Invoice Builder",
    description: "Compose dual-currency invoices with live totals, tax calculations, and professional templates.",
    color: "#1877F2",
  },
  {
    icon: Users2,
    title: "Contact Management",
    description: "Store and organize client information with custom fields and payment preferences.",
    color: "#059669",
  },
  {
    icon: Wallet,
    title: "Payment Processing",
    description: "Accept payments via mobile money, bank transfer, cards, and crypto in one unified flow.",
    color: "#7C3AED",
  },
  {
    icon: Receipt,
    title: "Finance Notes & Docs",
    description: "Automatic receipt generation with tamper-evident records and contextual documentation.",
    color: "#F59E0B",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automated payment reminders and status tracking to keep invoices moving forward.",
    color: "#DC2626",
  },
];

interface PillarsProps {
  heading?: string;
  subtle?: boolean;
}

export function Pillars({ heading = "Five product pillars" }: PillarsProps) {
  return (
    <section className="border-t border-gray-100 bg-white py-24" data-animate="fade-up">
      <div className="mx-auto max-w-6xl space-y-12 px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            A complete financial workspace designed for clarity, professionalism, and ease of use.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition-all hover:-translate-y-2 hover:border-black/20"
                style={{ animation: `cardRise 0.9s ease ${index * 0.08}s both` }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div
                    className="absolute -right-16 top-8 h-36 w-36 rounded-full blur-3xl"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  />
                </div>
                <div className="relative space-y-4">
                  <IconFrame
                    icon={Icon}
                    size="md"
                    variant="subtle"
                    className="transition"
                    style={{
                      backgroundColor: `${pillar.color}10`,
                      borderColor: `${pillar.color}20`,
                    }}
                  />
                  <h3 className="text-lg font-semibold text-black">{pillar.title}</h3>
                  <p className="text-sm leading-6 text-gray-600">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
