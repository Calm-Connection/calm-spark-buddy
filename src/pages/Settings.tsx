import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, User, Save } from 'lucide-react';
import { AvatarDisplay } from '@/components/AvatarDisplay';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
      const { data } = await supabase
        .from(table)
        .select('nickname, avatar_json')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setNickname(data.nickname || '');
        setNewNickname(data.nickname || '');
        setAvatarData(data.avatar_json);
      }
    };

    fetchProfile();
  }, [user, userRole]);

  const handleSaveNickname = async () => {
    if (!user || newNickname.length < 3) {
      toast({
        title: 'Invalid nickname',
        description: 'Nickname must be at least 3 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
    
    const { error } = await supabase
      .from(table)
      .update({ nickname: newNickname })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update nickname',
        variant: 'destructive',
      });
    } else {
      setNickname(newNickname);
      setEditingNickname(false);
      toast({
        title: 'Success',
        description: 'Nickname updated',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
        </div>

        {/* Profile Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <AvatarDisplay avatarData={avatarData} size="lg" />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-bold capitalize">{userRole}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              {editingNickname ? (
                <div className="flex gap-2">
                  <Input
                    id="nickname"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="Enter nickname"
                    minLength={3}
                    maxLength={20}
                  />
                  <Button 
                    onClick={handleSaveNickname}
                    disabled={loading}
                    size="sm"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingNickname(false);
                      setNewNickname(nickname);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="font-medium">{nickname}</p>
                  <Button 
                    onClick={() => setEditingNickname(true)}
                    variant="outline"
                    size="sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">App Version</h3>
              <p className="text-sm text-muted-foreground">1.0.0 (MVP)</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">About Calm Connection</h3>
              <p className="text-sm text-muted-foreground">
                A gentle, nurturing space where children and carers grow emotionally together.
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={signOut}
          variant="destructive"
          className="w-full"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}