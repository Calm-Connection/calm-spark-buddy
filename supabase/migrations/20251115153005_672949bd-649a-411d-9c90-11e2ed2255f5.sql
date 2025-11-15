-- Create helpline engagements table for tracking user interactions with helpline modal
CREATE TABLE public.helpline_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children_profiles(id) ON DELETE CASCADE,
  engagement_type TEXT NOT NULL, -- 'called', 'chatted', 'trusted_adult', 'dismissed'
  triggered_by TEXT NOT NULL DEFAULT 'manual', -- 'journal_entry', 'manual', 'tool_usage'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.helpline_engagements ENABLE ROW LEVEL SECURITY;

-- Children can insert their own engagements
CREATE POLICY "Children can insert own helpline engagements"
ON public.helpline_engagements
FOR INSERT
WITH CHECK (
  child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  )
);

-- Children can view their own engagements
CREATE POLICY "Children can view own helpline engagements"
ON public.helpline_engagements
FOR SELECT
USING (
  child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  )
);

-- Carers can view linked children engagements
CREATE POLICY "Carers can view linked children helpline engagements"
ON public.helpline_engagements
FOR SELECT
USING (
  child_id IN (
    SELECT id FROM children_profiles WHERE linked_carer_id = auth.uid()
  )
);

-- Create index for performance
CREATE INDEX idx_helpline_engagements_child_id ON public.helpline_engagements(child_id);
CREATE INDEX idx_helpline_engagements_created_at ON public.helpline_engagements(created_at DESC);