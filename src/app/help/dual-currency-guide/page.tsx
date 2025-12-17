import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function DualCurrencyGuidePage() {
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
                  <Calculator className="h-3 w-3" />
                  Popular • Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#14462a]">
                  Understanding dual currency invoicing
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  When and how to use GHS and USD on the same invoice for international 
                  clients and currency flexibility.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2 className="text-2xl font-semibold text-black mt-16 mb-8 first:mt-0">What is dual currency invoicing?</h2>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Dual currency invoicing allows you to display prices in both Ghana Cedis (GHS) 
                  and US Dollars (USD) on the same invoice. This gives clients payment flexibility 
                  while protecting your business from currency fluctuations.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">When to use dual currency</h2>
                
                <h3 className="text-xl font-semibold text-black mt-12 mb-6">International clients</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Clients who prefer to see USD amounts</li>
                  <li className="text-lg leading-8 text-gray-700">Companies with USD budgets or accounting</li>
                  <li className="text-lg leading-8 text-gray-700">Expatriate businesses in Ghana</li>
                  <li className="text-lg leading-8 text-gray-700">International organizations and NGOs</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">High-value services</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Large consulting projects</li>
                  <li className="text-lg leading-8 text-gray-700">Software development contracts</li>
                  <li className="text-lg leading-8 text-gray-700">Long-term service agreements</li>
                  <li className="text-lg leading-8 text-gray-700">Export/import businesses</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Currency hedging</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Protecting against GHS volatility</li>
                  <li className="text-lg leading-8 text-gray-700">Offering payment options in stable currency</li>
                  <li className="text-lg leading-8 text-gray-700">Accommodating client preferences</li>
                  <li className="text-lg leading-8 text-gray-700">International contract requirements</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">How dual currency works in Plaen</h2>
                
                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Setting up dual currency</h2>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Follow these steps to enable dual currency invoicing:
                </p>
                
                <ol className="space-y-4 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Go to Settings → Invoice Configuration</li>
                  <li className="text-lg leading-8 text-gray-700">Enable "Dual Currency Display"</li>
                  <li className="text-lg leading-8 text-gray-700">Set your primary currency (usually GHS)</li>
                  <li className="text-lg leading-8 text-gray-700">Set your secondary currency (usually USD)</li>
                  <li className="text-lg leading-8 text-gray-700">Configure automatic exchange rate updates</li>
                </ol>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Exchange rate options</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Live rates:</strong> Automatically updated from Bank of Ghana</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Fixed rates:</strong> Lock in rates for specific contracts</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Manual rates:</strong> Set your own exchange rate</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Rate date:</strong> Use rates from invoice date or custom date</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Dual currency invoice examples</h2>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Primary GHS, Secondary USD</h3>
                <div className="not-prose my-8 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Web Development Services</span>
                      <div className="text-right">
                        <div className="font-semibold">GHS 12,000</div>
                        <div className="text-gray-500">($750 USD)</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Maintenance (6 months)</span>
                      <div className="text-right">
                        <div className="font-semibold">GHS 3,600</div>
                        <div className="text-gray-500">($225 USD)</div>
                      </div>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <div className="text-right">
                        <div>GHS 15,600</div>
                        <div className="text-gray-700">($975 USD)</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Exchange rate: 1 USD = 16.00 GHS (November 6, 2024)
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Equal prominence display</h3>
                <div className="not-prose my-8 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Consulting Services</span>
                      <div className="text-right font-semibold">
                        <div>$2,500 USD</div>
                        <div>GHS 40,000</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-4">
                      Client may pay in either currency • Rate: 1 USD = 16.00 GHS
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Payment considerations</h2>
                
                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Currency preference</h3>
                <p className="text-lg leading-8 text-gray-700 mb-6">Clearly specify which currency you prefer:</p>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">"Payment preferred in USD"</strong> - for international clients</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">"Either currency accepted"</strong> - maximum flexibility</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">"GHS equivalent at time of payment"</strong> - for rate protection</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Exchange rate fluctuations</h3>
                <p className="text-lg leading-8 text-gray-700 mb-6">Address rate changes in your terms:</p>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Fixed rate:</strong> "USD amounts based on exchange rate of [date]"</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Current rate:</strong> "GHS amount may vary based on current exchange rate"</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Rate tolerance:</strong> "Rates valid for 7 days from invoice date"</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Best practices</h2>
                
                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Clear communication</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Always show the exchange rate and date used</li>
                  <li className="text-lg leading-8 text-gray-700">Specify which currency is primary</li>
                  <li className="text-lg leading-8 text-gray-700">Explain payment options clearly</li>
                  <li className="text-lg leading-8 text-gray-700">Include rate validity period</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Rate management</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Daily rate updates:</strong> For current market rates</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Weekly rate locks:</strong> For rate stability</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Contract rate fixing:</strong> For long-term projects</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Bank rate matching:</strong> Use your bank's rates for consistency</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Payment method alignment</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">USD payments:</strong> Bank transfers, international services</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">GHS payments:</strong> Mobile money, local bank transfers</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Multi-currency accounts:</strong> Reduce conversion costs</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Advanced features</h2>
                
                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Automatic rate updates</h3>
                <p className="text-lg leading-8 text-gray-700 mb-6">Plaen can automatically:</p>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Fetch daily rates from Bank of Ghana</li>
                  <li className="text-lg leading-8 text-gray-700">Update invoice calculations in real-time</li>
                  <li className="text-lg leading-8 text-gray-700">Send rate change notifications</li>
                  <li className="text-lg leading-8 text-gray-700">Archive historical rates for records</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Multi-currency reporting</h3>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700">Track income in both currencies</li>
                  <li className="text-lg leading-8 text-gray-700">Generate currency-specific reports</li>
                  <li className="text-lg leading-8 text-gray-700">Monitor exchange rate impacts</li>
                  <li className="text-lg leading-8 text-gray-700">Export data for accounting systems</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Common scenarios</h2>
                
                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Scenario 1: Ghanaian business, international client</h3>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  <strong className="text-black">Setup:</strong> Primary GHS, display USD equivalent<br/>
                  <strong className="text-black">Rate:</strong> Live rates, updated daily<br/>
                  <strong className="text-black">Payment:</strong> Accept both currencies<br/>
                  <strong className="text-black">Terms:</strong> "Rate valid for 5 business days"
                </p>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Scenario 2: Export services</h3>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  <strong className="text-black">Setup:</strong> Primary USD, show GHS equivalent<br/>
                  <strong className="text-black">Rate:</strong> Fixed rate for contract duration<br/>
                  <strong className="text-black">Payment:</strong> USD preferred, GHS accepted<br/>
                  <strong className="text-black">Terms:</strong> "USD rate fixed for project duration"
                </p>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Scenario 3: Local client with USD budget</h3>
                <p className="text-lg leading-8 text-gray-700 mb-12">
                  <strong className="text-black">Setup:</strong> Equal prominence for both currencies<br/>
                  <strong className="text-black">Rate:</strong> Client's preferred rate source<br/>
                  <strong className="text-black">Payment:</strong> Client choice of currency<br/>
                  <strong className="text-black">Terms:</strong> "Pay in either currency shown"
                </p>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Legal and tax considerations</h2>
                <ul className="space-y-3 mb-12">
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Tax reporting:</strong> Report income in GHS for Ghana tax purposes</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Foreign exchange:</strong> Follow Bank of Ghana regulations</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Documentation:</strong> Keep records of exchange rates used</li>
                  <li className="text-lg leading-8 text-gray-700"><strong className="text-black">Audit trail:</strong> Maintain currency conversion records</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/dual-currency">
                    <Button size="lg">
                      Set up dual currency
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