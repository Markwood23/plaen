# Plaen — Invoice‑First Product Narrative & PRD (v1.2)

> This version reframes Plaen around **Invoices** (Accounts Receivable) instead of generic "transfers". Terminology, data model, APIs, UX and metrics are aligned to invoicing, collections, and receipts.

---

## A) Product Narrative (invoice‑first)

### One‑liner

**Money + Meaning**: Create, send, and get paid on **invoices** with official, verifiable receipts and narrative reporting.

### Problem

Across Africa, people and small businesses do real work but lack **proper invoices and proof**. Payments happen (MoMo, bank, card, cash) but documentation is incomplete—hurting trust, collections, visas/loans, and taxes.

### Solution

Plaen is an invoice system with **official receipts**. Create an invoice in seconds; send a **payment link** or record an external payment with the rail + reference. Plaen mints a **hosted receipt** and **PDF** with a tamper‑evident snapshot. Over time, Plaen becomes your **finance memory**—AR aging, DSO, on‑time rate, and narrative **Finance Notes & Docs**.

### Product pillars

1. **Invoice → Receipt, every time**
2. **Official by design** (calm, precise, trustworthy)
3. **Frictionless collections** (link share, no login for payer)
4. **Africa‑first rails** (MoMo/Bank/Card/Cash + Document‑only)
5. **Insights & narrative** (AR dashboards + Finance Notes)

### Who it’s for

* Freelancers/creators, Micro/SMBs, Individuals who need **invoice + proof** (rent, school, reimbursements).

---

## B) PRD — MVP and Notes/Docs (invoice‑first)

### 1) Goals & Non‑Goals

**Goals (MVP):**

* Create & send an **Invoice** in ≤30s.
* Collect via paylink (where supported) or **Record Payment** (external rails).
* Generate a **hosted receipt page** + **PDF** (tamper‑evident snapshot) on payment.
* Show **AR dashboard**: Paid/Unpaid/Overdue, **On‑time rate (≤3 days)**, **DSO**, aging buckets (0‑30/31‑60/61‑90/90+).
* Ship **Finance Notes & Docs** with live blocks (metrics, tables, charts, invoice/receipt embeds) + PDF export.

**Non‑goals (MVP):** payroll, double‑entry GL, inventory, complex tax engines, vendor bills/AP.

### 2) Decisions (locked)

* **On‑time rate:** invoice is on‑time if **paid within ≤3 days of the invoice date** (configurable later).
* **Public sharing defaults:** **Private link by default**; public views **mask PII**. Owners see full.

### 3) Personas & Use Cases

* **Freelancer**: Issue invoice with items & due date → auto‑reconcile via webhook → receipt minted.
* **SMB**: Bulk send invoices, track aging, send reminders, export statements.
* **Individual**: Simple invoices for rent/school; record MoMo/bank cash payments; share receipts.

Use cases:

1. **Invoice → Paylink** (PSP) → webhook → **Paid** → Receipt v2 minted.
2. **Invoice → Record Payment** (MoMo/Bank/Card/Cash) → reference captured → **Paid**.
3. **Partially Paid** invoice → multiple allocations → final receipt marks paid‑in‑full.
4. **Overdue** list → one‑click polite reminder (WhatsApp/Email).
5. **Monthly Review Note** with AR metrics and embedded top overdue invoices.

### 4) Scope (MVP → v1.1)

**MVP**

