import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function MobileMoneyFasterPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <div className="relative min-h-screen bg-white text-black">
        <main>
          <section className="mx-auto max-w-4xl px-6 py-20">
            <div className="mb-8">
              <Link href="/help" className="inline-flex items-center text-sm text-gray-700 hover:text-black">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Help Center
              </Link>
            </div>

            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs uppercase tracking-wider text-gray-500">
                  <Smartphone className="h-3 w-3" />
                  Popular • Payments
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  How to get paid faster with mobile money
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Learn why mobile money payments are processed faster than traditional 
                  methods and how to optimize your invoices for quick payment.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Why mobile money is faster</h2>
                <p>
                  Mobile money payments in Ghana offer significant speed advantages over 
                  traditional banking methods. Understanding these benefits helps you 
                  optimize your invoicing strategy for faster payments.
                </p>

                <div className="not-prose my-8 grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mx-auto">
                      <Zap className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Instant Transfer</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Payments process in seconds, not days
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mx-auto">
                      <Smartphone className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Always Available</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      24/7 availability, no banking hours
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mx-auto">
                      <TrendingUp className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">High Adoption</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      95% of Ghanaians use mobile money
                    </p>
                  </div>
                </div>

                <h2>Speed comparison</h2>
                <p>
                  Here's how different payment methods compare in terms of processing time:
                </p>

                <div className="not-prose my-8 space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-black">Mobile Money</div>
                      <div className="text-gray-700">MTN, Vodafone, AirtelTigo</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-black">Instant</div>
                      <div className="text-xs text-gray-500">0-2 seconds</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-black">Bank Transfer (Local)</div>
                      <div className="text-gray-700">Same-bank or interbank</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-black">1-3 days</div>
                      <div className="text-xs text-gray-500">Business days only</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-black">International Wire</div>
                      <div className="text-gray-700">SWIFT transfers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-black">3-7 days</div>
                      <div className="text-xs text-gray-500">Plus fees</div>
                    </div>
                  </div>
                </div>

                <h2>Optimizing invoices for mobile money</h2>

                <div className="not-prose mt-8 space-y-6">
                  {["Display all networks", "Use clear payment instructions", "Set shorter payment terms"].map((title, index) => (
                    <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-semibold text-black">{title}</h3>
                          {index === 0 && (
                            <p className="text-gray-700 leading-[1.8]">
                              Include MTN, Vodafone Cash, and AirtelTigo Money on your invoices so every buyer sees their preferred option immediately.
                            </p>
                          )}
                          {index === 1 && (
                            <div className="space-y-3 text-gray-700">
                              <p className="leading-[1.8]">Make the payment journey effortless by surfacing exact details:</p>
                              <ul className="space-y-2 text-sm leading-[1.8] text-gray-700">
                                <li>Display mobile money numbers prominently at the top of the invoice.</li>
                                <li>Repeat the exact amount the client should send.</li>
                                <li>Call out the invoice number as the payment reference.</li>
                                <li>Provide a short bulleted walkthrough for first-time payers.</li>
                              </ul>
                            </div>
                          )}
                          {index === 2 && (
                            <div className="space-y-3 text-gray-700">
                              <p className="leading-[1.8]">Because funds settle instantly, tighten your timelines without harming relationships:</p>
                              <ul className="space-y-2 text-sm leading-[1.8] text-gray-700">
                                <li><strong>Due immediately</strong> for repeat or low-value invoices.</li>
                                <li><strong>Net 3–7 days</strong> as a new baseline instead of Net 30.</li>
                                <li><strong>Same-day discounts</strong> that reward instant settlement.</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2>Client education strategies</h2>

                <div className="not-prose mt-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-black">Explain the benefits</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-gray-700">
                      Reassure hesitant clients by highlighting the operational wins you both gain:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-[1.8] text-gray-700">
                      <li><strong>No bank queues:</strong> Pay from anywhere, anytime.</li>
                      <li><strong>No transfer fees:</strong> Cheaper than interbank transfers.</li>
                      <li><strong>Instant confirmation:</strong> Everyone sees the payment the moment it lands.</li>
                      <li><strong>Automatic receipts:</strong> SMS confirmations double as proof of payment.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-black">Include payment tutorials</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-gray-700">
                      Embed quick how-tos on every invoice so clients never guess the next step:
                    </p>
                    <div className="mt-4 rounded-xl border border-solid border-gray-300 bg-white p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-600">MTN MoMo example</h4>
                      <ol className="mt-3 space-y-2 text-sm leading-[1.8] text-gray-700">
                        <li>Dial <strong>*170#</strong></li>
                        <li>Select <strong>Send Money</strong></li>
                        <li>Enter recipient number: <strong>024XXXXXXX</strong></li>
                        <li>Enter amount: <strong>GHS XXX.XX</strong></li>
                        <li>Reference: <strong>Invoice #INV-001</strong></li>
                        <li>Confirm with your PIN</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <h2>Automation and notifications</h2>

                <div className="not-prose mt-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-black">Set up payment notifications</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-gray-700">
                      Configure alerts so you know about every payment the moment it clears.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-[1.8] text-gray-700">
                      <li>Email notifications for all confirmed payments.</li>
                      <li>SMS alerts for high-value transactions.</li>
                      <li>Webhook pushes into your accounting or ERP stack.</li>
                      <li>Daily payment digests sent to finance leads.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-black">Automatic receipt generation</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-gray-700">
                      Plaen handles the post-payment admin so your team can stay focused.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-[1.8] text-gray-700">
                      <li>Invoices flip to “Paid” status instantly.</li>
                      <li>Receipts go out to clients without manual work.</li>
                      <li>Dashboards and analytics refresh in real time.</li>
                      <li>Follow-up workflows kick off automatically.</li>
                    </ul>
                  </div>
                </div>

                <h2>Handling payment issues</h2>

                <div className="not-prose mt-8 space-y-6">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-xl font-semibold text-black">Common mobile money problems</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Wrong amount sent", action: "Ask the client to top up the difference immediately." },
                        { label: "Wrong reference", action: "Match the payment manually and add a note in Plaen." },
                        { label: "Network delays", action: "Confirm status with the network before re-invoicing." },
                        { label: "Daily limit exceeded", action: "Split the invoice or schedule a second transaction." },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-sm font-semibold text-black">{item.label}</p>
                          <p className="mt-2 text-sm leading-[1.8] text-gray-700">{item.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-xl font-semibold text-black">Payment verification checklist</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-gray-700">
                      Confirm every transfer using multiple sources to avoid disputes.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-[1.8] text-gray-700">
                      <li>SMS confirmation from the client’s network operator.</li>
                      <li>Mobile money app transaction history on your device.</li>
                      <li>Plaen’s automated payment matching log.</li>
                      <li>Client-provided screenshot when anything looks inconsistent.</li>
                    </ul>
                  </div>
                </div>

                <h2>Tips for faster payments</h2>

                <div className="not-prose mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Send invoices early",
                      description: "Hit inboxes before 9am so clients have a full day to approve and pay.",
                    },
                    {
                      title: "Follow up quickly",
                      description: "Schedule a reminder within 24 hours if the invoice remains unpaid.",
                    },
                    {
                      title: "Offer assistance",
                      description: "Provide a quick guide or call for clients new to mobile money.",
                    },
                    {
                      title: "Build relationships",
                      description: "Trusted partners settle faster—keep communication consistent.",
                    },
                    {
                      title: "Reward speed",
                      description: "Offer small discounts or loyalty credits for same-day payment.",
                    },
                  ].map((tip) => (
                    <div key={tip.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">{tip.title}</h3>
                      <p className="mt-3 text-sm leading-[1.8] text-gray-700">{tip.description}</p>
                    </div>
                  ))}
                </div>

                <h2>Statistics and benchmarks</h2>

                <div className="not-prose mt-8 grid gap-6 sm:grid-cols-2">
                  {["85% faster average payment time", "60% fewer overdue invoices", "40% stronger cash flow", "90% client satisfaction"].map((stat) => (
                    <div key={stat} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                      <p className="text-lg font-semibold text-black">{stat}</p>
                    </div>
                  ))}
                </div>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/mobile-money">
                    <Button size="lg">
                      Set up mobile money
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/payment-setup">
                    <Button size="lg" variant="outline">
                      Payment setup guide
                    </Button>
                  </Link>
                </div>

              </div>
            </div>
          </section>
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}