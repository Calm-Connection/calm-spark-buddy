import React from 'react';
import logoImage from '@/assets/calm-connection-logo.png';

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
    <img
      src={logoImage}
      alt="Calm Connection Logo"
      className={`${sizes[size]} ${className} object-contain`}
    />
  );
}
