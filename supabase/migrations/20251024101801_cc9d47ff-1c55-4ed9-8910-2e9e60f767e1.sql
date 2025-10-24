-- Create carer private journal entries table
CREATE TABLE public.carer_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carer_id UUID NOT NULL REFERENCES public.carer_profiles(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice', 'drawing'
  entry_text TEXT,
  voice_url TEXT,
  drawing_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carer_journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for carer journal entries
CREATE POLICY "Carers can view own journal entries"
ON public.carer_journal_entries
FOR SELECT
TO authenticated
USING (carer_id IN (
  SELECT id FROM public.carer_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Carers can insert own journal entries"
ON public.carer_journal_entries
FOR INSERT
TO authenticated
WITH CHECK (carer_id IN (
  SELECT id FROM public.carer_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Carers can update own journal entries"
ON public.carer_journal_entries
FOR UPDATE
TO authenticated
USING (carer_id IN (
  SELECT id FROM public.carer_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Carers can delete own journal entries"
ON public.carer_journal_entries
FOR DELETE
TO authenticated
USING (carer_id IN (
  SELECT id FROM public.carer_profiles WHERE user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_carer_journal_entries_updated_at
BEFORE UPDATE ON public.carer_journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'checkin', 'module', 'streak', 'journal'
  requirement_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for achievements (public read)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- Create user achievements tracking table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements"
ON public.user_achievements
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own achievements"
ON public.user_achievements
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'anxiety', 'coping', 'mindfulness', etc.
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
ON public.modules
FOR SELECT
TO authenticated
USING (true);

-- Create module lessons table
CREATE TABLE public.module_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'video', 'audio'
  media_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
ON public.module_lessons
FOR SELECT
TO authenticated
USING (true);

-- Create user module progress table
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.module_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON public.user_module_progress
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
ON public.user_module_progress
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
ON public.user_module_progress
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_user_module_progress_updated_at
BEFORE UPDATE ON public.user_module_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add drawing_data to existing journal_entries for child drawings
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS drawing_data JSONB;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS voice_url TEXT;

-- Insert some initial achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_count) VALUES
  ('First Check-in', 'Completed your first daily check-in', '⭐', 'checkin', 1),
  ('Check-in Streak', 'Completed 7 daily check-ins in a row', '🔥', 'checkin', 7),
  ('Journal Writer', 'Written 5 journal entries', '📝', 'journal', 5),
  ('Learning Journey', 'Completed your first module', '🎓', 'module', 1),
  ('Knowledge Seeker', 'Completed 5 modules', '🏆', 'module', 5);

-- Insert initial modules
INSERT INTO public.modules (title, description, icon, category, order_index) VALUES
  ('Understanding Anxiety', 'Learn what anxiety is and how it affects you', '🧠', 'anxiety', 1),
  ('Breathing Techniques', 'Simple breathing exercises to calm your mind', '🌬️', 'coping', 2),
  ('Mindfulness Basics', 'Introduction to mindfulness and being present', '🧘', 'mindfulness', 3),
  ('Positive Self-Talk', 'Building confidence through kind words to yourself', '💬', 'coping', 4);

-- Insert lessons for first module
INSERT INTO public.module_lessons (module_id, title, content, content_type, order_index)
SELECT 
  m.id,
  'What is Anxiety?',
  'Anxiety is a normal feeling that everyone experiences. It''s your body''s way of preparing for something important or challenging. In this lesson, you''ll learn about what anxiety feels like and why it happens.',
  'text',
  1
FROM public.modules m WHERE m.title = 'Understanding Anxiety';

INSERT INTO public.module_lessons (module_id, title, content, content_type, order_index)
SELECT 
  m.id,
  'How Anxiety Affects Your Body',
  'When you feel anxious, your body might feel different. Your heart might beat faster, you might feel butterflies in your stomach, or your hands might feel sweaty. These are all normal reactions!',
  'text',
  2
FROM public.modules m WHERE m.title = 'Understanding Anxiety';

INSERT INTO public.module_lessons (module_id, title, content, content_type, order_index)
SELECT 
  m.id,
  'It''s Okay to Feel Anxious',
  'Remember: feeling anxious doesn''t mean something is wrong with you. Everyone feels anxious sometimes, and there are many ways to feel better when anxiety shows up.',
  'text',
  3
FROM public.modules m WHERE m.title = 'Understanding Anxiety';