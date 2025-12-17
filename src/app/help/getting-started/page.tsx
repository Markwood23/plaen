import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, FileText, Users, Zap, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up with your email and choose your account type - individual, freelancer, or business.",
    details: [
      "No credit card required",
      "Verify your email address",
      "Choose your currency preference",
      "Set up your profile"
    ]
  },
  {
    number: "02",
    title: "Build your first invoice",
    description: "Use our intuitive invoice builder to create professional invoices in minutes.",
    details: [
      "Add your business details",
      "Include line items and descriptions", 
      "Set payment terms and due dates",
      "Preview before sending"
    ]
  },
  {
    number: "03",
    title: "Send and get paid",
    description: "Share your invoice and receive payments through multiple channels.",
    details: [
      "Send via email or shareable link",
      "Accept mobile money, bank transfers, crypto",
      "Track payment status in real-time",
      "Automatic payment confirmations"
    ]
  }
];

const quickTips = [
  {
    title: "Set up payment methods",
    description: "Connect your mobile money, bank account, or crypto wallet to receive payments.",
    icon: Zap
  },
  {
    title: "Customize your invoices",
    description: "Add your logo, business colors, and custom fields to match your brand.",
    icon: FileText
  },
  {
    title: "Invite team members", 
    description: "Collaborate with your team by inviting them to your Plaen workspace.",
    icon: Users
  }
];

export default function GettingStartedPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      
      <div className="bg-white">
        <main>
          {/* Article Header */}
          <section className="border-b border-gray-200 bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-6">
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Help Center
                </Link>
              </div>
              
              <div className="max-w-2xl">
                <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                  Getting Started with Plaen
                </h1>
                <p className="mt-4 text-lg leading-7 text-gray-700">
                  Learn how to set up your Plaen account and create your first invoice in just a few minutes.
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                
                <h2 className="text-2xl font-semibold text-black mt-16 mb-6 first:mt-0">Welcome to Plaen</h2>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Plaen is designed to make invoicing simple, fast, and accessible for businesses across Africa and beyond. 
                  Whether you're a freelancer, small business owner, or running a larger operation, this guide will help you 
                  get up and running quickly.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-6">Step-by-step setup</h2>
                <p className="text-lg leading-8 text-gray-700 mb-8">Follow these three simple steps to start accepting payments with Plaen:</p>

                <div className="not-prose mt-12 space-y-12">
                  {steps.map((step) => (
                    <div key={step.number} className="flex gap-8">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-semibold">
                          {step.number}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-black mb-4">{step.title}</h3>
                        <p className="text-gray-700 mb-6 text-lg leading-7">{step.description}</p>
                        
                        <div className="grid gap-3 sm:grid-cols-2">
                          {step.details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="mt-16">Quick tips for success</h2>
                <p>
                  Here are some additional tips to help you get the most out of Plaen from day one:
                </p>

                <div className="not-prose mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {quickTips.map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <div key={tip.title} className="rounded-lg border border-gray-200 p-6">
                        <Icon className="h-8 w-8 text-gray-700 mb-4" />
                        <h3 className="font-semibold text-black mb-2">{tip.title}</h3>
                        <p className="text-sm text-gray-700 leading-6">{tip.description}</p>
                      </div>
                    );
                  })}
                </div>

                <h2 className="mt-16">Need help?</h2>
                <p>
                  If you run into any issues or have questions, our support team is here to help. 
                  You can reach us through the chat widget in the bottom right corner of your screen, 
                  or send us an email at <a href="mailto:support@plaen.tech">support@plaen.tech</a>.
                </p>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg">
                      Talk to our team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button size="lg" variant="outline" className="border-gray-200 text-black hover:bg-gray-50">
                      Browse more guides
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