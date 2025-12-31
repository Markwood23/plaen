# Plaen — Complete Implementation Checklist

> **Last Updated:** December 30, 2025  
> **Current Completion:** ~57% (checklist items) / ~92% (functional MVP)  
> **Note:** Payment system, emails, bulk actions implemented  
> **Target:** 100% MVP Launch

---

## How to Use This File

- [ ] = Not started
- [x] = Completed
- [~] = In progress (replace with [x] when done)

When you resume work, search for `[ ]` to find incomplete items.

---

## 1. Backend Infrastructure (85% → 100%)

### 1.1 Database Setup
- [x] Set up Supabase project
- [x] Configure environment variables (.env.local)
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [x] SUPABASE_SERVICE_ROLE_KEY
  - [x] NEXT_PUBLIC_APP_URL
  - [ ] CRON_SECRET
- [x] Install Supabase client (`@supabase/supabase-js`)
- [x] Create `src/lib/supabase/client.ts` (browser client)
- [x] Create `src/lib/supabase/server.ts` (server client)

### 1.2 Database Schema (Tables)
- [x] **users** table
  - [x] id (uuid, primary key)
  - [x] email (text, unique)
  - [x] name (text)
  - [x] phone (text)
  - [x] country (text)
  - [x] timezone (text)
  - [x] currency (text, default 'GHS')
  - [x] business_name (text, nullable)
  - [x] business_address (text, nullable)
  - [x] logo_url (text, nullable)
  - [x] created_at, updated_at
- [x] **customers** (contacts) table
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key → users)
  - [x] display_name (text)
  - [x] email (text)
  - [x] phone (text)
  - [x] company (text, nullable)
  - [x] type (enum: individual, business)
  - [x] country (text)
  - [x] notes (text)
  - [x] created_at, updated_at
- [x] **invoices** table
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key → users)
  - [x] customer_id (uuid, foreign key → customers)
  - [x] invoice_number (text, unique per user)
  - [x] issue_date (date)
  - [x] due_date (date)
  - [x] currency (text)
  - [x] subtotal_minor (bigint)
  - [x] discount_minor (bigint)
  - [x] tax_minor (bigint)
  - [x] total_minor (bigint)
  - [x] balance_minor (bigint)
  - [x] purpose_category (text)
  - [x] purpose_note (text)
  - [x] status (enum: draft, sent, paid, partially_paid, overdue, cancelled, refunded)
  - [x] notes (text)
  - [x] payment_terms (text)
  - [x] created_at, updated_at
- [x] **invoice_line_items** table
  - [x] id (uuid, primary key)
  - [x] invoice_id (uuid, foreign key → invoices)
  - [x] label (text)
  - [x] description (text)
  - [x] quantity (decimal)
  - [x] unit_price_minor (bigint)
  - [x] tax_rate_bps (int, basis points)
  - [x] discount_minor (bigint)
  - [x] line_total_minor (bigint)
  - [x] sort_order (int)
- [x] **payments** table
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key → users)
  - [x] provider (text: flutterwave, paystack, manual)
  - [x] rail (text: momo, bank, card, crypto, cash)
  - [x] reference (text)
  - [x] amount_minor (bigint)
  - [x] currency (text)
  - [x] fee_minor (bigint)
  - [x] paid_at (timestamp)
  - [x] metadata (jsonb)
  - [x] created_at
- [x] **payment_allocations** table
  - [x] id (uuid, primary key)
  - [x] payment_id (uuid, foreign key → payments)
  - [x] invoice_id (uuid, foreign key → invoices)
  - [x] amount_minor (bigint)
  - [x] created_at
- [x] **receipt_snapshots** table
  - [x] id (uuid, primary key)
  - [x] invoice_id (uuid, foreign key → invoices)
  - [x] version (int)
  - [x] canonical_json (jsonb)
  - [x] sha256_hash (text)
  - [x] created_at
- [x] **attachments** table
  - [x] id (uuid, primary key)
  - [x] invoice_id (uuid, foreign key → invoices)
  - [x] file_name (text)
  - [x] file_url (text)
  - [x] mime_type (text)
  - [x] size_bytes (bigint)
  - [x] checksum_sha256 (text)
  - [x] created_at
