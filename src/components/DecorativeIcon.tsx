import { Leaf, Cloud, Star, Sparkles, Flower2, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  leaf: Leaf,
  cloud: Cloud,
  star: Star,
  sparkles: Sparkles,
  flower: Flower2,
  sun: Sun,
};

interface DecorativeIconProps {
  icon: keyof typeof iconMap;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  className?: string;
}

export function DecorativeIcon({ 
  icon, 
  position = 'top-right', 
  opacity = 0.15,
  className 
}: DecorativeIconProps) {
  const Icon = iconMap[icon];
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  return (
    <Icon 
      className={cn(
        "absolute w-16 h-16 text-primary pointer-events-none",
        positionClasses[position],
        className
      )}
      style={{ opacity }}
    />
  );
}
