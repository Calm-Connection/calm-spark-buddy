import React from 'react';
import { useTheme } from 'next-themes';

export function BlobBackground() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top right blob */}
      <svg
        className={theme === 'dark' ? "absolute -top-20 -right-20 w-96 h-96 opacity-30 animate-blob-float animate-blob-pulse" : "absolute -top-20 -right-20 w-96 h-96 opacity-60 animate-blob-float animate-blob-pulse"}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M380,200 C380,290 310,360 220,360 C130,360 60,290 60,200 C60,110 130,40 220,40 C310,40 380,110 380,200 Z"
          fill={theme === 'dark' ? "hsl(23, 55%, 78%)" : "hsl(31, 97%, 88%)"}
        />
      </svg>

      {/* Bottom left blob */}
      <svg
        className={theme === 'dark' ? "absolute -bottom-20 -left-20 w-80 h-80 opacity-20 animate-blob-float-delayed animate-blob-pulse" : "absolute -bottom-20 -left-20 w-80 h-80 opacity-50 animate-blob-float-delayed animate-blob-pulse"}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M320,200 C320,270 260,330 190,330 C120,330 60,270 60,200 C60,130 120,70 190,70 C260,70 320,130 320,200 Z"
          fill={theme === 'dark' ? "hsl(45, 50%, 76%)" : "hsl(45, 92%, 90%)"}
        />
      </svg>

      {/* Middle floating blob */}
      <svg
        className={theme === 'dark' ? "absolute top-1/2 left-1/4 w-64 h-64 opacity-15 animate-blob-float-slow animate-blob-pulse" : "absolute top-1/2 left-1/4 w-64 h-64 opacity-40 animate-blob-float-slow animate-blob-pulse"}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M300,200 C300,255 255,300 200,300 C145,300 100,255 100,200 C100,145 145,100 200,100 C255,100 300,145 300,200 Z"
          fill={theme === 'dark' ? "hsl(342, 30%, 75%)" : "hsl(342, 71%, 88%)"}
        />
      </svg>
    </div>
  );
}
