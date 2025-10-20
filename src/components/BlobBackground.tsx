import React from 'react';

export function BlobBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top right blob */}
      <svg
        className="absolute -top-20 -right-20 w-96 h-96 opacity-60"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M380,200 C380,290 310,360 220,360 C130,360 60,290 60,200 C60,110 130,40 220,40 C310,40 380,110 380,200 Z"
          fill="hsl(31, 100%, 88%)"
        />
      </svg>

      {/* Bottom left blob */}
      <svg
        className="absolute -bottom-20 -left-20 w-80 h-80 opacity-50"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M320,200 C320,270 260,330 190,330 C120,330 60,270 60,200 C60,130 120,70 190,70 C260,70 320,130 320,200 Z"
          fill="hsl(45, 100%, 90%)"
        />
      </svg>

      {/* Middle floating blob */}
      <svg
        className="absolute top-1/2 left-1/4 w-64 h-64 opacity-40"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M300,200 C300,255 255,300 200,300 C145,300 100,255 100,200 C100,145 145,100 200,100 C255,100 300,145 300,200 Z"
          fill="hsl(342, 79%, 89%)"
        />
      </svg>
    </div>
  );
}
