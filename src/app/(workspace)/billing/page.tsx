"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TickCircle, 
  DocumentDownload,
  Card,
  Calendar 
} from "iconsax-react";

export default function WorkspaceBillingPage() {
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);

  console.log('Billing page rendered, showChangePlanModal:', showChangePlanModal);

  const billingHistory = [
    {
      id: "inv_2024_11",
      date: "Nov 1, 2024",
      description: "Plaen Free - November 2024",
      amount: "₵0.00",
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_2024_10",
      date: "Oct 1, 2024",
      description: "Plaen Free - October 2024",
      amount: "₵0.00",
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_2024_09",
      date: "Sep 1, 2024",
      description: "Plaen Free - September 2024",
      amount: "₵0.00",
      status: "paid",
      downloadUrl: "#"
    },
  ];

  return (
    <div className="space-y-8">
      {/* TEST BUTTON */}
      <button 
        onClick={() => alert('TEST: Button clicked!')}
        style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
      >
        🔴 TEST CLICK ME
      </button>
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Billing</h1>
        <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage your subscription and billing history</p>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E4E6EB', backgroundColor: 'white' }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B0B3B8' }}>Current plan</p>
              <Badge 
                className="rounded-full px-2.5 py-0.5 text-xs" 
                style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', border: 'none' }}
              >
                Active
              </Badge>
            </div>
            <p className="text-2xl font-semibold mb-2" style={{ color: '#2D2D2D' }}>Free</p>
            <p className="text-sm mb-4" style={{ color: '#B0B3B8' }}>Unlimited invoices • pay-as-you-go fees</p>
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full px-5 h-10 shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: '#14462a', color: 'white' }}
                onClick={() => {
                  console.log('Change Plan clicked!');
                  setShowChangePlanModal(true);
                }}
              >
                Change Plan
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-5 h-10 border-0 shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: '#F9F9F9', color: '#2D2D2D' }}
                onClick={() => {
                  console.log('Update payment method clicked');
                  alert('Payment method update coming soon!');
                }}
              >
                <Card size={16} color="#2D2D2D" className="mr-2" />
                Update Payment Method
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 border-t pt-6 md:grid-cols-3" style={{ borderColor: '#E4E6EB' }}>
          {[
            'Mobile money, bank, USD, crypto payments',
            'Finance Notes & Docs receipts',
            'Dual currency invoicing',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <TickCircle size={16} color="#0D9488" className="mt-0.5 flex-shrink-0" />
              <span className="text-sm" style={{ color: '#65676B' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E4E6EB', backgroundColor: 'white' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>Billing History</h2>
            <p className="text-sm mt-1" style={{ color: '#B0B3B8' }}>Download your past invoices and receipts</p>
          </div>
        </div>

        <div className="space-y-3">
          {billingHistory.map((invoice) => (
            <div 
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-sm"
              style={{ backgroundColor: '#FAFBFC' }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}
                >
                  <Calendar size={18} color="#14462a" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>{invoice.description}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{invoice.amount}</p>
                  <Badge 
                    className="rounded-full px-2 py-0.5 text-xs mt-1" 
                    style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', border: 'none' }}
                  >
                    <TickCircle size={12} color="#0D9488" className="mr-1" />
                    Paid
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-9 w-9 p-0"
                  style={{ color: '#B0B3B8' }}
                  onClick={() => {
                    console.log('Download clicked for', invoice.id);
                    alert(`Download invoice: ${invoice.description}`);
                  }}
                >
                  <DocumentDownload size={16} color="#B0B3B8" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {billingHistory.length === 0 && (
          <div className="text-center py-12">
            <div 
              className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#FAFBFC' }}
            >
              <Calendar size={24} color="#B0B3B8" />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#2D2D2D' }}>No billing history</p>
            <p className="text-sm" style={{ color: '#B0B3B8' }}>Your invoices will appear here</p>
          </div>
        )}
      </div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            console.log('Modal overlay clicked');
            setShowChangePlanModal(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2D2D2D' }}>Choose Your Plan</h2>
            <p className="text-sm mb-6" style={{ color: '#B0B3B8' }}>Select the plan that works best for your business</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { name: "Free", price: "₵0", features: ["Unlimited invoices", "Basic features", "Email support"] },
                { name: "Pro", price: "₵99", features: ["Everything in Free", "Advanced analytics", "Priority support"] },
                { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integration", "Dedicated support"] }
              ].map((plan) => (
                <div 
                  key={plan.name}
                  className="border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderColor: '#E4E6EB' }}
                >
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#2D2D2D' }}>{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4" style={{ color: '#2D2D2D' }}>
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-sm font-normal" style={{ color: '#B0B3B8' }}>/mo</span>}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: '#65676B' }}>
                        <TickCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#0D9488' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full rounded-full h-10"
                    style={{ backgroundColor: plan.name === "Free" ? '#F9F9F9' : '#14462a', color: plan.name === "Free" ? '#2D2D2D' : 'white' }}
                  >
                    {plan.name === "Free" ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-full px-6 h-10 border-0"
                style={{ backgroundColor: '#F9F9F9', color: '#2D2D2D' }}
                onClick={() => setShowChangePlanModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
