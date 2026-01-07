import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customization, prompt, objectData, gender = 'prefer_not_to_say', age = 'child' } = await req.json();
    
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
    
    // Gender-based character descriptor (for backward compatibility with old human avatars)
    let genderDescriptor = 'child';
    if (gender === 'male') genderDescriptor = 'boy';
    else if (gender === 'female') genderDescriptor = 'girl';
    
    // Age-based character descriptors
    let ageDescriptor = '';
    let featureModifier = '';
    let sizeModifier = '';
    
    if (age === 'child') {
      ageDescriptor = 'young child (7-11 years old)';
      featureModifier = 'with soft, round facial features, big expressive eyes, chubby cheeks, smaller proportions, very child-like appearance';
      sizeModifier = 'smaller, cuter proportions';
    } else if (age === 'teen') {
      ageDescriptor = 'young teenager (12-16 years old)';
      featureModifier = 'with slightly more mature facial features, taller proportions, but still youthful and age-appropriate for teens';
      sizeModifier = 'slightly larger proportions but still youthful';
    }
    
    // Object-based avatar (NEW SYSTEM)
    if (objectData && type === 'child') {
      const { objectType, mainColor, accentColor, eyeStyle, eyeColor, accessory, comfortItem } = objectData;
      
      const objectDescriptions: { [key: string]: string } = {
        teddyBear: 'soft cuddly teddy bear',
        toyCar: 'playful toy car',
        starCharacter: 'friendly glowing star character',
        cloudCreature: 'fluffy dreamy cloud creature',
        softAnimal: 'gentle soft animal friend',
      };
      
      finalPrompt = `Create a young child-friendly Disney/Pixar-style ${objectDescriptions[objectType] || 'cute character'}.

COLOR INSTRUCTIONS - FOLLOW PRECISELY:
- The character's BODY/FUR/MAIN SURFACE ONLY should be ${mainColor} color
- Add ${accentColor} ONLY to small accent details (belly patch, inner ears, small decorative elements - maximum 10% of character)
- KEEP ALL OTHER PARTS THEIR NATURAL COLORS:
  - Eyes MUST be ${eyeColor} in ${eyeStyle} style - NEVER change eye color based on body colors
  - Nose should be natural/darker shade (brown, black, or pink)
  - Background should be soft pastel gradient - NEVER match character colors
- DO NOT apply mainColor or accentColor to:
  - Eyes, eyebrows, or facial features
  - The background or environment
  - Any accessories (unless the accessory is specifically meant to match)
- MAINTAIN the character's recognizable shape and features

Features:
${accessory !== 'none' ? `Wearing or with: ${accessory}` : ''}
${comfortItem !== 'none' ? `Holding or accompanied by: ${comfortItem}` : ''}

Style Requirements:
- Soft, rounded shapes with no sharp edges
- Friendly, warm expression
- High quality cartoon illustration
- Child-appropriate and comforting aesthetic
- 1024x1024px with transparent or soft gradient background

MAINTAIN CONSISTENT: Character type, shape, facial structure, eye placement
CUSTOMIZE ONLY: Body/fur/surface color as ${mainColor}, small accent details as ${accentColor}

IMPORTANT SAFETY RULES:
- Keep all content child-friendly and age-appropriate
- No scary, violent, or inappropriate elements
- Maintain a warm, welcoming, supportive aesthetic
- Focus on comfort, safety, and emotional wellbeing themes`;
    } else if (customization && type === 'child') {
      // Structured Disney-style prompt for children with gender consideration
      const { skinTone, eyeColor, hairColor, hairStyle, favoriteColor, accessory, comfortItem } = customization;
      
      finalPrompt = `IMPORTANT SAFETY RULES: You are creating an avatar for a child-safe app (ages 7-16).
STRICT REQUIREMENTS:
- NO adult themes, violence, weapons, or scary elements
- NO suggestive clothing, poses, or body features  
- NO references to drugs, alcohol, or inappropriate topics
- ONLY wholesome, friendly, age-appropriate characters
- Disney/Pixar animation style ONLY

Create a friendly, warm Disney/Pixar-style cartoon avatar of a ${ageDescriptor} ${genderDescriptor} 
${featureModifier}, with ${skinTone} skin tone, ${eyeColor} eyes, ${hairColor} ${hairStyle} hair, 
wearing a ${favoriteColor} colored shirt or top. 
${accessory !== 'none' ? `The character has ${accessory}.` : ''} 
${comfortItem !== 'none' ? `The character is holding or has a ${comfortItem}.` : ''} 
Style: soft, colorful, warm, appropriate for ages 7-16, Pixar/Disney animation quality, gentle expression, 
non-scary, child-appropriate, fully clothed in age-appropriate outfit. Square format (1024x1024), friendly and calm expression, 
centered character on a soft pastel or gradient background. Make it feel safe, comforting, and inclusive.`;
    } else if (prompt) {
      // Freestyle prompt with gender and age consideration and ENHANCED SAFETY WRAPPER
      if (type === 'child') {
        const genderPrefix = gender !== 'prefer_not_to_say' ? `a ${genderDescriptor}` : 'a child';
        finalPrompt = `IMPORTANT SAFETY RULES: You are creating an avatar for a child-safe app (ages 7-16).
STRICT REQUIREMENTS:
- NO adult themes, violence, weapons, or scary elements
- NO suggestive clothing, poses, or body features
- NO references to drugs, alcohol, or inappropriate topics
- ONLY wholesome, friendly, age-appropriate characters
- Disney/Pixar animation style ONLY

User request: Create a friendly, warm Disney/Pixar-style cartoon avatar of ${genderPrefix} who is a ${ageDescriptor} 
${featureModifier}: ${prompt}. 

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