"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Smartphone, Building2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function PaymentSetupPage() {
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
                  <CreditCard className="h-3 w-3" />
                  Getting Started
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Setting up payment methods
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Configure your preferred payment methods to start receiving payments 
                  from clients quickly and securely.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>4 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Available payment methods</h2>
                <p>
                  Plaen supports multiple payment methods to accommodate different client 
                  preferences and regional requirements. You can enable any combination 
                  of these methods for your invoices.
                </p>

                <div className="not-prose my-8 space-y-6">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <Smartphone className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">Mobile Money</h3>
                        <p className="text-sm text-gray-700">MTN, Vodafone, AirtelTigo</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Most popular payment method in Ghana with instant transfers and low fees.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span>Instant payments • Low fees • High acceptance</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <Building2 className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">Bank Transfers</h3>
                        <p className="text-sm text-gray-700">Local and international banks</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Traditional banking for larger amounts and international clients.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span>Large amounts • International • Secure</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <CreditCard className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">Cryptocurrency</h3>
                        <p className="text-sm text-gray-700">Bitcoin, Ethereum, USDC</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Global payments with fast settlement and low cross-border fees.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span>Global • Fast • Low fees</span>
                    </div>
                  </div>
                </div>

                <h2>Setting up mobile money</h2>
                <p>
                  Mobile money is the fastest and most convenient payment method for 
                  Ghanaian clients. Here's how to set it up:
                </p>

                <ol>
                  <li><strong>Go to Payment Settings:</strong> From your dashboard, click Settings → Payment Methods</li>
                  <li><strong>Enable Mobile Money:</strong> Toggle on the mobile money option</li>
                  <li><strong>Add your numbers:</strong> Enter your MTN, Vodafone, and/or AirtelTigo numbers</li>
                  <li><strong>Verify ownership:</strong> We'll send a small test transaction to verify each number</li>
                  <li><strong>Set preferences:</strong> Choose which networks to display on invoices</li>
                </ol>

                <div className="not-prose my-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black mb-2">Important</h4>
                      <p className="text-gray-700 leading-6">
                        Make sure the mobile money numbers you add are registered in your name 
                        and have sufficient transaction limits for your business needs.
                      </p>
                    </div>
                  </div>
                </div>

                <h2>Setting up bank transfers</h2>
                <p>
                  Bank transfers are ideal for larger payments and international clients:
                </p>

                <ol>
                  <li><strong>Add bank details:</strong> Go to Settings → Payment Methods → Bank Transfer</li>
                  <li><strong>Enter account information:</strong> Bank name, account number, routing/sort code</li>
                  <li><strong>Add international details:</strong> SWIFT code for international transfers (optional)</li>
                  <li><strong>Set currency preferences:</strong> Choose which currencies you accept</li>
                  <li><strong>Enable automatic matching:</strong> We'll help match payments to invoices</li>
                </ol>

                <h3>Required information:</h3>
                <ul>
                  <li>Bank name and branch</li>
                  <li>Account holder name (must match your Plaen account)</li>
                  <li>Account number</li>
                  <li>Routing or sort code</li>
                  <li>SWIFT code (for international transfers)</li>
                </ul>

                <h2>Setting up cryptocurrency</h2>
                <p>
                  Cryptocurrency payments offer global reach and fast settlement:
                </p>

                <ol>
                  <li><strong>Create wallet addresses:</strong> Set up wallets for supported cryptocurrencies</li>
                  <li><strong>Add to Plaen:</strong> Go to Settings → Payment Methods → Cryptocurrency</li>
                  <li><strong>Enter addresses:</strong> Add your Bitcoin, Ethereum, and stablecoin addresses</li>
                  <li><strong>Set conversion preferences:</strong> Choose how to handle price conversions</li>
                  <li><strong>Enable notifications:</strong> Get alerts when payments are received</li>
                </ol>

                <h3>Supported cryptocurrencies:</h3>
                <ul>
                  <li>Bitcoin (BTC)</li>
                  <li>Ethereum (ETH)</li>
                  <li>USD Coin (USDC)</li>
                  <li>Tether (USDT)</li>
                </ul>

                <h2>Payment method recommendations</h2>
                
                <h3>For local Ghanaian clients:</h3>
                <ul>
                  <li>Enable all three mobile money networks (MTN, Vodafone, AirtelTigo)</li>
                  <li>Add at least one local bank account</li>
                  <li>Consider cryptocurrency for tech-savvy clients</li>
                </ul>

                <h3>For international clients:</h3>
                <ul>
                  <li>Set up bank transfers with SWIFT details</li>
                  <li>Enable major cryptocurrencies (Bitcoin, Ethereum, USDC)</li>
                  <li>Consider USD-pegged stablecoins for price stability</li>
                </ul>

                <h2>Testing your setup</h2>
                <p>
                  Before sending your first invoice, test your payment setup:
                </p>

                <ol>
                  <li>Create a test invoice with a small amount</li>
                  <li>Send it to yourself or a trusted friend</li>
                  <li>Make a small test payment using each method</li>
                  <li>Verify that payments are received and tracked correctly</li>
                  <li>Check that payment confirmations work properly</li>
                </ol>

                <h2>Security considerations</h2>
                <ul>
                  <li>Never share your private keys or wallet seeds</li>
                  <li>Use strong passwords for your bank and mobile money accounts</li>
                  <li>Enable two-factor authentication where available</li>
                  <li>Regularly monitor your accounts for unauthorized transactions</li>
                  <li>Keep your Plaen account login credentials secure</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/first-invoice">
                    <Button size="lg">
                      Create your first invoice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/payments">
                    <Button size="lg" variant="outline">
                      Learn about payment methods
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