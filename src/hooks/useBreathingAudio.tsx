import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioConfig {
  theme: string;
  enabled: boolean;
  volume: number;
}

// Ambient sound URLs from Freesound.org (Creative Commons licensed)
const AUDIO_SOURCES: Record<string, string> = {
  // Star Breathing - Transformed wind chimes (52 min)
  chimes: 'https://cdn.freesound.org/previews/773/773620_1531809-lq.mp3',
  
  // Ocean/Waves - Gentle beach waves (2 min)
  ocean: 'https://cdn.freesound.org/previews/711/711024_15416949-lq.mp3',
  waves: 'https://cdn.freesound.org/previews/711/711024_15416949-lq.mp3',
  
  // Cloud Breathing - Soft wind breeze (9 sec seamless loop)
  wind: 'https://cdn.freesound.org/previews/734/734663_13973196-lq.mp3',
  
  // Garden/Forest/Nature - Forest birds ambient (27 sec seamless loop)
  forest: 'https://cdn.freesound.org/previews/723/723913_2008500-lq.mp3',
  birds: 'https://cdn.freesound.org/previews/723/723913_2008500-lq.mp3',
  nature: 'https://cdn.freesound.org/previews/723/723913_2008500-lq.mp3',
  
  // Rain - Forest ambient loop (1.5 min)
  rain: 'https://cdn.freesound.org/previews/427/427400_5228642-lq.mp3',
  
  // Rainbow/Meditation - Calming meditation music (5.6 min)
  music: 'https://cdn.freesound.org/previews/712/712223_15232790-lq.mp3',
  
  // Deep Sea/Whale - Underwater ambience (3.2 min)
  night: 'https://cdn.freesound.org/previews/817/817111_462105-lq.mp3',
  
  // Animal Breathing themes
  lion: 'https://cdn.freesound.org/previews/718/718412_6315426-lq.mp3', // African savanna wildlife (1.9 min)
  bunny: 'https://cdn.freesound.org/previews/723/723913_2008500-lq.mp3', // Forest birds (woodland)
  whale: 'https://cdn.freesound.org/previews/817/817111_462105-lq.mp3', // Deep sea ambience
};

export function useBreathingAudio({ theme, enabled, volume }: AudioConfig) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audioUrl = AUDIO_SOURCES[theme] || AUDIO_SOURCES.ocean;
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', () => {
      setIsLoading(false);
      setError(null);
    });

    audio.addEventListener('error', () => {
      setError('Unable to load audio');
      setIsLoading(false);
    });

    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = '';
    };
  }, [theme]);

  // Handle play/pause with fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled && !isLoading) {
      // Fade in
      audio.play().catch(() => setError('Playback failed'));
      fadeVolume(audio, volume / 100, true);
    } else {
      // Fade out
      fadeVolume(audio, 0, false);
    }
  }, [enabled, isLoading, volume]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabled) return;
    audio.volume = volume / 100;
  }, [volume, enabled]);

  const fadeVolume = useCallback((audio: HTMLAudioElement, targetVolume: number, fadeIn: boolean) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const step = 0.05;
    const interval = 50;

    fadeIntervalRef.current = setInterval(() => {
      if (fadeIn) {
        if (audio.volume < targetVolume) {
          audio.volume = Math.min(audio.volume + step, targetVolume);
        } else {
          clearInterval(fadeIntervalRef.current!);
        }
      } else {
        if (audio.volume > targetVolume) {
          audio.volume = Math.max(audio.volume - step, targetVolume);
        } else {
          audio.pause();
          clearInterval(fadeIntervalRef.current!);
        }
      }
    }, interval);
  }, []);

  return { isLoading, error };
}
