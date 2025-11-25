import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { emotionalIcons, getEmotionalIconsByCategory } from '@/constants/emotionalIcons';
import { MoodIcon } from '@/components/MoodIcon';

// Get a curated selection for first check-in
const moods = [
  ...getEmotionalIconsByCategory('positive').slice(0, 3), // happy, excited, calm
  ...getEmotionalIconsByCategory('challenging').slice(0, 3), // sad, angry, worried
];

export default function FirstMoodCheckin() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedMood) {
      navigate('/child/journal-entry', { state: { selectedMood: selectedMood } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/10 via-accent/5 to-background">
      <Card className="relative max-w-md w-full p-8 space-y-6 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 border-interactive-accent/20 shadow-soft-lg">
        <DecorativeIcon icon="sparkles" position="top-right" opacity={0.1} />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            How are you feeling?
          </h1>
          <p className="text-muted-foreground font-medium">
            Pick the mood that fits how you feel right now
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {moods.map((mood) => (
            <Card
              key={mood.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-soft-lg border-interactive-accent/10 ${
                selectedMood === mood.id ? 'ring-2 ring-interactive-accent shadow-soft-md bg-interactive-accent/5' : 'hover:bg-interactive-accent/5'
              }`}
              onClick={() => setSelectedMood(mood.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <MoodIcon 
                  moodId={mood.id} 
                  size="md" 
                  selected={selectedMood === mood.id}
                />
                <span className="font-semibold">{mood.label}</span>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full transition-all duration-200" 
          disabled={!selectedMood}
        >
          Write First Entry
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => navigate('/child/home')}
          className="w-full hover:bg-interactive-accent/10 transition-colors"
        >
          Skip for now
        </Button>
      </Card>
    </div>
  );
}