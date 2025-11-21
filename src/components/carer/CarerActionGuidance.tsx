import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, AlertCircle, Shield } from 'lucide-react';

interface CarerActionGuidanceProps {
  currentTier: number;
  highestTier: number;
}

export function CarerActionGuidance({ currentTier, highestTier }: CarerActionGuidanceProps) {
  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 1:
        return {
          icon: CheckCircle,
          color: 'text-interactive-accent',
          bgColor: 'bg-interactive-accent/10',
          title: 'Low Concern',
          actions: [
            'Continue regular check-ins',
            'Encourage journaling and self-expression',
            'Celebrate positive moments together',
            'Maintain open communication channels'
          ]
        };
      case 2:
        return {
          icon: AlertTriangle,
          color: 'text-interactive-warning',
          bgColor: 'bg-interactive-warning/10',
          title: 'Moderate Concern',
          actions: [
            'Increase frequency of check-ins',
            'Use conversation starters to open dialogue',
            'Suggest using coping tools together',
            'Monitor for any escalation in concerns',
            'Consider scheduling quality time activities'
          ]
        };
      case 3:
        return {
          icon: AlertCircle,
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          title: 'Elevated Concern',
          actions: [
            'Have a gentle but direct conversation',
            'Express your care and willingness to help',
            'Consider involving school counselor or GP',
            'Document concerning patterns',
            'Review safeguarding resources together',
            'Ensure they know how to access crisis support'
          ]
        };
      case 4:
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          title: 'High Concern',
          actions: [
            'Seek professional support immediately',
            'Contact GP or CAMHS for assessment',
            'Ensure child knows they are supported',
            'Remove access to potential means of harm',
            'Create a safety plan together',
            'Do not leave child unsupervised if at immediate risk',
            'Consider calling crisis services: Childline (0800 1111) or Samaritans (116 123)'
          ]
        };
      default:
        return {
          icon: Shield,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          title: 'No Active Concerns',
          actions: [
            'Continue fostering open communication',
            'Encourage healthy emotional expression'
          ]
        };
    }
  };

  const currentInfo = getTierInfo(currentTier);
  const CurrentIcon = currentInfo.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Carer Action Guidance</CardTitle>
        </div>
        <CardDescription>
          Recommended actions based on current assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier Status */}
        <Alert className={`${currentInfo.bgColor} border-${currentInfo.color.split('-')[1]}`}>
          <CurrentIcon className={`h-4 w-4 ${currentInfo.color}`} />
          <AlertDescription>
            <div className="font-semibold mb-1">Current Status: {currentInfo.title}</div>
            <div className="text-sm">
              Escalation Tier: <Badge variant="outline" className={currentInfo.color}>{currentTier}</Badge>
              {highestTier > currentTier && (
                <span className="ml-2 text-muted-foreground">
                  (Previous highest: {highestTier})
                </span>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Recommended Actions */}
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
            Recommended Actions
          </h4>
          <ul className="space-y-2">
            {currentInfo.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Note for High Tiers */}
        {currentTier >= 3 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Important:</strong> If you believe your child is at immediate risk of harm, 
              contact emergency services (999) or take them to A&E immediately.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
