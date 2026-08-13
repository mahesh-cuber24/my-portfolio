import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

// Shared section scaffold: a mono index/name rule across the top, then an
// oversized display heading, then whatever the section renders.
export default function Section({ id, index, name, title, lead, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-28 px-6 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center gap-4 border-b border-line pb-4">
            <span className="label text-accent-text">{index}</span>
            <span className="label">{name}</span>
          </div>

          {title && (
            <h2 className="mt-10 max-w-4xl font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          )}

          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
        </motion.div>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

// Drop-in fade-up wrapper for anything that should animate into view.
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
