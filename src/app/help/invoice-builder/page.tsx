import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Edit3, ArrowRight, Layers, Calculator, CheckCircle, XCircle } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function InvoiceBuilderPage() {
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
                  <FileText className="h-3 w-3" />
                  Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Invoice builder walkthrough
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Master Plaen's powerful invoice builder with this comprehensive guide to 
                  creating professional invoices efficiently.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>6 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Invoice builder overview</h2>
                <p>
                  Plaen's invoice builder is designed to be intuitive while providing 
                  powerful features for creating professional invoices. The interface 
                  is divided into logical sections that follow the natural flow of 
                  invoice creation.
                </p>

                <div className="not-prose my-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Edit3 className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Live Preview</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      See exactly how your invoice will look as you build it
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Calculator className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Auto-calculations</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Totals, taxes, and discounts calculated automatically
                    </p>
                  </div>
                </div>

                <h2>Getting started</h2>
                <p>
                  Access the invoice builder by:
                </p>
                <ol>
                  <li>Clicking <strong>"New Invoice"</strong> from your dashboard</li>
                  <li>Using the <strong>Plus (+)</strong> icon in the navigation</li>
                  <li>Keyboard shortcut: <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + N</kbd></li>
                  <li>From the invoices list, click <strong>"Create Invoice"</strong></li>
                </ol>

                <h2>Section 1: Invoice header</h2>
                <p>
                  The top section contains your business information and invoice metadata:
                </p>

                <h3>Your business details</h3>
                <ul>
                  <li><strong>Company name/Your name:</strong> Pulled from your account settings</li>
                  <li><strong>Business address:</strong> Your registered business address</li>
                  <li><strong>Contact information:</strong> Phone, email, website</li>
                  <li><strong>Logo:</strong> Upload your company logo (Business accounts)</li>
                </ul>

                <h3>Invoice metadata</h3>
                <ul>
                  <li><strong>Invoice number:</strong> Auto-generated, customizable format</li>
                  <li><strong>Invoice date:</strong> Defaults to today, adjustable</li>
                  <li><strong>Due date:</strong> Based on your default payment terms</li>
                  <li><strong>Reference number:</strong> Optional project or PO reference</li>
                </ul>

                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="h-5 w-5 text-gray-700" />
                    <h4 className="font-semibold text-black">Customization tip</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    You can update your business details in Settings → Profile. 
                    Changes apply to all new invoices automatically.
                  </p>
                </div>

                <h2>Section 2: Client information</h2>
                <p>
                  Add or select client details for billing:
                </p>

                <h3>Client search</h3>
                <p>
                  Start typing in the client field to search existing clients. 
                  Plaen will show matching results and auto-fill all information 
                  when you select a client.
                </p>

                <h3>New client fields</h3>
                <ul>
                  <li><strong>Client name:</strong> Individual or company name</li>
                  <li><strong>Email address:</strong> Primary contact email</li>
                  <li><strong>Billing address:</strong> Complete address for records</li>
                  <li><strong>Phone number:</strong> Contact number (optional)</li>
                  <li><strong>Tax ID:</strong> Business registration number (optional)</li>
                </ul>

                <h3>Client management</h3>
                <p>
                  New clients are automatically saved to your contacts. You can:
                </p>
                <ul>
                  <li>Edit client information before saving</li>
                  <li>Add internal notes about the client</li>
                  <li>Set default payment terms for this client</li>
                  <li>Assign clients to specific projects or categories</li>
                </ul>

                <h2>Section 3: Line items</h2>
                <p>
                  The heart of your invoice - products and services you're billing for:
                </p>

                <h3>Adding items</h3>
                <p>
                  Click <strong>"Add Item"</strong> to create a new line. Each line contains:
                </p>
                <ul>
                  <li><strong>Description:</strong> What you're charging for</li>
                  <li><strong>Quantity:</strong> Number of units (hours, pieces, etc.)</li>
                  <li><strong>Rate:</strong> Price per unit</li>
                  <li><strong>Amount:</strong> Automatically calculated (Qty × Rate)</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">Item descriptions</h3>
                <p className="text-lg leading-8 text-gray-700 mb-8">Write clear, professional descriptions:</p>
                <div className="not-prose my-8 space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-3 flex items-center gap-3 font-semibold text-black">
                      <CheckCircle className="h-5 w-5 text-gray-600" aria-hidden="true" />
                      Good examples
                    </div>
                    <div className="text-gray-700 leading-6">
                      • "Website design and development - Homepage and 5 interior pages"<br/>
                      • "Marketing consultation - Q4 strategy planning session"<br/>
                      • "Logo design with 3 concept variations and final files"
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-3 flex items-center gap-3 font-semibold text-black">
                      <XCircle className="h-5 w-5 text-gray-600" aria-hidden="true" />
                      Avoid these
                    </div>
                    <div className="text-gray-700 leading-6">
                      • "Work"<br/>
                      • "Design stuff"<br/>
                      • "Project"
                    </div>
                  </div>
                </div>

                <h3>Managing multiple items</h3>
                <ul>
                  <li><strong>Reorder items:</strong> Drag and drop to rearrange</li>
                  <li><strong>Duplicate items:</strong> Copy similar services or products</li>
                  <li><strong>Delete items:</strong> Remove unwanted lines</li>
                  <li><strong>Item templates:</strong> Save common items for reuse</li>
                </ul>

                <h2>Section 4: Calculations and totals</h2>
                <p>
                  Plaen automatically handles all calculations:
                </p>

                <h3>Subtotal</h3>
                <p>
                  Sum of all line item amounts before taxes and adjustments.
                </p>

                <h3>Discounts</h3>
                <p>
                  Apply discounts as:
                </p>
                <ul>
                  <li><strong>Percentage:</strong> 10% off total</li>
                  <li><strong>Fixed amount:</strong> GHS 500 discount</li>
                  <li><strong>Per-item:</strong> Different discounts per line item</li>
                </ul>

                <h3>Taxes</h3>
                <p>
                  Configure tax settings:
                </p>
                <ul>
                  <li><strong>VAT/Sales tax:</strong> Standard rate or custom percentage</li>
                  <li><strong>Multiple tax rates:</strong> Different rates for different items</li>
                  <li><strong>Tax-inclusive pricing:</strong> Include tax in the displayed rate</li>
                  <li><strong>Tax exemptions:</strong> Mark certain items as tax-free</li>
                </ul>

                <h3>Final total</h3>
                <p>
                  The amount the client needs to pay, including all adjustments.
                </p>

                <h2>Section 5: Payment and terms</h2>

                <h3>Payment methods</h3>
                <p>
                  Select which payment methods to display:
                </p>
                <ul>
                  <li>Mobile money (MTN, Vodafone, AirtelTigo)</li>
                  <li>Bank transfer details</li>
                  <li>Cryptocurrency addresses</li>
                  <li>Custom payment instructions</li>
                </ul>

                <h3>Payment terms</h3>
                <p>Choose from standard terms or create custom ones:</p>
                <ul>
                  <li><strong>Due immediately:</strong> Payment on receipt</li>
                  <li><strong>Net 15/30/60:</strong> Payment due within specified days</li>
                  <li><strong>Custom due date:</strong> Specific calendar date</li>
                  <li><strong>Partial payments:</strong> Milestone-based payments</li>
                </ul>

                <h2>Section 6: Notes and customization</h2>

                <h3>Invoice notes</h3>
                <p>Add helpful information for your client:</p>
                <ul>
                  <li>Project details or deliverables</li>
                  <li>Thank you message</li>
                  <li>Next steps or follow-up actions</li>
                  <li>Contact information for questions</li>
                </ul>

                <h3>Terms and conditions</h3>
                <p>
                  Add standard terms like:
                </p>
                <ul>
                  <li>Late payment fees</li>
                  <li>Refund policy</li>
                  <li>Intellectual property rights</li>
                  <li>Limitation of liability</li>
                </ul>

                <h2>Preview and finalization</h2>
                <p>
                  Before sending, always preview your invoice:
                </p>

                <ol>
                  <li>Click <strong>"Preview"</strong> to see the client view</li>
                  <li>Check all calculations and totals</li>
                  <li>Verify client contact information</li>
                  <li>Review payment methods and terms</li>
                  <li>Proofread all text for errors</li>
                </ol>

                <h2>Keyboard shortcuts</h2>
                <p>Speed up invoice creation with these shortcuts:</p>
                <div className="not-prose my-6 grid gap-3 md:grid-cols-2 text-sm">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="font-medium">Add new item</div>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd> (from last field)
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="font-medium">Save draft</div>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + S</kbd>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="font-medium">Preview invoice</div>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + P</kbd>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="font-medium">Send invoice</div>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + Enter</kbd>
                  </div>
                </div>

                <h2>Best practices</h2>
                <ul>
                  <li><strong>Save early and often:</strong> Use draft mode while building</li>
                  <li><strong>Double-check math:</strong> Even though it's automated</li>
                  <li><strong>Be descriptive:</strong> Clear item descriptions prevent confusion</li>
                  <li><strong>Set realistic due dates:</strong> Give clients time to process payment</li>
                  <li><strong>Include contact info:</strong> Make it easy for clients to reach you</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg">
                      Talk to our team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/items-totals">
                    <Button size="lg" variant="outline">
                      Learn about calculations
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