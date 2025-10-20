-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('child', 'carer');

-- Create enum for mood tags
CREATE TYPE public.mood_tag AS ENUM ('happy', 'sad', 'angry', 'worried', 'calm', 'excited', 'scared');

-- Children profiles table
CREATE TABLE public.children_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nickname TEXT NOT NULL CHECK (length(nickname) >= 3 AND length(nickname) <= 20),
  avatar_json JSONB,
  theme TEXT,
  linked_carer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Carer profiles table
CREATE TABLE public.carer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nickname TEXT,
  avatar_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journal entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE NOT NULL,
  entry_text TEXT NOT NULL CHECK (length(entry_text) >= 1 AND length(entry_text) <= 2000),
  mood_tag mood_tag,
  share_with_carer BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  flag_reasons JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invite codes table
CREATE TABLE public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (length(code) = 6),
  carer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safeguarding logs table
CREATE TABLE public.safeguarding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  child_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE NOT NULL,
  detected_keywords JSONB,
  severity_score NUMERIC CHECK (severity_score >= 0 AND severity_score <= 100),
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wendy insights table
CREATE TABLE public.wendy_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL UNIQUE,
  child_id UUID REFERENCES public.children_profiles(id) ON DELETE CASCADE NOT NULL,
  summary TEXT,
  themes JSONB,
  mood_score NUMERIC CHECK (mood_score >= 0 AND mood_score <= 100),
  recommended_tools JSONB,
  escalate BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.children_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wendy_insights ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for children_profiles
CREATE POLICY "Children can view own profile"
ON public.children_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Children can update own profile"
ON public.children_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Children can insert own profile"
ON public.children_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Carers can view linked children profiles"
ON public.children_profiles FOR SELECT
TO authenticated
USING (linked_carer_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- RLS Policies for carer_profiles
CREATE POLICY "Carers can view own profile"
ON public.carer_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Carers can update own profile"
ON public.carer_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Carers can insert own profile"
ON public.carer_profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- RLS Policies for journal_entries
CREATE POLICY "Children can view own journal entries"
ON public.journal_entries FOR SELECT
TO authenticated
USING (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Children can create own journal entries"
ON public.journal_entries FOR INSERT
TO authenticated
WITH CHECK (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Children can update own journal entries"
ON public.journal_entries FOR UPDATE
TO authenticated
USING (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Carers can view shared journal entries from linked children"
ON public.journal_entries FOR SELECT
TO authenticated
USING (
  share_with_carer = true
  AND child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  )
);

-- RLS Policies for invite_codes
CREATE POLICY "Carers can view own invite codes"
ON public.invite_codes FOR SELECT
TO authenticated
USING (carer_user_id = auth.uid());

CREATE POLICY "Carers can create invite codes"
ON public.invite_codes FOR INSERT
TO authenticated
WITH CHECK (carer_user_id = auth.uid());

CREATE POLICY "Children can view invite codes when linking"
ON public.invite_codes FOR SELECT
TO authenticated
USING (NOT used AND expires_at > now());

CREATE POLICY "Children can update invite codes when linking"
ON public.invite_codes FOR UPDATE
TO authenticated
USING (NOT used AND expires_at > now());

-- RLS Policies for safeguarding_logs (admin only in future, children can see their own for now)
CREATE POLICY "Children can view own safeguarding logs"
ON public.safeguarding_logs FOR SELECT
TO authenticated
USING (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for wendy_insights
CREATE POLICY "Children can view own insights"
ON public.wendy_insights FOR SELECT
TO authenticated
USING (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Carers can view insights for linked children"
ON public.wendy_insights FOR SELECT
TO authenticated
USING (
  child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_children_profiles_user_id ON public.children_profiles(user_id);
CREATE INDEX idx_children_profiles_linked_carer ON public.children_profiles(linked_carer_id);
CREATE INDEX idx_journal_entries_child_id ON public.journal_entries(child_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX idx_safeguarding_logs_child_id ON public.safeguarding_logs(child_id);
CREATE INDEX idx_wendy_insights_journal_entry ON public.wendy_insights(journal_entry_id);

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_children_profiles_updated_at
BEFORE UPDATE ON public.children_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carer_profiles_updated_at
BEFORE UPDATE ON public.carer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();