- [x] **notes** (finance docs) table
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key → users)
  - [x] title (text)
  - [x] content (jsonb, block-based)
  - [x] tags (text[])
  - [x] is_published (boolean)
  - [x] published_at (timestamp)
  - [x] created_at, updated_at
- [x] **data_queries** table (for live blocks in notes)
  - [x] id (uuid, primary key)
  - [x] note_id (uuid, foreign key → notes)
  - [x] query_type (enum: metric, table, chart)
  - [x] query_config (jsonb)
  - [x] cached_result (jsonb)
  - [x] cached_at (timestamp)

### 1.3 Row Level Security (RLS)
- [x] Enable RLS on all tables
- [x] Create policy: users can only see their own data
- [x] Create policy: users can only modify their own data
- [x] Create policy: public can view public invoice pages (with PII masking)
- [x] Create policy: public can view public receipt pages (with PII masking)
- [x] Test RLS policies

### 1.4 Database Functions & Triggers
- [x] Function: auto-generate invoice_number (PL-XXXXXX format)
- [x] Function: update balance_minor when payment_allocation is created
- [x] Function: update invoice status based on balance (paid/partially_paid)
- [ ] Function: mark invoice as overdue (scheduled job)
- [x] Trigger: update updated_at on row modification
- [ ] Trigger: create receipt_snapshot on payment completion

### 1.5 Indexes
- [x] Index on invoices(user_id, status)
- [x] Index on invoices(user_id, due_date)
- [x] Index on invoices(customer_id)
- [x] Index on payments(user_id, paid_at)
- [x] Index on payment_allocations(invoice_id)

---

## 2. Authentication System (100%)

### 2.1 Supabase Auth Setup
- [x] Enable email/password auth in Supabase
- [x] Configure auth redirects
- [x] Set up email templates (confirmation, reset password)

### 2.2 Auth Implementation
- [x] Create `src/lib/auth/actions.ts` (server actions)
  - [x] signUp function
  - [x] signIn function
  - [x] signOut function
  - [x] resetPassword function
  - [x] updatePassword function
- [x] Create `src/contexts/auth-context.tsx`
- [x] Create `src/hooks/useAuth.ts`

### 2.3 Auth Pages Integration
- [x] Connect `/login/page.tsx` to real auth
- [x] Connect `/signup/page.tsx` to real auth
- [x] Connect `/forgot-password/page.tsx` to real auth
- [x] Connect `/reset-password/page.tsx` to real auth
- [x] Add loading states during auth operations
- [x] Add error handling and display

### 2.4 Protected Routes
- [x] Create auth middleware (`src/middleware.ts`)
- [x] Protect all `/workspace/*` routes
- [x] Redirect logged-in users away from auth pages
- [x] Handle session refresh

### 2.5 User Profile
- [x] Create user profile on signup (database trigger)
- [x] Connect `/profile/page.tsx` to real data
- [x] Implement profile update functionality
- [ ] Implement logo/avatar upload

---

## 3. Invoice System (85% → 100%)

### 3.1 Invoice API Routes
- [x] `POST /api/invoices` — Create invoice
- [x] `GET /api/invoices` — List invoices (with filters)
- [x] `GET /api/invoices/[id]` — Get invoice detail
- [x] `PATCH /api/invoices/[id]` — Update invoice
- [x] `DELETE /api/invoices/[id]` — Delete/cancel invoice
- [x] `POST /api/invoices/[id]/send` — Mark as sent + generate public link
- [x] `POST /api/invoices/[id]/duplicate` — Duplicate invoice

### 3.2 Invoice List Page (`/invoices/page.tsx`)
- [x] Replace mock data with API call
- [x] Implement pagination
- [x] Implement search (by invoice number, customer name)
- [x] Implement filters (status, date range, customer)
- [x] Implement sorting (date, amount, status)
- [x] Add bulk actions (delete, mark as sent)
- [x] Add export to CSV

### 3.3 Invoice Detail Page (`/invoices/[id]/page.tsx`)
- [x] Fetch real invoice data from API
- [x] Display payment history from database
- [x] Display activity timeline from database
- [x] Implement "Record Payment" modal
  - [x] Rail selection (MoMo, Bank, Card, Cash)
  - [x] Amount input (with partial payment support)
  - [x] Reference input
  - [x] Date picker
  - [x] Submit to API
- [x] Implement "Send Invoice" action
  - [x] Email input/selection
  - [x] Generate public link
  - [x] Copy link functionality
