import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PHASE 2: 4-Tier Escalation System
interface EscalationDecision {
  tier: 1 | 2 | 3 | 4;
  reason: string;
  childMessage: string;
  carerMessage: string | null;
  suggestedAction: string;
  bypassQuietHours: boolean;
}

function determineEscalationTier(
  hasHighRiskKeywords: boolean,
  detectedKeywords: string[],
  analysis: any,
  historicalContext: any
): EscalationDecision {
  
  // TIER 4: Critical - Immediate escalation
  if (hasHighRiskKeywords || (analysis.escalate && analysis.mood_score <= 3)) {
    return {
      tier: 4,
      reason: hasHighRiskKeywords 
        ? `High-risk keywords detected: ${detectedKeywords.join(', ')}`
        : `Severe distress with very low mood (${analysis.mood_score}/10)`,
      childMessage: "You're not alone. Let's make sure you have support right now.",
      carerMessage: "Immediate attention needed. Please review the safeguarding dashboard.",
      suggestedAction: "Review immediately and consider reaching out to child",
      bypassQuietHours: true
    };
  }

  // Check for declining trajectory
  const hasActiveDecliningPattern = historicalContext.activePatterns?.some(
    (p: any) => p.severity_trend === 'declining'
  );
  
  const recentMoodScores = historicalContext.recentMoods
    ?.map((m: any) => m.intensity)
    .filter((i: any) => i !== null) || [];
  
  const averageRecentMood = recentMoodScores.length > 0
    ? recentMoodScores.reduce((a: number, b: number) => a + b, 0) / recentMoodScores.length
    : null;

  // TIER 3: Check-in prompt - Declining pattern or moderate distress
  if (
    (hasActiveDecliningPattern && analysis.mood_score < 5) ||
    (analysis.escalate && analysis.mood_score <= 5) ||
    (averageRecentMood && averageRecentMood < 5 && analysis.mood_score < 5) ||
    (historicalContext.recentEntries.length >= 3 && analysis.themes?.some((t: string) => 
      ['sadness', 'worry-general', 'overwhelm', 'sleep'].includes(t)
    ))
  ) {
    return {
      tier: 3,
      reason: hasActiveDecliningPattern
        ? "Declining emotional pattern detected over time"
        : `Moderate distress: mood ${analysis.mood_score}/10, recurring concerns`,
      childMessage: "It sounds like things have been tough lately. Would you like to share this with your grown-up?",
      carerMessage: "A gentle check-in with your child might be helpful.",
      suggestedAction: "Schedule a casual conversation with your child",
      bypassQuietHours: false
    };
  }

  // Check if child is actively using tools and has protective factors
  const hasProtectiveFactors = (historicalContext.protectiveFactors?.length || 0) > 0;
  const hasRecentToolUsage = (historicalContext.toolUsage?.length || 0) > 0;

  // TIER 2: Tool suggestion - Moderate concern, suggest coping tools
  if (
    analysis.mood_score < 6 ||
    analysis.themes?.some((t: string) => 
      ['anger', 'frustration', 'loneliness', 'fear'].includes(t)
    )
  ) {
    return {
      tier: 2,
      reason: `Moderate emotional concern: mood ${analysis.mood_score}/10`,
      childMessage: analysis.summary,
      carerMessage: null, // No carer notification for tier 2
      suggestedAction: hasProtectiveFactors && hasRecentToolUsage
        ? "Child is engaging with support, continue monitoring"
        : "Encourage use of coping tools",
      bypassQuietHours: false
    };
  }

  // TIER 1: Supportive monitoring - Normal emotional expression
  return {
    tier: 1,
    reason: "Normal emotional expression with positive or neutral mood",
    childMessage: analysis.summary,
    carerMessage: null,
    suggestedAction: "Continue supportive monitoring",
    bypassQuietHours: false
  };
}

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

    // Import shared trigger system for unified detection
    // Using the centralized tiered trigger system for consistent detection across the app
    const { detectTriggers, normalizeForMatching, TRIGGERS, CONTEXT_SENSITIVE_WORDS, isWordInSafeContext } = await import('../_shared/triggers.ts');
    
    // Detect triggers using the unified system
    const triggerResult = detectTriggers(entryText);
    const hasHighRiskContent = triggerResult.tier === 'C';
    const detectedKeywords = triggerResult.keywords;
    
    // Also check context-sensitive words that weren't in safe contexts
    const contextConcerns = triggerResult.contextSensitiveFlags;
    
    console.log('Trigger detection result:', {
      tier: triggerResult.tier,
      category: triggerResult.category,
      keywords: detectedKeywords,
      contextConcerns,
      requiresEscalation: triggerResult.requiresEscalation
    });

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

    // PHASE 2: Build enhanced system prompt with contextual analysis
    const systemPrompt = `You are Wendy, an AI trained to analyze children's journal entries (ages 7-16) with trauma-informed care principles.

${historicalContext.hasHistory ? `
HISTORICAL CONTEXT FOR THIS CHILD:
- Recent journal entries: ${historicalContext.recentEntries.length} in last 7 days
- Recent mood check-ins: ${historicalContext.recentMoods.length} recorded
- Protective factors identified: ${historicalContext.protectiveFactors.length}
- Coping tools used: ${historicalContext.toolUsage.length} sessions
- Active patterns: ${historicalContext.activePatterns.length} being monitored

