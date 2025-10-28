import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useEffect } from 'react';
import { applyTheme } from '@/hooks/useTheme';

export default function RoleSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    // Always apply Classic theme for onboarding screens
    applyTheme('classic');
  }, []);

  return (
    <PageLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-foreground text-3xl md:text-5xl font-bold">WHO'S LOGGING IN?</h1>
          <p className="text-base md:text-xl text-foreground/80">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-0"
            onClick={() => navigate('/child/signup')}
          >
            <CardContent className="text-center space-y-4 md:space-y-6 py-6 md:py-8">
              <div className="h-20 w-20 md:h-32 md:w-32 mx-auto rounded-full bg-primary flex items-center justify-center">
                <span className="text-4xl md:text-6xl">👧</span>
              </div>
              <h2 className="text-foreground text-xl md:text-3xl font-semibold">CHILD</h2>
              <p className="text-foreground/70 text-xs md:text-base leading-relaxed px-2">
                Express your feelings, journal, and chat with Wendy
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-0"
            onClick={() => navigate('/carer/signup')}
          >
            <CardContent className="text-center space-y-4 md:space-y-6 py-6 md:py-8">
              <div className="h-20 w-20 md:h-32 md:w-32 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <span className="text-4xl md:text-6xl">👨‍👩‍👧</span>
              </div>
              <h2 className="text-foreground text-xl md:text-3xl font-semibold">CARER</h2>
              <p className="text-foreground/70 text-xs md:text-base leading-relaxed px-2">
                Support, understand, and connect with your child
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4 pt-4">
          <Button variant="outline" onClick={() => navigate('/login')} size="lg" className="w-full md:w-auto">
            Already have an account? Log in
          </Button>
        </div>

        <p className="text-center text-xs md:text-sm text-foreground/60">
          A safe space to grow emotionally together 💜
        </p>
      </div>
    </PageLayout>
  );
}