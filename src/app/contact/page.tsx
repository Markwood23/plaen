"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { useRevealAnimation } from "@/hooks/use-reveal-animation";
import { 
  Sms, 
  MessageText, 
  Send2,
  Clock,
  TickCircle,
  ArrowRight2,
  Location,
  Whatsapp,
} from "iconsax-react";
import Link from "next/link";

export default function ContactPage() {
  const year = new Date().getFullYear();
  useRevealAnimation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        {/* Hero + Form - shared background */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div
              className="absolute left-1/2 top-[-10%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-100/50 to-transparent blur-3xl"
              style={{ animation: "floatBlob 18s ease-in-out infinite" }}
            />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent z-0" />

          <main>
            {/* Hero */}
            <div
              data-animate="fade-up"
              className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-16 pt-32 text-center"
            >
              <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                Contact
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
                Let's talk.
              </h1>
              <p className="max-w-xl text-lg leading-7 text-gray-600">
                Have questions? Need support? We're here to help you get the most out of Plaen.
              </p>
            </div>

            {/* Main content - 2 column */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24" data-animate="fade-up">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                {/* Left - Contact info */}
                <div className="space-y-10">
                  {/* Contact methods */}
                  <div className="space-y-6">
                    <a 
                      href="mailto:hello@plaen.app"
                      className="flex items-center gap-4 group"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Sms size={22} color="#6B7280" variant="Bulk" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#14462a] transition-colors">Email us</p>
                        <p className="text-sm text-gray-600">hello@plaen.app</p>
                      </div>
                    </a>

                    <a 
                      href="https://wa.me/233240000000"
                      className="flex items-center gap-4 group"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                        <Whatsapp size={22} color="#25D366" variant="Bulk" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#14462a] transition-colors">WhatsApp</p>
                        <p className="text-sm text-[#25D366]">+233 24 000 0000</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <MessageText size={22} color="#D97706" variant="Bulk" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Live chat</p>
                        <p className="text-sm text-amber-600">Mon-Fri, 9am-6pm GMT</p>
                      </div>
                    </div>
                  </div>

                  {/* Location & hours */}
                  <div className="space-y-4 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Location size={18} color="#6B7280" variant="Bulk" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Accra, Ghana</p>
                        <p className="text-xs text-gray-500">West Africa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Clock size={18} color="#6B7280" variant="Bulk" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Response time</p>
                        <p className="text-xs text-gray-500">Within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  {/* Help center link */}
                  <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">
                      Looking for help articles?
                    </p>
                    <Link href="/help">
                      <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-400">
                        Visit Help Center
                        <ArrowRight2 size={14} color="#000" className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right - Form */}
                <div>
                  <div className="rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50/50 to-white p-8">
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-5">
                          <TickCircle size={32} color="#14462a" variant="Bold" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h3>
                        <p className="text-sm text-gray-600 mb-6">
                          We'll get back to you within 24 hours.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: "", email: "", subject: "", message: "" });
                          }}
                          className="border-gray-200"
                        >
                          Send another message
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900">Send a message</h3>
                          <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor="name" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#14462a] focus:outline-none"
                                placeholder="Your name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#14462a] focus:outline-none"
                                placeholder="you@example.com"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="subject" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Topic
                            </label>
                            <select
                              id="subject"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition focus:ring-2 focus:ring-[#14462a] focus:outline-none appearance-none cursor-pointer"
                              required
                            >
                              <option value="">Select a topic</option>
                              <option value="general">General inquiry</option>
                              <option value="support">Technical support</option>
                              <option value="billing">Billing question</option>
                              <option value="partnership">Partnership</option>
                              <option value="demo">Request a demo</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="message" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Message
                            </label>
                            <textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              rows={5}
                              className="block w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 transition focus:ring-2 focus:ring-[#14462a] focus:outline-none resize-none"
                              placeholder="How can we help?"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-[#14462a] text-white hover:bg-[#0d3420] rounded-xl h-12"
                          >
                            Send message
                            <Send2 size={18} color="#fff" className="ml-2" />
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </section>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}
