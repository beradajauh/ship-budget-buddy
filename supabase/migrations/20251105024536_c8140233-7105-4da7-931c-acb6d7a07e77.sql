-- Create vendors authentication table
CREATE TABLE public.vendor_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  email text UNIQUE NOT NULL,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_users ENABLE ROW LEVEL SECURITY;

-- Vendors can only see their own data
CREATE POLICY "Vendors can view own data"
  ON public.vendor_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Create debit notes table
CREATE TABLE public.debit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  company_id uuid NOT NULL,
  vessel_id uuid NOT NULL,
  debit_note_no text NOT NULL UNIQUE,
  debit_note_date date NOT NULL,
  vendor_invoice_no text NOT NULL,
  total_amount numeric(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Paid', 'Rejected')),
  linked_ap_doc text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.debit_notes ENABLE ROW LEVEL SECURITY;

-- Vendors can only view their own debit notes
CREATE POLICY "Vendors can view own debit notes"
  ON public.debit_notes
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT vendor_id 
      FROM public.vendor_users 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Create budget realization table
CREATE TABLE public.budget_realizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  company_id uuid NOT NULL,
  vessel_id uuid NOT NULL,
  period text NOT NULL,
  budget_amount numeric(15,2) NOT NULL,
  actual_amount numeric(15,2) NOT NULL DEFAULT 0,
  variance numeric(15,2) GENERATED ALWAYS AS (budget_amount - actual_amount) STORED,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budget_realizations ENABLE ROW LEVEL SECURITY;

-- Vendors can only view their own budget realizations
CREATE POLICY "Vendors can view own budget realizations"
  ON public.budget_realizations
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT vendor_id 
      FROM public.vendor_users 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_vendor_users_vendor_id ON public.vendor_users(vendor_id);
CREATE INDEX idx_vendor_users_auth_user_id ON public.vendor_users(auth_user_id);
CREATE INDEX idx_debit_notes_vendor_id ON public.debit_notes(vendor_id);
CREATE INDEX idx_budget_realizations_vendor_id ON public.budget_realizations(vendor_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendor_users_updated_at
  BEFORE UPDATE ON public.vendor_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debit_notes_updated_at
  BEFORE UPDATE ON public.debit_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_realizations_updated_at
  BEFORE UPDATE ON public.budget_realizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();