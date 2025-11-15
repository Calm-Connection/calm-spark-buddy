import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VolumeControl } from '@/components/VolumeControl';
import { useBreathingAudio } from '@/hooks/useBreathingAudio';
import { useToast } from '@/hooks/use-toast';
import { DecorativeIcon } from '@/components/DecorativeIcon';

const themeGradients: Record<string, string> = {
  ocean: 'from-blue-400 to-cyan-300',
  cloud: 'from-sky-200 to-blue-100',
  forest: 'from-green-400 to-emerald-300',
  star: 'from-indigo-500 to-purple-400',
  garden: 'from-pink-300 to-yellow-200',
  rainbow: 'from-red-300 via-yellow-300 to-purple-300',
  sunset: 'from-orange-400 to-pink-400',
  space: 'from-purple-900 to-black',
};

const themeEmojis: Record<string, string> = {
  ocean: '🌊',
  cloud: '☁️',
  forest: '🌲',
  star: '⭐',
  garden: '🌼',
  rainbow: '🌈',
  sunset: '🌅',
  space: '🌌',
};

export default function CustomSpace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [space, setSpace] = useState<any>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingIn, setBreathingIn] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [cyclesComplete, setCyclesComplete] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [duration, setDuration] = useState<1 | 3 | 5>(3);

  const totalCycles = duration * 60 / 8;

  useBreathingAudio({ 
    theme: space?.sound_theme || 'waves', 
    enabled: soundEnabled && isBreathing, 
    volume 
  });

  useEffect(() => {
    loadSpace();
  }, [id, user]);

  useEffect(() => {
    if (!isBreathing) return;
    const timer = setTimeout(() => {
      setBreathingIn(!breathingIn);
      if (!breathingIn) setCyclesComplete(prev => prev + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isBreathing, breathingIn]);

  useEffect(() => {
    if (cyclesComplete >= totalCycles && isBreathing) {
      completeExercise();
    }
  }, [cyclesComplete, isBreathing, totalCycles]);

  const loadSpace = async () => {
    if (!user || !id) return;

    try {
      const { data: profile } = await supabase
        .from('children_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('custom_breathing_spaces')
        .select('*')
        .eq('id', id)
        .eq('child_id', profile.id)
        .single();

      if (error) throw error;
      setSpace(data);

      // Update last used
      await supabase
        .from('custom_breathing_spaces')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', id);
    } catch (error: any) {
      toast({
        title: "Couldn't load space",
        description: error.message,
        variant: "destructive"
      });
      navigate('/child/tools/breathing-space');
    }
  };

  const completeExercise = async () => {
    setIsBreathing(false);
    setShowAffirmation(true);
    if (user) {
      try {
        await supabase.from('tool_usage').insert({
          user_id: user.id,
          tool_name: `Custom: ${space?.name}`,
          duration_minutes: duration,
          completed: true
        });
      } catch (error) {
        console.log('Usage tracking optional');
      }
    }
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingIn(true);
    setCyclesComplete(0);
    setShowAffirmation(false);
  };

  if (!space) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const gradient = themeGradients[space.visual_theme] || themeGradients.ocean;
  const emoji = themeEmojis[space.visual_theme] || '🌊';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradient} pb-20`}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/child/tools/breathing-space')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{space.name} {emoji}</h1>
        </div>

        {!isBreathing && !showAffirmation && (
          <Card className="p-6 bg-white/60 backdrop-blur animate-fade-in">
            <h3 className="font-bold mb-4 text-center">How long would you like to breathe?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 3, 5].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? 'default' : 'outline'}
                  onClick={() => setDuration(min as 1 | 3 | 5)}
                  className="py-6"
                >
                  {min} min
                </Button>
              ))}
            </div>
          </Card>
        )}

        <div className="relative flex items-center justify-center min-h-[450px] overflow-hidden">
          <div
            className={`absolute rounded-full bg-white/30 backdrop-blur transition-all duration-[4000ms] ease-in-out ${
              isBreathing
                ? breathingIn
                  ? 'w-96 h-96 opacity-90 scale-110'
                  : 'w-48 h-48 opacity-40 scale-90'
                : 'w-72 h-72 opacity-70'
            }`}
          />
          
          {isBreathing && (
            <div className="absolute text-center z-10 px-6 animate-fade-in">
              <div className="text-6xl mb-4">{emoji}</div>
              <p className="text-2xl font-bold mb-4">
                {breathingIn ? "Breathe in..." : "Breathe out..."}
              </p>
              <p className="text-sm opacity-70">
                Cycle {cyclesComplete + 1} of {Math.ceil(totalCycles)}
              </p>
            </div>
          )}

          {!isBreathing && !showAffirmation && (
            <div className="absolute text-center z-10 animate-fade-in">
              <div className="text-6xl mb-4">{emoji}</div>
              <p className="text-lg opacity-70">Your personal calm space</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!isBreathing && !showAffirmation ? (
            <Button
              onClick={startBreathing}
              className="w-full text-lg py-6"
              size="lg"
            >
              Begin Breathing ✨
            </Button>
          ) : isBreathing ? (
            <Button onClick={() => setIsBreathing(false)} variant="outline" className="w-full">
              Pause
            </Button>
          ) : null}

          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        {showAffirmation && (
          <Card className="p-8 bg-white/80 backdrop-blur border-2 border-primary animate-scale-in text-center space-y-4">
            <div className="text-5xl mb-4">{emoji}✨</div>
            <p className="text-xl font-bold">
              You feel calmer and more peaceful
            </p>
            <p className="text-muted-foreground">Great job using your calm space!</p>
            <div className="pt-4 space-y-2">
              <Button onClick={() => navigate('/child/journal-entry')} variant="default" className="w-full">
                Write in Journal 📝
              </Button>
              <Button onClick={() => navigate('/child/tools/breathing-space')} variant="outline" className="w-full">
                Back to Breathing Space
              </Button>
            </div>
          </Card>
        )}
      </div>

      <BottomNav role="child" />
    </div>
  );
}
