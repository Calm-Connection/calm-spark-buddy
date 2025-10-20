import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const skinTones = ['#FFE5D9', '#F7D5BE', '#E3B392', '#C68E65', '#8D5524', '#4A2F1E'];
const hairStyles = ['Short', 'Long', 'Curly', 'Straight', 'Wavy', 'Bun'];
const hairColors = ['Brown', 'Black', 'Blonde', 'Red', 'Blue', 'Purple', 'Pink'];
const accessories = ['None', 'Glasses', 'Hat', 'Bow', 'Headband', 'Earrings'];

export default function CreateAvatar() {
  const [skinTone, setSkinTone] = useState(skinTones[0]);
  const [hairStyle, setHairStyle] = useState('Short');
  const [hairColor, setHairColor] = useState('Brown');
  const [accessory, setAccessory] = useState('None');
  const navigate = useNavigate();

  const handleSave = () => {
    const avatar = { skinTone, hairStyle, hairColor, accessory };
    localStorage.setItem('avatarData', JSON.stringify(avatar));
    navigate('/child/safety-note');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Avatar 👤</h1>
          <p className="text-muted-foreground">
            Design an avatar that looks like you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center"
                style={{ backgroundColor: skinTone }}
              >
                <div className="text-6xl">👤</div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>

          {/* Avatar Customization */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skin Tone</Label>
              <div className="flex gap-2 flex-wrap">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSkinTone(tone)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      skinTone === tone ? 'border-primary scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: tone }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hair Style</Label>
              <Select value={hairStyle} onValueChange={setHairStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hairStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hair Color</Label>
              <Select value={hairColor} onValueChange={setHairColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hairColors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Accessory</Label>
              <Select value={accessory} onValueChange={setAccessory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessories.map((acc) => (
                    <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-secondary hover:bg-secondary/90" 
        >
          Save Avatar
        </Button>
      </Card>
    </div>
  );
}