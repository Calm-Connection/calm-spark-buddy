import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AVATAR_OBJECTS,
  OBJECT_COLORS,
  EYE_STYLES,
  EYE_COLORS,
  OBJECT_ACCESSORIES,
  COMFORT_ITEMS,
} from '@/constants/avatarAssets';

interface ObjectAvatarBuilderProps {
  onAvatarGenerated?: (avatarData: any) => void;
  onSaveAndContinue?: (avatarData: any) => Promise<void>;
  buttonLabel?: string;
}

export function ObjectAvatarBuilder({
  onAvatarGenerated,
  onSaveAndContinue,
  buttonLabel = 'Save Avatar & Continue',
}: ObjectAvatarBuilderProps) {
  const [objectType, setObjectType] = useState('teddyBear');
  const [mainColor, setMainColor] = useState('pink');
  const [accentColor, setAccentColor] = useState('purple');
  const [eyeStyle, setEyeStyle] = useState('sparkly');
  const [eyeColor, setEyeColor] = useState('brown');
  const [accessory, setAccessory] = useState('none');
  const [comfortItem, setComfortItem] = useState('none');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSaveAndContinue = async () => {
    setGenerating(true);
    try {
      const objectData = {
        objectType,
        mainColor: OBJECT_COLORS.find(c => c.id === mainColor)?.value || 'soft pink',
        accentColor: OBJECT_COLORS.find(c => c.id === accentColor)?.value || 'gentle purple',
        eyeStyle: EYE_STYLES.find(s => s.id === eyeStyle)?.value || 'round sparkly eyes',
        eyeColor: EYE_COLORS.find(c => c.id === eyeColor)?.value || 'brown',
        accessory: OBJECT_ACCESSORIES.find(a => a.id === accessory)?.value || 'none',
        comfortItem: COMFORT_ITEMS.find(i => i.id === comfortItem)?.value || 'none',
      };

      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { type: 'child', objectData }
      });

      if (error) throw error;

      const avatarData = {
        type: 'object_avatar',
        imageUrl: data.imageUrl,
        objectData: {
          objectType,
          mainColor,
          accentColor,
          eyeStyle,
          eyeColor,
          accessory,
          comfortItem,
        }
      };

      // If onSaveAndContinue provided, parent handles full save & navigation
      if (onSaveAndContinue) {
        await onSaveAndContinue(avatarData);
      } else if (onAvatarGenerated) {
        // Legacy: just notify parent
        onAvatarGenerated(avatarData);
        toast.success('Character created!');
      }
    } catch (error: any) {
      console.error('Character generation error:', error);
      if (error.message?.includes('429')) {
        toast.error('Too many requests. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Character generation limit reached. Please contact support.');
      } else {
        toast.error('Failed to generate character. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Simple Static Preview */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-3">
          <div className="text-6xl">{AVATAR_OBJECTS[objectType as keyof typeof AVATAR_OBJECTS]?.emoji || '✨'}</div>
          <div className="flex justify-center gap-2 items-center flex-wrap">
            <div 
              className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
              style={{ backgroundColor: OBJECT_COLORS.find(c => c.id === mainColor)?.hex }}
              title="Main Color"
            />
            <div 
              className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
              style={{ backgroundColor: OBJECT_COLORS.find(c => c.id === accentColor)?.hex }}
              title="Accent Color"
            />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {AVATAR_OBJECTS[objectType as keyof typeof AVATAR_OBJECTS]?.label} • {EYE_STYLES.find(s => s.id === eyeStyle)?.label} Eyes
          </p>
        </div>
      </Card>

      <p className="text-xs text-center text-muted-foreground px-2">
        This is a preview. Your actual avatar will be created when you tap the button below.
      </p>

      {/* Single flow - no intermediate state */}
      <div className="space-y-4">
          {/* Step 1: Choose Object */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">1. Choose Your Character</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {Object.values(AVATAR_OBJECTS).map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setObjectType(obj.id)}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all min-h-[44px] ${
                    objectType === obj.id
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1">{obj.emoji}</div>
                  <div className="text-xs sm:text-sm font-medium">{obj.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 2: Main Color */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">2. Pick Main Color</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {OBJECT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setMainColor(color.id)}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                    mainColor === color.id
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">{color.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 3: Accent Color */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">3. Pick Accent Color</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {OBJECT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                    accentColor === color.id
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">{color.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 4: Eye Style & Color */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">4. Choose Eyes</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Eye Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EYE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setEyeStyle(style.id)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                        eyeStyle === style.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Eye Color</label>
                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
                  {EYE_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setEyeColor(color.id)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                        eyeColor === color.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Step 5: Accessories */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">5. Add Accessory (Optional)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {OBJECT_ACCESSORIES.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccessory(acc.id)}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                    accessory === acc.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">{acc.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 6: Comfort Item */}
          <Card className="p-3 sm:p-4">
            <h3 className="font-bold mb-3 text-sm sm:text-base">6. Add Comfort Item (Optional)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {COMFORT_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setComfortItem(item.id)}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                    comfortItem === item.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </Card>

        {/* Single Save & Continue Button */}
        <Button
          onClick={handleSaveAndContinue}
          disabled={generating}
          size="lg"
          className="w-full py-6 text-lg"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating & Saving...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              {buttonLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
