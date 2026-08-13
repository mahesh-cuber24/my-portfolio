import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

// Pulls gently toward the cursor while hovered, then springs back.
export default function MagneticButton({
  as = 'a',
  children,
  className = '',
  strength = 0.35,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const Component = motion[as] ?? motion.a;

  if (reduceMotion) {
    const Plain = as === 'button' ? 'button' : 'a';
    return (
      <Plain className={className} {...props}>
        {children}
      </Plain>
    );
  }

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
