'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

const services = [
  { title: "Autonomous AI Agent", desc: "Self-operating systems handling complex tasks independently." },
  { title: "Complex Data Analysis", desc: "Advanced analytics extracting actionable insights." },
  { title: "Self-Adapting Decision Making", desc: "Intelligent systems that learn from outcomes." },
  { title: "Chatbot Development", desc: "Conversational AI powered by top-tier LLMs." },
  { title: "Knowledge Response & Custom AI", desc: "Bespoke solutions for unique challenges." }
];

export default function ServicesJourney({ zProgress }: { zProgress: MotionValue<number> }) {
  // Phase active from ~0.2 to 0.6
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
      <div className="absolute right-[10%] top-0 bottom-0 w-[400px] flex flex-col justify-center gap-6">
        {services.map((service, i) => {
          const start = 0.2 + (i * 0.08); // Spread out timing
          const active = start + 0.06;
          const end = active + 0.06;
          const fadeOutEnd = end + 0.06;

          const z = useTransform(zProgress, [start - 0.1, active, end, fadeOutEnd], [-1000, 0, 0, 500]);
          const opacity = useTransform(zProgress, [start - 0.1, active, end, fadeOutEnd], [0, 1, 1, 0]);
          const filter = useTransform(zProgress, 
            [start - 0.1, active, end, fadeOutEnd], 
            ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]
          );

          return (
            <motion.div
              key={i}
              className="glass p-8 rounded-3xl flex flex-col gap-3 text-left absolute w-full top-1/2 -mt-24"
              style={{ z, opacity, filter }}
            >
              <h3 className="text-xl font-medium tracking-tight">{service.title}</h3>
              <p className="text-[var(--color-secondary)] text-sm leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
