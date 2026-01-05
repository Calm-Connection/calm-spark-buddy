import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function WarmHandsTrick() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sunPosition, setSunPosition] = useState({ x: 50, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [leftHandWarmed, setLeftHandWarmed] = useState(false);
  const [rightHandWarmed, setRightHandWarmed] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  const bothWarmed = leftHandWarmed && rightHandWarmed;

  useEffect(() => {
    if (bothWarmed && !hasTracked && user) {
      setHasTracked(true);
      supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_name: 'Warm Hands Trick',
        duration_minutes: 1,
        completed: true
      }).then(() => {});
    }
  }, [bothWarmed, hasTracked, user]);

  const leftHandPos = { x: 25, y: 60 };
  const rightHandPos = { x: 75, y: 60 };

  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSunPosition({ 
        x: Math.max(10, Math.min(90, x)), 
        y: Math.max(10, Math.min(90, y)) 
      });

      // Check if sun is near hands
      if (distance(x, y, leftHandPos.x, leftHandPos.y) < 15) {
        setLeftHandWarmed(true);
      }
      if (distance(x, y, rightHandPos.x, rightHandPos.y) < 15) {
        setRightHandWarmed(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setSunPosition({ 
        x: Math.max(10, Math.min(90, x)), 
        y: Math.max(10, Math.min(90, y)) 
      });

      if (distance(x, y, leftHandPos.x, leftHandPos.y) < 15) {
        setLeftHandWarmed(true);
      }
      if (distance(x, y, rightHandPos.x, rightHandPos.y) < 15) {
        setRightHandWarmed(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-accent/5 to-background pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/child/tools')} 
            className="hover:bg-interactive-accent/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Warm Hands Trick ☀️
          </h1>
        </div>

        <p className="text-muted-foreground font-medium">
          Drag the sun over both hands to warm them up
        </p>

        <Card
          className="relative h-[500px] overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-950"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Left Hand */}
          <div
            className={`absolute text-7xl transition-all duration-500 select-none ${
              leftHandWarmed ? 'scale-110 drop-shadow-glow' : ''
            }`}
            style={{
              left: `${leftHandPos.x}%`,
              top: `${leftHandPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            ✋
            {leftHandWarmed && (
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
            )}
          </div>

          {/* Right Hand */}
          <div
            className={`absolute text-7xl transition-all duration-500 select-none ${
              rightHandWarmed ? 'scale-110 drop-shadow-glow' : ''
            }`}
            style={{
              left: `${rightHandPos.x}%`,
              top: `${rightHandPos.y}%`,
              transform: 'translate(-50%, -50%) scaleX(-1)',
            }}
          >
            ✋
            {rightHandWarmed && (
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
            )}
          </div>

          {/* Sun */}
          <div
            className="absolute transition-all duration-200 select-none"
            style={{
              left: `${sunPosition.x}%`,
              top: `${sunPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="relative">
              <div className="text-7xl animate-spin" style={{ animationDuration: '10s' }}>☀️</div>
              <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-2xl" />
            </div>
          </div>
        </Card>

        {!bothWarmed ? (
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              {!leftHandWarmed && !rightHandWarmed && 'Warm both hands with sunshine'}
              {leftHandWarmed && !rightHandWarmed && 'Great! Now warm the right hand ✨'}
              {!leftHandWarmed && rightHandWarmed && 'Great! Now warm the left hand ✨'}
            </p>
            <div className="flex gap-4 justify-center">
              <div className={`px-3 py-1 rounded-full text-sm ${leftHandWarmed ? 'bg-amber-400 text-white' : 'bg-muted'}`}>
                Left {leftHandWarmed && '✓'}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${rightHandWarmed ? 'bg-amber-400 text-white' : 'bg-muted'}`}>
                Right {rightHandWarmed && '✓'}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 text-center space-y-4">
              <div className="text-6xl">🤗</div>
              <h2 className="text-2xl font-bold">
                Warm and Cozy! ✨
              </h2>
              <p className="text-muted-foreground font-medium">
                Your hands feel warm and safe. Take a moment to enjoy this feeling.
              </p>
            </Card>

            <Button 
              onClick={() => navigate('/child/tools')}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}

        <div className="mt-4">
          <DisclaimerCard variant="tool-limitation" size="small" />
        </div>
      </div>

      <BottomNav role="child" />
    </div>
  );
}
