-- Create admin users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can view all admin users
CREATE POLICY "Admins can view all admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (
    auth_user_id IN (
      SELECT auth_user_id FROM public.admin_users
    )
  );

-- Create indexes
CREATE INDEX idx_admin_users_auth_user_id ON public.admin_users(auth_user_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();