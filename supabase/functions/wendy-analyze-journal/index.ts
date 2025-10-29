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
      // Self-harm and suicidal ideation
      'hurt myself', 'kill myself', 'want to die', 'suicide', 'suicidal', 'end it all',
      'cutting', 'self harm', 'self-harm', 'burning myself', 'hitting myself',
      'hate myself', 'worthless', 'better off dead', 'no point living',
      
      // Abuse and safety concerns
      'abuse', 'abused', 'molest', 'touched me', 'hurt me', 'hits me', 'beats me',
      'scared of him', 'scared of her', 'not safe at home', 'unsafe',
      'secret touching', 'makes me do things',
      
      // Severe distress
      'can\'t go on', 'give up', 'no hope', 'hopeless', 'everything is pointless',
      'nobody cares', 'better without me'
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
            content: `You are Wendy, analyzing a journal entry from a child aged 7-16 to provide supportive, trauma-informed emotional insights.

ANALYSIS FRAMEWORK:

1. SUMMARY (2-3 sentences):
   - Start with validation: "It sounds like..." or "I hear that..."
   - Name the core emotion(s) with empathy
   - Acknowledge what matters to them
   - Use warm, age-appropriate language
   - Example: "It sounds like today felt really overwhelming with so much going on. I hear that you're worried about the test and feeling stressed. You're working really hard."

2. THEMES (Categorize into these areas):
   - school (tests, homework, pressure, teachers, performance)
   - friends (belonging, conflict, loneliness, social worry, peer pressure)
   - family (relationships, changes, expectations, home life)
   - self-esteem (confidence, self-worth, body image, identity)
   - emotions (managing feelings, emotional regulation)
   - change (transitions, uncertainty, new situations)
   - achievement (success, failure, goals, expectations)
   - safety (feeling safe, trust, boundaries)
   
   Return 1-3 most relevant themes.

3. MOOD SCORE (0-10 calibration):
   - 0-2: Severe distress, crisis language, hopelessness, self-harm thoughts
   - 3-4: Significant negative emotions, struggling, feeling overwhelmed
   - 5-6: Mixed feelings, some challenges but also some okay moments
   - 7-8: Mostly positive with minor worries or neutral with calm
   - 9-10: Very happy, excited, proud, peaceful, content
   
   Consider: intensity of language, ratio of negative to positive, presence of hope/coping

4. RECOMMENDED TOOLS (Match tools to emotions detected):
   
   IF anxiety/worry/nervous detected → Suggest:
   - "Balloon Breathing"
   - "5-4-3-2-1 Grounding"
   - "Safe Place Visualization"
   - "Worry Box"
   
   IF sadness/lonely/hurt detected → Suggest:
   - "Friendly Self-Talk"
   - "Gratitude List"
   - "Emotion Color Drawing"
   
   IF anger/frustration/annoyed detected → Suggest:
   - "Movement Break"
   - "Progressive Muscle Relaxation"
   - "Emotion Color Drawing"
   
   IF overwhelmed/stressed detected → Suggest:
   - "5-4-3-2-1 Grounding"
   - "Body Scan"
   - "Thought Cloud"
   
   IF confused/uncertain detected → Suggest:
   - "Feelings Wheel"
   - "Emotion Color Drawing"
   
   IF happy/proud detected → Suggest:
   - "Gratitude List"
   
   Return 2-3 most relevant tool names (exact names from list).

5. ESCALATION DECISION (Set to true if ANY of these present):
   - Explicit mentions of self-harm, suicide, or wanting to die
   - Mentions of abuse (physical, sexual, emotional)
   - Immediate safety concerns
   - Severe hopelessness with no coping mechanisms mentioned
   
   Note: Strong emotions alone (anger, sadness, worry) do NOT require escalation unless combined with safety risks.
   
   If unsure and detecting concerning patterns: err on side of caution and escalate.

Respond with valid JSON only in this exact format:
{
  "summary": "Warm, validating summary here",
  "themes": ["theme1", "theme2"],
  "mood_score": 7,
  "recommended_tools": ["Tool Name 1", "Tool Name 2"],
  "escalate": false
}

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
    const analysis = JSON.parse(wendyData.choices[0].message.content);

    // Combine keyword detection with AI analysis
    const shouldEscalate = hasHighRiskContent || analysis.escalate;
    const severityScore = hasHighRiskContent ? 90 : (analysis.mood_score < 30 ? 60 : 30);

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
      themes: analysis.themes,
      mood_score: analysis.mood_score,
      recommended_tools: analysis.recommended_tools,
      recommended_tool_ids: recommendedToolIds,
      escalate: shouldEscalate
    });

    // If high risk, create safeguarding log and flag entry
    if (shouldEscalate) {
      await supabase.from('safeguarding_logs').insert({
        journal_entry_id: journalEntryId,
        child_id: childId,
        detected_keywords: detectedKeywords,
        severity_score: severityScore,
        action_taken: 'auto_modal_shown'
      });

      await supabase
        .from('journal_entries')
        .update({ 
          flagged: true, 
          flag_reasons: { keywords: detectedKeywords, ai_escalate: analysis.escalate }
        })
        .eq('id', journalEntryId);
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