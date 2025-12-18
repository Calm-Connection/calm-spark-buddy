import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ObjectAvatarBuilder } from '@/components/children/ObjectAvatarBuilder';

export default function CreateAvatarEnhanced() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Single handler: generate → save → navigate (all in one click)
  const handleSaveAndContinue = async (avatarData: any) => {
    if (!user) return;
    
    try {
      // Parallel operations for speed
      const [profileUpdate] = await Promise.all([
        supabase
          .from('children_profiles')
          .update({ avatar_json: avatarData })
          .eq('user_id', user.id),
        supabase
          .from('avatar_history')
          .insert({
            user_id: user.id,
            avatar_json: avatarData,
            is_current: true
          })
      ]);
      
      if (profileUpdate.error) throw profileUpdate.error;
      
      toast({
        title: 'All done!',
        description: 'Your character has been saved',
      });
      
      // Immediate navigation
      navigate('/child/safety-note', { replace: true });
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Oops',
        description: 'Something didn\'t work quite right. Let\'s try again.',
        variant: 'destructive'
      });
      throw error; // Re-throw so ObjectAvatarBuilder knows it failed
    }
  };

  return (
    <PageLayout>
      <Card className="border-0">
        <CardContent className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-foreground">Create Your Character</h1>
            <p className="text-lg text-foreground/70">
              Design a character that feels like you
            </p>
          </div>

          <ObjectAvatarBuilder 
            onSaveAndContinue={handleSaveAndContinue}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
