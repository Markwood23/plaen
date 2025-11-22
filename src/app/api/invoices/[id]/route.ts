import { NextRequest, NextResponse } from 'next/server';

// Mock invoice data for testing - FULL FEATURED VERSION
const mockInvoice = {
  id: 'INV-001',
  invoice_number: 'INV-2024-001',
  issue_date: '2024-11-01',
  due_date: '2024-11-15', // Past due to show overdue badge
  status: 'partially_paid' as const, // Show partially paid badge
  
  from: {
    business_name: 'Plaen',
    email: 'info@plaen.tech',
    phone: '+233 24 123 4567',
    address: 'Cantonments, Accra\nGreater Accra Region, Ghana',
  },
  
  bill_to: {
    name: 'John Doe',
    company: 'Acme Corporation Ltd.',
    email: 'john.doe@acmecorp.com',
  },
  
  items: [
    {
      description: 'Web Design & Development',
      details: 'Complete E-commerce Platform with responsive design',
      quantity: 1,
      unit_price: 2500,
    },
    {
      description: 'Brand Identity Package',
      details: 'Logo design, color palette, and typography guidelines',
      quantity: 1,
      unit_price: 800,
    },
    {
      description: 'Content Writing',
      details: 'SEO-optimized product descriptions',
      quantity: 10,
      unit_price: 50,
    },
  ],
  
  totals: {
    subtotal: 3800,
    tax: 285, // 7.5% tax
    discount: 190, // 5% discount
    total: 3895,
    amount_paid: 1500, // Partial payment to show payment history
    balance_due: 2395, // Remaining balance
  },
  
  payment_methods: ['momo', 'bank', 'card', 'external'] as const,
  
  // PRD features - ALL ENABLED
  notes: "Thank you for your business! Payment is due within 30 days.\n\nPlease reference invoice number INV-2024-001 in your payment description.\n\nAccepted payment methods:\n• MTN Mobile Money: 024-123-4567\n• Bank Transfer: See payment page for details\n• Card: Pay securely online\n\nFor any questions or concerns, please don't hesitate to contact us at info@plaen.tech or call +233 24 123 4567.\n\nWe appreciate your prompt payment!",
  
  attachments: [
    {
      id: 'att-1',
      name: 'Project_Proposal_Final.pdf',
      size: '2.3 MB',
      url: '/downloads/project-proposal.pdf',
    },
    {
      id: 'att-2',
      name: 'Service_Agreement_Signed.pdf',
      size: '1.8 MB',
      url: '/downloads/contract-agreement.pdf',
    },
    {
      id: 'att-3',
      name: 'Design_Mockups_V2.zip',
      size: '12.5 MB',
      url: '/downloads/design-mockups.zip',
    },
  ],
  
  payment_history: [
    {
      id: 'pay-1',
      date: '2024-11-10',
      amount: 1000,
      method: 'MTN Mobile Money',
      reference: 'MM12594830',
      status: 'Confirmed',
    },
    {
      id: 'pay-2',
      date: '2024-11-12',
      amount: 500,
      method: 'Bank Transfer',
      reference: 'TRF-GCB-45678',
      status: 'Confirmed',
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // For now, return mock data for any invoice ID
  return NextResponse.json(mockInvoice);
}
