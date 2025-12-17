import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CreditCard, Smartphone, Bitcoin, Building2, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const paymentMethods = [
  {
    name: "Mobile Money",
    description: "Accept payments through MTN, Vodafone, AirtelTigo, and other mobile money services across Africa.",
    icon: Smartphone,
    color: "#059669", // Green
    features: [
      "Instant payments in seconds",
      "No bank account required for clients", 
      "Available 24/7 including weekends",
      "Low transaction fees (1-3%)"
    ]
  },
  {
    name: "Bank Transfers",
    description: "Direct bank-to-bank transfers for traditional banking customers and larger transactions.",
    icon: Building2,
    color: "#14462a", // Blue
    features: [
      "Secure bank-grade encryption",
      "Support for local and international transfers",
      "Automated reconciliation",
      "Detailed transaction records"
    ]
  },
  {
    name: "Cryptocurrency",
    description: "Accept Bitcoin, USDC, and other cryptocurrencies for global, borderless payments.",
    icon: Bitcoin,
    color: "#F59E0B", // Orange
    features: [
      "Global accessibility",
      "Fast settlement times",
      "Lower fees for international payments",
      "Transparent blockchain records"
    ]
  },
  {
    name: "Credit & Debit Cards", 
    description: "Traditional card payments for customers who prefer using Visa, Mastercard, or local cards.",
    icon: CreditCard,
    color: "#14462a", // Purple
    features: [
      "Wide customer acceptance",
      "Instant payment confirmation",
      "Fraud protection included",
      "Support for international cards"
    ]
  }
];

export default function PaymentsPage() {
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
                <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl mb-6">
                  Payment Methods
                </h1>
                <p className="text-xl leading-8 text-gray-700">
                  Learn about the different ways your clients can pay you through Plaen. We support multiple 
                  payment methods to ensure you can accept payments from customers anywhere in the world.
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                
                <h2 className="text-2xl font-semibold text-black mb-8 mt-16 first:mt-0">
                  Overview
                </h2>
                
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Plaen supports multiple payment methods to give your clients flexibility and ensure you get paid 
                  quickly and securely. Each payment method is designed to work seamlessly across different regions 
                  and client preferences.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Whether your clients prefer mobile money, bank transfers, or cryptocurrency, we've got you covered. 
                  Our payment infrastructure handles all the complexity while you focus on delivering great work.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  Payment Methods
                </h2>
                
                <div className="not-prose space-y-12">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div 
                        key={method.name} 
                        className="border-l-4 pl-8"
                        style={{ borderColor: method.color }}
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <div 
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: method.color }}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-black mb-3">{method.name}</h3>
                            <p className="text-lg leading-7 text-gray-700">{method.description}</p>
                          </div>
                        </div>
                        
                        <div className="ml-16">
                          <h4 className="text-lg font-semibold text-black mb-4">Key features:</h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {method.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <CheckCircle 
                                  className="h-4 w-4 flex-shrink-0" 
                                  style={{ color: method.color }}
                                />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Setting Up Payment Methods
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  To start accepting payments, you'll need to set up at least one payment method in your Plaen account. 
                  We recommend enabling multiple payment methods to give your clients options and increase your 
                  payment success rate.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 1: Access Payment Settings
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-6">
                  Navigate to your account settings and select "Payment Methods" from the menu. Here you'll see 
                  all available payment options for your region.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 2: Connect Your Accounts
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-6">
                  For each payment method you want to enable, you'll need to provide the necessary account information. 
                  This might include bank account details, mobile money numbers, or cryptocurrency wallet addresses.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 3: Verify and Test
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  Once you've added your payment methods, we recommend sending yourself a test invoice to ensure 
                  everything is working correctly. This helps identify any issues before your first real payment.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Payment Fees
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Payment processing fees vary by method and region. Generally, mobile money has the lowest fees 
                  (1-3%), followed by bank transfers (2-4%), and card payments (2.9% + $0.30). Cryptocurrency 
                  fees depend on network conditions but are typically very low for stablecoins.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  All fees are clearly displayed before you enable each payment method, and there are no hidden charges. 
                  You can see detailed fee information in your payment settings.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Need Help?
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  If you need assistance setting up payment methods or have questions about fees and processing times, 
                  our support team is here to help. You can contact us through the chat widget or email us at 
                  <a href="mailto:support@plaen.tech" className="text-black underline"> support@plaen.tech</a>.
                </p>

                <div className="not-prose mt-16 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg">
                      Talk to our team
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