import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      data-cursor={isDark ? 'Light' : 'Dark'}
      className="relative grid h-9 w-9 place-items-center border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -80, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 80, scale: 0.6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute grid place-items-center"
        >
          {isDark ? <Moon size={15} strokeWidth={1.6} /> : <Sun size={15} strokeWidth={1.6} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
