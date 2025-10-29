-- Create coping_tools table to store evidence-based coping strategies
CREATE TABLE public.coping_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions JSONB NOT NULL,
  age_range TEXT NOT NULL DEFAULT '7-16',
  tags TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT NOT NULL DEFAULT '🌟',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coping_tools ENABLE ROW LEVEL SECURITY;

-- Anyone can view coping tools
CREATE POLICY "Anyone can view coping tools"
ON public.coping_tools
FOR SELECT
USING (true);

-- Insert evidence-based coping tools from training documents
INSERT INTO public.coping_tools (name, category, description, instructions, age_range, tags, icon) VALUES
(
  'Balloon Breathing',
  'breathing',
  'A calming breathing exercise that helps you feel more relaxed',
  '["Imagine holding a big balloon", "Breathe in slowly through your nose for 4 counts (filling the balloon)", "Hold your breath for 2 counts", "Breathe out slowly through your mouth for 6 counts (letting the balloon deflate)", "Repeat 5 times"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'stress', 'worry', 'calm'],
  '🎈'
),
(
  '5-4-3-2-1 Grounding',
  'grounding',
  'A technique to bring you back to the present moment when feeling overwhelmed',
  '["Name 5 things you can see around you", "Name 4 things you can touch", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'overwhelmed', 'panic', 'grounding'],
  '🌍'
),
(
  'Worry Box',
  'creative',
  'A way to put your worries aside for now so you can feel lighter',
  '["Write or draw your worry on a piece of paper", "Fold it up", "Put it in a real box, drawer, or imagine a special worry box", "Tell yourself: \"I can look at this later if I need to, but for now it is safe in the box\"", "Do something you enjoy"]'::jsonb,
  '7-16',
  ARRAY['worry', 'anxiety', 'stress'],
  '📦'
),
(
  'Safe Place Visualization',
  'mindfulness',
  'Imagine a place where you feel completely safe and calm',
  '["Close your eyes or look at a calm spot", "Think of a place where you feel really safe (real or imaginary)", "Picture what you see there - colors, objects, nature", "Imagine what sounds you hear there", "Notice how your body feels in this safe place", "Stay here for as long as you need"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'calm', 'safe', 'stress'],
  '🏝️'
),
(
  'Emotion Color Drawing',
  'creative',
  'Express your feelings through colors and shapes',
  '["Get some paper and colors (crayons, markers, or colored pencils)", "Think about how you feel right now", "Pick colors that match your feelings", "Draw shapes, lines, or scribbles - there is no right or wrong way", "Notice if your feelings change as you draw"]'::jsonb,
  '7-16',
  ARRAY['expression', 'creativity', 'processing', 'all emotions'],
  '🎨'
),
(
  'Body Scan',
  'mindfulness',
  'Notice how your body feels and release tension',
  '["Sit or lie down comfortably", "Starting with your toes, notice how they feel", "Slowly move your attention up: feet, legs, tummy, chest, arms, hands, shoulders, neck, face", "If you notice tension anywhere, imagine breathing into that spot", "Let your whole body feel heavy and relaxed"]'::jsonb,
  '9-16',
  ARRAY['stress', 'tension', 'calm', 'mindfulness'],
  '🧘'
),
(
  'Friendly Self-Talk',
  'cognitive',
  'Talk to yourself like you would talk to a good friend',
  '["Notice what you are saying to yourself in your head", "Ask: Would I say this to my best friend?", "Change harsh words to kind ones", "Try: \"I am doing my best\" or \"It is okay to make mistakes\" or \"I can handle this\"", "Practice this every day"]'::jsonb,
  '8-16',
  ARRAY['self-esteem', 'kindness', 'confidence', 'negative thoughts'],
  '💭'
),
(
  'Progressive Muscle Relaxation',
  'physical',
  'Tense and relax your muscles to release stress',
  '["Sit or lie down comfortably", "Squeeze your hands into fists, hold for 5 seconds, then release", "Tense your arms, hold, then release", "Scrunch your shoulders up to your ears, hold, then drop them down", "Work through your whole body: face, tummy, legs, feet", "Notice how relaxed your body feels"]'::jsonb,
  '9-16',
  ARRAY['stress', 'tension', 'physical', 'calm'],
  '💪'
),
(
  'Gratitude List',
  'cognitive',
  'Focus on good things to shift your mood',
  '["Write down 3 things you are grateful for today (they can be small)", "Examples: a warm meal, a kind word, your pet, sunshine, your favorite song", "Read your list out loud or in your head", "Notice how you feel", "Add to your list whenever you want"]'::jsonb,
  '8-16',
  ARRAY['positivity', 'mood', 'gratitude', 'happiness'],
  '✨'
),
(
  'Movement Break',
  'physical',
  'Move your body to release big emotions',
  '["Choose a movement: jumping jacks, dancing, running in place, stretching", "Do it for 2-5 minutes", "Notice your breathing and heartbeat", "Slow down and take 3 deep breaths", "Check in: how do you feel now?"]'::jsonb,
  '7-16',
  ARRAY['anger', 'frustration', 'energy', 'physical'],
  '🏃'
),
(
  'Thought Cloud',
  'mindfulness',
  'Watch your thoughts float by like clouds without getting stuck on them',
  '["Sit comfortably and close your eyes or look down", "Imagine you are lying on grass looking up at the sky", "When a thought comes, picture it on a cloud", "Watch the cloud (thought) float across the sky and away", "A new thought? Put it on a new cloud and watch it float by", "You are not your thoughts - you are the sky watching them pass"]'::jsonb,
  '9-16',
  ARRAY['mindfulness', 'anxiety', 'rumination', 'thoughts'],
  '☁️'
),
(
  'Feelings Wheel',
  'cognitive',
  'Identify and name your specific emotions',
  '["Think about how you feel right now", "Start with a basic emotion: happy, sad, angry, scared, or confused", "Get more specific: Is sad actually disappointed? Lonely? Hurt?", "Name the specific feeling", "Say out loud or write: \"I feel [specific emotion] because [reason]\"", "Naming feelings helps you understand and manage them"]'::jsonb,
  '8-16',
  ARRAY['emotional awareness', 'expression', 'all emotions'],
  '🎯'
);

-- Add recommended_tool_ids to wendy_insights table to link to specific tools
ALTER TABLE public.wendy_insights
ADD COLUMN IF NOT EXISTS recommended_tool_ids UUID[];

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_coping_tools_category ON public.coping_tools(category);
CREATE INDEX IF NOT EXISTS idx_coping_tools_tags ON public.coping_tools USING GIN(tags);