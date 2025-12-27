import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { INeedHelpButton } from '@/components/INeedHelpButton';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { WendyAvatar } from '@/components/WendyAvatar';
import { Sparkles, Send, Loader2, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DecorativeIcon } from '@/components/DecorativeIcon';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { CrisisSupportModal } from '@/components/CrisisSupportModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedTools?: CopingTool[];
}

interface CopingTool {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  icon: string;
}

export default function WendyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Wendy 💜 I'm here to listen and chat with you. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'hurt myself', 'self harm', 'end my life'];
    const inputLower = userMessage.toLowerCase();
    if (crisisKeywords.some(keyword => inputLower.includes(keyword))) {
      setShowCrisisModal(true);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wendy-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }],
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from Wendy');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Add empty assistant message to update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // After streaming is complete, detect if tools should be suggested
      const detectedTools = await detectAndFetchTools(assistantMessage);
      if (detectedTools.length > 0) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].suggestedTools = detectedTools;
          return newMessages;
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const detectAndFetchTools = async (messageContent: string): Promise<CopingTool[]> => {
    const lowerContent = messageContent.toLowerCase();
    
    // Detect emotion keywords and map to tool tags
    const emotionKeywords: { [key: string]: string[] } = {
      anxiety: ['anxious', 'worried', 'nervous', 'scared', 'worry', 'fear', 'afraid'],
      stress: ['stressed', 'overwhelmed', 'pressure', 'too much'],
      sad: ['sad', 'lonely', 'hurt', 'upset', 'down'],
      anger: ['angry', 'frustrated', 'annoyed', 'mad'],
      calm: ['calm', 'relax', 'breathe', 'breathing'],
    };

    const detectedTags: string[] = [];
    for (const [tag, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        detectedTags.push(tag);
      }
    }

    if (detectedTags.length === 0) return [];

    // Fetch matching tools from database
    try {
      const { data: tools, error } = await supabase
        .from('coping_tools')
        .select('*')
        .overlaps('tags', detectedTags)
        .limit(3);

      if (error) throw error;
      
      return tools?.map(tool => ({
        ...tool,
        instructions: tool.instructions as string[]
      })) || [];
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-accent/10 to-background flex flex-col relative">
      <DecorativeIcon icon="sparkles" position="top-right" opacity={0.08} />
      <DecorativeIcon icon="star" position="bottom-left" opacity={0.06} />
      {/* Header */}
      <div className="bg-gradient-to-br from-interactive-accent/10 to-primary/10 border-b border-interactive-accent/20 p-4 shadow-soft">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-interactive-accent/10 transition-colors">
          ← Back
        </Button>
        <div className="flex items-center gap-3 mt-2">
          <WendyAvatar size="md" />
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Wendy 💜</h2>
            <p className="text-sm text-muted-foreground font-medium">Your AI friend</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((message, idx) => (
          <div key={idx} className="space-y-3">
            <div
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <WendyAvatar size="sm" className="mr-2 mt-1" />
              )}
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/30'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
            
            {/* Suggested Coping Tools */}
            {message.suggestedTools && message.suggestedTools.length > 0 && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">Tools that might help</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {message.suggestedTools.map((tool) => (
                      <div key={tool.id} className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                        >
                          <span className="mr-2">{tool.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.description}</div>
                          </div>
                        </Button>
                        
                        {expandedTool === tool.id && (
                          <Card className="p-3 bg-accent/20">
                            <div className="space-y-2">
                              <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                              <Separator />
                              <div className="text-xs space-y-1">
                                <p className="font-semibold">How to do it:</p>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                  {tool.instructions.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="p-4 bg-accent/30">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-background px-4 sm:px-6 py-3 sm:py-4 pb-6 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="What's on your mind?"
            disabled={isLoading}
            className="min-h-[44px]"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 h-11 w-11"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <INeedHelpButton />
      <CrisisSupportModal 
        open={showCrisisModal} 
        onOpenChange={setShowCrisisModal}
        triggerReason="keywords"
      />
    </div>
  );
}