import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AvatarPreview } from './AvatarPreview';

interface AvatarBuilderProps {
  onAvatarGenerated: (avatarData: any) => void;
}

const skinTones = [
  { id: 'light', label: 'Light', value: 'light peachy' },
  { id: 'fair', label: 'Fair', value: 'fair' },
  { id: 'medium', label: 'Medium', value: 'medium' },
  { id: 'olive', label: 'Olive', value: 'olive' },
  { id: 'tan', label: 'Tan', value: 'tan' },
  { id: 'brown', label: 'Brown', value: 'brown' },
  { id: 'dark', label: 'Dark', value: 'dark' },
  { id: 'deep', label: 'Deep', value: 'deep brown' },
];

const eyeColors = [
  { id: 'brown', label: 'Brown', value: 'brown' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
  { id: 'hazel', label: 'Hazel', value: 'hazel' },
  { id: 'gray', label: 'Gray', value: 'gray' },
  { id: 'amber', label: 'Amber', value: 'amber' },
  { id: 'violet', label: 'Violet', value: 'violet' },
];

const hairColors = [
  { id: 'black', label: 'Black', value: 'black' },
  { id: 'brown', label: 'Brown', value: 'brown' },
  { id: 'blonde', label: 'Blonde', value: 'blonde' },
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'auburn', label: 'Auburn', value: 'auburn' },
  { id: 'gray', label: 'Gray', value: 'gray' },
  { id: 'pink', label: 'Pink', value: 'pink' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'purple', label: 'Purple', value: 'purple' },
  { id: 'green', label: 'Green', value: 'green' },
];

const hairStyles = [
  { id: 'short', label: 'Short', value: 'short' },
  { id: 'long', label: 'Long straight', value: 'long straight' },
  { id: 'curly', label: 'Curly', value: 'curly' },
  { id: 'wavy', label: 'Wavy', value: 'wavy' },
  { id: 'braids', label: 'Braids', value: 'braided' },
  { id: 'ponytail', label: 'Ponytail', value: 'ponytail' },
  { id: 'bun', label: 'Bun', value: 'bun' },
  { id: 'pixie', label: 'Pixie cut', value: 'pixie cut' },
  { id: 'bob', label: 'Bob', value: 'bob' },
  { id: 'afro', label: 'Afro', value: 'afro' },
  { id: 'locs', label: 'Locs', value: 'locs' },
  { id: 'buzz', label: 'Buzz cut', value: 'buzz cut' },
];

const favoriteColors = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'pink', label: 'Pink', value: 'pink' },
  { id: 'purple', label: 'Purple', value: 'purple' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
  { id: 'yellow', label: 'Yellow', value: 'yellow' },
  { id: 'orange', label: 'Orange', value: 'orange' },
  { id: 'teal', label: 'Teal', value: 'teal' },
  { id: 'lavender', label: 'Lavender', value: 'lavender' },
  { id: 'mint', label: 'Mint', value: 'mint green' },
  { id: 'peach', label: 'Peach', value: 'peach' },
  { id: 'white', label: 'White', value: 'white' },
];

const accessories = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'glasses', label: 'Glasses', value: 'glasses' },
  { id: 'headband', label: 'Headband', value: 'a headband' },
  { id: 'hat', label: 'Hat', value: 'a hat' },
  { id: 'bow', label: 'Bow', value: 'a bow' },
  { id: 'crown', label: 'Crown', value: 'a crown' },
  { id: 'flowers', label: 'Flowers', value: 'flowers in hair' },
  { id: 'bandana', label: 'Bandana', value: 'a bandana' },
];

const comfortItems = [
  { id: 'none', label: 'None', value: 'none' },
  { id: 'teddy', label: 'Teddy Bear', value: 'teddy bear' },
  { id: 'blanket', label: 'Blanket', value: 'cozy blanket' },
  { id: 'book', label: 'Book', value: 'favorite book' },
  { id: 'music', label: 'Music Note', value: 'musical note' },
  { id: 'star', label: 'Star', value: 'shining star' },
  { id: 'heart', label: 'Heart', value: 'heart' },
  { id: 'pet', label: 'Pet', value: 'small pet' },
  { id: 'toy', label: 'Toy', value: 'favorite toy' },
  { id: 'plant', label: 'Plant', value: 'small plant' },
];

