import { Card, CardSection } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { TrendingUp, TrendingDown, Heart, Sparkles } from 'lucide-react';

interface PatternInsightsCardProps {
  recurringThemes: string[];
  moodTrajectory: 'improving' | 'stable' | 'declining';
  toolUsageCorrelation: { tool: string; effectiveness: number }[];
  protectiveFactors: string[];
}

export function PatternInsightsCard({
  recurringThemes,
  moodTrajectory,
  toolUsageCorrelation,
  protectiveFactors
}: PatternInsightsCardProps) {
  const getMoodTrendIcon = () => {
    if (moodTrajectory === 'improving') return <TrendingUp className="h-5 w-5 text-interactive-accent" />;
    if (moodTrajectory === 'declining') return <TrendingDown className="h-5 w-5 text-accent" />;
    return <div className="h-5 w-5 rounded-full bg-muted" />;
  };

  const getMoodTrendText = () => {
    if (moodTrajectory === 'improving') return 'Getting Better 💜';
    if (moodTrajectory === 'declining') return 'Needs Extra Support 🌸';
    return 'Staying Steady 🌿';
  };

  return (
    <Card className="relative">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.08} />
      
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        Pattern Insights
      </h3>

      <div className="space-y-6">
        {/* Mood Trajectory */}
        <CardSection>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-lg">Recent Mood Journey</h4>
            {getMoodTrendIcon()}
          </div>
          <p className="text-muted-foreground">{getMoodTrendText()}</p>
        </CardSection>

        {/* Recurring Themes */}
        {recurringThemes.length > 0 && (
          <CardSection>
            <h4 className="font-semibold text-lg mb-3">Themes We're Noticing</h4>
            <div className="flex flex-wrap gap-2">
              {recurringThemes.map((theme, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardSection>
        )}

        {/* Tool Effectiveness */}
        {toolUsageCorrelation.length > 0 && (
          <CardSection>
            <h4 className="font-semibold text-lg mb-3">What's Helping Most</h4>
            <div className="space-y-2">
              {toolUsageCorrelation.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{item.tool}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < Math.round(item.effectiveness * 5)
                            ? 'bg-interactive-accent'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {/* Protective Factors */}
        {protectiveFactors.length > 0 && (
          <CardSection className="bg-interactive-accent/10 border-interactive-accent/30">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-interactive-accent" />
              Strengths & Support
            </h4>
            <ul className="space-y-2">
              {protectiveFactors.map((factor, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-interactive-accent">✓</span>
                  {factor}
                </li>
              ))}
            </ul>
          </CardSection>
        )}
      </div>
    </Card>
  );
}
