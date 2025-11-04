import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customization, prompt, gender = 'prefer_not_to_say' } = await req.json();
    
    if (!type || (type !== 'child' && type !== 'carer')) {
      return new Response(
        JSON.stringify({ error: 'Type (child or carer) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build prompt based on type and data
    let finalPrompt = '';
    
    // Gender-based character descriptor
    let genderDescriptor = 'child';
    if (gender === 'male') genderDescriptor = 'boy';
    else if (gender === 'female') genderDescriptor = 'girl';
    
    if (customization && type === 'child') {
      // Structured Disney-style prompt for children with gender consideration
      const { skinTone, eyeColor, hairColor, hairStyle, favoriteColor, accessory, comfortItem } = customization;
      
      finalPrompt = `IMPORTANT SAFETY RULES: You are creating an avatar for a child-safe app (ages 7-16).
STRICT REQUIREMENTS:
- NO adult themes, violence, weapons, or scary elements
- NO suggestive clothing, poses, or body features  
- NO references to drugs, alcohol, or inappropriate topics
- ONLY wholesome, friendly, age-appropriate characters
- Disney/Pixar animation style ONLY

Create a friendly, warm Disney/Pixar-style cartoon avatar of a ${genderDescriptor} with ${skinTone} skin tone, 
${eyeColor} eyes, ${hairColor} ${hairStyle} hair, wearing a ${favoriteColor} colored shirt or top. 
${accessory !== 'none' ? `The ${genderDescriptor} has ${accessory}.` : ''} 
${comfortItem !== 'none' ? `The ${genderDescriptor} is holding or has a ${comfortItem}.` : ''} 
Style: soft, colorful, warm, appropriate for ages 7-16, Pixar/Disney animation quality, gentle expression, 
non-scary, child-appropriate, fully clothed in age-appropriate outfit. Square format (1024x1024), friendly and calm expression, 
centered character on a soft pastel or gradient background. Make it feel safe, comforting, and inclusive.`;
    } else if (prompt) {
      // Freestyle prompt with gender consideration and ENHANCED SAFETY WRAPPER
      if (type === 'child') {
        const genderPrefix = gender !== 'prefer_not_to_say' ? `a ${genderDescriptor}` : 'a child';
        finalPrompt = `IMPORTANT SAFETY RULES: You are creating an avatar for a child-safe app (ages 7-16).
STRICT REQUIREMENTS:
- NO adult themes, violence, weapons, or scary elements
- NO suggestive clothing, poses, or body features
- NO references to drugs, alcohol, or inappropriate topics
- ONLY wholesome, friendly, age-appropriate characters
- Disney/Pixar animation style ONLY

User request: Create a friendly, warm Disney/Pixar-style cartoon avatar of ${genderPrefix}: ${prompt}. 

SAFETY CHECK: If the user's description contains anything inappropriate, instead create a generic 
friendly ${genderDescriptor} character with a big smile, casual clothing (t-shirt and jeans), 
and a wholesome appearance.

Style: soft, colorful, appropriate for ages 7-16, Pixar/Disney quality, gentle and kind expression, 
non-scary, child-appropriate, fully clothed in age-appropriate outfit. Square format, centered character on a calm pastel background.`;
      } else {
        finalPrompt = `Create a professional, friendly Disney/Pixar-style avatar: ${prompt}. 
Style: warm, approachable, professional adult character, Pixar/Disney animation quality, 
kind and caring expression. Square format, centered character on a neutral background.`;
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Either customization or prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate image using Lovable AI
    console.log('Generating avatar with type:', type);
    console.log('Prompt:', finalPrompt);
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Convert base64 to blob
    const base64Data = imageUrl.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, byteArray, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    console.log('Avatar generated successfully:', publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating avatar:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});