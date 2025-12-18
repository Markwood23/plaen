import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageEffects } from "@/components/marketing/home-page-effects";
import Image from "next/image";
import { 
  Star1, 
  TrendUp, 
  Building, 
  User,
  TickCircle,
  ArrowRight2,
  People,
  Global,
  Clock,
  QuoteUp,
  Mobile,
  DocumentText1,
} from "iconsax-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Kwame Asante",
    role: "Freelance Designer",
    company: "Independent",
    type: "freelancer",
    initials: "KA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    color: "#14462a",
    quote: "Plaen changed how I handle invoicing. My clients love the clean interface and I get paid 40% faster since switching to mobile money payments.",
    metrics: { label: "Faster payments", value: "40%" },
    featured: true,
  },
  {
    id: 2,
    name: "Ama Osei",
    role: "CEO",
    company: "TechFlow Solutions",
    type: "business",
    initials: "AO",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    color: "#0D9488",
    quote: "We needed professional invoicing without the complexity. Plaen delivers exactly that: clean, structured, and our clients take us more seriously.",
    metrics: { label: "Client satisfaction", value: "95%" },
    featured: true,
  },
  {
    id: 3,
    name: "David Mensah",
    role: "Marketing Consultant",
    company: "Mensah & Associates",
    type: "business",
    initials: "DM",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    color: "#14462a",
    quote: "The dual currency feature is perfect for our international clients. We can invoice in GHS and USD seamlessly.",
    metrics: { label: "International clients", value: "60%" },
    featured: false,
  },
  {
    id: 4,
    name: "Sarah Adjei",
    role: "Content Creator",
    company: "Freelancer",
    type: "freelancer",
    initials: "SA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    color: "#0D9488",
    quote: "Before Plaen, I was using Word documents for invoices. Now my clients see me as a real professional. The mobile money integration is a game-changer.",
    metrics: { label: "Professional image", value: "100%" },
    featured: false,
  },
  {
    id: 5,
    name: "Michael Appiah",
    role: "Creative Director",
    company: "Pixel Studios",
    type: "business",
    initials: "MA",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    color: "#14462a",
    quote: "Our payment process was a mess before Plaen. Now everything is automated, professional, and our cash flow has improved dramatically.",
    metrics: { label: "Cash flow improvement", value: "65%" },
    featured: false,
  },
  {
    id: 6,
    name: "Efua Boateng",
    role: "Web Developer",
    company: "Independent",
    type: "freelancer",
    initials: "EB",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    color: "#0D9488",
    quote: "I love that my clients don't need to create accounts to pay. The secure link system is brilliant and removes so much friction.",
    metrics: { label: "Payment completion", value: "92%" },
    featured: false,
  },
];

