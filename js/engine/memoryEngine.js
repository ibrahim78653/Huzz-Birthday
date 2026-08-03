// ============================================================
//  MEMORY ENGINE — Intelligent Memory Distribution
// ============================================================

import { memories, settings } from '../../memories.js';

/**
 * Layout templates that can be assigned to chapters.
 * The engine rotates through these ensuring no repetition.
 */
export const LAYOUT_TYPES = {
  HERO:         'hero',
  POLAROIDS:    'polaroids',
  SCRAPBOOK:    'scrapbook',
  ENVELOPE:     'envelope',
  GLASS_FRAME:  'glass',
  FILM_STRIP:   'film',
  PINTEREST:    'pinterest',
  FAVORITE:     'favorite',
  TIMELINE:     'timeline',
  HIDDEN:       'hidden',
};

/**
 * Minimum images required per layout type
 */
const LAYOUT_REQUIREMENTS = {
  [LAYOUT_TYPES.HERO]:        1,
  [LAYOUT_TYPES.POLAROIDS]:   2,
  [LAYOUT_TYPES.SCRAPBOOK]:   3,
  [LAYOUT_TYPES.ENVELOPE]:    1,
  [LAYOUT_TYPES.GLASS_FRAME]: 1,
  [LAYOUT_TYPES.FILM_STRIP]:  4,
  [LAYOUT_TYPES.PINTEREST]:   4,
  [LAYOUT_TYPES.FAVORITE]:    1,
  [LAYOUT_TYPES.TIMELINE]:    2,
  [LAYOUT_TYPES.HIDDEN]:      1,
};

/**
 * Maximum images consumed per layout type
 */
const LAYOUT_CAPACITY = {
  [LAYOUT_TYPES.HERO]:        1,
  [LAYOUT_TYPES.POLAROIDS]:   2,
  [LAYOUT_TYPES.SCRAPBOOK]:   3,
  [LAYOUT_TYPES.ENVELOPE]:    1,
  [LAYOUT_TYPES.GLASS_FRAME]: 1,
  [LAYOUT_TYPES.FILM_STRIP]:  8,
  [LAYOUT_TYPES.PINTEREST]:   12,
  [LAYOUT_TYPES.FAVORITE]:    1,
  [LAYOUT_TYPES.TIMELINE]:    6,
  [LAYOUT_TYPES.HIDDEN]:      5,
};

/**
 * The cinematic sequence order for the first pass.
 * This ensures the narrative arc stays intact.
 */
const NARRATIVE_SEQUENCE = [
  LAYOUT_TYPES.HERO,
  LAYOUT_TYPES.POLAROIDS,
  LAYOUT_TYPES.SCRAPBOOK,
  LAYOUT_TYPES.ENVELOPE,
  LAYOUT_TYPES.GLASS_FRAME,
  LAYOUT_TYPES.FILM_STRIP,
  LAYOUT_TYPES.PINTEREST,
  LAYOUT_TYPES.FAVORITE,
  LAYOUT_TYPES.TIMELINE,
  LAYOUT_TYPES.HIDDEN,
];

/**
 * Extended layouts for when we have more images.
 * Rotated to avoid repetition.
 */
const EXTENSION_SEQUENCE = [
  LAYOUT_TYPES.FILM_STRIP,
  LAYOUT_TYPES.SCRAPBOOK,
  LAYOUT_TYPES.POLAROIDS,
  LAYOUT_TYPES.PINTEREST,
  LAYOUT_TYPES.TIMELINE,
  LAYOUT_TYPES.GLASS_FRAME,
  LAYOUT_TYPES.SCRAPBOOK,
  LAYOUT_TYPES.FILM_STRIP,
];

/**
 * Distributes memories across chapters intelligently.
 * @returns {Array} chapters - Array of {type, memories[]} objects
 */
export function distributeMemories() {
  const total = memories.length;
  const chapters = [];
  let pool = [...memories]; // Remaining memories to assign
  let sequenceIndex = 0;
  let extIndex = 0;
  let usedSequence = false;

  // Phase 1: Walk through narrative sequence
  while (pool.length > 0 && sequenceIndex < NARRATIVE_SEQUENCE.length) {
    const layoutType = NARRATIVE_SEQUENCE[sequenceIndex];
    const required = LAYOUT_REQUIREMENTS[layoutType];
    const capacity = LAYOUT_CAPACITY[layoutType];

    // Skip if not enough memories for this layout
    if (pool.length < required) {
      sequenceIndex++;
      continue;
    }

    // Take what we can (up to capacity)
    const take = Math.min(capacity, pool.length);
    const chunk = pool.splice(0, take);

    chapters.push({
      id: `chapter-${layoutType}-${chapters.length}`,
      type: layoutType,
      memories: chunk,
      isNarrative: true,
      index: chapters.length,
    });

    sequenceIndex++;
    usedSequence = true;
  }

  // Phase 2: If memories remain, cycle through extension layouts
  let extRotation = [...EXTENSION_SEQUENCE];
  let extPass = 0;

  while (pool.length > 0) {
    if (extRotation.length === 0) {
      // Re-shuffle extension sequence for another pass
      extPass++;
      extRotation = shuffleArray([...EXTENSION_SEQUENCE]);
    }

    const layoutType = extRotation.shift();
    const required = LAYOUT_REQUIREMENTS[layoutType];
    const capacity = LAYOUT_CAPACITY[layoutType];

    if (pool.length < required) continue;

    const take = Math.min(capacity, pool.length);
    const chunk = pool.splice(0, take);

    chapters.push({
      id: `chapter-${layoutType}-${chapters.length}`,
      type: layoutType,
      memories: chunk,
      isNarrative: false,
      index: chapters.length,
      extPass,
    });
  }

  return chapters;
}

/**
 * Shuffle array using Fisher-Yates
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a subset of memories for hidden reveals
 */
export function pickHiddenMemories(chapters) {
  // Find memories not used in dedicated hidden chapter
  const allUsed = new Set();
  const hiddenChapter = chapters.find(c => c.type === LAYOUT_TYPES.HIDDEN);
  if (hiddenChapter) {
    hiddenChapter.memories.forEach(m => allUsed.add(m.image));
  }

  // Get spare memories from larger chapters for hidden spots
  const spares = [];
  chapters.forEach(c => {
    if (c.type === LAYOUT_TYPES.FILM_STRIP && c.memories.length > 4) {
      spares.push(...c.memories.slice(4, 6));
    }
    if (c.type === LAYOUT_TYPES.PINTEREST && c.memories.length > 6) {
      spares.push(...c.memories.slice(6, 8));
    }
  });

  return spares.slice(0, 5);
}

/**
 * Get image path helper
 */
export function getImagePath(filename) {
  return `assets/images/${filename}`;
}

/**
 * Returns the favorite memory (last one in the array by default,
 * or can be overridden by marking a memory with favorite: true)
 */
export function getFavoriteMemory() {
  const marked = memories.find(m => m.favorite === true);
  return marked || memories[Math.floor(memories.length / 2)] || memories[0];
}

/**
 * Get memories for the finale (all of them)
 */
export function getFinaleMemories() {
  return memories;
}

export { memories, settings };
