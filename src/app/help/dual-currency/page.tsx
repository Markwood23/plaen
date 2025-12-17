import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, ArrowRight, Globe, TrendingUp } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function DualCurrencyPage() {
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
                  <DollarSign className="h-3 w-3" />
                  Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#14462a]">
                  Dual currency invoicing
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Set up and use dual currency invoicing to show both GHS and USD 
                  amounts, giving clients payment flexibility.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>What is dual currency invoicing?</h2>
                <p>
                  Dual currency invoicing displays both Ghana Cedis (GHS) and US Dollars (USD) 
                  on the same invoice, allowing clients to pay in their preferred currency 
                  while protecting your business from exchange rate fluctuations.
                </p>

                <div className="not-prose my-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Globe className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Global Flexibility</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Accommodate international clients and local businesses with USD budgets
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <TrendingUp className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Risk Protection</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Hedge against currency volatility while offering payment options
                    </p>
                  </div>
                </div>

                <h2>Setting up dual currency</h2>
                
                <h3>Enable dual currency mode</h3>
                <ol>
                  <li>Go to <strong>Settings → Invoice Preferences</strong></li>
                  <li>Find the <strong>"Currency Settings"</strong> section</li>
                  <li>Toggle on <strong>"Dual Currency Display"</strong></li>
                  <li>Select <strong>GHS</strong> as primary, <strong>USD</strong> as secondary</li>
                  <li>Choose your exchange rate source</li>
                </ol>

                <h3>Exchange rate options</h3>
                <div className="not-prose my-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Live Rates (Recommended)</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Automatically updated from Bank of Ghana. Rates refresh daily and 
                      are locked when invoices are created.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Fixed Rates</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Set a specific exchange rate for consistent pricing. Useful for 
                      contracts or when you want rate stability.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Manual Rates</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Enter custom rates per invoice. Gives maximum control but 
                      requires manual updates.
                    </p>
                  </div>
                </div>

                <h2>Invoice display options</h2>
                
                <h3>Primary/Secondary display</h3>
                <p>
                  Show one currency prominently with the other as reference:
                </p>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Website Development</span>
                      <div className="text-right">
                        <div className="font-semibold text-base">GHS 12,000</div>
                        <div className="text-gray-500 text-xs">($750 USD)</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>SEO Optimization</span>
                      <div className="text-right">
                        <div className="font-semibold text-base">GHS 4,000</div>
                        <div className="text-gray-500 text-xs">($250 USD)</div>
                      </div>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <div className="text-right">
                        <div className="text-base">GHS 16,000</div>
                        <div className="text-gray-700 text-sm">($1,000 USD)</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-3 text-center">
                    Exchange rate: 1 USD = 16.00 GHS (Nov 6, 2024)
                  </div>
                </div>

                <h3>Equal prominence display</h3>
                <p>
                  Show both currencies with equal importance:
                </p>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Consulting Services</span>
                      <div className="text-right font-semibold">
                        <div>$2,500 USD</div>
                        <div>GHS 40,000</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-4">
                    Pay in either currency • Rate: 1 USD = 16.00 GHS
                  </div>
                </div>

                <h2>Creating dual currency invoices</h2>
                
                <h3>Standard workflow</h3>
                <ol>
                  <li>Create invoice normally with line items and rates</li>
                  <li>Choose <strong>"Dual Currency"</strong> in the currency selector</li>
                  <li>Select or confirm the exchange rate to use</li>
                  <li>Preview both currency displays</li>
                  <li>Send invoice with both amounts shown</li>
                </ol>

                <h3>Rate validation</h3>
                <p>
                  Before sending, Plaen shows you:
                </p>
                <ul>
                  <li>Current exchange rate being used</li>
                  <li>Rate source and last update time</li>
                  <li>Total amounts in both currencies</li>
                  <li>Option to lock in the current rate</li>
                </ul>

                <h2>Payment handling</h2>
                
                <h3>Accepting payments in both currencies</h3>
                <p>
                  Configure payment methods for dual currency:
                </p>
                <ul>
                  <li><strong>GHS payments:</strong> Mobile money, local bank transfers</li>
                  <li><strong>USD payments:</strong> International bank transfers, PayPal, crypto</li>
                  <li><strong>Either currency:</strong> Flexible payment options</li>
                </ul>

                <h3>Currency preference settings</h3>
                <p>
                  Specify your preference on invoices:
                </p>
                <ul>
                  <li><strong>"Payment preferred in USD"</strong> - for international work</li>
                  <li><strong>"Either currency accepted"</strong> - maximum flexibility</li>
                  <li><strong>"GHS equivalent at current rates"</strong> - rate protection</li>
                </ul>

                <h2>Exchange rate management</h2>
                
                <h3>Rate locking</h3>
                <p>
                  Protect against rate fluctuations:
                </p>
                <ul>
                  <li><strong>Invoice creation:</strong> Rate locked when invoice is generated</li>
                  <li><strong>Validity period:</strong> Set how long rates remain valid</li>
                  <li><strong>Contract rates:</strong> Use fixed rates for long-term projects</li>
                </ul>

                <h3>Rate updates</h3>
                <p>
                  Stay current with exchange rates:
                </p>
                <ul>
                  <li>Daily automatic updates from Bank of Ghana</li>
                  <li>Manual rate refresh option</li>
                  <li>Historical rate tracking for records</li>
                  <li>Rate change notifications</li>
                </ul>

                <h2>Best use cases</h2>
                
                <h3>International clients</h3>
                <ul>
                  <li>Foreign companies operating in Ghana</li>
                  <li>Export services to other countries</li>
                  <li>International NGOs and organizations</li>
                  <li>Expat-owned businesses</li>
                </ul>

                <h3>High-value services</h3>
                <ul>
                  <li>Large consulting projects</li>
                  <li>Software development contracts</li>
                  <li>Architectural and engineering services</li>
                  <li>Long-term service agreements</li>
                </ul>

                <h2>Tax and compliance</h2>
                <ul>
                  <li><strong>Ghana tax reporting:</strong> Convert all income to GHS for tax purposes</li>
                  <li><strong>Exchange rate documentation:</strong> Keep records of rates used</li>
                  <li><strong>Foreign exchange regulations:</strong> Follow Bank of Ghana guidelines</li>
                  <li><strong>Invoice requirements:</strong> Ensure dual currency invoices meet legal standards</li>
                </ul>

                <h2>Reporting and analytics</h2>
                <p>
                  Track performance across currencies:
                </p>
                <ul>
                  <li>Revenue reports in both currencies</li>
                  <li>Exchange rate impact analysis</li>
                  <li>Client payment preferences</li>
                  <li>Currency conversion records</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/dual-currency-guide">
                    <Button size="lg">
                      Detailed dual currency guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/invoice-builder">
                    <Button size="lg" variant="outline">
                      Learn invoice builder
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