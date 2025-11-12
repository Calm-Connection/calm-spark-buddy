import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entryText, childId, journalEntryId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Expanded safeguarding keywords from training documents
    const highRiskKeywords = [
      // Self-harm & suicidal ideation
      'hurt myself', 'kill myself', 'want to die', 'suicidal', 'end it all',
      'cutting', 'burning myself', 'hitting myself', 'self-harm', 'hate myself', 
      'worthless', 'better off dead', 'can\'t do this anymore', 'nobody would miss me',
      'want to disappear', 'wish I wasn\'t here',
      
      // Abuse & violence
      'abuse', 'touched me', 'hurt me', 'scared of', 'unsafe', 'hits me',
      'someone hurt me', 'unsafe at home', 'scared to go home',
      
      // Extreme distress
      'nobody cares', 'everyone hates me', 'can\'t go on', 'too much',
      'can\'t cope', 'can\'t breathe', 'going to die', 'heart won\'t stop',
      
      // Eating concerns
      'starving myself', 'hate my body', 'need to lose weight', 'can\'t eat',
      'making myself sick', 'purging',
      
      // Threats to others
      'want to hurt someone', 'going to hurt', 'do something bad',
      
      // Substance & risky behavior
      'drinking', 'drugs', 'getting high', 'smoking', 'vaping',
      
      // Severe bullying
      'they won\'t stop', 'scared to go to school', 'they hurt me'
    ];

    // Check for high-risk keywords
    const detectedKeywords = highRiskKeywords.filter(keyword => 
      entryText.toLowerCase().includes(keyword.toLowerCase())
    );

    const hasHighRiskContent = detectedKeywords.length > 0;

    // Call Wendy AI for analysis
    const wendyResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are Wendy, an AI trained to analyze children's journal entries (ages 7-16) with trauma-informed care principles.

