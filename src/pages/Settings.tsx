import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, Lock, HelpCircle } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();

  const sections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Edit your profile and avatar',
      onClick: () => {},
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage notification preferences',
      onClick: () => {},
    },
    {
      icon: Lock,
      title: 'Privacy',
      description: 'Control your privacy settings',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and view resources',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
        </div>

        <Card className="p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Type</p>
            <p className="font-bold capitalize">{userRole}</p>
          </div>
        </Card>

        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="p-6 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={section.onClick}
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-bold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">App Version</h3>
              <p className="text-sm text-muted-foreground">1.0.0 (MVP)</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">About Calm Connection</h3>
              <p className="text-sm text-muted-foreground">
                A gentle, nurturing space where children and carers grow emotionally together.
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={signOut}
          variant="destructive"
          className="w-full"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}