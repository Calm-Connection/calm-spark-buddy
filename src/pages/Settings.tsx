import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAccessibility, TextSize, FontFamily } from '@/hooks/useAccessibility';
import { loadSavedTheme, ThemeName } from '@/hooks/useTheme';
import { Settings as SettingsIcon, User, Save, Palette, Accessibility, MessageSquareWarning, Link as LinkIcon, Edit, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ReportConcernModal } from '@/components/ReportConcernModal';
import { FloatingElements } from '@/components/FloatingElements';
import { AddCarerCodeModal } from '@/components/AddCarerCodeModal';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const { toast } = useToast();
  const { settings, updateSetting } = useAccessibility();
  
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [currentTheme, setCurrentTheme] = useState<ThemeName | null>(null);
  const [linkedCarerInfo, setLinkedCarerInfo] = useState<any>(null);
  
  const [avatarCustomizerOpen, setAvatarCustomizerOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [addCarerCodeOpen, setAddCarerCodeOpen] = useState(false);
  const [avatarHistory, setAvatarHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !userRole) return;

      const table = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setNickname(data.nickname || '');
        setNewNickname(data.nickname || '');
        setAvatarData(data.avatar_json);
        
        if (userRole === 'child') {
          setCurrentTheme((data as any).theme || null);
          
          if ((data as any).linked_carer_id) {
            const { data: carerData } = await supabase
              .from('carer_profiles')
              .select('nickname')
              .eq('user_id', (data as any).linked_carer_id)
              .single();
            
            if (carerData) {
              setLinkedCarerInfo(carerData);
            }
          }
        }
      }
    };

    fetchProfile();
  }, [user, userRole]);

  useEffect(() => {
    const fetchAvatarHistory = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('avatar_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        // Deduplicate by imageUrl, keeping the most recent of each
        const uniqueAvatars = data.reduce((acc, curr) => {
          const imageUrl = (curr.avatar_json as any)?.imageUrl;
          if (!acc.some(item => (item.avatar_json as any)?.imageUrl === imageUrl)) {
            acc.push(curr);
          }
          return acc;
        }, [] as typeof data);
        
        setAvatarHistory(uniqueAvatars.slice(0, 6));
      }
    };

    fetchAvatarHistory();
  }, [user]);

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
    <div className="min-h-screen bg-background p-6 relative">
      <FloatingElements theme={currentTheme} />
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div>
          <Button
            variant="ghost"
            onClick={() => {
              const canGoBack = window.history.state?.idx > 0;
              if (canGoBack) {
                navigate(-1);
              } else {
                navigate(userRole === 'child' ? '/child/home' : '/carer/home');
              }
            }}
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
        </div>

        {/* Profile Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <AvatarDisplay avatarData={avatarData} size="lg" />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  onClick={() => setAvatarCustomizerOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
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

            {/* Connection Status */}
            {userRole === 'child' && (
              <div className="pt-4">
                {linkedCarerInfo ? (
                  <div 
                    className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-4"
                    role="status"
                    aria-label="Connected to carer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                      <span className="font-semibold text-green-900 dark:text-green-100">
                        Connected to {linkedCarerInfo.nickname}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your carer can see shared journal entries
                    </p>
                  </div>
                ) : (
                  <div 
                    className="rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-4"
                    role="status"
                    aria-label="Not connected to carer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span className="font-semibold text-amber-900 dark:text-amber-100">
                        Not Connected
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                      Add a carer code to connect with your carer
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setAddCarerCodeOpen(true)}
                    >
                      Add Carer Code
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Avatar History */}
            {avatarHistory.length > 0 && (
              <div className="pt-4 border-t space-y-3">
                <Label className="text-sm font-medium">Previous Avatars</Label>
                <p className="text-xs text-muted-foreground">Click to restore a previous avatar</p>
                <div className="grid grid-cols-3 gap-2">
                  {avatarHistory.map((historyItem) => (
                    <button
                      key={historyItem.id}
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const tableName = userRole === 'child' ? 'children_profiles' : 'carer_profiles';
                          const { error } = await supabase
                            .from(tableName)
                            .update({ avatar_json: historyItem.avatar_json })
                            .eq('user_id', user!.id);
                          
                          if (error) throw error;

                          // Update history
                          await supabase
                            .from('avatar_history')
                            .update({ is_current: false })
                            .eq('user_id', user!.id);

                          await supabase
                            .from('avatar_history')
                            .update({ is_current: true })
                            .eq('id', historyItem.id);

                          // Refresh avatar history to show updated current state
                          const { data: updatedHistory } = await supabase
                            .from('avatar_history')
                            .select('*')
                            .eq('user_id', user!.id)
                            .order('created_at', { ascending: false });

                          if (updatedHistory) {
                            // Deduplicate by imageUrl, keeping the most recent of each
                            const uniqueAvatars = updatedHistory.reduce((acc, curr) => {
                              const imageUrl = (curr.avatar_json as any)?.imageUrl;
                              if (!acc.some(item => (item.avatar_json as any)?.imageUrl === imageUrl)) {
                                acc.push(curr);
                              }
                              return acc;
                            }, [] as typeof updatedHistory);
                            
                            setAvatarHistory(uniqueAvatars.slice(0, 6));
                          }

                          setAvatarData(historyItem.avatar_json);
                          toast({
                            title: 'Success',
                            description: 'Avatar restored!',
                          });
                        } catch (error) {
                          console.error('Error restoring avatar:', error);
                          toast({
                            title: 'Error',
                            description: 'Failed to restore avatar',
                            variant: 'destructive',
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        historyItem.is_current
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      disabled={loading}
                    >
                      <AvatarDisplay 
                        avatarData={historyItem.avatar_json}
                        size="sm"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Theme Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </h2>
          <ThemeSelector 
            currentTheme={currentTheme} 
            onThemeChange={(theme) => setCurrentTheme(theme)}
          />
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your notification preferences
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(userRole === 'child' ? '/child/notification-settings' : '/carer/notification-settings')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </Card>

        {/* Accessibility Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility
          </h2>
          <div className="space-y-6">
            {/* Text Size */}
            <div className="space-y-2">
              <Label>Text Size</Label>
              <Select
                value={settings.textSize}
                onValueChange={(value) => updateSetting('textSize', value as TextSize)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <Label>Font Style</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => updateSetting('fontFamily', value as FontFamily)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="dyslexia-friendly">Dyslexia-Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground">Increase color contrast for better visibility</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            {/* Calm Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Calm Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce animations and visual effects</p>
              </div>
              <Switch
                checked={settings.calmMode}
                onCheckedChange={(checked) => updateSetting('calmMode', checked)}
              />
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize movement for comfort</p>
              </div>
              <Switch
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Support & Reporting */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5" />
            Support
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Found a bug or have feedback? Let us know so we can make Calm Connection better for everyone.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setReportModalOpen(true)}
            >
              <MessageSquareWarning className="h-4 w-4 mr-2" />
              Report a Concern
            </Button>
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

      {/* Modals */}
      <AvatarCustomizer
        open={avatarCustomizerOpen}
        onOpenChange={setAvatarCustomizerOpen}
        currentAvatar={avatarData}
        onAvatarUpdate={setAvatarData}
      />
      <ReportConcernModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
      />
      <AddCarerCodeModal
        open={addCarerCodeOpen}
        onOpenChange={setAddCarerCodeOpen}
        onSuccess={() => {
          // Refresh profile to show linked carer
          if (user && userRole === 'child') {
            supabase
              .from('children_profiles')
              .select('linked_carer_id')
              .eq('user_id', user.id)
              .single()
              .then(({ data }) => {
                if (data?.linked_carer_id) {
                  supabase
                    .from('carer_profiles')
                    .select('nickname')
                    .eq('user_id', data.linked_carer_id)
                    .single()
                    .then(({ data: carerData }) => {
                      if (carerData) {
                        setLinkedCarerInfo(carerData);
                      }
                    });
                }
              });
          }
        }}
      />
    </div>
  );
}