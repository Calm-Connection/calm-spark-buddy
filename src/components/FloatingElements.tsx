import { useEffect, useState } from 'react';
import { type ThemeName } from '@/hooks/useTheme';

interface FloatingElementsProps {
  theme: ThemeName;
}

export function FloatingElements({ theme }: FloatingElementsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {theme === 'forest' && <ForestElements />}
      {theme === 'sky' && <SkyElements />}
      {theme === 'ocean' && <OceanElements />}
      {theme === 'cozy' && <CozyElements />}
      {theme === 'classic' && <ClassicElements />}
    </div>
  );
}

function ForestElements() {
  return (
    <>
      {/* Floating Leaves */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`leaf-${i}`}
          className="absolute animate-float-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * 40}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          <span className="text-2xl opacity-30 animate-spin-slow inline-block" style={{ color: 'hsl(142 50% 45%)' }}>
            🍃
          </span>
        </div>
      ))}
      
      {/* Fireflies */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute animate-firefly"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-60 shadow-[0_0_8px_rgba(253,224,71,0.6)]" />
        </div>
      ))}
      
      {/* Light Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute animate-particle-drift"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${10 + Math.random() * 8}s`,
          }}
        >
          <div className="w-1 h-1 rounded-full bg-white opacity-20" />
        </div>
      ))}
    </>
  );
}

function SkyElements() {
  return (
    <>
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <span className="text-lg opacity-50" style={{ color: 'hsl(210 70% 70%)' }}>✨</span>
        </div>
      ))}
      
      {/* Clouds */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute animate-cloud-drift"
          style={{
            left: `${-20 + Math.random() * 120}%`,
            top: `${Math.random() * 80}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${30 + Math.random() * 20}s`,
          }}
        >
          <span className="text-4xl opacity-20" style={{ color: 'hsl(210 70% 70%)' }}>☁️</span>
        </div>
      ))}
      
      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-sparkle-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-purple-300 opacity-40 shadow-[0_0_6px_rgba(216,180,254,0.5)]" />
        </div>
      ))}
    </>
  );
}

function OceanElements() {
  return (
    <>
      {/* Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute animate-bubble-rise"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${-20 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
          }}
        >
          <div 
            className="rounded-full bg-cyan-200 opacity-30"
            style={{ 
              width: `${6 + Math.random() * 12}px`,
              height: `${6 + Math.random() * 12}px`,
              boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.5)'
            }}
          />
        </div>
      ))}
      
      {/* Fish silhouettes */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`fish-${i}`}
          className="absolute animate-fish-swim"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${12 + Math.random() * 8}s`,
          }}
        >
          <span className="text-xl opacity-20" style={{ color: 'hsl(195 70% 60%)' }}>🐠</span>
        </div>
      ))}
      
      {/* Seaweed sway */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`seaweed-${i}`}
          className="absolute bottom-0 animate-seaweed-sway"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          <div 
            className="w-1 bg-gradient-to-t from-teal-600/20 to-transparent opacity-40"
            style={{ height: `${40 + Math.random() * 60}px` }}
          />
        </div>
      ))}
    </>
  );
}

function CozyElements() {
  return (
    <>
      {/* Floating Hearts */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute animate-heart-float"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${-20 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 5}s`,
          }}
        >
          <span className="text-lg opacity-30" style={{ color: 'hsl(25 60% 70%)' }}>💕</span>
        </div>
      ))}
      
      {/* Warm Glows */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`glow-${i}`}
          className="absolute animate-candle-flicker"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          <div 
            className="w-8 h-8 rounded-full opacity-20 blur-xl"
            style={{ 
              background: 'radial-gradient(circle, hsl(35 90% 70%) 0%, transparent 70%)',
            }}
          />
        </div>
      ))}
      
      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-gentle-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300 opacity-40" />
        </div>
      ))}
    </>
  );
}

function ClassicElements() {
  return (
    <>
      {/* Pastel Circles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`circle-${i}`}
          className="absolute animate-parallax-drift"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${20 + Math.random() * 15}s`,
          }}
        >
          <div 
            className="rounded-full opacity-10 blur-2xl"
            style={{ 
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              background: `hsl(${248 + Math.random() * 30} 60% ${75 + Math.random() * 15}%)`,
            }}
          />
        </div>
      ))}
      
      {/* Brushstroke Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`brush-${i}`}
          className="absolute animate-brush-drift"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          <div 
            className="w-16 h-2 rounded-full opacity-10"
            style={{ 
              background: `linear-gradient(90deg, transparent, hsl(248 63% 86%), transparent)`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </>
  );
}
