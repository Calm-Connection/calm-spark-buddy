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
import { Footer } from '@/components/Footer';

export default function Welcome() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Always apply Classic theme for welcome screen
    applyTheme('classic');
  }, []);

  return (
    <PageLayout showLogo={false}>
      <div className="relative">
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
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          
        {/* Welcome & Get Started - WITH Card Background (restored) */}
        <Card className="relative overflow-hidden backdrop-blur-sm bg-card/80 border border-border shadow-xl max-w-2xl mx-auto">
          <DecorativeIcon icon="sparkles" position="top-right" opacity={0.05} />
          <DecorativeIcon icon="leaf" position="bottom-left" opacity={0.05} />
          
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="space-y-4">
<h1 className="text-3xl md:text-5xl title-gradient-underline">
              Welcome 💜
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground">
              A gentle, nurturing space where children and carers grow emotionally together
            </p>
          </div>

          {/* Get Started Button */}
          <Button 
            onClick={() => navigate('/role-selection')}
            variant="gradient"
            size="lg"
            className="hover:scale-[1.02] transition-all duration-200 w-full"
          >
            Let's Begin
          </Button>

          {/* Tagline */}
          <p className="text-base text-muted-foreground">
            A safe space to share feelings, explore emotions, and connect
          </p>
          </CardContent>
        </Card>
        </div>
        
        <Footer />
      </div>
    </PageLayout>
  );
}