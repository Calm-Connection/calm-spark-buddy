import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Clock, Heart, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { preferences, loading, updatePreferences } = useNotificationPreferences('child');

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
            <p className="text-sm text-muted-foreground">Choose when you'd like gentle reminders</p>
          </div>
        </div>

        {/* Journal Reminders */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Journal Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Get gentle nudges to write about your day
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="journal-reminders">Enable reminders</Label>
                <Switch
                  id="journal-reminders"
                  checked={preferences.journal_reminders}
                  onCheckedChange={(checked) => 
                    updatePreferences({ journal_reminders: checked })
                  }
                />
              </div>

              {preferences.journal_reminders && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Preferred time</Label>
                  <Select
                    value={preferences.journal_reminder_time}
                    onValueChange={(value) => 
                      updatePreferences({ journal_reminder_time: value })
                    }
                  >
                    <SelectTrigger id="reminder-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">Morning (8:00 AM)</SelectItem>
                      <SelectItem value="15:30">After School (3:30 PM)</SelectItem>
                      <SelectItem value="18:00">Evening (6:00 PM)</SelectItem>
                      <SelectItem value="19:30">Before Bed (7:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Mood Check-ins */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Mood Check-ins</h3>
                <p className="text-sm text-muted-foreground">
                  How often would you like to check in with your feelings?
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mood-checkins">Enable check-ins</Label>
                <Switch
                  id="mood-checkins"
                  checked={preferences.mood_checkins}
                  onCheckedChange={(checked) => 
                    updatePreferences({ mood_checkins: checked })
                  }
                />
              </div>

              {preferences.mood_checkins && (
                <div className="space-y-2">
                  <Label htmlFor="checkin-frequency">Frequency</Label>
                  <Select
                    value={preferences.mood_checkin_frequency}
                    onValueChange={(value) => 
                      updatePreferences({ mood_checkin_frequency: value })
                    }
                  >
                    <SelectTrigger id="checkin-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Once a day</SelectItem>
                      <SelectItem value="twice-daily">Twice a day</SelectItem>
                      <SelectItem value="weekly">Once a week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Other Reminders */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">What else would you like reminders for?</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="calm-activities">Calm activities</Label>
                    <p className="text-xs text-muted-foreground">
                      Mini breaks for breathing exercises
                    </p>
                  </div>
                  <Switch
                    id="calm-activities"
                    checked={preferences.calm_activities}
                    onCheckedChange={(checked) => 
                      updatePreferences({ calm_activities: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="encouragement">Encouragement messages</Label>
                    <p className="text-xs text-muted-foreground">
                      Gentle reminders that you're doing great
                    </p>
                  </div>
                  <Switch
                    id="encouragement"
                    checked={preferences.encouragement_messages}
                    onCheckedChange={(checked) => 
                      updatePreferences({ encouragement_messages: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="connection">Connection prompts</Label>
                    <p className="text-xs text-muted-foreground">
                      Suggestions to share with your grown-up
                    </p>
                  </div>
                  <Switch
                    id="connection"
                    checked={preferences.connection_prompts}
                    onCheckedChange={(checked) => 
                      updatePreferences({ connection_prompts: checked })
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
                <h3 className="font-semibold">Quiet Times</h3>
                <p className="text-sm text-muted-foreground">
                  When would you like notifications to be paused?
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Enable quiet times</Label>
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
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Sound & Vibration */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Notification Style</h3>
          
          <div className="space-y-3">
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
        </Card>

        <Card className="p-4 bg-accent/20 border-accent/30">
          <p className="text-sm text-center text-muted-foreground">
            You can always come back when you're ready — your calm space will be here. 💙
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
