import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/PageLayout';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const skinTones = ['#FFE5D9', '#F7D5BE', '#E3B392', '#C68E65', '#8D5524', '#4A2F1E'];

const hairStyles = [
  { id: 'short', emoji: '👦', label: 'Short' },
  { id: 'long', emoji: '👧', label: 'Long' },
  { id: 'curly', emoji: '👨‍🦱', label: 'Curly' },
  { id: 'wavy', emoji: '👩‍🦰', label: 'Wavy' },
  { id: 'bald', emoji: '👨‍🦲', label: 'Bald' },
  { id: 'afro', emoji: '👨‍🦲', label: 'Afro' },
];

const accessories = [
  { id: 'none', emoji: '', label: 'None' },
  { id: 'glasses', emoji: '👓', label: 'Glasses' },
  { id: 'hat', emoji: '🎩', label: 'Hat' },
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'bow', emoji: '🎀', label: 'Bow' },
];

const expressions = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'silly', emoji: '😜', label: 'Silly' },
];

export default function CreateAvatarEnhanced() {
  const [skinTone, setSkinTone] = useState(skinTones[0]);
  const [hairStyle, setHairStyle] = useState('short');
  const [accessory, setAccessory] = useState('none');
  const [expression, setExpression] = useState('happy');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const avatar = { 
        skinTone, 
        hairStyle, 
        accessory, 
        expression 
      };
      
      localStorage.setItem('avatarData', JSON.stringify(avatar));
      
      await supabase
        .from('children_profiles')
        .update({ avatar_json: avatar })
        .eq('user_id', user.id);
      
      navigate('/child/safety-note');
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to save avatar. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedHair = hairStyles.find(h => h.id === hairStyle);
  const selectedAccessory = accessories.find(a => a.id === accessory);
  const selectedExpression = expressions.find(e => e.id === expression);

  return (
    <PageLayout>
      <Card className="border-0">
        <CardContent className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-foreground">CREATE YOUR AVATAR</h1>
            <p className="text-lg text-foreground/70">
              Design your unique avatar!
            </p>
          </div>

          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center shadow-xl transition-all relative overflow-hidden"
                style={{ backgroundColor: skinTone }}
              >
                {/* Expression */}
                <div className="text-6xl absolute">
                  {selectedExpression?.emoji}
                </div>
                {/* Hair overlay */}
                {selectedHair && (
                  <div className="absolute -top-4 text-5xl">
                    {selectedHair.emoji}
                  </div>
                )}
                {/* Accessory */}
                {selectedAccessory && accessory !== 'none' && (
                  <div className="absolute -top-2 text-4xl">
                    {selectedAccessory.emoji}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary rounded-full p-4 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </div>

          {/* Skin Tone Selection */}
          <div className="space-y-3">
            <p className="text-center font-bold text-lg text-foreground">Skin Tone</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                    skinTone === tone ? 'border-primary scale-110 shadow-lg' : 'border-foreground/20'
                  }`}
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-3">
            <p className="text-center font-bold text-lg text-foreground">Hair Style</p>
            <div className="grid grid-cols-3 gap-3">
              {hairStyles.map((hair) => (
                <button
                  key={hair.id}
                  onClick={() => setHairStyle(hair.id)}
                  className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                    hairStyle === hair.id 
                      ? 'border-primary bg-primary/20' 
                      : 'border-foreground/20 bg-background'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{hair.emoji}</span>
                    <span className="text-xs font-medium">{hair.label}</span>
                    {hairStyle === hair.id && (
                      <Check className="h-4 w-4 text-primary mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="space-y-3">
            <p className="text-center font-bold text-lg text-foreground">Accessories</p>
            <div className="grid grid-cols-3 gap-3">
              {accessories.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccessory(acc.id)}
                  className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                    accessory === acc.id 
                      ? 'border-primary bg-primary/20' 
                      : 'border-foreground/20 bg-background'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{acc.emoji || '⭕'}</span>
                    <span className="text-xs font-medium">{acc.label}</span>
                    {accessory === acc.id && (
                      <Check className="h-4 w-4 text-primary mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Expression */}
          <div className="space-y-3">
            <p className="text-center font-bold text-lg text-foreground">Expression</p>
            <div className="grid grid-cols-3 gap-3">
              {expressions.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setExpression(exp.id)}
                  className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                    expression === exp.id 
                      ? 'border-primary bg-primary/20' 
                      : 'border-foreground/20 bg-background'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{exp.emoji}</span>
                    <span className="text-xs font-medium">{exp.label}</span>
                    {expression === exp.id && (
                      <Check className="h-4 w-4 text-primary mt-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSave}
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'SAVING...' : 'SAVE AVATAR'}
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
