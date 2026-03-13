'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

const phases = [
  {
    step: "01",
    title: "Analysis",
    desc: "We start by deeply understanding your business, data landscape, and operational bottlenecks. No templates — every engagement begins with first-principles thinking."
  },
  {
    step: "02",
    title: "Strategy",
    desc: "We design a comprehensive AI roadmap with clear milestones, technology choices, and risk assessments. You'll know exactly what we're building and why before a single line of code is written."
  },
  {
    step: "03",
    title: "Build & Deploy",
    desc: "Rapid, iterative development with continuous feedback loops. We ship production-ready systems — not prototypes — with monitoring, testing, and documentation from the start."
  }
];

export default function ProcessFramework({ zProgress }: { zProgress: MotionValue<number> }) {
  // Active at stop 6 (0.72), between services end (0.58) and contact (1.0)
  const opacity = useTransform(zProgress, [0.63, 0.72, 0.85, 0.92], [0, 1, 1, 0]);
  const scale = useTransform(zProgress, [0.63, 0.72, 0.85, 0.92], [0.8, 1, 1, 1.2]);
  const visibility = useTransform(zProgress, (v) =>
    v < 0.6 || v > 0.95 ? 'hidden' as const : 'visible' as const
  );

  const footerOpacity = useTransform(zProgress, [0.72, 0.76, 0.85, 0.92], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center px-12 md:px-24"
      style={{ opacity, scale, visibility }}
    >
      <p className="text-sm tracking-[0.3em] uppercase text-[var(--color-secondary)] mb-6 font-light">
        How We Work
      </p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-foreground)] mb-12 text-center">
        From insight to production.
      </h2>

      <div className="w-full max-w-5xl flex justify-between gap-8">
        {phases.map((phase, i) => {
          return (
            <motion.div
              key={i}
              className="glass p-8 rounded-3xl flex-1 text-center"
            >
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-secondary)] font-medium">{phase.step}</span>
              <h3 className="text-2xl font-medium tracking-tight mb-4 mt-2">{phase.title}</h3>
              <p className="text-[var(--color-secondary)] font-light text-sm leading-relaxed">{phase.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute bottom-12 text-center w-full"
        style={{ opacity: footerOpacity }}
      >
        <p className="text-xs text-[var(--color-secondary)] tracking-widest uppercase mb-2">
          Founded in 2018 in Bucharest
        </p>
        <p className="text-sm font-light text-[var(--color-secondary)] max-w-lg mx-auto leading-relaxed">
          Seven years of combining deep digital marketing expertise with ethical AI innovation. We've helped startups and enterprises across Europe ship intelligent systems that actually work.
        </p>
      </motion.div>
    </motion.div>
  );
}
