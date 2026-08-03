// ============================================================
//  HIDDEN MEMORIES — Reveal behind symbols
// ============================================================

/**
 * Initialize click-to-reveal hidden memory objects
 */
export function initHiddenMemories() {
  const overlay = document.getElementById('hidden-reveal-overlay');
  if (!overlay) return;

  const overlayImg   = overlay.querySelector('#hidden-reveal-img');
  const overlayTitle = overlay.querySelector('#hidden-reveal-title');
  const overlayCaption = overlay.querySelector('#hidden-reveal-caption');
  const closeBtn     = overlay.querySelector('#hidden-reveal-close');

  // Delegate click on all hidden objects
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.hidden-object');
    if (!trigger) return;

    const imgSrc  = trigger.dataset.memImage;
    const title   = trigger.dataset.memTitle || '';
    const caption = trigger.dataset.memCaption || '';

    if (overlayImg)     overlayImg.src = imgSrc;
    if (overlayTitle)   overlayTitle.textContent = title;
    if (overlayCaption) overlayCaption.textContent = caption ? `"${caption}"` : '';

    overlay.classList.add('active');
    document.body.classList.add('no-scroll');

    // Pop animation
    trigger.style.animation = 'waxReveal 0.4s ease-out forwards';
    setTimeout(() => {
      trigger.style.animation = '';
      trigger.style.opacity = '0.3';
    }, 400);
  });

  // Close on overlay click or close button
  const close = () => {
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/**
 * Initialize envelope reveal interaction
 */
export function initEnvelopeReveal() {
  document.addEventListener('click', e => {
    const trigger = e.target.closest('#envelope-trigger');
    if (!trigger) return;

    if (trigger.classList.contains('opened')) return;
    trigger.classList.add('opened');

    const photo   = trigger.querySelector('#envelope-photo');
    const caption = document.getElementById('envelope-caption');

    if (photo) {
      setTimeout(() => {
        photo.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        photo.style.opacity = '1';
        photo.style.transform = 'translateX(-50%) translateY(-120%)';
      }, 600);
    }

    if (caption) {
      setTimeout(() => {
        caption.style.opacity = '1';
      }, 1200);
    }
  });
}

/**
 * Touch ripple effect on mobile
 */
export function initTouchRipple() {
  if (!window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${touch.clientX}px;
      top: ${touch.clientY}px;
      width: 20px;
      height: 20px;
      margin: -10px;
      border-radius: 50%;
      background: rgba(232, 160, 160, 0.3);
      pointer-events: none;
      z-index: 9999;
      animation: ripple 0.6s ease-out forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, { passive: true });
}
