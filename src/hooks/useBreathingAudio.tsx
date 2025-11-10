import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioConfig {
  theme: string;
  enabled: boolean;
  volume: number;
}

// Ambient sound URLs from free sources
const AUDIO_SOURCES: Record<string, string> = {
  ocean: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
  waves: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
  wind: 'https://assets.mixkit.co/active_storage/sfx/33/33-preview.mp3',
  forest: 'https://assets.mixkit.co/active_storage/sfx/1212/1212-preview.mp3',
  birds: 'https://assets.mixkit.co/active_storage/sfx/1212/1212-preview.mp3',
  rain: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
  chimes: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  nature: 'https://assets.mixkit.co/active_storage/sfx/1212/1212-preview.mp3',
  night: 'https://assets.mixkit.co/active_storage/sfx/33/33-preview.mp3',
  music: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
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
