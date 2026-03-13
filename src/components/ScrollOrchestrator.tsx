'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSpring, MotionValue, useMotionValue } from 'framer-motion';

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
  const smoothZProgress = useSpring(zProgress, { damping: 26, stiffness: 170, mass: 0.4 });

  const phaseIndex = useRef(0);
  const lastTouchY = useRef(0);
  const touchMoved = useRef(false);

  // Wheel gesture detection
  const lastWheelTime = useRef(0);
  const lastAbsDelta = useRef(0);
  const cooldownUntil = useRef(0);

  useEffect(() => {
    const go = (dir: 1 | -1) => {
      const next = phaseIndex.current + dir;
      if (next < 0 || next >= PHASE_STOPS.length) return;
      phaseIndex.current = next;
      zProgress.set(PHASE_STOPS[next]);
    };

    // --- Wheel ---
    // Strategy: detect NEW scroll gestures by looking for:
    //   1. A time gap (>150ms since last wheel event = new gesture)
    //   2. Or a sudden increase in |deltaY| (new flick after decaying inertia)
    // After triggering, enforce a fixed cooldown so inertia can't re-trigger.
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      const absDelta = Math.abs(e.deltaY);
      const timeSinceLast = now - lastWheelTime.current;

      // Still in cooldown — ignore everything
      if (now < cooldownUntil.current) {
        lastWheelTime.current = now;
        lastAbsDelta.current = absDelta;
        return;
      }

      const isNewGesture =
        timeSinceLast > 150 ||                       // gap in events = new scroll
        (absDelta > lastAbsDelta.current * 1.5 && absDelta > 5); // sudden spike = new flick

      lastWheelTime.current = now;
      lastAbsDelta.current = absDelta;

      if (!isNewGesture) return;

      // Trigger phase change and enforce cooldown
      const dir = e.deltaY > 0 ? 1 : -1;
      go(dir as 1 | -1);
      cooldownUntil.current = now + 600;
    };

    // --- Touch ---
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
      touchMoved.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchMoved.current) return;

      const currentY = e.touches[0].clientY;
      const delta = lastTouchY.current - currentY;

      if (Math.abs(delta) > 25) {
        touchMoved.current = true;
        go(delta > 0 ? 1 : -1);
      }
    };

    // --- Keyboard ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now < cooldownUntil.current) return;

      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        go(1);
        cooldownUntil.current = now + 400;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        go(-1);
        cooldownUntil.current = now + 400;
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
