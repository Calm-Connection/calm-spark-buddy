import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const avatars = [
  { id: 'avatar1', emoji: '👨', label: 'Person 1' },
  { id: 'avatar2', emoji: '👩', label: 'Person 2' },
  { id: 'avatar3', emoji: '👴', label: 'Person 3' },
  { id: 'avatar4', emoji: '👵', label: 'Person 4' },
  { id: 'avatar5', emoji: '🧑', label: 'Person 5' },
  { id: 'avatar6', emoji: '👱', label: 'Person 6' },
];

export default function PickAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Prompt required',
        description: 'Please describe your avatar',
        variant: 'destructive'
      });
      return;
    }

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { prompt: aiPrompt }
      });

      if (error) throw error;

      setGeneratedImageUrl(data.imageUrl);
      toast({
        title: 'Avatar generated! ✨',
        description: 'Your unique avatar is ready'
      });
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedAvatar && !generatedImageUrl) return;

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

      let avatarData;
      if (generatedImageUrl) {
        avatarData = { imageUrl: generatedImageUrl };
      } else {
        const avatar = avatars.find(a => a.id === selectedAvatar);
        if (!avatar) {
          toast({
            title: 'Error',
            description: 'Please select an avatar',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        avatarData = { emoji: avatar.emoji };
      }

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
            Pick an emoji or create with AI
          </p>
        </div>

        <Tabs defaultValue="emoji" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emoji" className="space-y-6 mt-6">
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar) => (
                <Card
                  key={avatar.id}
                  className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                    selectedAvatar === avatar.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl">{avatar.emoji}</div>
                    {selectedAvatar === avatar.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={!selectedAvatar || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 mt-6">
            {generatedImageUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated avatar"
                    className="w-48 h-48 rounded-full object-cover shadow-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setGeneratedImageUrl(null);
                      setAiPrompt('');
                    }}
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
                  <Input
                    placeholder="e.g., professional person with glasses and a friendly smile"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateAI()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about appearance and style
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateAI}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={aiGenerating || !aiPrompt.trim()}
                >
                  {aiGenerating ? (
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