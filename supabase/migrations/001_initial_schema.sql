-- Plaen Database Schema Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Version: 1.0.0
-- Date: December 30, 2025

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'partially_paid',
  'overdue',
  'cancelled',
  'refunded'
);

CREATE TYPE customer_type AS ENUM (
  'individual',
  'business'
);

CREATE TYPE payment_rail AS ENUM (
  'momo',
  'bank',
  'card',
  'crypto',
  'cash'
);

CREATE TYPE payment_provider AS ENUM (
  'flutterwave',
  'paystack',
  'manual'
);

CREATE TYPE data_query_type AS ENUM (
  'metric',
  'table',
  'chart'
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_num INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get user's prefix and next number
  SELECT invoice_prefix, next_invoice_number
  INTO prefix, next_num
  FROM users
  WHERE id = user_uuid;
  
  -- Generate invoice number (e.g., PL-000001)
  invoice_num := prefix || '-' || LPAD(next_num::TEXT, 6, '0');
  
  -- Increment the next invoice number
  UPDATE users
  SET next_invoice_number = next_invoice_number + 1
  WHERE id = user_uuid;
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate public ID (short unique identifier)
CREATE OR REPLACE FUNCTION generate_public_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  country TEXT DEFAULT 'GH',
  timezone TEXT DEFAULT 'Africa/Accra',
  currency TEXT DEFAULT 'GHS',
  business_name TEXT,
  business_address TEXT,
  tax_id TEXT,
  logo_url TEXT,
  invoice_prefix TEXT DEFAULT 'PL',
  next_invoice_number INTEGER DEFAULT 1,
  default_payment_terms TEXT DEFAULT 'Due on receipt',
  default_tax_rate_bps INTEGER DEFAULT 0, -- basis points (1250 = 12.5%)
  enabled_payment_methods payment_rail[] DEFAULT ARRAY['momo', 'bank']::payment_rail[],
  momo_phone TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  crypto_wallet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (Contacts) table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  type customer_type DEFAULT 'individual',
  country TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  currency TEXT DEFAULT 'GHS',
  subtotal_minor BIGINT DEFAULT 0, -- Amount in minor units (pesewas/cents)
  discount_minor BIGINT DEFAULT 0,
  tax_minor BIGINT DEFAULT 0,
  total_minor BIGINT DEFAULT 0,
  balance_minor BIGINT DEFAULT 0, -- Remaining balance after payments
  purpose_category TEXT,
  purpose_note TEXT,
  status invoice_status DEFAULT 'draft',
  notes TEXT,
  payment_terms TEXT,
  public_id TEXT UNIQUE, -- Short ID for public links
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_invoice_number_per_user UNIQUE (user_id, invoice_number)
);

-- Invoice Line Items table
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2) DEFAULT 1,
  unit_price_minor BIGINT NOT NULL,
  tax_rate_bps INTEGER DEFAULT 0, -- Tax rate in basis points
  discount_minor BIGINT DEFAULT 0,
  line_total_minor BIGINT DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider payment_provider NOT NULL,
  rail payment_rail NOT NULL,
  reference TEXT, -- Internal/manual reference
  provider_reference TEXT, -- External provider transaction ID
  amount_minor BIGINT NOT NULL,
  currency TEXT DEFAULT 'GHS',
  fee_minor BIGINT DEFAULT 0,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  payer_name TEXT,
  payer_phone TEXT,
  payer_email TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Allocations table (links payments to invoices)
CREATE TABLE payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount_minor BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_allocation CHECK (amount_minor > 0)
);

-- Receipt Snapshots table
CREATE TABLE receipt_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  canonical_json JSONB NOT NULL,
  sha256_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_receipt_version UNIQUE (invoice_id, version)
);

-- Attachments table
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  checksum_sha256 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes (Finance Docs) table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Note',
  content JSONB DEFAULT '[]'::JSONB, -- Block-based content
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  public_id TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Queries table (for live blocks in notes)
CREATE TABLE data_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  query_type data_query_type NOT NULL,
  query_config JSONB NOT NULL,
  cached_result JSONB,
  cached_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update invoice balance after payment allocation
CREATE OR REPLACE FUNCTION update_invoice_balance()
RETURNS TRIGGER AS $$
DECLARE
  total_allocated BIGINT;
  invoice_total BIGINT;
BEGIN
  -- Calculate total allocated to this invoice
  SELECT COALESCE(SUM(amount_minor), 0)
  INTO total_allocated
  FROM payment_allocations
  WHERE invoice_id = NEW.invoice_id;
  
  -- Get invoice total
  SELECT total_minor
  INTO invoice_total
  FROM invoices
  WHERE id = NEW.invoice_id;
  
  -- Update invoice balance and status
  UPDATE invoices
  SET 
    balance_minor = total_minor - total_allocated,
    status = CASE
      WHEN total_allocated >= total_minor THEN 'paid'::invoice_status
      WHEN total_allocated > 0 THEN 'partially_paid'::invoice_status
      ELSE status
    END,
    paid_at = CASE
      WHEN total_allocated >= total_minor AND paid_at IS NULL THEN NOW()
      ELSE paid_at
    END
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_balance_trigger
  AFTER INSERT ON payment_allocations
  FOR EACH ROW EXECUTE FUNCTION update_invoice_balance();

