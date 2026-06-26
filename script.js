// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Scroll progress bar
// ============================================================
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ============================================================
// Nav background on scroll + active link highlighting
// ============================================================
(function () {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

  function onScroll() {
    if (window.scrollY > 20) {
      nav.style.borderColor = 'var(--line)';
    }

    let currentId = null;
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.dataset.nav === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// Mobile menu toggle
// ============================================================
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // close menu when a link is tapped
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ============================================================
// Back to top button
// ============================================================
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================================
// Scroll reveal via Intersection Observer
// ============================================================
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((t) => observer.observe(t));
})();

// ============================================================
// Magnetic button effect (subtle pull toward cursor)
// ============================================================
(function () {
  const buttons = document.querySelectorAll('.magnetic');
  if (!buttons.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

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
