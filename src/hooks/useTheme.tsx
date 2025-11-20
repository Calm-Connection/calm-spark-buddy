import { useState, useEffect } from 'react';

export type ThemeName = 'forest' | 'sky' | 'ocean' | 'cozy' | 'classic';

interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
}

const themeColors: Record<ThemeName, ThemeColors> = {
  forest: {
    background: '140 40% 92%', // Light sage green
    primary: '142 50% 45%', // Forest green
    secondary: '88 50% 55%', // Fresh green
    accent: '40 60% 60%', // Warm brown
  },
  sky: {
    background: '210 50% 95%', // Light sky blue
    primary: '210 70% 70%', // Sky blue
    secondary: '200 60% 80%', // Soft blue
    accent: '280 50% 75%', // Soft purple
  },
  ocean: {
    background: '195 50% 94%', // Light aqua
    primary: '195 70% 60%', // Ocean blue
    secondary: '180 50% 65%', // Teal
    accent: '200 60% 75%', // Light blue
  },
  cozy: {
    background: '25 50% 92%', // Warm cream
    primary: '25 60% 70%', // Warm peach
    secondary: '35 50% 75%', // Soft yellow
    accent: '15 70% 65%', // Terracotta
  },
  classic: {
    background: '246 70% 85%', // Lilac (#C6C9F2)
    primary: '246 70% 85%', // Lilac (consistent)
    secondary: '163 40% 69%', // Soft Mint (#90D1BC)
    accent: '31 97% 88%', // Peachy Cream (#FEE0C2)
  },
};

export function useTheme(themeName?: ThemeName) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    if (!themeName) return;

    const theme = themeColors[themeName];
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply theme colors
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    
    // Store in localStorage for persistence
    localStorage.setItem('appliedTheme', themeName);
    setCurrentTheme(themeName);
  }, [themeName]);

  return currentTheme;
}

export function loadSavedTheme(): ThemeName | null {
  const saved = localStorage.getItem('appliedTheme') as ThemeName;
  return saved && themeColors[saved] ? saved : null;
}

export function applyTheme(themeName: ThemeName) {
  const theme = themeColors[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  
  localStorage.setItem('appliedTheme', themeName);
}
