"use client";

import { useEffect } from "react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Shield, Calendar } from "lucide-react";

export default function PrivacyPolicyPage() {
  const year = new Date().getFullYear();
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <MarketingHeader />
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
                    { label: "Privacy Policy" }
                  ]} 
                />
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                  <Shield className="mr-1 h-3 w-3" />
                  Legal Document
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Privacy Policy
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
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">Your Privacy Matters</h2>
                  <p className="text-blue-800 text-sm leading-6">
                    At Plaen, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our invoicing and payment services.
                  </p>
                </div>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">1. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Account Information</h3>
                <p>
                  When you create a Plaen account, we collect information necessary to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Business information (company name, address, tax identification)</li>
                  <li>Payment method preferences and account details</li>
                  <li>Profile preferences and settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Usage Information</h3>
                <p>
                  We automatically collect information about how you use Plaen:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Log data (IP addresses, browser type, device information)</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Invoice and payment transaction data</li>
                  <li>Performance and error reporting data</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Client Information</h3>
                <p>
                  When you create invoices, we process information about your clients:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Client names and contact information</li>
                  <li>Invoice details and payment history</li>
                  <li>Payment method preferences</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">2. How We Use Your Information</h2>

                <p>We use your information to provide and improve our services:</p>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Service Provision</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Create and manage your Plaen account</li>
                  <li>Process invoices and facilitate payments</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Send transactional notifications and updates</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Service Improvement</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Develop new features and functionality</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Communications</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Send important service announcements</li>
                  <li>Provide educational content (with your consent)</li>
                  <li>Respond to your inquiries and requests</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">3. Information Sharing</h2>

                <p>We do not sell your personal information. We may share your information in limited circumstances:</p>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Service Providers</h3>
                <p>
                  We work with trusted third-party service providers who help us deliver our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Payment processors (for mobile money, bank transfers, crypto)</li>
                  <li>Cloud hosting and data storage providers</li>
                  <li>Email and communication service providers</li>
                  <li>Analytics and performance monitoring services</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Legal Requirements</h3>
                <p>We may disclose information when required by law or to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Comply with legal obligations and court orders</li>
                  <li>Protect our rights, property, and safety</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Respond to government requests and investigations</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">4. Data Security</h2>

                <p>We implement industry-standard security measures to protect your information:</p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
                  <h3 className="font-semibold text-black mb-4">Security Measures</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-black mb-2">Technical Safeguards</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• End-to-end encryption</li>
                        <li>• Secure data transmission (HTTPS/TLS)</li>
                        <li>• Regular security audits</li>
                        <li>• Access controls and monitoring</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-black mb-2">Operational Safeguards</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Employee access controls</li>
                        <li>• Regular security training</li>
                        <li>• Incident response procedures</li>
                        <li>• Data backup and recovery</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">5. Your Rights and Choices</h2>

                <p>You have control over your personal information:</p>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Access and Control</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mt-8 mb-4">Communication Preferences</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Opt out of marketing communications</li>
                  <li>Manage notification preferences</li>
                  <li>Choose language and regional settings</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">6. Data Retention</h2>

                <p>
                  We retain your information only as long as necessary to provide our services and comply with legal obligations:
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li><strong>Account data:</strong> Retained while your account is active and for 7 years after closure for tax and legal compliance</li>
                  <li><strong>Invoice data:</strong> Retained for 7 years for financial record-keeping requirements</li>
                  <li><strong>Payment data:</strong> Retained according to financial regulations and payment processor requirements</li>
                  <li><strong>Usage logs:</strong> Retained for 12 months for security and performance analysis</li>
                </ul>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">7. International Data Transfers</h2>

                <p>
                  Plaen operates primarily in Africa, but we may transfer data internationally to provide our services. When we do, we ensure appropriate safeguards are in place to protect your information according to applicable data protection laws.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">8. Children's Privacy</h2>

                <p>
                  Plaen is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete such information.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">9. Changes to This Policy</h2>

                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes by:
                </p>

                <ul className="list-disc list-inside space-y-2 text-gray-700 my-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Displaying in-app notifications when you next use Plaen</li>
                </ul>

                <p>
                  Your continued use of Plaen after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.
                </p>

                <h2 className="text-2xl font-semibold text-black mt-12 mb-6">10. Contact Us</h2>

                <p>
                  If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-black mb-2">General Inquiries</h4>
                      <p className="text-sm text-gray-700">
                        Email: privacy@plaen.app<br/>
                        Response time: 48 hours
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">Data Protection Officer</h4>
                      <p className="text-sm text-gray-700">
                        Email: dpo@plaen.app<br/>
                        For data rights requests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-sm text-gray-500 text-center">
                    This Privacy Policy was last updated on November 6, 2024, and is effective as of that date.
                  </p>
                </div>

              </div>
            </div>
          </section>
        </main>

        <style jsx>{`
          @keyframes floatBlob {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}