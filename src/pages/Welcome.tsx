import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <PageLayout showLogo={false}>
      <div className="text-center space-y-12">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        <Card>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-foreground">
                WELCOME!
              </h1>
              
              <p className="text-xl text-foreground/80">
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