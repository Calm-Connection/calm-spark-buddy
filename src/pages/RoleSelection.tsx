import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Baby, Heart } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Who's logging in?</h1>
          <p className="text-muted-foreground">Choose your role to continue</p>
        </div>

        <div className="space-y-4">
          <Card 
            className="p-6 cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/child/signup')}
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Baby className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">I'm a Child</h3>
                <p className="text-sm text-muted-foreground">
                  Share your feelings in a safe space
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => navigate('/carer/signup')}
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent/30 flex items-center justify-center">
                <Heart className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">I'm a Carer</h3>
                <p className="text-sm text-muted-foreground">
                  Support and connect with your child
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-primary"
          >
            Already have an account? Log in
          </Button>
        </div>
      </div>
    </div>
  );
}