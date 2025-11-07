# Plaen — Structure, made accessible.

A clean, modern workspace for financial interactions. Plaen enables anyone — individual or business — to create structured, beautiful, and verifiable invoices, manage payments, and build a clear record of their documentation.

## Features

### ✨ Smart Onboarding
- **Personal or Business** setup paths
- Pre-fill branding, payout methods, and tax details automatically
- Tailored experience for individuals and companies

### 🎨 Invoice Builder
- Clean, quiet interface with real-time totals
- Add items, taxes, notes with precision
- Save drafts, duplicate templates, send instantly

### 💳 Payment System
- Hosted payment pages via Flutterwave/Paystack
- Support for bank transfer, mobile money, and crypto
- No client login required — secure link payments

### 📋 Documentation & Records
- Every invoice becomes timestamped, verifiable documentation
- Clean dashboard with Draft, Sent, Paid, Overdue statuses
- Search and filter capabilities

## Design Philosophy

Plaen's design language is neutral and deliberate:
- **Colors**: Black, white, and soft gray tones
- **Typography**: Inter for interface, Aeonik for brand elements
- **Layout**: Spacious, precise alignment, subtle interactions
- **Voice**: Direct, calm, confident — "Structure complete."

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Fonts**: Inter (interface), Aeonik (brand) 
- **Icons**: Lucide React
- **Data**: Mock data structure (ready for backend integration)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with brand messaging
│   ├── dashboard/         # Invoice dashboard with table
│   ├── onboarding/        # Personal vs Business setup
│   ├── invoices/new/      # Invoice builder interface
│   └── invoice/[id]/      # Public shareable invoice page
├── components/ui/         # shadcn/ui components
├── lib/
│   └── mock-data.ts      # TypeScript types and mock data
└── app/globals.css       # Tailwind CSS with brand tokens
```

## Key Pages

- **`/`** — Homepage with Plaen branding and messaging
- **`/onboarding`** — Smart onboarding flow (Personal vs Business)
- **`/dashboard`** — Invoice management with search/filter
- **`/invoices/new`** — Clean invoice builder interface
- **`/invoice/[id]`** — Public invoice view with payment options

## Mock Data

The app includes comprehensive mock data:
- User profiles (Personal & Business)
- Sample invoices with different statuses
- Payment methods and currency support
- Realistic African market data (Ghana focus)

## Brand Implementation

Following the exact Plaen brand specifications:
- **Wordmark**: plæn. (lowercase with period)
- **Tagline**: "Structure, made accessible."
- **Microcopy**: "Welcome back to Plaen.", "Your workspace is ready.", "Payment received. Structure complete."
- **Color Palette**: Neutral blacks, whites, soft grays
- **Typography**: Inter for UI, geometric fallback for Aeonik brand font

## Next Steps (Backend Integration)

This frontend is ready for backend integration:
1. **Authentication**: NextAuth or Supabase Auth
2. **Database**: PostgreSQL with Prisma ORM
3. **Payments**: Flutterwave/Paystack integration
4. **File Storage**: Invoice PDFs and attachments
5. **Email**: Transactional emails for invoice sending

## Development Notes

- Uses Tailwind CSS v4 syntax (lint warnings are expected)
- Mock data simulates real African payment methods
- Responsive design optimized for mobile-first
- Ready for deployment to Vercel

---

**Built with precision and clarity** — the Plaen way.
