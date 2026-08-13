import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import Cursor from './components/Cursor';
import Grain from './components/Grain';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Stack from './components/Stack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    // reducedMotion="user" makes every motion component honour the OS setting,
    // not just the ones that check it by hand.
    <MotionConfig reducedMotion="user">
      <Grain />
      <Cursor />

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent"
      />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-bg focus:uppercase"
      >
        Skip to content
      </a>

      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
