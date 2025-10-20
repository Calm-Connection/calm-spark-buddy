import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BlobBackground } from '@/components/BlobBackground';

export default function InviteCode() {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invite-code');

      if (error) throw error;

      setCode(data.code);
      toast({
        title: 'Code Generated! 🎉',
        description: 'Share this code with your child',
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      
      <div className="absolute top-6 left-6">
        <Logo size="sm" />
      </div>
      
      <div className="relative z-0 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-8">
          <Button variant="ghost" onClick={() => navigate(-1)} size="lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>

          <Card className="border-0">
            <CardContent className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-foreground">INVITE CODE</h1>
                <p className="text-lg text-foreground/70">
                  Generate a code to connect with your child
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-base text-foreground/80">
                  Generate a unique invite code and share it with your child. They'll enter this code during their signup to connect your accounts.
                </p>
                <p className="text-sm text-foreground/60">
                  The code expires in 30 days ⏰
                </p>
              </div>

              {code ? (
                <div className="space-y-6">
                  <div className="bg-primary/20 p-8 rounded-3xl text-center">
                    <p className="text-base text-foreground/70 mb-3">Your Invite Code</p>
                    <p className="text-5xl font-black tracking-widest">{code}</p>
                  </div>

                  <Button
                    onClick={copyCode}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        Copy Code
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setCode('')}
                    variant="peachy"
                    size="lg"
                    className="w-full"
                  >
                    Generate New Code
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={generateCode}
                  disabled={loading}
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Invite Code'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}