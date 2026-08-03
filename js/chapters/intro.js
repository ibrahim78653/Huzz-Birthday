// ============================================================
//  INTRO — Loading Screen + Book Opening Experience
// ============================================================

import { settings } from '../../memories.js';
import { resumeSmoothScroll } from '../core/scroll.js';

let starsCanvas = null;
let starsCtx = null;
let starsAnimId = null;
const stars = [];
const particles = [];

/**
 * Initialize star field on canvas
 */
function initStars(canvas) {
  starsCanvas = canvas;
  starsCtx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  };

  resize();
  window.addEventListener('resize', resize);
  animateStars();
}

function generateStars() {
  stars.length = 0;
  const count = Math.min(Math.floor(window.innerWidth * 0.12), 180);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
      color: ['#f8f4ff','#fce8e8','#f5e6d0','#e0d8ff'][Math.floor(Math.random()*4)],
    });
  }
}

function animateStars() {
  if (!starsCtx) return;
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  const t = Date.now() * 0.001;

  stars.forEach(star => {
    const flicker = Math.sin(t * star.speed * 60 + star.phase) * 0.4 + 0.6;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    starsCtx.fillStyle = star.color;
    starsCtx.globalAlpha = star.opacity * flicker;
    starsCtx.fill();

    // Glow for bright stars
    if (star.r > 1.0) {
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
      starsCtx.fillStyle = star.color;
      starsCtx.globalAlpha = 0.05 * flicker;
      starsCtx.fill();
    }
  });

  starsCtx.globalAlpha = 1;
  starsAnimId = requestAnimationFrame(animateStars);
}

/**
 * Spawn floating particles (petals/sparkles)
 */
function spawnParticle() {
  if (!starsCanvas || !starsCtx) return;
  const x = Math.random() * starsCanvas.width;
  const particle = {
    x,
    y: starsCanvas.height + 20,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(Math.random() * 1.5 + 0.5),
    opacity: Math.random() * 0.6 + 0.3,
    r: Math.random() * 2 + 1,
    life: 0,
    maxLife: Math.random() * 200 + 100,
    color: ['#e8a0a0','#d4a574','#c9b8e8','#f0e6ff'][Math.floor(Math.random()*4)],
  };
  particles.push(particle);
}

/**
 * Build and show the loading screen
 */
export function showLoadingScreen() {
  return new Promise(resolve => {
    const screen = document.getElementById('loading-screen');
    if (!screen) { resolve(); return; }

    const canvas = document.getElementById('stars-canvas');
    if (canvas) initStars(canvas);

    const progressBar = screen.querySelector('.loading-progress-bar');
    let progress = 0;

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);

        setTimeout(() => {
          hideLoadingScreen(screen, resolve);
        }, 400);
      }
      if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, 150);

    // Spawn particles
    setInterval(spawnParticle, 300);
  });
}

/**
 * Hide loading screen with elegant transition
 */
function hideLoadingScreen(screen, callback) {
  screen.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
  screen.style.opacity = '0';

  setTimeout(() => {
    screen.style.display = 'none';
    if (starsAnimId) {
      cancelAnimationFrame(starsAnimId);
    }
    callback();
  }, 1000);
}

/**
 * Show intro overlay with title reveal
 */
export function showIntroOverlay() {
  return new Promise(resolve => {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) { resolve(); return; }

    overlay.style.display = 'flex';

    const eyebrow   = overlay.querySelector('.intro-eyebrow');
    const headline  = overlay.querySelector('.intro-headline');
    const tagline   = overlay.querySelector('.intro-tagline');
    const startBtn  = overlay.querySelector('.btn-start-journey');
    const musicBtn  = document.querySelector('.music-toggle');

    // Sequential reveal using CSS transitions
    const revealSequence = [
      { el: eyebrow,  delay: 400,  props: { opacity: '1', transform: 'translateY(0)' } },
      { el: headline, delay: 900,  props: { opacity: '1', transform: 'translateY(0)' } },
      { el: tagline,  delay: 1600, props: { opacity: '1', transform: 'translateY(0)' } },
      { el: startBtn, delay: 2400, props: { opacity: '1', transform: 'translateY(0)' } },
      { el: musicBtn, delay: 2800, props: { opacity: '1' } },
    ];

    // Set initial states for transition
    [eyebrow, headline, tagline, startBtn].forEach(el => {
      if (!el) return;
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
    });

    revealSequence.forEach(({ el, delay, props }) => {
      if (!el) return;
      setTimeout(() => {
        Object.assign(el.style, props);
      }, delay);
    });

    // Start journey button
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        startJourney(overlay, resolve);
      });
    }
  });
}

/**
 * Animate into the main experience
 */
function startJourney(overlay, callback) {
  resumeSmoothScroll();

  // Page turn animation
  overlay.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';

  // Subtle shake on start
  document.body.style.transition = 'none';

  setTimeout(() => {
    overlay.style.display = 'none';
    callback();
  }, 1200);
}

