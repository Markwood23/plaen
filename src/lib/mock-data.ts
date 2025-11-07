export type UserType = 'personal' | 'business';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  createdAt: Date;
}

export interface PersonalProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  payoutMethods: PaymentMethod[];
  preferredCurrency: string;
}

export interface BusinessProfile {
  userId: string;
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  logo?: string;
  payoutMethods: PaymentMethod[];
  preferredCurrency: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  currency: string;
  notes?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  paidAt?: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Mock data
export const mockUser: User = {
  id: 'user-1',
  email: 'mark@example.com',
  name: 'Mark Duah',
  type: 'business',
  createdAt: new Date('2024-01-15'),
};

export const mockBusinessProfile: BusinessProfile = {
  userId: 'user-1',
  companyName: 'Plaen',
  email: 'hello@plaen.tech',
  phone: '+233 20 123 4567',
  address: 'Accra, Ghana',
  taxId: 'GH-123456789',
  payoutMethods: ['mobile_money', 'bank_transfer'],
  preferredCurrency: 'GHS',
};

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    userId: 'user-1',
    invoiceNumber: 'INV-001',
    status: 'paid',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    items: [
      {
        id: 'item-1',
        description: 'Website Design & Development',
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
      {
        id: 'item-2',
        description: 'Brand Identity Package',
        quantity: 1,
        rate: 2500,
        amount: 2500,
      },
    ],
    subtotal: 7500,
    taxRate: 12.5,
    taxAmount: 937.5,
    total: 8437.5,
    currency: 'GHS',
    notes: 'Payment due within 30 days of invoice date.',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20'),
    sentAt: new Date('2024-01-16'),
    paidAt: new Date('2024-01-20'),
  },
  {
    id: 'inv-002',
    userId: 'user-1',
    invoiceNumber: 'INV-002',
    status: 'sent',
    clientName: 'StartupXYZ',
    clientEmail: 'finance@startupxyz.com',
    items: [
      {
        id: 'item-3',
        description: 'Mobile App UI/UX Design',
        quantity: 1,
        rate: 3500,
        amount: 3500,
      },
    ],
    subtotal: 3500,
    total: 3500,
    currency: 'GHS',
    dueDate: new Date('2024-12-15'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    sentAt: new Date('2024-11-01'),
  },
  {
    id: 'inv-003',
    userId: 'user-1',
    invoiceNumber: 'INV-003',
    status: 'draft',
    clientName: 'TechFlow Ltd',
    clientEmail: 'projects@techflow.com',
    items: [
      {
        id: 'item-4',
        description: 'Consulting Services',
        quantity: 10,
        rate: 150,
        amount: 1500,
      },
    ],
    subtotal: 1500,
    total: 1500,
    currency: 'GHS',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: 'inv-004',
    userId: 'user-1',
    invoiceNumber: 'INV-004',
    status: 'overdue',
    clientName: 'Digital Agency Co',
    clientEmail: 'accounts@digitalagency.com',
    items: [
      {
        id: 'item-5',
        description: 'Logo Design',
        quantity: 1,
        rate: 800,
        amount: 800,
      },
    ],
    subtotal: 800,
    total: 800,
    currency: 'GHS',
    dueDate: new Date('2024-10-15'),
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15'),
    sentAt: new Date('2024-09-15'),
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    invoiceId: 'inv-001',
    amount: 8437.5,
    currency: 'GHS',
    method: 'mobile_money',
    status: 'completed',
    transactionId: 'MM-20240120-001',
    createdAt: new Date('2024-01-20'),
    completedAt: new Date('2024-01-20'),
  },
];
