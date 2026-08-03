// ============================================================
//  FINALE — Grand Heart Assembly Animation
// ============================================================

import { getFinaleMemories, getImagePath } from '../engine/memoryEngine.js';
import { settings } from '../../memories.js';
import { resizeLenis } from '../core/scroll.js';

let finaleTriggered = false;
let heartCanvas = null;
let heartCtx = null;

/**
 * Build the finale section DOM
 */
export function buildFinaleSection(container) {
  const section = document.createElement('section');
  section.id = 'finale-section';

  section.innerHTML = `
    <canvas id="heart-canvas"></canvas>

    <div class="ambient-orb orb-rose" style="width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.2;animation:breathe 6s ease-in-out infinite;"></div>
    <div class="ambient-orb orb-moon" style="width:300px;height:300px;top:20%;left:20%;opacity:0.1;animation:breathe 8s ease-in-out infinite 2s;"></div>
    <div class="ambient-orb orb-gold" style="width:250px;height:250px;bottom:20%;right:20%;opacity:0.1;animation:breathe 7s ease-in-out infinite 1s;"></div>

    <div class="finale-message" id="finale-message">
      <p class="finale-quote">"${settings.finaleMessage}"</p>
      <p class="finale-name">${settings.birthdayGreeting}, ${settings.name} ❤️</p>
    </div>
  `;

  container.appendChild(section);

  return section;
}

/**
 * Initialize and animate the heart assembly
 */
export function initFinale() {
  heartCanvas = document.getElementById('heart-canvas');
  if (!heartCanvas) return;

  heartCtx = heartCanvas.getContext('2d');

  const resize = () => {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Observe when finale section enters view
  const finaleSection = document.getElementById('finale-section');
  if (!finaleSection) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !finaleTriggered) {
        finaleTriggered = true;
        obs.disconnect();
        setTimeout(() => triggerHeartAssembly(), 500);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(finaleSection);
}

/**
 * Heart shape point generation
 */
function heartPoint(t, scale = 1, cx = 0, cy = 0) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return {
    x: cx + x * scale,
    y: cy + y * scale,
  };
}

/**
 * Generate N points distributed along heart perimeter
 */
function generateHeartPoints(count, cx, cy, scale) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    points.push(heartPoint(t, scale, cx, cy));
  }
  return points;
}

/**
 * Main heart assembly animation
 */
async function triggerHeartAssembly() {
  const mems = getFinaleMemories();
  if (!heartCanvas || !heartCtx || mems.length === 0) {
    showFinaleMessage();
    return;
  }

  const W = heartCanvas.width;
  const H = heartCanvas.height;
  const cx = W / 2;
  const cy = H * 0.42;
  const scale = Math.min(W, H) * 0.022;

  const count = Math.min(mems.length, 60);
  const heartPoints = generateHeartPoints(count, cx, cy, scale);

  // Load images
  const imgs = await loadImagesParallel(mems.slice(0, count));

  // Create particles (each is a photo thumbnail assembling into heart)
  const photoSize = Math.min(60, Math.floor(scale * 2));

  const particles = imgs.map((img, i) => ({
    img,
    // Start position: scattered around viewport
    x: Math.random() * W,
    y: Math.random() * H,
    // Target position: heart point
    tx: heartPoints[i].x,
    ty: heartPoints[i].y,
    opacity: 0,
    progress: 0,
    delay: (i / count) * 2.5, // staggered start
    size: photoSize,
    rotation: (Math.random() - 0.5) * 30,
    targetRotation: (Math.random() - 0.5) * 6,
  }));

  const startTime = performance.now();
  const totalDuration = 5000; // 5s assembly

  function render(now) {
    const elapsed = now - startTime;
    heartCtx.clearRect(0, 0, W, H);

    let allDone = true;

    particles.forEach(p => {
      const particleElapsed = elapsed - p.delay * 1000;
      if (particleElapsed < 0) {
        allDone = false;
        return;
      }

      p.progress = Math.min(particleElapsed / totalDuration, 1);
      if (p.progress < 1) allDone = false;

      // Eased progress
      const t = easeOutExpo(p.progress);

      const x = lerp(p.x, p.tx, t);
      const y = lerp(p.y, p.ty, t);
      const rot = lerp(p.rotation, p.targetRotation, t) * Math.PI / 180;
      const opacity = Math.min(p.progress * 4, 1);
      const size = p.size + (1 - t) * p.size * 0.5;

      heartCtx.save();
      heartCtx.globalAlpha = opacity;
      heartCtx.translate(x, y);
      heartCtx.rotate(rot);

      // Polaroid-style photo
      const pad = 3;
      heartCtx.fillStyle = '#f8f5ee';
      heartCtx.shadowColor = 'rgba(0,0,0,0.4)';
      heartCtx.shadowBlur = 8;
      heartCtx.fillRect(-size/2 - pad, -size/2 - pad, size + pad*2, size + pad*2 + 12);
      heartCtx.shadowBlur = 0;

      if (p.img.complete && p.img.naturalWidth > 0) {
        heartCtx.drawImage(p.img, -size/2, -size/2, size, size);
      } else {
        heartCtx.fillStyle = '#e8dcc4';
        heartCtx.fillRect(-size/2, -size/2, size, size);
      }

      heartCtx.restore();
    });

    if (!allDone || elapsed < totalDuration + 1000) {
      requestAnimationFrame(render);
    } else {
      // Done assembling — draw glowing heart outline then show message
      drawGlowingHeart(cx, cy, scale);
      showFinaleMessage();
    }
  }

  requestAnimationFrame(render);
}

