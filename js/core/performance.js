// ============================================================
//  PERFORMANCE — Lazy Loading, Preloading, GPU Hints
// ============================================================

let observer = null;

/**
 * Initialize IntersectionObserver for lazy image loading
 */
export function initLazyLoad() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    loadAllImages();
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('img-loaded');

        img.addEventListener('load', () => {
          img.classList.add('img-visible');
        }, { once: true });

        img.addEventListener('error', () => {
          img.classList.add('img-error');
          // Show elegant fallback
          img.style.opacity = '0';
          const ph = document.createElement('div');
          ph.className = 'img-placeholder';
          ph.style.cssText = img.style.cssText;
          ph.innerHTML = '<span style="opacity:0.3;font-size:0.7rem;letter-spacing:0.1em;">✦</span>';
          img.parentNode.insertBefore(ph, img);
        }, { once: true });
      }

      observer.unobserve(img);
    });
  }, {
    root: null,
    rootMargin: '200px 0px', // Load 200px before entering view
    threshold: 0.01,
  });

  // Observe all lazy images
  refreshLazyImages();
}

/**
 * Observe any new lazy images added to DOM
 */
export function refreshLazyImages() {
  if (!observer) return;
  document.querySelectorAll('img.lazy-img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

/**
 * Fallback: load all images at once
 */
function loadAllImages() {
  document.querySelectorAll('img.lazy-img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

/**
 * Preload critical images (first hero image)
 */
export function preloadCritical(imagePaths = []) {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}

/**
 * Add GPU acceleration hints to animated elements
 */
export function addGPUHints() {
  const selectors = [
    '.hero-image-wrap',
    '.glass-frame',
    '.film-frame-slot',
    '.polaroid',
    '#heart-canvas',
    '.floating-polaroid',
    '.ambient-orb',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.willChange = 'transform, opacity';
      el.style.transform = el.style.transform || 'translateZ(0)';
    });
  });
}

/**
 * Setup IntersectionObserver for scroll reveal animations
 */
export function initScrollReveal() {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '-60px 0px',
    threshold: 0.1,
  });

  const refreshReveals = () => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObs.observe(el);
    });
  };

  refreshReveals();
  return refreshReveals;
}

/**
 * Film strip drag scroll
 */
export function initFilmDragScroll() {
  document.querySelectorAll('.film-strip-wrapper').forEach(wrapper => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    wrapper.addEventListener('mousedown', e => {
      isDown = true;
      wrapper.style.cursor = 'grabbing';
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => {
      isDown = false;
      wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseup', () => {
      isDown = false;
      wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 2;
      wrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch
    wrapper.addEventListener('touchstart', e => {
      startX = e.touches[0].pageX;
      scrollLeft = wrapper.scrollLeft;
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
      const x = e.touches[0].pageX;
      const walk = (startX - x) * 1.5;
      wrapper.scrollLeft = scrollLeft + walk;
    }, { passive: true });
  });
}

/**
 * Efficient parallax scroll handler using transform
 */
export function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer[data-parallax-speed]');
  if (layers.length === 0) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.parallaxSpeed) || -0.2;
      const rect = layer.closest('section')?.getBoundingClientRect() || { top: 0 };
      const offset = (rect.top + scrollY) * speed;
      layer.style.transform = `translateY(${offset}px) translateZ(0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}
