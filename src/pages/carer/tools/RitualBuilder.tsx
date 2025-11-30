import { useState, useEffect } from 'react';
import { ArrowLeft, Sun, Home, Moon, Plus, Trash2, Clock, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { BottomNav } from '@/components/BottomNav';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type RitualType = 'morning' | 'afterschool' | 'bedtime';

interface Activity {
  name: string;
  defaultDuration: number;
  category: RitualType;
}

interface SelectedActivity extends Activity {
  duration: number;
  notes?: string;
}

interface SavedRitual {
  type: RitualType;
  name: string;
  activities: SelectedActivity[];
  customNotes: string;
  createdAt: string;
}

const activities: Activity[] = [
  // Morning activities
  { name: 'Gentle wake-up stretch', defaultDuration: 2, category: 'morning' },
  { name: 'Cuddle time', defaultDuration: 5, category: 'morning' },
  { name: 'Slow breakfast together', defaultDuration: 10, category: 'morning' },
  { name: '3 deep breaths before leaving', defaultDuration: 1, category: 'morning' },
  { name: 'Positive affirmation card', defaultDuration: 1, category: 'morning' },
  { name: 'Check weather together', defaultDuration: 2, category: 'morning' },
  
  // After-school activities
  { name: 'Quiet snack time', defaultDuration: 10, category: 'afterschool' },
  { name: 'Movement break (run, jump, dance)', defaultDuration: 5, category: 'afterschool' },
  { name: 'Talk about "rose and thorn"', defaultDuration: 5, category: 'afterschool' },
  { name: 'Sensory play or fidget time', defaultDuration: 10, category: 'afterschool' },
  { name: 'No-questions zone (just be)', defaultDuration: 15, category: 'afterschool' },
  { name: 'Cozy reading together', defaultDuration: 15, category: 'afterschool' },
  
  // Bedtime activities
  { name: 'Warm bath or wash', defaultDuration: 10, category: 'bedtime' },
  { name: 'Calm story time', defaultDuration: 15, category: 'bedtime' },
  { name: 'Gratitude sharing', defaultDuration: 5, category: 'bedtime' },
  { name: 'Body scan relaxation', defaultDuration: 5, category: 'bedtime' },
  { name: 'Goodnight ritual (kiss, phrase, song)', defaultDuration: 2, category: 'bedtime' },
  { name: 'Dim lights slowly', defaultDuration: 3, category: 'bedtime' },
];

const ritualTypes = [
  { id: 'morning' as RitualType, title: 'Morning Calming Ritual', icon: Sun, color: 'text-orange-500' },
  { id: 'afterschool' as RitualType, title: 'After-School Decompress', icon: Home, color: 'text-blue-500' },
  { id: 'bedtime' as RitualType, title: 'Bedtime Wind-Down', icon: Moon, color: 'text-purple-500' },
];

export default function RitualBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<RitualType | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);
  const [ritualName, setRitualName] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [savedRituals, setSavedRituals] = useState<SavedRitual[]>([]);
  const [viewingRitual, setViewingRitual] = useState<SavedRitual | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('calmConnectionRituals');
    if (saved) {
      setSavedRituals(JSON.parse(saved));
    }
  }, []);

  const toggleActivity = (activity: Activity) => {
    const exists = selectedActivities.find(a => a.name === activity.name);
    if (exists) {
      setSelectedActivities(selectedActivities.filter(a => a.name !== activity.name));
    } else {
      setSelectedActivities([...selectedActivities, { ...activity, duration: activity.defaultDuration }]);
    }
  };

  const updateDuration = (activityName: string, duration: number) => {
    setSelectedActivities(selectedActivities.map(a =>
      a.name === activityName ? { ...a, duration } : a
    ));
  };

  const saveRitual = () => {
    if (!selectedType || selectedActivities.length === 0 || !ritualName) {
      toast.error('Please complete all steps before saving');
      return;
    }

    const newRitual: SavedRitual = {
      type: selectedType,
      name: ritualName,
      activities: selectedActivities,
      customNotes,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedRituals, newRitual];
    setSavedRituals(updated);
    localStorage.setItem('calmConnectionRituals', JSON.stringify(updated));
    toast.success('Ritual saved successfully!');
    
    // Reset form
    setStep(1);
    setSelectedType(null);
    setSelectedActivities([]);
    setRitualName('');
    setCustomNotes('');
  };

  const deleteRitual = (index: number) => {
    const updated = savedRituals.filter((_, i) => i !== index);
    setSavedRituals(updated);
    localStorage.setItem('calmConnectionRituals', JSON.stringify(updated));
    toast.success('Ritual deleted');
    setViewingRitual(null);
  };

  const totalDuration = selectedActivities.reduce((sum, a) => sum + a.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-24">
      <DecorativeIcon icon="flower" position="top-right" opacity={0.1} />
      <DecorativeIcon icon="sun" position="bottom-left" opacity={0.08} />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/carer/resources')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>

        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Ritual Builder</CardTitle>
            <CardDescription>
              Create personalized calming routines that help your child feel safe and regulated during
              key transitions throughout the day.
            </CardDescription>
          </CardHeader>
        </Card>

        {viewingRitual ? (
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{viewingRitual.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setViewingRitual(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/20 rounded-lg p-4">
                <p className="text-sm font-bold mb-2">Total Duration: {viewingRitual.activities.reduce((sum, a) => sum + a.duration, 0)} minutes</p>
              </div>

              <div className="space-y-3">
                {viewingRitual.activities.map((activity, idx) => (
                  <div key={idx} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{idx + 1}. {activity.name}</span>
                      <span className="text-sm text-muted-foreground">{activity.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>

              {viewingRitual.customNotes && (
                <div className="bg-accent/20 rounded-lg p-4">
                  <p className="text-sm font-bold mb-2">Notes:</p>
                  <p className="text-sm text-foreground/80">{viewingRitual.customNotes}</p>
                </div>
              )}

              <Button
                variant="destructive"
                onClick={() => deleteRitual(savedRituals.indexOf(viewingRitual))}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ritual
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Step 1: Choose ritual type */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Step 1: Choose Your Ritual Type</h2>
                {ritualTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        selectedType === type.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card/80 hover:bg-card'
                      } backdrop-blur-sm`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-6">
                        <Icon className={`h-8 w-8 ${type.color}`} />
                        <div>
                          <h3 className="font-bold text-lg">{type.title}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedType}
                  className="w-full mt-4"
                >
                  Next: Choose Activities
                </Button>
              </div>
            )}

            {/* Step 2: Select activities */}
            {step === 2 && selectedType && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-xl font-bold mb-4">Step 2: Select 3-5 Activities</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose activities that feel doable and calming for your family rhythm.
                </p>

                <div className="space-y-3">
                  {activities
                    .filter(a => a.category === selectedType)
                    .map((activity) => {
                      const isSelected = selectedActivities.find(a => a.name === activity.name);
                      return (
                        <Card
                          key={activity.name}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'bg-primary/10 border-primary' : 'bg-card/80'
                          } backdrop-blur-sm`}
                          onClick={() => toggleActivity(activity)}
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <Checkbox checked={!!isSelected} />
                            <div className="flex-1">
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-sm text-muted-foreground">{activity.defaultDuration} min</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>

                <div className="bg-accent/20 rounded-lg p-4">
                  <p className="text-sm font-bold">
                    Selected: {selectedActivities.length} activities • Total: {totalDuration} minutes
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedActivities.length < 3 || selectedActivities.length > 5}
                  className="w-full"
                >
                  Next: Set Durations
                </Button>
              </div>
            )}

            {/* Step 3: Set durations */}
            {step === 3 && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-xl font-bold mb-4">Step 3: Adjust Durations</h2>

                <div className="space-y-3">
                  {selectedActivities.map((activity) => (
                    <Card key={activity.name} className="bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{activity.name}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min={1}
                              max={30}
                              value={activity.duration}
                              onChange={(e) => updateDuration(activity.name, parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">min</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-accent/20 rounded-lg p-4">
                  <p className="text-sm font-bold">Total Duration: {totalDuration} minutes</p>
                </div>

                <Button onClick={() => setStep(4)} className="w-full">
                  Next: Name & Save
                </Button>
              </div>
            )}

            {/* Step 4: Name and save */}
            {step === 4 && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setStep(3)} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-xl font-bold mb-4">Step 4: Name Your Ritual</h2>

                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block">Ritual Name</label>
                      <Input
                        placeholder="e.g., Our Gentle Morning Flow"
                        value={ritualName}
                        onChange={(e) => setRitualName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block">Custom Notes (optional)</label>
                      <Textarea
                        placeholder="Add any personal reminders or adjustments..."
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button onClick={saveRitual} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Ritual
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Saved rituals */}
            {savedRituals.length > 0 && step === 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Your Saved Rituals</h2>
                <div className="space-y-3">
                  {savedRituals.map((ritual, idx) => {
                    const type = ritualTypes.find(t => t.id === ritual.type);
                    const Icon = type?.icon || Sun;
                    return (
                      <Card key={idx} className="bg-card/80 backdrop-blur-sm">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-6 w-6 ${type?.color}`} />
                            <div>
                              <p className="font-bold">{ritual.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {ritual.activities.length} activities • {ritual.activities.reduce((sum, a) => sum + a.duration, 0)} min
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingRitual(ritual)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
