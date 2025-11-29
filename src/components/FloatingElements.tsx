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
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 375;
  const leafCount = isSmallMobile ? 4 : isMobile ? 6 : 8;
  const fireflyCount = isSmallMobile ? 3 : isMobile ? 4 : 6;
  
  const leafPositions = useMemo(() => generateStablePositions(leafCount), [leafCount]);
  const fireflyPositions = useMemo(() => generateStablePositions(fireflyCount), [fireflyCount]);

  return (
    <>
      {/* Floating leaves - Enhanced visibility */}
      {leafPositions.map((pos, i) => (
        <span
          key={`leaf-${i}`}
          className="absolute text-3xl sm:text-4xl animate-leaf-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.duration,
            willChange: 'transform, opacity',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}
        >
          🍃
        </span>
      ))}
      
      {/* Fireflies - Enhanced size and glow */}
      {fireflyPositions.map((pos, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300/70 rounded-full animate-firefly shadow-[0_0_12px_4px_rgba(253,224,71,0.7)]"
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
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 375;
  const starCount = isSmallMobile ? 6 : isMobile ? 8 : 12;
  const cloudCount = isSmallMobile ? 3 : isMobile ? 4 : 6;
  
  const starPositions = useMemo(() => generateStablePositions(starCount), [starCount]);
  const cloudPositions = useMemo(() => generateStablePositions(cloudCount), [cloudCount]);

  return (
    <>
      {/* Stars - Enhanced size and glow */}
      {starPositions.map((pos, i) => (
        <div
          key={`star-${i}`}
          className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${3 + (i % 3)}s`,
            willChange: 'opacity, transform',
          }}
        />
      ))}
      
      {/* Clouds - Enhanced visibility */}
      {cloudPositions.map((pos, i) => (
        <span
          key={`cloud-${i}`}
          className="absolute opacity-40 animate-cloud-drift"
          style={{
            left: pos.left,
            top: pos.top,
            fontSize: `${40 + (i % 3) * 10}px`,
            animationDelay: pos.delay,
            animationDuration: `${isMobile ? 35 : 25 + (i % 3) * 5}s`,
            willChange: 'transform',
            filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.3))',
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
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 375;
  const bubbleCount = isSmallMobile ? 6 : isMobile ? 8 : 12;
  const fishCount = isSmallMobile ? 2 : isMobile ? 3 : 5;
  
  const bubblePositions = useMemo(() => generateStablePositions(bubbleCount), [bubbleCount]);
  const fishPositions = useMemo(() => generateStablePositions(fishCount), [fishCount]);

  return (
    <>
      {/* Bubbles - Enhanced size and shine */}
      {bubblePositions.map((pos, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-blue-200/40 animate-bubble-rise"
          style={{
            left: pos.left,
            bottom: '-20px',
            width: `${6 + (i % 4) * 6}px`,
            height: `${6 + (i % 4) * 6}px`,
            animationDelay: pos.delay,
            animationDuration: `${10 + (i % 3) * 3}s`,
            willChange: 'transform, opacity',
            boxShadow: 'inset -2px -2px 6px rgba(255,255,255,0.6), 0 0 8px rgba(173,216,230,0.3)'
          }}
        />
      ))}
      
      {/* Fish silhouettes - Enhanced visibility */}
      {fishPositions.map((pos, i) => (
        <span
          key={`fish-${i}`}
          className="absolute text-4xl sm:text-5xl opacity-25 animate-fish-swim"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${12 + (i % 3) * 4}s`,
            willChange: 'transform',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
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
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 375;
  const heartCount = isSmallMobile ? 4 : isMobile ? 5 : 7;
  const glowCount = isSmallMobile ? 3 : isMobile ? 4 : 6;
  
  const heartPositions = useMemo(() => generateStablePositions(heartCount), [heartCount]);
  const glowPositions = useMemo(() => generateStablePositions(glowCount), [glowCount]);

  return (
    <>
      {/* Floating hearts - Enhanced visibility */}
      {heartPositions.map((pos, i) => (
        <span
          key={`heart-${i}`}
          className="absolute text-3xl sm:text-4xl opacity-50 animate-heart-float"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: pos.duration,
            willChange: 'transform, opacity',
            filter: 'drop-shadow(0 2px 6px rgba(255,182,193,0.4))',
          }}
        >
          💕
        </span>
      ))}
      
      {/* Warm glows - Enhanced visibility */}
      {glowPositions.map((pos, i) => (
        <div
          key={`glow-${i}`}
          className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-orange-200/30 blur-2xl animate-candle-flicker"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${6 + (i % 3) * 2}s`,
            willChange: 'opacity, transform',
          }}
        />
      ))}
    </>
  );
}

// Classic theme with enhanced soft animations
function ClassicElements() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 375;
  const circleCount = isSmallMobile ? 6 : isMobile ? 8 : 12;
  const sparkleCount = isSmallMobile ? 5 : isMobile ? 6 : 10;
  const dotCount = isSmallMobile ? 8 : isMobile ? 10 : 15;
  
  const circlePositions = useMemo(() => generateStablePositions(circleCount), [circleCount]);
  const sparklePositions = useMemo(() => generateStablePositions(sparkleCount), [sparkleCount]);
  const dotPositions = useMemo(() => generateStablePositions(dotCount), [dotCount]);

  return (
    <>
      {/* Soft floating circles - Enhanced visibility */}
      {circlePositions.map((pos, i) => (
        <div
          key={`circle-${i}`}
          className="absolute rounded-full animate-gentle-float blur-2xl"
          style={{
            left: pos.left,
            top: pos.top,
            width: `${40 + (i % 4) * 20}px`,
            height: `${40 + (i % 4) * 20}px`,
            background: `hsl(${248 + (i * 15) % 60}, 70%, 85%)`,
            opacity: 0.45,
            animationDelay: pos.delay,
            animationDuration: `${18 + (i % 3) * 8}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      
      {/* Sparkle particles - Enhanced size and glow */}
      {sparklePositions.map((pos, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-accent/70 rounded-full animate-soft-pulse shadow-[0_0_12px_4px_hsl(31,97%,88%)]"
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: pos.delay,
            animationDuration: `${3 + (i % 3) * 1.5}s`,
            willChange: 'opacity, transform',
          }}
        />
      ))}
      
      {/* Floating gentle dots - Enhanced visibility */}
      {dotPositions.map((pos, i) => (
        <div
          key={`dot-${i}`}
          className="absolute rounded-full animate-gentle-float"
          style={{
            left: pos.left,
            top: pos.top,
            width: `${8 + (i % 3) * 6}px`,
            height: `${8 + (i % 3) * 6}px`,
            background: `hsl(${163 + (i * 12) % 40}, 60%, 75%)`,
            opacity: 0.4,
            animationDelay: pos.delay,
            animationDuration: `${20 + (i % 4) * 6}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}
