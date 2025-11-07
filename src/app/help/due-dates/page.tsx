import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function DueDatesPage() {
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
                  <Calendar className="h-3 w-3" />
                  Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Setting due dates and terms
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Learn how to set appropriate payment terms and due dates to 
                  optimize cash flow while maintaining good client relationships.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>2 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Understanding payment terms</h2>
                <p>
                  Payment terms specify when your client should pay the invoice. 
                  The right terms balance your cash flow needs with client convenience 
                  and relationship management.
                </p>

                <h2>Common payment terms</h2>
                
                <div className="not-prose my-8 space-y-4">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-black">Due Immediately</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Payment expected upon receipt of invoice
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Best for:</strong> Small amounts, trusted clients, digital services
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-black">Net 15</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Payment due within 15 days of invoice date
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Best for:</strong> Small to medium projects, regular clients
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-black">Net 30</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Payment due within 30 days of invoice date
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Best for:</strong> Large projects, corporate clients, standard business practice
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-black">Custom Date</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Specific calendar date agreed upon with client
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Best for:</strong> Milestone payments, specific project deadlines
                    </div>
                  </div>
                </div>

                <h2>Setting due dates in Plaen</h2>
                
                <h3>Default payment terms</h3>
                <ol>
                  <li>Go to <strong>Settings → Invoice Preferences</strong></li>
                  <li>Select your preferred default payment terms</li>
                  <li>This will apply to all new invoices automatically</li>
                  <li>You can override defaults for individual invoices</li>
                </ol>

                <h3>Per-invoice customization</h3>
                <p>
                  While creating an invoice, you can:
                </p>
                <ul>
                  <li>Choose from preset terms (Due immediately, Net 15, Net 30, Net 60)</li>
                  <li>Select a custom due date from the calendar</li>
                  <li>Set different terms for different clients</li>
                  <li>Add payment term notes or conditions</li>
                </ul>

                <h2>Choosing the right terms</h2>
                
                <h3>Factors to consider</h3>
                
                <h4>Project size and value</h4>
                <ul>
                  <li><strong>Small projects (&lt; GHS 1,000):</strong> Due immediately or Net 15</li>
                  <li><strong>Medium projects (GHS 1,000-10,000):</strong> Net 15 to Net 30</li>
                  <li><strong>Large projects (&gt; GHS 10,000):</strong> Net 30 or milestone payments</li>
                </ul>

                <h4>Client relationship</h4>
                <ul>
                  <li><strong>New clients:</strong> Shorter terms or upfront payment</li>
                  <li><strong>Trusted clients:</strong> Standard Net 30 terms</li>
                  <li><strong>Long-term clients:</strong> Flexible terms based on history</li>
                </ul>

                <h4>Industry standards</h4>
                <ul>
                  <li><strong>Creative services:</strong> Often Net 15 to Net 30</li>
                  <li><strong>Consulting:</strong> Usually Net 30</li>
                  <li><strong>Digital products:</strong> Due immediately or Net 15</li>
                  <li><strong>Corporate work:</strong> Net 30 to Net 60</li>
                </ul>

                <h2>Payment term examples</h2>
                
                <h3>Scenario-based recommendations</h3>
                
                <div className="not-prose my-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-black mb-2">Freelance Logo Design</h4>
                    <div className="text-sm text-gray-700">
                      <strong>Project:</strong> GHS 2,500 logo design for local business<br/>
                      <strong>Recommended terms:</strong> Net 15<br/>
                      <strong>Reasoning:</strong> Medium-sized project, allows client time to process, maintains cash flow
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-black mb-2">Corporate Website</h4>
                    <div className="text-sm text-gray-700">
                      <strong>Project:</strong> GHS 15,000 website for corporation<br/>
                      <strong>Recommended terms:</strong> Net 30 with 50% upfront<br/>
                      <strong>Reasoning:</strong> Large amount, corporate approval processes, risk mitigation
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-black mb-2">Monthly Retainer</h4>
                    <div className="text-sm text-gray-700">
                      <strong>Project:</strong> GHS 3,000/month marketing services<br/>
                      <strong>Recommended terms:</strong> Due immediately (recurring)<br/>
                      <strong>Reasoning:</strong> Ongoing relationship, predictable income, services provided monthly
                    </div>
                  </div>
                </div>

                <h2>Advanced payment strategies</h2>
                
                <h3>Early payment incentives</h3>
                <p>
                  Encourage faster payment with discounts:
                </p>
                <ul>
                  <li><strong>2/10 Net 30:</strong> 2% discount if paid within 10 days, otherwise Net 30</li>
                  <li><strong>Early bird special:</strong> 5% off for same-day payment</li>
                  <li><strong>Cash discount:</strong> 3% off for mobile money payments</li>
                </ul>

                <h3>Milestone payments</h3>
                <p>
                  For large projects, break payments into phases:
                </p>
                <ul>
                  <li><strong>50/50 split:</strong> 50% upfront, 50% on completion</li>
                  <li><strong>33/33/34 split:</strong> Start, middle, completion</li>
                  <li><strong>Weekly milestones:</strong> Payment per completed deliverable</li>
                </ul>

                <h3>Progressive terms</h3>
                <p>
                  Adjust terms based on client payment history:
                </p>
                <ul>
                  <li><strong>New clients:</strong> Net 15 or upfront payment</li>
                  <li><strong>After 3 invoices paid on time:</strong> Upgrade to Net 30</li>
                  <li><strong>Long-term clients:</strong> Flexible terms or Net 45</li>
                </ul>

                <h2>Managing overdue payments</h2>
                
                <h3>Grace period</h3>
                <p>
                  Consider a short grace period before marking invoices overdue:
                </p>
                <ul>
                  <li>2-3 days for processing delays</li>
                  <li>Account for weekends and holidays</li>
                  <li>Banking delays for international payments</li>
                </ul>

                <h3>Late payment consequences</h3>
                <ul>
                  <li><strong>Late fees:</strong> 2-5% monthly on overdue amounts</li>
                  <li><strong>Service suspension:</strong> Pause work on overdue accounts</li>
                  <li><strong>Collection process:</strong> Formal collection procedures</li>
                  <li><strong>Credit terms adjustment:</strong> Shorter terms for future invoices</li>
                </ul>

                <h2>Legal considerations</h2>
                <ul>
                  <li><strong>Clear terms:</strong> State payment terms clearly on invoices</li>
                  <li><strong>Late fees:</strong> Specify late payment charges upfront</li>
                  <li><strong>Interest rates:</strong> Follow Ghana's legal limits for interest</li>
                  <li><strong>Contract alignment:</strong> Ensure invoice terms match contracts</li>
                </ul>

                <h2>Best practices</h2>
                <ul>
                  <li><strong>Be consistent:</strong> Use similar terms for similar clients</li>
                  <li><strong>Communicate clearly:</strong> Discuss terms before starting work</li>
                  <li><strong>Document agreements:</strong> Put payment terms in writing</li>
                  <li><strong>Monitor performance:</strong> Track which terms work best</li>
                  <li><strong>Stay flexible:</strong> Adjust terms based on experience</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/invoice-builder">
                    <Button size="lg">
                      Create an invoice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/payment-issues">
                    <Button size="lg" variant="outline">
                      Handling payment issues
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