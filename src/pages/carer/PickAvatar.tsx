import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const preMadeAvatars = [
  { id: 'professional', label: 'Professional', prompt: 'A friendly professional adult avatar with warm expression and glasses, clean corporate style with neutral background' },
  { id: 'casual', label: 'Casual', prompt: 'A casual friendly adult avatar with approachable smile, wearing a comfortable sweater, warm natural style' },
  { id: 'caring', label: 'Caring', prompt: 'A caring adult avatar with gentle expression and kind eyes, wearing soft colors, nurturing and supportive appearance' },
  { id: 'creative', label: 'Creative', prompt: 'A creative and artistic adult avatar with bright expression, colorful accessories, unique and inspiring style' },
  { id: 'active', label: 'Active', prompt: 'An active and energetic adult avatar with enthusiastic smile, sporty appearance, dynamic and encouraging style' },
  { id: 'wise', label: 'Wise', prompt: 'A wise and thoughtful adult avatar with calm expression, mature appearance, trustworthy and experienced style' },
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

      // Save to avatar history
      await supabase
        .from('avatar_history')
        .insert({
          user_id: user.id,
          avatar_json: avatarData,
          is_current: true
        });

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
                <p className="text-sm text-muted-foreground text-center">
                  Choose from 6 pre-made avatars or create your own with AI
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {preMadeAvatars.map((avatar) => (
                    <Button
                      key={avatar.id}
                      variant={selectedAvatarPrompt === avatar.prompt ? "default" : "outline"}
                      onClick={() => setSelectedAvatarPrompt(avatar.prompt)}
                      disabled={generating}
                      className="h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <span className="text-lg font-medium">{avatar.label}</span>
                    </Button>
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
