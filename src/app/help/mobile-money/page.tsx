import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Smartphone, Clock, Shield, Globe, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const mobileMoneyProviders = [
  {
    name: "MTN Mobile Money",
    countries: ["Ghana", "Nigeria", "Uganda", "Rwanda"],
    description: "The largest mobile money network in Africa with over 50 million active users.",
    color: "#F59E0B", // Orange
    features: [
      "Instant transfers and payments",
      "Available 24/7 including weekends",
      "No bank account required",
      "Low transaction fees"
    ]
  },
  {
    name: "Vodafone Cash", 
    countries: ["Ghana", "Tanzania", "DRC"],
    description: "Reliable mobile money service with strong presence across multiple African markets.",
    color: "#DC2626", // Red
    features: [
      "Fast payment processing",
      "Secure PIN-based authentication", 
      "Wide agent network coverage",
      "Integration with banking services"
    ]
  },
  {
    name: "AirtelTigo Money",
    countries: ["Ghana"],
    description: "Merged mobile money service combining Airtel and Tigo networks in Ghana.",
    color: "#1877F2", // Blue
    features: [
      "Unified payment platform",
      "Enhanced network coverage",
      "Competitive transaction rates",
      "Reliable customer support"
    ]
  }
];

const advantages = [
  {
    title: "Instant Payments",
    description: "Mobile money payments are processed in real-time, often within seconds of initiation.",
    icon: Clock,
    color: "#F59E0B", // Orange
  },
  {
    title: "Universal Access",
    description: "No bank account required - clients only need a mobile phone to send payments.",
    icon: Smartphone,
    color: "#1877F2", // Blue
  },
  {
    title: "High Security",
    description: "Protected by PIN authentication and encrypted transactions for safe payments.",
    icon: Shield,
    color: "#7C3AED", // Purple
  },
  {
    title: "Wide Coverage",
    description: "Available across Africa with extensive agent networks for cash deposits and withdrawals.",
    icon: Globe,
    color: "#059669", // Green
  }
];

