// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Radar sweep — ambient hero animation (PPI-style)
// Respects prefers-reduced-motion.
// ============================================================
(function () {
  const canvas = document.getElementById('radar');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let w, h, cx, cy, radius;
  let angle = 0;

  // A handful of static "blips" at fixed polar positions, like detected targets
  const blips = [
    { r: 0.35, theta: 0.4 },
    { r: 0.62, theta: 2.1 },
    { r: 0.48, theta: 3.6 },
    { r: 0.8, theta: 4.8 },
    { r: 0.25, theta: 5.5 },
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = canvas.width = rect.width * window.devicePixelRatio;
    h = canvas.height = rect.height * window.devicePixelRatio;
    cx = w * 0.62;
    cy = h * 0.5;
    radius = Math.min(w, h) * 0.46;
  }

  function ringColor(alpha) { return `rgba(74, 222, 128, ${alpha})`; }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);

    // concentric rings
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor(0.12);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // crosshair lines
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.strokeStyle = ringColor(0.08);
    ctx.lineWidth = 1;
    ctx.stroke();

    // blips
    blips.forEach((b) => {
      const x = cx + Math.cos(b.theta) * b.r * radius;
      const y = cy + Math.sin(b.theta) * b.r * radius;
      ctx.beginPath();
      ctx.arc(x, y, 3 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = ringColor(0.9);
      ctx.fill();
    });
  }

  function drawSweep() {
    const grad = ctx.createConicGradient
      ? ctx.createConicGradient(angle - Math.PI / 2, cx, cy)
      : null;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const sweepWidth = 0.5; // radians
    ctx.arc(cx, cy, radius, angle - sweepWidth, angle);
    ctx.closePath();

    if (grad) {
      grad.addColorStop(0, ringColor(0));
      grad.addColorStop(0.92, ringColor(0));
      grad.addColorStop(1, ringColor(0.25));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = ringColor(0.1);
    }
    ctx.fill();
    ctx.restore();

    // leading edge line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = ringColor(0.7);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // light up blips near the sweep line
    blips.forEach((b) => {
      const diff = Math.abs(((b.theta - angle + Math.PI) % (Math.PI * 2)) - Math.PI);
      if (diff < 0.3) {
        const x = cx + Math.cos(b.theta) * b.r * radius;
        const y = cy + Math.sin(b.theta) * b.r * radius;
        ctx.beginPath();
        ctx.arc(x, y, 7 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = ringColor(0.25);
        ctx.fill();
      }
    });
  }

  function frame() {
    drawStatic();
    drawSweep();
    angle += 0.012;
    if (angle > Math.PI * 4) angle -= Math.PI * 4;
    requestAnimationFrame(frame);
  }

  function staticFrame() {
    drawStatic();
    // draw a fixed sweep line for reduced-motion users, no animation loop
    angle = 5.5;
    drawSweep();
  }

  window.addEventListener('resize', () => {
    resize();
    if (reduceMotion) staticFrame();
  });

  resize();
  if (reduceMotion) {
    staticFrame();
  } else {
    frame();
  }
})();
