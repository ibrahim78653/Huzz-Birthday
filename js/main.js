// ============================================================
//  MAIN — App Bootstrapper
// ============================================================

import { distributeMemories, pickHiddenMemories } from './engine/memoryEngine.js';
import { buildAllChapters, populatePinterestBoards } from './engine/chapterBuilder.js';
import { initSmoothScroll, stopSmoothScroll, initScrollProgress, initNavDots, resizeLenis } from './core/scroll.js';
import {
  initLazyLoad, refreshLazyImages, preloadCritical,
  addGPUHints, initScrollReveal, initFilmDragScroll, initParallax
} from './core/performance.js';
import { showLoadingScreen, showEnvelopeIntro, showIntroOverlay, animateMoon, populateIntroText, initMusic } from './chapters/intro.js';
import { initCursor, initGlassReflection, initCardLift } from './interactions/cursor.js';
import { initHiddenMemories, initEnvelopeReveal, initTouchRipple } from './interactions/hidden.js';
import { initFloatingMemories } from './floating/floatingMemories.js';
import { buildFinaleSection, initFinale } from './chapters/finale.js';
import { memories, settings } from '../memories.js';

/**
 * Main app initialization
 */
async function init() {
  // 1. Stop scroll during loading/intro
  stopSmoothScroll();
  document.body.classList.add('no-scroll');

  // 2. Populate intro text from settings
  populateIntroText();

  // 3. Animate loading moon
  animateMoon();

  // 4. Show loading screen
  await showLoadingScreen();

  // 5. Show Envelope Introduction Page (requires password "huzz-loves-umme")
  await showEnvelopeIntro();

  // 6. Show intro overlay (waits for user to click Start Journey)
  await showIntroOverlay();

  // 7. Re-enable scroll
  document.body.classList.remove('no-scroll');

  // 8. Build the story
  await buildStory();
}

/**
 * Build all story content after intro
 */
async function buildStory() {
  const app = document.getElementById('app');
  if (!app) return;

  // Distribute memories across chapters
  const chapters = distributeMemories();
  const hiddenPool = pickHiddenMemories(chapters);

  // Build all chapter DOM
  buildAllChapters(chapters, app, hiddenPool);

  // Build finale
  buildFinaleSection(app);

  // Preload first hero image
  if (memories.length > 0) {
    preloadCritical([`assets/images/${memories[0].image}`]);
  }

  // Initialize all systems (order matters)
  initSmoothScroll();
  initScrollProgress();
  initNavDots(chapters);
  initLazyLoad();
  refreshLazyImages();
  initScrollReveal();
  initParallax();
  initFilmDragScroll();
  addGPUHints();

  // Interactions
  initCursor();
  initGlassReflection();
  initCardLift();
  initHiddenMemories();
  initEnvelopeReveal();
  initTouchRipple();
  initMusic();

  // Delayed systems (after paint)
  requestAnimationFrame(() => {
    populatePinterestBoards();
    refreshLazyImages(); // Re-scan after pinterest builds
    initScrollReveal();   // Re-scan after all DOM is built
    resizeLenis();        // Recalculate full page height for mobile scrolling
  });

  // Floating polaroids (starts after a delay)
  initFloatingMemories();

  // Finale canvas
  initFinale();
}

// Bootstrap
document.addEventListener('DOMContentLoaded', init);
