import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function CarerSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast({
        title: 'Privacy notice required',
        description: 'Please read and accept the privacy and safeguarding notice',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, 'carer');

    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      navigate('/carer/pick-avatar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-y-auto">
      <Card className="max-w-md w-full p-8 space-y-6 my-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Carer Account</h1>
          <p className="text-muted-foreground">Support your child's emotional journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>

          <Card className="p-4 bg-warm/20 border-warm">
            <h3 className="font-bold mb-2">Privacy & Safeguarding Notice</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Your child's journal entries are private by default
              </p>
              <p>
                • You'll only see entries your child chooses to share
              </p>
              <p>
                • Wendy AI provides gentle insights to support your child
              </p>
              <p>
                • If high-risk content is detected, appropriate safeguarding measures will be triggered
              </p>
              <p>
                • All data is encrypted and handled according to UK safeguarding regulations
              </p>
            </div>
          </Card>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy" 
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
            />
            <label
              htmlFor="privacy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and accept the privacy and safeguarding notice
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={loading || !acceptedPrivacy}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/role-selection')}
          >
            ← Go back
          </Button>
        </div>
      </Card>
    </div>
  );
}