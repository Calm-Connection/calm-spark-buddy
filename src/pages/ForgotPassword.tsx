import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { applyTheme } from '@/hooks/useTheme';
import { DecorativeIcon } from '@/components/DecorativeIcon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    applyTheme('classic');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      setSent(true);
      toast({
        title: 'Check your email',
        description: 'We sent you a password reset link',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="relative max-w-md w-full p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.12} />
        <Button 
          variant="ghost" 
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl title-gradient-underline">Reset Password</h1>
          <p className="text-muted-foreground">
            {sent 
              ? "We've sent you an email with instructions to reset your password"
              : "Enter your email and we'll send you a reset link"
            }
          </p>
        </div>

        {!sent && (
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

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] hover:shadow-soft" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        )}

        {sent && (
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Back to Login
          </Button>
        )}
      </Card>
    </div>
  );
}
