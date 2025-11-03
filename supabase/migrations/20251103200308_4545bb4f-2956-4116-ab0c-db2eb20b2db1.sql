-- Create avatar history table to store previously generated avatars
CREATE TABLE IF NOT EXISTS public.avatar_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_json jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_current boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.avatar_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own avatar history
CREATE POLICY "Users can view own avatar history"
ON public.avatar_history
FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own avatar history
CREATE POLICY "Users can insert own avatar history"
ON public.avatar_history
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own avatar history
CREATE POLICY "Users can update own avatar history"
ON public.avatar_history
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own avatar history
CREATE POLICY "Users can delete own avatar history"
ON public.avatar_history
FOR DELETE
USING (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_avatar_history_user_id ON public.avatar_history(user_id);
CREATE INDEX IF NOT EXISTS idx_avatar_history_current ON public.avatar_history(user_id, is_current) WHERE is_current = true;