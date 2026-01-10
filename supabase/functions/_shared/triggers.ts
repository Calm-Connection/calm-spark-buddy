// Centralized Trigger System for Calm Connection
// This module provides a single source of truth for all safeguarding triggers
// organized into a tiered system for appropriate response escalation.

// ═══════════════════════════════════════════════════════════════
// TIER DEFINITIONS
// ═══════════════════════════════════════════════════════════════
// Tier A: Monitor - Normal emotions, no escalation needed
// Tier B: Concern - Persistent distress, gentle support, possible carer update
// Tier C: High Risk - Immediate safeguarding action required

export const TRIGGERS = {
  // ═══════════════════════════════════════════════════════════════
  // TIER C: HIGH RISK - Always escalate immediately
  // ═══════════════════════════════════════════════════════════════
  tierC: {
    selfHarm: [
      // Direct self-harm language
      'hurt myself', 'hurting myself', 'kill myself', 'killing myself',
      'want to die', 'wish i was dead', 'suicidal', 'end it all',
      'end my life', 'cutting myself', 'cut myself', 'burning myself',
      'hitting myself', 'self harm', 'self-harm', 'selfharm',
      'better off dead', 'nobody would miss me',
      
      // Passive suicidal ideation
      'dont want to wake up', "don't want to wake up",
      'go to sleep forever', 'sleep forever',
      'tired of everything', 'tired of living',
      'wish i wasnt here', "wish i wasn't here",
      'want to disappear forever', 'disappear forever',
      'no point anymore', 'no point in living',
      'everyone would be happier without me',
      'nobody would care if i was gone',
      'what is the point', 'whats the point',
      'no reason to keep going', 'cant go on',
      
      // Coded/subtle self-harm
      'scratching myself', 'picking my skin', 'banging my head',
      'pulling my hair out', 'biting myself', 'hurting my body'
    ],
    
    abuse: [
      // Direct abuse language
      'abuse', 'abused', 'touched me', 'touched inappropriately',
      'hurts me', 'hits me', 'scared of him', 'scared of her',
      'scared of them', 'unsafe at home', 'scared to go home',
      'someone hurt me', 'theyre hurting me', "they're hurting me",
      
      // Domestic distress
      'mum and dad fight', 'mom and dad fight',
      'they shout every night', 'hear them hurting each other',
      'they hit each other', 'violence at home',
      'scared when they argue', 'hide when they fight',
      'parents fight all the time', 'they scream at each other',
      
      // Grooming indicators
      'secret friend', 'special relationship', 'dont tell anyone',
      "don't tell anyone about us", 'our secret',
      'they said not to tell', 'keep it between us',
      'special between us', 'you wont tell anyone',
      'secret from my parents', 'adult friend online',
      'older friend wants to meet'
    ],
    
    severeBullying: [
      // Persistent bullying
      "they won't stop", 'they wont stop', 'everyone hates me',
      'scared to go to school', 'they hurt me every day',
      'everyone picks on me', 'theyre mean to me every day',
      'they wont leave me alone', "they won't leave me alone",
      'nobody wants me around', 'they all want me gone',
      
      // Cyberbullying
      'they shared my messages', 'they shared my photos',
      'they posted about me', 'everyone is laughing at me online',
      'they screenshot my messages', 'they made a group about me',
      'they said horrible things online', 'spreading rumours about me',
      'posted embarrassing photos', 'shared my private stuff',
      'made a fake account of me', 'pretending to be me online'
    ],
    
    harmToOthers: [
      'want to hurt someone', 'going to hurt them',
      'make them pay', 'do something bad to them',
      'want to kill them', 'wish they were dead',
      'going to do something bad'
    ],
    
    eatingCrisis: [
      'starving myself', 'making myself sick', 'purging',
      'havent eaten in days', "haven't eaten in days",
      'need to stop eating', 'throwing up my food',
      'making myself throw up', 'not eating on purpose'
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════
  // TIER B: CONCERN - Gentle support, possible carer notification
  // ═══════════════════════════════════════════════════════════════
  tierB: {
    persistentDistress: [
      'nobody cares', 'no one cares', 'feel so alone',
      'im so alone', "i'm so alone", 'hate myself',
      'worthless', 'useless', 'i cant do anything right',
      "i can't do anything right", 'im a failure',
      'feel invisible', 'nobody sees me', 'nobody listens',
      'no one understands me', 'always alone'
    ],
    
    anxiety: [
      "can't breathe", 'cant breathe', 'heart racing',
      'heart wont stop', "heart won't stop", 'panic',
      'going to be sick', 'feel sick with worry',
      'too scared', 'really scared', 'terrified',
      'cant stop shaking', "can't stop shaking"
    ],
    
    schoolAnxiety: [
      "can't face school", 'cant face school',
      'feel sick before school', 'too scared to go in',
      'dont want to go to school', "don't want to go to school",
      'school makes me feel sick', 'dread going to school',
      'cant cope at school', "can't cope at school",
      'feel ill every morning', 'sick thinking about school'
    ],
    
    bodyImage: [
      'hate my body', 'wish i looked different',
      'too fat', 'too ugly', 'need to lose weight',
      "don't like how i look", 'dont like how i look',
      'hate how i look', 'so ugly'
    ],
    
    sleepDistress: [
      'cant sleep', "can't sleep", 'nightmares every night',
      'scared to sleep', 'bad dreams', 'wake up scared',
      'havent slept', "haven't slept", 'too scared to close my eyes'
    ],
    
    substances: [
      'been drinking', 'tried drugs', 'smoking', 'vaping',
      'getting high', 'taking something', 'tried alcohol'
    ],
    
    overwhelm: [
      'too much', 'cant cope', "can't cope",
      'everything is too much', 'feel like im drowning',
      'head is going to explode', 'cant handle this'
    ]
  },
  
  // ═══════════════════════════════════════════════════════════════
  // TIER A: MONITOR - Normal emotions, no escalation
  // ═══════════════════════════════════════════════════════════════
  tierA: {
    sadness: [
      'feel sad', 'feeling sad', 'feeling down',
      'bit sad', 'a bit sad', 'unhappy today',
      'feel blue', 'a bit down'
    ],
    frustration: [
      'so annoyed', 'really annoyed', 'frustrated',
      'makes me mad', 'really angry', 'so angry',
      'fed up', 'drives me crazy'
    ],
    worry: [
      'bit worried', 'a bit worried', 'nervous about',
      'anxious about', 'worried about', 'a little nervous'
    ],
    normalExpressions: [
      'bad day', 'rough day', 'tough day',
      'didnt go well', "didn't go well",
      'hard day', 'not great day'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// CONTEXT-SENSITIVE WORDS
// ═══════════════════════════════════════════════════════════════
// Words that need context checking - they can be concerning OR innocent
// depending on usage. These should only escalate when NOT in safe contexts.

export const CONTEXT_SENSITIVE_WORDS = [
  'hate', 'hurt', 'die', 'died', 'dead', 'death',
  'kill', 'killed', 'blood', 'stupid'
];

// Safe contexts for context-sensitive words
// If these appear alongside the sensitive word, don't escalate
export const SAFE_CONTEXTS: Record<string, string[]> = {
  'hate': [
    'homework', 'mondays', 'vegetables', 'broccoli', 'waiting', 
    'rain', 'cold', 'hot', 'tests', 'exams', 'maths', 'math',
    'getting up early', 'mornings', 'chores', 'cleaning',
    'hate waiting', 'hate homework', 'hate tests'
  ],
  'hurt': [
    'feelings were hurt', 'it hurt my feelings', 'fell and hurt',
    'hurt my knee', 'hurt my arm', 'hurt my leg', 'hurt my finger',
    'hurt my toe', 'hurt when i fell', 'accidentally hurt',
    'hurt myself falling', 'hurt playing'
  ],
  'die': [
    'bored', 'dying of', 'laughing', 'dying to', 'pet died',
    'fish died', 'hamster died', 'grandma died', 'grandad died',
    'grandpa died', 'nan died', 'nana died', 'dog died', 'cat died',
    'dying of boredom', 'dying to try', 'dying to see'
  ],
  'dead': [
    'phone is dead', 'battery dead', 'so dead tired', 'deadtired',
    'dead battery', 'tablet is dead', 'my phone died'
  ],
  'kill': [
    'killing it', 'killed it', 'killed the game', 'killed my score',
    'you killed that', 'absolutely killed it', 'slayed'
  ],
  'blood': [
    'blood test', 'give blood', 'blood type', 'nosebleed',
    'cut my finger', 'scraped my knee', 'grazed'
  ],
  'stupid': [
    'feel stupid', 'made a stupid mistake', 'that was stupid of me',
    'stupid homework', 'stupid game', 'stupid weather'
  ]
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Normalize text for matching - handles spelling variations, leetspeak, etc.
 */
export function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    // Handle contractions
    .replace(/self\s*-?\s*harm/gi, 'selfharm')
    .replace(/can\s*'?\s*t/gi, 'cant')
    .replace(/don\s*'?\s*t/gi, 'dont')
    .replace(/won\s*'?\s*t/gi, 'wont')
    .replace(/i\s*'?\s*m\b/gi, 'im')
    .replace(/they\s*'?\s*re/gi, 'theyre')
    .replace(/haven\s*'?\s*t/gi, 'havent')
    .replace(/isn\s*'?\s*t/gi, 'isnt')
    .replace(/wasn\s*'?\s*t/gi, 'wasnt')
    .replace(/wouldn\s*'?\s*t/gi, 'wouldnt')
    // Handle leetspeak
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if text contains a context-sensitive word in a safe context
 */
export function isWordInSafeContext(text: string, word: string): boolean {
  const lowerText = text.toLowerCase();
  const safeContexts = SAFE_CONTEXTS[word] || [];
  
  // If the word isn't in the text, return true (not a concern)
  if (!lowerText.includes(word)) {
    return true;
  }
  
  // Check if any safe context is present
  return safeContexts.some(context => lowerText.includes(context.toLowerCase()));
}

/**
 * Detection result interface
 */
export interface TriggerDetectionResult {
  tier: 'A' | 'B' | 'C' | null;
  keywords: string[];
  category: string | null;
  requiresEscalation: boolean;
  contextSensitiveFlags: string[];
}

/**
 * Detect triggers in text and return appropriate tier
 */
export function detectTriggers(text: string): TriggerDetectionResult {
  const normalized = normalizeForMatching(text);
  const originalLower = text.toLowerCase();
  const detectedKeywords: string[] = [];
  const contextSensitiveFlags: string[] = [];
  
  // Check Tier C first (highest priority)
  for (const [category, keywords] of Object.entries(TRIGGERS.tierC)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeForMatching(keyword);
      if (normalized.includes(normalizedKeyword)) {
        detectedKeywords.push(keyword);
        return {
          tier: 'C',
          keywords: [keyword],
          category,
          requiresEscalation: true,
          contextSensitiveFlags: []
        };
      }
    }
  }
  
  // Check context-sensitive words
  for (const word of CONTEXT_SENSITIVE_WORDS) {
    if (originalLower.includes(word)) {
      if (!isWordInSafeContext(originalLower, word)) {
        contextSensitiveFlags.push(word);
      }
    }
  }
  
  // Check Tier B
  for (const [category, keywords] of Object.entries(TRIGGERS.tierB)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeForMatching(keyword);
      if (normalized.includes(normalizedKeyword)) {
        return {
          tier: 'B',
          keywords: [keyword],
          category,
          requiresEscalation: false,
          contextSensitiveFlags
        };
      }
    }
  }
  
  // Check Tier A (just for logging, no escalation)
  for (const [category, keywords] of Object.entries(TRIGGERS.tierA)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeForMatching(keyword);
      if (normalized.includes(normalizedKeyword)) {
        return {
          tier: 'A',
          keywords: [keyword],
          category,
          requiresEscalation: false,
          contextSensitiveFlags
        };
      }
    }
  }
  
  return {
    tier: null,
    keywords: [],
    category: null,
    requiresEscalation: false,
    contextSensitiveFlags
  };
}

/**
 * Get all Tier C keywords as a flat array (for client-side use)
 */
export function getAllTierCKeywords(): string[] {
  const allKeywords: string[] = [];
  for (const keywords of Object.values(TRIGGERS.tierC)) {
    allKeywords.push(...keywords);
  }
  return allKeywords;
}

/**
 * Map trigger tier to escalation tier number
 */
export function mapTriggerTierToEscalationTier(triggerTier: 'A' | 'B' | 'C' | null): 1 | 2 | 3 | 4 {
  switch (triggerTier) {
    case 'C': return 4; // Immediate escalation
    case 'B': return 3; // Carer notification
    case 'A': return 2; // Tool suggestion
    default: return 1;  // Supportive monitoring
  }
}