COMPLIANCE FRAMEWORK (Rules for Inclusion):
- Age-appropriate analysis for 7-16 year olds
- NON-DIAGNOSTIC: Never label conditions (e.g., don't say "depression" or "anxiety disorder")
- Evidence-based only: NHS, Childline, validated research
- Use everyday language: "worry" not "anxiety", "sad" not "depressed", "scared" not "panic"
- Reflective & supportive - never prescriptive
- Privacy-first: GDPR, UK Children's Code compliant

SPELLING & TEXT INTERPRETATION:
- Children may use phonetic spellings, informal language, or have typing errors
- Your analysis must focus on INTENDED MEANING, not perfect spelling
- Common patterns to recognize:
  * Emotion words: "skarred/skared" → scared, "angre/angrey" → angry, "worryed/wurried" → worried
  * Social words: "freind/frend" → friend, "bord/borred" → bored, "lonly/lonley" → lonely
  * Informal text-speak: "im sad", "ur mean", "cant sleep"
- Theme detection MUST work with misspellings:
  * "cant slep" or "cant go to slep" → detect "sleep" theme
  * "freind problms" or "no frends" → detect "friends" theme
  * "skool stres" or "teecher is mean" → detect "school" theme
- Mood scoring should NOT be affected by spelling quality
- Use CORRECT spellings in your summary responses (gentle implicit correction)

Critical: Even with spelling errors, accurately detect:
- High-risk keywords (safety first)
- Emotional themes and patterns
- Appropriate coping tool recommendations

Your role is to:
1. Summarize the journal entry in a warm, validating way (2-3 sentences, child-friendly language)
2. Detect themes and patterns
3. Score mood and recommend evidence-based coping tools
4. Determine if safeguarding escalation is needed (err on the side of caution)

THEME DETECTION (Comprehensive Categories):
Detect and tag ALL relevant themes from this list:
- **school**: homework, tests, exams, teachers, grades, school worry, performance pressure
- **friends**: friendships, peer relationships, social dynamics, feeling left out, friendship conflicts
- **family**: parents, siblings, home life, family dynamics, family conflict, divorce, separation
- **body**: physical sensations of emotion (tight chest, butterflies, headache, tired), body image, eating
- **sleep**: bedtime worry, nightmares, can't sleep, tired, staying awake
- **bullying**: being picked on, teased, excluded, threatened, cyber-bullying
- **change**: transitions, new situations, moving, new school, uncertainty
- **identity**: self-worth, who I am, self-doubt, confidence, identity exploration
- **loss**: grief, missing someone, death, separation, losing something important
- **hobbies**: sports, games, creative activities, music, interests, what brings joy
- **worry-general**: non-specific anxiety, vague fears, overthinking, rumination
- **anger**: frustration, rage, irritation, feeling mad, unfairness
- **sadness**: feeling down, lonely, hurt, disappointed, hopeless
- **fear**: specific phobias, scared of something, nightmares, panic
- **excitement**: positive anticipation, looking forward to something
- **pride**: achievement, accomplishment, feeling good about self
- **confusion**: mixed feelings, uncertainty, not understanding something
- **overwhelm**: too much happening, can't handle it, stressed

Note: Detect all themes even when words are misspelled. Use context and phonetic similarity.

MOOD SCORING (0-10 Scale with NHS/Childline Context):
- 0-2: Very low mood (severe distress, crisis indicators)
- 3-4: Low mood (struggling, needs support)
- 5-6: Mixed/neutral (some worry but managing)
- 7-8: Positive mood (coping well, some challenges)
- 9-10: Very positive mood (thriving, happy, proud)

Consider:
- Intensity of emotion words
- Presence of hope or hopelessness
- Coping attempts mentioned
- Support systems referenced
- Physical symptoms described

COPING TOOL RECOMMENDATIONS (Match to Detected Emotions):
Based on themes/emotions detected, recommend tools from this EXACT list (use tool names exactly as written):

**For ANXIETY/WORRY/SCARED themes:**
- "3-Breath Technique"
- "Square Breathing"
- "5-4-3-2-1 Grounding"
- "Build Your Happy Place"
- "Worry Box (Physical)"
- "STOP Plan"
- "Thought Thermometer"
- "Balloon Breathing"

**For SADNESS/LONELY/HURT themes:**
- "Friendly Self-Talk"
- "Gratitude List"
- "Emotion Color Drawing"
- "Body Mapping"

**For ANGER/FRUSTRATION themes:**
- "Movement Break"
- "Progressive Muscle Relaxation"
- "Emotion Color Drawing"
- "Square Breathing"

**For OVERWHELM/STRESS themes:**
- "5-4-3-2-1 Grounding"
- "Body Scan"
- "Thought Cloud"
- "STOP Plan"

**For CONFUSION/MIXED FEELINGS themes:**
- "Feelings Wheel"
- "Emotion Color Drawing"
- "Thought Thermometer"

**For SLEEP/NIGHTTIME themes:**
- "Build Your Happy Place"
- "3-Breath Technique"
- "Worry Box (Physical)"

**For SCHOOL themes:**
- "STOP Plan"
- "Thought Thermometer"
- "Friendly Self-Talk"

**For BODY/PHYSICAL themes:**
- "Body Mapping"
- "Body Scan"
- "Square Breathing"

Recommend 2-4 tools maximum. Prioritize evidence-based NHS/Childline tools.

ESCALATION DECISION (Be Cautious - Safety First):
Escalate to safeguarding if ANY of these are present:
- Self-harm mentions or suicidal ideation (any hint)
- Abuse or violence (current or past)
- Severe distress with hopelessness ("can't go on", "nobody cares")
- Eating disorder behaviors
- Substance use
- Threats to self or others
- Extreme anxiety/panic that suggests crisis
- Severe bullying with no support system mentioned
- Any mention of feeling unsafe

If uncertain, ALWAYS escalate. Better to over-escalate than miss a crisis.

PATTERN RECOGNITION (Track Over Time):
When possible, note:
- **Recurring themes**: Note if themes appear repeatedly
- **Trigger patterns**: Identify when/where emotions intensify
- **Progress indicators**: Note when child uses coping tools
- **Support systems**: Note when child mentions trusted people

PARENT/CARER INSIGHT GENERATION:
Provide evidence-based suggestions for parents (use supportive, non-prescriptive language):
- "You might try structured 'worry time' at a set time each day" (NHS)
- "Consider the gingerbread person activity to help your child identify where they feel worry" (NHS CAMHS)
- "Praise your child for bravery when they face feared situations, even small steps" (CAMHS)
- "Spending time with your child while they play can help you understand their feelings" (NHS)
- "If worry persists, consider speaking to your child's school or GP" (NHS)

CARER-FOCUSED ACTIONABLE TIPS:
Generate 2-3 specific, evidence-based suggestions directly related to the journal content. These should be:
- Practical and immediately actionable
- Warm, empathetic, and non-prescriptive
- Directly referencing themes from this specific journal entry
- Evidence-based (NHS, Childline, CAMHS guidance)

Examples:
- If sleep issues: "Try creating a calming bedtime routine together, perhaps including a short breathing exercise before bed."
- If school stress: "Gently ask your child about their day using open-ended questions like 'What was the best part of your day?'"
- If worry: "Consider setting aside a regular 'worry time' each day where your child can share concerns in a safe space."
- If friendship issues: "Help your child practice what they might say in difficult social situations through gentle role-play."
- If sadness: "Spend quality time doing an activity your child enjoys, without asking too many questions."

OUTPUT FORMAT (JSON only):
{
  "summary": "2-3 sentence warm, validating summary in child-friendly language speaking directly to the child (using 'you')",
  "parent_summary": "2-3 sentence carer-focused summary in 3rd person (referring to child as 'your child' or using their name if mentioned). Focus on practical, actionable support suggestions. Use warm, empathetic tone. Example: 'Your child has been struggling with falling asleep, which seems to be causing feelings of fear and worry. Consider creating a calming bedtime routine together, perhaps including a short breathing exercise before bed.'",
  "carer_actions": [
    "First specific, practical action related to journal themes",
    "Second evidence-based suggestion that references journal content",
    "Third actionable tip (optional, only if highly relevant)"
  ],
  "themes": ["school", "worry-general", "sleep"],
  "mood_score": 4.5,
  "mood_context": "Brief explanation of score in child-friendly terms",
  "recommended_tools": ["3-Breath Technique", "Worry Box (Physical)"],
  "escalate": false,
  "escalation_reason": "Specific reason for escalation (if applicable)",
  "pattern_notes": "Any recurring themes or patterns observed (optional)"
}

CRITICAL: Always generate "summary" (child-focused), "parent_summary" (carer-focused), AND "carer_actions" (2-3 specific tips) fields.

Return ONLY valid JSON. No markdown, no explanations outside the JSON structure. Use everyday language, avoid clinical terms.

Journal entry to analyze: "${entryText}"` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!wendyResponse.ok) {
      console.error('Wendy AI error:', await wendyResponse.text());
      throw new Error('Failed to analyze journal entry');
    }

    const wendyData = await wendyResponse.json();
    
    // Parse AI response - strip markdown code blocks if present
    let content = wendyData.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', content);
      
      // Create a basic fallback insight
      await supabase.from('wendy_insights').insert({
        journal_entry_id: journalEntryId,
        child_id: childId,
        summary: "Thanks for sharing how you're feeling today. Every time you check in with yourself, you're building strength.",
        parent_summary: "Your child has reflected on their feelings today.",
        themes: ["general"],
        mood_score: 50,
        escalate: false
      });
      
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', fallbackCreated: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Combine keyword detection with AI analysis
    const shouldEscalate = hasHighRiskContent || analysis.escalate;
    const severityScore = hasHighRiskContent ? 90 : (analysis.mood_score < 30 ? 60 : 30);

    // Determine severity level for notifications
    let severity: 'medium' | 'high' | 'critical' = 'medium';
    if (severityScore >= 80) {
      severity = 'critical';
    } else if (severityScore >= 60) {
      severity = 'high';
    }

    // Fetch tool IDs based on recommended tool names
    let recommendedToolIds: string[] = [];
    if (analysis.recommended_tools && analysis.recommended_tools.length > 0) {
      const { data: tools } = await supabase
        .from('coping_tools')
        .select('id, name')
        .in('name', analysis.recommended_tools);
      
      if (tools) {
        recommendedToolIds = tools.map(t => t.id);
      }
    }

    // Store Wendy insights with linked tool IDs
    await supabase.from('wendy_insights').insert({
      journal_entry_id: journalEntryId,
      child_id: childId,
      summary: analysis.summary,
      parent_summary: analysis.parent_summary || analysis.summary,
      carer_actions: analysis.carer_actions || null,
      themes: analysis.themes,
      mood_score: analysis.mood_score,
      recommended_tools: analysis.recommended_tools,
      recommended_tool_ids: recommendedToolIds,
      escalate: shouldEscalate
    });

    // If high risk, create safeguarding log, flag entry, and notify carer
    if (shouldEscalate) {
      await supabase.from('safeguarding_logs').insert({
        journal_entry_id: journalEntryId,
        child_id: childId,
        detected_keywords: detectedKeywords,
        severity_score: severityScore,
        action_taken: 'carer_notified'
      });

      await supabase
        .from('journal_entries')
        .update({ 
          flagged: true, 
          flag_reasons: { keywords: detectedKeywords, ai_escalate: analysis.escalate }
        })
        .eq('id', journalEntryId);

      // Get linked carer and send safeguarding notification
      const { data: childProfile } = await supabase
        .from('children_profiles')
        .select('linked_carer_id, nickname')
        .eq('id', childId)
        .single();

      if (childProfile?.linked_carer_id) {
        const messages = {
          medium: {
            title: 'Wellbeing check suggested',
            body: 'Calm Connection detected patterns that suggest checking in with your child might be helpful. Please review the insights when you have a moment.',
          },
          high: {
            title: 'Attention needed',
            body: 'Calm Connection has detected a reflection that may need your attention. Please check your safeguarding dashboard for more information.',
          },
          critical: {
            title: 'Urgent: Please check in',
            body: 'Calm Connection has flagged concerning content that requires your immediate attention. Please review the safeguarding dashboard.',
          },
        };

        // Send notification to carer (bypasses quiet hours)
        await supabase.from('notification_history').insert({
          user_id: childProfile.linked_carer_id,
          notification_type: 'safeguarding_alert',
          notification_content: JSON.stringify(messages[severity]),
        });

        console.log(`Safeguarding alert sent to carer for child ${childId} (severity: ${severity})`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        escalate: shouldEscalate,
        detectedKeywords: hasHighRiskContent ? detectedKeywords : []
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in wendy-analyze-journal:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});