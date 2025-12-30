import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useReduceMotion } from '@/hooks/useReduceMotion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const reduceMotion = useReduceMotion();

  // Skip animation if reduce motion is enabled
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1], // Gentle ease-out curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
