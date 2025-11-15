import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface ModuleProgress {
  module_id: string;
  completed_lessons: number;
  total_lessons: number;
}

export default function Modules() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({});
  const [userRole, setUserRole] = useState<'child' | 'carer'>('child');

  useEffect(() => {
    loadUserRole();
    loadModules();
  }, [user]);

  const loadUserRole = async () => {
    if (!user) return;

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roles) {
      setUserRole(roles.role === 'carer' ? 'carer' : 'child');
    }
  };

  const loadModules = async () => {
    const { data: modulesData } = await supabase
      .from('modules')
      .select('*')
      .order('order_index', { ascending: true });

    if (modulesData) {
      setModules(modulesData);
      await loadProgress(modulesData);
    }
  };

  const loadProgress = async (modulesList: Module[]) => {
    if (!user) return;

    const progressMap: Record<string, ModuleProgress> = {};

    for (const module of modulesList) {
      const { data: lessons } = await supabase
        .from('module_lessons')
        .select('id')
        .eq('module_id', module.id);

      const { data: completed } = await supabase
        .from('user_module_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('module_id', module.id)
        .eq('completed', true);

      progressMap[module.id] = {
        module_id: module.id,
        completed_lessons: completed?.length || 0,
        total_lessons: lessons?.length || 0,
      };
    }

    setProgress(progressMap);
  };

  const getProgressPercentage = (moduleId: string) => {
    const moduleProgress = progress[moduleId];
    if (!moduleProgress || moduleProgress.total_lessons === 0) return 0;
    return (moduleProgress.completed_lessons / moduleProgress.total_lessons) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/${userRole}/home`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Learning Modules</h1>
        </div>

        <div className="space-y-4">
          {modules.map((module) => {
            const progressPercent = getProgressPercentage(module.id);
            const moduleProgress = progress[module.id];

            return (
              <Card
                key={module.id}
                className="relative p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-soft-lg bg-gradient-to-br from-primary/5 to-accent/5 border-interactive-accent/20 shadow-soft"
                onClick={() => navigate(`/${userRole}/modules/${module.id}`)}
              >
                <DecorativeIcon icon="sparkles" position="top-right" opacity={0.08} />
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{module.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    
                    {moduleProgress && moduleProgress.total_lessons > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>
                            {moduleProgress.completed_lessons} / {moduleProgress.total_lessons} lessons
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav role={userRole} />
    </div>
  );
}
