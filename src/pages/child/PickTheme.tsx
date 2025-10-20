import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const themes = [
  { id: 'calm-ocean', name: 'Calm Ocean', colors: ['bg-blue-200', 'bg-blue-300', 'bg-blue-400'] },
  { id: 'forest-green', name: 'Forest Green', colors: ['bg-green-200', 'bg-green-300', 'bg-green-400'] },
  { id: 'sunset-pink', name: 'Sunset Pink', colors: ['bg-pink-200', 'bg-pink-300', 'bg-pink-400'] },
  { id: 'lavender-dream', name: 'Lavender Dream', colors: ['bg-purple-200', 'bg-purple-300', 'bg-purple-400'] },
  { id: 'sunshine-yellow', name: 'Sunshine Yellow', colors: ['bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400'] },
  { id: 'peachy-warm', name: 'Peachy Warm', colors: ['bg-orange-200', 'bg-orange-300', 'bg-orange-400'] },
];

export default function PickTheme() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', selectedTheme);
      navigate('/child/create-avatar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Pick Your Theme 🎨</h1>
          <p className="text-muted-foreground">
            Choose colors that make you feel happy and calm
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className="space-y-3">
                <div className="flex gap-1 h-16">
                  {theme.colors.map((color, idx) => (
                    <div key={idx} className={`flex-1 rounded ${color}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{theme.name}</span>
                  {selectedTheme === theme.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full bg-secondary hover:bg-secondary/90" 
          disabled={!selectedTheme}
        >
          Continue
        </Button>
      </Card>
    </div>
  );
}