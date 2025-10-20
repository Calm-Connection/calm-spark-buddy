import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  return (
    <svg
      className={`${sizes[size]} ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gold circle with stars */}
      <circle cx="100" cy="100" r="95" fill="#FFD700" stroke="#FFB900" strokeWidth="3" />
      <circle cx="100" cy="100" r="85" fill="white" />
      
      {/* Stars */}
      <path d="M100 20 L102 28 L110 28 L104 33 L106 41 L100 36 L94 41 L96 33 L90 28 L98 28 Z" fill="#FFD700" />
      <path d="M160 60 L162 65 L167 65 L163 68 L165 73 L160 70 L155 73 L157 68 L153 65 L158 65 Z" fill="#FFD700" />
      <path d="M40 60 L42 65 L47 65 L43 68 L45 73 L40 70 L35 73 L37 68 L33 65 L38 65 Z" fill="#FFD700" />
      <path d="M30 130 L32 135 L37 135 L33 138 L35 143 L30 140 L25 143 L27 138 L23 135 L28 135 Z" fill="#FFD700" />
      <path d="M170 130 L172 135 L177 135 L173 138 L175 143 L170 140 L165 143 L167 138 L163 135 L168 135 Z" fill="#FFD700" />
      
      {/* Adult figure (mint green) - left side */}
      <ellipse cx="85" cy="90" rx="18" ry="22" fill="hsl(163, 40%, 70%)" />
      <circle cx="85" cy="75" r="12" fill="hsl(163, 40%, 70%)" />
      
      {/* Child figure (peachy) - right side, smaller */}
      <ellipse cx="110" cy="95" rx="14" ry="18" fill="hsl(31, 100%, 78%)" />
      <circle cx="110" cy="82" r="10" fill="hsl(31, 100%, 78%)" />
      
      {/* Heart in center */}
      <path
        d="M100 105 C95 100, 88 100, 88 107 C88 112, 95 118, 100 122 C105 118, 112 112, 112 107 C112 100, 105 100, 100 105 Z"
        fill="hsl(342, 79%, 89%)"
      />
      
      {/* Curved text - CALM CONNECTION */}
      <path
        id="circlePath"
        d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
        fill="none"
      />
      <text fontSize="18" fontWeight="bold" fill="#4A4A4A" fontFamily="Balsamiq Sans, sans-serif">
        <textPath href="#circlePath" startOffset="25%">
          CALM CONNECTION
        </textPath>
      </text>
    </svg>
  );
}
