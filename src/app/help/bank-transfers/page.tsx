"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Building2, Shield, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const transferTypes = [
  {
    name: "Domestic Transfers",
    description: "Bank transfers within the same country, usually processed within 1-2 business days.",
    features: [
      "Lower fees than international transfers",
      "Faster processing times",
      "Direct bank-to-bank transfer",
      "Real-time status updates"
    ]
  },
  {
    name: "International Transfers", 
    description: "Cross-border payments using SWIFT network, typically taking 3-5 business days.",
    features: [
      "Global reach to 200+ countries",
      "Competitive exchange rates",
      "Full transaction tracking",
      "Regulatory compliance included"
    ]
  }
];

const supportedCountries = [
  "Ghana", "Nigeria", "Kenya", "South Africa", "Uganda", "Tanzania",
  "United States", "United Kingdom", "Canada", "Germany", "France", "Netherlands"
];

export default function BankTransfersPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      
      <div className="bg-white">
        <main>
          {/* Article Header */}
          <section className="border-b border-gray-200 bg-gray-50 py-16">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-8">
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Help Center
                </Link>
              </div>
              
              <div className="max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl mb-6">
                  Bank Transfers
                </h1>
                <p className="text-xl leading-8 text-gray-700">
                  Accept direct bank transfers from your clients anywhere in the world. Bank transfers are 
                  secure, reliable, and perfect for larger transactions and business clients.
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                
                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  What Are Bank Transfers?
                </h2>
                
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Bank transfers allow your clients to send payments directly from their bank account to yours. 
                  This payment method is widely trusted, especially for business-to-business transactions and 
                  larger amounts where clients prefer the security and familiarity of traditional banking.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  With Plaen, you can accept both domestic and international bank transfers. We handle all the 
                  complexity of banking networks, compliance, and reconciliation, so you can focus on your business 
                  while we ensure you get paid safely and on time.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  Types of Bank Transfers
                </h2>

                <div className="not-prose space-y-12">
                  {transferTypes.map((transfer, index) => (
                    <div key={transfer.name} className="border-l-4 border-gray-200 pl-8">
                      <h3 className="text-2xl font-semibold text-black mb-4">{transfer.name}</h3>
                      <p className="text-lg leading-7 text-gray-700 mb-6">{transfer.description}</p>
                      
                      <div className="space-y-3">
                        {transfer.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  How Bank Transfers Work
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  When you send an invoice with bank transfer as a payment option, your client will receive 
                  detailed banking instructions including your account details, reference numbers, and any 
                  specific information needed for the transfer.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 1: Client Initiates Transfer
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  Your client logs into their online banking or visits their bank branch to initiate the transfer. 
                  They'll use the banking details provided in your invoice, including the reference number to 
                  ensure proper identification of the payment.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 2: Transfer Processing
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  The bank processes the transfer through secure banking networks. Domestic transfers typically 
                  clear within 1-2 business days, while international transfers may take 3-5 business days 
                  depending on the countries involved.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 3: Automatic Reconciliation
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-12">
                  Once the transfer arrives in your account, Plaen automatically matches it to the corresponding 
                  invoice using the reference number. Both you and your client receive confirmation, and the 
                  invoice is marked as paid.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Setting Up Bank Transfers
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  To accept bank transfers, you'll need to provide your banking details in your Plaen account. 
                  This includes your bank name, account number, routing information, and any other details 
                  required for transfers in your region.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  For international transfers, you may also need to provide your bank's SWIFT code and 
                  correspondent banking information. Don't worry - we'll guide you through exactly what 
                  information is needed based on your location.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Supported Countries
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  We currently support bank transfers in the following countries and regions:
                </p>

                <div className="not-prose mb-12">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {supportedCountries.map((country) => (
                        <div key={country} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{country}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex items-start gap-3 rounded-lg bg-gray-100 border border-gray-200 p-6">
                      <AlertCircle className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div className="text-gray-700">
                        <p className="font-medium mb-2">Expanding Coverage</p>
                        <p className="text-sm">
                          We're constantly adding support for more countries and banking networks. 
                          Contact us if your country isn't listed above.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Fees and Processing Times
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Bank transfer fees vary depending on whether the transfer is domestic or international. 
                  Domestic transfers typically cost 1-2% of the transfer amount, while international transfers 
                  may cost 2-4% plus a small fixed fee for currency conversion if applicable.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Processing times are generally predictable: domestic transfers process within 1-2 business days, 
                  while international transfers take 3-5 business days. All transfers are subject to banking hours 
                  and may be delayed during weekends and bank holidays.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Security and Compliance
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Bank transfers are among the most secure payment methods available. All transfers are processed 
                  through established banking networks with multiple layers of fraud protection and regulatory oversight.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  We comply with international banking regulations including Anti-Money Laundering (AML) and 
                  Know Your Customer (KYC) requirements. This ensures that all transfers are legitimate and 
                  helps protect both you and your clients.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Need Help?
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  If you need help setting up bank transfers or have questions about fees and processing times, 
                  our support team is ready to assist you. Contact us through the chat widget or email 
                  <a href="mailto:support@plaen.com" className="text-black underline"> support@plaen.com</a>.
                </p>

                <div className="not-prose mt-16 flex flex-col gap-4 sm:flex-row">
                  <Link href="/onboarding">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-900">
                      Set up bank transfers
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button size="lg" variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                      More guides
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