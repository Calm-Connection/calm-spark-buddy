import { Card, CardSection } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { format } from 'date-fns';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

interface TimelineEntry {
  id: string;
  date: string;
  tier: number;
  summary: string;
  themes: string[];
  moodScore: number;
  protectiveFactors?: string[];
}

interface TimelineViewProps {
  entries: TimelineEntry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  const getTierColor = (tier: number) => {
    if (tier === 4) return 'bg-accent/20 border-accent/50';
    if (tier === 3) return 'bg-primary/20 border-primary/50';
    if (tier === 2) return 'bg-interactive-accent/20 border-interactive-accent/50';
    return 'bg-muted/50 border-muted';
  };

  const getTierLabel = (tier: number) => {
    if (tier === 4) return 'Needs Your Attention Soon 💜';
    if (tier === 3) return 'Keep a Gentle Eye On 🌸';
    if (tier === 2) return 'Positive Check-In 🌿';
    return 'All Good 💚';
  };

  const getTierIcon = (tier: number) => {
    if (tier >= 3) return <AlertCircle className="h-4 w-4" />;
    if (tier === 2) return <Sparkles className="h-4 w-4" />;
    return <Heart className="h-4 w-4" />;
  };

  return (
    <Card className="relative">
      <DecorativeIcon icon="star" position="top-right" opacity={0.08} />
      
      <h3 className="text-2xl font-bold mb-6">Wellbeing Timeline</h3>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No entries yet</p>
          </div>
        ) : (
          entries.map((entry, idx) => (
            <div key={entry.id} className="relative pl-8">
              {/* Timeline line */}
              {idx !== entries.length - 1 && (
                <div className="absolute left-2 top-10 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div 
                className={`absolute left-0 top-3 w-5 h-5 rounded-full border-2 ${getTierColor(entry.tier)} flex items-center justify-center`}
              >
                {getTierIcon(entry.tier)}
              </div>

              <CardSection className={getTierColor(entry.tier)}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {getTierLabel(entry.tier)}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">Mood</div>
                      <div className="text-lg">{entry.moodScore}/10</div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed">{entry.summary}</p>

                  {entry.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.themes.map((theme, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {entry.protectiveFactors && entry.protectiveFactors.length > 0 && (
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs font-semibold mb-1 text-interactive-accent">
                        💚 Support present:
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.protectiveFactors.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </CardSection>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
