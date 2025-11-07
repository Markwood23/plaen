"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Plus, Minus, ArrowRight, Percent } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function ItemsTotalsPage() {
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
                  Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Adding items and calculating totals
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Learn how to add line items, manage quantities and rates, and 
                  understand how Plaen calculates invoice totals automatically.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>3 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Understanding line items</h2>
                <p>
                  Every invoice consists of line items - individual products or services 
                  you're billing for. Each line item contains four key components that 
                  work together to calculate the total amount.
                </p>

                <div className="not-prose my-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-black mb-3">Basic Structure</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Description:</strong> What you're charging for</div>
                      <div><strong>Quantity:</strong> How many units</div>
                      <div><strong>Rate:</strong> Price per unit</div>
                      <div><strong>Amount:</strong> Quantity × Rate</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-black mb-3">Example</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Description:</strong> Logo Design</div>
                      <div><strong>Quantity:</strong> 3 concepts</div>
                      <div><strong>Rate:</strong> GHS 500 each</div>
                      <div><strong>Amount:</strong> GHS 1,500</div>
                    </div>
                  </div>
                </div>

                <h2>Adding line items</h2>
                
                <h3>Creating your first item</h3>
                <ol>
                  <li>Click <strong>"Add Item"</strong> in the invoice builder</li>
                  <li>Enter a clear, descriptive name for your service or product</li>
                  <li>Set the quantity (defaults to 1)</li>
                  <li>Enter the rate per unit</li>
                  <li>The amount calculates automatically</li>
                </ol>

                <h3>Adding multiple items</h3>
                <p>
                  You can add as many line items as needed:
                </p>
                <ul>
                  <li>Click <strong>"Add Item"</strong> for each new line</li>
                  <li>Use <strong>Tab</strong> to quickly move between fields</li>
                  <li>Press <strong>Enter</strong> at the end of a line to add another</li>
                  <li>Drag and drop to reorder items</li>
                </ul>

                <h2>Quantity and units</h2>
                
                <h3>Common quantity types</h3>
                <div className="not-prose my-6 space-y-3">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="font-semibold text-black">Time-based services</div>
                    <div className="text-sm text-gray-700 mt-1">
                      • Hours (5 hours × GHS 200/hour = GHS 1,000)<br/>
                      • Days (3 days × GHS 800/day = GHS 2,400)<br/>
                      • Weeks (2 weeks × GHS 2,000/week = GHS 4,000)
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="font-semibold text-black">Project-based work</div>
                    <div className="text-sm text-gray-700 mt-1">
                      • Deliverables (1 website × GHS 5,000 = GHS 5,000)<br/>
                      • Concepts (3 logo concepts × GHS 500 = GHS 1,500)<br/>
                      • Revisions (2 revision rounds × GHS 300 = GHS 600)
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="font-semibold text-black">Products</div>
                    <div className="text-sm text-gray-700 mt-1">
                      • Pieces (10 business cards × GHS 5 = GHS 50)<br/>
                      • Licenses (1 software license × GHS 1,200 = GHS 1,200)<br/>
                      • Subscriptions (12 months × GHS 100 = GHS 1,200)
                    </div>
                  </div>
                </div>

                <h3>Decimal quantities</h3>
                <p>
                  Plaen supports decimal quantities for precise billing:
                </p>
                <ul>
                  <li><strong>Partial hours:</strong> 2.5 hours × GHS 200/hour = GHS 500</li>
                  <li><strong>Fractional units:</strong> 0.5 months × GHS 1,000/month = GHS 500</li>
                  <li><strong>Percentage work:</strong> 0.75 complete × GHS 2,000 = GHS 1,500</li>
                </ul>

                <h2>Rate calculations</h2>
                
                <h3>Setting rates</h3>
                <p>
                  Enter rates in your preferred currency:
                </p>
                <ul>
                  <li><strong>Whole numbers:</strong> 500, 1200, 2000</li>
                  <li><strong>Decimals:</strong> 150.50, 99.99, 1250.75</li>
                  <li><strong>Large amounts:</strong> 15000, 50000, 100000</li>
                </ul>

                <h3>Rate formatting</h3>
                <p>
                  Plaen automatically formats rates for readability:
                </p>
                <ul>
                  <li>1500 displays as GHS 1,500.00</li>
                  <li>99.5 displays as GHS 99.50</li>
                  <li>10000 displays as GHS 10,000.00</li>
                </ul>

                <h2>Automatic calculations</h2>
                
                <h3>Line item amounts</h3>
                <p>
                  Each line automatically calculates: <strong>Quantity × Rate = Amount</strong>
                </p>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold border-b pb-2 mb-4">
                    <div>Description</div>
                    <div>Qty</div>
                    <div>Rate</div>
                    <div>Amount</div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-4 gap-4">
                      <div>Web Design</div>
                      <div>1</div>
                      <div>GHS 3,000</div>
                      <div className="font-semibold">GHS 3,000</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>Hosting Setup</div>
                      <div>1</div>
                      <div>GHS 500</div>
                      <div className="font-semibold">GHS 500</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>Training Hours</div>
                      <div>3</div>
                      <div>GHS 200</div>
                      <div className="font-semibold">GHS 600</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 border-t pt-3 font-semibold">
                      <div className="col-span-3">Subtotal</div>
                      <div>GHS 4,100</div>
                    </div>
                  </div>
                </div>

                <h3>Subtotal calculation</h3>
                <p>
                  The subtotal is the sum of all line item amounts before any 
                  discounts, taxes, or adjustments.
                </p>

                <h2>Discounts and adjustments</h2>
                
                <h3>Percentage discounts</h3>
                <p>
                  Apply discounts as percentages:
                </p>
                <ul>
                  <li><strong>Early bird discount:</strong> 10% off subtotal</li>
                  <li><strong>Volume discount:</strong> 15% for large projects</li>
                  <li><strong>Loyalty discount:</strong> 5% for repeat clients</li>
                </ul>

                <h3>Fixed amount discounts</h3>
                <p>
                  Apply specific amounts off the total:
                </p>
                <ul>
                  <li><strong>Promotional discount:</strong> GHS 500 off</li>
                  <li><strong>Referral credit:</strong> GHS 200 off</li>
                  <li><strong>Goodwill adjustment:</strong> GHS 100 off</li>
                </ul>

                <h2>Tax calculations</h2>
                
                <h3>VAT/Sales tax</h3>
                <p>
                  Add tax to your invoices:
                </p>
                <ul>
                  <li><strong>Ghana VAT:</strong> 15% on applicable services</li>
                  <li><strong>Tax-inclusive:</strong> Include tax in the item rate</li>
                  <li><strong>Tax-exclusive:</strong> Add tax on top of subtotal</li>
                </ul>

                <h3>Tax calculation example</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>GHS 4,100</span></div>
                    <div className="flex justify-between"><span>Discount (10%)</span><span>-GHS 410</span></div>
                    <div className="flex justify-between"><span>Adjusted Subtotal</span><span>GHS 3,690</span></div>
                    <div className="flex justify-between"><span>VAT (15%)</span><span>GHS 553.50</span></div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>Total</span><span>GHS 4,243.50</span>
                    </div>
                  </div>
                </div>

                <h2>Managing line items</h2>
                
                <h3>Editing items</h3>
                <ul>
                  <li><strong>Click any field</strong> to edit description, quantity, or rate</li>
                  <li><strong>Tab through fields</strong> for quick editing</li>
                  <li><strong>Changes save automatically</strong> as you type</li>
                  <li><strong>Calculations update instantly</strong> when values change</li>
                </ul>

                <h3>Organizing items</h3>
                <ul>
                  <li><strong>Drag and drop</strong> to reorder line items</li>
                  <li><strong>Delete items</strong> using the trash icon</li>
                  <li><strong>Duplicate items</strong> for similar services</li>
                  <li><strong>Group related items</strong> together logically</li>
                </ul>

                <h2>Best practices</h2>
                <ul>
                  <li><strong>Be descriptive:</strong> Clear item descriptions prevent confusion</li>
                  <li><strong>Use consistent units:</strong> Stick to hours, days, or pieces</li>
                  <li><strong>Break down complex work:</strong> Separate different services</li>
                  <li><strong>Round appropriately:</strong> Use clean numbers when possible</li>
                  <li><strong>Double-check math:</strong> Verify totals make sense</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/invoice-builder">
                    <Button size="lg">
                      Learn invoice builder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/due-dates">
                    <Button size="lg" variant="outline">
                      Setting due dates
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