'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';

const services = [
  {
    title: "Autonomous AI Agents",
    desc: "Self-operating systems that handle complex, multi-step workflows independently. From data ingestion to decision execution, our agents work around the clock so your team can focus on strategy.",
    tag: "Automation"
  },
  {
    title: "Complex Data Analysis",
    desc: "We build advanced analytics pipelines that transform raw data into actionable intelligence. Pattern recognition, anomaly detection, and predictive modeling tailored to your domain.",
    tag: "Analytics"
  },
  {
    title: "Self-Adapting Decision Engines",
    desc: "Intelligent systems that continuously learn from outcomes and refine their logic. Feedback loops, reinforcement signals, and human-in-the-loop safeguards built in from day one.",
    tag: "Machine Learning"
  },
  {
    title: "Conversational AI & Chatbots",
    desc: "Production-grade conversational interfaces powered by state-of-the-art LLMs. Multilingual support, context-aware dialogue, and seamless integration with your existing tools and CRMs.",
    tag: "NLP"
  },
  {
    title: "Knowledge Systems & Custom AI",
    desc: "Bespoke AI solutions for challenges that off-the-shelf tools can't solve. Retrieval-augmented generation, internal knowledge bases, and domain-specific models built for your exact use case.",
    tag: "Custom Solutions"
  }
];

const CARD_STOPS = [0.26, 0.34, 0.42, 0.50, 0.58];

export default function ServicesJourney({ zProgress }: { zProgress: MotionValue<number> }) {
  const containerVisibility = useTransform(zProgress, (v) =>
    v < 0.18 || v > 0.66 ? 'hidden' as const : 'visible' as const
  );

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center md:justify-end"
      style={{ visibility: containerVisibility }}
    >
      <div className="w-[90%] md:w-[400px] md:mr-[10%] relative">
        {services.map((service, i) => {
          const center = CARD_STOPS[i];
          const fadeIn = center - 0.06;
          const fadeOut = center + 0.06;

          const opacity = useTransform(zProgress, [fadeIn, center - 0.02, center + 0.02, fadeOut], [0, 1, 1, 0]);
          const translateY = useTransform(zProgress, [fadeIn, center, center, fadeOut], [40, 0, 0, -40]);
          const filter = useTransform(zProgress,
            [fadeIn, center - 0.02, center + 0.02, fadeOut],
            ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]
          );
          const visibility = useTransform(zProgress, (v) =>
            v < fadeIn - 0.02 || v > fadeOut + 0.02 ? 'hidden' as const : 'visible' as const
          );

          return (
            <motion.div
              key={i}
              className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col gap-2 md:gap-3 text-left absolute w-full"
              style={{ opacity, y: translateY, filter, visibility }}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-secondary)] font-medium">{service.tag}</span>
              <h3 className="text-lg md:text-xl font-medium tracking-tight">{service.title}</h3>
              <p className="text-[var(--color-secondary)] text-xs md:text-sm leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
