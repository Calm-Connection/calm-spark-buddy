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
  CheckCircle2,
  Shield,
  FileText,
  Lock
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
  ];

  const learningModules = [
    {
      id: 'connection',
      title: 'Understanding Anxiety Through Connection',
      description: "How your child's nervous system seeks safety through you",
      icon: Heart,
      content: "Based on Polyvagal Theory, anxiety isn't just in their head — it's their nervous system looking for safety signals. Your calm presence is the strongest signal of all.",
    },
    {
      id: 'boundaries',
      title: 'Boundaries, Standards, and Expectations',
      description: 'Clear, compassionate guidance on the differences',
      icon: GraduationCap,
      content: `Boundaries protect safety. Standards reflect values. Expectations are what we hope for. Knowing the difference helps you parent with clarity and kindness.`,
    },
    {
      id: 'coregulation',
      title: 'Co-Regulation in Action',
      description: 'Practical examples of calming together',
      icon: Wind,
      content: `Your calm nervous system is like Wi-Fi for safety — your child connects through you. Learn simple ways to regulate together in real moments.`,
    },
    {
      id: 'grounding',
      title: 'Grounding and Body Awareness',
      description: 'Simple sensory tools you can use anywhere',
      icon: Sparkles,
      content: `The 5-4-3-2-1 technique, warming hands, slow sipping — small body-based practices that signal safety to the nervous system.`,
    },
    {
      id: 'preventative',
      title: 'Preventative Care: Creating Safety Before Stress',
      description: 'Building calm rituals and predictable routines',
      icon: Heart,
      content: "Prevention isn't avoiding hard feelings — it's creating enough safety so your child has capacity to face them. Small rituals build big resilience.",
    },
  ];

  const comingSoonModules = [
    'Supporting anxious children through change',
    'Repairing connection after conflict',
    'Teaching consent and emotional language',
    'Understanding your own triggers',
    'Navigating professional support safely',
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
          <h2 className="text-xl font-bold mb-3">Learning Modules 📘</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bite-sized psychoeducation in warm, everyday language — 2-minute reads
          </p>
          
          <div className="space-y-3">
            {learningModules.map((module) => {
              const Icon = module.icon;
              
              return (
                <Card 
                  key={module.id} 
                  className="p-5 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      <p className="text-sm leading-relaxed bg-accent/10 p-3 rounded-lg italic">
                        {module.content}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <h2 className="text-xl font-bold mb-3">Coming Soon 🌱</h2>
          <Card className="p-5">
            <ul className="space-y-2">
              {comingSoonModules.map((title, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  {title}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Policies & Trust Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">Policies & Trust 🔒</h2>
          <div className="grid gap-3">
            <Card 
              className="p-5 cursor-pointer hover:bg-accent/10 transition-colors" 
              onClick={() => navigate('/carer/privacy-policy')}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">How we protect and use your data</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-5 cursor-pointer hover:bg-accent/10 transition-colors" 
              onClick={() => navigate('/carer/terms-of-use')}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Terms of Use</h3>
                  <p className="text-sm text-muted-foreground">Guidelines for using Calm Connection</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-5 cursor-pointer hover:bg-accent/10 transition-colors" 
              onClick={() => navigate('/carer/safeguarding-info')}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Safeguarding & Safety</h3>
                  <p className="text-sm text-muted-foreground">How we protect children's wellbeing</p>
                </div>
              </div>
            </Card>
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
