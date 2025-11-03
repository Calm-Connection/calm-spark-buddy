import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AvatarBuilder } from '@/components/children/AvatarBuilder';

export default function CreateAvatarEnhanced() {
  const [loading, setLoading] = useState(false);
  const [avatarData, setAvatarData] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAvatarGenerated = (data: any) => {
    setAvatarData(data);
  };

  const handleSave = async () => {
    if (!user || !avatarData) {
      toast({
        title: 'Error',
        description: 'Please create your avatar first',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      localStorage.setItem('avatarData', JSON.stringify(avatarData));
      
      await supabase
        .from('children_profiles')
        .update({ avatar_json: avatarData })
        .eq('user_id', user.id);
      
      navigate('/child/safety-note');
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to save avatar. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <Card className="border-0">
        <CardContent className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-foreground">CREATE YOUR AVATAR</h1>
            <p className="text-lg text-foreground/70">
              Design a character that represents you!
            </p>
          </div>

          <AvatarBuilder onAvatarGenerated={handleAvatarGenerated} />
          
          {avatarData && (
            <Button 
              onClick={handleSave}
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'SAVING...' : 'SAVE AVATAR'}
            </Button>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
