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

    // High-risk keywords for safeguarding
    const highRiskKeywords = [
      'want to die', 'hurt myself', 'kill myself', 'they hit me', 'abuse', 
      'I will hurt', 'no one cares', "can't go on", 'suicide', 'self harm',
      'cut myself', 'end it all', 'better off dead'
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
            content: `You are Wendy, a gentle, trauma-informed, non-therapeutic guide for children. 
            Use calm, reassuring language. Never encourage self-harm. If content is high-risk, recommend helplines.
            Respond with JSON only: {
              "summary": "1-2 sentence child-facing summary",
              "themes": ["keyword1", "keyword2"],
              "mood_score": 0-100,
              "recommended_tools": ["breathing", "meditation", "drawing"],
              "escalate": boolean
            }` 
          },
          { role: 'user', content: entryText }
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

    // Store Wendy insights
    await supabase.from('wendy_insights').insert({
      journal_entry_id: journalEntryId,
      child_id: childId,
      summary: analysis.summary,
      themes: analysis.themes,
      mood_score: analysis.mood_score,
      recommended_tools: analysis.recommended_tools,
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