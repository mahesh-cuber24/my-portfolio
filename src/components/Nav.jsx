import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { navLinks, site } from '../data/site';
import ThemeToggle from './ThemeToggle';

export default function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      let current = '';
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= 160) current = link.id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const media = window.matchMedia('(min-width: 768px)');
    const close = () => setMenuOpen(false);
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#top" className="group flex items-center gap-2.5" data-cursor="Top">
          <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
          <span className="font-display text-sm font-semibold tracking-tight">{site.name}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`group flex items-baseline gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300 ${
                activeId === link.id ? 'text-ink' : 'text-faint hover:text-ink'
              }`}
            >
              <span className={activeId === link.id ? 'text-accent-text' : 'text-faint'}>
                {link.index}
              </span>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center border border-line text-ink md:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-bg/97 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col px-6 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-3 border-b border-line py-4 font-mono text-xs tracking-[0.14em] uppercase last:border-0"
                >
                  <span className="text-accent-text">{link.index}</span>
                  {link.label}
                </a>
              ))}
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="my-4 inline-flex items-center justify-center bg-ink px-5 py-3 font-mono text-xs tracking-wider text-bg uppercase"
              >
                Résumé
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
