import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { assetType, assetKey, prompt } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Generating ${assetType}/${assetKey}...`);

    // Enhance prompt to explicitly request transparent background
    const enhancedPrompt = `${prompt}

CRITICAL REQUIREMENTS:
- Output MUST be PNG format with fully transparent background
- NO white background, NO colored background, completely transparent areas around the subject
- Clean alpha channel with no artifacts
- High quality transparency with smooth edges`;

    // Retry logic for AI generation
    let lastError;
    let data;
    let imageBase64;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Add delay between retries
        if (attempt > 1) {
          console.log(`Retry attempt ${attempt} for ${assetType}/${assetKey}...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [{
              role: 'user',
              content: enhancedPrompt
            }],
            modalities: ['image', 'text']
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI generation error (attempt ${attempt}):`, response.status, errorText.substring(0, 200));
          throw new Error(`AI generation failed: ${response.status}`);
        }

        data = await response.json();
        imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!imageBase64) {
          console.error('No image in response');
          throw new Error('No image generated');
        }

        // Success! Break out of retry loop
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt === 3) {
          throw error; // Throw on last attempt
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    // Convert base64 to blob
    const base64Data = imageBase64.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const filePath = `library/${assetType}/${assetKey}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, binaryData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log(`Generated ${assetType}/${assetKey} successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        assetType,
        assetKey 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating avatar asset:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
