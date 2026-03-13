'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

export default function HeroPhase({ zProgress }: { zProgress: MotionValue<number> }) {
  // Visible at stop 0 (0.0), exits before stop 1 (0.26)
  const opacity = useTransform(zProgress, [0, 0.1, 0.22], [1, 1, 0]);
  const scale = useTransform(zProgress, [0, 0.26], [1, 1.3]);
  const y = useTransform(zProgress, [0, 0.26], [0, -80]);
  const filter = useTransform(zProgress, [0.1, 0.22], ["blur(0px)", "blur(16px)"]);
  const visibility = useTransform(zProgress, (v) => v > 0.26 ? 'hidden' as const : 'visible' as const);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity, scale, y, filter, visibility }}
    >
      <p className="text-sm tracking-[0.3em] uppercase text-[var(--color-secondary)] mb-4 font-light">
        AI Systems Studio
      </p>
      <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-[var(--color-foreground)]">
        difrnt.ai
      </h1>
      <p className="mt-6 text-2xl tracking-wide text-[var(--color-secondary)] max-w-xl text-center font-light leading-relaxed">
        We design, build, and deploy intelligent systems that transform how businesses operate — from autonomous agents to real-time decision engines.
      </p>
      <div className="mt-10 flex gap-8 text-xs tracking-widest uppercase text-[var(--color-secondary)]">
        <span>Bucharest</span>
        <span>Since 2018</span>
        <span>Enterprise & Startup</span>
      </div>
      <motion.p
        className="absolute bottom-12 text-sm tracking-widest text-[var(--color-secondary)] uppercase"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to explore
      </motion.p>
    </motion.div>
  );
}