export default function MobileMoneyPage() {
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
                  Mobile Money Payments
                </h1>
                <p className="text-xl leading-8 text-gray-700">
                  Accept mobile money payments from clients across Africa using MTN, Vodafone, AirtelTigo, 
                  and other popular mobile money services. Fast, secure, and accessible to everyone.
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                
                <h2 className="text-2xl font-semibold text-black mb-8 mt-16 first:mt-0">
                  What is Mobile Money?
                </h2>
                
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Mobile money is a digital payment service that allows people to send, receive, and store money 
                  using their mobile phones. It's particularly popular in Africa where it has revolutionized 
                  financial services by providing access to digital payments without requiring a traditional bank account.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  For businesses, mobile money represents one of the fastest and most accessible ways to receive 
                  payments from clients. With over 300 million mobile money accounts across Africa, it's often 
                  the preferred payment method for both individuals and small businesses.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  Why Mobile Money Matters
                </h2>

                <div className="not-prose grid gap-8 sm:grid-cols-2 mb-16">
                  {advantages.map((advantage) => {
                    const Icon = advantage.icon;
                    return (
                      <div 
                        key={advantage.title} 
                        className="border-l-4 pl-6"
                        style={{ borderColor: advantage.color }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Icon 
                            className="h-6 w-6" 
                            style={{ color: advantage.color }}
                          />
                          <h3 className="text-xl font-semibold text-black">{advantage.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-8 text-lg">{advantage.description}</p>
                      </div>
                    );
                  })}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  Supported Mobile Money Services
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Plaen integrates with the major mobile money providers across Africa, ensuring you can 
                  accept payments from the widest possible audience:
                </p>

                <div className="not-prose space-y-12">
                  {mobileMoneyProviders.map((provider) => (
                    <div 
                      key={provider.name} 
                      className="border-l-4 pl-8"
                      style={{ borderColor: provider.color }}
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-black mb-2">{provider.name}</h3>
                        <p className="text-lg leading-7 text-gray-700 mb-3">{provider.description}</p>
                        <p className="text-gray-500">
                          <strong>Available in:</strong> {provider.countries.join(", ")}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {provider.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle 
                              className="h-4 w-4 flex-shrink-0" 
                              style={{ color: provider.color }}
                            />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  How Mobile Money Payments Work
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Mobile money payments through Plaen are designed to be simple for both you and your clients. 
                  Here's how the process works from start to finish:
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 1: Send Your Invoice
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  Create and send your invoice through Plaen with mobile money enabled as a payment option. 
                  Your client will receive the invoice with clear instructions on how to pay using their 
                  preferred mobile money service.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 2: Client Initiates Payment
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  Your client opens their mobile money app (MTN MoMo, Vodafone Cash, etc.) and enters your 
                  mobile money number and the payment amount. They'll use a reference number from your invoice 
                  to ensure proper identification.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 3: Real-time Processing
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  The payment is processed instantly through the mobile money network. You'll receive a 
                  confirmation SMS on your mobile money account, and Plaen automatically updates the 
                  invoice status to "Paid."
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 4: Automatic Notifications
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-12">
                  Both you and your client receive immediate confirmation of the successful payment. 
                  The funds are available in your mobile money account instantly and can be withdrawn 
                  at any agent location or transferred to your bank account.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Setting Up Mobile Money
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  To start accepting mobile money payments, you'll need to register for mobile money accounts 
                  with the providers you want to support. This typically involves:
                </p>

                <ul className="text-lg leading-7 text-gray-700 mb-12 space-y-2">
                  <li>• Visiting a mobile money agent or service center</li>
                  <li>• Providing identification documents</li>
                  <li>• Registering your SIM card for mobile money services</li>
                  <li>• Setting up a secure PIN for transactions</li>
                  <li>• Adding your mobile money numbers to your Plaen account</li>
                </ul>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Most mobile money registration is free, and you can typically register with multiple 
                  providers to give your clients more payment options.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Fees and Limits
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Mobile money transaction fees are generally very low, typically ranging from 0.5% to 2% 
                  of the transaction amount. The exact fee depends on the mobile money provider and the 
                  transaction amount.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Transaction limits vary by provider and account verification level. Basic accounts typically 
                  support transactions up to $500-1000 per day, while verified business accounts can handle 
                  larger amounts.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  There are no fees from Plaen for processing mobile money payments - you only pay the 
                  standard mobile money provider fees.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Security and Safety
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Mobile money transactions are secured with multiple layers of protection including PIN 
                  authentication, SMS verification, and encrypted data transmission. All major mobile money 
                  providers are regulated by central banks and follow strict security protocols.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  To keep your mobile money account secure, never share your PIN with anyone, always verify 
                  transaction details before confirming, and keep your mobile money SIM card in a secure location.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Troubleshooting Common Issues
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Most mobile money payments process smoothly, but here are solutions to common issues:
                </p>

                <ul className="text-lg leading-7 text-gray-700 mb-12 space-y-4">
                  <li>• <strong>Payment not received:</strong> Check that the client used the correct mobile money number and reference code</li>
                  <li>• <strong>Transaction failed:</strong> Ensure the client has sufficient balance and their account is active</li>
                  <li>• <strong>Delayed confirmation:</strong> Mobile money networks occasionally experience delays during peak hours</li>
                  <li>• <strong>Wrong amount received:</strong> Contact the mobile money provider to trace and potentially reverse the transaction</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Need Help?
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  If you need assistance setting up mobile money payments or troubleshooting issues, 
                  our support team is here to help. We can guide you through the registration process 
                  and help resolve any payment issues.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Contact us through the chat widget or email 
                  <a href="mailto:support@plaen.tech" className="text-black underline"> support@plaen.tech</a> 
                  for personalized assistance.
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