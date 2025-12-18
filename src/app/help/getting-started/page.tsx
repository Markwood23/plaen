import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { TickCircle, Flash, DocumentText, People } from "iconsax-react";

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
    icon: Flash,
    color: "#D97706"
  },
  {
    title: "Customize your invoices",
    description: "Add your logo, business colors, and custom fields to match your brand.",
    icon: DocumentText,
    color: "#0D9488"
  },
  {
    title: "Invite team members", 
    description: "Collaborate with your team by inviting them to your Plaen workspace.",
    icon: People,
    color: "#14462a"
  }
];

export default function GettingStartedPage() {
  return (
    <HelpArticleLayout
      title="Getting Started with Plaen"
      description="Learn how to set up your Plaen account and create your first invoice in just a few minutes."
      category="Getting Started"
      categoryColor="#14462a"
      readTime="5 min read"
      relatedArticles={[
        {
          title: "Creating your Plaen account",
          description: "Step-by-step guide to setting up your account",
          slug: "creating-account",
          readTime: "2 min"
        },
        {
          title: "Your first invoice",
          description: "Learn how to create and send your first invoice",
          slug: "first-invoice",
          readTime: "5 min"
        },
        {
          title: "Setting up payment methods",
          description: "Connect your preferred payment methods",
          slug: "payment-setup",
          readTime: "4 min"
        }
      ]}
    >
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14462a] text-white font-semibold">
                {step.number}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-black mb-4">{step.title}</h3>
              <p className="text-gray-700 mb-6 text-lg leading-7">{step.description}</p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {step.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <TickCircle size={16} color="#14462a" variant="Bold" />
                    <span className="text-sm text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-black mt-16 mb-6">Quick tips for success</h2>
      <p className="text-lg leading-8 text-gray-700 mb-8">
        Here are some additional tips to help you get the most out of Plaen from day one:
      </p>

      <div className="not-prose mt-8 grid gap-6 sm:grid-cols-3">
        {quickTips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.title} className="rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${tip.color}15` }}
              >
                <Icon size={20} color={tip.color} variant="Bulk" />
              </div>
              <h3 className="font-semibold text-black mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-700 leading-6">{tip.description}</p>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-semibold text-black mt-16 mb-6">Need help?</h2>
      <p className="text-lg leading-8 text-gray-700">
        If you run into any issues or have questions, our support team is here to help. 
        You can reach us through the chat widget in the bottom right corner of your screen, 
        or send us an email at <a href="mailto:support@plaen.tech" className="text-[#14462a] hover:underline">support@plaen.tech</a>.
      </p>
    </HelpArticleLayout>
  );
}