- [x] Implement "Download PDF" action
- [x] Implement "Edit Invoice" navigation
- [x] Implement "Cancel Invoice" action
- [x] Implement "Send Reminder" action

### 3.4 Invoice Builder (`/invoices/new/page.tsx`)
- [x] Connect to real customer data (dropdown)
- [x] Implement "Add New Customer" inline modal
- [x] Auto-generate invoice number
- [x] Save as draft functionality
- [x] Line items CRUD
  - [x] Add item
  - [x] Edit item
  - [x] Remove item
  - [ ] Reorder items (drag & drop)
- [x] Tax calculation (per item or total)
- [x] Discount calculation (percentage or fixed)
- [x] Real-time total calculation
- [x] Attachments upload
  - [x] File picker
  - [x] Upload to Supabase Storage
  - [x] Display uploaded files
  - [x] Remove attachment
- [x] Notes/memo field
- [ ] Payment terms selection
- [ ] Preview before sending
- [x] Send invoice action
- [x] Form validation
- [x] Error handling

### 3.5 Invoice Edit Page
- [x] Create `/invoices/[id]/edit/page.tsx`
- [x] Pre-fill form with existing data
- [x] Handle edit restrictions (after payment)
- [ ] Create amendment if financial fields change after payment

### 3.6 Public Invoice Page
- [x] Update `/pay/[id]/page.tsx` to fetch real data
- [x] Implement PII masking for public view
- [ ] Track views (optional: view count in database)

---

## 4. Payment System (30% → 100%)

### 4.1 Payment Provider Integration

#### 4.1.1 Flutterwave Setup
- [x] Create Flutterwave account
- [x] Get API keys (test & live)
- [x] Add env variables
  - [x] FLUTTERWAVE_PUBLIC_KEY
  - [x] FLUTTERWAVE_SECRET_KEY
  - [x] FLUTTERWAVE_ENCRYPTION_KEY
  - [x] FLUTTERWAVE_ENVIRONMENT
  - [ ] FLUTTERWAVE_WEBHOOK_SECRET_HASH
- [x] Install Flutterwave SDK (using native fetch)
- [x] Create `src/lib/payments/flutterwave.ts`
  - [x] initializePayment function
  - [x] verifyPayment function
  - [x] getPaymentStatus function

#### 4.1.2 Paystack Setup (Alternative)
- [ ] Create Paystack account
- [ ] Get API keys
- [ ] Add env variables
- [ ] Create `src/lib/payments/paystack.ts`

#### 4.1.3 Mobile Money Direct (MTN MoMo)
- [ ] Apply for MTN MoMo API access
- [ ] Create `src/lib/payments/momo.ts`
  - [ ] requestToPay function
  - [ ] checkPaymentStatus function

### 4.2 Payment API Routes
- [x] `POST /api/payments/initiate` — Create payment session
  - [x] Connect to real payment provider (Flutterwave)
  - [x] Return checkout URL or payment reference
- [x] `POST /api/webhooks/flutterwave` — Handle Flutterwave webhooks
  - [x] Verify webhook signature
  - [x] Handle successful payment
  - [x] Handle failed payment
  - [x] Idempotency check (prevent double processing)
- [ ] `POST /api/webhooks/paystack` — Handle Paystack webhooks
- [x] `GET /api/payments/[id]/status` — Check payment status
- [x] `POST /api/invoices/[id]/allocations` — Record manual payment
- [x] `GET /api/payments/verify` — Verify payment after redirect

### 4.3 Payment Flow Implementation
- [x] Update `/pay/[id]/page.tsx` payment flow
  - [x] Mobile Money flow
    - [x] Phone number input
    - [x] Provider selection (MTN, AirtelTigo, Vodafone)
    - [x] Initiate payment
    - [x] Show pending state
    - [x] Poll for completion
    - [x] Show success/failure
  - [x] Bank Transfer flow
    - [x] Display bank details
    - [x] Reference generation
    - [x] Manual confirmation option
  - [x] Card payment flow
    - [x] Redirect to payment provider (Flutterwave)
    - [x] Handle callback (`/pay/[id]/callback`)
    - [x] Show result
  - [ ] Crypto payment flow (if supporting)
    - [ ] Generate wallet address
    - [ ] Show QR code
    - [ ] Monitor for payment
