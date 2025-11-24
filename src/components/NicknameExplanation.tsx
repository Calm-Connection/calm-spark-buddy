import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserX, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NicknameExplanationVariant = 'compact' | 'medium' | 'full';

interface NicknameExplanationProps {
  variant?: NicknameExplanationVariant;
  className?: string;
  defaultExpanded?: boolean;
}

export function NicknameExplanation({
  variant = 'compact',
  className,
  defaultExpanded = false
}: NicknameExplanationProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const content = {
    title: "Why we use nicknames instead of real names",
    shortText: "At Calm Connection, your privacy and safety are our top priority. We use nicknames (pseudonyms) to help everyone feel safe to express themselves.",
    benefits: [
      "Children can write honestly without worrying",
      "Parents connect safely without sharing personal details",
      "Everyone stays private and protected"
    ],
    examples: [
      "Your child will choose a fun nickname when they sign up",
      "Parents also use nicknames inside the app's shared spaces",
      "Real names, schools, and personal details are never shown"
    ],
    goodExamples: ["StarGazer", "CozyCloud", "OceanDreamer", "BookwormKid"],
    badExamples: ["Real names", "Email addresses", "School names", "Locations"]
  };

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          <UserX className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-sm text-foreground">
              {content.title}
            </h3>
          </div>
          {variant === 'compact' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 w-6 p-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Content - always shown for medium/full, collapsible for compact */}
        {(variant !== 'compact' || expanded) && (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{content.shortText}</p>
            
            {/* Benefits */}
            <div className="space-y-1">
              {content.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Examples (medium and full only) */}
            {variant !== 'compact' && (
              <div className="space-y-1">
                {content.examples.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Good/Bad Examples (full only) */}
            {variant === 'full' && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border border-green-500/30 bg-green-500/5 p-3 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 text-xs">
                    ✅ Good Examples
                  </h4>
                  <ul className="space-y-1 text-xs">
                    {content.goodExamples.map((ex, idx) => (
                      <li key={idx}>• {ex}</li>
                    ))}
                  </ul>
                </div>
                <div className="border border-red-500/30 bg-red-500/5 p-3 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 text-xs">
                    ❌ Not Allowed
                  </h4>
                  <ul className="space-y-1 text-xs">
                    {content.badExamples.map((ex, idx) => (
                      <li key={idx}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Link to Learn More page */}
            <Link 
              to="/learn-more#pseudonyms" 
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn more about our pseudonym policy →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}