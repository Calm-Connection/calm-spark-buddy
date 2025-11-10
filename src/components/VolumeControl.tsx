import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function VolumeControl({ volume, onVolumeChange, soundEnabled, onToggleSound }: VolumeControlProps) {
  return (
    <Card className="p-4 bg-background/60 backdrop-blur">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className="shrink-0"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
        <div className="flex-1">
          <Slider
            value={[volume]}
            onValueChange={([v]) => onVolumeChange(v)}
            max={100}
            step={1}
            disabled={!soundEnabled}
            className="w-full"
          />
        </div>
        <span className="text-sm text-muted-foreground w-12 text-right">
          {soundEnabled ? `${volume}%` : 'Off'}
        </span>
      </div>
    </Card>
  );
}
