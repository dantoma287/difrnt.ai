'use client';

import { useState, FormEvent } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Mail, ArrowRight, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactClimax({ zProgress }: { zProgress: MotionValue<number> }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const opacity = useTransform(zProgress, [0.92, 0.98], [0, 1]);
  const y = useTransform(zProgress, [0.92, 0.98], [50, 0]);
  const visibility = useTransform(zProgress, (v) =>
    v < 0.9 ? 'hidden' as const : 'visible' as const
  );
  const pointerEvents = useTransform(zProgress, (v) => v > 0.95 ? 'auto' : 'none');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`New inquiry from ${form.name}${form.company ? ` at ${form.company}` : ''}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || 'N/A'}\n\nMessage:\n${form.message}`
    );

    window.open(`mailto:office@difrnt.ai?subject=${subject}&body=${body}`, '_self');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputClass =
    "flex-1 bg-white/20 border border-white/40 rounded-xl px-4 py-4 outline-none focus:border-white/80 transition-colors backdrop-blur-md placeholder:text-gray-500 font-light text-[var(--color-foreground)]";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity, y, visibility, pointerEvents: pointerEvents as any }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass p-12 rounded-[2.5rem] w-full max-w-2xl flex flex-col gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        <div className="text-center mb-4">
          <h2 className="text-3xl font-medium tracking-tight mb-2">Initialize Protocol</h2>
          <p className="text-[var(--color-secondary)] font-light leading-relaxed max-w-md mx-auto">
            Ready to build something intelligent? Tell us about your challenge and we'll respond within 24 hours with an initial assessment and next steps.
          </p>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Company (optional)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className={inputClass + " w-full"}
        />
        <textarea
          placeholder="Describe your challenge..."
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClass + " w-full resize-none"}
        />

        <button
          type="submit"
          className="mt-4 bg-[var(--color-foreground)] text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {submitted ? 'Opening mail client...' : <>Initiate <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="mt-12 text-center text-sm font-light text-[var(--color-secondary)] flex gap-6 items-center">
        <a href="mailto:office@difrnt.ai" className="flex items-center gap-2 hover:text-[var(--color-foreground)] transition-colors">
          <Mail size={14} />office@difrnt.ai
        </a>
        <span>•</span>
        <a href="tel:+40762626165" className="flex items-center gap-2 hover:text-[var(--color-foreground)] transition-colors">
          <Phone size={14} />+40 762 626 165
        </a>
        <span>•</span>
        <span className="flex items-center gap-2"><MapPin size={14} />Bucharest</span>
        <span>•</span>
        <span className="flex items-center gap-2"><Clock size={14} />Response within 24h</span>
      </div>
    </motion.div>
  );
}