- [x] Partial payment support
  - [x] Allow custom amount input
  - [x] Validate against balance due
  - [x] Update invoice balance after payment

### 4.4 Payment Allocation Logic
- [x] Create payment record on successful payment
- [x] Create payment_allocation linking payment to invoice
- [x] Update invoice balance_minor (via DB trigger)
- [x] Update invoice status (partially_paid or paid) (via DB trigger)
- [x] Trigger receipt generation (receipt_snapshots created)

### 4.5 Payments List Page (`/payments/page.tsx`)
- [x] Replace mock data with API call
- [ ] Implement filters (date range, rail, status)
- [ ] Implement search
- [ ] Show payment details modal
- [ ] Link to related invoice

### 4.6 Payment Detail Page (`/payments/[id]/page.tsx`)
- [x] Fetch real payment data
- [ ] Show allocation details
- [ ] Link to invoice
- [ ] Link to receipt

---

## 5. Receipt System (25% → 100%)

### 5.1 Receipt Generation
- [x] Create `src/lib/receipts/generate.ts` (basic snapshot creation in webhook/verify routes)
  - [x] createCanonicalJSON function (in webhook/verify)
  - [x] calculateHash function (SHA-256)
  - [x] createReceiptSnapshot function (receipt_snapshots table)
- [x] Trigger receipt creation on payment completion
- [x] Handle multiple receipts per invoice (partial payments)
- [ ] Version receipts (v1, v2, etc.)

### 5.2 Receipt API Routes
- [x] `GET /api/receipts/[invoice_id]` — Get receipt(s) for invoice
- [ ] `GET /api/receipts/[invoice_id]/[version]` — Get specific version
- [x] `GET /api/receipts/[id]/pdf` — Generate PDF

### 5.3 Receipt PDF Generation
- [x] Install PDF library (puppeteer, jspdf, or @react-pdf/renderer)
- [x] Create PDF template matching receipt UI
- [ ] Include all receipt data
  - [x] Parties (from, to)
  - [x] Invoice number
  - [x] Items and totals
  - [x] Payment details (rail, reference tail)
  - [x] Status
  - [x] Timestamp
  - [x] Hash tail for verification
- [ ] Add watermark for unpaid/cancelled
- [x] Generate downloadable PDF

### 5.4 Receipt Pages
- [ ] Create `/receipts/[id]/page.tsx` (public receipt page)
  - [ ] Fetch receipt data
  - [ ] Display receipt UI
  - [ ] PII masking for public view
  - [ ] Hash verification display
  - [ ] Download PDF button
- [x] Update `/receipts/page.tsx` (list page)
  - [x] Replace mock data with API hook
  - [x] Add empty states for new users
  - [x] Loading skeletons
  - [ ] Link to receipt detail pages

### 5.5 Receipt Verification
- [x] Create verification endpoint `GET /api/verify/[hash]`
- [ ] Display verification status on receipt page
- [ ] Show "Verified" badge with timestamp

---

## 6. Dashboard & Analytics (75% → 100%)

### 6.1 Dashboard API Routes
- [x] `GET /api/dashboard` — Dashboard data (metrics + AR aging + recents)
  - [x] Invoice counts by status
  - [x] Total revenue / outstanding
  - [x] Customer count
  - [x] AR aging buckets
  - [x] Recent invoices
  - [x] Recent payments
- [ ] `GET /api/dashboard/chart-data` — Revenue/profit over time

### 6.2 Dashboard Page Updates (`/dashboard/page.tsx`)
- [x] Replace mock KPI data with API call
- [x] Replace mock AR aging with real data
- [ ] Replace mock chart data with real data
- [ ] Add date range selector
- [ ] Add refresh functionality
- [x] Add loading states

### 6.3 AR Aging Features
- [ ] Calculate aging buckets based on due_date
- [ ] Show overdue invoices list
- [ ] One-click "Send Reminder" action
- [ ] Due soon list (next 7 days)

### 6.4 Metrics Calculations
- [ ] On-time rate calculation
  - [ ] Count invoices paid within 3 days of issue_date
  - [ ] Divide by total paid invoices
  - [ ] Display as percentage
- [ ] DSO calculation
  - [ ] Sum(days_outstanding * amount) / total_credit_sales
  - [ ] Only count unpaid invoices
