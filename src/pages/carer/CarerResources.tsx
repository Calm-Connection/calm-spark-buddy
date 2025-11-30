import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  Wind, 
  Sparkles,
  GraduationCap,
  MessageCircle,
  Shield,
  Calendar,
  Users
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  order_index: number;
}

export default function CarerResources() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, [user]);

  const loadResources = async () => {
    if (!user) return;

    // Load modules for carers - fetch all carer courses
    const { data: modulesData } = await supabase
      .from('modules')
      .select('*')
      .like('category', 'carer-%')
      .order('order_index', { ascending: true });

    setModules((modulesData as Module[]) || []);

    // Load user progress
    const { data: progressData } = await supabase
      .from('user_module_progress')
      .select('module_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true);

    const progressMap: Record<string, boolean> = {};
    progressData?.forEach((p) => {
      progressMap[p.module_id] = true;
    });
    setProgress(progressMap);

    setLoading(false);
  };

  const carerTools = [
    {
      title: 'Breathing Together 🫶',
      description: 'Co-regulation through shared breath — your calm helps theirs',
      icon: Wind,
      action: () => navigate('/carer/tools/breathing-together'),
    },
    {
      title: 'Calm Moment for You ☀️',
      description: 'Quick resets for your nervous system (1-2 minutes)',
      icon: Sparkles,
      action: () => navigate('/carer/tools/calm-moment'),
    },
    {
      title: 'Reflection Prompts 💬',
      description: 'Journaling prompts with gentle reframes from AI',
      icon: BookOpen,
      action: () => navigate('/carer/tools/reflection-prompts'),
    },
    {
      title: 'In-the-Moment Scripts 💬',
      description: 'Ready-to-use phrases for anxiety, school refusal, bedtime worries',
      icon: MessageCircle,
      action: () => navigate('/carer/tools/moment-scripts'),
    },
    {
      title: 'Safety Signals 🤲',
      description: 'Learn physical cues that signal safety to your child',
      icon: Shield,
      action: () => navigate('/carer/tools/safety-signals'),
    },
    {
      title: 'Ritual Builder 📅',
      description: 'Create calming morning, after-school, and bedtime routines',
      icon: Calendar,
      action: () => navigate('/carer/tools/ritual-builder'),
    },
    {
      title: 'Grounding for Two 🫂',
      description: 'Mini co-regulation exercises for you and your child together',
      icon: Users,
      action: () => navigate('/carer/tools/grounding-together'),
    },
  ];


  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      BookOpen,
      Heart,
      GraduationCap,
      Wind,
      Sparkles,
    };
    return icons[iconName] || BookOpen;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/carer/home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Resources & Support 🌿</h1>
            <p className="text-muted-foreground">
              Guidance and tools for supporting your child
            </p>
          </div>
        </div>

        {/* Carer Tools */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">Quick Tools for Carers</h2>
          <div className="grid gap-3">
            {carerTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Card key={idx} className="p-5 cursor-pointer hover:bg-accent/10 transition-colors" onClick={tool.action}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Learning Modules */}
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">Learning Modules 📘</h2>
          <p className="text-sm text-muted-foreground mb-4">
            5 comprehensive courses with bite-sized lessons — evidence-based guidance from NHS, NICE, and Anna Freud Centre
          </p>
          
          <div className="space-y-3">
            {modules.map((module) => {
              const Icon = getIconComponent(module.icon);
              const isCompleted = progress[module.id];
              
              return (
                <Card 
                  key={module.id} 
                  className="p-5 cursor-pointer hover:bg-accent/10 transition-colors"
                  onClick={() => navigate(`/carer/modules/${module.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{module.title}</h3>
                        {isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Complete
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Encouragement */}
        <Card className="p-6 bg-gradient-to-br from-warm/20 to-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-6xl opacity-20">💚</div>
          <div className="flex items-start gap-3 relative z-10">
            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1 animate-pulse" />
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                <strong>You're doing amazing work.</strong> Supporting a child with anxiety takes patience, 
                empathy, and courage. Small steps make a big difference, and you're not alone in this journey.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Your calm nervous system is like Wi-Fi for safety — your child connects through you.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
