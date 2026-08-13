import { useEffect, useRef } from 'react';

// A field of feature points that the cursor "detects": points inside the scan
// radius light up, link to their neighbours, and get boxed like a tracker output.
// Deliberately on-theme — this is what a keypoint detector looks like mid-frame.

const POINT_SPACING = 74; // px between grid slots before jitter
const SCAN_RADIUS = 190;
const LINK_DISTANCE = 108;

function hexToRgb(hex) {
  const clean = hex.trim().replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export default function DetectionField() {
  const canvasRef = useRef(null);
  // Kept in refs so the animation loop never triggers a React re-render.
  const pointsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, strength: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let frame;
    let visible = true;
    // Cached so the pointermove handler never forces a synchronous layout.
    let bounds = { left: 0, top: 0 };
    let colors = { ink: [20, 19, 26], accent: [227, 61, 16] };

    function readColors() {
      const styles = getComputedStyle(document.documentElement);
      colors = {
        ink: hexToRgb(styles.getPropertyValue('--c-ink') || '#14131a'),
        accent: hexToRgb(styles.getPropertyValue('--c-accent') || '#e33d10'),
      };
    }

    function seedPoints() {
      const points = [];
      const cols = Math.ceil(width / POINT_SPACING) + 1;
      const rows = Math.ceil(height / POINT_SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Jitter each grid slot so the field reads organic, not like graph paper.
          const jitterX = (Math.random() - 0.5) * POINT_SPACING * 0.75;
          const jitterY = (Math.random() - 0.5) * POINT_SPACING * 0.75;
          points.push({
            baseX: col * POINT_SPACING + jitterX,
            baseY: row * POINT_SPACING + jitterY,
            x: 0,
            y: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.25 + Math.random() * 0.5,
            amp: 3 + Math.random() * 7,
            activation: 0,
          });
        }
      }
      pointsRef.current = points;
    }

    function cacheBounds() {
      const rect = canvas.getBoundingClientRect();
      bounds = { left: rect.left, top: rect.top };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      bounds = { left: rect.left, top: rect.top };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
    }

    function draw(time) {
      const t = time / 1000;
      const points = pointsRef.current;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);

      const [ir, ig, ib] = colors.ink;
      const [ar, ag, ab] = colors.accent;

      // Ease the scan strength so the field settles when the pointer leaves.
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;

      const active = [];

      for (const point of points) {
        point.x = point.baseX + Math.cos(t * point.speed + point.phase) * point.amp;
        point.y = point.baseY + Math.sin(t * point.speed + point.phase * 1.3) * point.amp;

        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        const target = distance < SCAN_RADIUS ? (1 - distance / SCAN_RADIUS) * pointer.strength : 0;
        point.activation += (target - point.activation) * 0.16;

        if (point.activation > 0.06) active.push(point);

        const radius = 1 + point.activation * 2.6;
        const alpha = 0.16 + point.activation * 0.84;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle =
          point.activation > 0.12
            ? `rgba(${ar}, ${ag}, ${ab}, ${alpha})`
            : `rgba(${ir}, ${ig}, ${ib}, ${alpha * 0.6})`;
        ctx.fill();
      }

      // Link activated neighbours — the "matched features" layer.
      ctx.lineWidth = 1;
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const a = active[i];
          const b = active[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;

          const strength = (1 - distance / LINK_DISTANCE) * Math.min(a.activation, b.activation);
          if (strength < 0.04) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${strength * 0.85})`;
          ctx.stroke();
        }
      }

      // Tracker box around whatever the scan is currently locked onto.
      if (active.length > 2 && pointer.strength > 0.15) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const point of active) {
          if (point.activation < 0.3) continue;
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        }

        if (minX < maxX) {
          const pad = 16;
          minX -= pad;
          minY -= pad;
          maxX += pad;
          maxY += pad;

          const boxAlpha = pointer.strength * 0.75;
          const corner = 14;
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${boxAlpha})`;
          ctx.lineWidth = 1.5;

          // corner ticks only, the way a detection overlay is usually drawn
          const corners = [
            [minX, minY, 1, 1],
            [maxX, minY, -1, 1],
            [minX, maxY, 1, -1],
            [maxX, maxY, -1, -1],
          ];
          for (const [cx, cy, sx, sy] of corners) {
            ctx.beginPath();
            ctx.moveTo(cx + corner * sx, cy);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx, cy + corner * sy);
            ctx.stroke();
          }

          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${boxAlpha})`;
          ctx.fillText(`TRACK ${active.length.toString().padStart(2, '0')}`, minX, minY - 7);
        }
      }

      if (visible) frame = requestAnimationFrame(draw);
    }

    function onPointerMove(event) {
      pointerRef.current.x = event.clientX - bounds.left;
      pointerRef.current.y = event.clientY - bounds.top;
      pointerRef.current.active = true;
    }

    function onPointerLeave() {
      pointerRef.current.active = false;
    }

    // The canvas moves under the viewport as the page scrolls.
    function onScroll() {
      cacheBounds();
    }

    readColors();
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Stop animating entirely once the hero has scrolled away.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduceMotion) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    // Re-read palette when the theme class flips.
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    if (reduceMotion) {
      // Draw one static frame instead of animating.
      draw(0);
      cancelAnimationFrame(frame);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