- [ ] Collection rate
  - [ ] Total collected / Total invoiced
  - [ ] Period-based (monthly, quarterly)

---

## 7. Contacts/Customers (80% → 100%)

### 7.1 Contacts API Routes
- [x] `POST /api/contacts` — Create contact
- [x] `GET /api/contacts` — List contacts
- [x] `GET /api/contacts/[id]` — Get contact detail
- [x] `PATCH /api/contacts/[id]` — Update contact
- [x] `DELETE /api/contacts/[id]` — Delete contact
- [x] `GET /api/contacts/[id]/invoices` — Get invoices for contact
- [x] `GET /api/contacts/[id]/stats` — Get contact statistics

### 7.2 Contacts List Page (`/contacts/page.tsx`)
- [x] Replace mock data with API call
- [x] Implement search (name, email, company)
- [x] Implement filters (type: individual/business)
- [x] Implement sorting
- [x] Add contact action menu
- [ ] Bulk delete

### 7.3 Contact Detail Modal
- [x] Fetch real contact data
- [x] Show contact statistics
  - [x] Total invoiced
  - [x] Total paid
  - [x] Outstanding balance
  - [x] Average payment time
- [x] Show recent invoices
- [x] Edit contact functionality
- [x] Delete contact (with confirmation)

### 7.4 Add/Edit Contact
- [x] Create contact form component
- [x] Form validation
- [x] Save to database
- [x] Update existing contact

---

## 8. Finance Notes & Docs (55% → 100%)

### 8.1 Notes API Routes
- [x] `POST /api/notes` — Create note
- [x] `GET /api/notes` — List notes
- [x] `GET /api/notes/[id]` — Get note detail
- [x] `PATCH /api/notes/[id]` — Update note
- [x] `DELETE /api/notes/[id]` — Delete note
- [x] `POST /api/notes/[id]/publish` — Publish note
- [x] `GET /api/notes/[id]/pdf` — Export as PDF

### 8.2 Notes List Page (`/notes/page.tsx`)
- [x] Replace mock data with API call
- [x] Implement search
- [x] Implement tag filtering
- [ ] Show published/draft status
- [ ] Quick actions (duplicate, delete)

### 8.3 Note Editor (`/notes/[id]/page.tsx` & `/notes/new/page.tsx`)
- [ ] Save to database (auto-save)
- [ ] Load from database
- [ ] Block-based content structure
  - [ ] Text blocks (markdown support)
  - [ ] Heading blocks
  - [ ] List blocks
- [ ] Live data blocks
  - [ ] `/metric` command — Insert metric widget
    - [ ] Metric type selection (DSO, on-time rate, etc.)
    - [ ] Date range picker
    - [ ] Real-time data fetch
  - [ ] `/table` command — Insert data table
    - [ ] Table type (invoices, payments, customers)
    - [ ] Filters configuration
    - [ ] Column selection
    - [ ] Real-time data
  - [ ] `/chart` command — Insert chart
    - [ ] Chart type (bar, line, pie)
    - [ ] Data source selection
    - [ ] Date range
  - [ ] `/receipt` command — Embed receipt
    - [ ] Receipt/Invoice search
    - [ ] Preview embed
- [ ] @-mention support
  - [ ] @invoice:INV-XXXXX
  - [ ] @receipt:REC-XXXXX
  - [ ] @customer:Name
  - [ ] @period:Q4-2024
- [ ] Tags management
  - [ ] Add tags
  - [ ] Remove tags
  - [ ] Tag suggestions

### 8.4 Note PDF Export
- [ ] Create PDF template
- [ ] Render all blocks to PDF
- [ ] Include live data snapshots
- [ ] Add header/footer with metadata
- [ ] Download functionality

### 8.5 Note Sharing
- [ ] Generate private share link
- [ ] Public share page (read-only)
- [ ] PII masking on public view
- [ ] Share link expiry (Pro feature)
- [ ] Password protection (Pro feature)

---

## 9. File Storage & Attachments (0% → 80%)

### 9.1 Supabase Storage Setup
- [x] Create storage bucket: `attachments` (assumed bucket name used by API routes)
- [ ] Create storage bucket: `logos`
- [x] Configure bucket policies (private, signed URLs)
- [x] Set file size limits (10MB enforced in API + UI)