const stats = [
  { label: "User satisfaction", value: "98%", icon: TrendUp, color: "#0D9488" },
  { label: "Faster payments", value: "2.5x", icon: Clock, color: "#14462a" },
  { label: "Active users", value: "10K+", icon: People, color: "#0D9488" },
  { label: "Countries served", value: "15+", icon: Global, color: "#14462a" },
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
          {/* Hero */}
          <section
            data-animate="fade-up"
            className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-32 text-center"
          >
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
              <Star1 size={14} color="#D97706" variant="Bold" className="mr-2" />
              Customer Stories
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14462a] sm:text-5xl">
              Trusted by operators who value clarity
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-gray-600">
              Hear how freelancers and teams attach context to payments with finance notes, present professionally, and get paid with less friction.
            </p>
          </section>

          {/* Stats */}
          <section className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-16" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className="group rounded-2xl bg-white p-6 text-center"
                    >
                      <div 
                        className="mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <Icon size={28} color={stat.color} variant="Bulk" />
                      </div>
                      <div className="text-3xl font-bold text-black">{stat.value}</div>
                      <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Testimonials */}
          <section className="border-t border-gray-100 bg-white py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  What our users are saying
                </h2>
                <p className="mx-auto max-w-2xl text-base text-gray-600">
                  Real stories from real operators using Plaen every day.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {featuredTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_32px_100px_rgba(0,0,0,0.1)]"
                  >
                    {/* Quote icon background */}
                    <div className="absolute right-8 top-8 opacity-10">
                      <QuoteUp size={64} color={testimonial.color} variant="Bold" />
                    </div>
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Image 
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-full object-cover shadow-lg"
                          />
                          <div>
                            <div className="font-semibold text-black">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">
                              {testimonial.role} · {testimonial.company}
                            </div>
                            <div className="mt-1.5 flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star1 key={i} size={16} color="#D97706" variant="Bold" />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Metric badge */}
                        <div 
                          className="rounded-2xl px-4 py-3 text-center"
                          style={{ backgroundColor: `${testimonial.color}10` }}
                        >
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: testimonial.color }}
                          >
                            {testimonial.metrics.value}
                          </div>
                          <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                            {testimonial.metrics.label}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quote */}
                      <blockquote className="mb-6 text-lg leading-8 text-gray-700">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span 
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                          style={{ 
                            backgroundColor: testimonial.type === 'freelancer' ? '#D9770615' : '#0D948815',
                            color: testimonial.type === 'freelancer' ? '#D97706' : '#0D9488'
                          }}
                        >
                          {testimonial.type === 'freelancer' ? (
                            <User size={14} color={testimonial.type === 'freelancer' ? '#D97706' : '#0D9488'} />
                          ) : (
                            <Building size={14} color="#0D9488" />
                          )}
                          {testimonial.type === 'freelancer' ? 'Freelancer' : 'Business'}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <TickCircle size={14} color="#0D9488" variant="Bold" />
                          Verified user
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* All Testimonials Grid */}
          <section className="border-t border-gray-100 bg-gray-50 py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="mb-8 text-2xl font-semibold text-[#14462a]">More success stories</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {regularTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Quote */}
                    <blockquote className="mb-5 flex-1 text-[15px] leading-relaxed text-gray-700">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-4">
                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <Image 
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{testimonial.name}</div>
                          <div className="text-xs text-gray-500 truncate">{testimonial.role}</div>
                        </div>
                        <div 
                          className="text-right"
                        >
                          <div 
                            className="text-base font-bold"
                            style={{ color: testimonial.color }}
                          >
                            {testimonial.metrics.value}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                            {testimonial.metrics.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="border-t border-gray-100 bg-white py-20" data-animate="fade-up">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500">
                  Use Cases
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-[#14462a] sm:text-4xl">
                  Built for every kind of operator
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <User size={28} color="#D97706" variant="Bulk" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">Freelancers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Designers, developers, writers, and consultants who need professional invoicing.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-700">
                    <DocumentText1 size={14} color="#D97706" />
                    <span>40% faster payments</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                    <Building size={28} color="#0D9488" variant="Bulk" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">Small Businesses</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Agencies, studios, and service providers scaling their operations.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-teal-700">
                    <TrendUp size={14} color="#0D9488" />
                    <span>65% better cash flow</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Mobile size={28} color="#0284C7" variant="Bulk" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">African Operators</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Anyone who needs mobile money, multi-currency, and local payment access.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-700">
                    <Global size={14} color="#0284C7" />
                    <span>5+ currencies supported</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white py-24" data-animate="fade-up">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <div className="rounded-3xl bg-[#14462a] p-12 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />
                </div>
                
                <div className="relative space-y-6">
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Join thousands of satisfied users
                  </h2>
                  <p className="mx-auto max-w-xl text-base text-white/80">
                    Experience the same professional invoicing and faster payments that our users love. Start free today.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href="/signup">
                      <SmartButton size="lg" className="bg-white text-[#14462a] hover:bg-gray-100">
                        Start for free
                        <ArrowRight2 size={16} color="#14462a" className="ml-2" />
                      </SmartButton>
                    </Link>
                    <Link href="/contact">
                      <SmartButton size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                        Talk to our team
                      </SmartButton>
                    </Link>
                  </div>
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
