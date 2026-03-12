'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export default function ContactClimax({ zProgress }: { zProgress: MotionValue<number> }) {
  // Phase active from ~0.85 to 1.0
  const opacity = useTransform(zProgress, [0.85, 0.95], [0, 1]);
  const y = useTransform(zProgress, [0.85, 0.95], [50, 0]);
  const pointerEvents = useTransform(zProgress, (v) => v > 0.9 ? 'auto' : 'none');

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity, y, pointerEvents: pointerEvents as any }}
    >
      <div className="glass p-12 rounded-[2.5rem] w-full max-w-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle glass reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        <div className="text-center mb-4">
          <h2 className="text-3xl font-medium tracking-tight mb-2">Initialize Protocol</h2>
          <p className="text-[var(--color-secondary)] font-light">Tell us about your AI needs.</p>
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Name" 
            className="flex-1 bg-white/20 border border-white/40 rounded-xl px-4 py-4 outline-none focus:border-white/80 transition-colors backdrop-blur-md placeholder:text-gray-500 font-light" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="flex-1 bg-white/20 border border-white/40 rounded-xl px-4 py-4 outline-none focus:border-white/80 transition-colors backdrop-blur-md placeholder:text-gray-500 font-light" 
          />
        </div>
        <input 
          type="text" 
          placeholder="Company" 
          className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-4 outline-none focus:border-white/80 transition-colors backdrop-blur-md placeholder:text-gray-500 font-light" 
        />
        <textarea 
          placeholder="Describe your challenge..." 
          rows={4}
          className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-4 outline-none focus:border-white/80 transition-colors backdrop-blur-md placeholder:text-gray-500 resize-none font-light" 
        />

        <button className="mt-4 bg-[var(--color-foreground)] text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          Initiate <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-12 text-center text-sm font-light text-[var(--color-secondary)] flex gap-4 items-center">
        <span><Mail size={14} className="inline mr-2" />office@difrnt.ai</span>
        <span>•</span>
        <span>+40 762 626 165</span>
        <span>•</span>
        <span>Bucharest</span>
        <span>•</span>
        <span>Response within 24 hours</span>
      </div>
    </motion.div>
  );
}
