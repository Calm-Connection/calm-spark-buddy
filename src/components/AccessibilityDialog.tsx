import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAccessibility, TextSize, FontFamily } from '@/hooks/useAccessibility';
import { Settings } from 'lucide-react';

export function AccessibilityDialog() {
  const { settings, updateSetting } = useAccessibility();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 z-20 rounded-full transition-all duration-200 hover:scale-110 hover:bg-interactive-accent/10"
          aria-label="Accessibility options"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-interactive-accent/20">
        <DialogHeader>
<DialogTitle className="title-accessible text-xl">
            Accessibility Options
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Text Size */}
          <div className="space-y-2">
            <Label htmlFor="text-size">Text Size</Label>
            <Select
              value={settings.textSize}
              onValueChange={(value) => updateSetting('textSize', value as TextSize)}
            >
              <SelectTrigger id="text-size">
                <SelectValue placeholder="Select text size" />
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
            <Label htmlFor="font-family">Font Style</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => updateSetting('fontFamily', value as FontFamily)}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="dyslexia-friendly">Dyslexia Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          {/* Calm Mode (includes reduced motion) */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="calm-mode">Calm Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduces animations and movement for a calmer experience
              </p>
            </div>
            <Switch
              id="calm-mode"
              checked={settings.calmMode}
              onCheckedChange={(checked) => {
                updateSetting('calmMode', checked);
                updateSetting('reduceMotion', checked);
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
