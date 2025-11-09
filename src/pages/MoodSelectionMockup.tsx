import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MoodSelectionMockup = () => {
  const presetMoods = {
    positive: [
      { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100' },
      { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-orange-100' },
      { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-100' },
      { id: 'proud', emoji: '😎', label: 'Proud', color: 'bg-purple-100' },
      { id: 'hopeful', emoji: '🌟', label: 'Hopeful', color: 'bg-yellow-100' },
      { id: 'grateful', emoji: '🙏', label: 'Grateful', color: 'bg-pink-100' },
      { id: 'peaceful', emoji: '☮️', label: 'Peaceful', color: 'bg-green-100' },
    ],
    neutral: [
      { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-gray-100' },
      { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-100' },
      { id: 'confused', emoji: '😕', label: 'Confused', color: 'bg-purple-100' },
      { id: 'bored', emoji: '😑', label: 'Bored', color: 'bg-gray-100' },
    ],
    challenging: [
      { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100' },
      { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-100' },
      { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-yellow-100' },
      { id: 'worried', emoji: '😟', label: 'Worried', color: 'bg-orange-100' },
      { id: 'lonely', emoji: '😔', label: 'Lonely', color: 'bg-blue-100' },
      { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-red-100' },
      { id: 'embarrassed', emoji: '😳', label: 'Embarrassed', color: 'bg-pink-100' },
      { id: 'nervous', emoji: '😬', label: 'Nervous', color: 'bg-yellow-100' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mood Selection Mockup</h1>
          <p className="text-muted-foreground">Preview of the new categorized mood picker</p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">How are you feeling today?</h2>
          
          <Tabs defaultValue="positive" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="positive" className="text-sm">
                😊 Positive
              </TabsTrigger>
              <TabsTrigger value="neutral" className="text-sm">
                😐 Neutral
              </TabsTrigger>
              <TabsTrigger value="challenging" className="text-sm">
                😢 Challenging
              </TabsTrigger>
            </TabsList>

            <TabsContent value="positive" className="mt-0">
              <div className="grid grid-cols-4 gap-2">
                {presetMoods.positive.map((mood) => (
                  <Button
                    key={mood.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-1 p-3 hover:scale-105 transition-transform"
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="neutral" className="mt-0">
              <div className="grid grid-cols-4 gap-2">
                {presetMoods.neutral.map((mood) => (
                  <Button
                    key={mood.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-1 p-3 hover:scale-105 transition-transform"
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenging" className="mt-0">
              <div className="grid grid-cols-4 gap-2">
                {presetMoods.challenging.map((mood) => (
                  <Button
                    key={mood.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-1 p-3 hover:scale-105 transition-transform"
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              ✨ + Create Your Own Mood (Coming Soon)
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>• 18 preset moods organized by emotion type</p>
          <p>• Easy navigation with categorized tabs</p>
          <p>• Clean 4-column grid layout</p>
          <p>• Custom mood creation coming in Phase 3</p>
        </div>
      </div>
    </div>
  );
};

export default MoodSelectionMockup;