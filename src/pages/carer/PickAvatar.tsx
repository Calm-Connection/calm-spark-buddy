import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const preMadeAvatars = [
  { id: 'professional1', label: 'Professional', prompt: 'a professional adult with a warm smile, wearing glasses and business casual attire' },
  { id: 'caring1', label: 'Caring', prompt: 'a kind caring adult with a gentle expression, wearing comfortable clothing' },
  { id: 'friendly1', label: 'Friendly', prompt: 'a friendly approachable adult with a welcoming smile' },
  { id: 'wise1', label: 'Wise', prompt: 'a wise caring adult with grey hair and a gentle, knowing smile' },
  { id: 'active1', label: 'Active', prompt: 'an active energetic adult in casual sporty clothing with a bright smile' },
  { id: 'creative1', label: 'Creative', prompt: 'a creative artistic adult with colorful clothing and an inspiring expression' },
  { id: 'professional2', label: 'Professional 2', prompt: 'a professional adult in formal attire with a confident smile' },
  { id: 'nurturing1', label: 'Nurturing', prompt: 'a nurturing caring adult with soft features and a comforting presence' },
];

export default function PickAvatar() {
  const [selectedAvatarPrompt, setSelectedAvatarPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateFromPrompt = async (prompt: string) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { type: 'carer', prompt }
      });

      if (error) throw error;

      setGeneratedImageUrl(data.imageUrl);
      toast({
        title: 'Avatar generated! ✨',
        description: 'Your unique avatar is ready'
      });
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      if (error.message?.includes('429')) {
        toast({
          title: 'Rate limit exceeded',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } else if (error.message?.includes('402')) {
        toast({
          title: 'Credits exhausted',
          description: 'Please contact support',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Generation failed',
          description: 'Please try again',
          variant: 'destructive'
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCustom = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Prompt required',
        description: 'Please describe your avatar',
        variant: 'destructive'
      });
      return;
    }
    await handleGenerateFromPrompt(aiPrompt);
  };

  const handleContinue = async () => {
    if (!generatedImageUrl) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to continue',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const avatarData = { 
        type: 'disney_custom',
        imageUrl: generatedImageUrl 
      };

      const { error } = await supabase
        .from('carer_profiles')
        .update({ avatar_json: avatarData })
        .eq('user_id', user.id);

      if (error) {
        console.error('Avatar update error:', error);
        toast({
          title: 'Error',
          description: 'Failed to save avatar. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Avatar saved! ✨',
        description: 'Let\'s continue with the tour',
      });

      navigate('/quick-tour');
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Avatar</h1>
          <p className="text-muted-foreground">
            Select a style or create with AI
          </p>
        </div>

        <Tabs defaultValue="premade" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="premade">Pre-made</TabsTrigger>
            <TabsTrigger value="custom">
              <Sparkles className="h-4 w-4 mr-2" />
              Custom AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="premade" className="space-y-6 mt-6">
            {generatedImageUrl ? (
              <div className="space-y-4">
                <Card className="p-6">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated avatar"
                    className="w-full max-w-sm mx-auto rounded-2xl"
                  />
                </Card>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setGeneratedImageUrl(null);
                      setSelectedAvatarPrompt(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Choose Different
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Use This Avatar'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {preMadeAvatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatarPrompt(avatar.prompt)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAvatarPrompt === avatar.prompt
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{avatar.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {avatar.prompt}
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => selectedAvatarPrompt && handleGenerateFromPrompt(selectedAvatarPrompt)}
                  disabled={!selectedAvatarPrompt || generating}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Avatar'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-6 mt-6">
            {generatedImageUrl ? (
              <div className="space-y-4">
                <Card className="p-6">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated avatar"
                    className="w-full max-w-sm mx-auto rounded-2xl"
                  />
                </Card>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setGeneratedImageUrl(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Use This Avatar'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 mx-auto text-primary" />
                  <p className="text-muted-foreground">
                    Describe your ideal avatar
                  </p>
                </div>
                
                <div className="space-y-2">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Example: A professional parent with glasses, wearing a cardigan, with a warm and caring smile"
                    className="w-full min-h-32 p-4 rounded-xl border-2 border-border bg-background resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about appearance and style
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateCustom}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={generating || !aiPrompt.trim()}
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Avatar
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
