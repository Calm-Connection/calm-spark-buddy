-- Add 6 new achievements for expanded tracking
INSERT INTO public.achievements (name, description, icon, category, requirement_count) VALUES
  ('3-Day Streak', 'Checked in 3 days in a row!', '🌟', 'streak', 3),
  ('Shared With Grown-Up', 'Shared a journal entry with your carer', '💜', 'sharing', 1),
  ('Tried a Tool', 'Used a calming tool for the first time', '🧘', 'tool_usage', 1),
  ('Breathing Champion', 'Completed a breathing exercise', '🌬️', 'breathing', 1),
  ('Calm Corner Creator', 'Explored the calm corner', '🏠', 'calm_corner', 1),
  ('Feeling Explorer', 'Tried 5 different mood check-ins', '🎨', 'emotion_variety', 5)
ON CONFLICT DO NOTHING;