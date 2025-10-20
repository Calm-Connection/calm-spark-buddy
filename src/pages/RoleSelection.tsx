import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-foreground">WHO'S LOGGING IN?</h1>
          <p className="text-xl text-foreground/80">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-0"
            onClick={() => navigate('/child/signup')}
          >
            <CardContent className="text-center space-y-6">
              <div className="h-32 w-32 mx-auto rounded-full bg-primary flex items-center justify-center">
                <span className="text-6xl">👧</span>
              </div>
              <h2 className="text-foreground">CHILD</h2>
              <p className="text-foreground/70 text-base">
                Express your feelings, journal, and chat with Wendy
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-0"
            onClick={() => navigate('/carer/signup')}
          >
            <CardContent className="text-center space-y-6">
              <div className="h-32 w-32 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <span className="text-6xl">👨‍👩‍👧</span>
              </div>
              <h2 className="text-foreground">CARER</h2>
              <p className="text-foreground/70 text-base">
                Support, understand, and connect with your child
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Button variant="outline" onClick={() => navigate('/login')} size="lg">
            Already have an account? Log in
          </Button>
        </div>

        <p className="text-center text-sm text-foreground/60">
          A safe space to grow emotionally together 💜
        </p>
      </div>
    </PageLayout>
  );
}