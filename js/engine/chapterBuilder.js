// ============================================================
//  CHAPTER BUILDER — Generates DOM from memory chapters
// ============================================================

import { LAYOUT_TYPES, getImagePath, getFavoriteMemory } from './memoryEngine.js';
import { settings } from '../../memories.js';

/**
 * Build a lazy-loaded img element
 */
function buildImg(memory, cls = '', attrs = {}) {
  const img = document.createElement('img');
  img.alt = memory.title || 'A beautiful memory';
  img.loading = 'lazy';
  img.decoding = 'async';

  // Use data-src for lazy loading; swap in IntersectionObserver
  img.dataset.src = getImagePath(memory.image);
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E`;
  img.classList.add('lazy-img');
  if (cls) img.classList.add(...cls.split(' '));
  Object.entries(attrs).forEach(([k, v]) => img.setAttribute(k, v));
  return img;
}

/**
 * Section wrapper
 */
function makeSection(id, classList = []) {
  const sec = document.createElement('section');
  sec.id = id;
  sec.classList.add('chapter', ...classList);
  return sec;
}

// ── Layout Builders ──────────────────────────────────────

function buildHeroChapter(chapter) {
  const mem = chapter.memories[0];
  const sec = makeSection(chapter.id, ['chapter-hero-dyn']);
  const titles = settings.chapterTitles;

  sec.innerHTML = `
    <div class="hero-image-wrap parallax-layer" data-parallax-speed="-0.3">
      <div class="img-placeholder" style="width:100%;height:100%;position:absolute;inset:0;"></div>
    </div>
    <div class="hero-overlay"></div>
    <div class="moonlight-overlay"></div>
    <div class="vignette"></div>
    <div class="ambient-orb orb-rose" style="width:500px;height:500px;top:-100px;right:-100px;"></div>
    <div class="hero-content">
      <p class="chapter-label reveal">${titles.hero || 'A Story Worth Telling'}</p>
      <h2 class="hero-title reveal delay-2">${mem.title}</h2>
      <p class="hero-caption t-serif reveal delay-3">${mem.caption}</p>
      ${mem.date ? `<p class="hero-date reveal delay-5">${mem.date}</p>` : ''}
    </div>
  `;

  // Inject the lazy image into the placeholder
  const wrap = sec.querySelector('.hero-image-wrap');
  const img = buildImg(mem, 'hero-img-lazy');
  img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(0.95) brightness(0.65);';
  const ph = wrap.querySelector('.img-placeholder');
  wrap.replaceChild(img, ph);

  // Ken Burns on load
  img.addEventListener('load', () => img.classList.add('ken-burns'));

  return sec;
}

function buildPolaroidsChapter(chapter) {
  const [mem1, mem2] = chapter.memories;
  const sec = makeSection(chapter.id, ['chapter-polaroids-dyn']);
  const rotations = [-5, 3, -2, 6, -4, 2];

  sec.innerHTML = `
    <div class="ambient-orb orb-moon" style="width:400px;height:400px;bottom:-50px;left:-50px;"></div>
    <div class="chapter-content" style="width:100%;display:flex;align-items:center;justify-content:center;padding:5rem 2rem;">
      <div class="polaroids-scene">
        <div class="polaroid reveal-left" style="transform:rotate(${rotations[0]}deg);margin-right:-20px;z-index:2;" id="pol-a">
          <span class="tape" style="--tape-rotate:${rotations[1]}deg;"></span>
          <div class="img-placeholder" style="width:240px;height:240px;"></div>
          <p class="polaroid-caption">${mem1 ? mem1.title : ''}</p>
        </div>

        <div class="polaroid reveal-right" style="transform:rotate(${rotations[2]}deg);margin-left:-20px;z-index:1;margin-top:30px;" id="pol-b">
          <span class="tape" style="--tape-rotate:${rotations[3]}deg;"></span>
          <div class="img-placeholder" style="width:240px;height:240px;"></div>
          <p class="polaroid-caption">${mem2 ? mem2.title : ''}</p>
        </div>

        <div class="polaroids-note reveal delay-5" style="margin-left:40px;transform:rotate(${rotations[4]}deg);">
          <p class="note-text">"${mem1 ? mem1.caption : ''}"</p>
          ${mem2 ? `<p class="note-text" style="margin-top:0.75rem;">"${mem2.caption}"</p>` : ''}
          <p class="note-signature">— Always ♡</p>
        </div>
      </div>
    </div>
  `;

  // Inject images
  if (mem1) {
    const ph1 = sec.querySelector('#pol-a .img-placeholder');
    const img1 = buildImg(mem1, 'polaroid-img');
    img1.style.cssText = 'width:240px;height:240px;';
    ph1.parentNode.replaceChild(img1, ph1);
  }
  if (mem2) {
    const ph2 = sec.querySelector('#pol-b .img-placeholder');
    const img2 = buildImg(mem2, 'polaroid-img');
    img2.style.cssText = 'width:240px;height:240px;';
    ph2.parentNode.replaceChild(img2, ph2);
  }

  return sec;
}

function buildScrapbookChapter(chapter) {
  const mems = chapter.memories.slice(0, 3);
  const sec = makeSection(chapter.id, ['chapter-scrapbook-dyn']);
  const rotations = [-4, 2, -1, 5, -3, 1, 4, -2];

  sec.innerHTML = `
    <div class="chapter-content" style="width:100%;padding:5rem 2rem;">
      <div class="scrap-title-area reveal">
        <p class="chapter-label">Chapter ${chapter.index + 1}</p>
        <h2 class="t-title t-grad-gold" style="margin-top:0.5rem;">Pages of Our Journey</h2>
      </div>

      <div class="scrapbook-layout" style="position:relative;max-width:900px;margin:0 auto;min-height:580px;">
        <!-- Coffee stains -->
        <div class="coffee-stain" style="width:80px;height:80px;top:20px;right:80px;opacity:0.4;"></div>
        <div class="coffee-stain" style="width:50px;height:50px;bottom:40px;left:60px;opacity:0.3;"></div>

        ${mems.map((mem, i) => `
          <div class="scrapbook-img-card reveal${i % 2 === 0 ? '-left' : '-right'} delay-${i + 2}"
               style="
                 position:${i === 0 ? 'relative' : 'absolute'};
                 ${i === 1 ? 'top:80px;right:0;' : ''}
                 ${i === 2 ? 'bottom:0;left:50%;transform:translateX(-50%) rotate('+rotations[i+2]+'deg)!important;' : ''}
                 width:${i === 0 ? '55%' : '42%'};
                 transform:rotate(${rotations[i]}deg);
                 z-index:${3 - i};
               ">
            <div style="background:#fdf8f0;padding:10px 10px 32px;box-shadow:4px 8px 24px rgba(0,0,0,0.5);border-radius:2px;">
              <div class="img-placeholder scrap-ph-${i}" style="width:100%;aspect-ratio:4/3;"></div>
              <p style="font-family:'Dancing Script',cursive;font-size:0.75rem;color:#3a3020;text-align:center;margin-top:6px;">${mem.title}</p>
            </div>
            <span class="tape" style="--tape-rotate:${rotations[i+4]}deg;"></span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Inject images
  mems.forEach((mem, i) => {
    const ph = sec.querySelector(`.scrap-ph-${i}`);
    if (ph) {
      const img = buildImg(mem, 'scrap-img');
      img.style.cssText = 'width:100%;aspect-ratio:4/3;object-fit:cover;filter:sepia(0.15) saturate(0.95);';
      ph.parentNode.replaceChild(img, ph);
    }
  });

  return sec;
}

function buildEnvelopeChapter(chapter) {
  const mem = chapter.memories[0];
  const sec = makeSection(chapter.id, ['chapter-envelope-dyn']);

  sec.innerHTML = `
    <div class="ambient-orb orb-gold" style="width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
    <div class="chapter-content" style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;min-height:100vh;">
      <div class="envelope-intro-text reveal">
        <p class="chapter-label">For You</p>
        <h2 class="t-title t-grad-rose" style="margin-top:0.5rem;">${settings.chapterTitles.envelope}</h2>
        <p class="t-caption t-secondary" style="margin-top:1rem;">Click the seal to open</p>
      </div>

      <div class="envelope-container reveal delay-3" id="envelope-trigger">
        <div class="envelope">
          <div class="envelope-body">
            <div class="envelope-photo-reveal" id="envelope-photo">
              <div class="img-placeholder env-ph" style="width:200px;height:160px;"></div>
            </div>
          </div>
          <div class="envelope-flap"></div>
          <div class="wax-seal" title="Click to open">💌</div>
        </div>
      </div>

      <div class="envelope-caption reveal delay-7" style="text-align:center;margin-top:2rem;opacity:0;transition:opacity 0.8s;" id="envelope-caption">
        <p class="t-caption t-secondary" style="font-size:1rem;">"${mem ? mem.caption : ''}"</p>
        ${mem?.date ? `<p class="t-date" style="margin-top:0.5rem;">${mem.date}</p>` : ''}
      </div>
    </div>
  `;

  // Inject image
  if (mem) {
    const ph = sec.querySelector('.env-ph');
    const img = buildImg(mem, 'env-img');
    img.style.cssText = 'width:200px;height:160px;object-fit:cover;filter:sepia(0.15) saturate(0.95);';
    ph.parentNode.replaceChild(img, ph);
  }

  return sec;
}

function buildGlassChapter(chapter) {
  const mem = chapter.memories[0];
  const sec = makeSection(chapter.id, ['chapter-glass-dyn']);

  sec.innerHTML = `
    <div class="moonlight-overlay"></div>
    <div class="ambient-orb orb-moon" style="width:400px;height:400px;top:-100px;left:50%;transform:translateX(-50%);"></div>
    <div class="chapter-content" style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;min-height:100vh;">
      <div class="glass-caption-above reveal" style="text-align:center;margin-bottom:2rem;">
        <p class="chapter-label">${settings.chapterTitles.glass}</p>
        <h2 class="t-title t-moon" style="margin-top:0.5rem;">${mem ? mem.title : ''}</h2>
      </div>

      <div class="glass-frame-scene reveal-scale delay-3" style="max-width:560px;width:90%;">
        <div class="glass-frame" id="glass-frame-el" style="aspect-ratio:4/3;">
          <div class="glass-frame-reflection" id="glass-reflection"></div>
          <div class="img-placeholder glass-ph" style="width:100%;height:100%;"></div>
        </div>
      </div>

      <div class="glass-caption-below reveal delay-5" style="text-align:center;margin-top:2rem;">
        <p class="t-caption t-secondary" style="font-size:1rem;">"${mem ? mem.caption : ''}"</p>
        ${mem?.date ? `<p class="t-date" style="margin-top:0.5rem;">${mem.date}</p>` : ''}
      </div>
    </div>
  `;

  if (mem) {
    const ph = sec.querySelector('.glass-ph');
    const img = buildImg(mem, 'glass-img');
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(0.95);';
    ph.parentNode.replaceChild(img, ph);
  }

  return sec;
}

function buildFilmChapter(chapter) {
  const mems = chapter.memories;
  const sec = makeSection(chapter.id, ['chapter-film-dyn']);

  const frames = mems.map((mem, i) => `
    <div class="film-frame-slot" id="film-slot-${chapter.index}-${i}">
      <div class="img-placeholder film-ph" data-mem="${i}" style="width:100%;height:100%;"></div>
      <div class="film-grain-overlay"></div>
      <div class="film-scratch" style="left:${20 + Math.random() * 60}%;opacity:${0.05 + Math.random() * 0.1};"></div>
      <div class="film-frame-info">
        <div class="film-frame-number">${String(i + 1).padStart(3, '0')} ▲ ${new Date().getFullYear()}</div>
      </div>
    </div>
  `).join('');

  // Generate perforation holes
  const holeCount = 10;
  const holes = Array.from({length: holeCount}, () => '<div class="film-perf-hole"></div>').join('');

  sec.innerHTML = `
    <div class="film-chapter-title reveal">
      <p class="chapter-label">${settings.chapterTitles.film}</p>
      <h2 class="t-subtitle t-gold" style="margin-top:0.5rem;">Kodak Moments</h2>
    </div>
    <div class="film-strip-wrapper" id="film-strip-${chapter.index}">
      <div class="film-strip-row">
        <div class="film-strip-side">${holes}</div>
        ${frames}
        <div class="film-strip-side right">${holes}</div>
      </div>
    </div>
  `;

  // Inject images
  mems.forEach((mem, i) => {
    const ph = sec.querySelector(`.film-ph[data-mem="${i}"]`);
    if (ph) {
      const img = buildImg(mem, 'film-frame-inner');
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      ph.parentNode.replaceChild(img, ph);
    }
  });

  // Drag to scroll
  sec.addEventListener('DOMContentLoaded', () => initFilmScroll(sec));

  return sec;
}

function buildPinterestChapter(chapter) {
  const mems = chapter.memories;
  const sec = makeSection(chapter.id, ['chapter-pinterest-dyn']);

  sec.innerHTML = `
    <div class="chapter-content" style="width:100%;padding:5rem 2rem;">
      <div class="pinterest-title-area reveal">
        <p class="chapter-label">${settings.chapterTitles.pinterest}</p>
        <h2 class="t-title t-grad-rose" style="margin-top:0.5rem;">Our Gallery of Joy</h2>
      </div>
      <div class="pinterest-board" id="pinterest-board-${chapter.index}" style="min-height:700px;position:relative;max-width:1100px;margin:0 auto;">
      </div>
    </div>
  `;

  // We'll populate the board after DOM insertion (needs dimensions)
  sec.dataset.pinterestChapter = chapter.index;
  sec.dataset.pinterestMems = JSON.stringify(mems.map(m => ({
    image: m.image,
    title: m.title,
    caption: m.caption,
  })));

  return sec;
}

function buildFavoriteChapter(chapter) {
  const mem = getFavoriteMemory();
  const sec = makeSection(chapter.id, ['chapter-favorite-dyn']);

  sec.innerHTML = `
    <div class="favorite-image-wrap parallax-layer" data-parallax-speed="-0.2">
      <div class="img-placeholder fav-ph" style="width:100%;height:100%;position:absolute;inset:0;"></div>
    </div>
    <div class="hero-overlay"></div>
    <div class="moonlight-overlay"></div>
    <div class="vignette"></div>
    <div class="favorite-content">
      <p class="chapter-label reveal t-gold">${settings.chapterTitles.favorite}</p>
      <h2 class="t-title t-moon reveal delay-2" style="font-size:clamp(2rem,6vw,4rem);font-style:italic;">${mem.title}</h2>
      <p class="t-caption t-secondary reveal delay-3" style="font-size:1.1rem;margin-top:1rem;">"${mem.caption}"</p>
    </div>
  `;

  const ph = sec.querySelector('.fav-ph');
  const img = buildImg(mem, 'fav-img');
  img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(0.95) brightness(0.55);transform:scale(1.08);transition:transform 20s linear;';
  ph.parentNode.replaceChild(img, ph);

  return sec;
}

function buildTimelineChapter(chapter) {
  const mems = chapter.memories;
  const sec = makeSection(chapter.id, ['chapter-timeline-dyn']);

  const items = mems.map((mem, i) => `
    <div class="timeline-item" style="position:relative;">
      <div class="timeline-dot" style="flex-shrink:0;"></div>

      <div class="timeline-photo reveal${i % 2 === 0 ? '-left' : '-right'} delay-${i + 1}">
        <div class="img-placeholder tl-ph-${chapter.index}-${i}" style="width:100%;height:240px;"></div>
      </div>

      <div class="timeline-text reveal delay-${i + 2}">
        <h3 class="timeline-title-text">${mem.title}</h3>
        <p class="timeline-caption">"${mem.caption}"</p>
        ${mem.date ? `<p class="timeline-date">${mem.date}</p>` : ''}
      </div>
    </div>
  `).join('');

  sec.innerHTML = `
    <div class="chapter-content" style="width:100%;padding:5rem 2rem;">
      <div class="timeline-title-area reveal">
        <p class="chapter-label">${settings.chapterTitles.timeline}</p>
        <h2 class="t-title t-grad-moon" style="margin-top:0.5rem;">Our Journey Together</h2>
      </div>
      <div class="timeline">
        ${items}
      </div>
    </div>
  `;

  mems.forEach((mem, i) => {
    const ph = sec.querySelector(`.tl-ph-${chapter.index}-${i}`);
    if (ph) {
      const img = buildImg(mem, 'timeline-photo-img');
      img.style.cssText = 'width:100%;height:240px;object-fit:cover;filter:sepia(0.15) saturate(0.95);transition:filter 0.4s,transform 0.4s;';
      ph.parentNode.replaceChild(img, ph);
    }
  });

  return sec;
}

function buildHiddenChapter(chapter, hiddenPool) {
  const sec = makeSection(chapter.id, ['chapter-hidden-dyn']);
  const objects = ['🌙', '⭐', '🌸', '💝', '🎁', '✨', '🌹', '🦋'];
  const mems = chapter.memories.concat(hiddenPool || []);

  sec.innerHTML = `
    <div class="ambient-orb orb-moon" style="width:500px;height:500px;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
    <div class="chapter-content" style="width:100%;text-align:center;padding:5rem 2rem;min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div class="hidden-title-area reveal">
        <p class="chapter-label">${settings.chapterTitles.hidden}</p>
        <h2 class="t-title t-grad-moon" style="margin-top:0.5rem;">Hidden Treasures</h2>
        <p class="t-caption t-secondary" style="margin-top:1rem;">Click each symbol to unveil a secret memory</p>
      </div>
      <div class="hidden-objects" style="margin-top:3rem;">
        ${mems.slice(0, 6).map((mem, i) => `
          <div class="hidden-object" data-mem-image="${getImagePath(mem.image)}" data-mem-title="${mem.title}" data-mem-caption="${mem.caption}">
            ${objects[i % objects.length]}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return sec;
}

// ── Main Chapter Build Function ──────────────────────────

const BUILDERS = {
  [LAYOUT_TYPES.HERO]:        buildHeroChapter,
  [LAYOUT_TYPES.POLAROIDS]:   buildPolaroidsChapter,
  [LAYOUT_TYPES.SCRAPBOOK]:   buildScrapbookChapter,
  [LAYOUT_TYPES.ENVELOPE]:    buildEnvelopeChapter,
  [LAYOUT_TYPES.GLASS_FRAME]: buildGlassChapter,
  [LAYOUT_TYPES.FILM_STRIP]:  buildFilmChapter,
  [LAYOUT_TYPES.PINTEREST]:   buildPinterestChapter,
  [LAYOUT_TYPES.FAVORITE]:    buildFavoriteChapter,
  [LAYOUT_TYPES.TIMELINE]:    buildTimelineChapter,
  [LAYOUT_TYPES.HIDDEN]:      buildHiddenChapter,
};

/**
 * Build all chapter DOM elements and inject them into container
 */
export function buildAllChapters(chapters, container, hiddenPool) {
  chapters.forEach(chapter => {
    const builder = BUILDERS[chapter.type];
    if (!builder) return;

    const el = builder(chapter, hiddenPool);
    container.appendChild(el);

    // Add divider between chapters (except last)
    if (chapter.index < chapters.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'section-divider';
      divider.innerHTML = `<span class="section-divider-icon">✦</span>`;
      container.appendChild(divider);
    }
  });
}

/**
 * Populate Pinterest boards (called after DOM insertion)
 */
export function populatePinterestBoards() {
  document.querySelectorAll('[data-pinterest-chapter]').forEach(sec => {
    const board = sec.querySelector(`#pinterest-board-${sec.dataset.pinterestChapter}`);
    if (!board) return;

    const mems = JSON.parse(sec.dataset.pinterestMems || '[]');
    const boardWidth = board.offsetWidth || window.innerWidth - 64;
    const columns = boardWidth > 800 ? 4 : boardWidth > 500 ? 3 : 2;
    const colWidth = Math.floor(boardWidth / columns);
    const gutter = 16;
    const colHeights = Array(columns).fill(40);

    const ratios = [1, 1.5, 0.75, 1.25, 0.85, 1.6, 1, 1.3];

    mems.forEach((mem, i) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const ratio = ratios[i % ratios.length];
      const w = colWidth - gutter;
      const h = Math.round(w * ratio);

      const pin = document.createElement('div');
      pin.className = 'pinterest-pin reveal-scale';
      pin.style.cssText = `
        left: ${col * colWidth + gutter / 2}px;
        top: ${colHeights[col]}px;
        width: ${w}px;
        height: ${h}px;
        transform: rotate(${(Math.random() - 0.5) * 2}deg);
      `;

      const img = document.createElement('img');
      img.alt = mem.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.dataset.src = getImagePath(mem.image);
      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E`;
      img.className = 'lazy-img';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:sepia(0.15) saturate(0.95);transition:filter 0.3s;';
      pin.appendChild(img);

      if (mem.caption) {
        const cap = document.createElement('div');
        cap.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:1rem 0.75rem 0.75rem;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);';
        cap.innerHTML = `<p style="font-family:'Dancing Script',cursive;font-size:0.75rem;color:#fff;line-height:1.3;">${mem.caption}</p>`;
        pin.appendChild(cap);
      }

      board.appendChild(pin);
      colHeights[col] += h + gutter;
    });

    board.style.height = Math.max(...colHeights) + 'px';
  });
}