-- Function to calculate line item total
CREATE OR REPLACE FUNCTION calculate_line_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate line total: (quantity * unit_price) + tax - discount
  NEW.line_total_minor := (
    (NEW.quantity * NEW.unit_price_minor)::BIGINT + 
    ((NEW.quantity * NEW.unit_price_minor * NEW.tax_rate_bps / 10000)::BIGINT) -
    NEW.discount_minor
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_line_total_trigger
  BEFORE INSERT OR UPDATE ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION calculate_line_total();

-- Function to update invoice totals when line items change
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  new_subtotal BIGINT;
  new_tax BIGINT;
  new_discount BIGINT;
BEGIN
  -- Calculate totals from line items
  SELECT 
    COALESCE(SUM(quantity * unit_price_minor), 0),
    COALESCE(SUM(quantity * unit_price_minor * tax_rate_bps / 10000), 0),
    COALESCE(SUM(discount_minor), 0)
  INTO new_subtotal, new_tax, new_discount
  FROM invoice_line_items
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Update invoice totals
  UPDATE invoices
  SET 
    subtotal_minor = new_subtotal,
    tax_minor = new_tax,
    discount_minor = new_discount,
    total_minor = new_subtotal + new_tax - new_discount,
    balance_minor = (new_subtotal + new_tax - new_discount) - (
      SELECT COALESCE(SUM(amount_minor), 0)
      FROM payment_allocations
      WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    )
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON invoice_line_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);

-- Customers indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_display_name ON customers(user_id, display_name);

-- Invoices indexes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX idx_invoices_user_due_date ON invoices(user_id, due_date);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_public_id ON invoices(public_id);
CREATE INDEX idx_invoices_issue_date ON invoices(user_id, issue_date DESC);

-- Invoice line items indexes
CREATE INDEX idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);

-- Payments indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_paid_at ON payments(user_id, paid_at DESC);
CREATE INDEX idx_payments_provider_reference ON payments(provider_reference);

-- Payment allocations indexes
CREATE INDEX idx_payment_allocations_invoice_id ON payment_allocations(invoice_id);
CREATE INDEX idx_payment_allocations_payment_id ON payment_allocations(payment_id);

-- Receipt snapshots indexes
CREATE INDEX idx_receipt_snapshots_invoice_id ON receipt_snapshots(invoice_id);

-- Attachments indexes
CREATE INDEX idx_attachments_invoice_id ON attachments(invoice_id);

-- Notes indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_public_id ON notes(public_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_queries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Public invoice access (for payment pages)
CREATE POLICY "Public can view sent invoices by public_id"
  ON invoices FOR SELECT
  USING (public_id IS NOT NULL AND status IN ('sent', 'partially_paid', 'paid', 'overdue'));

-- Invoice line items policies
CREATE POLICY "Users can view own invoice line items"
  ON invoice_line_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_line_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own invoice line items"
  ON invoice_line_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_line_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own invoice line items"
  ON invoice_line_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_line_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own invoice line items"
  ON invoice_line_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_line_items.invoice_id AND invoices.user_id = auth.uid()
  ));

-- Public can view line items for public invoices
CREATE POLICY "Public can view line items for public invoices"
  ON invoice_line_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices 
    WHERE invoices.id = invoice_line_items.invoice_id 
    AND invoices.public_id IS NOT NULL
    AND invoices.status IN ('sent', 'partially_paid', 'paid', 'overdue')
  ));

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Payment allocations policies
CREATE POLICY "Users can view own payment allocations"
  ON payment_allocations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM payments WHERE payments.id = payment_allocations.payment_id AND payments.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own payment allocations"
  ON payment_allocations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM payments WHERE payments.id = payment_allocations.payment_id AND payments.user_id = auth.uid()
  ));

-- Receipt snapshots policies
CREATE POLICY "Users can view own receipt snapshots"
  ON receipt_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = receipt_snapshots.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own receipt snapshots"
  ON receipt_snapshots FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = receipt_snapshots.invoice_id AND invoices.user_id = auth.uid()
  ));

-- Public can view receipts for public invoices
CREATE POLICY "Public can view receipts for public invoices"
  ON receipt_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices 
    WHERE invoices.id = receipt_snapshots.invoice_id 
    AND invoices.public_id IS NOT NULL
    AND invoices.status = 'paid'
  ));

-- Attachments policies
CREATE POLICY "Users can view own attachments"
  ON attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = attachments.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own attachments"
  ON attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = attachments.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own attachments"
  ON attachments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = attachments.invoice_id AND invoices.user_id = auth.uid()
  ));

-- Notes policies
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view published notes
CREATE POLICY "Public can view published notes"
  ON notes FOR SELECT
  USING (is_published = TRUE AND public_id IS NOT NULL);

-- Data queries policies
CREATE POLICY "Users can view own data queries"
  ON data_queries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM notes WHERE notes.id = data_queries.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own data queries"
  ON data_queries FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM notes WHERE notes.id = data_queries.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own data queries"
  ON data_queries FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM notes WHERE notes.id = data_queries.note_id AND notes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own data queries"
  ON data_queries FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM notes WHERE notes.id = data_queries.note_id AND notes.user_id = auth.uid()
  ));

-- ============================================
-- FUNCTION: Create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when they sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- FUNCTION: Mark overdue invoices
-- This should be run periodically (e.g., via cron)
-- ============================================

CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE invoices
  SET status = 'overdue'::invoice_status
  WHERE status = 'sent'
    AND due_date < CURRENT_DATE
    AND balance_minor > 0;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================

-- Create storage buckets via Supabase dashboard or API:
-- 1. Bucket: 'attachments' (private)
-- 2. Bucket: 'logos' (public)

-- Storage policies should be added via dashboard

-- ============================================
-- SCHEDULED JOBS (optional, requires pg_cron)
-- ============================================

-- If pg_cron is enabled:
-- SELECT cron.schedule('mark-overdue-invoices', '0 0 * * *', 'SELECT mark_overdue_invoices()');

COMMIT;