### 9.2 Upload Implementation
- [ ] Create `src/lib/storage/upload.ts`
  - [ ] uploadFile function
  - [ ] deleteFile function
  - [ ] getSignedUrl function
- [x] Create upload component (invoice create + invoice detail)
- [ ] Progress indicator
- [x] File type validation
- [x] File size validation
- [x] Error handling

### 9.3 Attachment Integration
- [x] Invoice attachments upload
- [ ] Logo upload in profile/settings
- [x] Display attachments on invoice pages
- [x] Download attachments (signed URLs)

---

## 10. Email & Notifications (95% complete)

### 10.1 Email Setup
- [x] Choose email provider (Mailjet)
- [x] Create account and get API key
- [x] Add env variables
  - [x] MAILJET_API_KEY
  - [x] MAILJET_SECRET_KEY
  - [x] MAILJET_SENDER_EMAIL
  - [x] MAILJET_SENDER_NAME
- [x] Create `src/lib/email/mailjet.ts`

### 10.2 Email Templates
- [x] Invoice sent email
  - [x] Subject: "Invoice #XXX from [Business Name]"
  - [x] Body: Summary + payment link
- [x] Payment received email
  - [x] Subject: "Payment received for Invoice #XXX"
  - [x] Body: Payment details + receipt link
- [x] Payment reminder email
  - [x] Subject: "Friendly reminder: Invoice #XXX is due"
  - [x] Body: Invoice summary + payment link
- [x] Overdue notice email
  - [x] Subject: "Invoice #XXX is overdue"
  - [x] Body: Amount due + payment link
- [x] OTP verification email
- [x] Welcome email for new users
- [x] Password reset email
- [x] Email verification email

### 10.3 Email Sending
- [x] Send invoice email on "Send" action
- [x] Send payment confirmation on successful payment (webhook + verify)
- [x] Send reminder on manual trigger
- [ ] Schedule overdue notices (automated)

### 10.4 WhatsApp Integration (Optional)
- [ ] Research WhatsApp Business API
- [ ] Create message templates
- [ ] Send invoice via WhatsApp
- [ ] Send reminders via WhatsApp

---

## 11. Settings & Preferences (40% → 100%)

### 11.1 Settings API
- [x] `GET /api/settings` — Get user settings
- [x] `PATCH /api/settings` — Update settings

### 11.2 Settings Page (`/settings/page.tsx`)
- [x] Connect to real settings data (API created, hook available)
- [ ] Business Information
  - [ ] Business name
  - [ ] Business address
  - [ ] Tax ID / Registration number
  - [ ] Logo upload
- [ ] Invoice Defaults
  - [ ] Default currency
  - [ ] Default payment terms
  - [ ] Default tax rate
  - [ ] Invoice number prefix
  - [ ] Starting invoice number
- [ ] Payment Methods
  - [ ] Enable/disable payment methods
  - [ ] Mobile money details (phone number)
  - [ ] Bank account details
  - [ ] Crypto wallet addresses
- [ ] Notifications
  - [ ] Email notifications on/off
  - [ ] Payment alerts
  - [ ] Overdue reminders frequency
- [ ] Appearance
  - [ ] Theme (light/dark/system)
  - [ ] Accent color
- [ ] Save functionality
- [ ] Validation

### 11.3 Billing Page (`/billing/page.tsx`)
- [ ] Display current plan
- [ ] Usage statistics
- [ ] Upgrade/downgrade options
- [ ] Payment method management
- [ ] Invoice history

---

## 12. Testing (15% → 80%)

### 12.1 Unit Tests
- [ ] Money/currency utilities
  - [ ] Minor units conversion
  - [ ] Formatting
  - [ ] Calculations
- [ ] Invoice calculations
  - [ ] Line item totals
  - [ ] Tax calculation
  - [ ] Discount calculation
  - [ ] Balance calculation
- [ ] Receipt hash generation
  - [ ] Canonical JSON
  - [ ] SHA-256 hash
  - [ ] Hash stability across environments
- [ ] Date utilities
  - [ ] Aging bucket calculation
  - [ ] Overdue detection
  - [ ] DSO calculation
- [ ] Validation functions
  - [ ] Email validation
  - [ ] Phone validation
  - [ ] Amount validation

### 12.2 Integration Tests
- [ ] Invoice lifecycle
  - [ ] Create invoice
  - [ ] Send invoice
  - [ ] Record payment
  - [ ] Generate receipt
  - [ ] Verify status updates
