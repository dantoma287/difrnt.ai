'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSpring, MotionValue, useMotionValue } from 'framer-motion';

interface ScrollContextType {
  zProgress: MotionValue<number>;
  smoothZProgress: MotionValue<number>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const useZScroll = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useZScroll must be used within ScrollOrchestratorProvider');
  return ctx;
};

export function ScrollOrchestratorProvider({ children }: { children: React.ReactNode }) {
  const zProgress = useMotionValue(0);
  const smoothZProgress = useSpring(zProgress, { damping: 30, stiffness: 120 });
  const progressRef = useRef(0);
  const lastTouchY = useRef(0);

  useEffect(() => {
    const updateProgress = (delta: number) => {
      progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta));
      zProgress.set(progressRef.current);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      updateProgress(e.deltaY * 0.0015);
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;
      
      updateProgress(deltaY * 0.004);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [zProgress]);

  return (
    <ScrollContext.Provider value={{ zProgress, smoothZProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}
