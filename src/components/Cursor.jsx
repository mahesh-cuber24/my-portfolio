import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

// Two-part cursor: a dot that tracks exactly, and a ring that trails slightly.
//
// Perf notes — both matter, this ran visibly late before:
//  * position is written straight to motion values, so moving the pointer never
//    triggers a React render;
//  * hover state comes from `pointerover` (fires once per element crossed), not
//    from running `closest()` on every `pointermove`.
export default function Cursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 750, damping: 38, mass: 0.28 });
  const ringY = useSpring(y, { stiffness: 750, damping: 38, mass: 0.28 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches || reduceMotion) return;

    setEnabled(true);
    document.body.dataset.customCursor = 'on';

    // Hot path: nothing here reads layout or sets React state.
    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    // Fires only when the pointer crosses into a new element.
    const onOver = (event) => {
      const target = event.target?.closest?.('a, button, [data-cursor]');
      setHovering(Boolean(target));
      setLabel(target?.dataset?.cursor ?? '');
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      delete document.body.dataset.customCursor;
    };
  }, [reduceMotion, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div
          animate={{
            width: hovering ? 52 : 28,
            height: hovering ? 52 : 28,
            opacity: pressed ? 0.5 : 1,
            scale: pressed ? 0.85 : 1,
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-accent"
        />
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-accent uppercase"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
