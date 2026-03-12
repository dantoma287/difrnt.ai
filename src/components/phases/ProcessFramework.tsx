'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

const phases = [
  { title: "Analysis", desc: "Dive deep into business challenges." },
  { title: "Strategy", desc: "Develop a comprehensive AI roadmap." },
  { title: "Build", desc: "Implement custom solutions." }
];

export default function ProcessFramework({ zProgress }: { zProgress: MotionValue<number> }) {
  // Phase active from ~0.6 to 0.8
  
  const opacity = useTransform(zProgress, [0.55, 0.65, 0.8, 0.85], [0, 1, 1, 0]);
  const scale = useTransform(zProgress, [0.55, 0.65, 0.8, 0.85], [0.8, 1, 1, 1.2]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none flex items-center justify-center p-24"
      style={{ opacity, scale }}
    >
      <div className="w-full max-w-5xl flex justify-between gap-8 mt-40">
        {phases.map((phase, i) => {
          return (
            <motion.div
              key={i}
              className="glass p-8 rounded-3xl flex-1 text-center"
            >
              <h3 className="text-2xl font-medium tracking-tight mb-4">{phase.title}</h3>
              <p className="text-[var(--color-secondary)] font-light text-sm">{phase.desc}</p>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="absolute bottom-12 text-center w-full"
        style={{ opacity: useTransform(zProgress, [0.65, 0.7, 0.8, 0.85], [0, 1, 1, 0]) }}
      >
        <p className="text-xs text-[var(--color-secondary)] tracking-widest uppercase mb-2">
          Founded in 2018.
        </p>
        <p className="text-sm font-light text-[var(--color-secondary)] max-w-md mx-auto">
          Combining deep digital marketing excellence with ethical AI innovation.
        </p>
      </motion.div>
    </motion.div>
  );
}
