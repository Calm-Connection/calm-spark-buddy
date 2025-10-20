import React from 'react';
import { Logo } from './Logo';
import { BlobBackground } from './BlobBackground';

interface PageLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

export function PageLayout({ children, showLogo = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      
      {showLogo && (
        <div className="absolute top-6 left-6 z-10">
          <Logo size="sm" />
        </div>
      )}
      
      <div className="relative z-0 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
