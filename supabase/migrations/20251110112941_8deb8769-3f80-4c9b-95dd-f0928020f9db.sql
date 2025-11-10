-- Create custom breathing spaces table
CREATE TABLE IF NOT EXISTS public.custom_breathing_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  name text NOT NULL,
  visual_theme text NOT NULL,
  sound_theme text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_used_at timestamptz,
  is_favorite boolean DEFAULT false,
  CONSTRAINT unique_child_space_name UNIQUE(child_id, name)
);

-- Enable RLS
ALTER TABLE public.custom_breathing_spaces ENABLE ROW LEVEL SECURITY;

-- Children can view their own custom spaces
CREATE POLICY "Children can view own custom spaces"
  ON public.custom_breathing_spaces FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

-- Children can create their own custom spaces
CREATE POLICY "Children can create own custom spaces"
  ON public.custom_breathing_spaces FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

-- Children can update their own custom spaces
CREATE POLICY "Children can update own custom spaces"
  ON public.custom_breathing_spaces FOR UPDATE
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

-- Children can delete their own custom spaces
CREATE POLICY "Children can delete own custom spaces"
  ON public.custom_breathing_spaces FOR DELETE
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

-- Carers can view custom spaces of linked children
CREATE POLICY "Carers can view linked children custom spaces"
  ON public.custom_breathing_spaces FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  ));

-- Index for performance
CREATE INDEX idx_custom_breathing_child ON public.custom_breathing_spaces(child_id);
CREATE INDEX idx_custom_breathing_favorite ON public.custom_breathing_spaces(is_favorite) WHERE is_favorite = true;