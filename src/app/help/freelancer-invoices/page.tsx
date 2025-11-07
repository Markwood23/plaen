"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function FreelancerInvoicesPage() {
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
                  Popular • Getting Started
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Creating professional invoices as a freelancer
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Best practices for freelancers to create invoices that look professional, 
                  get paid faster, and build trust with clients.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>7 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>Why professional invoices matter</h2>
                <p>
                  As a freelancer, your invoice is often the last impression you make on a client. 
                  A professional invoice builds trust, reinforces your brand, and significantly 
                  increases the likelihood of timely payment.
                </p>

                <h2>Essential elements of a professional freelance invoice</h2>

                <h3>1. Clear business identity</h3>
                <p>
                  Even as a solo freelancer, present yourself professionally:
                </p>
                <ul>
                  <li><strong>Your full name or business name:</strong> Use consistently across all materials</li>
                  <li><strong>Professional email address:</strong> Avoid generic Gmail addresses when possible</li>
                  <li><strong>Complete contact information:</strong> Phone number, website, professional address</li>
                  <li><strong>Logo or personal brand mark:</strong> Simple but consistent visual identity</li>
                </ul>

                <h3>2. Sequential invoice numbering</h3>
                <p>
                  Professional numbering system options:
                </p>
                <ul>
                  <li><strong>Simple sequential:</strong> 001, 002, 003</li>
                  <li><strong>Year-based:</strong> 2024-001, 2024-002</li>
                  <li><strong>Client-based:</strong> ABC-001, XYZ-001</li>
                  <li><strong>Your initials:</strong> JS-001, JS-002</li>
                </ul>

                <h3>3. Detailed service descriptions</h3>
                <p>
                  Avoid vague descriptions. Be specific about what you delivered:
                </p>

                <div className="not-prose my-8 space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-4 flex items-center gap-3 font-semibold text-black">
                      <CheckCircle className="h-5 w-5 text-gray-600" aria-hidden="true" />
                      Professional examples
                    </div>
                    <ul className="space-y-2 text-gray-700 leading-6">
                      <li>• "Logo design: 3 initial concepts, 2 rounds of revisions, final vector files (AI, EPS, PNG)"</li>
                      <li>• "WordPress website development: 5-page responsive site with contact form and SEO optimization"</li>
                      <li>• "Content writing: 5 blog posts (800-1200 words each) including keyword research and meta descriptions"</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-3 font-semibold text-black">
                      <XCircle className="h-5 w-5 text-gray-600" aria-hidden="true" />
                      Avoid these
                    </div>
                    <ul className="space-y-2 text-gray-700 leading-6">
                      <li>• "Design work"</li>
                      <li>• "Website stuff"</li>
                      <li>• "Writing project"</li>
                    </ul>
                  </div>
                </div>

                <h2>Freelance-specific invoicing strategies</h2>

                <h3>Project-based vs. hourly billing</h3>
                
                <h4>Project-based invoicing:</h4>
                <ul>
                  <li><strong>Fixed scope:</strong> "Brand identity package: Logo, business cards, letterhead"</li>
                  <li><strong>Milestone billing:</strong> Break large projects into phases</li>
                  <li><strong>Value-based pricing:</strong> Price based on client value, not hours</li>
                </ul>

                <h4>Hourly invoicing:</h4>
                <ul>
                  <li><strong>Detailed time tracking:</strong> Break down hours by task or date</li>
                  <li><strong>Time ranges:</strong> "Design consultation (2.5 hours): March 15, 9:00 AM - 11:30 AM"</li>
                  <li><strong>Task descriptions:</strong> What was accomplished in each time block</li>
                </ul>

                <h3>Payment terms for freelancers</h3>
                <p>
                  Set clear expectations from the start:
                </p>
                <ul>
                  <li><strong>Net 15:</strong> Good for small projects and trusted clients</li>
                  <li><strong>Net 30:</strong> Standard for larger projects or corporate clients</li>
                  <li><strong>Due on receipt:</strong> For ongoing retainer clients</li>
                  <li><strong>50% upfront:</strong> For new clients or large projects</li>
                </ul>

                <h2>Building client trust through invoices</h2>

                <h3>Include project context</h3>
                <p>
                  Remind clients what they're paying for:
                </p>
                <ul>
                  <li>Reference the original project agreement</li>
                  <li>Include project start and completion dates</li>
                  <li>Mention key deliverables or milestones completed</li>
                  <li>Add a brief thank you note</li>
                </ul>

                <h3>Transparent pricing</h3>
                <p>
                  Show your work, even for fixed-price projects:
                </p>
                <ul>
                  <li>Break down complex deliverables into line items</li>
                  <li>Show any discounts or adjustments clearly</li>
                  <li>Explain any additional charges upfront</li>
                  <li>Include tax information where applicable</li>
                </ul>

                <h2>Freelancer invoice templates</h2>

                <h3>Design service invoice example:</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="font-semibold mb-4">Sarah Johnson Design Studio</div>
                  <div className="mb-4">
                    <strong>Project:</strong> Café Luna Rebrand<br/>
                    <strong>Client:</strong> Luna Coffee House<br/>
                    <strong>Invoice #:</strong> SJ-2024-015<br/>
                    <strong>Date:</strong> November 6, 2024<br/>
                    <strong>Due:</strong> November 21, 2024
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Logo design & concepts</span><span>GHS 2,500</span></div>
                    <div className="flex justify-between"><span>Brand guidelines document</span><span>GHS 800</span></div>
                    <div className="flex justify-between"><span>Business card template</span><span>GHS 300</span></div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span><span>GHS 3,600</span>
                    </div>
                  </div>
                </div>

                <h3>Consulting service invoice example:</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="font-semibold mb-4">Michael Asante - Marketing Consultant</div>
                  <div className="mb-4">
                    <strong>Project:</strong> Q4 Marketing Strategy<br/>
                    <strong>Client:</strong> Tech Startup Ghana<br/>
                    <strong>Invoice #:</strong> MA-024<br/>
                    <strong>Period:</strong> October 1-31, 2024
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Strategy development (8 hours)</span><span>GHS 2,400</span></div>
                    <div className="flex justify-between"><span>Market research report (5 hours)</span><span>GHS 1,500</span></div>
                    <div className="flex justify-between"><span>Client presentation (2 hours)</span><span>GHS 600</span></div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span><span>GHS 4,500</span>
                    </div>
                  </div>
                </div>

                <h2>Payment optimization for freelancers</h2>

                <h3>Multiple payment options</h3>
                <p>
                  Make it easy for clients to pay by offering various methods:
                </p>
                <ul>
                  <li><strong>Mobile money:</strong> Perfect for local Ghanaian clients</li>
                  <li><strong>Bank transfer:</strong> For corporate clients and larger amounts</li>
                  <li><strong>International options:</strong> PayPal, Wise for global clients</li>
                  <li><strong>Cryptocurrency:</strong> For tech-savvy clients</li>
                </ul>

                <h3>Incentivize early payment</h3>
                <ul>
                  <li><strong>Early payment discount:</strong> "2% discount if paid within 7 days"</li>
                  <li><strong>Preferred client rates:</strong> Lower rates for clients who pay promptly</li>
                  <li><strong>Priority scheduling:</strong> Fast-paying clients get priority booking</li>
                </ul>

                <h2>Following up professionally</h2>

                <h3>Payment reminder schedule</h3>
                <ul>
                  <li><strong>Day 3:</strong> Friendly reminder email</li>
                  <li><strong>Due date:</strong> Professional follow-up</li>
                  <li><strong>Day 7 overdue:</strong> Firm but polite reminder</li>
                  <li><strong>Day 15 overdue:</strong> Final notice with late fees</li>
                </ul>

                <h3>Reminder email template</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50 text-sm">
                  <div className="mb-2"><strong>Subject:</strong> Friendly reminder - Invoice #SJ-2024-015</div>
                  <div>
                    <p>Hi Luna,</p>
                    <p>I hope you're happy with the new brand identity we created together! Just a friendly reminder that Invoice #SJ-2024-015 for GHS 3,600 is due on November 21st.</p>
                    <p>You can pay easily via MTN Mobile Money to 024-XXX-XXXX or bank transfer using the details on the invoice.</p>
                    <p>Let me know if you have any questions!</p>
                    <p>Best regards,<br/>Sarah</p>
                  </div>
                </div>

                <h2>Legal protection for freelancers</h2>

                <h3>Include important terms</h3>
                <ul>
                  <li><strong>Late payment fees:</strong> "2% monthly charge on overdue amounts"</li>
                  <li><strong>Scope limitations:</strong> "Additional revisions billed at hourly rate"</li>
                  <li><strong>Intellectual property:</strong> "Rights transfer upon full payment"</li>
                  <li><strong>Cancellation policy:</strong> Clear terms for project changes</li>
                </ul>

                <h2>Tools and resources</h2>
                <ul>
                  <li><strong>Plaen invoice templates:</strong> Pre-built freelancer templates</li>
                  <li><strong>Time tracking apps:</strong> RescueTime, Toggle for hourly projects</li>
                  <li><strong>Contract templates:</strong> Protect yourself with clear agreements</li>
                  <li><strong>Accounting software:</strong> Track expenses and income</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/onboarding">
                    <Button size="lg">
                      Create your first invoice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/first-invoice">
                    <Button size="lg" variant="outline">
                      Invoice creation guide
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