${historicalContext.activePatterns.length > 0 ? `
Active Patterns Detected:
${historicalContext.activePatterns.map((p: any) => 
  `- ${p.pattern_type}: ${JSON.stringify(p.detected_themes)} (${p.severity_trend === 'declining' ? 'decreasing' : p.severity_trend} over ${p.entry_count} entries)`
).join('\n')}
` : ''}

${historicalContext.recentMoods.length > 0 ? `
Recent Mood Patterns:
${historicalContext.recentMoods.slice(0, 5).map((m: any) => 
  `${m.mood_emoji} ${m.mood_type} (${m.intensity}/10) - ${new Date(m.created_at).toLocaleDateString()}`
).join('\n')}
` : ''}

${historicalContext.protectiveFactors.length > 0 ? `
Support Systems Present:
${historicalContext.protectiveFactors.slice(0, 3).map((f: any) => 
  `- ${f.factor_type}: ${f.description}`
).join('\n')}
` : ''}

CONTEXTUAL ANALYSIS INSTRUCTIONS:
Based on this history, determine:
1. Is this a NEW concern or RECURRING pattern?
2. Is emotional state IMPROVING, STABLE, or DECREASING?
3. Are SUPPORT SYSTEMS active and helpful?
4. Is child ENGAGING with coping tools?
5. What has been the general PATTERN over time?

Escalation Guidelines with Context:
- First mention + stable mood + support = NO escalation
- Recurring concern + decreasing mood = ESCALATE
- High-risk keywords + no support = IMMEDIATE escalation
- Moderate distress + active coping + support = Tool recommendation only

PARENT SUMMARY LANGUAGE RULES:
- Use descriptive, observational language only
- Say "Recently, your child has shared more worries about..." NOT "This suggests increasing anxiety"
- Avoid: "trend", "trajectory", "risk", "indicates", "likely", "suggests worsening", "predicts"
- Use: "has been", "seems to be", "has shared", "has mentioned", "recently"

