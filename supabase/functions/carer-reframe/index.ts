import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reflection } = await req.json();
    
    if (!reflection || reflection.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No reflection text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a compassionate supportive companion for parents and carers of children with anxiety. 
Your role is to gently reframe negative self-talk into kinder, more compassionate perspectives.

Rules:
- Use warm, everyday language - never clinical or diagnostic terms
- Focus on self-compassion and acknowledging effort
- Never promise outcomes or give medical advice
- If you detect serious distress, gently suggest speaking with a GP or school
- Keep responses brief (2-3 sentences max)
- Start with validation before offering a reframe
- Always be kind, supportive, and non-judgmental

EVIDENCE & AUTHORITY RULES:
- You may suggest general support options (GP, school, trusted adult, helplines)
- You must NOT cite named research, statistics, clinical frameworks, or studies
- You must NOT use "evidence shows", "research indicates", "studies suggest"
- Keep tone supportive without expert authority framing

BANNED REASSURANCE ABSOLUTES:
- Never say "It will get better", "Everything will be okay", "This won't last forever"
- Instead use neutral phrases like "Feelings can change" or "You're not alone in this"`;

    console.log('Calling Lovable AI for reframe...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please offer a gentle, compassionate reframe of this reflection:\n\n"${reflection}"` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const reframe = data.choices?.[0]?.message?.content;

    if (!reframe) {
      throw new Error('No reframe generated');
    }

    console.log('Reframe generated successfully');

    return new Response(
      JSON.stringify({ reframe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in carer-reframe function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
