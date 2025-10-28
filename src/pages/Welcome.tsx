import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { applyTheme } from '@/hooks/useTheme';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Always apply Classic theme for welcome screen
    applyTheme('classic');
  }, []);

  return (
    <PageLayout showLogo={false}>
      <div className="text-center space-y-12">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        <Card>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-foreground text-3xl md:text-5xl">
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
              className="w-full"
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