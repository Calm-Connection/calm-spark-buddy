// Avatar asset generation prompts for one-time setup
export const ASSET_GENERATION_PROMPTS = {
  faces: {
    light: "A Disney/Pixar style child's face with light peachy skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    fair: "A Disney/Pixar style child's face with fair skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    medium: "A Disney/Pixar style child's face with medium skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    olive: "A Disney/Pixar style child's face with olive skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    tan: "A Disney/Pixar style child's face with tan skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    brown: "A Disney/Pixar style child's face with brown skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    dark: "A Disney/Pixar style child's face with dark skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
    deep: "A Disney/Pixar style child's face with deep brown skin tone, front view, neutral gentle expression, no eyes, no hair, no accessories, simple and clean, on transparent background, 1024x1024, high quality cartoon style, soft lighting",
  },
  eyes: {
    brown: "A pair of Disney/Pixar style cartoon eyes, brown colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    blue: "A pair of Disney/Pixar style cartoon eyes, blue colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    green: "A pair of Disney/Pixar style cartoon eyes, green colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    hazel: "A pair of Disney/Pixar style cartoon eyes, hazel colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    gray: "A pair of Disney/Pixar style cartoon eyes, gray colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    amber: "A pair of Disney/Pixar style cartoon eyes, amber colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    violet: "A pair of Disney/Pixar style cartoon eyes, violet colored, with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    honey: "A pair of Disney/Pixar style cartoon eyes, honey colored (warm golden amber), with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    onyx: "A pair of Disney/Pixar style cartoon eyes, onyx colored (deep black with subtle shine), with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
    silver: "A pair of Disney/Pixar style cartoon eyes, silver colored (light metallic gray), with sparkle highlights, looking forward, friendly and kind expression, no face, transparent background, centered composition",
  },
};

// Object-based avatar system
export const AVATAR_OBJECTS = {
  teddyBear: {
    id: 'teddyBear',
    label: 'Teddy Bear',
    emoji: '🧸',
    description: 'A soft, cuddly bear friend',
  },
  toyCar: {
    id: 'toyCar',
    label: 'Toy Car',
    emoji: '🚗',
    description: 'A fun, zippy vehicle',
  },
  starCharacter: {
    id: 'starCharacter',
    label: 'Star Character',
    emoji: '⭐',
    description: 'A glowing, magical star',
  },
  cloudCreature: {
    id: 'cloudCreature',
    label: 'Cloud Creature',
    emoji: '☁️',
    description: 'A fluffy, dreamy cloud',
  },
  softAnimal: {
    id: 'softAnimal',
    label: 'Soft Animal',
    emoji: '🐰',
    description: 'A gentle animal friend',
  },
};

export const OBJECT_COLORS = [
  { id: 'pink', label: 'Pink', value: 'soft pink', hex: '#FFB6D9' },
  { id: 'purple', label: 'Purple', value: 'gentle purple', hex: '#D4B5FF' },
  { id: 'blue', label: 'Blue', value: 'calm blue', hex: '#A8D8FF' },
  { id: 'teal', label: 'Teal', value: 'peaceful teal', hex: '#7DD3C0' },
  { id: 'green', label: 'Green', value: 'fresh green', hex: '#B4E7CE' },
  { id: 'yellow', label: 'Yellow', value: 'sunny yellow', hex: '#FFE5A0' },
  { id: 'orange', label: 'Orange', value: 'warm orange', hex: '#FFCBA4' },
  { id: 'red', label: 'Red', value: 'bright red', hex: '#FFB4B4' },
  { id: 'brown', label: 'Brown', value: 'cozy brown', hex: '#D4A574' },
  { id: 'white', label: 'White', value: 'pure white', hex: '#FFFFFF' },
  { id: 'gray', label: 'Gray', value: 'soft gray', hex: '#C4C4C4' },
  { id: 'black', label: 'Black', value: 'deep black', hex: '#4A4A4A' },
];

export const EYE_STYLES = [
  { id: 'sparkly', label: 'Sparkly', value: 'round sparkly eyes with big highlights' },
  { id: 'bright', label: 'Bright', value: 'big bright eyes' },
  { id: 'gentle', label: 'Gentle', value: 'sleepy gentle eyes' },
  { id: 'excited', label: 'Excited', value: 'wide excited eyes' },
  { id: 'winking', label: 'Winking', value: 'winking eyes' },
  { id: 'happy', label: 'Happy', value: 'happy crescent moon shaped eyes' },
  { id: 'calm', label: 'Calm', value: 'cool calm eyes' },
];

export const EYE_COLORS = [
  { id: 'brown', label: 'Brown', value: 'brown' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
  { id: 'hazel', label: 'Hazel', value: 'hazel' },
  { id: 'gray', label: 'Gray', value: 'gray' },
  { id: 'amber', label: 'Amber', value: 'amber' },
  { id: 'violet', label: 'Violet', value: 'violet' },
  { id: 'onyx', label: 'Onyx', value: 'onyx black' },
  { id: 'honey', label: 'Honey', value: 'honey gold' },
  { id: 'silver', label: 'Silver', value: 'silver' },
];

export const OBJECT_ACCESSORIES = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'bow', label: 'Bow', value: 'a cute bow' },
  { id: 'ribbon', label: 'Ribbon', value: 'a colorful ribbon' },
  { id: 'hat', label: 'Hat', value: 'a small hat' },
  { id: 'crown', label: 'Crown', value: 'a tiny crown' },
  { id: 'flowers', label: 'Flowers', value: 'small flowers' },
  { id: 'bandana', label: 'Bandana', value: 'a bandana' },
  { id: 'stickers', label: 'Stickers', value: 'fun stickers' },
  { id: 'glasses', label: 'Glasses', value: 'cute glasses' },
];

export const COMFORT_ITEMS = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'blanket', label: 'Blanket', value: 'a small cozy blanket' },
  { id: 'heart', label: 'Heart', value: 'a heart badge' },
  { id: 'star', label: 'Star', value: 'a star badge' },
  { id: 'music', label: 'Music', value: 'a music note' },
  { id: 'rainbow', label: 'Rainbow', value: 'a tiny rainbow' },
  { id: 'smiley', label: 'Smiley', value: 'a smiley face' },
  { id: 'butterfly', label: 'Butterfly', value: 'a butterfly' },
];

export function getAssetBaseUrl() {
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatar-assets`;
}

export function getAssetUrl(type: string, key: string) {
  return `${getAssetBaseUrl()}/${type}/${key}.png`;
}
