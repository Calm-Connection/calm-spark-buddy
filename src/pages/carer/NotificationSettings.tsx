import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Shield, BookOpen, Clock, Volume2 } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DecorativeIcon } from '@/components/DecorativeIcon';

export default function CarerNotificationSettings() {
  const navigate = useNavigate();
  const { preferences, loading, updatePreferences } = useNotificationPreferences('carer');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!preferences) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Notification Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>

        {/* Safeguarding Alerts - Always On */}
        <Alert className="border-accent bg-accent/10">
          <Shield className="h-4 w-4 text-accent-foreground" />
          <AlertDescription>
            Safeguarding alerts are always enabled to ensure your child's safety. These critical notifications cannot be turned off.
          </AlertDescription>
        </Alert>

        {/* Insights Summary */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Wellbeing Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Regular summaries of your child's emotional patterns and progress
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="insights-summary">Enable insights</Label>
                <Switch
                  id="insights-summary"
                  checked={preferences.insights_summary}
                  onCheckedChange={(checked) => 
                    updatePreferences({ insights_summary: checked })
                  }
                />
              </div>

              {preferences.insights_summary && (
                <div className="space-y-2">
                  <Label htmlFor="insights-frequency">How often?</Label>
                  <Select
                    value={preferences.insights_frequency}
                    onValueChange={(value) => 
                      updatePreferences({ insights_frequency: value })
                    }
                  >
                    <SelectTrigger id="insights-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily summary</SelectItem>
                      <SelectItem value="weekly">Weekly summary</SelectItem>
                      <SelectItem value="monthly">Monthly summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Shared Reflections */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">What would you like to be notified about?</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shared-reflections">Shared reflections</Label>
                    <p className="text-xs text-muted-foreground">
                      When your child shares a journal entry with you
                    </p>
                  </div>
                  <Switch
                    id="shared-reflections"
                    checked={preferences.shared_reflections}
                    onCheckedChange={(checked) => 
                      updatePreferences({ shared_reflections: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="support-tools">Support tools</Label>
                    <p className="text-xs text-muted-foreground">
                      Suggested activities to try together
                    </p>
                  </div>
                  <Switch
                    id="support-tools"
                    checked={preferences.support_tools}
                    onCheckedChange={(checked) => 
                      updatePreferences({ support_tools: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="wellbeing-content">New wellbeing resources</Label>
                    <p className="text-xs text-muted-foreground">
                      Articles, guides, and conversation starters
                    </p>
                  </div>
                  <Switch
                    id="wellbeing-content"
                    checked={preferences.wellbeing_content}
                    onCheckedChange={(checked) => 
                      updatePreferences({ wellbeing_content: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quiet Hours */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Quiet Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Pause non-urgent notifications during specific times
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Enable quiet hours</Label>
                <Switch
                  id="quiet-hours"
                  checked={preferences.quiet_hours_enabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ quiet_hours_enabled: checked })
                  }
                />
              </div>

              {preferences.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Quiet from</Label>
                    <Select
                      value={preferences.quiet_hours_start}
                      onValueChange={(value) => 
                        updatePreferences({ quiet_hours_start: value })
                      }
                    >
                      <SelectTrigger id="quiet-start">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">Quiet until</Label>
                    <Select
                      value={preferences.quiet_hours_end}
                      onValueChange={(value) => 
                        updatePreferences({ quiet_hours_end: value })
                      }
                    >
                      <SelectTrigger id="quiet-end">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Note: Safeguarding alerts will still be delivered during quiet hours
              </p>
            </div>
          </div>
        </Card>

        {/* Sound & Vibration */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Volume2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold">Notification Style</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">Sound</Label>
                <Switch
                  id="sound"
                  checked={preferences.notification_sound}
                  onCheckedChange={(checked) => 
                    updatePreferences({ notification_sound: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="vibration">Vibration</Label>
                <Switch
                  id="vibration"
                  checked={preferences.notification_vibration}
                  onCheckedChange={(checked) => 
                    updatePreferences({ notification_vibration: checked })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-accent/20 border-accent/30">
          <p className="text-sm text-center text-muted-foreground">
            Your notification preferences help us support you and your child better.
          </p>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
