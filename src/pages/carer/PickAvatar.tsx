import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

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
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedAvatar) {
      localStorage.setItem('carerAvatar', selectedAvatar);
      navigate('/quick-tour');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Avatar</h1>
          <p className="text-muted-foreground">
            Pick an avatar that represents you
          </p>
        </div>

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
          disabled={!selectedAvatar}
        >
          Continue
        </Button>
      </Card>
    </div>
  );
}