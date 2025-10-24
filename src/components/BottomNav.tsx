import { NavLink } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  role: 'child' | 'carer';
}

export function BottomNav({ role }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Home', path: `/${role}/home` },
    { icon: BookOpen, label: 'Journal', path: `/${role}/journal` },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
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
  );
}
