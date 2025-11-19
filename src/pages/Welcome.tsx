import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { applyTheme } from '@/hooks/useTheme';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { AccessibilityDialog } from '@/components/AccessibilityDialog';

export default function Welcome() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Always apply Classic theme for welcome screen
    applyTheme('classic');
  }, []);

  return (
    <PageLayout showLogo={false}>
      {/* Accessibility Options Button */}
      <AccessibilityDialog />
      
      {/* Dark Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-6 right-6 z-20 rounded-full transition-all duration-200 hover:scale-110 hover:bg-interactive-accent/10"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <div className="text-center space-y-12">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        <Card className="shadow-soft-lg border-interactive-accent/20 relative overflow-hidden">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
          <DecorativeIcon icon="leaf" position="bottom-left" opacity={0.08} />
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-foreground text-3xl md:text-5xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                WELCOME!
              </h1>
              
              <p className="text-base md:text-xl text-foreground/80">
                A gentle, nurturing space where children and carers grow emotionally together
              </p>
            </div>

            <Button 
              onClick={() => navigate('/role-selection')}
              variant="gradient"
              size="lg"
              className="w-full hover:scale-[1.02] transition-all duration-200"
            >
              GET STARTED
            </Button>

            <p className="text-base text-foreground/60">
              A safe space to share feelings, explore emotions, and connect 💜
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}