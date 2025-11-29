import React from 'react';
import { useTheme } from 'next-themes';

export function BlobBackground() {
  const { theme } = useTheme();
  
  // Theme-aware blob colors with better dark mode contrast
  const blobColors = {
    light: {
      peachy: "hsl(31, 97%, 88%)",
      cream: "hsl(45, 92%, 90%)",
      rose: "hsl(342, 71%, 88%)"
    },
    dark: {
      peachy: "hsl(23, 45%, 45%)",
      cream: "hsl(45, 40%, 40%)",
      rose: "hsl(342, 35%, 40%)"
    }
  };
  
  const colors = theme === 'dark' ? blobColors.dark : blobColors.light;
  const opacity = theme === 'dark' ? { top: 0.4, bottom: 0.3, middle: 0.25 } : { top: 0.6, bottom: 0.5, middle: 0.4 };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top right blob */}
      <svg
        className="absolute -top-20 -right-20 w-96 h-96 animate-blob-float animate-blob-pulse"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: opacity.top }}
      >
        <path
          d="M380,200 C380,290 310,360 220,360 C130,360 60,290 60,200 C60,110 130,40 220,40 C310,40 380,110 380,200 Z"
          fill={colors.peachy}
        />
      </svg>

      {/* Bottom left blob */}
      <svg
        className="absolute -bottom-20 -left-20 w-80 h-80 animate-blob-float-delayed animate-blob-pulse"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: opacity.bottom }}
      >
        <path
          d="M320,200 C320,270 260,330 190,330 C120,330 60,270 60,200 C60,130 120,70 190,70 C260,70 320,130 320,200 Z"
          fill={colors.cream}
        />
      </svg>

      {/* Middle floating blob */}
      <svg
        className="absolute top-1/2 left-1/4 w-64 h-64 animate-blob-float-slow animate-blob-pulse"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: opacity.middle }}
      >
        <path
          d="M300,200 C300,255 255,300 200,300 C145,300 100,255 100,200 C100,145 145,100 200,100 C255,100 300,145 300,200 Z"
          fill={colors.rose}
        />
      </svg>
    </div>
  );
}
