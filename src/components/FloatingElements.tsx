import { useEffect, useState, useMemo } from 'react';
import { type ThemeName } from '@/hooks/useTheme';

interface FloatingElementsProps {
  theme: ThemeName;
}

// Generate stable random values for positioning
const generateStablePositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    left: `${(i * 11 + 13) % 90 + 5}%`,
    top: `${(i * 17 + 7) % 80 + 10}%`,
    delay: `${(i * 1.3) % 8}s`,
    duration: `${15 + (i * 3) % 20}s`,
  }));
};

export function FloatingElements({ theme }: FloatingElementsProps) {
  const [mounted, setMounted] = useState(false);
  const [calmMode, setCalmMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkCalmMode = () => {
      setCalmMode(document.documentElement.classList.contains('calm-mode'));
    };
    checkCalmMode();
    
    const observer = new MutationObserver(checkCalmMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  if (!mounted || calmMode) return null;

  return (
    <div className="floating-container">
      {theme === 'forest' && <ForestElements />}
      {theme === 'sky' && <SkyElements />}
      {theme === 'ocean' && <OceanElements />}
      {theme === 'cozy' && <CozyElements />}
      {theme === 'classic' && <ClassicElements />}
    </div>
  );
}

// Forest theme with leaves and fireflies
function ForestElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const leafCount = isMobile ? 6 : 8;
  const fireflyCount = isMobile ? 4 : 6;
  
  const leafPositions = useMemo(() => generateStablePositions(leafCount), [leafCount]);
  const fireflyPositions = useMemo(() => generateStablePositions(fireflyCount), [fireflyCount]);

  return (
    <>
      {/* Floating leaves */}
      {leafPositions.map((pos, i) => (
        <span
          key={`leaf-${i}`}
          className="absolute text-2xl animate-leaf-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.duration,
            willChange: 'transform, opacity',
          }}
        >
          🍃
        </span>
      ))}
      
      {/* Fireflies */}
      {fireflyPositions.map((pos, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute w-2 h-2 bg-yellow-300/60 rounded-full animate-firefly shadow-[0_0_8px_rgba(253,224,71,0.6)]"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}

// Sky theme with stars and clouds
function SkyElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const starCount = isMobile ? 8 : 12;
  const cloudCount = isMobile ? 4 : 6;
  
  const starPositions = useMemo(() => generateStablePositions(starCount), [starCount]);
  const cloudPositions = useMemo(() => generateStablePositions(cloudCount), [cloudCount]);

  return (
    <>
      {/* Stars */}
      {starPositions.map((pos, i) => (
        <div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${3 + (i % 3)}s`,
            willChange: 'opacity',
          }}
        />
      ))}
      
      {/* Clouds */}
      {cloudPositions.map((pos, i) => (
        <span
          key={`cloud-${i}`}
          className="absolute opacity-30 animate-cloud-drift"
          style={{
            left: pos.left,
            top: pos.top,
            fontSize: `${32 + (i % 3) * 8}px`,
            animationDelay: pos.delay,
            animationDuration: `${25 + (i % 3) * 5}s`,
            willChange: 'transform',
          }}
        >
          ☁️
        </span>
      ))}
    </>
  );
}

// Ocean theme with bubbles and fish
function OceanElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const bubbleCount = isMobile ? 8 : 12;
  const fishCount = isMobile ? 3 : 5;
  
  const bubblePositions = useMemo(() => generateStablePositions(bubbleCount), [bubbleCount]);
  const fishPositions = useMemo(() => generateStablePositions(fishCount), [fishCount]);

  return (
    <>
      {/* Bubbles */}
      {bubblePositions.map((pos, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-blue-200/30 animate-bubble-rise"
          style={{
            left: pos.left,
            bottom: '-20px',
            width: `${4 + (i % 4) * 4}px`,
            height: `${4 + (i % 4) * 4}px`,
            animationDelay: pos.delay,
            animationDuration: `${10 + (i % 3) * 3}s`,
            willChange: 'transform, opacity',
            boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.5)'
          }}
        />
      ))}
      
      {/* Fish silhouettes */}
      {fishPositions.map((pos, i) => (
        <span
          key={`fish-${i}`}
          className="absolute text-3xl opacity-20 animate-fish-swim"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${12 + (i % 3) * 4}s`,
            willChange: 'transform',
          }}
        >
          🐠
        </span>
      ))}
    </>
  );
}

// Cozy theme with hearts and warm glows
function CozyElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const heartCount = isMobile ? 5 : 7;
  const glowCount = isMobile ? 4 : 6;
  
  const heartPositions = useMemo(() => generateStablePositions(heartCount), [heartCount]);
  const glowPositions = useMemo(() => generateStablePositions(glowCount), [glowCount]);

  return (
    <>
      {/* Floating hearts */}
      {heartPositions.map((pos, i) => (
        <span
          key={`heart-${i}`}
          className="absolute text-2xl opacity-40 animate-heart-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.duration,
            willChange: 'transform, opacity',
          }}
        >
          💕
        </span>
      ))}
      
      {/* Warm glows */}
      {glowPositions.map((pos, i) => (
        <div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-full bg-orange-200/20 blur-xl animate-candle-flicker"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${6 + (i % 3) * 2}s`,
            willChange: 'opacity',
          }}
        />
      ))}
    </>
  );
}

// Classic theme with subtle particles
function ClassicElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const circleCount = isMobile ? 6 : 8;
  const brushCount = isMobile ? 4 : 6;
  
  const circlePositions = useMemo(() => generateStablePositions(circleCount), [circleCount]);
  const brushPositions = useMemo(() => generateStablePositions(brushCount), [brushCount]);

  return (
    <>
      {/* Pastel circles */}
      {circlePositions.map((pos, i) => (
        <div
          key={`circle-${i}`}
          className="absolute rounded-full animate-parallax-drift blur-2xl"
          style={{
            left: pos.left,
            top: pos.top,
            width: `${24 + (i % 3) * 12}px`,
            height: `${24 + (i % 3) * 12}px`,
            background: `hsl(${248 + (i * 15) % 60}, 70%, 85%)`,
            opacity: 0.25,
            animationDelay: pos.delay,
            animationDuration: pos.duration,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      
      {/* Brushstroke particles */}
      {brushPositions.map((pos, i) => (
        <div
          key={`brush-${i}`}
          className="absolute w-16 h-2 rounded-full blur-sm animate-brush-drift"
          style={{
            left: pos.left,
            top: pos.top,
            background: `hsl(${163 + (i * 10) % 40}, 60%, 75%)`,
            opacity: 0.15,
            animationDelay: pos.delay,
            animationDuration: `${20 + (i % 3) * 8}s`,
            transform: `rotate(${(i * 45) % 360}deg)`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}
