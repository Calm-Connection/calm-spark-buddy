import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/PageLayout';

const skinTones = ['#FFE5D9', '#F7D5BE', '#E3B392', '#C68E65', '#8D5524', '#4A2F1E'];

export default function CreateAvatar() {
  const [skinTone, setSkinTone] = useState(skinTones[0]);
  const navigate = useNavigate();

  const handleSave = () => {
    const avatar = { skinTone };
    localStorage.setItem('avatarData', JSON.stringify(avatar));
    navigate('/child/safety-note');
  };

  return (
    <PageLayout>
      <Card className="border-0">
        <CardContent className="space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-foreground">CREATE YOUR AVATAR</h1>
            <p className="text-lg text-foreground/70">
              Pick your avatar look!
            </p>
          </div>

          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="w-48 h-48 rounded-full flex items-center justify-center shadow-xl transition-all"
                style={{ backgroundColor: skinTone }}
              >
                <div className="text-8xl">👤</div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary rounded-full p-4 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </div>

          {/* Skin Tone Selection */}
          <div className="space-y-4">
            <p className="text-center font-bold text-xl text-foreground">Choose Skin Tone</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  className={`w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                    skinTone === tone ? 'border-primary scale-125 shadow-lg' : 'border-foreground/20'
                  }`}
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSave}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            SAVE AVATAR
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}