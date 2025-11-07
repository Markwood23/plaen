"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, User, Users, CheckCircle, ArrowRight, Briefcase } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function AccountTypesPage() {
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
                  <User className="h-3 w-3" />
                  Getting Started
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Personal vs Business setup
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Choose the right account type for your needs. You can upgrade or change 
                  your account type at any time.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>3 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Account types overview</h2>
                <p>
                  Plaen offers two main account types, each designed for different use cases. 
                  The type you choose affects your invoice templates, available features, and 
                  how your account is organized.
                </p>

                <div className="not-prose my-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Individual Account</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Perfect for freelancers, consultants, and solo professionals
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Personal invoicing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Single user access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Basic reporting</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Building2 className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Business Account</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Ideal for companies, agencies, and growing teams
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Company branding</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Team collaboration</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>Advanced reporting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h2>Individual Account details</h2>
                <p>
                  Individual accounts are designed for solo professionals who need to send 
                  invoices under their own name.
                </p>

                <h3>Best for:</h3>
                <ul>
                  <li>Freelance designers, developers, writers</li>
                  <li>Independent consultants</li>
                  <li>Tutors and coaches</li>
                  <li>Artists and creatives</li>
                  <li>Any solo professional</li>
                </ul>

                <h3>Features included:</h3>
                <ul>
                  <li>Unlimited invoices and clients</li>
                  <li>Mobile money, bank transfer, and crypto payments</li>
                  <li>Professional invoice templates</li>
                  <li>Automatic payment reminders</li>
                  <li>Basic expense tracking</li>
                  <li>Export to PDF and Excel</li>
                  <li>Email support</li>
                </ul>

                <h2>Business Account details</h2>
                <p>
                  Business accounts provide additional features for companies and teams that 
                  need more advanced invoicing and collaboration tools.
                </p>

                <h3>Best for:</h3>
                <ul>
                  <li>Small and medium businesses</li>
                  <li>Digital agencies</li>
                  <li>Consulting firms</li>
                  <li>E-commerce stores</li>
                  <li>Any business with multiple team members</li>
                </ul>

                <h3>Additional features:</h3>
                <ul>
                  <li>Custom company branding and logo</li>
                  <li>Team member management and permissions</li>
                  <li>Advanced reporting and analytics</li>
                  <li>Custom invoice templates</li>
                  <li>API access for integrations</li>
                  <li>Priority customer support</li>
                  <li>White-label client portals</li>
                </ul>

                <h2>Which should you choose?</h2>
                
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-700" />
                    <h4 className="font-semibold text-black">Quick decision guide</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p><strong>Choose Individual if:</strong> You work alone, invoice under your name, and need basic invoicing features.</p>
                    <p><strong>Choose Business if:</strong> You have a company name, work with a team, or need advanced features like custom branding.</p>
                  </div>
                </div>

                <h2>Pricing</h2>
                <p>
                  Both account types start with the same free tier, which includes:
                </p>
                <ul>
                  <li>Up to 5 invoices per month</li>
                  <li>All payment methods</li>
                  <li>Basic templates</li>
                  <li>Email support</li>
                </ul>
                <p>
                  Paid plans unlock unlimited invoicing, advanced features, and priority support. 
                  Business accounts include additional collaboration and branding features.
                </p>

                <h2>Switching account types</h2>
                <p>
                  You can change your account type at any time from your account settings. 
                  All your invoices, clients, and data will be preserved when switching.
                </p>
                
                <p>
                  To switch account types:
                </p>
                <ol>
                  <li>Go to Settings → Account</li>
                  <li>Click "Change Account Type"</li>
                  <li>Select your new account type</li>
                  <li>Update your profile information if needed</li>
                </ol>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/onboarding">
                    <Button size="lg">
                      Create your account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/creating-account">
                    <Button size="lg" variant="outline">
                      Account creation guide
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