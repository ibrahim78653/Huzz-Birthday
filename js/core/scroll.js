// ============================================================
//  SCROLL — Lenis Smooth Scroll Setup
// ============================================================

let lenis = null;
let rafId = null;

/**
 * Initialize Lenis smooth scroll
 * Falls back gracefully if Lenis isn't loaded
 */
export function initSmoothScroll() {
  // Check if Lenis is available
  if (typeof window.Lenis === 'undefined') {
    console.warn('[Scroll] Lenis not found, using native scroll.');
    return null;
  }

  lenis = new window.Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  window.addEventListener('resize', () => {
    if (lenis) lenis.resize();
  }, { passive: true });

  return lenis;
}

/**
 * Resize Lenis instance when DOM height updates
 */
export function resizeLenis() {
  if (lenis && typeof lenis.resize === 'function') {
    lenis.resize();
  }
}

/**
 * Stop smooth scrolling
 */
export function stopSmoothScroll() {
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Resume smooth scrolling
 */
export function resumeSmoothScroll() {
  if (lenis) {
    lenis.start();
    lenis.resize();
  }
}

/**
 * Scroll to element
 */
export function scrollToElement(target, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 2 });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Get Lenis instance
 */
export function getLenis() { return lenis; }

/**
 * Cancel animation frame
 */
export function destroySmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  if (lenis) lenis.destroy();
  lenis = null;
}

/**
 * Setup scroll progress bar
 */
export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  return update;
}

/**
 * Setup nav dots (right side chapter navigation)
 */
export function initNavDots(chapters) {
  const container = document.querySelector('.nav-dots');
  if (!container) return;

  const dots = [];

  chapters.forEach((chapter, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Go to chapter ${i + 1}`);
    dot.title = chapter.type;
    dot.addEventListener('click', () => {
      const el = document.getElementById(chapter.id);
      if (el) scrollToElement(el);
    });
    container.appendChild(dot);
    dots.push(dot);
  });

  // Show on scroll
  window.addEventListener('scroll', () => {
    container.classList.toggle('visible', window.scrollY > 200);
  }, { passive: true });

  // Update active dot
  const updateActive = () => {
    chapters.forEach((chapter, i) => {
      const el = document.getElementById(chapter.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isActive = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      dots[i]?.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  return dots;
}
