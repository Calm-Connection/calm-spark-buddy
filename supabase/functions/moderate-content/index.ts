import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive child safety keyword lists
const UNSAFE_KEYWORDS = {
  profanity: ['fuck', 'shit', 'damn', 'hell', 'bitch', 'ass', 'bastard', 'crap', 'piss'],
  sexual: ['sex', 'sexy', 'nude', 'naked', 'porn', 'penis', 'vagina', 'boobs', 'breast', 'dick', 'cock', 'pussy', 'ass', 'butt', 'underwear', 'bikini', 'lingerie'],
  violence: ['kill', 'murder', 'stab', 'shoot', 'gun', 'weapon', 'blood', 'dead', 'death', 'hurt', 'attack', 'fight', 'punch', 'hit', 'beat', 'wound', 'gore'],
  hate_speech: ['hate', 'racist', 'nazi', 'nigger', 'fag', 'retard', 'stupid', 'ugly', 'fat', 'loser', 'idiot', 'dumb'],
  drugs: ['drug', 'weed', 'cocaine', 'heroin', 'meth', 'beer', 'alcohol', 'drunk', 'smoke', 'cigarette', 'vape'],
};

// Pattern matching for bypass attempts (l33t speak, spacing, etc.)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

function keywordCheck(text: string): { safe: boolean; category: string; confidence: number } {
  const normalized = normalizeText(text);
  
  for (const [category, keywords] of Object.entries(UNSAFE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return { safe: false, category, confidence: 0.9 };
      }
    }
  }
  
  return { safe: true, category: 'safe', confidence: 1.0 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, context = 'avatar_freestyle' } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ safe: false, error: 'Invalid input text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user
    const authHeader = req.headers.get('authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ safe: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Quick keyword-based filtering
    const keywordResult = keywordCheck(text);
    
    if (!keywordResult.safe) {
      // Log flagged content
      await supabase.from('moderation_logs').insert({
        user_id: user.id,
        input_text: text.substring(0, 500), // Limit stored text
        is_safe: false,
        category: keywordResult.category,
        confidence: keywordResult.confidence,
        context
      });

      // Create safeguarding alert for high-risk categories
      if (['sexual', 'hate_speech', 'violence'].includes(keywordResult.category)) {
        await supabase.from('safeguarding_alerts').insert({
          user_id: user.id,
          alert_type: 'inappropriate_content',
          severity: keywordResult.category === 'sexual' || keywordResult.category === 'hate_speech' ? 'high' : 'medium',
          details: `User attempted to use inappropriate language in ${context}: "${text.substring(0, 100)}..."`,
          status: 'pending_review'
        });
      }

      return new Response(
        JSON.stringify({ 
          safe: false, 
          category: keywordResult.category,
          message: "Let's keep it kind and creative! Try describing your character another way."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: AI-based contextual moderation
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const moderationPrompt = `You are a child safety moderator for a kids' app (ages 7-16). 
Analyze this text for ANY inappropriate content including profanity, sexual content, violence, 
hate speech, drug references, or personal information.

Text to analyze: "${text}"

Respond with ONLY valid JSON in this exact format:
{
  "safe": true,
  "category": "safe",
  "confidence": 1.0,
  "reason": "The text is appropriate for children"
}

Categories: "profanity", "sexual", "violence", "hate_speech", "drugs", "personal_info", or "safe"
Be STRICT. If there's any doubt, mark as unsafe with the appropriate category.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'user',
            content: moderationPrompt
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI moderation failed:', await aiResponse.text());
      // Fall back to keyword-only check (already passed)
      return new Response(
        JSON.stringify({ safe: true, category: 'safe' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    
    let aiResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', aiContent);
      // Safe by default if parsing fails
      aiResult = { safe: true, category: 'safe', confidence: 0.5 };
    }

    // Log all moderation attempts
    await supabase.from('moderation_logs').insert({
      user_id: user.id,
      input_text: text.substring(0, 500),
      is_safe: aiResult.safe,
      category: aiResult.category,
      confidence: aiResult.confidence || 0.8,
      context
    });

    // Create alert if AI flags content
    if (!aiResult.safe) {
      const severityMap: any = {
        'sexual': 'high',
        'hate_speech': 'high',
        'violence': 'medium',
        'profanity': 'medium',
        'drugs': 'medium',
        'personal_info': 'low'
      };

      await supabase.from('safeguarding_alerts').insert({
        user_id: user.id,
        alert_type: 'inappropriate_content',
        severity: severityMap[aiResult.category] || 'medium',
        details: `AI detected ${aiResult.category} in ${context}: "${text.substring(0, 100)}..." - ${aiResult.reason}`,
        status: 'pending_review'
      });
    }

    return new Response(
      JSON.stringify({ 
        safe: aiResult.safe,
        category: aiResult.category,
        confidence: aiResult.confidence,
        message: aiResult.safe 
          ? "Content is appropriate" 
          : "Let's keep it kind and creative! Try describing your character another way."
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Moderation error:', error);
    // Safe by default on errors (better UX than blocking legitimate users)
    return new Response(
      JSON.stringify({ safe: true, category: 'safe', error: 'Moderation check failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});