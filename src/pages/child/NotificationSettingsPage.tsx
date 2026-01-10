import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Clock, Volume2, Heart, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Skeleton } from '@/components/ui/skeleton';
import { DecorativeIcon } from '@/components/DecorativeIcon';

export default function ChildNotificationSettingsPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/10 to-background pb-20 relative">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.08} />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="hover:bg-interactive-accent/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
<h1 className="text-2xl title-gradient-underline">
              Notification Settings 🔔
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Choose when you want reminders</p>
          </div>
        </div>

        {/* Journal Reminders */}
        <Card className="p-6 space-y-4 shadow-soft hover:shadow-soft-lg transition-all duration-200 border-interactive-accent/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Journal Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Gentle reminders to check in with how you're feeling
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="journal-reminder">Enable reminders</Label>
                <Switch
                  id="journal-reminder"
                  checked={preferences.journal_reminders}
                  onCheckedChange={(checked) => 
                    updatePreferences({ journal_reminders: checked })
                  }
                />
              </div>

              {preferences.journal_reminders && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">What time?</Label>
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
                      <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (3:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (7:00 PM)</SelectItem>
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
                  Quick reminders to say how you're feeling
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mood-checkin">Enable check-ins</Label>
                <Switch
                  id="mood-checkin"
                  checked={preferences.mood_checkins}
                  onCheckedChange={(checked) => 
                    updatePreferences({ mood_checkins: checked })
                  }
                />
              </div>

              {preferences.mood_checkins && (
                <div className="space-y-2">
                  <Label htmlFor="checkin-frequency">How often?</Label>
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
                      <SelectItem value="three-times">Three times a day</SelectItem>
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
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold">Other Reminders</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="calm-activities">Calm activities</Label>
                  <p className="text-xs text-muted-foreground">
                    Suggestions for calming tools and exercises
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
                  <Label htmlFor="encouragement">Encouragement</Label>
                  <p className="text-xs text-muted-foreground">
                    Positive messages and affirmations
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
                    Ideas to connect with your carer
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
        </Card>

        {/* Quiet Times */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold">Quiet Times</h3>
                <p className="text-sm text-muted-foreground">
                  Choose times when you don't want notifications
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-times">Enable quiet times</Label>
                <Switch
                  id="quiet-times"
                  checked={preferences.quiet_hours_enabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ quiet_hours_enabled: checked })
                  }
                />
              </div>

              {preferences.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Start time</Label>
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
                    <Label htmlFor="quiet-end">End time</Label>
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
            </div>
          </div>
        </Card>

        {/* Notification Style */}
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
            You can change these settings anytime 💜
          </p>
        </Card>
      </div>

      <BottomNav role="child" />
    </div>
  );
}

