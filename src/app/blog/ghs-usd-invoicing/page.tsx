import { ArticleLayout } from "@/components/blog/article-layout";

export default function DualCurrencyInvoicingPage() {
  return (
    <ArticleLayout
      title="Dual Currency Invoicing: GHS and USD Best Practices"
      description="When clients ask for pricing in both Ghana Cedis and US Dollars, your invoice needs to stay accurate and easy to reconcile."
      category="Invoicing"
      author="Kwame Asante"
      authorImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      date="2024-10-20"
      readTime="7 min read"
      tags={["Currency", "Ghana", "Invoicing"]}
      relatedPosts={[
        {
          title: "The Rise of Mobile Money in African Business",
          excerpt: "Mobile-first buyers still expect currency clarity on every invoice.",
          category: "Payments",
          slug: "mobile-money-africa",
        },
        {
          title: "Bank Transfer vs Mobile Money vs Crypto: Which is Best?",
          excerpt: "Understand the rails that support multi-currency receivables.",
          category: "Payments",
          slug: "payment-methods-comparison",
        },
        {
          title: "The Complete Guide to Professional Freelance Invoicing",
          excerpt: "Freelancers working with global clients can adopt the same playbook.",
          category: "Invoicing",
          slug: "freelancer-invoice-guide",
        },
      ]}
    >
  <p className="text-xl leading-[2] text-gray-700">
        Ghanaian businesses increasingly work with international clients who think in US Dollars but settle in Ghana Cedis. Dual currency invoices bridge that gap, showing both values while keeping your bookkeeping accurate.
      </p>

      <h2 className="mt-16">Know when to offer dual currency</h2>
      <p>
        Reserve dual currency invoices for clients that budget in one currency but pay in another. For example, a US-based nonprofit funding operations in Accra may want to see the USD amount for approvals, while the local operations team pays in GHS. Offering the option creates transparency and speeds up sign-off.
      </p>

      <h2 className="mt-16">Set expectations around exchange rates</h2>
      <p>
        Always state which exchange rate source you use and when it was captured. Plaen lets you select Bank of Ghana daily rates, fixed contract rates, or manual overrides. Include this language near the totals so clients know what to expect if the rate moves before they pay.
      </p>
      <ul className="space-y-3">
        <li><strong>Live rates:</strong> Update automatically each day when invoices are issued.</li>
        <li><strong>Fixed rates:</strong> Lock a rate for long-term projects and note the validity period.</li>
        <li><strong>Manual rates:</strong> Apply a specific rate supplied by the client or contract.</li>
      </ul>

      <div className="my-10 rounded-2xl bg-gray-50 p-8">
        <h3 className="mb-4 text-lg font-semibold text-black">Include these details on every dual currency invoice</h3>
        <ul className="space-y-3">
          <li>Exchange rate source and timestamp.</li>
          <li>Preferred currency for settlement.</li>
          <li>Instructions for handling rate fluctuations.</li>
          <li>Separate subtotals and taxes for each currency.</li>
        </ul>
      </div>

      <h2 className="mt-16">Keep reconciliation straightforward</h2>
      <p>
        When payments arrive, make sure your accounting system records both the foreign currency and the local equivalent. Plaen automatically stores the applied rate and conversion, so your finance team can export accurate journal entries without manual calculations.
      </p>

      <h2 className="mt-16">Communicate clearly with clients</h2>
      <p>
        Add a short note outlining what happens if payment arrives after the rate validity window. Offering to refresh the invoice or accept whichever currency the client prefers demonstrates flexibility while protecting your margins.
      </p>

      <p>
        Dual currency invoicing is ultimately about trust. When your document explains the math, the payment process feels predictable for everyone involved. With Plaen handling the calculations and formatting, your team can focus on delivering great work instead of debating exchange rates.
      </p>
    </ArticleLayout>
  );
}
