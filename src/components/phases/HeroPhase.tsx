'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

export default function HeroPhase({ zProgress }: { zProgress: MotionValue<number> }) {
  // Depth 0.0 to 0.2
  // Fade out starting at 0.1, fully gone at 0.2
  const opacity = useTransform(zProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const scale = useTransform(zProgress, [0, 0.2], [1, 1.5]);
  const y = useTransform(zProgress, [0, 0.2], [0, -100]);
  const filter = useTransform(zProgress, [0.1, 0.2], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity, scale, y, filter }}
    >
      <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-[var(--color-foreground)]">
        difrnt.ai
      </h1>
      <p className="mt-6 text-2xl tracking-wide text-[var(--color-secondary)] max-w-lg text-center font-light">
        Building the future. One AI system at a time.
      </p>
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
