import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Common first names to detect (top 200 UK names)
const COMMON_NAMES = new Set([
  'oliver', 'george', 'harry', 'noah', 'jack', 'leo', 'oscar', 'charlie', 'muhammad', 'theo',
  'archie', 'henry', 'thomas', 'freddie', 'arthur', 'logan', 'william', 'lucas', 'edward', 'james',
  'amelia', 'olivia', 'isla', 'emily', 'lily', 'freya', 'ella', 'grace', 'sophia', 'evie',
  'charlotte', 'poppy', 'jessica', 'sophie', 'isabella', 'mia', 'ruby', 'rosie', 'alice', 'daisy',
  'liam', 'ethan', 'jacob', 'michael', 'daniel', 'matthew', 'joseph', 'samuel', 'david', 'joshua',
  'benjamin', 'alexander', 'ryan', 'nathan', 'luke', 'isaac', 'mason', 'dylan', 'adam', 'finley',
  'ellie', 'hannah', 'ava', 'amelie', 'phoebe', 'evelyn', 'maisie', 'emma', 'lucy', 'layla',
  'sarah', 'katie', 'molly', 'chloe', 'holly', 'jasmine', 'abigail', 'beth', 'rose', 'millie',
  'alfie', 'max', 'harrison', 'reuben', 'mason', 'sebastian', 'jude', 'louis', 'kai', 'blake',
  'riley', 'harvey', 'felix', 'toby', 'jamie', 'finlay', 'rory', 'bobby', 'frankie', 'alex',
  'john', 'robert', 'richard', 'paul', 'mark', 'andrew', 'simon', 'peter', 'christopher', 'anthony',
  'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan', 'margaret', 'karen', 'nancy'
]);

// Surname patterns (common UK surnames)
const COMMON_SURNAMES = new Set([
  'smith', 'jones', 'williams', 'taylor', 'brown', 'davies', 'evans', 'wilson', 'thomas', 'johnson',
  'roberts', 'robinson', 'thompson', 'wright', 'walker', 'white', 'hughes', 'edwards', 'green', 'hall',
  'lewis', 'harris', 'clarke', 'patel', 'jackson', 'wood', 'turner', 'martin', 'cooper', 'hill',
  'ward', 'morris', 'moore', 'clark', 'lee', 'king', 'baker', 'harrison', 'morgan', 'allen'
]);

// Refined unsafe keywords for username validation
// More focused to reduce false positives while maintaining safety
const UNSAFE_KEYWORDS = {
  profanity: ['fuck', 'shit', 'cunt', 'bitch', 'wanker', 'bollocks', 'twat'],
  sexual: ['porn', 'xxx', 'horny', 'sexting'],
  // Removed 'kill', 'die', 'hurt', 'blood' - these could be innocent gaming/avatar names
  violence: ['murder', 'stab', 'rape'],
  drugs: ['cocaine', 'meth', 'heroin'],
  hate: ['nazi', 'terrorist'],
  contact: ['phone', 'email', 'whatsapp', 'snapchat', 'insta', 'tiktok', 'discord']
};

// School indicators
const SCHOOL_KEYWORDS = ['school', 'academy', 'college', 'primary', 'secondary', 'high', 'grammar'];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

// Generate Calm Connection themed nickname suggestions
function generateSuggestions(): string[] {
  // Calm Connection themed prefixes - calm, gentle, nature-inspired
  const prefixes = ['Calm', 'Gentle', 'Cozy', 'Peaceful', 'Warm', 'Soft', 'Kind', 'Quiet', 'Sky', 'Star'];
  // Calm Connection themed suffixes - friendly animals and nature
  const suffixes = ['Otter', 'Panda', 'Cloud', 'Wave', 'Breeze', 'Heart', 'Gazer', 'Hopper', 'Fox', 'Bear'];
  const numbers = ['', ''];  // Prefer no numbers for cleaner names
  
  const suggestions: string[] = [];
  const usedCombos = new Set<string>();
  
  while (suggestions.length < 3) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const combo = `${prefix}${suffix}`;
    
    if (!usedCombos.has(combo)) {
      usedCombos.add(combo);
      suggestions.push(combo);
    }
  }
  return suggestions;
}

interface ValidationResult {
  valid: boolean;
  reason?: string;
  message?: string;
  suggestions?: string[];
  severity?: string;
}

