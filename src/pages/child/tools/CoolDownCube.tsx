import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { DisclaimerCard } from '@/components/disclaimers/DisclaimerCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function CoolDownCube() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (isComplete && !hasTrackedRef.current && user) {
      hasTrackedRef.current = true;
      supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_name: 'Cool Down Cube',
        duration_minutes: 2,
        completed: true
      }).then(() => {});
    }
  }, [isComplete, user]);

  useEffect(() => {
    if (size > 0 && !isComplete) {
      const interval = setInterval(() => {
        setSize(prev => {
          const newSize = prev - 0.5;
          if (newSize <= 0) {
            setIsComplete(true);
            return 0;
          }
          return newSize;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [size, isComplete]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ 
        x: Math.max(10, Math.min(90, x)), 
        y: Math.max(10, Math.min(90, y)) 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setPosition({ 
        x: Math.max(10, Math.min(90, x)), 
        y: Math.max(10, Math.min(90, y)) 
      });
    }
  };

  const handleReset = () => {
    setSize(100);
    setIsComplete(false);
    setPosition({ x: 50, y: 50 });
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
            Cool Down Cube 🧊
          </h1>
        </div>

        {!isComplete ? (
          <>
            <p className="text-muted-foreground font-medium">
              Drag the ice cube around to cool down. Watch it melt slowly.
            </p>

            <Card
              className="relative h-[400px] overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-cyan-100 via-blue-100 to-cyan-100 dark:from-cyan-950 dark:via-blue-950 dark:to-cyan-950"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <div
                className="absolute transition-all duration-200 flex items-center justify-center text-6xl select-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <div 
                  className="w-full h-full rounded-lg bg-gradient-to-br from-cyan-200 to-blue-300 dark:from-cyan-400 dark:to-blue-500 shadow-soft-lg flex items-center justify-center"
                  style={{ opacity: size / 100 }}
                >
                  🧊
                </div>
              </div>
            </Card>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Cube size: {size.toFixed(0)}%</div>
              <p className="text-muted-foreground font-medium">
                As the ice melts, feel your stress melting away too
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950 text-center space-y-4">
              <div className="text-6xl">💧</div>
              <h2 className="text-2xl font-bold">
                All Melted! 🌊
              </h2>
              <p className="text-muted-foreground font-medium">
                You've cooled down. Take a deep breath and feel the calm.
              </p>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Melt Another Cube
              </Button>
              <Button 
                onClick={() => navigate('/child/tools')}
                className="flex-1"
              >
                Done
              </Button>
            </div>
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
