import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function MtnSetupPage() {
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
                  Setting up MTN Mobile Money for business
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Step-by-step guide to accepting MTN Mobile Money payments for your 
                  business invoices with Plaen.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>6 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Prerequisites</h2>
                <p>
                  Before setting up MTN Mobile Money for business payments, ensure you have:
                </p>
                <ul>
                  <li>Active MTN SIM card registered in your name</li>
                  <li>Valid Ghana Card or other acceptable ID</li>
                  <li>MTN Mobile Money account with sufficient transaction limits</li>
                  <li>Business registration documents (for higher limits)</li>
                </ul>

                <h2>MTN Mobile Money account setup</h2>
                
                <h3>1. Register your MTN Mobile Money account</h3>
                <p>
                  If you don't have MTN Mobile Money yet:
                </p>
                <ol>
                  <li>Visit any MTN service center with your Ghana Card</li>
                  <li>Request Mobile Money registration</li>
                  <li>Set up your 4-digit PIN</li>
                  <li>Verify your account via SMS</li>
                </ol>

                <h3>2. Upgrade to business limits</h3>
                <p>
                  For business use, upgrade your account limits:
                </p>
                <ul>
                  <li><strong>Standard limit:</strong> GHS 2,000 per day</li>
                  <li><strong>Enhanced limit:</strong> GHS 10,000 per day (requires business registration)</li>
                  <li><strong>Premium limit:</strong> GHS 50,000+ per day (requires additional documentation)</li>
                </ul>

                <h2>Adding MTN Mobile Money to Plaen</h2>
                
                <h3>Step 1: Access payment settings</h3>
                <ol>
                  <li>Log into your Plaen dashboard</li>
                  <li>Click Settings → Payment Methods</li>
                  <li>Find the Mobile Money section</li>
                  <li>Click "Add MTN Mobile Money"</li>
                </ol>

                <h3>Step 2: Enter your MTN details</h3>
                <ul>
                  <li><strong>Mobile number:</strong> Your MTN number (024XXXXXXX format)</li>
                  <li><strong>Account name:</strong> Name as registered with MTN</li>
                  <li><strong>Business name:</strong> Optional display name for clients</li>
                  <li><strong>Reference format:</strong> How you want payment references to appear</li>
                </ul>

                <h3>Step 3: Verify your account</h3>
                <p>
                  Plaen will send a small test payment to verify ownership:
                </p>
                <ol>
                  <li>Click "Send Verification Payment"</li>
                  <li>You'll receive GHS 1.00 from Plaen</li>
                  <li>Enter the verification code received via SMS</li>
                  <li>Your MTN Mobile Money is now active</li>
                </ol>

                <h2>Optimizing MTN Mobile Money for invoices</h2>
                
                <h3>Payment instructions</h3>
                <p>
                  Include clear MTN payment steps on your invoices:
                </p>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-semibold text-black mb-3">MTN Mobile Money Payment Instructions:</h4>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. Dial *170# on your MTN phone</li>
                    <li>2. Select option 1 (Send Money)</li>
                    <li>3. Enter recipient number: 024-XXX-XXXX</li>
                    <li>4. Enter amount: GHS XXX.XX</li>
                    <li>5. Enter reference: Invoice #INV-001</li>
                    <li>6. Confirm with your MTN Mobile Money PIN</li>
                    <li>7. You'll receive SMS confirmation</li>
                  </ol>
                </div>

                <h3>Reference formatting</h3>
                <p>
                  Use consistent reference formats to track payments:
                </p>
                <ul>
                  <li><strong>Invoice number:</strong> INV-001, INV-002</li>
                  <li><strong>Client code + invoice:</strong> ABC-001, XYZ-002</li>
                  <li><strong>Your initials + number:</strong> JS-001, MA-015</li>
                  <li><strong>Project references:</strong> LOGO-DESIGN-001</li>
                </ul>

                <h2>Transaction limits and fees</h2>
                
                <h3>MTN Mobile Money limits</h3>
                <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Standard Account</h4>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Daily limit: GHS 2,000</li>
                      <li>• Monthly limit: GHS 5,000</li>
                      <li>• Single transaction: GHS 1,000</li>
                      <li>• Account balance: GHS 10,000</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Enhanced Account</h4>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>• Daily limit: GHS 10,000</li>
                      <li>• Monthly limit: GHS 30,000</li>
                      <li>• Single transaction: GHS 5,000</li>
                      <li>• Account balance: GHS 50,000</li>
                    </ul>
                  </div>
                </div>

                <h3>Transaction fees</h3>
                <p>MTN Mobile Money receiving fees:</p>
                <ul>
                  <li><strong>GHS 1 - 100:</strong> Free to receive</li>
                  <li><strong>GHS 101 - 500:</strong> 1% of amount</li>
                  <li><strong>GHS 501 - 1,000:</strong> 1% capped at GHS 5</li>
                  <li><strong>Above GHS 1,000:</strong> 0.5% capped at GHS 10</li>
                </ul>

                <h2>Managing MTN Mobile Money payments</h2>
                
                <h3>Payment tracking</h3>
                <p>
                  Monitor payments through multiple channels:
                </p>
                <ul>
                  <li><strong>SMS notifications:</strong> Instant payment alerts</li>
                  <li><strong>MTN app:</strong> Transaction history and details</li>
                  <li><strong>Plaen dashboard:</strong> Automatic payment matching</li>
                  <li><strong>Monthly statements:</strong> Request from MTN for records</li>
                </ul>

                <h3>Payment confirmation process</h3>
                <ol>
                  <li>Client sends payment via MTN Mobile Money</li>
                  <li>You receive SMS confirmation instantly</li>
                  <li>Plaen automatically matches payment to invoice</li>
                  <li>Invoice status updates to "Paid"</li>
                  <li>Client receives payment receipt via email</li>
                </ol>

                <h2>Troubleshooting common issues</h2>
                
                <h3>Payment not received</h3>
                <ul>
                  <li>Check if client used correct mobile number</li>
                  <li>Verify the amount matches invoice total</li>
                  <li>Confirm client received SMS confirmation</li>
                  <li>Contact MTN customer service if needed</li>
                </ul>

                <h3>Wrong reference number</h3>
                <ul>
                  <li>Manually match payment in Plaen dashboard</li>
                  <li>Contact client for transaction details</li>
                  <li>Use MTN transaction ID for tracking</li>
                  <li>Update invoice status manually</li>
                </ul>

                <h3>Partial payments</h3>
                <ul>
                  <li>Mark invoice as partially paid in Plaen</li>
                  <li>Send client remaining balance details</li>
                  <li>Create new invoice for outstanding amount</li>
                  <li>Track partial payments with clear references</li>
                </ul>

                <h2>Security best practices</h2>
                <ul>
                  <li><strong>Keep PIN secret:</strong> Never share your MTN Mobile Money PIN</li>
                  <li><strong>Verify transactions:</strong> Always check SMS confirmations</li>
                  <li><strong>Regular monitoring:</strong> Check account balance frequently</li>
                  <li><strong>Report issues:</strong> Contact MTN immediately for suspicious activity</li>
                  <li><strong>Backup records:</strong> Keep transaction records for tax purposes</li>
                </ul>

                <h2>Upgrading your limits</h2>
                
                <h3>Required documents for enhanced limits</h3>
                <ul>
                  <li>Business registration certificate</li>
                  <li>Tax identification number (TIN)</li>
                  <li>Bank account details</li>
                  <li>Valid ID of business owner</li>
                  <li>Proof of business address</li>
                </ul>

                <h3>Application process</h3>
                <ol>
                  <li>Visit MTN business center with documents</li>
                  <li>Complete enhanced account application</li>
                  <li>Wait for approval (1-3 business days)</li>
                  <li>Receive SMS confirmation of limit upgrade</li>
                  <li>Update limits in Plaen payment settings</li>
                </ol>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/payment-setup">
                    <Button size="lg">
                      Complete payment setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/mobile-money">
                    <Button size="lg" variant="outline">
                      Mobile money overview
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