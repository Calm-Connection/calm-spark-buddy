-- Create custom_moods table for child-created emotions
CREATE TABLE custom_moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children_profiles(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  label text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_used_at timestamptz,
  use_count integer DEFAULT 1 NOT NULL,
  UNIQUE(child_id, emoji, label)
);

-- Enable RLS on custom_moods
ALTER TABLE custom_moods ENABLE ROW LEVEL SECURITY;

-- Children can view their own custom moods
CREATE POLICY "Children can view own custom moods"
  ON custom_moods FOR SELECT
  USING (child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  ));

-- Children can insert their own custom moods
CREATE POLICY "Children can insert own custom moods"
  ON custom_moods FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  ));

-- Children can update their own custom moods
CREATE POLICY "Children can update own custom moods"
  ON custom_moods FOR UPDATE
  USING (child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  ));

-- Children can delete their own custom moods
CREATE POLICY "Children can delete own custom moods"
  ON custom_moods FOR DELETE
  USING (child_id IN (
    SELECT id FROM children_profiles WHERE user_id = auth.uid()
  ));

-- Carers can view custom moods of linked children
CREATE POLICY "Carers can view linked children custom moods"
  ON custom_moods FOR SELECT
  USING (child_id IN (
    SELECT id FROM children_profiles WHERE linked_carer_id = auth.uid()
  ));

-- Expand mood_tag enum with new emotions
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'proud';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'lonely';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'tired';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'confused';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'hopeful';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'frustrated';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'embarrassed';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'nervous';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'bored';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'grateful';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'peaceful';
ALTER TYPE mood_tag ADD VALUE IF NOT EXISTS 'okay';

-- Add custom_mood_id to journal_entries table
ALTER TABLE journal_entries 
ADD COLUMN custom_mood_id uuid REFERENCES custom_moods(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_custom_moods_child_id ON custom_moods(child_id);
CREATE INDEX idx_custom_moods_use_count ON custom_moods(use_count DESC);
CREATE INDEX idx_journal_entries_custom_mood ON journal_entries(custom_mood_id);