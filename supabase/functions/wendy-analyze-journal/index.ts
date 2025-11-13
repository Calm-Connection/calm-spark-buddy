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

    const highRiskKeywords = [
      'hurt myself', 'kill myself', 'want to die', 'suicidal', 'end it all',
      'cutting', 'burning myself', 'hitting myself', 'self-harm', 'hate myself', 
      'worthless', 'better off dead', 'can\'t do this anymore', 'nobody would miss me',
      'want to disappear', 'wish I wasn\'t here', 'abuse', 'touched me', 'hurt me', 
      'scared of', 'unsafe', 'hits me', 'someone hurt me', 'unsafe at home', 
      'scared to go home', 'nobody cares', 'everyone hates me', 'can\'t go on', 
      'too much', 'can\'t cope', 'can\'t breathe', 'going to die', 'heart won\'t stop',
      'starving myself', 'hate my body', 'need to lose weight', 'can\'t eat',
      'making myself sick', 'purging', 'want to hurt someone', 'going to hurt', 
      'do something bad', 'drinking', 'drugs', 'getting high', 'smoking', 'vaping',
      'they won\'t stop', 'scared to go to school', 'they hurt me'
    ];

    const detectedKeywords = highRiskKeywords.filter(keyword => 
      entryText.toLowerCase().includes(keyword.toLowerCase())
    );
    const hasHighRiskContent = detectedKeywords.length > 0;

    // PHASE 1: Query historical context
    console.log('Querying historical context for child:', childId);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: recentEntries } = await supabase
      .from('journal_entries')
      .select('entry_text, mood_tag, created_at')
      .eq('child_id', childId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .neq('id', journalEntryId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: recentMoods } = await supabase
      .from('mood_check_ins')
      .select('mood_type, mood_emoji, intensity, created_at')
      .eq('child_id', childId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: protectiveFactors } = await supabase
      .from('protective_factors')
      .select('factor_type, description, effectiveness_score, created_at')
      .eq('child_id', childId)
      .gte('created_at', fourteenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: toolUsage } = await supabase
      .from('tool_usage')
      .select('tool_name, completed, duration_minutes, created_at')
      .eq('user_id', childId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(15);

    const { data: activePatterns } = await supabase
      .from('safeguarding_patterns')
      .select('pattern_type, detected_themes, severity_trend, entry_count, first_detected_at')
      .eq('child_id', childId)
      .eq('status', 'active')
      .order('last_updated_at', { ascending: false });

    const historicalContext = {
      recentEntries: recentEntries || [],
      recentMoods: recentMoods || [],
      protectiveFactors: protectiveFactors || [],
      toolUsage: toolUsage || [],
      activePatterns: activePatterns || [],
      hasHistory: (recentEntries?.length || 0) > 0
    };

    console.log('Historical context:', {
      entriesCount: historicalContext.recentEntries.length,
      moodsCount: historicalContext.recentMoods.length,
      protectiveFactorsCount: historicalContext.protectiveFactors.length,
      toolUsageCount: historicalContext.toolUsage.length,
      activePatternsCount: historicalContext.activePatterns.length
    });

    // Build system prompt with context
    let contextSection = '';
    if (historicalContext.hasHistory) {
      contextSection = `\n\nHISTORICAL CONTEXT:\nRecent entries: ${historicalContext.recentEntries.length}\nRecent moods: ${historicalContext.recentMoods.length}\nProtective factors: ${historicalContext.protectiveFactors.length}\nTool usage: ${historicalContext.toolUsage.length}\nActive patterns: ${historicalContext.activePatterns.length}\n\nConsider whether this is a new or recurring concern, if mood is improving/stable/declining, and if support systems are present.`;
    }

    const systemPrompt = `You are Wendy, analyzing children's journal entries (ages 7-16). Age-appropriate, non-diagnostic, evidence-based.${contextSection}\n\nDetect themes, score mood 0-10, recommend tools, determine if escalation needed. Respond with valid JSON: {"summary":"...", "themes":[], "mood_score":0-10, "recommended_tools":[], "escalate":true/false, "escalation_reason":"..."}`;

    const wendyResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze: "${entryText}"` }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const wendyData = await wendyResponse.json();
    const wendyContent = wendyData.choices[0]?.message?.content;

    let analysis;
    try {
      const jsonMatch = wendyContent.match(/```json\n?([\s\S]*?)\n?```/) || wendyContent.match(/({[\s\S]*})/);
      analysis = JSON.parse((jsonMatch ? jsonMatch[1] : wendyContent).trim());
    } catch {
      analysis = {
        summary: "Thank you for sharing.",
        themes: ["general"],
        mood_score: 5,
        recommended_tools: ["Breathing Space"],
        escalate: hasHighRiskContent,
        escalation_reason: hasHighRiskContent ? "High-risk keywords detected" : null
      };
    }

    const shouldEscalate = hasHighRiskContent || analysis.escalate;
    const escalationReason = hasHighRiskContent 
      ? `Keywords: ${detectedKeywords.join(', ')}. ${analysis.escalation_reason || ''}`
      : analysis.escalation_reason;

    const { data: copingTools } = await supabase
      .from('coping_tools')
      .select('id, name')
      .in('name', analysis.recommended_tools || []);

    const { data: insertedInsight } = await supabase
      .from('wendy_insights')
      .insert({
        child_id: childId,
        journal_entry_id: journalEntryId,
        summary: analysis.summary,
        themes: analysis.themes,
        mood_score: analysis.mood_score,
        recommended_tools: analysis.recommended_tools,
        recommended_tool_ids: copingTools?.map(t => t.id) || [],
        escalate: shouldEscalate,
        parent_summary: shouldEscalate ? `Concerning content detected. ${escalationReason}` : null
      })
      .select()
      .single();

    if (shouldEscalate) {
      await supabase.from('safeguarding_logs').insert({
        child_id: childId,
        journal_entry_id: journalEntryId,
        detected_keywords: detectedKeywords,
        severity_score: 10 - (analysis.mood_score || 5),
        action_taken: 'Carer notified',
        escalation_tier: 4,
        protective_factors_present: historicalContext.protectiveFactors,
        historical_context: {
          recentEntriesCount: historicalContext.recentEntries.length,
          recentMoodsCount: historicalContext.recentMoods.length,
          toolUsageCount: historicalContext.toolUsage.length
        }
      });

      await supabase.from('journal_entries').update({ 
        flagged: true,
        flag_reasons: { keywords: detectedKeywords, ai_reason: escalationReason }
      }).eq('id', journalEntryId);

      const { data: childProfile } = await supabase
        .from('children_profiles')
        .select('linked_carer_id')
        .eq('id', childId)
        .single();

      if (childProfile?.linked_carer_id) {
        await supabase.from('notification_history').insert({
          user_id: childProfile.linked_carer_id,
          notification_type: 'safeguarding_alert',
          notification_content: JSON.stringify({
            title: 'Wellbeing Alert',
            body: 'Your child\'s recent journal entry may need your attention.'
          })
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: {
        summary: analysis.summary,
        themes: analysis.themes,
        mood_score: analysis.mood_score,
        recommended_tools: analysis.recommended_tools,
        recommended_tool_ids: copingTools?.map(t => t.id) || [],
        escalated: shouldEscalate
      },
      insight_id: insertedInsight?.id
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});