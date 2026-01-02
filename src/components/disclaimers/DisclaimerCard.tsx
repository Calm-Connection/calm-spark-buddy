import { AlertCircle, Bot, Shield, Info, Eye, Users, Database, Phone, Heart, Sparkles, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type DisclaimerVariant =
  | 'emergency'
  | 'ai-limitation'
  | 'wendy-ai'
  | 'tool-limitation'
  | 'privacy-sharing'
  | 'parent-monitoring'
  | 'data-usage'
  | 'crisis-support'
  // New variants
  | 'crisis-full'
  | 'crisis-short'
  | 'journal-full'
  | 'journal-short'
  | 'ai-full'
  | 'ai-short'
  | 'carer-responsibility-full'
  | 'carer-responsibility-short'
  | 'content-full'
  | 'content-short'
  | 'data-privacy-short'
  | 'combined-ultra-short';

export type DisclaimerSize = 'small' | 'medium' | 'large';

interface DisclaimerCardProps {
  variant: DisclaimerVariant;
  size?: DisclaimerSize;
  dismissible?: boolean;
  className?: string;
}

interface ContactInfo {
  name: string;
  number: string;
  description: string;
}

interface DisclaimerContent {
  icon: typeof AlertCircle;
  title: string;
  description: string;
  contacts?: ContactInfo[];
  severity: 'default' | 'destructive';
}

const disclaimerContent: Record<DisclaimerVariant, DisclaimerContent> = {
  emergency: {
    icon: Phone,
    title: 'Not an Emergency Service',
    description:
      'If you or someone you know is in immediate danger, please call 999 (UK) or your local emergency services. Calm Connection cannot respond to emergencies.',
    contacts: [
      { name: 'Emergency', number: '999', description: 'Immediate danger' },
      { name: 'Childline', number: '0800 1111', description: 'Free, confidential support' },
      { name: 'Samaritans', number: '116 123', description: '24/7 listening service' },
    ],
    severity: 'destructive',
  },
  'ai-limitation': {
    icon: AlertCircle,
    title: 'Here to Help, Not Replace',
    description:
      'Calm Connection is here to help you feel calmer and understand your feelings. If you ever need extra help, please talk to a grown-up you trust — they can find the right person to support you.',
    severity: 'default',
  },
  'wendy-ai': {
    icon: Bot,
    title: 'Wendy is an AI Friend, Not a Real Person',
    description:
      'Wendy uses artificial intelligence to understand your feelings and suggest helpful activities. She\'s kind and caring, but she\'s a computer program, not a human counselor. She can\'t replace talking to real people you trust.',
    severity: 'default',
  },
  'tool-limitation': {
    icon: Info,
    title: 'Tools Are for Support, Not Treatment',
    description:
      'Our breathing exercises, mood tracking, and calming activities are designed to help you feel better. They\'re not medical treatments. If you\'re struggling with your mental health, please tell a trusted adult.',
    severity: 'default',
  },
  'privacy-sharing': {
    icon: Eye,
    title: 'You Control What Your Carer Sees',
    description:
      'Your journal is private unless you choose to share an entry. When you click "Share with carer," they\'ll be able to read that specific entry. You can change your mind anytime.',
    severity: 'default',
  },
  'parent-monitoring': {
    icon: Users,
    title: 'Parents Can See Shared Entries & Mood Trends',
    description:
      'Your linked carer can see: entries you share, mood check-in summaries, and which tools you use. They can\'t see your private journal entries unless you share them.',
    severity: 'default',
  },
  'data-usage': {
    icon: Database,
    title: 'How We Use Your Information',
    description:
      'We analyze journal entries with AI (Wendy) to spot if you need extra support. If we\'re worried about your safety, we\'ll alert your carer and our safeguarding team. We never sell your data or use it for advertising.',
    severity: 'default',
  },
  'crisis-support': {
    icon: Shield,
    title: 'In Crisis? Get Help Now',
    description:
      'If you\'re having thoughts of self-harm or feeling overwhelmed, please reach out for immediate support. These services are free, confidential, and available 24/7.',
    contacts: [
      { name: 'Childline', number: '0800 1111', description: 'Call or chat online' },
      { name: 'Shout', number: 'Text SHOUT to 85258', description: 'Text support' },
      { name: 'Samaritans', number: '116 123', description: 'Anytime, for anyone' },
    ],
    severity: 'destructive',
  },
  // New variants with exact user-specified text
  'crisis-full': {
    icon: Heart,
    title: 'Emergency Support',
    description:
      'If you or your child are in crisis, feeling unsafe, or struggling to cope, please seek help from a qualified professional immediately.',
    contacts: [
      { name: 'UK: Childline', number: '0800 1111', description: 'Free, confidential support' },
      { name: 'UK: Samaritans', number: '116 123', description: 'Freephone, 24/7' },
      { name: 'US: 988 Lifeline', number: '988', description: 'Call or text 988' },
    ],
    severity: 'destructive',
  },
  'crisis-short': {
    icon: Heart,
    title: '',
    description: 'If you or your child feel unsafe or overwhelmed, please seek professional help.',
    severity: 'default',
  },
  'journal-full': {
    icon: BookOpen,
    title: 'Your Private Space',
    description:
      'This journal is a private space for reflection and emotional expression. It is not a substitute for professional advice, diagnosis, or treatment.\n\nWe do not routinely read journal entries. Analysis only occurs if you explicitly opt in to AI insights or sharing features, except where safeguarding concerns require action in line with our Safeguarding Policy.\n\nEntries are confidential, but no digital platform can guarantee complete security. Please avoid including highly sensitive personal details such as addresses, phone numbers, or names of others.',
    severity: 'default',
  },
  'journal-short': {
    icon: BookOpen,
    title: '',
    description: 'This journal is for reflection, not professional advice.',
    severity: 'default',
  },
  'ai-full': {
    icon: Bot,
    title: 'AI Support Tools',
    description:
      'AI tools in Calm Connection provide supportive suggestions and prompts. They are not a replacement for professional care or advice from a qualified health provider.\n\nAI responses are generated automatically and may not always be accurate or suitable for every situation. Use your own judgment and seek professional guidance if unsure.\n\nAI analysis only occurs with your consent, in line with your Privacy settings.',
    severity: 'default',
  },
  'ai-short': {
    icon: Bot,
    title: '',
    description: 'AI suggestions are supportive, not medical advice.',
    severity: 'default',
  },
  'carer-responsibility-full': {
    icon: Users,
    title: 'Your Role as Carer',
    description:
      'Calm Connection is designed to support families in exploring emotions and building resilience. It does not replace active parental or carer involvement.\n\nParents and carers remain responsible for their child\'s wellbeing and are encouraged to regularly check in and support app use.',
    severity: 'default',
  },
  'carer-responsibility-short': {
    icon: Users,
    title: '',
    description: 'Calm Connection supports families — carers remain responsible for a child\'s wellbeing.',
    severity: 'default',
  },
  'content-full': {
    icon: Sparkles,
    title: 'Wellbeing Resources',
    description:
      'Wellbeing resources, exercises, and meditations are provided for general support and information only. They are not intended to diagnose, treat, cure, or prevent any condition.\n\nAlways seek personalised advice from a qualified health professional when needed.',
    severity: 'default',
  },
  'content-short': {
    icon: Sparkles,
    title: '',
    description: 'These resources support wellbeing but are not treatment.',
    severity: 'default',
  },
  'data-privacy-short': {
    icon: Eye,
    title: '',
    description: 'Your data is private and only used based on your chosen settings.',
    severity: 'default',
  },
  'combined-ultra-short': {
    icon: Heart,
    title: '',
    description: 'Calm Connection offers wellbeing tools, not professional care. Please seek help if you or your child are struggling.',
    severity: 'default',
  },
};

export function DisclaimerCard({
  variant,
  size = 'medium',
  dismissible = false,
  className,
}: DisclaimerCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const content = disclaimerContent[variant];
  const Icon = content.icon;

  const sizeClasses = {
    small: 'text-xs p-3',
    medium: 'text-sm p-4',
    large: 'text-base p-6',
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };

  // Short variants with no title render as inline text
  const isInlineVariant = !content.title && ['crisis-short', 'journal-short', 'ai-short', 'carer-responsibility-short', 'content-short', 'data-privacy-short', 'combined-ultra-short'].includes(variant);

  if (isInlineVariant) {
    return (
      <p className={cn('text-xs text-muted-foreground flex items-center gap-1.5', className)}>
        <Icon className="h-3 w-3 flex-shrink-0" />
        <span>{content.description}</span>
      </p>
    );
  }

  return (
    <Alert
      variant={content.severity}
      className={cn(sizeClasses[size], className)}
    >
      <Icon className={iconSizes[size]} />
      <AlertDescription>
        <div className="space-y-2">
          {content.title && <strong className="block">{content.title}</strong>}
          <p className="whitespace-pre-line">{content.description}</p>

          {content.contacts && content.contacts.length > 0 && (
            <div className="space-y-2 mt-3">
              {content.contacts.map((contact) => (
                <div
                  key={contact.number}
                  className="flex items-start justify-between bg-background/50 p-2 rounded-md"
                >
                  <div className="flex-1">
                    <strong className="block">{contact.name}</strong>
                    <p className="text-xs opacity-80">{contact.description}</p>
                  </div>
                  <a
                    href={
                      contact.number.includes('Text')
                        ? `sms:85258?body=SHOUT`
                        : `tel:${contact.number.replace(/\s/g, '')}`
                    }
                    className="font-bold text-sm bg-background px-3 py-1 rounded-md hover:bg-background/80 transition-colors whitespace-nowrap ml-2"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          )}

          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="mt-2 w-full"
            >
              I Understand
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