/**
 * Moonlight animation on canvas during loading
 */
export function animateMoon() {
  const moon = document.querySelector('.loading-moon');
  if (!moon) return;

  let phase = 0;
  const animate = () => {
    phase += 0.01;
    const glow = 40 + Math.sin(phase) * 15;
    const opacity = 0.4 + Math.sin(phase * 0.7) * 0.15;
    moon.style.boxShadow = `
      0 0 ${glow}px rgba(200,175,255,${opacity}),
      0 0 ${glow * 2}px rgba(200,175,255,${opacity * 0.5}),
      inset -10px -10px 20px rgba(100,60,150,0.3)
    `;
    requestAnimationFrame(animate);
  };
  animate();
}

/**
 * Fill dynamic text in intro from settings
 */
export function populateIntroText() {
  const eyebrow = document.querySelector('.intro-eyebrow');
  const headline = document.querySelector('.intro-headline');
  const tagline = document.querySelector('.intro-tagline');

  if (eyebrow) eyebrow.textContent = settings.from || 'With all my love';

  if (headline) {
    headline.innerHTML = `Happy Birthday,<br><span class="highlight">${settings.name || 'My Love'}</span>`;
  }

  if (tagline) tagline.textContent = settings.introSubtitle || 'A journey worth remembering';

  // Loading screen
  const loadTitle = document.querySelector('.loading-title');
  const loadSub = document.querySelector('.loading-subtitle');
  if (loadTitle) loadTitle.textContent = `For ${settings.name || 'You'}`;
  if (loadSub) loadSub.textContent = settings.from || 'With all my love';
}

/**
 * Setup music toggle button
 */
export function initMusic() {
  const btn = document.querySelector('.music-toggle');
  if (!btn) return;

  const audio = document.getElementById('bg-music');
  if (!audio) {
    btn.style.display = 'none';
    return;
  }

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.innerHTML = '🎵';
      btn.title = 'Play music';
    } else {
      audio.play().catch(() => {});
      btn.innerHTML = '🔇';
      btn.title = 'Pause music';
    }
    playing = !playing;
  });
}

/**
 * Show the Envelope Introduction Screen with password protection and opening effect
 */
export function showEnvelopeIntro() {
  return new Promise(resolve => {
    const screen = document.getElementById('envelope-intro-screen');
    if (!screen) { resolve(); return; }

    screen.style.display = 'flex';
    screen.style.opacity = '1';

    // Optional stars on envelope canvas
    const canvas = document.getElementById('envelope-stars');
    if (canvas) initStars(canvas);

    const envelopeContainer = document.getElementById('main-intro-envelope');
    const heartSeal = document.getElementById('intro-heart-seal');
    const passwordModal = document.getElementById('envelope-password-modal');
    const passwordForm = document.getElementById('envelope-password-form');
    const passwordInput = document.getElementById('envelope-password-input');
    const errorMsg = document.getElementById('password-error-msg');
    const flap = screen.querySelector('.intro-envelope-flap');
    const letter = document.getElementById('intro-envelope-letter');

    let passwordPrompted = false;

    // Trigger password bar popup when clicking envelope or heart seal
    const triggerPasswordModal = () => {
      if (passwordPrompted) return;
      passwordPrompted = true;

      passwordModal.style.display = 'block';
      passwordModal.style.opacity = '0';
      passwordModal.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { passwordModal.style.opacity = '1'; });
      });
      setTimeout(() => {
        if (passwordInput) passwordInput.focus();
      }, 200);
    };

    if (heartSeal) heartSeal.addEventListener('click', triggerPasswordModal);
    if (envelopeContainer) {
      envelopeContainer.addEventListener('click', (e) => {
        if (!e.target.closest('#envelope-password-modal')) {
          triggerPasswordModal();
        }
      });
    }

    // Handle password verification
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = passwordInput.value.trim().toLowerCase();

        // Required passcode: "huzz-loves-umme"
        if (val === 'huzz-loves-umme') {
          if (errorMsg) errorMsg.style.display = 'none';

          // 1. Hide password modal cleanly
          passwordModal.style.transition = 'opacity 0.4s, transform 0.4s';
          passwordModal.style.opacity = '0';
          passwordModal.style.transform = 'translateY(20px)';

          // 2. Dissolve Heart Seal
          if (heartSeal) {
            heartSeal.style.transition = 'transform 0.5s var(--ease-spring), opacity 0.5s';
            heartSeal.style.transform = 'translate(-50%, -50%) scale(1.5)';
            heartSeal.style.opacity = '0';
          }

          // 3. Envelope opening flap animation
          setTimeout(() => {
            if (flap) flap.classList.add('opened');
          }, 350);

          // 4. Sparkles + show full-screen letter overlay
          setTimeout(() => {
            spawnEnvelopeSparkles(envelopeContainer);
            showLetterOverlay(screen, resolve);
          }, 750);

        } else {
          // Incorrect passcode handling
          passwordInput.classList.add('shake-error');
          if (errorMsg) {
            errorMsg.textContent = '❌ Incorrect passcode! Try again ♡';
            errorMsg.style.display = 'block';
          }
          passwordInput.value = '';
          passwordInput.focus();

          setTimeout(() => {
            passwordInput.classList.remove('shake-error');
          }, 450);
        }
      });
    }
  });
}

