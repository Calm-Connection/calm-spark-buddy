import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, AlertTriangle, Info, ExternalLink, Phone, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface SafeguardingLog {
  id: string;
  journal_entry_id: string;
  child_id: string;
  detected_keywords: string[];
  severity_score: number;
  action_taken: string;
  created_at: string;
  journal_entry?: {
    entry_text: string;
    mood_tag: string;
    created_at: string;
  };
  wendy_insight?: {
    summary: string;
    themes: string[];
    mood_score: number;
  };
}

export default function SafeguardingDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<SafeguardingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [childNickname, setChildNickname] = useState('');

  useEffect(() => {
    loadSafeguardingData();
  }, [user]);

  const loadSafeguardingData = async () => {
    if (!user) return;

    try {
      // Get linked child
      const { data: childProfile } = await supabase
        .from('children_profiles')
        .select('id, nickname')
        .eq('linked_carer_id', user.id)
        .maybeSingle();

      if (!childProfile) {
        setLoading(false);
        return;
      }

      setChildNickname(childProfile.nickname);

      // Get safeguarding logs with related data
      const { data: logsData, error } = await supabase
        .from('safeguarding_logs')
        .select(`
          *,
          journal_entry:journal_entries!safeguarding_logs_journal_entry_id_fkey(
            entry_text,
            mood_tag,
            created_at
          )
        `)
        .eq('child_id', childProfile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get Wendy insights for each log
      const logsWithInsights = await Promise.all(
        (logsData || []).map(async (log) => {
          const { data: insight } = await supabase
            .from('wendy_insights')
            .select('summary, themes, mood_score')
            .eq('journal_entry_id', log.journal_entry_id)
            .maybeSingle();

          return {
            ...log,
            wendy_insight: insight,
          };
        })
      );

      setLogs(logsWithInsights as SafeguardingLog[]);
    } catch (error) {
      console.error('Error loading safeguarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLevel = (score: number): 'critical' | 'high' | 'medium' => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    return 'medium';
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-destructive/10 border-destructive text-destructive';
      case 'high':
        return 'bg-orange-500/10 border-orange-500 text-orange-700';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500 text-yellow-700';
      default:
        return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Safeguarding Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              {childNickname ? `Monitoring ${childNickname}'s wellbeing` : 'Monitor your child\'s wellbeing'}
            </p>
          </div>
        </div>

        {/* Emergency Resources */}
        <Alert className="border-accent bg-accent/10">
          <Info className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold">If you're concerned about your child's immediate safety:</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:999">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: 999
                </a>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:0800-1111">
                  <Phone className="h-4 w-4 mr-2" />
                  Childline: 0800 1111
                </a>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="tel:116-123">
                  <Phone className="h-4 w-4 mr-2" />
                  Samaritans: 116 123
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {logs.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No Safeguarding Alerts</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no safeguarding concerns detected. The system is actively monitoring {childNickname}'s wellbeing.
            </p>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({logs.length})</TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({logs.filter(l => getSeverityLevel(l.severity_score) === 'critical').length})
              </TabsTrigger>
              <TabsTrigger value="high">
                High ({logs.filter(l => getSeverityLevel(l.severity_score) === 'high').length})
              </TabsTrigger>
              <TabsTrigger value="medium">
                Medium ({logs.filter(l => getSeverityLevel(l.severity_score) === 'medium').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'critical', 'high', 'medium'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                {logs
                  .filter(log => tab === 'all' || getSeverityLevel(log.severity_score) === tab)
                  .map((log) => {
                    const severity = getSeverityLevel(log.severity_score);
                    return (
                      <Card key={log.id} className={`p-6 ${getSeverityColor(severity)}`}>
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                              <div>
                                <Badge variant="outline" className="mb-1">
                                  {severity.toUpperCase()} - Score: {log.severity_score}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(log.created_at), 'PPpp')}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Wendy's Summary */}
                          {log.wendy_insight && (
                            <div className="bg-background/50 p-4 rounded-lg">
                              <h4 className="font-semibold text-sm mb-2">AI Analysis Summary</h4>
                              <p className="text-sm">{log.wendy_insight.summary}</p>
                              {log.wendy_insight.themes && log.wendy_insight.themes.length > 0 && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                  {log.wendy_insight.themes.map((theme, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {theme}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Detected Keywords */}
                          {log.detected_keywords && log.detected_keywords.length > 0 && (
                            <div className="bg-background/50 p-4 rounded-lg">
                              <h4 className="font-semibold text-sm mb-2">Detected Concerns</h4>
                              <div className="flex gap-2 flex-wrap">
                                {log.detected_keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Guidance */}
                          <div className="bg-background/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Recommended Actions</h4>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                              {severity === 'critical' && (
                                <>
                                  <li>Have a calm, private conversation with your child as soon as possible</li>
                                  <li>Ask open questions: "I've noticed you seem worried - want to talk about it?"</li>
                                  <li>Contact your child's GP or school counselor if concerns persist</li>
                                  <li>If immediate danger, contact emergency services (999) or Childline (0800 1111)</li>
                                </>
                              )}
                              {severity === 'high' && (
                                <>
                                  <li>Check in with your child about how they're feeling</li>
                                  <li>Create a calm space for them to share if they want to</li>
                                  <li>Monitor for changes in behavior, sleep, or appetite</li>
                                  <li>Consider speaking to school staff or your GP</li>
                                </>
                              )}
                              {severity === 'medium' && (
                                <>
                                  <li>Have a gentle conversation when the time feels right</li>
                                  <li>Let your child know you're there for them</li>
                                  <li>Try some calm activities together (breathing, walking)</li>
                                  <li>Keep monitoring patterns over the next few days</li>
                                </>
                              )}
                            </ul>
                          </div>

                          {/* View Full Entry Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/carer/shared-entries')}
                            className="w-full"
                          >
                            Review Full Journal Entries
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Support Resources */}
        <Card className="p-6 bg-accent/10">
          <h3 className="font-semibold mb-3">Support Resources for Parents</h3>
          <div className="space-y-2 text-sm">
            <a
              href="https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              NHS: Mental health advice for parents
            </a>
            <a
              href="https://www.youngminds.org.uk/parent/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Young Minds: Parent helpline and resources
            </a>
            <a
              href="https://www.annafreud.org/parents-and-carers/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Anna Freud Centre: Parent and carer resources
            </a>
          </div>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
