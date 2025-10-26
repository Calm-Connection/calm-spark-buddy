import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, AlertCircle, Wrench, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HelplineModal } from './HelplineModal';

interface BottomNavProps {
  role: 'child' | 'carer';
}

export function BottomNav({ role }: BottomNavProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const navItems = role === 'child' 
    ? [
        { icon: Home, label: 'Home', path: '/child/home' },
        { icon: BookOpen, label: 'Journal', path: '/child/journal' },
        { icon: Wrench, label: 'Tools', path: '/child/tools' },
        { icon: AlertCircle, label: 'Help', path: null, action: () => setShowHelpModal(true) },
      ]
    : [
        { icon: Home, label: 'Dashboard', path: '/carer/home' },
        { icon: BookOpen, label: 'Journal', path: '/carer/journal' },
        { icon: Brain, label: 'Insights', path: '/carer/insights' },
        { icon: Sparkles, label: 'Resources', path: '/carer/resources' },
      ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              
              if (item.action) {
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-destructive hover:bg-destructive/10"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              }
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path!}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
      
      {role === 'child' && <HelplineModal open={showHelpModal} onOpenChange={setShowHelpModal} />}
    </>
  );
}
