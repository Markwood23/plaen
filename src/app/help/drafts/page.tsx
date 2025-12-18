"use client";

import { HelpArticleLayout } from "@/components/help/help-article-layout";
import { DocumentText, ArchiveAdd, Clock, Edit } from "iconsax-react";

export default function DraftsPage() {
  return (
    <HelpArticleLayout
      title="Saving and Managing Drafts"
      description="Learn how to save invoice drafts, manage work in progress, and efficiently handle multiple invoice projects."
      category="Creating Invoices"
      categoryColor="#0D9488"
      readTime="3 min read"
      relatedArticles={[
        {
          title: "Invoice builder guide",
          description: "Master the invoice builder",
          slug: "invoice-builder",
          readTime: "5 min read"
        },
        {
          title: "Your first invoice",
          description: "Create your first invoice",
          slug: "first-invoice",
          readTime: "4 min read"
        }
      ]}
    >
      <h2>What Are Invoice Drafts?</h2>
      <p>
        Invoice drafts are incomplete invoices saved for later completion. 
        They allow you to work on multiple invoices over time, save progress 
        as you gather information, and prepare invoices in advance.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <ArchiveAdd size={20} color="#6B7280" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">Auto-save</h3>
          <p className="mt-2 text-sm text-gray-700">
            Your work is saved automatically as you type
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Clock size={20} color="#6B7280" variant="Bulk" />
          </div>
          <h3 className="font-semibold text-black">Work at Your Pace</h3>
          <p className="mt-2 text-sm text-gray-700">
            Complete invoices when you have all the information
          </p>
        </div>
      </div>

      <h2>Creating and Saving Drafts</h2>
      
      <h3>Automatic Draft Creation</h3>
      <p>
        Plaen automatically creates drafts when you:
      </p>
      <ul>
        <li>Start creating a new invoice</li>
        <li>Add any content to the invoice builder</li>
        <li>Make changes to an existing draft</li>
        <li>Navigate away from an unsent invoice</li>
      </ul>

      <h3>Manual Draft Saving</h3>
      <p>
        You can also save drafts manually:
      </p>
      <ul>
        <li>Click <strong>"Save Draft"</strong> in the invoice builder</li>
        <li>Use keyboard shortcut <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Cmd + S</kbd> (Mac) or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + S</kbd> (Windows)</li>
        <li>Drafts save automatically every 30 seconds</li>
        <li>All changes are preserved when you leave the page</li>
      </ul>

      <h2>Managing Your Drafts</h2>
      
      <h3>Accessing Drafts</h3>
      <p>
        Find your drafts in multiple places:
      </p>
      <ol>
        <li>Go to <strong>Invoices → Drafts</strong> in the main navigation</li>
        <li>Use the <strong>"Recent Drafts"</strong> section on your dashboard</li>
        <li>Filter invoices by <strong>"Draft"</strong> status</li>
        <li>Search for drafts by client name or content</li>
      </ol>

      <h3>Draft Information Display</h3>
      <p>
        Each draft shows:
      </p>
      <ul>
        <li><strong>Draft title:</strong> Client name or "Untitled Draft"</li>
        <li><strong>Last modified:</strong> When you last worked on it</li>
        <li><strong>Total amount:</strong> Current invoice total (if calculated)</li>
        <li><strong>Completion status:</strong> Percentage of required fields filled</li>
      </ul>

      <h2>Working with Drafts</h2>
      
      <h3>Continuing Work on a Draft</h3>
      <ol>
        <li>Click on any draft from your drafts list</li>
        <li>You'll be taken to the invoice builder</li>
        <li>All your previous work is preserved</li>
        <li>Continue adding information as needed</li>
        <li>Send when ready or save again for later</li>
      </ol>

      <h3>Draft Completion Checklist</h3>
      <p>
        Before sending a draft, ensure you have:
      </p>
      <div className="not-prose my-6 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" readOnly />
          <span className="text-sm text-gray-700">Client information complete</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" readOnly />
          <span className="text-sm text-gray-700">At least one line item added</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" readOnly />
          <span className="text-sm text-gray-700">Payment methods selected</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" readOnly />
          <span className="text-sm text-gray-700">Due date set</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" readOnly />
          <span className="text-sm text-gray-700">Invoice reviewed and proofread</span>
        </div>
      </div>

      <h2>Draft Management Features</h2>
      
      <h3>Organizing Drafts</h3>
      <ul>
        <li><strong>Rename drafts:</strong> Give descriptive names to identify projects</li>
        <li><strong>Add notes:</strong> Include reminders or missing information</li>
        <li><strong>Set priority:</strong> Mark urgent drafts for easy identification</li>
        <li><strong>Client grouping:</strong> View drafts organized by client</li>
      </ul>

      <h3>Bulk Actions</h3>
      <p>
        Manage multiple drafts at once:
      </p>
      <ul>
        <li><strong>Select multiple drafts</strong> using checkboxes</li>
        <li><strong>Delete old drafts</strong> you no longer need</li>
        <li><strong>Duplicate drafts</strong> for similar projects</li>
        <li><strong>Export draft information</strong> for external use</li>
      </ul>

      <h2>Common Draft Scenarios</h2>
      
      <h3>Scenario 1: Missing Client Information</h3>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-5 bg-gray-50">
        <h4 className="font-semibold text-black mb-2">Situation:</h4>
        <p className="text-sm text-gray-700 mb-3">
          You've completed a project but don't have the client's billing address yet.
        </p>
        <h4 className="font-semibold text-black mb-2">Solution:</h4>
        <p className="text-sm text-gray-700">
          Create a draft with the project details and amounts. Add a note "Need billing address" 
          and complete when you receive the information.
        </p>
      </div>

      <h3>Scenario 2: Monthly Recurring Invoices</h3>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-5 bg-gray-50">
        <h4 className="font-semibold text-black mb-2">Situation:</h4>
        <p className="text-sm text-gray-700 mb-3">
          You provide monthly services and want to prepare invoices in advance.
        </p>
        <h4 className="font-semibold text-black mb-2">Solution:</h4>
        <p className="text-sm text-gray-700">
          Create a template draft for each recurring client. Duplicate and update monthly, 
          then send at your regular billing time.
        </p>
      </div>

      <h3>Scenario 3: Complex Multi-Part Project</h3>
      <div className="not-prose my-6 rounded-lg border border-gray-200 p-5 bg-gray-50">
        <h4 className="font-semibold text-black mb-2">Situation:</h4>
        <p className="text-sm text-gray-700 mb-3">
          You're working on a large project with multiple deliverables over several weeks.
        </p>
        <h4 className="font-semibold text-black mb-2">Solution:</h4>
        <p className="text-sm text-gray-700">
          Add line items to your draft as you complete each deliverable. This keeps an accurate 
          running total and ensures nothing is forgotten at billing time.
        </p>
      </div>

      <h2>Best Practices</h2>
      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Name Your Drafts</h4>
          <p className="text-sm text-gray-700">
            Use clear names like "ABC Corp - Website Redesign" instead of "Untitled Draft"
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Clean Up Regularly</h4>
          <p className="text-sm text-gray-700">
            Delete old or abandoned drafts to keep your workspace organized
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-black mb-2">Use Notes</h4>
          <p className="text-sm text-gray-700">
            Add notes about what's missing or needs to be done before sending
          </p>
        </div>
      </div>
    </HelpArticleLayout>
  );
}