function validateUsername(username: string): ValidationResult {
  const trimmed = username.trim();
  const normalized = normalizeText(trimmed);
  const lower = trimmed.toLowerCase();

  // 1. Length validation
  if (trimmed.length < 3) {
    return {
      valid: false,
      reason: 'too_short',
      message: 'Your nickname needs to be at least 3 characters long!',
      suggestions: generateSuggestions()
    };
  }

  if (trimmed.length > 20) {
    return {
      valid: false,
      reason: 'too_long',
      message: 'Your nickname is too long - please keep it under 20 characters!',
      suggestions: generateSuggestions()
    };
  }

  // 2. Character validation
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      valid: false,
      reason: 'invalid_characters',
      message: 'Please use only letters, numbers, underscores (_) and hyphens (-) in your nickname!',
      suggestions: generateSuggestions()
    };
  }

  // Check for consecutive special characters
  if (/[_-]{2,}/.test(trimmed)) {
    return {
      valid: false,
      reason: 'consecutive_special',
      message: 'Please don\'t use multiple underscores or hyphens in a row!',
      suggestions: generateSuggestions()
    };
  }

  // 3. Real name detection
  for (const name of COMMON_NAMES) {
    if (normalized.includes(name) || lower.includes(name)) {
      return {
        valid: false,
        reason: 'real_name_detected',
        message: 'Please use a fun nickname instead of your real name to stay safe online!',
        suggestions: generateSuggestions(),
        severity: 'medium'
      };
    }
  }

  // Check for surname patterns
  for (const surname of COMMON_SURNAMES) {
    if (normalized.includes(surname) || lower.includes(surname)) {
      return {
        valid: false,
        reason: 'real_name_detected',
        message: 'Please use a fun nickname instead of your real name to stay safe online!',
        suggestions: generateSuggestions(),
        severity: 'medium'
      };
    }
  }

  // 4. Personal information detection
  // Email patterns
  if (/@/.test(trimmed) || /\.com|\.co\.uk|\.org|\.net/.test(lower)) {
    return {
      valid: false,
      reason: 'personal_info',
      message: 'Please don\'t include email addresses in your nickname for your safety!',
      suggestions: generateSuggestions(),
      severity: 'high'
    };
  }

  // Phone number patterns (7+ consecutive digits)
  if (/\d{7,}/.test(trimmed)) {
    return {
      valid: false,
      reason: 'personal_info',
      message: 'Please don\'t include phone numbers in your nickname for your safety!',
      suggestions: generateSuggestions(),
      severity: 'high'
    };
  }

  // Address indicators
  const addressKeywords = ['street', 'road', 'avenue', 'lane', 'drive', 'court', 'place', 'postcode'];
  for (const keyword of addressKeywords) {
    if (lower.includes(keyword)) {
      return {
        valid: false,
        reason: 'personal_info',
        message: 'Please don\'t include address information in your nickname for your safety!',
        suggestions: generateSuggestions(),
        severity: 'high'
      };
    }
  }

  // School name patterns
  for (const keyword of SCHOOL_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        valid: false,
        reason: 'personal_info',
        message: 'Please don\'t include your school name in your nickname for your safety!',
        suggestions: generateSuggestions(),
        severity: 'high'
      };
    }
  }

  // 5. Inappropriate content check
  for (const [category, keywords] of Object.entries(UNSAFE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword) || lower.includes(keyword)) {
        return {
          valid: false,
          reason: 'inappropriate_content',
          message: 'This nickname isn\'t appropriate for our safe space. Please choose a different one!',
          suggestions: generateSuggestions(),
          severity: 'high'
        };
      }
    }
  }

  // All checks passed
  return {
    valid: true,
    message: 'Great nickname choice! ✨'
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({
          valid: false,
          reason: 'missing_username',
          message: 'Please provide a username to validate',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Validating username:', username, 'for user:', user?.id || 'anonymous');

    // Perform validation
    const result = validateUsername(username);

    // Log validation attempt
    try {
      await supabaseClient.from('moderation_logs').insert({
        user_id: user?.id || null,
        input_text: username,
        is_safe: result.valid,
        category: result.reason || 'username_validation',
        confidence: result.valid ? 1.0 : 0.9,
        context: 'username_validation'
      });
    } catch (logError) {
      console.error('Error logging validation:', logError);
    }

    // Create safeguarding alert for high-severity violations
    if (!result.valid && result.severity === 'high' && user?.id) {
      try {
        await supabaseClient.from('safeguarding_alerts').insert({
          user_id: user.id,
          alert_type: 'username_personal_info',
          severity: 'medium',
          status: 'new',
          details: `User attempted to use personal information in username: ${username} (reason: ${result.reason})`
        });
        console.log('Created safeguarding alert for high-severity username violation');
      } catch (alertError) {
        console.error('Error creating safeguarding alert:', alertError);
      }
    }

    console.log('Validation result:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in validate-username function:', error);
    
    // Fail open - allow username if function errors
    return new Response(
      JSON.stringify({
        valid: true,
        message: 'Unable to verify username safety - proceeding with caution',
        failedOpen: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
