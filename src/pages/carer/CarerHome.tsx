import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, BookOpen, Heart, QrCode, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function CarerHome() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Carer Dashboard 💜</h1>
            <p className="text-muted-foreground mt-1">Supporting your child's emotional journey</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Today's Overview */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-xl font-bold mb-2">Today's Overview</h2>
          <p className="text-muted-foreground">
            Your child's emotional wellbeing is being gently supported. Check insights for Wendy's summary.
          </p>
        </Card>

        {/* Menu Items */}
        <div className="grid gap-4">
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