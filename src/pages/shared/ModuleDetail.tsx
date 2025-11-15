import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BottomNav } from '@/components/BottomNav';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { DecorativeIcon } from '@/components/DecorativeIcon';

interface Lesson {
  id: string;
  title: string;
  content: string;
  content_type: string;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function ModuleDetail() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const { user } = useAuth();
  const { notifyModuleComplete } = useNotificationTrigger();
  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [userRole, setUserRole] = useState<'child' | 'carer'>('child');

  useEffect(() => {
    loadUserRole();
    loadModule();
  }, [moduleId, user]);

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

  const loadModule = async () => {
    if (!moduleId) return;

    const { data: moduleData } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (moduleData) {
      setModule(moduleData);
    }

    const { data: lessonsData } = await supabase
      .from('module_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (lessonsData) {
      setLessons(lessonsData);
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    }

    if (user) {
      const { data: progressData } = await supabase
        .from('user_module_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('completed', true);

      if (progressData) {
        setCompletedLessons(new Set(progressData.map((p) => p.lesson_id)));
      }
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user || !moduleId) return;

    try {
      const { error } = await supabase.from('user_module_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      setCompletedLessons((prev) => new Set([...prev, lessonId]));
      toast.success('Lesson completed! 🎉');

      // Check if module is now complete
      const newCompletedCount = completedLessons.size + 1;
      if (newCompletedCount === lessons.length && userRole === 'child') {
        // Module complete - notify carer
        const { data: childProfile } = await supabase
          .from('children_profiles')
          .select('nickname, linked_carer_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (childProfile?.linked_carer_id && module) {
          await notifyModuleComplete(
            childProfile.linked_carer_id,
            childProfile.nickname || 'Your child',
            module.title
          );
        }

        // Award achievement
        await checkAndAwardAchievement();
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Could not save progress');
    }
  };

  const checkAndAwardAchievement = async () => {
    if (!user) return;

    const { data: achievement } = await supabase
      .from('achievements')
      .select('id')
      .eq('category', 'module')
      .eq('name', 'Learning Journey')
      .single();

    if (achievement) {
      await supabase.from('user_achievements').upsert({
        user_id: user.id,
        achievement_id: achievement.id,
        progress: 1,
      });
    }
  };

  if (!module) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/${userRole}/modules`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{module.icon}</span>
            <h1 className="text-2xl font-bold">{module.title}</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Lessons sidebar */}
          <Card className="p-4 space-y-2 h-fit">
            <h3 className="font-semibold mb-3">Lessons</h3>
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.has(lesson.id);
              const isSelected = selectedLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-2 ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{lesson.title}</span>
                </button>
              );
            })}
          </Card>

          {/* Lesson content */}
          {selectedLesson && (
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">{selectedLesson.content}</p>
                </div>
              </div>

              {!completedLessons.has(selectedLesson.id) && (
                <Button
                  onClick={() => markLessonComplete(selectedLesson.id)}
                  className="w-full"
                >
                  Mark as Complete
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      <BottomNav role={userRole} />
    </div>
  );
}
