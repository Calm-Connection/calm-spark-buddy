-- Create safeguarding patterns table for tracking recurring themes
CREATE TABLE public.safeguarding_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children_profiles(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('escalating', 'recurring', 'concerning_change')),
  detected_themes JSONB,
  severity_trend TEXT CHECK (severity_trend IN ('improving', 'stable', 'declining')),
  first_detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entry_count INTEGER NOT NULL DEFAULT 1,
  recommended_action TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'monitoring')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create mood check-ins table for daily mood tracking
CREATE TABLE public.mood_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children_profiles(id) ON DELETE CASCADE,
  mood_type TEXT NOT NULL,
  mood_emoji TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create protective factors table for tracking support systems
CREATE TABLE public.protective_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children_profiles(id) ON DELETE CASCADE,
  factor_type TEXT NOT NULL CHECK (factor_type IN ('trusted_adult', 'activity', 'coping_tool', 'friend', 'hobby', 'pet')),
  description TEXT,
  mentioned_in_entry UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create escalation responses table for tracking outcomes
CREATE TABLE public.escalation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safeguarding_log_id UUID NOT NULL REFERENCES public.safeguarding_logs(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('child_acknowledged', 'carer_reviewed', 'external_help_sought', 'resolved', 'ongoing')),
  response_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  outcome TEXT CHECK (outcome IN ('resolved', 'ongoing_monitoring', 'escalated_further', 'no_action_needed'))
);

-- Update safeguarding_logs to include escalation tier and context
ALTER TABLE public.safeguarding_logs 
ADD COLUMN IF NOT EXISTS escalation_tier INTEGER CHECK (escalation_tier >= 1 AND escalation_tier <= 4),
ADD COLUMN IF NOT EXISTS protective_factors_present JSONB,
ADD COLUMN IF NOT EXISTS historical_context JSONB;

-- Enable RLS on new tables
ALTER TABLE public.safeguarding_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protective_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for safeguarding_patterns
CREATE POLICY "Children can view own safeguarding patterns"
  ON public.safeguarding_patterns
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Carers can view linked children safeguarding patterns"
  ON public.safeguarding_patterns
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  ));

-- RLS Policies for mood_check_ins
CREATE POLICY "Children can insert own mood check-ins"
  ON public.mood_check_ins
  FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Children can view own mood check-ins"
  ON public.mood_check_ins
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Carers can view linked children mood check-ins"
  ON public.mood_check_ins
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  ));

-- RLS Policies for protective_factors
CREATE POLICY "Children can view own protective factors"
  ON public.protective_factors
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Carers can view linked children protective factors"
  ON public.protective_factors
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM public.children_profiles WHERE linked_carer_id = auth.uid()
  ));

-- RLS Policies for escalation_responses
CREATE POLICY "Carers can insert escalation responses for linked children"
  ON public.escalation_responses
  FOR INSERT
  WITH CHECK (safeguarding_log_id IN (
    SELECT sl.id FROM public.safeguarding_logs sl
    JOIN public.children_profiles cp ON sl.child_id = cp.id
    WHERE cp.linked_carer_id = auth.uid()
  ));

CREATE POLICY "Carers can view escalation responses for linked children"
  ON public.escalation_responses
  FOR SELECT
  USING (safeguarding_log_id IN (
    SELECT sl.id FROM public.safeguarding_logs sl
    JOIN public.children_profiles cp ON sl.child_id = cp.id
    WHERE cp.linked_carer_id = auth.uid()
  ));

CREATE POLICY "Carers can update escalation responses for linked children"
  ON public.escalation_responses
  FOR UPDATE
  USING (safeguarding_log_id IN (
    SELECT sl.id FROM public.safeguarding_logs sl
    JOIN public.children_profiles cp ON sl.child_id = cp.id
    WHERE cp.linked_carer_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_safeguarding_patterns_child_id ON public.safeguarding_patterns(child_id);
CREATE INDEX idx_safeguarding_patterns_status ON public.safeguarding_patterns(status);
CREATE INDEX idx_mood_check_ins_child_id ON public.mood_check_ins(child_id);
CREATE INDEX idx_mood_check_ins_created_at ON public.mood_check_ins(created_at DESC);
CREATE INDEX idx_protective_factors_child_id ON public.protective_factors(child_id);
CREATE INDEX idx_escalation_responses_safeguarding_log_id ON public.escalation_responses(safeguarding_log_id);