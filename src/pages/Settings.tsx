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
import { Settings as SettingsIcon, User, Save, Palette, Accessibility, MessageSquareWarning, Link as LinkIcon, Edit } from 'lucide-react';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ReportConcernModal } from '@/components/ReportConcernModal';
import { FloatingElements } from '@/components/FloatingElements';

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      if (userRole === 'child') {
        const { data } = await supabase
          .from('children_profiles')
          .select('nickname, avatar_json, theme, linked_carer_id')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setNickname(data.nickname || '');
          setNewNickname(data.nickname || '');
          setAvatarData(data.avatar_json);
          
          const savedTheme = data.theme || loadSavedTheme() || 'classic';
          setCurrentTheme(savedTheme as ThemeName);
          
          // Fetch linked carer info if exists
          if (data.linked_carer_id) {
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
        }
      } else {
        const { data } = await supabase
          .from('carer_profiles')
          .select('nickname, avatar_json')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setNickname(data.nickname || '');
          setNewNickname(data.nickname || '');
          setAvatarData(data.avatar_json);
          setCurrentTheme('classic');
        }
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
    <div className="min-h-screen bg-background p-6 relative">
      <FloatingElements theme={currentTheme} />
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
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

            {linkedCarerInfo && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Linked to:</span>
                  <span className="font-medium">{linkedCarerInfo.nickname}</span>
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
    </div>
  );
}