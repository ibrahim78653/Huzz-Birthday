// ============================================================
//  FLOATING MEMORIES — Drifting polaroids across screen
// ============================================================

import { memories, settings } from '../../memories.js';
import { getImagePath } from '../engine/memoryEngine.js';

let floatingActive = true;
let floatingTimer = null;

/**
 * Spawn a drifting polaroid across the screen
 */
function spawnFloatingPolaroid() {
  if (!floatingActive || !settings.features.floatingPolaroids) return;
  if (document.hidden) return; // Don't spawn when tab not visible

  const mem = memories[Math.floor(Math.random() * memories.length)];
  if (!mem) return;

  const polaroid = document.createElement('div');
  polaroid.className = 'floating-polaroid';

  const topPercent = 15 + Math.random() * 60; // 15% to 75% from top
  const rotation   = (Math.random() - 0.5) * 12; // -6 to +6 deg
  const duration   = 16 + Math.random() * 10;    // 16-26s crossing time

  polaroid.style.cssText = `
    --drift-top: ${topPercent}%;
    --drift-y-val: ${(Math.random() - 0.5) * 30}px;
    --drift-r-val: ${rotation}deg;
    --drift-dur: ${duration}s;
  `;

  polaroid.innerHTML = `
    <div style="
      background: #f8f5ee;
      padding: 8px 8px 24px;
      box-shadow: 4px 8px 24px rgba(0,0,0,0.4);
      transform: rotate(${rotation}deg);
    ">
      <img
        src="${getImagePath(mem.image)}"
        alt="${mem.title}"
        style="width:160px;height:160px;object-fit:cover;display:block;filter:sepia(0.2) saturate(0.9);"
        loading="eager"
      />
      <p style="
        font-family:'Dancing Script',cursive;
        font-size:0.65rem;
        color:#3a3020;
        text-align:center;
        margin-top:4px;
        line-height:1.2;
      ">${mem.title}</p>
    </div>
  `;

  document.body.appendChild(polaroid);

  // Remove after animation completes
  setTimeout(() => {
    polaroid.remove();
  }, (duration + 1) * 1000);
}

/**
 * Start the floating polaroid system with random intervals
 */
export function initFloatingMemories() {
  if (!settings.features.floatingPolaroids) return;
  if (memories.length === 0) return;

  // Initial delay before first one appears
  const initialDelay = 8000 + Math.random() * 5000; // 8-13s after load

  const scheduleNext = () => {
    const interval = 18000 + Math.random() * 20000; // Every 18-38s
    floatingTimer = setTimeout(() => {
      spawnFloatingPolaroid();
      scheduleNext();
    }, interval);
  };

  floatingTimer = setTimeout(() => {
    spawnFloatingPolaroid();
    scheduleNext();
  }, initialDelay);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    floatingActive = !document.hidden;
  });
}

/**
 * Stop floating memories
 */
export function stopFloatingMemories() {
  floatingActive = false;
  if (floatingTimer) {
    clearTimeout(floatingTimer);
    floatingTimer = null;
  }
  document.querySelectorAll('.floating-polaroid').forEach(p => p.remove());
}