/**
 * Draw glowing heart outline after assembly
 */
function drawGlowingHeart(cx, cy, scale) {
  if (!heartCtx || !heartCanvas) return;

  let phase = 0;
  const glow = () => {
    phase += 0.02;
    const glowIntensity = 0.5 + Math.sin(phase) * 0.3;

    heartCtx.save();
    heartCtx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      const p = heartPoint(t, scale, cx, cy);
      t === 0 ? heartCtx.moveTo(p.x, p.y) : heartCtx.lineTo(p.x, p.y);
    }
    heartCtx.closePath();
    heartCtx.strokeStyle = `rgba(232,160,160,${glowIntensity * 0.6})`;
    heartCtx.lineWidth = 2;
    heartCtx.shadowColor = `rgba(232,160,160,${glowIntensity})`;
    heartCtx.shadowBlur = 20 + Math.sin(phase) * 10;
    heartCtx.stroke();
    heartCtx.restore();

    requestAnimationFrame(glow);
  };
  glow();
}

/**
 * Show finale message with fade in
 */
function showFinaleMessage() {
  const msg = document.getElementById('finale-message');
  if (!msg) return;

  msg.style.transition = 'opacity 2s cubic-bezier(0.16,1,0.3,1)';
  msg.style.opacity = '1';

  // Recalculate Lenis scroll bounds for mobile
  resizeLenis();

  // Shimmer stars in background
  spawnFinaleStars();
}

/**
 * Spawn twinkling stars over finale
 */
function spawnFinaleStars() {
  if (!heartCanvas || !heartCtx) return;

  const W = heartCanvas.width;
  const H = heartCanvas.height;
  const finaleStars = Array.from({length: 60}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.03 + 0.01,
  }));

  const renderStars = () => {
    const t = performance.now() * 0.001;
    finaleStars.forEach(s => {
      const flicker = Math.sin(t * s.speed * 20 + s.phase) * 0.4 + 0.6;
      heartCtx.beginPath();
      heartCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      heartCtx.fillStyle = `rgba(248,244,255,${flicker * 0.5})`;
      heartCtx.fill();
    });
    requestAnimationFrame(renderStars);
  };
  renderStars();
}

// ── Helpers ─────────────────────────────────────────────

function loadImagesParallel(mems) {
  return Promise.all(mems.map(mem => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img); // Continue even on error
    img.src = getImagePath(mem.image);
  })));
}

function lerp(a, b, t) { return a + (b - a) * t; }

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