export function AvatarBuilder({ onAvatarGenerated }: AvatarBuilderProps) {
  const [skinTone, setSkinTone] = useState('medium');
  const [eyeColor, setEyeColor] = useState('brown');
  const [hairColor, setHairColor] = useState('brown');
  const [hairStyle, setHairStyle] = useState('short');
  const [favoriteColor, setFavoriteColor] = useState('blue');
  const [accessory, setAccessory] = useState('none');
  const [comfortItem, setComfortItem] = useState('none');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateCustom = async () => {
    setGenerating(true);
    try {
      const customization = {
        skinTone: skinTones.find(t => t.id === skinTone)?.value || 'medium',
        eyeColor: eyeColors.find(c => c.id === eyeColor)?.value || 'brown',
        hairColor: hairColors.find(c => c.id === hairColor)?.value || 'brown',
        hairStyle: hairStyles.find(s => s.id === hairStyle)?.value || 'short',
        favoriteColor: favoriteColors.find(c => c.id === favoriteColor)?.value || 'blue',
        accessory: accessories.find(a => a.id === accessory)?.value || 'none',
        comfortItem: comfortItems.find(i => i.id === comfortItem)?.value || 'none',
      };

      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { type: 'child', customization }
      });

      if (error) throw error;
      
      setGeneratedImage(data.imageUrl);
      toast.success('Your avatar is ready!');
    } catch (error: any) {
      console.error('Avatar generation error:', error);
      if (error.message?.includes('429')) {
        toast.error('Too many requests. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Avatar generation limit reached. Please contact support.');
      } else {
        toast.error('Failed to generate avatar. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFreestyle = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe your avatar');
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { type: 'child', prompt: aiPrompt }
      });

      if (error) throw error;
      
      setGeneratedImage(data.imageUrl);
      toast.success('Your avatar is ready!');
    } catch (error: any) {
      console.error('Avatar generation error:', error);
      if (error.message?.includes('429')) {
        toast.error('Too many requests. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Avatar generation limit reached. Please contact support.');
      } else {
        toast.error('Failed to generate avatar. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleUseManualAvatar = () => {
    // Save the manual avatar without AI generation
    onAvatarGenerated({
      type: 'manual_custom',
      customization: {
        skinTone,
        eyeColor,
        hairColor,
        hairStyle,
        favoriteColor,
        accessory,
        comfortItem,
      }
    });
  };

  const handleUseAvatar = () => {
    if (generatedImage) {
      onAvatarGenerated({
        type: 'disney_custom',
        imageUrl: generatedImage,
        customization: {
          skinTone,
          eyeColor,
          hairColor,
          hairStyle,
          favoriteColor,
          accessory,
          comfortItem,
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="freestyle">AI Freestyle</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-6 mt-6">
          {generatedImage ? (
            <div className="space-y-4">
              <Card className="p-6">
                <img 
                  src={generatedImage} 
                  alt="Generated avatar" 
                  className="w-full max-w-sm mx-auto rounded-2xl"
                />
              </Card>
              <div className="flex gap-3">
                <Button onClick={() => setGeneratedImage(null)} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleUseAvatar} className="flex-1">
                  Use This Avatar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Live Preview */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-center font-semibold mb-4 text-lg">Your Avatar Preview</h3>
                <AvatarPreview
                  skinTone={skinTone}
                  eyeColor={eyeColor}
                  hairColor={hairColor}
                  hairStyle={hairStyle}
                  favoriteColor={favoriteColor}
                  accessory={accessory}
                  comfortItem={comfortItem}
                />
                <p className="text-center text-sm text-muted-foreground">
                  Pick your features below to customize your avatar
                </p>
              </Card>
              {/* Skin Tone */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Skin Tone</label>
                <div className="grid grid-cols-4 gap-2">
                  {skinTones.map(tone => (
                    <button
                      key={tone.id}
                      onClick={() => setSkinTone(tone.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        skinTone === tone.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{tone.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Eye Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {eyeColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setEyeColor(color.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
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

              {/* Hair Color */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Hair Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {hairColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setHairColor(color.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        hairColor === color.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Hairstyle</label>
                <div className="grid grid-cols-3 gap-2">
                  {hairStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setHairStyle(style.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        hairStyle === style.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Color */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Favorite Color (for clothing)</label>
                <div className="grid grid-cols-4 gap-2">
                  {favoriteColors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setFavoriteColor(color.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        favoriteColor === color.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Accessories</label>
                <div className="grid grid-cols-4 gap-2">
                  {accessories.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setAccessory(acc.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        accessory === acc.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{acc.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comfort Item */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Comfort Item</label>
                <div className="grid grid-cols-5 gap-2">
                  {comfortItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setComfortItem(item.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        comfortItem === item.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xs font-medium">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleUseManualAvatar}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Save Avatar
                </Button>
                <Button 
                  onClick={handleGenerateCustom} 
                  disabled={generating}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Version...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Version
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Save your avatar as-is, or use AI to create a more detailed version
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="freestyle" className="space-y-6 mt-6">
          {generatedImage ? (
            <div className="space-y-4">
              <Card className="p-6">
                <img 
                  src={generatedImage} 
                  alt="Generated avatar" 
                  className="w-full max-w-sm mx-auto rounded-2xl"
                />
              </Card>
              <div className="flex gap-3">
                <Button onClick={() => setGeneratedImage(null)} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleUseAvatar} className="flex-1">
                  Use This Avatar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Describe Your Avatar</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: A friendly character with curly red hair, green eyes, wearing a blue hoodie and holding a book"
                  className="w-full min-h-32 p-4 rounded-xl border-2 border-border bg-background resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Describe your dream avatar! Be creative and have fun 🎨
                </p>
              </div>

              <Button 
                onClick={handleGenerateFreestyle} 
                disabled={generating || !aiPrompt.trim()}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Avatar...
                  </>
                ) : (
                  'Generate Avatar'
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
