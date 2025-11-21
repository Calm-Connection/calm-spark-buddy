-- Create consent_logs table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  consent_type text NOT NULL,
  action text NOT NULL,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own consent logs"
  ON public.consent_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent logs"
  ON public.consent_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_consent_logs_user_id ON public.consent_logs(user_id);
CREATE INDEX idx_consent_logs_created_at ON public.consent_logs(created_at DESC);

-- Data retention function (30 days after account deletion)
CREATE OR REPLACE FUNCTION public.delete_user_data_after_retention()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete children profiles older than 30 days where user no longer exists in auth
  DELETE FROM children_profiles
  WHERE user_id NOT IN (SELECT id FROM auth.users)
  AND updated_at < now() - interval '30 days';
  
  -- Delete carer profiles
  DELETE FROM carer_profiles
  WHERE user_id NOT IN (SELECT id FROM auth.users)
  AND updated_at < now() - interval '30 days';
  
  -- Other data will cascade delete due to foreign key constraints
END;
$$;