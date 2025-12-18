"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { User, TickCircle, CloseCircle } from "iconsax-react";

export default function FreelancerInvoicesPage() {
  return (
    <HelpArticleLayout
      title="Creating Professional Invoices as a Freelancer"
      description="Best practices for freelancers to create invoices that look professional, get paid faster, and build trust with clients."
      category="Getting Started"
      categoryColor="#14462a"
      readTime="7 min read"
      relatedArticles={[
        {
          title: "Your first invoice",
          description: "Create your first invoice",
          slug: "first-invoice",
          readTime: "4 min read"
        },
        {
          title: "Getting started",
          description: "Your first steps with Plaen",
          slug: "getting-started",
          readTime: "5 min read"
        }
      ]}
    >
      <h2>Why Professional Invoices Matter</h2>
      <p>
        As a freelancer, your invoice is often the last impression you make on a client. 
        A professional invoice builds trust, reinforces your brand, and significantly 
        increases the likelihood of timely payment.
      </p>

      <h2>Essential Elements of a Professional Freelance Invoice</h2>

      <h3>1. Clear Business Identity</h3>
      <p>
        Even as a solo freelancer, present yourself professionally:
      </p>
      <ul>
        <li><strong>Your full name or business name:</strong> Use consistently across all materials</li>
        <li><strong>Professional email address:</strong> Avoid generic Gmail addresses when possible</li>
        <li><strong>Complete contact information:</strong> Phone number, website, professional address</li>
        <li><strong>Logo or personal brand mark:</strong> Simple but consistent visual identity</li>
      </ul>

      <h3>2. Sequential Invoice Numbering</h3>
      <p>
        Professional numbering system options:
      </p>
      <ul>
        <li><strong>Simple sequential:</strong> 001, 002, 003</li>
        <li><strong>Year-based:</strong> 2024-001, 2024-002</li>
        <li><strong>Client-based:</strong> ABC-001, XYZ-001</li>
        <li><strong>Your initials:</strong> JS-001, JS-002</li>
      </ul>

      <h3>3. Detailed Service Descriptions</h3>
      <p>
        Avoid vague descriptions. Be specific about what you delivered:
      </p>

      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div className="mb-3 flex items-center gap-3 font-semibold text-black">
            <TickCircle size={20} color="#14462a" variant="Bulk" />
            Professional examples
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• "Logo design: 3 initial concepts, 2 rounds of revisions, final vector files (AI, EPS, PNG)"</li>
            <li>• "WordPress website development: 5-page responsive site with contact form and SEO optimization"</li>
            <li>• "Content writing: 5 blog posts (800-1200 words each) including keyword research and meta descriptions"</li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-3 font-semibold text-black">
            <CloseCircle size={20} color="#9CA3AF" variant="Bulk" />
            Avoid these
          </div>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li>• "Design work"</li>
            <li>• "Website stuff"</li>
            <li>• "Writing project"</li>
          </ul>
        </div>
      </div>

      <h2>Freelance-Specific Invoicing Strategies</h2>

      <h3>Project-Based vs. Hourly Billing</h3>
      
      <h4>Project-Based Invoicing</h4>
      <ul>
        <li><strong>Fixed scope:</strong> "Brand identity package: Logo, business cards, letterhead"</li>
        <li><strong>Milestone billing:</strong> Break large projects into phases</li>
        <li><strong>Value-based pricing:</strong> Price based on client value, not hours</li>
      </ul>

      <h4>Hourly Invoicing</h4>
      <ul>
        <li><strong>Detailed time tracking:</strong> Break down hours by task or date</li>
        <li><strong>Time ranges:</strong> "Design consultation (2.5 hours): March 15, 9:00 AM - 11:30 AM"</li>
        <li><strong>Task descriptions:</strong> What was accomplished in each time block</li>
      </ul>

      <h3>Payment Terms for Freelancers</h3>
      <p>
        Set clear expectations from the start:
      </p>
      <ul>
        <li><strong>Net 15:</strong> Good for small projects and trusted clients</li>
        <li><strong>Net 30:</strong> Standard for larger projects or corporate clients</li>
        <li><strong>Due on receipt:</strong> For ongoing retainer clients</li>
        <li><strong>50% upfront:</strong> For new clients or large projects</li>
      </ul>

      <h2>Building Client Trust Through Invoices</h2>

      <h3>Include Project Context</h3>
      <p>
        Remind clients what they're paying for:
      </p>
      <ul>
        <li>Reference the original project agreement</li>
        <li>Include project start and completion dates</li>
        <li>Mention key deliverables or milestones completed</li>
        <li>Add a brief thank you note</li>
      </ul>

      <h3>Transparent Pricing</h3>
      <p>
        Show your work, even for fixed-price projects:
      </p>
      <ul>
        <li>Break down components of the project</li>
        <li>Show any discounts applied</li>
        <li>Explain any additional charges</li>
        <li>Include original quote reference if applicable</li>
      </ul>

      <h2>Common Freelancer Invoice Mistakes</h2>
      
      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Sending Too Late</h4>
          <p className="text-sm text-gray-700">
            Invoice immediately upon project completion while the value is fresh in the client's mind.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Vague Descriptions</h4>
          <p className="text-sm text-gray-700">
            Clients may question invoices they don't understand. Be specific about deliverables.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Missing Payment Options</h4>
          <p className="text-sm text-gray-700">
            Make it easy to pay. Offer multiple payment methods including mobile money.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">No Follow-Up System</h4>
          <p className="text-sm text-gray-700">
            Set up automatic reminders for overdue invoices. Don't let payments slip.
          </p>
        </div>
      </div>

      <h2>Freelancer Invoice Template</h2>
      <p>
        Your freelance invoice should include:
      </p>

      <div className="not-prose my-6 rounded-xl border border-gray-200 p-6 bg-gray-50 text-sm">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="font-semibold text-black">YOUR NAME / BUSINESS NAME</div>
            <div className="text-gray-600 text-xs">Email • Phone • Website</div>
          </div>
          
          <div className="flex justify-between">
            <div>
              <div className="text-gray-500 text-xs uppercase">Bill To</div>
              <div className="font-medium text-black">Client Name</div>
              <div className="text-gray-600 text-xs">client@email.com</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-xs uppercase">Invoice</div>
              <div className="font-medium text-black">#2024-001</div>
              <div className="text-gray-600 text-xs">Due: Net 15</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Website Development - 5-page responsive site</span>
              <span>GHS 8,000</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>SEO Optimization - On-page SEO for all pages</span>
              <span>GHS 2,000</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-black">
            <span>Total Due</span>
            <span>GHS 10,000</span>
          </div>
        </div>
      </div>

      <h2>Getting Paid Faster Tips</h2>
      <div className="not-prose my-8 space-y-3">
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Send invoices immediately after project completion</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Offer mobile money for instant payments</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Set up automatic payment reminders</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Consider deposits for new clients</span>
        </div>
        <div className="flex items-start gap-3">
          <TickCircle size={18} color="#14462a" variant="Bulk" className="flex-shrink-0 mt-1" />
          <span className="text-gray-700">Build relationships—friendly clients pay faster</span>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
