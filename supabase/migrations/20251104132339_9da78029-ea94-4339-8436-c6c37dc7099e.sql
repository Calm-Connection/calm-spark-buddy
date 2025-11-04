-- Create moderation logs table for audit trail
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  is_safe BOOLEAN NOT NULL,
  category TEXT, -- 'profanity', 'sexual', 'violence', 'hate_speech', 'drugs', 'personal_info', 'safe'
  confidence FLOAT,
  flagged_at TIMESTAMPTZ DEFAULT now(),
  context TEXT -- 'avatar_freestyle', 'avatar_customizer', etc.
);

-- Create safeguarding alerts table for admin review
CREATE TABLE safeguarding_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  details TEXT,
  status TEXT DEFAULT 'pending_review', -- 'pending_review', 'reviewed', 'action_taken'
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own moderation logs (transparency)
CREATE POLICY "Users can view own moderation logs"
  ON moderation_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can view safeguarding alerts (admin access would be added later)
CREATE POLICY "Users can view own safeguarding alerts"
  ON safeguarding_alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_moderation_logs_user_id ON moderation_logs(user_id);
CREATE INDEX idx_moderation_logs_flagged_at ON moderation_logs(flagged_at);
CREATE INDEX idx_safeguarding_alerts_user_id ON safeguarding_alerts(user_id);
CREATE INDEX idx_safeguarding_alerts_status ON safeguarding_alerts(status);