"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Save, ArrowRight, Clock, Edit3, Trash2 } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function DraftsPage() {
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
                  <FileText className="h-3 w-3" />
                  Creating Invoices
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight">
                  Saving and managing drafts
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                  Learn how to save invoice drafts, manage work in progress, and 
                  efficiently handle multiple invoice projects.
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Last updated: November 2024</span>
                  <span>•</span>
                  <span>3 min read</span>
                </div>
              </div>

              <div className="article-content prose prose-xl prose-gray max-w-none leading-[2] prose-headings:text-black prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-[2] prose-li:text-gray-700 prose-li:leading-[2] prose-blockquote:text-gray-700 prose-blockquote:leading-[2] prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline">
                <h2>What are invoice drafts?</h2>
                <p>
                  Invoice drafts are incomplete invoices saved for later completion. 
                  They allow you to work on multiple invoices over time, save progress 
                  as you gather information, and prepare invoices in advance.
                </p>

                <div className="not-prose my-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Save className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Auto-save</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Your work is saved automatically as you type
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Clock className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Work at Your Pace</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Complete invoices when you have all the information
                    </p>
                  </div>
                </div>

                <h2>Creating and saving drafts</h2>
                
                <h3>Automatic draft creation</h3>
                <p>
                  Plaen automatically creates drafts when you:
                </p>
                <ul>
                  <li>Start creating a new invoice</li>
                  <li>Add any content to the invoice builder</li>
                  <li>Make changes to an existing draft</li>
                  <li>Navigate away from an unsent invoice</li>
                </ul>

                <h3>Manual draft saving</h3>
                <p>
                  You can also save drafts manually:
                </p>
                <ul>
                  <li>Click <strong>"Save Draft"</strong> in the invoice builder</li>
                  <li>Use keyboard shortcut <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl + S</kbd> (or <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Cmd + S</kbd> on Mac)</li>
                  <li>Drafts save automatically every 30 seconds</li>
                  <li>All changes are preserved when you leave the page</li>
                </ul>

                <h2>Managing your drafts</h2>
                
                <h3>Accessing drafts</h3>
                <p>
                  Find your drafts in multiple places:
                </p>
                <ol>
                  <li>Go to <strong>Invoices → Drafts</strong> in the main navigation</li>
                  <li>Use the <strong>"Recent Drafts"</strong> section on your dashboard</li>
                  <li>Filter invoices by <strong>"Draft"</strong> status</li>
                  <li>Search for drafts by client name or content</li>
                </ol>

                <h3>Draft information display</h3>
                <p>
                  Each draft shows:
                </p>
                <ul>
                  <li><strong>Draft title:</strong> Client name or "Untitled Draft"</li>
                  <li><strong>Last modified:</strong> When you last worked on it</li>
                  <li><strong>Total amount:</strong> Current invoice total (if calculated)</li>
                  <li><strong>Completion status:</strong> Percentage of required fields filled</li>
                </ul>

                <h2>Working with drafts</h2>
                
                <h3>Continuing work on a draft</h3>
                <ol>
                  <li>Click on any draft from your drafts list</li>
                  <li>You'll be taken to the invoice builder</li>
                  <li>All your previous work is preserved</li>
                  <li>Continue adding information as needed</li>
                  <li>Send when ready or save again for later</li>
                </ol>

                <h3>Draft completion checklist</h3>
                <p>
                  Before sending a draft, ensure you have:
                </p>
                <div className="not-prose my-6 space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm">Client information complete</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm">At least one line item added</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm">Payment methods selected</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm">Due date set</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm">Invoice reviewed and proofread</span>
                  </div>
                </div>

                <h2>Draft management features</h2>
                
                <h3>Organizing drafts</h3>
                <ul>
                  <li><strong>Rename drafts:</strong> Give descriptive names to identify projects</li>
                  <li><strong>Add notes:</strong> Include reminders or missing information</li>
                  <li><strong>Set priority:</strong> Mark urgent drafts for easy identification</li>
                  <li><strong>Client grouping:</strong> View drafts organized by client</li>
                </ul>

                <h3>Bulk actions</h3>
                <p>
                  Manage multiple drafts at once:
                </p>
                <ul>
                  <li><strong>Select multiple drafts</strong> using checkboxes</li>
                  <li><strong>Delete old drafts</strong> you no longer need</li>
                  <li><strong>Duplicate drafts</strong> for similar projects</li>
                  <li><strong>Export draft information</strong> for external use</li>
                </ul>

                <h2>Common draft scenarios</h2>
                
                <h3>Scenario 1: Missing client information</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
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

                <h3>Scenario 2: Monthly recurring invoices</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-semibold text-black mb-2">Situation:</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    You provide monthly services and want to prepare invoices in advance.
                  </p>
                  <h4 className="font-semibold text-black mb-2">Solution:</h4>
                  <p className="text-sm text-gray-700">
                    Create drafts for the next few months with standard services. 
                    Update dates and any variable amounts before sending each month.
                  </p>
                </div>

                <h3>Scenario 3: Complex project invoicing</h3>
                <div className="not-prose my-6 rounded-lg border border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-semibold text-black mb-2">Situation:</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Large project with multiple deliverables completed at different times.
                  </p>
                  <h4 className="font-semibold text-black mb-2">Solution:</h4>
                  <p className="text-sm text-gray-700">
                    Create a draft and add line items as you complete each deliverable. 
                    Send the complete invoice when all work is finished.
                  </p>
                </div>

                <h2>Draft templates and reuse</h2>
                
                <h3>Creating draft templates</h3>
                <p>
                  For recurring work, create reusable draft templates:
                </p>
                <ol>
                  <li>Create a draft with standard services and rates</li>
                  <li>Save it with a clear template name</li>
                  <li>Duplicate the template for new projects</li>
                  <li>Customize the copy for each specific client</li>
                </ol>

                <h3>Template examples</h3>
                <ul>
                  <li><strong>Web Design Package:</strong> Standard web services with typical rates</li>
                  <li><strong>Monthly Retainer:</strong> Regular monthly services template</li>
                  <li><strong>Consultation Template:</strong> Hourly consultation with common rates</li>
                  <li><strong>Logo Design:</strong> Typical logo design process and deliverables</li>
                </ul>

                <h2>Draft cleanup and maintenance</h2>
                
                <h3>Regular cleanup</h3>
                <p>
                  Keep your drafts organized by:
                </p>
                <ul>
                  <li><strong>Weekly review:</strong> Check drafts that need completion</li>
                  <li><strong>Delete old drafts:</strong> Remove outdated or unnecessary drafts</li>
                  <li><strong>Complete stale drafts:</strong> Finish invoices that have been waiting</li>
                  <li><strong>Archive completed projects:</strong> Move finished work to archive</li>
                </ul>

                <h3>Draft notifications</h3>
                <p>
                  Plaen can remind you about:
                </p>
                <ul>
                  <li>Drafts older than a certain number of days</li>
                  <li>Drafts with upcoming project deadlines</li>
                  <li>Incomplete drafts for completed projects</li>
                  <li>Monthly recurring invoice drafts ready to send</li>
                </ul>

                <h2>Best practices</h2>
                <ul>
                  <li><strong>Use descriptive names:</strong> Name drafts clearly for easy identification</li>
                  <li><strong>Add completion notes:</strong> Include what's missing or needs updating</li>
                  <li><strong>Set reminders:</strong> Use calendar reminders for draft completion deadlines</li>
                  <li><strong>Regular cleanup:</strong> Delete unused drafts to reduce clutter</li>
                  <li><strong>Backup important drafts:</strong> Export complex drafts for safekeeping</li>
                </ul>

                <div className="not-prose mt-12 flex flex-col gap-4 sm:flex-row">
                  <Link href="/help/invoice-builder">
                    <Button size="lg">
                      Learn invoice builder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/help/first-invoice">
                    <Button size="lg" variant="outline">
                      Create your first invoice
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