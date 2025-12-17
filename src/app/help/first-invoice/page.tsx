import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Send, ArrowRight, CheckCircle, Eye } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function FirstInvoicePage() {
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
                  Getting Started
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#14462a]">
                  Your first invoice
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Walk through creating, customizing, and sending your first professional 
                  invoice with Plaen's intuitive invoice builder.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Before you start</h2>
                <p>
                  Make sure you've completed these setup steps:
                </p>
                <div className="not-prose my-6 grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:grid-cols-2">
                  {["Created your Plaen account", "Verified your email address", "Connected at least one payment method", "Added your business information (if applicable)"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-4 w-4 text-gray-600" aria-hidden="true" />
                      <p className="text-sm leading-[1.8] text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <p>
                  If you haven't completed these steps, check out our 
                  <a href="/help/creating-account">account creation</a> and 
                  <a href="/help/payment-setup">payment setup</a> guides first.
                </p>

                <h2>Step 1: Start a new invoice</h2>
                <p>
                  From your Plaen dashboard:
                </p>
                <ol>
                  <li>Click the <strong>"New Invoice"</strong> button (usually a prominent button in the top right)</li>
                  <li>Or use the <strong>Plus (+)</strong> icon in the sidebar</li>
                  <li>Select <strong>"Create Invoice"</strong> from the menu</li>
                </ol>

                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Plus className="h-5 w-5 text-gray-700" />
                    <h4 className="font-semibold text-black">Pro tip</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    You can also use the keyboard shortcut <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Ctrl + N</kbd> 
                    (or <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Cmd + N</kbd> on Mac) to quickly create a new invoice.
                  </p>
                </div>

                <h2>Step 2: Add client information</h2>
                <p>
                  The first section of your invoice is client details:
                </p>

                <h3>New client</h3>
                <p>If this is a new client, you'll need to add:</p>
                <ul>
                  <li><strong>Client name:</strong> Individual name or company name</li>
                  <li><strong>Email address:</strong> Where the invoice will be sent</li>
                  <li><strong>Address:</strong> Billing address (optional but recommended)</li>
                  <li><strong>Phone number:</strong> Contact number (optional)</li>
                </ul>

                <h3>Existing client</h3>
                <p>
                  If you've invoiced this client before, start typing their name and 
                  select them from the dropdown. All their information will be auto-filled.
                </p>

                <h2>Step 3: Add invoice items</h2>
                <p>
                  Now add the products or services you're billing for:
                </p>

                <ol>
                  <li><strong>Item description:</strong> Clearly describe what you're charging for</li>
                  <li><strong>Quantity:</strong> Number of units (hours, pieces, etc.)</li>
                  <li><strong>Rate:</strong> Price per unit</li>
                  <li><strong>Amount:</strong> Total for this line (calculated automatically)</li>
                </ol>

                <h3>Example line items:</h3>
                <div className="not-prose my-6 space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                    <div className="font-medium">Web Design - Homepage</div>
                    <div className="text-gray-700">Qty: 1 × Rate: GHS 2,500 = <strong>GHS 2,500</strong></div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                    <div className="font-medium">Consultation Hours</div>
                    <div className="text-gray-700">Qty: 5 × Rate: GHS 200 = <strong>GHS 1,000</strong></div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                    <div className="font-medium">Logo Design Revisions</div>
                    <div className="text-gray-700">Qty: 3 × Rate: GHS 150 = <strong>GHS 450</strong></div>
                  </div>
                </div>

                <p>
                  Click <strong>"Add Item"</strong> to add more line items. You can add as many 
                  items as needed for your invoice.
                </p>

                <h2>Step 4: Set payment terms</h2>
                <p>
                  Configure when and how you want to be paid:
                </p>

                <h3>Due date</h3>
                <ul>
                  <li><strong>Due immediately:</strong> Payment expected upon receipt</li>
                  <li><strong>Net 15:</strong> Payment due within 15 days</li>
                  <li><strong>Net 30:</strong> Payment due within 30 days (most common)</li>
                  <li><strong>Custom date:</strong> Pick a specific due date</li>
                </ul>

                <h3>Payment methods</h3>
                <p>
                  Select which payment methods to show on this invoice. You can choose 
                  from the payment methods you've set up in your account.
                </p>

                <h2>Step 5: Add notes and customization</h2>
                
                <h3>Invoice notes</h3>
                <p>Add any additional information for your client:</p>
                <ul>
                  <li>Project details or specifications</li>
                  <li>Thank you message</li>
                  <li>Next steps or deliverables</li>
                  <li>Contact information for questions</li>
                </ul>

                <h3>Invoice number</h3>
                <p>
                  Plaen automatically generates invoice numbers, but you can customize 
                  the format in your settings. Common formats include:
                </p>
                <ul>
                  <li>INV-001, INV-002, INV-003</li>
                  <li>2024-001, 2024-002, 2024-003</li>
                  <li>Your initials + number (JD-001)</li>
                </ul>

                <h2>Step 6: Preview your invoice</h2>
                <p>
                  Before sending, always preview your invoice:
                </p>

                <ol>
                  <li>Click <strong>"Preview"</strong> to see how it will look to your client</li>
                  <li>Check all amounts and calculations</li>
                  <li>Verify client information is correct</li>
                  <li>Review payment methods and due date</li>
                  <li>Read through any notes or terms</li>
                </ol>

                <div className="not-prose my-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <div className="flex gap-4">
                    <Eye className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black mb-3">Preview checklist</h4>
                      <ul className="text-gray-700 space-y-2">
                        <li>• Are all amounts correct?</li>
                        <li>• Is the client email address right?</li>
                        <li>• Do the payment methods show correctly?</li>
                        <li>• Is the due date appropriate?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2>Step 7: Send your invoice</h2>
                <p>
                  When you're satisfied with the preview, you have several options:
                </p>

                <h3>Send via email</h3>
                <ol>
                  <li>Click <strong>"Send Invoice"</strong></li>
                  <li>Review the email message (you can customize it)</li>
                  <li>Click <strong>"Send Now"</strong> to deliver immediately</li>
                  <li>Or schedule it to send later</li>
                </ol>

                <h3>Share via link</h3>
                <ol>
                  <li>Click <strong>"Get Shareable Link"</strong></li>
                  <li>Copy the secure link</li>
                  <li>Share via WhatsApp, SMS, or any messaging app</li>
                </ol>

                <h3>Download PDF</h3>
                <ol>
                  <li>Click <strong>"Download PDF"</strong></li>
                  <li>Print or save the PDF</li>
                  <li>Send via your preferred method</li>
                </ol>

                <h2>After sending</h2>
                <p>
                  Once your invoice is sent, you can track its progress:
                </p>

                <div className="not-prose my-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                    <Send className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                    <div className="font-medium text-sm">Sent</div>
                    <div className="text-xs text-gray-500">Invoice delivered</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                    <Eye className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                    <div className="font-medium text-sm">Viewed</div>
                    <div className="text-xs text-gray-500">Client opened it</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                    <div className="font-medium text-sm">Paid</div>
                    <div className="text-xs text-gray-500">Payment received</div>
                  </div>
                </div>

                <h2>Payment reminders</h2>
                <p>
                  Plaen automatically sends payment reminders for overdue invoices. 
                  You can also send manual reminders or follow up with clients directly.
                </p>

                <h2>Common first invoice mistakes</h2>
                <ul>
                  <li><strong>Wrong client email:</strong> Double-check the email address</li>
                  <li><strong>Unclear descriptions:</strong> Be specific about what you're charging for</li>
                  <li><strong>Missing payment methods:</strong> Make sure clients know how to pay</li>
                  <li><strong>Unrealistic due dates:</strong> Give clients reasonable time to pay</li>
                  <li><strong>Missing contact info:</strong> Include ways for clients to reach you with questions</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg">
                      Talk to our team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/invoice-builder">
                    <Button size="lg" variant="outline">
                      Learn about invoice builder
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