/**
 * Show full-screen letter that slides up from envelope, fully visible on screen.
 * Resolves the promise when user clicks "Let's Go".
 */
function showLetterOverlay(envelopeScreen, resolve) {
  // Remove any existing overlay
  const existing = document.getElementById('letter-fullscreen-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'letter-fullscreen-overlay';
  overlay.innerHTML = `
    <div class="letter-fs-paper">
      <div class="letter-fs-deco-top">✦ &nbsp; ✦ &nbsp; ✦</div>

      <p class="letter-fs-to">To My Beloved</p>

      <h1 class="letter-fs-heading">Happy Birthday Bubuu&nbsp;❤️</h1>

      <div class="letter-fs-divider"></div>

      <p class="letter-fs-subtitle">Birthday Special · A Bonus Story Quest</p>

      <p class="letter-fs-tagline">Ready, Adventurer?</p>

      <button id="letter-letsgo-btn" class="letter-fs-btn">
        <span>Let's Go</span>
        <span class="letter-btn-arrow">→</span>
      </button>

      <div class="letter-fs-deco-bottom">✦ &nbsp; ✦ &nbsp; ✦</div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in after next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('letter-fs-visible');
    });
  });

  // Let's Go button → cross-fade to personal letter page
  document.getElementById('letter-letsgo-btn').addEventListener('click', () => {
    overlay.style.transition = 'opacity 0.7s ease';
    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.remove();
      if (envelopeScreen) envelopeScreen.style.display = 'none';
      showPersonalLetter(resolve);
    }, 720);
  });
}

/**
 * Full-screen personal letter page — crimson red bg, scrollable cream letter.
 * Resolves (goes to story) when user clicks "Continue to Story".
 */
function showPersonalLetter(resolve) {
  const page = document.createElement('div');
  page.id = 'personal-letter-page';

  page.innerHTML = `
    <div class="pl-inner">
      <div class="pl-scroll-hint" id="pl-scroll-hint">scroll down ↓</div>
      <article class="pl-letter">

        <div class="pl-letter-header">
          <span class="pl-deco">❧</span>
        </div>

        <p class="pl-line pl-title">Happyyy birthday!!! 🎂</p>

        <p class="pl-line">I still remember the very first time we met, how I fell in love with you and your smile — &amp; you didn't fall for me.</p>

        <p class="pl-line pl-aside">❤ Anywayssss,</p>

        <p class="pl-line">I don't think I'll ever have the right words to fully express how much you mean to me — but I'll try anyway.</p>

        <p class="pl-line pl-thankyou">Thank You…</p>

        <p class="pl-line">Thank you for showing up in my life and <strong>STAYING</strong>. For the laughter, the late-night talks, the silent understanding, and even the difficult conversations. Thank you for being real with me.</p>

        <p class="pl-line">You've been my calm in the chaos, my steady when everything else feels shaky.</p>

        <p class="pl-line">You're not just someone I care about — you're the person who changed the way I see the world, and myself.</p>

        <p class="pl-line">So today, I hope you feel just a fraction of the love you've given me.</p>

        <p class="pl-line">You deserve that and so much more.</p>

        <p class="pl-line pl-promise">I pinky promise to annoy you forever, even when we're old. 🤙</p>

        <p class="pl-line pl-love">I love you shoooo Much</p>
        <p class="pl-line pl-love-big">I lovee youuu soo muchhh ♥️💋</p>

        <p class="pl-sign">— aalooo badoooo</p>

        <div class="pl-letter-footer">
          <span class="pl-deco">❧</span>
        </div>

        <button id="pl-continue-btn" class="pl-continue-btn">
          <span>Continue to Story</span>
          <span class="pl-btn-arrow">→</span>
        </button>

      </article>
    </div>
  `;

  document.body.appendChild(page);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      page.classList.add('pl-visible');
    });
  });

  // Hide scroll hint after user scrolls
  const inner = page.querySelector('.pl-inner');
  const hint  = page.querySelector('#pl-scroll-hint');
  inner.addEventListener('scroll', () => {
    if (inner.scrollTop > 40) hint.style.opacity = '0';
  }, { passive: true });

  // Continue button
  document.getElementById('pl-continue-btn').addEventListener('click', () => {
    page.style.transition = 'opacity 0.8s ease';
    page.style.opacity = '0';
    setTimeout(() => {
      page.remove();
      resolve();
    }, 820);
  });
}

function spawnEnvelopeSparkles(container) {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 200}px`;
    sparkle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 150}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 60;
    sparkle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    sparkle.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

