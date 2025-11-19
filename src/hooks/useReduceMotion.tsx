import { useState, useEffect } from 'react';

export function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const check = () => {
      setReduceMotion(
        document.documentElement.classList.contains('reduce-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class']
    });
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', check);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', check);
    };
  }, []);

  return reduceMotion;
}
