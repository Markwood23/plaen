"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { Sms, MessageText, Send2 } from "iconsax-react";

export default function ContactPage() {
  const year = new Date().getFullYear();
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <MarketingHeader />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.14),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-10%] top-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_70%)] blur-3xl"
            style={{ animation: "floatBlob 24s ease-in-out infinite", animationDelay: "-8s" }}
          />
        </div>

        <main>
          <section
            data-animate="fade-up"
            className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pb-24 pt-20 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              Contact
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
              Let's talk about your invoicing needs.
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              Have questions? Need support? Want to share feedback? We're here to help you get the most out of Plaen.
            </p>
          </section>

          <section className="border-t border-gray-200 bg-white/80 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[#14462a]">
                      Get in touch
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-600">
                      Choose the best way to reach us. We typically respond within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-black/20 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#059669]/10 transition group-hover:bg-[#059669]">
                          <Sms size={20} color="#059669" variant="Bulk" className="group-hover:hidden" />
                          <Sms size={20} color="white" variant="Bulk" className="hidden group-hover:block" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Email us</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            For general inquiries and support
                          </p>
                          <a
                            href="mailto:hello@plaen.app"
                            className="mt-2 inline-block text-sm font-medium text-black underline-offset-4 hover:underline"
                          >
                            hello@plaen.app
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-black/20 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14462a]/10 transition group-hover:bg-[#14462a]">
                          <MessageText size={20} color="#14462a" variant="Bulk" className="group-hover:hidden" />
                          <MessageText size={20} color="white" variant="Bulk" className="hidden group-hover:block" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Live chat</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Quick questions? Chat with our team
                          </p>
                          <button className="mt-2 inline-block text-sm font-medium text-black underline-offset-4 hover:underline">
                            Start a conversation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Tell us how we can help..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-black text-white transition hover:bg-gray-900"
                    >
                      Send message
                      <Send2 size={16} className="ml-2" />
                    </Button>
                  </form>
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
