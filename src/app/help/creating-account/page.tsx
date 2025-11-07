"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Mail, Shield, User, ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function CreatingAccountPage() {
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
                  Creating your Plaen account
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Get started with Plaen by creating your account in just a few simple steps. 
                  No credit card required.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>2 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2 className="text-2xl font-semibold text-black mt-16 mb-8 first:mt-0">What you'll need</h2>
                <p className="text-lg leading-8 text-gray-700 mb-6">
                  Before you begin, make sure you have:
                </p>
                <ul className="mb-12 space-y-2">
                  <li className="text-gray-700">A valid email address</li>
                  <li className="text-gray-700">Access to your email for verification</li>
                  <li className="text-gray-700">Basic business or personal information</li>
                  <li className="text-gray-700">About 5 minutes to complete setup</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-16 mb-8">Step-by-step account creation</h2>

                <h3 className="text-xl font-semibold text-black mt-12 mb-6">1. Visit the signup page</h3>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                  Go to <a href="/onboarding" className="text-black font-medium hover:underline">plaen.com/onboarding</a> or click "Get Started Free" 
                  from our homepage. You'll be taken to our secure signup form.
                </p>

                <h3>2. Choose your account type</h3>
                <p>
                  Plaen offers different account types to match your needs:
                </p>
                <div className="not-prose my-6 space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Individual</h4>
                    <p className="text-sm text-gray-700">Perfect for freelancers and solo professionals</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="font-semibold text-black">Business</h4>
                    <p className="text-sm text-gray-700">For companies and growing teams</p>
                  </div>
                </div>

                <h3>3. Enter your information</h3>
                <p>
                  Fill out the required fields:
                </p>
                <ul>
                  <li><strong>Full name:</strong> Your legal name or business name</li>
                  <li><strong>Email address:</strong> This will be your login and where we send notifications</li>
                  <li><strong>Password:</strong> Choose a strong password (8+ characters)</li>
                  <li><strong>Location:</strong> Select your country for tax and currency settings</li>
                </ul>

                <h3>4. Verify your email</h3>
                <p>
                  After submitting the form, you'll receive a verification email. Click the link 
                  in the email to activate your account. Check your spam folder if you don't 
                  see it within a few minutes.
                </p>

                <h3>5. Complete your profile</h3>
                <p>
                  Once verified, you'll be guided through setting up:
                </p>
                <ul>
                  <li>Business details (if applicable)</li>
                  <li>Default currency preference</li>
                  <li>Payment method preferences</li>
                  <li>Invoice template style</li>
                </ul>

                <h2>Account security</h2>
                <p>
                  Your Plaen account is protected with industry-standard security measures:
                </p>
                <ul>
                  <li>256-bit SSL encryption for all data transmission</li>
                  <li>Secure password requirements</li>
                  <li>Email verification for account access</li>
                  <li>Regular security audits and updates</li>
                </ul>

                <h2>Next steps</h2>
                <p>
                  Once your account is created, you can:
                </p>
                <ul>
                  <li>Create your first invoice</li>
                  <li>Set up payment methods</li>
                  <li>Customize your invoice templates</li>
                  <li>Invite team members (Business accounts)</li>
                </ul>

                <h2>Having trouble?</h2>
                <p>
                  If you encounter any issues during account creation:
                </p>
                <ul>
                  <li>Clear your browser cache and try again</li>
                  <li>Make sure you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Check that your email address is entered correctly</li>
                  <li>Contact our support team if problems persist</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/onboarding">
                    <Button size="lg">
                      Create your account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/account-types">
                    <Button size="lg" variant="outline">
                      Learn about account types
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