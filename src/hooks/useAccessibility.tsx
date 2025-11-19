import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export type TextSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FontFamily = 'default' | 'dyslexia-friendly';

interface AccessibilitySettings {
  textSize: TextSize;
  fontFamily: FontFamily;
  highContrast: boolean;
  calmMode: boolean;
  reduceMotion: boolean;
}

const defaultSettings: AccessibilitySettings = {
  textSize: 'medium',
  fontFamily: 'default',
  highContrast: false,
  calmMode: false,
  reduceMotion: false,
};

const textSizeMap: Record<TextSize, string> = {
  'small': '14px',
  'medium': '16px',
  'large': '19px',
  'extra-large': '22px',
};

export function useAccessibility() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply text size
    root.style.setProperty('--base-font-size', textSizeMap[settings.textSize]);
    
    // Apply font family
    if (settings.fontFamily === 'dyslexia-friendly') {
      root.style.setProperty('--font-family', 'OpenDyslexic, "Comic Sans MS", sans-serif');
    } else {
      root.style.removeProperty('--font-family');
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      if (theme === 'dark') {
        root.classList.remove('high-contrast');
        root.classList.add('high-contrast-dark');
      } else {
        root.classList.remove('high-contrast-dark');
        root.classList.add('high-contrast');
      }
    } else {
      root.classList.remove('high-contrast');
      root.classList.remove('high-contrast-dark');
    }
    
    // Apply calm mode (reduces animations)
    if (settings.calmMode) {
      root.classList.add('calm-mode');
    } else {
      root.classList.remove('calm-mode');
    }
    
    // Apply reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings, theme]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
  };
}
