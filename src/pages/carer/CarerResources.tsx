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
  CheckCircle2
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

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

    // Load modules for carers
    const { data: modulesData } = await supabase
      .from('modules')
      .select('*')
      .eq('category', 'carer')
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
      title: 'Breathing Together',
      description: 'A guided breathing exercise you can do with your child',
      icon: Wind,
      action: () => navigate('/child/tools'), // Share tools page
    },
    {
      title: 'Calm Moment for You',
      description: 'Take 2 minutes for your own wellbeing',
      icon: Sparkles,
      action: () => {}, // Could add meditation
    },
    {
      title: 'Reflection Prompts',
      description: 'Journaling prompts to help you process your own feelings',
      icon: BookOpen,
      action: () => navigate('/carer/journal'),
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
        <div>
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
        <div>
          <h2 className="text-xl font-bold mb-3">Learning Modules</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bite-sized lessons to help you support your child's emotional wellbeing
          </p>
          
          {modules.length === 0 ? (
            <Card className="p-8 text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Parenting modules coming soon! Check back later for guidance on supporting anxious children, co-regulation, and more.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {modules.map((module) => {
                const Icon = getIconComponent(module.icon);
                const isCompleted = progress[module.id];
                
                return (
                  <Card 
                    key={module.id} 
                    className="p-5 cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => navigate(`/shared/modules/${module.id}`)}
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
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
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
          )}
        </div>

        {/* Encouragement */}
        <Card className="p-6 bg-gradient-to-br from-warm/20 to-accent/20">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm leading-relaxed">
                <strong>You're doing amazing work.</strong> Supporting a child with anxiety takes patience, 
                empathy, and courage. Small steps make a big difference, and you're not alone in this journey 💛
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav role="carer" />
    </div>
  );
}