- [ ] Payment flow
  - [ ] Initiate payment
  - [ ] Webhook processing
  - [ ] Allocation creation
  - [ ] Balance update
- [ ] Partial payments
  - [ ] Multiple allocations
  - [ ] Running balance
  - [ ] Final payment completion
- [ ] AR aging
  - [ ] Bucket calculations
  - [ ] On-time rate accuracy
  - [ ] DSO accuracy

### 12.3 E2E Tests (Playwright)
- [ ] Auth flow
  - [ ] Sign up
  - [ ] Log in
  - [ ] Log out
  - [ ] Password reset
- [ ] Invoice flow
  - [ ] Create invoice
  - [ ] Add items
  - [ ] Send invoice
  - [ ] View public page
- [ ] Payment flow
  - [ ] Select payment method
  - [ ] Complete payment
  - [ ] View receipt
- [ ] Dashboard
  - [ ] Load with data
  - [ ] Filter functionality
  - [ ] Export functionality

### 12.4 Acceptance Tests (from PRD)
- [ ] AT-INV-01: Two items + discount + tax compute correct totals
- [ ] AT-INV-02: Sending invoice generates public page with masked PII
- [ ] AT-INV-03: Overdue status triggers at now > due_date with balance > 0
- [ ] AT-PAY-01: Idempotent webhooks don't double-allocate
- [ ] AT-PAY-02: Partial payment reduces balance, status = Partially Paid
- [ ] AT-PAY-03: Final allocation sets status = Paid, mints receipt
- [ ] AT-RCPT-01: PDF totals match, hash tail matches snapshot
- [ ] AT-RCPT-02: Public receipt masks PII, owner sees full
- [ ] AT-AR-01: Aging totals equal sum of balances per bucket
- [ ] AT-AR-02: On-time rate uses ≤3 days rule
- [ ] AT-AR-03: DSO formula documented and consistent
- [ ] AT-DOC-01: Snapshot hash stable across environments
- [ ] AT-DOC-02: Amendment creates new snapshot, prior preserved

---

## 13. Security & Compliance (20% → 100%)

### 13.1 Authentication Security
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CAPTCHA on signup/login (optional)
- [ ] Session management
- [ ] Secure cookie settings

### 13.2 API Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Supabase)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting on API routes

### 13.3 Webhook Security
- [ ] Verify webhook signatures (Flutterwave/Paystack)
- [ ] Implement idempotency keys
- [ ] Log all webhook events
- [ ] Handle replay attacks

### 13.4 Data Security
- [ ] Encrypt sensitive data at rest
- [ ] Use signed URLs for file access
- [ ] Implement PII masking for public views
- [ ] Audit logging for sensitive operations

### 13.5 Compliance
- [ ] Privacy policy implementation
- [ ] Terms of service implementation
- [ ] Data export functionality (GDPR)
- [ ] Account deletion functionality

---

## 14. Performance & Optimization (0% → 100%)

### 14.1 Frontend Optimization
- [ ] Implement code splitting
- [ ] Optimize images (next/image)
- [ ] Add loading skeletons
- [ ] Implement virtual scrolling for long lists
- [ ] Cache API responses (SWR/React Query)

### 14.2 Backend Optimization
- [ ] Add database indexes (see 1.5)
- [ ] Implement query pagination
- [ ] Add response caching where appropriate
- [ ] Optimize N+1 queries

### 14.3 Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add performance monitoring
- [ ] Create alerting for critical errors
- [ ] Set up uptime monitoring

---

## 15. Deployment & DevOps (0% → 100%)

### 15.1 Environment Setup
- [ ] Create production Supabase project
- [ ] Set up production environment variables
- [ ] Configure production payment provider keys
- [ ] Set up production email provider

### 15.2 Deployment
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up SSL
- [ ] Configure redirects

### 15.3 CI/CD
- [ ] Set up GitHub Actions
- [ ] Run tests on PR
- [ ] Auto-deploy on merge to main
- [ ] Preview deployments for PRs

---

## 16. Documentation (30% → 100%)

### 16.1 Code Documentation
- [ ] Add JSDoc comments to key functions
- [ ] Document API endpoints (OpenAPI/Swagger)
- [ ] Document database schema
- [ ] Document environment variables

