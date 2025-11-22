import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FileText, Calendar } from "lucide-react";

export default function TermsOfServicePage() {
  const year = new Date().getFullYear();

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        {/* Floating Gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/4 top-[-15%] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-200/40 to-transparent blur-3xl"
            style={{ animation: "floatBlob 28s ease-in-out infinite" }}
          />
          <div
            className="absolute right-1/4 bottom-[-10%] h-[400px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-l from-gray-100/30 to-transparent blur-3xl"
            style={{ animation: "floatBlob 32s ease-in-out infinite", animationDelay: "-18s" }}
          />
        </div>
        
        <main>
          {/* Header */}
          <section className="relative border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-6">
                <Breadcrumb 
                  items={[
                    { label: "Legal" },
                    { label: "Terms of Service" }
                  ]} 
                />
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                  <FileText className="mr-1 h-3 w-3" />
                  Legal Agreement
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Terms of Service — Professional, clear, and trustworthy
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Last updated: November 6, 2024
                </div>
                <div>Effective date: November 6, 2024</div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-16">
            <div className="mx-auto max-w-4xl px-6">
              <div className="prose prose-lg prose-gray max-w-none" data-animate="fade-up">
                
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">Agreement Overview</h2>
                  <p className="text-blue-800 text-sm leading-6">
                    These Terms govern a platform built on professional structure and human context. By using Plaen, you agree to operate with legitimacy and respect for the context attached to financial records.
                  </p>
                </div>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">1. Acceptance of Terms</h2>

                <p>
                  By accessing or using Plaen ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>

                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Individual freelancers and consultants</li>
                  <li>Small and medium-sized businesses</li>
                  <li>Enterprise organizations</li>
                  <li>Invoice recipients and payers</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">2. Description of Service</h2>

                <p>
                  Plaen is a software-as-a-service (SaaS) platform that provides:
                </p>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Core Services</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Invoice creation and management tools</li>
                  <li>Payment processing through multiple methods</li>
                  <li>Client and customer management</li>
                  <li>Financial reporting and analytics</li>
                  <li>Receipt generation and record keeping</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Payment Methods</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Mobile money (MTN, Vodafone, AirtelTigo, M-Pesa)</li>
                  <li>Bank transfers and wire payments</li>
                  <li>Cryptocurrency payments</li>
                  <li>Credit and debit card processing</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">3. User Accounts</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Account Registration</h3>
                <p>To use Plaen, you must create an account by providing accurate and complete information. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Ensuring your account information remains current and accurate</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Account Types</h3>
                <p>Plaen offers different account types:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li><strong>Personal accounts:</strong> For individual freelancers and consultants</li>
                  <li><strong>Business accounts:</strong> For companies and organizations</li>
                  <li><strong>Enterprise accounts:</strong> For large organizations with custom needs</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">4. Acceptable Use</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Permitted Uses</h3>
                <p>You may use Plaen for legitimate business purposes, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Creating and sending invoices for goods and services</li>
                  <li>Collecting payments from clients and customers</li>
                  <li>Managing business financial records</li>
                  <li>Generating reports for accounting and tax purposes</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Prohibited Uses</h3>
                <p>You agree not to use Plaen for:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Illegal activities or fraudulent transactions</li>
                  <li>Money laundering or terrorist financing</li>
                  <li>Circumventing payment processing regulations</li>
                  <li>Spamming or unsolicited communications</li>
                  <li>Violating intellectual property rights</li>
                  <li>Interfering with the Service's security or functionality</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">5. Payment Terms</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Service Fees</h3>
                <p>Plaen's pricing structure includes:</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-black mb-2">Free Tier</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Unlimited invoice creation</li>
                        <li>• Basic payment processing</li>
                        <li>• Standard support</li>
                        <li>• Transaction fees apply</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">Paid Plans</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Advanced features</li>
                        <li>• Priority support</li>
                        <li>• Custom branding</li>
                        <li>• Reduced transaction fees</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Transaction Fees</h3>
                <p>Transaction fees vary by payment method and are clearly disclosed before processing. Fees may include:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Payment processing fees (typically 1-3% of transaction amount)</li>
                  <li>Currency conversion fees for multi-currency transactions</li>
                  <li>Third-party payment provider fees</li>
                  <li>Refund and chargeback processing fees</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">6. Data and Privacy</h2>

                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Your Data</h3>
                <p>You retain ownership of your data, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Invoice and client information</li>
                  <li>Payment and transaction records</li>
                  <li>Business and personal information</li>
                  <li>Usage analytics and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Data Security</h3>
                <p>We implement industry-standard security measures to protect your data, but you acknowledge that no system is completely secure. You are responsible for maintaining appropriate security practices on your end.</p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">7. Intellectual Property</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Plaen's Rights</h3>
                <p>Plaen and its licensors own all rights to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>The Plaen software and platform</li>
                  <li>Trademarks, logos, and brand materials</li>
                  <li>Documentation and help materials</li>
                  <li>Proprietary algorithms and technology</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Your License</h3>
                <p>We grant you a limited, non-exclusive, non-transferable license to use Plaen for your business purposes, subject to these Terms.</p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">8. Service Availability</h2>

                <p>
                  We strive to maintain high service availability, but we cannot guarantee uninterrupted access. We may:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Perform scheduled maintenance with advance notice</li>
                  <li>Make emergency updates for security or stability</li>
                  <li>Temporarily limit access during high traffic periods</li>
                  <li>Discontinue features with reasonable notice</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">9. Limitation of Liability</h2>

                <p>
                  To the fullest extent permitted by law, Plaen shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Loss of profits or business opportunities</li>
                  <li>Data loss or corruption</li>
                  <li>Business interruption</li>
                  <li>Third-party payment processing issues</li>
                </ul>

                <p className="text-sm text-gray-600 mt-4">
                  Our total liability for any claim related to these Terms or the Service shall not exceed the amount you paid to Plaen in the 12 months preceding the claim.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">10. Termination</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Termination by You</h3>
                <p>You may terminate your account at any time by:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Using the account deletion feature in your settings</li>
                  <li>Contacting our support team</li>
                  <li>Ceasing to use the Service</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Termination by Plaen</h3>
                <p>We may suspend or terminate your account if:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>You violate these Terms</li>
                  <li>You engage in fraudulent or illegal activities</li>
                  <li>Your account remains inactive for an extended period</li>
                  <li>Required by law or regulation</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Effect of Termination</h3>
                <p>Upon termination:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Your access to the Service will be revoked</li>
                  <li>You may export your data for a limited time</li>
                  <li>Outstanding payments and fees remain due</li>
                  <li>Certain provisions of these Terms survive termination</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">11. Governing Law</h2>

                <p>
                  These Terms shall be governed by and construed in accordance with the laws of Ghana, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Ghana.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">12. Changes to Terms</h2>

                <p>
                  We may modify these Terms from time to time. We will notify you of material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Posting updated Terms on our website</li>
                  <li>Sending email notifications</li>
                  <li>Displaying in-app notifications</li>
                </ul>

                <p>
                  Your continued use of the Service after changes take effect constitutes acceptance of the new Terms.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">13. Contact Information</h2>

                <p>
                  If you have questions about these Terms, please contact us:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-black mb-2">Legal Inquiries</h4>
                      <p className="text-sm text-gray-700">
                        Email: legal@plaen.tech<br/>
                        Subject: Terms of Service Inquiry
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">General Support</h4>
                      <p className="text-sm text-gray-700">
                        Email: support@plaen.tech<br/>
                        Phone: +233 (0) 20 123 4567
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-sm text-gray-500 text-center">
                    These Terms of Service were last updated on November 6, 2024, and are effective as of that date.
                  </p>
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