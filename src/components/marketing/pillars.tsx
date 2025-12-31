import { DocumentText, Profile2User, Wallet3, ReceiptText, NotificationBing, TickCircle, Clock, MoneyRecive, Send2, Chart } from "iconsax-react";

// Accent color palette - complements primary green (#14462a)
const accentColors = {
  brand: "#14462a",     // Brand green - invoicing/success
  warmAmber: "#B45309", // Warm amber - contacts/people
  amber: "#D97706",     // Bright amber - payments/money
  rose: "#E11D48",      // Vibrant rose - receipts/docs
  sky: "#0284C7",       // Bright sky - reminders/notifications
};

// Mini invoice preview component for the Invoice Builder card
function InvoicePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[200px]">
      {/* Invoice card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[#14462a] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">P</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-800">Invoice #1024</span>
          </div>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">Paid</span>
        </div>
        <div className="space-y-2 border-t border-dashed border-gray-200 pt-3">
          <div className="flex justify-between text-[9px]">
            <span className="text-gray-500">Web Design</span>
            <span className="font-medium text-gray-700">$2,400</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-gray-500">Development</span>
            <span className="font-medium text-gray-700">$3,200</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between">
          <span className="text-[10px] font-semibold text-gray-600">Total</span>
          <span className="text-[11px] font-bold text-[#14462a]">$5,600</span>
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -right-3 -top-2 h-7 w-7 rounded-lg bg-[#14462a] shadow-lg flex items-center justify-center">
        <TickCircle size={14} color="#fff" variant="Bold" />
      </div>
    </div>
  );
}

// Contact avatars stack for Contact Management card
function ContactsPreview() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex -space-x-3">
        {['#F59E0B', '#3B82F6', '#EC4899', '#10B981'].map((color, i) => (
          <div 
            key={i}
            className="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-md"
            style={{ backgroundColor: color, zIndex: 4 - i }}
          >
            {['JD', 'AK', 'SM', 'RB'][i]}
          </div>
        ))}
        <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold shadow-md">
          +12
        </div>
      </div>
    </div>
  );
}

// Payment methods visualization for Payment Processing card
function PaymentPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      {/* Payment flow diagram */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <MoneyRecive size={18} color="#D97706" variant="Bulk" />
          </div>
          <span className="text-[8px] text-gray-500">Mobile Money</span>
        </div>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-amber-300 via-teal-300 to-teal-500 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <TickCircle size={18} color="#14462a" variant="Bold" />
          </div>
          <span className="text-[8px] text-gray-500">Confirmed</span>
        </div>
      </div>
      {/* Amount badge */}
      <div className="mt-3 mx-auto w-fit px-4 py-2 rounded-full bg-gradient-to-r from-[#14462a] to-teal-600 text-white text-xs font-semibold shadow-lg">
        GHS 45,200 → $3,400
      </div>
    </div>
  );
}

// Receipt stack for Finance Notes card
function ReceiptsPreview() {
  return (
    <div className="relative h-24 flex items-center justify-center">
      {/* Stacked receipts */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-28 h-16 rounded-lg bg-white border border-gray-200 shadow-md p-2"
          style={{
            transform: `rotate(${(i - 1) * 8}deg) translateY(${i * 2}px)`,
            zIndex: 3 - i,
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <div className="h-3 w-3 rounded bg-rose-500" />
            <div className="h-1.5 w-12 bg-gray-200 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-16 bg-gray-100 rounded" />
            <div className="h-1 w-12 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
      {/* Checkmark */}
      <div className="absolute -bottom-1 right-6 h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg z-10">
        <TickCircle size={12} color="#fff" variant="Bold" />
      </div>
    </div>
  );
}

// Timeline for Smart Reminders card
function RemindersPreview() {
  const reminders = [
    { time: 'Today', status: 'sent', label: 'Payment reminder sent' },
    { time: 'In 3 days', status: 'pending', label: 'Follow-up scheduled' },
    { time: 'In 7 days', status: 'pending', label: 'Final notice' },
  ];
  
  return (
    <div className="space-y-2">
      {reminders.map((reminder, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
            reminder.status === 'sent' 
              ? 'bg-sky-500 text-white' 
              : 'bg-gray-100 text-gray-400'
          }`}>
            {reminder.status === 'sent' ? (
              <Send2 size={10} color="#fff" variant="Bold" />
            ) : (
              <Clock size={10} color="#9CA3AF" variant="Linear" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-medium text-gray-700">{reminder.label}</p>
            <p className="text-[8px] text-gray-400">{reminder.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const pillars = [
  {
    icon: DocumentText,
    title: "Invoice Builder",
    description: "Compose dual-currency invoices with live totals, tax calculations, and professional templates.",
    color: accentColors.brand,
    preview: InvoicePreview,
  },
  {
    icon: Profile2User,
    title: "Contact Management",
    description: "Store and organize client information with custom fields and payment preferences.",
    color: accentColors.warmAmber,
    preview: ContactsPreview,
  },
  {
    icon: Wallet3,
    title: "Payment Processing",
    description: "Accept payments via mobile money, bank transfer, cards, and crypto in one unified flow.",
    color: accentColors.amber,
    preview: PaymentPreview,
  },
  {
    icon: ReceiptText,
    title: "Finance Notes & Docs",
    description: "Automatic receipt generation with tamper-evident records and contextual documentation.",
    color: accentColors.rose,
    preview: ReceiptsPreview,
  },
  {
    icon: NotificationBing,
    title: "Smart Reminders",
    description: "Automated payment reminders and status tracking to keep invoices moving forward.",
    color: accentColors.sky,
    preview: RemindersPreview,
  },
];

interface PillarsProps {
  heading?: string;
  subtle?: boolean;
}

export function Pillars({ heading = "Five product pillars" }: PillarsProps) {
  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white py-24" data-animate="fade-up">
      <div className="mx-auto max-w-6xl space-y-12 px-6">
        {/* Header with pill badge */}
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center rounded-full bg-[#14462a]/10 px-4 py-1.5 text-xs font-medium text-[#14462a]">
            Features
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            A complete financial workspace designed for clarity, professionalism, and ease of use.
          </p>
        </div>

        {/* Top row - 3 cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.slice(0, 3).map((pillar, index) => {
            const Icon = pillar.icon;
            const Preview = pillar.preview;
            return (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
                style={{ animation: `cardRise 0.9s ease ${index * 0.08}s both` }}
              >
                {/* Preview visualization */}
                <div className="mb-6 h-32 flex items-center justify-center rounded-xl bg-gray-50/80 p-4">
                  <Preview />
                </div>
                
                {/* Title and description */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom row - 2 larger cards */}
        <div className="grid gap-5 lg:grid-cols-2">
          {pillars.slice(3).map((pillar, index) => {
            const Icon = pillar.icon;
            const Preview = pillar.preview;
            return (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
                style={{ animation: `cardRise 0.9s ease ${(index + 3) * 0.08}s both` }}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Preview visualization */}
                  <div className="flex-shrink-0 h-36 sm:h-auto sm:w-48 flex items-center justify-center rounded-xl bg-gray-50/80 p-4">
                    <Preview />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{pillar.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
