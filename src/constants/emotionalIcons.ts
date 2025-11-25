import { 
  Smile, Heart, Zap, Frown, Cloud, Meh, 
  Star, ThumbsUp, Sun, PartyPopper, Sparkles,
  Coffee, HelpCircle, AlertCircle, Flame,
  Annoyed, Angry, Frown as FrownIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface EmotionalIcon {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string; // HSL color for background
  category: 'positive' | 'neutral' | 'challenging';
}

export const emotionalIcons: EmotionalIcon[] = [
  // Positive emotions
  { id: 'happy', label: 'Happy', icon: Smile, color: 'hsl(142, 76%, 80%)', category: 'positive' },
  { id: 'excited', label: 'Excited', icon: Zap, color: 'hsl(48, 96%, 80%)', category: 'positive' },
  { id: 'calm', label: 'Calm', icon: Heart, color: 'hsl(217, 91%, 80%)', category: 'positive' },
  { id: 'proud', label: 'Proud', icon: Star, color: 'hsl(291, 47%, 80%)', category: 'positive' },
  { id: 'hopeful', label: 'Hopeful', icon: Sun, color: 'hsl(43, 96%, 80%)', category: 'positive' },
  { id: 'grateful', label: 'Grateful', icon: ThumbsUp, color: 'hsl(142, 71%, 80%)', category: 'positive' },
  { id: 'peaceful', label: 'Peaceful', icon: Sparkles, color: 'hsl(204, 86%, 80%)', category: 'positive' },
  
  // Neutral emotions
  { id: 'okay', label: 'Okay', icon: Meh, color: 'hsl(0, 0%, 75%)', category: 'neutral' },
  { id: 'tired', label: 'Tired', icon: Coffee, color: 'hsl(30, 40%, 75%)', category: 'neutral' },
  { id: 'confused', label: 'Confused', icon: HelpCircle, color: 'hsl(240, 20%, 75%)', category: 'neutral' },
  { id: 'bored', label: 'Bored', icon: Cloud, color: 'hsl(0, 0%, 70%)', category: 'neutral' },
  
  // Challenging emotions
  { id: 'sad', label: 'Sad', icon: Frown, color: 'hsl(217, 71%, 80%)', category: 'challenging' },
  { id: 'angry', label: 'Angry', icon: Flame, color: 'hsl(0, 84%, 80%)', category: 'challenging' },
  { id: 'anxious', label: 'Anxious', icon: AlertCircle, color: 'hsl(48, 96%, 80%)', category: 'challenging' },
  { id: 'worried', label: 'Worried', icon: Cloud, color: 'hsl(0, 0%, 75%)', category: 'challenging' },
  { id: 'lonely', label: 'Lonely', icon: FrownIcon, color: 'hsl(240, 30%, 80%)', category: 'challenging' },
  { id: 'frustrated', label: 'Frustrated', icon: Annoyed, color: 'hsl(25, 95%, 80%)', category: 'challenging' },
  { id: 'embarrassed', label: 'Embarrassed', icon: AlertCircle, color: 'hsl(350, 80%, 85%)', category: 'challenging' },
  { id: 'nervous', label: 'Nervous', icon: AlertCircle, color: 'hsl(48, 96%, 80%)', category: 'challenging' },
  { id: 'scared', label: 'Scared', icon: AlertCircle, color: 'hsl(270, 50%, 85%)', category: 'challenging' },
];

export const getEmotionalIcon = (moodId: string): EmotionalIcon | undefined => {
  return emotionalIcons.find(icon => icon.id === moodId);
};

export const getEmotionalIconsByCategory = (category: 'positive' | 'neutral' | 'challenging') => {
  return emotionalIcons.filter(icon => icon.category === category);
};
