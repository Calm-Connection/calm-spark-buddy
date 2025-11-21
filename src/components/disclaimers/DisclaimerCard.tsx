import { AlertCircle, Bot, Shield, Info, Eye, Users, Database, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  | 'crisis-support';

export type DisclaimerSize = 'small' | 'medium' | 'large';

interface DisclaimerCardProps {
  variant: DisclaimerVariant;
  size?: DisclaimerSize;
  dismissible?: boolean;
  className?: string;
}

const disclaimerContent = {
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
    severity: 'destructive' as const,
  },
  'ai-limitation': {
    icon: AlertCircle,
    title: 'This Is Not Professional Advice',
    description:
      'Calm Connection provides emotional support tools but is not a substitute for professional medical, therapeutic, or psychiatric care. If you need clinical help, please speak to your GP, school counselor, or contact NHS services.',
    severity: 'default' as const,
  },
  'wendy-ai': {
    icon: Bot,
    title: 'Wendy is an AI Friend, Not a Real Person',
    description:
      'Wendy uses artificial intelligence to understand your feelings and suggest helpful activities. She\'s kind and caring, but she\'s a computer program, not a human counselor. She can\'t replace talking to real people you trust.',
    severity: 'default' as const,
  },
  'tool-limitation': {
    icon: Info,
    title: 'Tools Are for Support, Not Treatment',
    description:
      'Our breathing exercises, mood tracking, and calming activities are designed to help you feel better. They\'re not medical treatments. If you\'re struggling with your mental health, please tell a trusted adult.',
    severity: 'default' as const,
  },
  'privacy-sharing': {
    icon: Eye,
    title: 'You Control What Your Carer Sees',
    description:
      'Your journal is private unless you choose to share an entry. When you click "Share with carer," they\'ll be able to read that specific entry. You can change your mind anytime.',
    severity: 'default' as const,
  },
  'parent-monitoring': {
    icon: Users,
    title: 'Parents Can See Shared Entries & Mood Trends',
    description:
      'Your linked carer can see: entries you share, mood check-in summaries, and which tools you use. They can\'t see your private journal entries unless you share them.',
    severity: 'default' as const,
  },
  'data-usage': {
    icon: Database,
    title: 'How We Use Your Information',
    description:
      'We analyze journal entries with AI (Wendy) to spot if you need extra support. If we\'re worried about your safety, we\'ll alert your carer and our safeguarding team. We never sell your data or use it for advertising.',
    severity: 'default' as const,
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
    severity: 'destructive' as const,
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

  return (
    <Alert
      variant={content.severity}
      className={cn(sizeClasses[size], className)}
    >
      <Icon className={iconSizes[size]} />
      <AlertDescription>
        <div className="space-y-2">
          <strong className="block">{content.title}</strong>
          <p>{content.description}</p>

          {'contacts' in content && content.contacts && (
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