EVIDENCE & AUTHORITY RULES:
- You may suggest general support options (GP, school, trusted adult, helplines)
- You must NOT cite named research, statistics, clinical frameworks, or studies
- You must NOT use "evidence shows", "research indicates", "studies suggest"
- Keep tone supportive without expert authority framing
` : 'No historical context available - this may be their first entry or recent sign-up.'}

CORE PRINCIPLES:
- Age-appropriate for 7-16 year olds
- NON-DIAGNOSTIC: Use "worry" not "anxiety", "sad" not "depressed"
- Evidence-based: NHS, Childline, validated research
- Trauma-informed: Validate feelings, never judge
- Spelling tolerant: Focus on intended meaning

SPELLING & LANGUAGE:
- Accept phonetic spellings: "skarred"→"scared", "angre"→"angry"
- Accept informal text: "im sad", "cant sleep", "ur mean"
- Detect themes despite misspellings
- Use correct spelling in your responses (gentle modeling)

GOLD-STANDARD CHILD RESPONSE RULES:
═══════════════════════════════════════════════════════════════

When generating the "summary" field for the child, you MUST:

✅ REQUIRED BEHAVIOURS:
- Acknowledge the feeling without judging, fixing, or minimising
- Stay present-focused ("right now", "today", "in this moment")
- Use gentle, age-appropriate language
- Offer optional support, never instructions or pressure
- Allow stillness and non-action (e.g. "We can just sit with this")
- Sound human, warm, and calm — never clinical or scripted
- Use 2-3 sentences maximum

🚫 STRICT PROHIBITIONS:
- NO reassurance absolutes: "Everything will be okay", "This won't last forever", "You'll feel better soon"
- NO predictions or trajectories: "This sounds like anxiety getting worse", "This could turn into..."
- NO clinical framing: "symptoms", "disorder", "research shows"
- NO pushing action after vulnerability: "You should tell an adult", "Try this now"
- NO probing "why" questions: "Why do you think you feel this way?"

🧠 AI HUMILITY (use sparingly, max once):
- "I might not have this exactly right — tell me if I've misunderstood."
- Never defend your interpretation or correct the child

RESPONSE STRUCTURE:
1. Opening: Validate/acknowledge ("That sounds...", "It sounds like...", "Thank you for sharing...")
2. Middle: Normalise or contextualise without fixing
3. Closing: Gentle optional question OR offer of calm presence

GOLD-STANDARD EXAMPLES (Match these closely in tone, length, and intent):

Example 1 - Mild Worry (School):
Entry: "I felt a bit nervous at school today because the teacher asked me a question and everyone looked at me."
Response: "That sounds uncomfortable. Being looked at can make nerves feel louder. You did something brave by getting through that moment. How does your body feel right now?"

Example 2 - After a Hard Day:
Entry: "Today was just bad. Nothing went right and I feel tired inside."
Response: "That sounds really heavy. Some days can feel like they take more energy than others. I'm here with you — we can take this moment slowly if you want."

Example 3 - Anger & Frustration:
Entry: "I got really angry when my brother took my things and I shouted."
Response: "It sounds like your anger came up fast when something felt unfair. Big feelings can surprise us. What feels most noticeable for you right now — your body or your thoughts?"

Example 4 - Sadness Without Clear Reason:
Entry: "I feel sad but I don't know why."
Response: "Thank you for sharing that. Feeling sad without knowing the reason can be confusing. You don't have to figure it out right now — we can just notice the feeling together."

Example 5 - Feeling Left Out:
Entry: "My friends played a game and didn't ask me. I felt invisible."
Response: "Feeling invisible can really hurt. It makes sense that this stayed with you. Right now, what would feel kind or comforting for you — even something small?"

Example 6 - Worry About the Future:
Entry: "I'm scared tomorrow will be bad again."
Response: "Thinking about tomorrow can make worries feel bigger. For now, let's stay with today. What feels okay or safe in this moment?"

Example 7 - Overwhelm:
Entry: "There's too much in my head and I can't stop thinking."
Response: "That sounds overwhelming. When thoughts pile up, it can feel noisy inside. We don't need to solve anything — would it help to take one slow breath together?"

Example 8 - Low Self-Worth Language:
Entry: "I'm bad at everything and everyone else is better than me."
Response: "It sounds like you're being very hard on yourself right now. Those thoughts can feel very convincing when we're tired or upset. What's one small thing you managed today, even if it felt ordinary?"

Example 9 - Avoidance / Shutdown:
Entry: "I didn't want to talk to anyone today."
Response: "Wanting space can be a way of protecting yourself. That's okay. You don't have to talk if you don't want to — I'm here quietly with you."

Example 10 - Elevated Distress (Non-Crisis):
Entry: "Everything feels like too much and I don't know what to do."
Response: "That sounds really intense. When things feel like too much, it can help to pause. We can just focus on this moment together. Are you safe right now?"

🛡️ SAFETY OVERRIDE:
If a journal entry suggests immediate danger or self-harm, follow the high-risk keyword detection and escalation rules above. Do NOT apply gold-standard examples in crisis scenarios — use crisis messaging instead.

YOUR TASK:
1. Provide a warm, validating 2-3 sentence summary FOR THE CHILD following the GOLD-STANDARD CHILD RESPONSE RULES above. Match the tone, length, and intent of the provided examples.
2. Provide a SEPARATE parent-focused summary that explains:
   - What the child expressed in simple terms
   - Key emotions detected and what might be affecting them
   - Gentle, supportive suggestions for the parent
3. Detect ALL relevant themes from: school, friends, family, body, sleep, bullying, change, identity, loss, hobbies, worry-general, anger, sadness, fear, excitement, pride, confusion, overwhelm
4. Score mood 0-10 based on:
   - 0-2: Severe distress, crisis
   - 3-4: Low mood, struggling
   - 5-6: Mixed/neutral
   - 7-8: Positive, coping
   - 9-10: Thriving, happy
5. Recommend 2-3 specific coping tools
6. Suggest 2-3 specific carer actions (concrete, practical steps)
7. Determine if escalation needed (high-risk keywords, persistent distress, declining pattern)

RESPOND WITH VALID JSON ONLY:
{
  "summary": "Warm validating summary for child here (following gold-standard examples)",
  "parent_summary": "Parent-focused summary explaining what the child expressed, emotions detected, potential triggers, and supportive suggestions",
  "themes": ["theme1", "theme2"],
  "mood_score": 7,
  "recommended_tools": ["Tool Name 1", "Tool Name 2"],
  "carer_actions": ["Specific action 1", "Specific action 2"],
  "escalate": false,
  "escalation_reason": "Brief reason if true, null if false"
}`;

    console.log('Calling Wendy AI with enhanced contextual prompt');
    const wendyResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this journal entry: "${entryText}"` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const wendyData = await wendyResponse.json();
    const wendyContent = wendyData.choices[0]?.message?.content;

    let analysis;
    try {
      const jsonMatch = wendyContent.match(/```json\n?([\s\S]*?)\n?```/) || wendyContent.match(/({[\s\S]*})/);
      analysis = JSON.parse((jsonMatch ? jsonMatch[1] : wendyContent).trim());
    } catch {
      console.warn('Failed to parse AI response, using fallback');
      analysis = {
        summary: "Thank you for sharing your feelings with me.",
        themes: ["general"],
        mood_score: 5,
        recommended_tools: ["Breathing Space", "Gentle Reflections"],
        escalate: hasHighRiskContent,
        escalation_reason: hasHighRiskContent ? "High-risk keywords detected" : null
      };
    }

    // PHASE 2: Determine escalation tier using new graduated system
    const escalationDecision = determineEscalationTier(
      hasHighRiskContent,
      detectedKeywords,
      analysis,
      historicalContext
    );

    console.log('Escalation decision:', {
      tier: escalationDecision.tier,
      reason: escalationDecision.reason,
      bypassQuietHours: escalationDecision.bypassQuietHours
    });

    const shouldEscalate = escalationDecision.tier >= 3; // Tier 3 and 4 notify carer

    const { data: copingTools } = await supabase
      .from('coping_tools')
      .select('id, name')
      .in('name', analysis.recommended_tools || []);

    // Helper function to generate fallback parent summary
    function generateParentSummary(analysis: any, escalation: EscalationDecision): string {
      const moodLevel = analysis.mood_score >= 7 ? 'positive' : analysis.mood_score >= 5 ? 'mixed' : 'challenging';
      const themes = analysis.themes?.slice(0, 3).join(', ') || 'general feelings';
      
      if (escalation.tier >= 3) {
        return escalation.carerMessage || `Your child expressed some challenging emotions today around ${themes}. Extra support and reassurance may be helpful.`;
      }
      
      if (moodLevel === 'positive') {
        return `Your child expressed ${moodLevel} emotions today, touching on ${themes}. They seem to be processing their feelings well. Continue being available for conversations when they need you.`;
      } else if (moodLevel === 'mixed') {
        return `Your child shared some mixed feelings today, including thoughts about ${themes}. This is a normal part of emotional development. A gentle check-in or quality time together might be helpful.`;
      } else {
        return `Your child expressed some challenging emotions today, particularly around ${themes}. They may benefit from extra support and reassurance. Consider creating a calm moment to connect.`;
      }
    }

    // Helper function to generate fallback carer actions
    function generateCarerActions(analysis: any): string[] {
      const actions: string[] = [];
      const moodScore = analysis.mood_score || 5;
      
      if (moodScore < 5) {
        actions.push("Schedule some one-on-one quality time together in a relaxed setting");
        actions.push("Listen without judgment if they want to talk about what's bothering them");
      } else if (moodScore < 7) {
        actions.push("Check in casually about how they're feeling");
        actions.push("Acknowledge their feelings and let them know you're here for support");
      } else {
        actions.push("Keep up the positive environment and open communication");
        actions.push("Celebrate their emotional awareness and healthy expression");
      }
      
      return actions;
    }

    const { data: insertedInsight } = await supabase
      .from('wendy_insights')
      .insert({
        child_id: childId,
        journal_entry_id: journalEntryId,
        summary: escalationDecision.childMessage,
        themes: analysis.themes,
        mood_score: analysis.mood_score,
        recommended_tools: analysis.recommended_tools,
        recommended_tool_ids: copingTools?.map(t => t.id) || [],
        carer_actions: analysis.carer_actions || generateCarerActions(analysis),
        escalate: shouldEscalate,
        parent_summary: analysis.parent_summary || generateParentSummary(analysis, escalationDecision)
      })
      .select()
      .single();

    // Create safeguarding log for Tier 3 and 4
    if (shouldEscalate) {
      console.log(`Creating tier ${escalationDecision.tier} safeguarding log`);
      
      await supabase.from('safeguarding_logs').insert({
        child_id: childId,
        journal_entry_id: journalEntryId,
        detected_keywords: detectedKeywords,
        severity_score: 10 - (analysis.mood_score || 5),
        action_taken: escalationDecision.suggestedAction,
        escalation_tier: escalationDecision.tier,
        protective_factors_present: historicalContext.protectiveFactors,
        historical_context: {
          recentEntriesCount: historicalContext.recentEntries.length,
          recentMoodsCount: historicalContext.recentMoods.length,
          toolUsageCount: historicalContext.toolUsage.length,
          activePatternsCount: historicalContext.activePatterns.length,
          hasProtectiveFactors: historicalContext.protectiveFactors.length > 0,
          trajectory: historicalContext.activePatterns?.[0]?.severity_trend || 'unknown'
        }
      });

      // Flag journal entry for Tier 4
      if (escalationDecision.tier === 4) {
        await supabase.from('journal_entries').update({ 
          flagged: true,
          flag_reasons: {
            keywords: detectedKeywords,
            ai_reason: escalationDecision.reason,
            tier: 4
          }
        }).eq('id', journalEntryId);
      }

      // Send carer notification
      const { data: childProfile } = await supabase
        .from('children_profiles')
        .select('linked_carer_id')
        .eq('id', childId)
        .single();

      if (childProfile?.linked_carer_id) {
        console.log('Sending tier', escalationDecision.tier, 'notification to carer');
        
        await supabase.from('notification_history').insert({
          user_id: childProfile.linked_carer_id,
          notification_type: escalationDecision.tier === 4 ? 'safeguarding_alert' : 'wellbeing_insight',
          notification_content: JSON.stringify({
            title: escalationDecision.tier === 4 ? 'Wellbeing Alert' : 'Gentle Check-in Suggested',
            body: escalationDecision.carerMessage
          })
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: {
        summary: escalationDecision.childMessage,
        themes: analysis.themes,
        mood_score: analysis.mood_score,
        recommended_tools: analysis.recommended_tools,
        recommended_tool_ids: copingTools?.map(t => t.id) || [],
        escalated: shouldEscalate,
        escalation_tier: escalationDecision.tier
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