import { SmartButton } from "@/components/ui/smart-button";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import { Star, TrendUp, Building, User } from "iconsax-react";
import { Quote } from "lucide-react";
import { IconFrame } from "@/components/ui/icon-frame";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Kwame Asante",
    rating: 5,
    company: "Independent",
    type: "freelancer",
    avatar: "/testimonials/kwame.jpg",
    quote: "Plaen changed how I handle invoicing. My clients love the clean interface and I get paid 40% faster since switching to mobile money payments.",
    metrics: {
      label: "Faster payments",
      value: "40%"
    },
    featured: true,
  },
  {
    id: 2,
    name: "Ama Osei",
    rating: 4,
    company: "TechFlow Solutions",
    type: "business",
    avatar: "/testimonials/ama.jpg",
  quote: "We needed professional invoicing without the complexity. Plaen delivers exactly that: clean, structured, and our clients take us more seriously.",
    metrics: {
      label: "Client satisfaction",
      value: "95%"
    },
    featured: true,
  },
  {
    id: 3,
    name: "David Mensah",
    role: "Marketing Consultant",
    company: "Mensah & Associates",
    type: "business",
    avatar: "/testimonials/david.jpg",
    rating: 3,
    quote: "The dual currency feature is perfect for our international clients. We can invoice in GHS and USD seamlessly.",
    metrics: {
      label: "International clients",
      value: "60%"
    },
    featured: false,
  },
  {
    id: 4,
    name: "Sarah Adjei",
    rating: 4,
    company: "Freelancer",
    type: "freelancer",
    avatar: "/testimonials/sarah.jpg",
    quote: "Before Plaen, I was using Word documents for invoices. Now my clients see me as a real professional. The mobile money integration is a game-changer.",
    metrics: {
      label: "Professional image",
      value: "100%"
    },
    featured: false,
  },
  {
    id: 5,
    name: "Michael Appiah",
    rating: 5,
    company: "Pixel Studios",
    type: "business",
    avatar: "/testimonials/michael.jpg",
    quote: "Our payment process was a mess before Plaen. Now everything is automated, professional, and our cash flow has improved dramatically.",
    metrics: {
      label: "Cash flow improvement",
      value: "65%"
    },
    featured: false,
  },
  {
    id: 6,
    name: "Efua Boateng",
    rating: 4,
    company: "Independent",
    type: "freelancer",
    avatar: "/testimonials/efua.jpg",
    quote: "I love that my clients don't need to create accounts to pay. The secure link system is brilliant and removes so much friction.",
    metrics: {
      label: "Payment completion",
      value: "92%"
    },
    featured: false,
  },
];

const stats = [
  { label: "User satisfaction", value: "98%", icon: TrendUp, color: "#059669" },
  { label: "Faster payments", value: "2.5x", icon: Star, color: "#D97706" },
  { label: "Active users", value: "10K+", icon: User, color: "#4F46E5" },
  { label: "Businesses served", value: "500+", icon: Building, color: "#0284C7" },
];

export default function TestimonialsPage() {
  const year = new Date().getFullYear();

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  return (
    <>
      <MarketingHeader />
      <PageEffects resetScroll />
      <div className="relative min-h-screen bg-white text-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[420px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.14),transparent_60%)] blur-3xl"
            style={{ animation: "floatBlob 18s ease-in-out infinite" }}
          />
        </div>

        <main>
          {/* Hero Section */}
          <section
            data-animate="fade-up"
            className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-20 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              <Star size={14} color="#D97706" variant="Bold" /> Customer Stories
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
              Trusted by operators who value clarity
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              Hear how freelancers and teams attach context to payments with finance notes, present professionally, and get paid with less friction.
            </p>
          </section>

          {/* Stats */}
          <section className="border-t border-gray-200 bg-white/80 py-12" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-8 md:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                        <Icon size={28} color={stat.color} variant="Bulk" />
                      </div>
                      <div className="mt-4 text-3xl font-bold text-black">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Testimonials */}
          <section className="bg-white py-16" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-12 text-center text-3xl font-semibold text-[#14462a]">
                What our users are saying
              </h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {featuredTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50/50 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)] transition hover:-translate-y-2 hover:border-black/20 hover:shadow-[0_32px_100px_rgba(15,15,15,0.15)]"
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-gradient-to-br from-black/5 to-transparent blur-2xl" />
                    </div>
                    
                    <div className="absolute -right-8 -top-8 text-6xl text-gray-100">
                      <Quote className="h-16 w-16 transition group-hover:scale-110" />
                    </div>
                    
                    <div className="relative">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-inner" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent" />
                            {/* Status indicator */}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gray-400 border-2 border-white shadow-sm">
                              <div className="h-full w-full rounded-full bg-gray-400 animate-pulse" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-black">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">
                              {testimonial.role} • {testimonial.company}
                            </div>
                            <div className="mt-1 flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 transition group-hover:scale-105 ${i < testimonial.rating ? 'fill-black text-black' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="relative">
                            <div className="text-2xl font-bold text-black group-hover:scale-105 transition">{testimonial.metrics.value}</div>
                            <div className="text-xs text-gray-500">{testimonial.metrics.label}</div>
                            {/* Success metric visualization */}
                            <div className="mt-2 h-1 w-16 rounded-full bg-gray-200 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-1000 group-hover:w-full"
                                style={{ width: `${60 + (index * 20)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <blockquote className="text-lg leading-7 text-gray-700 relative">
                        "{testimonial.quote}"
                        {/* Subtle reading progress simulation */}
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-0 transition group-hover:opacity-100" />
                      </blockquote>
                      
                        <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                          {testimonial.type === 'freelancer' ? 'Freelancer' : 'Business'}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400" />
                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                          </div>
                          <span>Verified review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* All Testimonials Grid */}
          <section className="border-t border-gray-200 bg-gray-50 py-16" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">More success stories</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-200" />
                      <div>
                        <div className="font-semibold text-black">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-black text-black' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    
                    <blockquote className="mb-4 flex-1 text-sm leading-6 text-gray-700">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {testimonial.type === 'freelancer' ? 'Freelancer' : 'Business'}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-black">{testimonial.metrics.value}</div>
                        <div className="text-xs text-gray-500">{testimonial.metrics.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="border-t border-gray-200 bg-white py-16" data-animate="fade-up">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                <h2 className="mb-4 text-3xl font-semibold text-[#14462a]">
                  Join thousands of satisfied users
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Experience the same professional invoicing and faster payments that our users love.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/signup">
                    <SmartButton size="lg">
                      Start for free
                    </SmartButton>
                  </Link>
                  <Link href="/contact">
                    <SmartButton size="lg" variant="outline" className="border-gray-200 text-black transition hover:border-black hover:bg-gray-50">
                      Talk to Plaen
                    </SmartButton>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  We typically reply within one business day
                </p>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter year={year} />
      </div>
    </>
  );
}