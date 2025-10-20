import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary/20 to-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">
            Calm Connection
          </h1>
          
          <p className="text-lg text-muted-foreground">
            A gentle, nurturing space where children and carers grow emotionally together
          </p>
        </div>

        <div className="pt-8">
          <Button 
            onClick={() => navigate('/role-selection')}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl"
          >
            Get Started
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          A safe space to share feelings, explore emotions, and connect
        </p>
      </div>
    </div>
  );
}