* **Invoice**: number, issue date, due date, customer/contact, items, taxes/discounts, notes, attachments.
* **Send** (link/email/WhatsApp preview), **Track views** (optional later).
* **Payments**: Paylink (PSP #1) or **Record external payment** (rail + reference + date + amount).
* **Receipts**: hosted + PDF with snapshot (SHA‑256) when payment occurs (full or partial).
* **AR Dashboard**: counts, totals, aging buckets, on‑time rate, DSO.
* **Finance Notes & Docs**: metric/table/chart/receipt‑embed + export PDF.

**v1.1 (Pro)**

* Recurring invoices & schedules, budgets + alerts, multi‑currency rollup.
* Evidence Pack ZIP, custom branding, public share expiry/password.
* Quotes/Estimates → Convert to Invoice. Credit Notes/Refunds.

### 5) Functional Requirements

#### 5.1 Invoice Lifecycle

* Create → Draft → Sent → **Paid / Partially Paid / Overdue / Canceled / Refunded**.
* Editing rules: After any payment, financial fields lock; changes create **Amendment** with new snapshot.
* Itemization: label, qty, unit price, discount, tax (bps), line total.
* Totals: subtotal, discounts, tax, **balance due**.

**Acceptance tests**

* AT‑INV‑01: Two items + discount + tax compute correct totals and **balance due**.
* AT‑INV‑02: Sending an invoice generates a **public invoice page** with masked PII.
* AT‑INV‑03: Overdue status triggers at `now > due_date` and balance > 0.

#### 5.2 Payments & Allocation

* **Paylink** (PSP): create checkout; on success webhook, create Payment, allocate to invoice.
* **Record Payment** (external rails): capture rail, reference, date, amount; allocate to invoice; allow **partial**.
* **Multiple payments** per invoice; each allocation reduces balance due; final allocation sets status **Paid**.
* Fees (PSP) stored separately; optional display on receipt.

**Acceptance tests**

* AT‑PAY‑01: Idempotent webhooks do not double‑allocate to an invoice.
* AT‑PAY‑02: Partial payment reduces balance and status = **Partially Paid**.
* AT‑PAY‑03: Final allocation flips status to **Paid** and mints **Receipt vN**.

#### 5.3 Receipts (Official Proof)

* Receipt shows: parties, invoice number, items, totals, payment details (rail + reference tail), status, attachments, snapshot hash tail.
* Each payment allocation appends a receipt entry; final receipt indicates **Paid in Full**.
* PDF mirrors the page; unpaid/canceled watermarks.

**Acceptance tests**

* AT‑RCPT‑01: PDF totals match invoice + allocations; hash tail matches stored snapshot.
* AT‑RCPT‑02: Public receipt masks PII; owner sees full.

#### 5.4 AR Dashboard & Aging

* KPIs: Paid/Unpaid, Overdue (count & amount), **On‑time rate**, **DSO**, sums by category and rail.
* Aging buckets: 0‑30 / 31‑60 / 61‑90 / 90+ with counts & amounts.
* Lists: Due soon (7d), Overdue with **Remind** action.

**Acceptance tests**

* AT‑AR‑01: Aging totals equal sum of invoice balances in each bucket.
* AT‑AR‑02: On‑time rate uses ≤3 days rule and matches fixtures.
* AT‑AR‑03: DSO formula documented and consistent (sum(days outstanding * amount) / total credit sales).

#### 5.5 Documentation Layer (Snapshots)

* Canonical JSON with ordered keys, minor units; snapshot and sha256 stored for invoice and each receipt version.
* Redaction for attachments (store redaction instructions; originals encrypted).

**Acceptance tests**

* AT‑DOC‑01: Snapshot hash stable across environments.
* AT‑DOC‑02: Amendment creates new snapshot vN+1; prior versions preserved.

#### 5.6 Finance Notes & Docs

* Live blocks can query **invoices, payments, receipts**; chart AR over time; embed specific receipts.
* @‑mention entities: invoice, receipt, customer, period.
* Share (private link) + PDF export; Pro: freeze data snapshot at publish.

**Acceptance tests**

* AT‑ND‑01 .. AT‑ND‑05 as before, but data source = invoices/receipts.

### 6) Data Model (core, invoice‑first)

* **User**: id, name, email/phone, country, settings (currency, timezone, branding)
* **Customer (Contact)**: id, display_name, email/phone, type, country, notes
* **Invoice**: id, user_id, customer_id, invoice_number, issue_date, due_date, currency, subtotal_minor, discount_minor, tax_minor, total_minor, **balance_minor**, purpose_category, purpose_note, status, created_at, updated_at
* **InvoiceLineItem**: id, invoice_id, label, qty, unit_price_minor, tax_rate_bps, discount_minor, line_total_minor
* **Payment**: id, provider, rail, reference, amount_minor, currency, paid_at, fee_minor, metadata
* **PaymentAllocation**: id, payment_id, invoice_id, amount_minor, created_at
* **ReceiptSnapshot**: id, invoice_id, version, canonical_json, sha256_hash, created_at
* **Attachment**: id, invoice_id, file_url, mime, checksum_sha256, ocr_text
* **Note (Docs)**, **DataQuery (Docs)**: unchanged but source tables pivot to invoices/payments/receipts
* *(v1.1)* **Quote/Estimate**, **CreditNote/Refund**

### 7) API (selected)

**Invoices**

* `POST /v1/invoices` → create (draft)
* `POST /v1/invoices/{id}/send` → mark sent + public link
* `GET /v1/invoices?status=&from=&to=&q=&customer_id=` → list
* `GET /v1/invoices/{id}` → detail
* `PATCH /v1/invoices/{id}` → limited fields (pre‑payment) or amendment (post‑payment)

**Payments**

* `POST /v1/invoices/{id}/allocations` → record external payment { rail, reference, amount, paid_at }
* `POST /v1/paylinks` → create checkout session (invoice_id)
* `POST /v1/webhooks/{provider}` → reconcile (idempotent)

**Receipts & Exports**

* `GET /v1/receipts/{invoice_id}` (public) | `.pdf`
* `GET /v1/exports/statement?period=YYYY-MM` (CSV/PDF)
* `POST /v1/exports/evidence-pack` { invoice_id } → ZIP

**Docs**

* `POST /v1/notes` | `GET /v1/notes` | `POST /v1/notes/{id}.pdf`
* `POST /v1/data/preview` → secure query for data blocks

### 8) UX Flows (high level)

1. **New Invoice** → Items/Attachments → Send or Record Payment → Receipt minted.
2. **Public Receipt** → masked PII → verify hash tail → download PDF.
3. **AR Dashboard** → due soon, overdue, aging buckets, one‑click reminders.
4. **Finance Note** → /metric, /table from invoices → export PDF.

### 9) Security & Compliance

* Auth: JWT + optional MFA; RLS per user/workspace; public views mask PII.
* Storage: encrypted; signed URLs; webhook HMAC + idempotency; tamper‑evident snapshots.

### 10) Metrics & Instrumentation

* North‑star: **Invoice → Receipt conversion rate** (invoices that become paid receipts).
* Secondary: **Time‑to‑first invoice**, **DSO**, on‑time rate, reminder CTR, statement exports, notes created.
* Observability: structured logs, webhook failures, PDF latency, allocation anomalies.

### 11) Rollout Plan

* **Alpha**: Invoice + Record Payment + Receipt + Notes basic.
* **Beta (Ghana)**: PSP paylink, reminders, AR aging.
* **GA**: Recurring, multi‑currency rollup, Evidence Pack, custom branding, quotes/credits.

### 12) Open Questions

* Jurisdictional nuances for receipts as legal proof (country by country).
* Default taxes/withholding per country.
* SMS vs WhatsApp for reminders by market.

---

## C) QA Test Suite (excerpt)

**Unit**

* Money math (minor units) stable across currencies; snapshot hash stable.

**Integration**

* Invoice → Paylink → webhook → Payment + Allocation → Receipt v2 minted → PDF totals match.
* Invoice → Record external payment (MoMo ref) → Allocation created → Receipt shows rail+tail.
* Partial payments across two allocations resolve to Paid and correct balance.

**Docs (Notes)**

* AR metrics in notes match dashboard.
* Embedded receipt opens public page with masked PII.
* On‑time rate in notes uses ≤3 days rule and matches fixtures.

---

### End of Document
