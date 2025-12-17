import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Bitcoin, Shield, Zap, Globe, AlertTriangle, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const supportedCryptos = [
  {
    name: "Bitcoin (BTC)",
    description: "The world's first and most trusted cryptocurrency, perfect for large transactions and long-term value storage.",
    icon: "₿",
    color: "#F59E0B", // Orange
    features: [
      "Highest liquidity and acceptance",
      "Proven track record since 2009", 
      "Global recognition and trust",
      "Ideal for larger payments"
    ]
  },
  {
    name: "USD Coin (USDC)",
    description: "A stable cryptocurrency pegged to the US Dollar, providing price stability and predictable value.",
    icon: "$",
    color: "#059669", // Green
    features: [
      "Price stable (pegged to USD)",
      "Fast and cheap transfers",
      "Widely accepted globally",
      "Perfect for business payments"
    ]
  },
  {
    name: "Ethereum (ETH)",
    description: "The second-largest cryptocurrency with smart contract capabilities and broad ecosystem support.",
    icon: "Ξ",
    color: "#14462a", // Purple
    features: [
      "Smart contract functionality",
      "Large developer ecosystem",
      "High transaction volume", 
      "DeFi integration capabilities"
    ]
  }
];

const advantages = [
  {
    title: "Global Payments",
    description: "Accept payments from anywhere in the world without traditional banking restrictions or currency conversion fees.",
    icon: Globe,
    color: "#14462a", // Blue
  },
  {
    title: "Fast Settlement",
    description: "Receive payments in minutes rather than days, with transactions confirmed on the blockchain in real-time.",
    icon: Zap,
    color: "#F59E0B", // Orange
  },
  {
    title: "Lower Fees",
    description: "Cryptocurrency payments typically cost 1-3% compared to 3-5% for traditional payment methods.",
    icon: Bitcoin,
    color: "#059669", // Green
  },
  {
    title: "Enhanced Security",
    description: "Blockchain technology provides cryptographic security and immutable transaction records.",
    icon: Shield,
    color: "#14462a", // Purple
  }
];

export default function CryptoPaymentsPage() {
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
                  Cryptocurrency Payments
                </h1>
                <p className="text-xl leading-8 text-gray-700">
                  Accept Bitcoin, Ethereum, stablecoins, and other cryptocurrencies from clients worldwide. 
                  Crypto payments offer fast, secure, and borderless transactions.
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-20">
            <div className="mx-auto max-w-4xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                
                <h2 className="text-2xl font-semibold text-black mb-8 mt-16 first:mt-0">
                  What Are Cryptocurrency Payments?
                </h2>
                
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Cryptocurrency payments allow your clients to pay you using digital currencies like Bitcoin, 
                  Ethereum, or stablecoins. These payments are processed on blockchain networks, providing 
                  transparency, security, and global accessibility without the need for traditional banking infrastructure.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Unlike traditional payments that require bank accounts and can take days to process, cryptocurrency 
                  payments settle in minutes and can be sent from anywhere in the world. This makes them particularly 
                  valuable for international business and clients in regions with limited banking access.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-16">
                  Why Accept Cryptocurrency?
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
                        <div className="flex items-center gap-3 mb-3">
                          <Icon 
                            className="h-6 w-6" 
                            style={{ color: advantage.color }}
                          />
                          <h3 className="text-xl font-semibold text-black">{advantage.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-7">{advantage.description}</p>
                      </div>
                    );
                  })}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Supported Cryptocurrencies
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  We support the most popular and stable cryptocurrencies to give your clients options while 
                  ensuring reliable, secure payments:
                </p>

                <div className="not-prose space-y-12">
                  {supportedCryptos.map((crypto) => (
                    <div 
                      key={crypto.name} 
                      className="border-l-4 pl-8"
                      style={{ borderColor: crypto.color }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div 
                          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white"
                          style={{ backgroundColor: crypto.color }}
                        >
                          {crypto.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-black mb-3">{crypto.name}</h3>
                          <p className="text-lg leading-7 text-gray-700">{crypto.description}</p>
                        </div>
                      </div>
                      
                      <div className="ml-16">
                        <div className="space-y-3">
                          {crypto.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle 
                                className="h-4 w-4 flex-shrink-0" 
                                style={{ color: crypto.color }}
                              />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  How to Set Up Crypto Payments
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Setting up cryptocurrency payments is straightforward. You'll need to create wallet addresses 
                  for the cryptocurrencies you want to accept, then connect these wallets to your Plaen account.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 1: Create Crypto Wallets
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  First, set up secure cryptocurrency wallets for each coin you want to accept. We recommend 
                  using hardware wallets for large amounts or reputable software wallets like MetaMask, 
                  Coinbase Wallet, or Trust Wallet for smaller amounts.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 2: Connect to Plaen
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-8">
                  In your Plaen account settings, navigate to Payment Methods and add your cryptocurrency 
                  wallet addresses. You'll need to provide the public wallet address for each cryptocurrency 
                  you want to accept - never share your private keys.
                </p>

                <h3 className="text-2xl font-semibold text-black mb-4 mt-12">
                  Step 3: Enable and Test
                </h3>
                
                <p className="text-lg leading-7 text-gray-700 mb-12">
                  Once your wallets are connected, enable cryptocurrency payments for your invoices. 
                  We recommend sending yourself a small test payment to ensure everything is working correctly 
                  before accepting real client payments.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Important Considerations
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  While cryptocurrency payments offer many advantages, there are some important factors to 
                  keep in mind when accepting crypto payments:
                </p>

                <div className="not-prose space-y-8 mb-16">
                  <div className="border-l-4 border-gray-200 pl-8">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">Price Volatility</h3>
                        <p className="text-gray-700 leading-7">
                          Cryptocurrency prices can fluctuate significantly. Consider using stablecoins like USDC 
                          for price stability, or convert to your local currency immediately upon receipt if you 
                          prefer predictable values.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-200 pl-8">
                    <div className="flex items-start gap-3 mb-3">
                      <Shield className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">Security Best Practices</h3>
                        <p className="text-gray-700 leading-7">
                          Use hardware wallets for large amounts, enable two-factor authentication on all accounts, 
                          and always verify wallet addresses before sharing them with clients. Double-check all 
                          transactions as cryptocurrency payments cannot be reversed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-200 pl-8">
                    <div className="flex items-start gap-3 mb-3">
                      <Globe className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">Regulatory Compliance</h3>
                        <p className="text-gray-700 leading-7">
                          Cryptocurrency regulations vary by country and are constantly evolving. Consult with 
                          a tax professional about reporting requirements and compliance obligations in your 
                          jurisdiction before accepting crypto payments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Fees and Processing Times
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Cryptocurrency transaction fees vary by network and current demand. Bitcoin fees typically 
                  range from $1-10 per transaction, while Ethereum fees can vary from $5-50 depending on 
                  network congestion. Stablecoin transfers on efficient networks often cost less than $1.
                </p>

                <p className="text-lg leading-8 text-gray-700 mb-12">
                  Processing times are generally much faster than traditional payments. Most cryptocurrency 
                  transactions confirm within 10-60 minutes, with some networks providing near-instant confirmation. 
                  This is significantly faster than bank transfers which can take 1-5 business days.
                </p>

                <h2 className="text-2xl font-semibold text-black mb-8 mt-20">
                  Need Help?
                </h2>

                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Setting up cryptocurrency payments can seem complex at first, but our support team is here 
                  to guide you through the process. Contact us through the chat widget or email us at 
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