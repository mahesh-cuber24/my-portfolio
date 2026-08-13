import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { site } from '../data/site';
import DetectionField from './DetectionField';
import MagneticButton from './MagneticButton';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const line = {
  hidden: { opacity: 0, y: '110%' },
  show: { opacity: 1, y: '0%', transition: { duration: 0.9, ease: EASE } },
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center px-6 pt-32 pb-20">
      <DetectionField />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fade} className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="label">{site.availability}</span>
        </motion.div>

        {/* Each line masks its own slide-up. */}
        <h1 className="mt-10 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] font-semibold tracking-[-0.04em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={line} className="block">
              {site.headlineLead}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={line} className="serif-accent block text-accent">
              {site.headlineAccent}
            </motion.span>
          </span>
        </h1>

        <div className="mt-14 grid gap-10 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p variants={fade} className="max-w-xl leading-relaxed text-muted">
            {site.tagline}
          </motion.p>

          <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
            <MagneticButton
              href="#projects"
              data-cursor="See work"
              className="inline-flex items-center gap-2 bg-ink px-7 py-3.5 font-mono text-xs tracking-wider text-bg uppercase"
            >
              Selected work
            </MagneticButton>
            <MagneticButton
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="PDF"
              className="inline-flex items-center gap-2 border border-line-strong px-7 py-3.5 font-mono text-xs tracking-wider uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Résumé
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          variants={fade}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] tracking-wider text-faint uppercase"
        >
          <span>{site.location}</span>
          <span>{site.currentRole}</span>
          <span>B.Tech ECE · 2026</span>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-faint sm:block"
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ArrowDown size={18} strokeWidth={1.5} />
        </motion.span>
      </motion.a>
    </section>
  );
}
