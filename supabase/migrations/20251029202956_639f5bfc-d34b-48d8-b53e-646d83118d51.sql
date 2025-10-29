-- Add 7 new NHS/CAMHS validated coping tools
INSERT INTO public.coping_tools (name, category, description, instructions, age_range, tags, icon) VALUES
(
  '3-Breath Technique',
  'breathing',
  'A quick calming technique from NHS for when you feel anxious or overwhelmed.',
  '["Breathe in slowly for 3 counts", "Hold for 1 count", "Breathe out slowly for 3 counts", "Repeat this 3 times", "Notice how your body starts to feel calmer"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'calm', 'breathing', 'quick'],
  '🫁'
),
(
  'Build Your Happy Place',
  'visualization',
  'Create a safe mental space you can visit anytime from Childline guidance.',
  '["Close your eyes and take a deep breath", "Imagine a place where you feel completely safe and happy", "What do you see around you?", "What sounds can you hear?", "What can you smell?", "Notice how calm and safe you feel here", "Remember: you can visit this place in your mind whenever you need to"]'::jsonb,
  '7-16',
  ARRAY['calm', 'visualization', 'safe', 'anxiety'],
  '🏝️'
),
(
  'Worry Box (Physical)',
  'creative',
  'An NHS activity to contain worries and make them feel more manageable.',
  '["Find or decorate an empty tissue box or small container", "When you have a worry, write or draw it on a piece of paper", "Post it through the slot in your worry box", "Tell yourself: I''ve put that worry away for now", "You can look at the worries with a trusted adult later if you want"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'worry', 'creative', 'containment'],
  '📦'
),
(
  'Body Mapping',
  'awareness',
  'From NHS CAMHS - understand where anxiety shows up in your body.',
  '["Draw a simple outline of a person (or use a gingerbread person shape)", "Think about where you feel worry or anxiety in your body", "Color or shade those areas", "What color is your worry? Red, grey, dark blue?", "Sometimes just seeing where feelings live helps us understand them better"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'awareness', 'creative', 'body'],
  '🎨'
),
(
  'Thought Thermometer',
  'awareness',
  'NHS CAMHS technique to measure and track your feelings.',
  '["Imagine a thermometer that measures worry instead of temperature", "0 = completely calm and relaxed", "5 = noticeably worried but managing", "10 = the worst worry you could imagine", "Where are you right now on the scale?", "Sometimes just knowing the number helps us see it can change"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'awareness', 'scale', 'tracking'],
  '🌡️'
),
(
  'STOP Plan',
  'grounding',
  'NHS CAMHS four-step emergency calm-down technique.',
  '["S = STOP what you''re doing", "T = TAKE three slow breaths", "O = OBSERVE what you''re thinking and feeling (name it: I feel scared, angry, worried)", "P = PROCEED calmly - what''s one small thing you can do right now?"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'grounding', 'calm', 'emergency'],
  '🛑'
),
(
  'Square Breathing',
  'breathing',
  'NHS CAMHS structured breathing to calm your nervous system.',
  '["Trace a square shape with your finger (on your leg, in the air, or follow a real square)", "Breathe IN for 4 counts as you trace the first side", "HOLD for 4 counts as you trace the second side", "Breathe OUT for 4 counts as you trace the third side", "HOLD for 4 counts as you trace the fourth side", "Repeat for 3-4 rounds"]'::jsonb,
  '7-16',
  ARRAY['anxiety', 'breathing', 'calm', 'focus'],
  '⬜'
);