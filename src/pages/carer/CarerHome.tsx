import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, BookOpen, Heart, QrCode, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AvatarDisplay } from '@/components/AvatarDisplay';

export default function CarerHome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState('Carer');
  const [avatarData, setAvatarData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('carer_profiles')
        .select('nickname, avatar_json')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        if (data.nickname) setNickname(data.nickname);
        if (data.avatar_json) setAvatarData(data.avatar_json);
      }
    };

    fetchProfile();
  }, [user]);

  const menuItems = [
    { icon: Brain, label: 'Weekly Insights', path: '/carer/insights', color: 'bg-primary/20 hover:bg-primary/30 text-primary', description: 'See Wendy\'s gentle summary' },
    { icon: BookOpen, label: 'Shared Entries', path: '/carer/shared-entries', color: 'bg-accent/30 hover:bg-accent/40 text-accent-foreground', description: 'Entries your child shared' },
    { icon: Heart, label: 'Joint Tools', path: '/carer/joint-tools', color: 'bg-secondary/20 hover:bg-secondary/30 text-secondary', description: 'Activities to do together' },
    { icon: QrCode, label: 'Invite Code', path: '/carer/invite-code', color: 'bg-warm/30 hover:bg-warm/40 text-foreground', description: 'Connect with your child' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex w-full justify-between items-start">
            <div className="flex-1" />
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <AvatarDisplay avatarData={avatarData} size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome, {nickname}! 💜</h1>
            <p className="text-muted-foreground mt-1">Supporting your child's emotional journey</p>
          </div>
        </div>

        {/* Today's Overview */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-xl font-bold mb-2">Today's Overview</h2>
          <p className="text-muted-foreground">
            Your child's emotional wellbeing is being gently supported. Check insights for Wendy's summary.
          </p>
        </Card>

        {/* Menu Items */}
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.path}
                className={`p-6 cursor-pointer transition-all hover:scale-[1.02] ${item.color}`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-10 w-10 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">{item.label}</h3>
                    <p className="text-sm opacity-80">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}