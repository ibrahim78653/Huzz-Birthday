// ============================================================
//  CURSOR — Custom Cursor with Lighting & Sparkles
// ============================================================

let cursorOuter = null;
let cursorInner = null;
let mouseX = 0;
let mouseY = 0;
let outerX = 0;
let outerY = 0;

/**
 * Initialize custom cursor
 */
export function initCursor() {
  // Don't show on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cursorOuter = document.querySelector('.cursor-outer');
  cursorInner = document.querySelector('.cursor-inner');

  if (!cursorOuter || !cursorInner) return;

  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseenter', () => {
    cursorOuter.style.opacity = '1';
    cursorInner.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
  });

  // Hover states on interactive elements
  document.addEventListener('mouseover', e => {
    const target = e.target.closest('button, a, .polaroid, .glass-frame, .hidden-object, .pinterest-pin, .film-frame-slot, .envelope-container');
    if (target) {
      cursorOuter.classList.add('hover');
      cursorInner.style.transform = 'translate(-50%,-50%) scale(0)';
    } else {
      cursorOuter.classList.remove('hover');
      cursorInner.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  });

  animateCursor();
}

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Inner cursor follows immediately
  if (cursorInner) {
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top  = mouseY + 'px';
  }

  // Spawn sparkles occasionally
  if (Math.random() < 0.12) spawnCursorSparkle(e.clientX, e.clientY);
}

function animateCursor() {
  // Outer cursor lerps toward mouse
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;

  if (cursorOuter) {
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
  }

  requestAnimationFrame(animateCursor);
}

function spawnCursorSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'cursor-sparkle';
  sparkle.style.left = x + 'px';
  sparkle.style.top  = y + 'px';

  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * 30 + 10;
  sparkle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
  sparkle.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
}

/**
 * Glass frame cursor reflection effect
 */
export function initGlassReflection() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.glass-frame').forEach(frame => {
      const reflection = frame.querySelector('.glass-frame-reflection');
      if (!reflection) return;

      const rect = frame.getBoundingClientRect();
      if (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom
      ) {
        const rx = ((e.clientX - rect.left) / rect.width) * 100;
        const ry = ((e.clientY - rect.top)  / rect.height) * 100;
        reflection.style.transform = `translate(${rx - 50}%, ${ry - 50}%)`;
        frame.style.transform = `
          perspective(1000px)
          rotateY(${(rx - 50) * 0.04}deg)
          rotateX(${(ry - 50) * -0.04}deg)
          translateZ(10px)
        `;
      } else {
        frame.style.transform = '';
      }
    });
  }, { passive: true });
}

/**
 * Card lift effect on hover (polaroids, timeline photos)
 */
export function initCardLift() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.polaroid, .timeline-photo').forEach(card => {
      const rect = card.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      if (isInside) {
        const rx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const ry = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
        card.style.transform = `perspective(600px) rotateY(${rx}deg) rotateX(${ry}deg) translateY(-8px) scale(1.03)`;
        card.style.boxShadow = '8px 20px 50px rgba(0,0,0,0.6)';
      } else {
        // Reset to original rotation from style attribute
        const origTransform = card.dataset.origTransform || '';
        card.style.transform = origTransform;
        card.style.boxShadow = '';
      }
    });
  }, { passive: true });

  // Store original transforms
  document.querySelectorAll('.polaroid').forEach(card => {
    card.dataset.origTransform = card.style.transform || '';
  });
}
