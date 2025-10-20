import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">Invite Code Generator</h1>
          <p className="text-muted-foreground">
            Generate a code to connect with your child
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm">
              Generate a unique invite code and share it with your child. They'll enter this code during their signup to connect your accounts.
            </p>
            <p className="text-sm text-muted-foreground">
              The code expires in 30 days
            </p>
          </div>

          {code ? (
            <div className="space-y-4">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Your Invite Code</p>
                <p className="text-4xl font-bold tracking-widest">{code}</p>
              </div>

              <Button
                onClick={copyCode}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>

              <Button
                onClick={() => setCode('')}
                variant="ghost"
                className="w-full"
              >
                Generate New Code
              </Button>
            </div>
          ) : (
            <Button
              onClick={generateCode}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Invite Code'
              )}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}