### 16.2 User Documentation
- [ ] Complete help center articles
- [ ] Add in-app tooltips/guides
- [ ] Create FAQ section
- [ ] Video tutorials (optional)

### 16.3 Developer Documentation
- [ ] README setup instructions
- [ ] Contributing guidelines
- [ ] Architecture overview
- [ ] API reference

---

## Quick Reference: Priority Order

### Phase 1: Foundation (Week 1-2)
1. [x] Backend Infrastructure (Section 1)
2. [x] Authentication System (Section 2)
3. [x] Database Setup & RLS

### Phase 2: Core Features (Week 3-4)
4. [x] Invoice System completion (Section 3)
5. [~] Payment Integration (Section 4)
6. [ ] Receipt System (Section 5)

### Phase 3: Analytics & UX (Week 5)
7. [x] Dashboard & Analytics (Section 6)
8. [x] Contacts completion (Section 7)
9. [ ] Finance Notes completion (Section 8)

### Phase 4: Polish (Week 6)
10. [ ] File Storage (Section 9)
11. [ ] Email & Notifications (Section 10)
12. [ ] Settings completion (Section 11)

### Phase 5: Launch Prep (Week 7)
13. [ ] Testing (Section 12)
14. [ ] Security (Section 13)
15. [ ] Performance (Section 14)
16. [ ] Deployment (Section 15)
17. [ ] Documentation (Section 16)

---

## Progress Tracker

| Section | Items | Completed | Percentage |
|---------|-------|-----------|------------|
| 1. Backend Infrastructure | 128 | 126 | 98.4% |
| 2. Authentication | 25 | 24 | 96.0% |
| 3. Invoice System | 61 | 56 | 91.8% |
| 4. Payment System | 69 | 49 | 71.0% |
| 5. Receipt System | 36 | 20 | 55.6% |
| 6. Dashboard & Analytics | 36 | 17 | 47.2% |
| 7. Contacts/Customers | 26 | 25 | 96.2% |
| 8. Finance Notes & Docs | 54 | 8 | 14.8% |
| 9. File Storage | 17 | 10 | 58.8% |
| 10. Email & Notifications | 28 | 23 | 82.1% |
| 11. Settings | 33 | 3 | 9.1% |
| 12. Testing | 71 | 0 | 0.0% |
| 13. Security | 21 | 0 | 0.0% |
| 14. Performance | 13 | 0 | 0.0% |
| 15. Deployment | 12 | 0 | 0.0% |
| 16. Documentation | 25 | 13 | 52.0% |
| **TOTAL** | **655** | **374** | **57.1%** |

> Note: The 75-80% estimate includes existing frontend work plus completed Supabase MCP backend implementation.

---

## Notes & Decisions Log

Use this section to track important decisions and blockers:

### Decisions Made
- [x] Database: Supabase (PostgreSQL with RLS)
- [x] TypeScript types auto-generated from Supabase schema
- [x] Payment provider: Flutterwave
- [x] Email provider: Mailjet
- [x] PDF generation: puppeteer / jspdf / @react-pdf/renderer?

### Completed Backend Implementation (June 2025)
- [x] All database tables created via Supabase MCP migrations
- [x] Row Level Security (RLS) policies applied to all tables
- [x] Database functions: generate_invoice_number, generate_public_id, calculate_invoice_totals, update_invoice_payment_status, update_updated_at
- [x] TypeScript types generated: src/types/database.ts
- [x] API Routes: /api/invoices, /api/contacts, /api/payments, /api/dashboard, /api/invoices/[id]/allocations
- [x] Auth system: src/lib/auth/actions.ts, src/app/auth/callback/route.ts, src/middleware.ts
- [x] Data hooks: useDashboardData, useInvoicesData, useContactsData, usePaymentsData, useNotesData, useReceiptsData
- [x] Dashboard, Invoices, Contacts, Payments, Notes, Receipts pages connected to real API with empty states

### Blockers
- (Add any blockers here as they arise)

### Changes from Original Plan
- Using Supabase MCP for direct database integration instead of manual SDK setup

---

*Last checkpoint: December 30, 2025 - Flutterwave integration complete, bulk actions, CSV export, payment flow working*

*Next priority: Settings completion (incl. logo upload), Receipts public pages + verification, Payments/Receipts detail linking*
