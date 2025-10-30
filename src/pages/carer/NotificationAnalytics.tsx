import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { format } from 'date-fns';

interface NotificationStats {
  total: number;
  unread: number;
  readRate: number;
  byType: Record<string, number>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

export default function NotificationAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all notifications for the user
      const { data: notifications } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (!notifications) return;

      const total = notifications.length;
      const unread = notifications.filter(n => !n.read_at).length;
      const readRate = total > 0 ? Math.round(((total - unread) / total) * 100) : 0;

      // Count by type
      const byType = notifications.reduce((acc, n) => {
        acc[n.notification_type] = (acc[n.notification_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentNotifications = notifications.filter(
        n => new Date(n.sent_at) >= sevenDaysAgo
      );

      const activityByDay = recentNotifications.reduce((acc, n) => {
        const date = format(new Date(n.sent_at), 'MMM dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentActivity = Object.entries(activityByDay).map(([date, count]) => ({
        date,
        count,
      }));

      setStats({
        total,
        unread,
        readRate,
        byType,
        recentActivity,
      });
    } catch (error) {
      console.error('Error loading notification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    shared_reflection: 'Shared Reflections',
    safeguarding_alert: 'Safeguarding Alerts',
    engagement_reminder: 'Engagement Reminders',
    insights_summary: 'Weekly Insights',
    wellbeing_content: 'Wellbeing Content',
    achievement: 'Achievements',
    module_completion: 'Module Completions',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 pb-20">
      <div className="container max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/carer/home')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notification Analytics</h1>
            <p className="text-muted-foreground">Track your notification activity</p>
          </div>
        </div>

        {stats && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Notifications</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold">{stats.unread}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Read Rate</p>
                    <p className="text-2xl font-bold">{stats.readRate}%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* By Type */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Notifications by Type
              </h2>
              <div className="space-y-3">
                {Object.entries(stats.byType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{typeLabels[type] || type}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Recent Activity */}
            {stats.recentActivity.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity (Last 7 Days)</h2>
                <div className="space-y-2">
                  {stats.recentActivity.map(({ date, count }) => (
                    <div key={date} className="flex items-center justify-between text-sm">
                      <span>{date}</span>
                      <span className="font-medium">{count} notifications</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
