import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { HelplineModal } from '@/components/HelplineModal';
import { CheckInPromptModal } from '@/components/CheckInPromptModal';
import { ToolSuggestionCard } from '@/components/ToolSuggestionCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Pencil, Mic, Palette, StopCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';

const moods = ['happy', 'sad', 'angry', 'worried', 'calm', 'excited', 'scared'] as const;
type MoodType = typeof moods[number];

const moodEmojis: Record<string, string> = {
  happy: '😊',
  okay: '😐',
  sad: '😢',
  angry: '😠',
  worried: '😰',
  calm: '😌',
  excited: '🤩',
  scared: '😨',
};

export default function JournalEntry() {
  const location = useLocation();
  const selectedMood = (location.state as any)?.selectedMood || '';
  const quickCheckIn = (location.state as any)?.quickCheckIn || false;
  
  const [entryText, setEntryText] = useState('');
  const [mood, setMood] = useState<MoodType | ''>(selectedMood);
  const [shareWithCarer, setShareWithCarer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [childProfile, setChildProfile] = useState<any>(null);
  const [showSafeguardingModal, setShowSafeguardingModal] = useState(false);
  const [showCheckInPrompt, setShowCheckInPrompt] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState('');
  const [showToolSuggestion, setShowToolSuggestion] = useState(false);
  const [toolMessage, setToolMessage] = useState('');
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'write' | 'voice' | 'draw'>('write');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState<string>('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notifySharedEntry } = useNotificationTrigger();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('children_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      setChildProfile(profile);
    };

    loadProfile();
  }, [user, toast]);

  // Initialize canvas
  useEffect(() => {
    if (inputMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
      }
    }
  }, [inputMode]);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setDrawingData(canvas.toDataURL());
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawingData('');
    }
  };

  const handleSave = async () => {
    if (!childProfile) return;
    if (inputMode === 'write' && !entryText.trim()) return;
    if (inputMode === 'voice' && !audioBlob) return;
    if (inputMode === 'draw' && !drawingData) return;

    setLoading(true);

    try {
      let voiceUrl = null;
      
      // Upload voice recording if exists
      if (audioBlob && inputMode === 'voice') {
        const fileName = `voice-${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('journal-voice-notes')
          .upload(fileName, audioBlob);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('journal-voice-notes')
          .getPublicUrl(fileName);
        
        voiceUrl = publicUrl;
      }

      // Save journal entry
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert([{
          child_id: childProfile.id,
          entry_text: entryText || `[${inputMode} entry]`,
          mood_tag: mood || undefined,
          share_with_carer: shareWithCarer,
          voice_url: voiceUrl,
          drawing_data: drawingData ? { dataURL: drawingData } : null,
        }])
        .select()
        .single();

      if (entryError) throw entryError;

      // Analyze with Wendy AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'wendy-analyze-journal',
        {
          body: {
            entryText,
            childId: childProfile.id,
            journalEntryId: entry.id,
          },
        }
      );

      if (analysisError) {
        console.error('Wendy analysis error:', analysisError);
      }

      // Store entry ID for later use
      setSavedEntryId(entry.id);

      // Handle tier-based escalation
      const escalationTier = analysisData?.escalationTier || 1;
      const childMessage = analysisData?.childMessage || analysisData?.summary;

      // Handle different tiers
      switch (escalationTier) {
        case 4: // Critical - show helpline modal immediately
          setShowSafeguardingModal(true);
          setLoading(false);
          return;
          
        case 3: // Check-in prompt - ask if they want to share
          setShowCheckInPrompt(true);
          setCheckInMessage(childMessage || "I've noticed you might be going through something tough. Would you like to share this with your grown-up so they can support you?");
          setLoading(false);
          return;
          
        case 2: // Tool suggestion - show Wendy's tool recommendation
          setShowToolSuggestion(true);
          setToolMessage(childMessage || "I have some tools that might help you feel better.");
          setSuggestedTools(analysisData?.recommendedTools || []);
          break;
          
        case 1: // Supportive monitoring - continue normal flow
        default:
          // Continue with normal flow below
          break;
      }

      // Trigger notification if shared with carer
      if (shareWithCarer && childProfile.linked_carer_id) {
        await notifySharedEntry(
          childProfile.linked_carer_id,
          childProfile.nickname
        );
      }

      toast({
        title: 'Saved! 💜',
        description: 'Your journal entry has been saved',
      });

      // Navigate with Wendy's tip
      navigate('/child/home', { 
        state: { 
          showWendyTip: true,
          moodScore: analysisData?.moodScore || 50,
          entryText: entryText 
        } 
      });
    } catch (error: any) {
      console.error('Error saving entry:', error);
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to save entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShareFromCheckIn = async () => {
    if (!savedEntryId || !childProfile) return;
    
    try {
      // Update journal entry to share with carer
      await supabase
        .from('journal_entries')
        .update({ share_with_carer: true })
        .eq('id', savedEntryId);
      
      // Trigger carer notification if they have a linked carer
      if (childProfile.linked_carer_id) {
        try {
          await supabase.functions.invoke('send-notifications', {
            body: {
              type: 'shared_journal',
              userId: childProfile.linked_carer_id,
              data: {
                childNickname: childProfile.nickname,
                entryId: savedEntryId
              }
            }
          });
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
          // Continue anyway - sharing is more important than notification
        }
      }
      
      toast({
        title: 'Shared 💜',
        description: 'Your grown-up will be notified',
      });
      
      navigate('/child/home');
    } catch (error) {
      console.error('Error sharing entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to share entry. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleToolSelection = (toolName: string) => {
    // Map tool names to routes
    const toolRoutes: Record<string, string> = {
      'Breathing Space': '/child/tools/breathing-space',
      'Colour Calm': '/child/tools/colour-calm',
      'Grounding Game': '/child/tools/grounding-game',
      'Thought Clouds': '/child/tools/thought-clouds',
      'Gentle Reflections': '/child/tools/gentle-reflections',
    };
    
    const route = toolRoutes[toolName];
    if (route) {
      navigate(route, { state: { fromJournal: true } });
    } else {
      navigate('/child/tools');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2">Write in Your Journal</h1>
          <p className="text-muted-foreground">
            Share what's on your mind. It's your safe space.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          {/* Display selected mood emoji prominently */}
          {mood && (
            <div className="text-center">
              <div className="text-6xl mb-2">{moodEmojis[mood]}</div>
              <p className="text-sm text-muted-foreground">
                Feeling {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>How are you feeling today?</Label>
            <Select value={mood} onValueChange={(value) => setMood(value as MoodType)}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a mood (optional)" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="draw" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Draw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-2 mt-4">
              <Label>Your thoughts...</Label>
              <Textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Write anything you want to share. It's okay if it's messy or doesn't make perfect sense."
                className="min-h-[300px] text-base"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {entryText.length}/2000
              </p>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4 mt-4">
              <Label>Record your voice</Label>
              <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
                {!isRecording && !audioURL && (
                  <Button
                    type="button"
                    onClick={startRecording}
                    className="bg-secondary hover:bg-secondary/90"
                    size="lg"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button
                    type="button"
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                  >
                    <StopCircle className="mr-2 h-5 w-5" />
                    Stop Recording
                  </Button>
                )}
                
                {audioURL && !isRecording && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <audio src={audioURL} controls className="w-full" />
                    <Button
                      type="button"
                      onClick={() => {
                        setAudioURL('');
                        setAudioBlob(null);
                      }}
                      variant="outline"
                    >
                      Record Again
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="draw" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <Label>Draw or doodle</Label>
                <Button
                  type="button"
                  onClick={clearCanvas}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border-2 rounded-lg touch-none bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </TabsContent>
          </Tabs>

          {childProfile?.linked_carer_id && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="share"
                checked={shareWithCarer}
                onCheckedChange={(checked) => setShareWithCarer(checked as boolean)}
              />
              <label htmlFor="share" className="text-sm leading-tight">
                Share this entry with my carer (they won't see it unless you tick this)
              </label>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={loading || (inputMode === 'write' && !entryText.trim()) || (inputMode === 'voice' && !audioBlob) || (inputMode === 'draw' && !drawingData)}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <INeedHelpButton />
      <HelplineModal 
        open={showSafeguardingModal} 
        onOpenChange={setShowSafeguardingModal}
        childProfileId={childProfile?.id}
        triggeredBy="journal_entry"
      />

      <CheckInPromptModal
        open={showCheckInPrompt}
        onOpenChange={setShowCheckInPrompt}
        message={checkInMessage}
        onShare={handleShareFromCheckIn}
      />

      {showToolSuggestion && (
        <div className="fixed bottom-24 left-0 right-0 px-4 z-50 animate-fade-in">
          <ToolSuggestionCard
            message={toolMessage}
            suggestedTools={suggestedTools}
            onDismiss={() => {
              setShowToolSuggestion(false);
              navigate('/child/home');
            }}
            onSelectTool={handleToolSelection}
          />
        </div>
      )}
    </div>
  );
}