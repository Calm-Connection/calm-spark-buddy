-- Insert Course 1: Understanding Your Child's Anxiety
INSERT INTO modules (title, description, icon, category, order_index) VALUES
('Understanding Your Child''s Anxiety', 'Learn how anxiety works in children and your role in supporting them', '🧠', 'carer-anxiety-understanding', 1);

-- Get the module ID for course 1
DO $$
DECLARE
  course1_id uuid;
  course2_id uuid;
  course3_id uuid;
  course4_id uuid;
  course5_id uuid;
BEGIN
  SELECT id INTO course1_id FROM modules WHERE category = 'carer-anxiety-understanding' LIMIT 1;
  
  -- Course 1 Lessons
  INSERT INTO module_lessons (module_id, title, content, content_type, order_index) VALUES
  (course1_id, 'What Anxiety Really Is (Nervous System 101)', 'Anxiety isn''t a character flaw or bad behaviour — it''s your child''s nervous system trying to keep them safe.

When we feel unsafe, our nervous system activates a threat response. For children, this can be triggered by things that seem small to us (like school, separation, or new situations) but feel enormous to them.

**The Three States:**
- **Safe & Social:** Calm, connected, able to learn and play
- **Fight or Flight:** Racing heart, restlessness, worry, anger
- **Shutdown:** Withdrawal, numbness, tiredness

Your role isn''t to "fix" anxiety — it''s to help your child feel safe enough for their nervous system to settle. This is called co-regulation, and it''s one of the most powerful tools you have.', 'text', 1),
  
  (course1_id, 'Fight / Flight / Freeze in Children', 'Children''s bodies respond to stress in three main ways:

**Fight:** Anger, defiance, meltdowns, aggression. This isn''t naughtiness — it''s a nervous system in survival mode.

**Flight:** Restlessness, pacing, difficulty sitting still, trying to escape situations. Their body is telling them to run.

**Freeze:** Shutting down, going quiet, seeming "fine" but actually overwhelmed. This is often mistaken for cooperation, but it''s a shutdown response.

**What helps:**
- Name what you see without judgment: "I notice your body feels really activated right now"
- Offer safety cues: calm voice, soft eyes, gentle proximity
- Don''t force them to talk — regulate first, discuss later
- Remember: behaviour is communication

When you understand these responses, you can respond with compassion instead of frustration.', 'text', 2),
  
  (course1_id, 'The Role of Your Presence (Co-Regulation)', 'Co-regulation is how your calm nervous system helps your child''s nervous system find calm too.

**Why it matters:**
Children can''t regulate themselves from a dysregulated state. They need to "borrow" your calm first. This isn''t spoiling them — it''s how their developing brain learns to self-regulate over time.

**How to co-regulate:**
- Stay physically present without overwhelming them
- Breathe slowly and deeply yourself
- Use a warm, steady voice
- Avoid lecturing or problem-solving mid-meltdown
- Match their energy level first, then gently bring it down

**What it looks like:**
Instead of: "Stop crying, you''re fine!"
Try: "I''m right here. You''re safe. We''ll get through this together."

Your presence is the most powerful regulation tool your child has. You are their safe harbour.', 'text', 3),
  
  (course1_id, 'How Children Borrow Your Calm (Connection First)', 'Children''s nervous systems are wired to sync with their caregivers. This is called neuroception — their body scanning for safety cues from you.

**What your child''s nervous system reads:**
- Your breathing pace
- Your facial expressions
- Your tone of voice
- Your body tension

**Connection before correction:**
When a child is dysregulated, their thinking brain (prefrontal cortex) goes offline. Trying to reason with them won''t work. They need to feel safe first.

**Practical steps:**
1. Get calm yourself (even if you have to step away for 10 seconds)
2. Move closer physically (if they allow it)
3. Use gentle touch or just your presence
4. Wait for their breathing to slow
5. Only then, talk about what happened

Remember: "Connection before correction" isn''t permissive parenting — it''s brain-based parenting. You can still set boundaries, but only after their nervous system is calm enough to hear you.', 'text', 4),
  
  (course1_id, 'Why Anxiety Isn''t "Bad Behaviour"', 'When a child is anxious, their behaviour can look like defiance, rudeness, or avoidance. But here''s the truth: anxiety-driven behaviour isn''t naughtiness — it''s a cry for help from a nervous system in distress.

**What it looks like:**
- Refusing to go to school (not laziness — panic)
- Lashing out at you (not disrespect — overwhelm)
- Saying "I hate you" (not meanness — desperate attempt to push away the feeling)
- Going silent (not stubbornness — freeze response)

**Why punishment doesn''t work:**
Punishment activates more threat in the nervous system. It tells the brain: "You''re still not safe." This makes anxiety worse, not better.

**What does work:**
- Name the feeling: "I think your body feels really scared right now"
- Validate without fixing: "That makes sense. This is hard"
- Offer safety: "I''m here. We''ll figure this out together"
- Set boundaries calmly: "I know this is scary. We still need to go, and I''ll be with you"

You''re not excusing poor behaviour — you''re addressing the root cause. When the nervous system feels safe, behaviour improves.', 'text', 5),
  
  (course1_id, 'Nervous System Safety Cues Parents Can Give', 'Your child''s nervous system is constantly scanning for danger or safety. You can send powerful safety cues without saying a word.

**Visual cues (what they see):**
- Soft eyes, not hard stares
- Open body posture, not crossed arms
- A gentle smile or nod
- Getting down to their eye level

**Auditory cues (what they hear):**
- Slower, softer voice
- Warm tone, not sharp or clipped
- Longer exhales (their nervous system will mirror this)
- Saying their name gently

**Physical cues (what they feel):**
- Gentle touch on their shoulder or back
- Sitting beside them, not hovering over them
- Slowing your own movements down
- Offering a hug without forcing it

**Presence cues (what they sense):**
- Staying near them without demanding they talk
- Not rushing them to "get over it"
- Your own regulated breathing

These cues work because they bypass the thinking brain and speak directly to the nervous system. Practice them daily, not just in crisis moments, so your child''s body learns: "This person is safe."', 'text', 6);

  -- Insert Course 2: Practical Tools for Regulation
  INSERT INTO modules (title, description, icon, category, order_index) VALUES
  ('Practical Tools for Regulation', 'Evidence-based techniques to help your child calm their nervous system', '🌬️', 'carer-regulation-tools', 2);
  
  SELECT id INTO course2_id FROM modules WHERE category = 'carer-regulation-tools' LIMIT 1;
  
  -- Course 2 Lessons
  INSERT INTO module_lessons (module_id, title, content, content_type, order_index) VALUES
  (course2_id, 'How to Use Grounding (5-4-3-2-1)', 'Grounding brings your child back to the present moment when anxiety pulls them into "what if" thinking.

**The 5-4-3-2-1 technique:**
Ask your child to name:
- 5 things they can see
- 4 things they can touch
- 3 things they can hear
- 2 things they can smell
- 1 thing they can taste

**Why it works:**
This engages the thinking brain (prefrontal cortex) and interrupts the panic spiral. It''s a gentle redirect without forcing them to "calm down."

**Other grounding ideas:**
- **Warm hands:** Hold a warm drink or run hands under warm water
- **Slow sipping:** Give them water to sip slowly
- **Texture:** Let them hold something soft, cold, or textured
- **Feet on floor:** Ask them to press their feet firmly into the ground

**How to introduce it:**
Practice when they''re calm, not mid-panic. Say: "I''m going to teach you a trick that helps when feelings get big. Want to try?"

Make it playful, not clinical. You can even do it together.', 'text', 1),
  
  (course2_id, 'Breathing Techniques (NHS-Backed)', 'Slow breathing is one of the most evidence-based tools for calming anxiety. It signals to the body: "We''re safe now."

**Box Breathing (NHS-recommended):**
1. Breathe in for 4 counts
2. Hold for 4 counts
3. Breathe out for 4 counts
4. Hold for 4 counts
Repeat 4 times.

**Belly Breathing for younger children:**
- Place their hand on their belly
- Ask them to breathe in and make their belly rise like a balloon
- Breathe out and watch the balloon deflate
- Do this 5 times together

**Why it works:**
Slow breathing activates the vagus nerve, which tells the body to switch from "threat" mode to "safe" mode. It''s like pressing a reset button on the nervous system.

**Top tips:**
- Breathe with them — don''t just instruct
- Make it visual: blow bubbles, blow out pretend birthday candles, breathe like a sleepy teddy
- Keep it short: 5 breaths is enough
- Never force it: "Would you like to breathe with me?" not "You need to breathe now"

Practice together daily, not just in crisis.', 'text', 2),
  
  (course2_id, 'EFT Tapping for Kids (Simple & Safe)', 'EFT (Emotional Freedom Technique) tapping is a gentle way to help children release big emotions by tapping on specific body points.

**How to do it with children:**
While gently tapping each point, say a simple phrase like:
"Even though I feel worried, I''m okay"
or
"Even though I feel scared, my body is safe"

**The tapping points (simplified for kids):**
1. Top of the head
2. Eyebrow (start of the eyebrow)
3. Side of the eye
4. Under the eye
5. Under the nose
6. Chin
7. Collarbone
8. Under the arm

Tap each point 5-7 times, moving through the sequence 2-3 times.

**Why it works:**
Tapping sends calming signals to the amygdala (the brain''s fear center) while acknowledging the emotion. It''s not about "getting rid of" the feeling — it''s about making space for it.

**Make it playful:**
- Call it "worry tapping" or "magic tapping"
- Do it together as a game
- Let them tap on you while you say the words
- Keep the language simple and kind

Never force it. Offer it as one tool in the toolbox.', 'text', 3),
  
  (course2_id, 'EMDR-Inspired Butterfly Hug', 'The Butterfly Hug is a simple, child-friendly tool inspired by EMDR therapy. It uses bilateral stimulation (alternating left-right movement) to calm the nervous system.

**How to do it:**
1. Cross your arms over your chest
2. Place your hands on your shoulders (like a self-hug)
3. Gently tap your shoulders in an alternating rhythm: left, right, left, right
4. Breathe slowly while tapping
5. Continue for 1-2 minutes

**For children:**
- Call it the "butterfly hug" or "calm hug"
- Show them by doing it yourself first
- Do it together
- Add words: "I''m safe" or "I''m here" with each tap

**Why it works:**
The alternating tapping mimics the brain''s natural way of processing stress. It helps the body shift from "threat" to "safety" mode without needing to talk about what''s wrong.

**When to use it:**
- Before stressful situations (like school mornings)
- After a big emotion or meltdown
- At bedtime to help settle
- Anytime they need a quick reset

This is safe, non-invasive, and can be done anywhere. It''s also a lovely way to show your child they have tools inside their own body to feel safe.', 'text', 4),
  
  (course2_id, 'Creating Sensory Safety', 'Sensory input can dramatically calm or activate a nervous system. For anxious children, creating sensory safety is key.

**Calming sensory input:**
- **Touch:** Weighted blankets, soft textures, gentle pressure (hugs, hand holding)
- **Sound:** White noise, soft music, nature sounds, your calm voice
- **Sight:** Dim lighting, calming colors (blues, greens), minimal visual clutter
- **Smell:** Lavender, vanilla, familiar comforting scents
- **Taste:** Warm drinks, crunchy snacks, cold water

**Activating sensory input (use sparingly):**
- Bright lights
- Loud or sudden noises
- Rough textures
- Strong smells

**Create a calm corner at home:**
A designated space with:
- Soft cushions or a beanbag
- Calming visuals (photos, soft colors)
- Fidget toys or stress balls
- Books or drawing materials
- Headphones for quiet

**Sensory strategies for on-the-go:**
- Keep a small sensory kit: fidget toy, gum, headphones
- Let them wear comforting clothes (even if not "appropriate")
- Offer sunglasses or a hat in overwhelming environments
- Bring a comfort item from home

Remember: what soothes one child might activate another. Follow their lead.', 'text', 5),
  
  (course2_id, 'Preventing Panic Before It Escalates', 'The best time to help anxiety is before it becomes a full panic. Learn to spot the early warning signs.

**Early body cues to watch for:**
- Increased breathing rate
- Fidgeting or restlessness
- Going quiet or withdrawing
- Clenched fists or jaw
- Stomach complaints
- Saying "I don''t feel well"

**What to do at the first sign:**
1. **Name it gently:** "I notice your body feels a bit activated"
2. **Validate:** "That makes sense given [situation]"
3. **Offer a tool:** "Would you like to breathe with me?" or "Want to take a quick break?"
4. **Stay close:** Your calm presence is the intervention

**Create a "worry plan" together:**
When they''re calm, ask: "When you start to feel worried, what helps you most?"
Write it down together:
- Taking deep breaths
- Holding my hand
- Going to my calm corner
- Telling you how I feel

**Environmental prevention:**
- Predictable routines reduce anxiety
- Give warnings before transitions
- Reduce sensory overload when possible
- Make sure they''re not hungry, tired, or overstimulated

Prevention is always easier than intervention. Catch it early, respond with compassion, and teach them to notice their own early signals over time.', 'text', 6);

  -- Insert Course 3: Connection Skills
  INSERT INTO modules (title, description, icon, category, order_index) VALUES
  ('Connection Skills for Everyday Parenting', 'Build deeper connection and trust with your child through everyday moments', '💜', 'carer-connection-skills', 3);
  
  SELECT id INTO course3_id FROM modules WHERE category = 'carer-connection-skills' LIMIT 1;
  
  -- Course 3 Lessons
  INSERT INTO module_lessons (module_id, title, content, content_type, order_index) VALUES
  (course3_id, 'What Co-Regulation Looks Like in Real Life', 'Co-regulation isn''t just for meltdowns — it''s woven into everyday moments.

**Morning example:**
Your child is dragging their feet getting ready for school.
- Old response: "Hurry up! We''re going to be late!"
- Co-regulation response: Take a breath, sit beside them, say calmly: "I see you''re having a slow morning. Let''s do this together."

**Bedtime example:**
Your child is restless and saying they can''t sleep.
- Old response: "You need to go to sleep now!"
- Co-regulation response: Sit on their bed, breathe slowly, say: "I''ll stay here while your body settles."

**After-school example:**
Your child is irritable and snappy.
- Old response: "Don''t speak to me like that!"
- Co-regulation response: "You seem really activated. Want a snack and some quiet time?"

**The pattern:**
1. Notice their state
2. Regulate yourself first
3. Offer calm presence
4. Wait for connection before correction

Co-regulation is the bridge between chaos and calm. It doesn''t mean you don''t set boundaries — it means you help them reach a state where they can actually hear you.', 'text', 1),
  
  (course3_id, 'How to Validate Emotions Without Fixing', 'Children don''t need us to fix their feelings — they need us to see them.

**What validation sounds like:**
- "That sounds really hard"
- "I can see why you feel that way"
- "It makes sense you''re upset"
- "Tell me more about that"

**What it doesn''t sound like:**
- "You''re fine"
- "There''s nothing to worry about"
- "Just think positive"
- "Other kids don''t struggle with this"

**Why fixing backfires:**
When we rush to fix or minimize, the message children hear is: "Your feelings are wrong" or "You''re too much." This creates shame, not calm.

**The validation formula:**
1. Name the emotion: "You seem really frustrated"
2. Normalize it: "That makes sense"
3. Stay present: "I''m here"
4. Don''t problem-solve yet

**After validation, then you can help:**
Once they feel heard, they''re more open to solutions. But skip validation, and they won''t listen.

Example:
"I can see you''re really nervous about the test. That''s completely understandable. Want to talk about it, or just sit together for a bit?"

Validation doesn''t make emotions bigger — it helps them pass through.', 'text', 2),
  
  (course3_id, 'Scripts That Reduce Anxiety (Examples)', 'Words matter. Here are phrases that signal safety to an anxious child.

**Instead of:** "Don''t worry"
**Try:** "I know this feels big. We''ll handle it together."

**Instead of:** "You''re fine"
**Try:** "Your body is telling you something feels hard right now. I believe you."

**Instead of:** "Just try"
**Try:** "This is scary. Let''s take it one small step at a time."

**Instead of:** "Why are you so worried about this?"
**Try:** "I see this is really bothering you. What''s the hardest part?"

**Instead of:** "Stop crying"
**Try:** "It''s okay to cry. I''m right here."

**For separation anxiety:**
"I''m going, and I''m coming back. I always come back."

**For perfectionism:**
"Mistakes are how we learn. I don''t need perfect — I just need you to try."

**For social anxiety:**
"You don''t have to talk if you don''t want to. I''ll stay close."

**For bedtime worries:**
"Your brain is doing its job by thinking about things. Let''s give those thoughts a rest now. I''ll keep you safe tonight."

**The pattern:**
Acknowledge → Validate → Reassure → Support

Keep scripts simple, warm, and repeated. Anxious children need predictability in your words too.', 'text', 3),
  
  (course3_id, 'Repair After Conflict', 'You won''t always get it right — and that''s okay. What matters is the repair.

**Why repair matters:**
Children''s brains are wired for rupture and repair. When we mess up and then repair, we teach them:
- Mistakes don''t break relationships
- People can come back together
- It''s safe to trust again

**How to repair:**
1. **Acknowledge what happened:** "I raised my voice earlier, and that wasn''t okay"
2. **Take responsibility:** "That was about me, not you"
3. **Name the impact:** "I think that might have felt scary"
4. **Reconnect:** "I''m sorry. I love you. Can we start again?"

**What repair doesn''t include:**
- Justifying your behavior
- Blaming them
- Expecting immediate forgiveness

**Repair for different ages:**
- **Young children:** "Mummy got too loud. I''m sorry. Let''s have a hug."
- **Older children:** "I reacted badly. I was stressed, but you didn''t deserve that. I''m sorry."

**Make it a practice:**
Repair doesn''t have to be perfect. It just has to be genuine. The more you model it, the more your child learns to repair their own relationships too.

Remember: you don''t need to be a perfect parent. You need to be a present, repairing parent.', 'text', 4),
  
  (course3_id, 'Playfulness as a Regulation Tool', 'Play isn''t just fun — it''s one of the most powerful ways to regulate the nervous system.

**Why play helps anxiety:**
When a child plays, their nervous system shifts from "threat" to "safe." Play releases tension, builds connection, and creates joy — all antidotes to anxiety.

**Types of regulating play:**
- **Physical play:** Rough-and-tumble, dancing, pillow fights (releases pent-up energy)
- **Imaginative play:** Playing out worries through dolls or toys (processes fear safely)
- **Silly play:** Jokes, funny faces, being ridiculous together (breaks tension)
- **Collaborative play:** Building, drawing, cooking together (builds connection)

**How to use play to de-escalate:**
If your child is on edge, try:
- "Want to have a silly dance party?"
- "Let''s see who can make the funniest face"
- "Race you to the kitchen"
- "Can you balance on one foot while I time you?"

**Playfulness ≠ Permissiveness:**
You can still hold boundaries while being playful:
"I know you don''t want to put your shoes on. Let''s see if the shoes can hop onto your feet like bunnies!"

**When to use it:**
- Before stressful transitions
- When you feel disconnection creeping in
- After conflict, once calm is restored
- Daily, as preventative care

Children who feel connected through play are more regulated, more cooperative, and more resilient. Play is medicine.', 'text', 5),
  
  (course3_id, 'Building Predictable, Safe Routines', 'Routine = safety. Anxious children thrive on predictability because it reduces the unknown.

**Why routines help:**
When life feels unpredictable, the brain scans for danger. Routines tell the brain: "We know what''s coming. We''re safe."

**Key routines to establish:**
- **Morning routine:** Same order every day (wake, breakfast, dress, teeth, shoes)
- **After-school routine:** Snack, decompress time, homework, play
- **Bedtime routine:** Bath, story, calm chat, lights out

**How to build routines:**
1. Keep them simple and realistic
2. Use visual schedules (pictures or checklists)
3. Give warnings before transitions: "In 5 minutes, we''ll start bedtime"
4. Stay consistent — even on weekends

**When routines break:**
Life happens. When routines are disrupted, give extra warning and support:
"Tomorrow will be different because [reason]. Here''s what will happen instead."

**Flexibility within structure:**
Routines provide the container. Within that, give choices:
"It''s bedtime. Do you want to brush teeth first or put on pajamas first?"

**Routine as connection:**
Routines aren''t rigid rules — they''re rhythms that create safety. When your child knows what to expect, their nervous system can relax. And when the nervous system relaxes, anxiety softens.

Consistency isn''t about perfection. It''s about creating an anchor in a chaotic world.', 'text', 6);

  -- Insert Course 4: Boundaries
  INSERT INTO modules (title, description, icon, category, order_index) VALUES
  ('Boundaries, Standards, and Expectations', 'Learn how to set healthy boundaries that reduce anxiety and build resilience', '🛡️', 'carer-boundaries', 4);
  
  SELECT id INTO course4_id FROM modules WHERE category = 'carer-boundaries' LIMIT 1;
  
  -- Course 4 Lessons
  INSERT INTO module_lessons (module_id, title, content, content_type, order_index) VALUES
  (course4_id, 'The Difference Between Boundaries, Standards, Expectations', 'These three concepts are often confused, but they serve different purposes in parenting.

**Boundaries:**
What YOU will and won''t accept. Boundaries are about protecting your own wellbeing and the relationship.
Example: "I won''t allow hitting. If you''re angry, I''ll help you find another way."

**Standards:**
The values and behaviors you uphold as a family. Standards guide how you live.
Example: "In our family, we treat each other with kindness."

**Expectations:**
What you hope or predict will happen. Expectations can create pressure.
Example: "I expect you to get good grades" (creates pressure)
vs.
"I know you''ll do your best" (creates support)

**Why the distinction matters:**
- Boundaries keep everyone safe
- Standards give direction
- Expectations can backfire if too rigid

**For anxious children:**
- Clear boundaries reduce anxiety (they know where the edges are)
- Flexible expectations reduce pressure
- Consistent standards build security

Example in action:
Boundary: "Screen time ends at 7pm"
Standard: "We wind down together before bed"
Expectation (adjusted): "You might find it hard to stop, and that''s okay. I''ll help you."

Know the difference, and parent with clarity.', 'text', 1),
  
  (course4_id, 'Emotional vs Physical vs Time Boundaries', 'Different types of boundaries serve different purposes. Here''s how to think about each.

**Emotional boundaries:**
Protecting your emotional energy and theirs.
- "I can see you''re upset, but I won''t let you speak to me that way"
- "I need a few minutes to calm down before we talk about this"
- "Your feelings are important, and so are mine"

**Physical boundaries:**
Respecting bodies and space.
- "We don''t hit, even when we''re angry"
- "If you need space, tell me. I''ll give it to you"
- "Hugs are only when both people want them"

**Time boundaries:**
Protecting time for rest, connection, and self-care.
- "Bedtime is 8pm because your body needs rest"
- "We have 10 minutes before we need to leave"
- "I need 30 minutes to myself after work to recharge"

**How to set them with anxious children:**
1. Be clear and consistent
2. Explain why (age-appropriately): "Boundaries help us feel safe"
3. Hold them with calm firmness, not anger
4. Repair if you slip

**Example:**
Child keeps interrupting you on a call.
Boundary: "I need to finish this call. You can wait, or draw quietly beside me."
Why: Time boundary (protects your focus) + emotional boundary (protects your patience)

Boundaries aren''t mean — they''re the structure that holds everyone safe.', 'text', 2),
  
  (course4_id, 'Teaching Kids Consent + Autonomy', 'Consent and autonomy are foundational to a child''s sense of safety and self.

**Why this matters for anxious children:**
Anxious children often feel like the world happens TO them. Teaching consent gives them back a sense of control.

**What consent looks like in childhood:**
- **Body autonomy:** "You decide who touches your body. You don''t have to hug anyone if you don''t want to"
- **Choice within limits:** "You can choose the red shirt or the blue one"
- **Listening to their no:** When they say no to food, activities, or affection (within safe limits), honor it

**Teaching consent to others:**
- "If your friend says stop, you stop — even if it''s a game"
- "We ask before we touch someone else''s things"
- "It''s okay to change your mind"

**Balancing autonomy with safety:**
They don''t get to decide everything (that''s overwhelming), but they get choices within your boundaries.

Example:
"You need to go to school" (boundary)
"You can choose what to wear and what to pack for lunch" (autonomy)

**Why this reduces anxiety:**
When children feel they have some control, their nervous system relaxes. Powerlessness fuels anxiety. Small choices restore a sense of agency.

Model it too: "I need some space right now. I''ll come back in 5 minutes."

Autonomy + boundaries = safety + empowerment.', 'text', 3),
  
  (course4_id, 'How Boundaries Reduce Anxiety', 'It sounds counterintuitive, but boundaries actually make anxious children feel safer.

**Why boundaries help:**
Without boundaries, children feel like they''re in charge — and that''s terrifying. Boundaries say: "I''ve got this. You can relax."

**What boundaries provide:**
- **Structure:** Predictability calms the nervous system
- **Safety:** "Someone is steering the ship"
- **Containment:** Feelings won''t spiral out of control
- **Trust:** "My parent knows what they''re doing"

**Common fear:**
"If I set boundaries, my child will feel more anxious in the moment."

**The truth:**
Yes, they might protest. But long-term, boundaries build security. Anxious children need to know someone is holding the edges.

**Examples:**
- **Bedtime boundary:** "Bedtime is 8pm" → child knows what to expect, sleeps better, less tired = less anxious
- **Screen boundary:** "Screens off at 6pm" → reduces overstimulation, improves regulation
- **Emotional boundary:** "I won''t let you hit me, but I''ll help you with your anger" → child learns their feelings won''t destroy the relationship

**How to hold boundaries calmly:**
1. State it clearly
2. Don''t over-explain
3. Follow through consistently
4. Validate the feeling, not the behavior: "I know you''re disappointed. The answer is still no."

Boundaries aren''t walls — they''re the safe container that lets your child grow.', 'text', 4),
  
  (course4_id, 'Modelling Healthy Boundaries as a Parent', 'Children learn boundaries by watching you set them.

**What you model matters:**
If you say yes when you mean no, they learn boundaries are flexible.
If you push through exhaustion without rest, they learn self-care is selfish.
If you let others overstep you, they learn their boundaries don''t matter either.

**How to model boundaries:**
- **With them:** "I need 10 minutes to myself. I''ll be back soon."
- **With others:** "I can''t take on that extra task right now"
- **With yourself:** "I''m going to rest instead of doing more chores"

**Narrate your boundaries (age-appropriately):**
"I''m saying no to this playdate because I need time to recharge."
"I''m turning off my phone now so I can be present with you."

**What NOT to model:**
- Apologizing excessively for having needs
- Saying yes when you mean no
- Letting guilt override your limits

**When you slip:**
You will say yes when you mean no. When that happens, repair:
"I said yes earlier, but I need to change that. I''m sorry for the confusion."

**Why this matters for anxious children:**
When they see you honor your own boundaries, they learn:
- It''s okay to have limits
- Boundaries don''t break relationships
- Taking care of yourself is important

You can''t teach boundaries you don''t practice. Be the model.', 'text', 5),
  
  (course4_id, 'Knowing When to Step In vs Step Back', 'One of the hardest parts of parenting an anxious child is knowing when to help and when to let them struggle.

**When to step in:**
- Physical safety is at risk
- They''re in shutdown mode (freeze response)
- They''re asking for help (verbally or non-verbally)
- The situation is beyond their developmental capacity
- They''re completely overwhelmed

**When to step back:**
- They''re managing (even if it''s hard)
- They''ve said they want to try themselves
- The discomfort is growth, not harm
- You''re about to rescue out of your own anxiety

**The question to ask yourself:**
"Am I helping them, or am I helping my own discomfort with their discomfort?"

**The balance:**
Too much stepping in = learned helplessness
Too much stepping back = abandonment

**How to find the middle:**
- Offer support without taking over: "Do you want help, or do you want to try first?"
- Scaffold: "I''ll start, you finish"
- Stay near: "I''m here if you need me"
- Narrate their capability: "This is hard, and I believe you can do it"

**For younger children:**
More stepping in (they need co-regulation)

**For older children:**
More stepping back (but stay emotionally close)

**The goal:**
Raise a child who knows:
- I can do hard things
- I don''t have to do them alone

Step in with love. Step back with trust. Your presence is the constant.', 'text', 6);

  -- Insert Course 5: Understanding Yourself
  INSERT INTO modules (title, description, icon, category, order_index) VALUES
  ('Understanding Yourself as a Carer', 'Develop self-awareness and self-compassion to support your child better', '🌱', 'carer-self-understanding', 5);
  
  SELECT id INTO course5_id FROM modules WHERE category = 'carer-self-understanding' LIMIT 1;
  
  -- Course 5 Lessons
  INSERT INTO module_lessons (module_id, title, content, content_type, order_index) VALUES
  (course5_id, 'Your Triggers + Why They Matter', 'Your child''s anxiety will trigger your own nervous system. Understanding your triggers helps you respond instead of react.

**Common carer triggers:**
- Your child''s big emotions (because you feel helpless)
- Their anxiety (because it reminds you of your own)
- Their resistance (because it feels like failure)
- Their meltdowns (because you feel judged or overwhelmed)

**Why this matters:**
When you''re triggered, your nervous system goes into threat mode. You can''t co-regulate from that state. You''ll either over-control or withdraw.

**How to identify your triggers:**
Ask yourself:
- When do I feel most reactive?
- What specific behaviors push my buttons?
- What am I really afraid of in those moments?

**Common fears underneath:**
- "I''m failing as a parent"
- "They''ll never be okay"
- "I can''t handle this"
- "People will think I''m a bad parent"

**What to do:**
1. Notice the trigger
2. Name it: "I''m feeling activated"
3. Pause (even 10 seconds)
4. Breathe
5. Respond, don''t react

**The goal isn''t to stop having triggers — it''s to notice them so they don''t run the show.**

When you understand your triggers, you break the cycle. You become the calm your child needs.', 'text', 1),
  
  (course5_id, 'Nervous System Co-Regulation for Adults', 'You can''t regulate your child from a dysregulated state. Here''s how to regulate yourself.

**Signs you''re dysregulated:**
- Racing thoughts
- Tightness in chest or jaw
- Short temper or irritability
- Feeling overwhelmed or shut down
- Difficulty thinking clearly

**Quick regulation tools for adults:**
- **Breathe:** 4 counts in, 6 counts out (longer exhale calms the system)
- **Move:** Shake your hands, stretch, walk around
- **Splash cold water on your face** (interrupts the stress response)
- **Place hand on heart:** Gentle pressure signals safety
- **Say it out loud:** "I''m feeling activated. I need a moment"

**Longer-term regulation:**
- Sleep (non-negotiable)
- Movement (walk, yoga, dance)
- Connection with others (not isolation)
- Nature (even 5 minutes outside helps)
- Boundaries (protect your energy)

**Co-regulating with another adult:**
If you have a partner or friend, practice:
- Sitting together in silence
- Breathing together
- Talking about how you feel (not problem-solving, just being heard)

**The oxygen mask principle:**
You can''t pour from an empty cup. Regulating yourself isn''t selfish — it''s essential.

When you''re regulated, you can hold space for your child''s big emotions without drowning in them. That''s the gift.', 'text', 2),
  
  (course5_id, 'When You Feel Overwhelmed', 'Parenting an anxious child is hard. There will be moments when you feel like you can''t cope. That''s normal.

**What overwhelm looks like:**
- Everything feels like too much
- You want to shut down or escape
- You''re snapping at everyone
- You feel guilty constantly
- You''re exhausted but can''t rest

**What to do in the moment:**
1. **Pause:** Say "I need a minute" and step away if safe
2. **Breathe:** Even one deep breath helps
3. **Ground yourself:** Press your feet into the floor, notice what you can see
4. **Self-compassion:** "This is really hard. I''m doing my best."

**What to do when the dust settles:**
- **Talk to someone:** Friend, partner, GP, therapist
- **Lower the bar:** What can you let go of today?
- **Rest:** Even 10 minutes of sitting quietly counts
- **Ask for help:** You don''t have to do this alone

**When to seek support:**
If you''re feeling:
- Persistently hopeless or despairing
- Unable to cope most days
- Resentful toward your child
- Like you might harm yourself or others

**Reach out to:**
- Your GP (they can refer to counseling or support)
- Local NHS mental health services
- Parenting support organizations (e.g., Family Lives, Young Minds parent helpline)
- School (SENCO or pastoral support)

**Remember:**
Asking for help isn''t failing. It''s the bravest thing you can do. You matter too.', 'text', 3),
  
  (course5_id, 'Self-Compassion for Parents', 'You will make mistakes. You will lose your temper. You will feel like you''re failing. And you''re still a good parent.

**What self-compassion is NOT:**
- Excusing poor behavior
- Letting yourself off the hook
- Ignoring your impact

**What self-compassion IS:**
- Acknowledging you''re human
- Speaking to yourself like you''d speak to a friend
- Recognizing that parenting is hard
- Forgiving yourself and trying again

**The self-compassion pause:**
When you mess up, try this:
1. Notice: "I just shouted. That wasn''t okay."
2. Acknowledge: "I was overwhelmed. That makes sense."
3. Self-kindness: "I''m doing my best. I can repair this."
4. Action: Repair with your child

**Common harsh self-talk:**
- "I''m a terrible parent"
- "I''m ruining my child"
- "I should be better than this"
- "Everyone else manages except me"

**Compassionate reframe:**
- "I''m learning as I go"
- "I''m doing the best I can with what I know"
- "Mistakes don''t make me a bad parent"
- "Other parents struggle too — I''m not alone"

**Why this matters:**
When you beat yourself up, your nervous system stays in threat mode. You can''t co-regulate from shame.

Self-compassion isn''t indulgent — it''s essential. You need kindness too.', 'text', 4),
  
  (course5_id, 'How to Stay Regulated During a Child Meltdown', 'This is the hardest moment — when your child is in full meltdown and you''re holding on by a thread.

**What''s happening in their body:**
Their thinking brain is offline. They''re in pure survival mode. Nothing you say will land until their nervous system calms.

**What''s happening in your body:**
Your nervous system is mirroring theirs. You might feel panic, anger, helplessness, or the urge to shut down.

**How to stay regulated:**
1. **Breathe first:** Slow your breathing before you do anything else
2. **Anchor yourself:** Feel your feet on the floor
3. **Remind yourself:** "This isn''t an emergency. This will pass."
4. **Lower your voice:** The quieter you get, the calmer they feel
5. **Stay close (if safe):** Your presence is the anchor

**What NOT to do:**
- Raise your voice (escalates their nervous system)
- Reason with them (they can''t hear you yet)
- Walk away in frustration (abandonment fuels panic)
- Take it personally (this isn''t about you)

**What TO do:**
- Stay present
- Keep your body language open
- Say simple things: "I''m here. You''re safe."
- Wait for the storm to pass

**After the meltdown:**
- Reconnect before correcting
- Validate: "That was really big. You got through it."
- Repair if you lost it too: "I got loud. I''m sorry."

**Remember:**
You don''t have to be perfect. You just have to be present. That''s enough.', 'text', 5),
  
  (course5_id, 'Knowing When External Support Is Needed', 'Sometimes your love and support aren''t enough — and that''s okay. Here''s how to know when to seek professional help.

**Signs your child might need extra support:**
- Anxiety is interfering with daily life (school, sleep, eating, friendships)
- They''re expressing thoughts of self-harm or hopelessness
- You''ve tried strategies for months with no improvement
- Their anxiety is getting worse, not better
- They''re having frequent panic attacks
- They''re withdrawing completely from activities they used to enjoy

**Signs YOU might need support:**
- You''re feeling overwhelmed most of the time
- You''re not coping with your own emotions
- You''re feeling resentful or burnt out
- You need guidance beyond what you can find yourself

**Where to start:**
1. **Your GP:** First port of call for referrals
2. **School SENCO or pastoral team:** They can access local services
3. **CAMHS (Child and Adolescent Mental Health Services):** NHS mental health support for children
4. **Charities:** YoungMinds, Anxiety UK, Mind, Family Lives

**What to say to your GP:**
"My child is struggling with anxiety. It''s affecting [specific areas]. We''ve tried [what you''ve done]. I''d like to explore what support is available."

**What support might look like:**
- CBT (Cognitive Behavioral Therapy)
- Family therapy
- Play therapy
- Parenting support groups
- Medication (in some cases, with specialist guidance)

**Remember:**
Seeking help isn''t giving up. It''s giving your child access to tools beyond what you can provide alone. You''re still their most important support — but you don''t have to be their only one.

You''re allowed to need help. That''s wisdom, not weakness.', 'text', 6);
END $$;
