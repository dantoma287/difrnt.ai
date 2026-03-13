'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useSpring, MotionValue, useMotionValue } from 'framer-motion';

// Define snap points for each phase perfectly aligned to element rendering
const PHASE_STOPS = [0.0, 0.26, 0.34, 0.42, 0.50, 0.58, 0.72, 1.0];

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
  const smoothZProgress = useSpring(zProgress, { damping: 25, stiffness: 60 });
  
  const rawScroll = useRef(0);
  const targetZ = useRef(0);
  const lastTouchY = useRef(0);

  // Each discrete "scroll" delta adds roughly 1 unit of effort.
  // Let's define the total virtual scroll space as 0 to 1000
  const MAX_RAW_SCROLL = 1000;

  useEffect(() => {
    let animationFrameId: number;

    const findClosestPhase = (value: number) => {
      let closest = PHASE_STOPS[0];
      let minDiff = Math.abs(value - closest);
      
      for (let i = 1; i < PHASE_STOPS.length; i++) {
        const diff = Math.abs(value - PHASE_STOPS[i]);
        if (diff < minDiff) {
          closest = PHASE_STOPS[i];
          minDiff = diff;
        }
      }
      return closest;
    };

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Update raw abstract scroll position (-y maps to going down)
      rawScroll.current = clamp(rawScroll.current + e.deltaY * 0.5, 0, MAX_RAW_SCROLL);
      
      // Convert abstract 0-1000 scroll space to Z progress space (0-1)
      const mappedProgress = rawScroll.current / MAX_RAW_SCROLL;
      
      // If the user stops scrolling (macOS inertia ends), snap to the closest defined UI stop
      clearTimeout((window as any).snapTimeout);
      (window as any).snapTimeout = setTimeout(() => {
        const snapped = findClosestPhase(mappedProgress);
        // Correct raw scroll so our anchor sits nicely at the snapped phase
        rawScroll.current = snapped * MAX_RAW_SCROLL; 
        zProgress.set(snapped);
      }, 150);

      zProgress.set(findClosestPhase(mappedProgress));
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;

      rawScroll.current = clamp(rawScroll.current + deltaY * 1.5, 0, MAX_RAW_SCROLL);
      const mappedProgress = rawScroll.current / MAX_RAW_SCROLL;
      
      clearTimeout((window as any).snapTimeout);
      (window as any).snapTimeout = setTimeout(() => {
        const snapped = findClosestPhase(mappedProgress);
        rawScroll.current = snapped * MAX_RAW_SCROLL; 
        zProgress.set(snapped);
      }, 150);

      zProgress.set(findClosestPhase(mappedProgress));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentPageIndex = PHASE_STOPS.indexOf(findClosestPhase(rawScroll.current / MAX_RAW_SCROLL));
      
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const nextIdx = Math.min(PHASE_STOPS.length - 1, currentPageIndex + 1);
        rawScroll.current = PHASE_STOPS[nextIdx] * MAX_RAW_SCROLL;
        zProgress.set(PHASE_STOPS[nextIdx]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIdx = Math.max(0, currentPageIndex - 1);
        rawScroll.current = PHASE_STOPS[nextIdx] * MAX_RAW_SCROLL;
        zProgress.set(PHASE_STOPS[nextIdx]);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [zProgress]);

  return (
    <ScrollContext.Provider value={{ zProgress, smoothZProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}
