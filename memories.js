// ============================================================
//  MEMORIES CONFIGURATION — Edit Only This File
// ============================================================
//  Instructions:
//  1. Place images in assets/images/ named 001.jpg, 002.jpg...
//  2. Edit this array to match your images
//  3. Supported formats: JPG, JPEG, PNG, WEBP
// ============================================================

export const memories = [
  {
    image: "photo3.jpeg",
    title: "On Top of the World",
    caption: "Standing at the edge of everything, and still the best view was right next to me.",
    date: "",
    favorite: true
  },
  {
    image: "photo1.jpeg",
    title: "Us, Always Laughing",
    caption: "Some moments need no filter — just two people who can't stop smiling around each other.",
    date: ""
  },
  {
    image: "photo4.jpeg",
    title: "Café Chronicles",
    caption: "Mirror selfies and stolen moments. This is what beautiful days look like.",
    date: ""
  },
  {
    image: "photo2.jpeg",
    title: "Blessed Nights",
    caption: "The city lights had nothing on that smile. Some nights just feel different.",
    date: ""
  },
  {
    image: "photo3.jpeg",
    title: "Above the Clouds",
    caption: "Adventures taste better when shared. Thank you for being my favorite person to explore with.",
    date: ""
  },
  {
    image: "photo4.jpeg",
    title: "Just the Two of Us",
    caption: "Quiet places, loud laughter, and a million memories in between.",
    date: ""
  }
];

// ── Personalization Settings ─────────────────────────────
export const settings = {
  // Person's name (used in finale and intro)
  name: "Bubuuuu",

  // Relationship label shown in intro
  from: "With all my love",

  // Final message shown in the grand finale
  finaleMessage: "Every picture here is a little piece of us. Thank you for filling my life with so many beautiful memories.",

  // Birthday greeting
  birthdayGreeting: "Happy Birthday",

  // Subtitle shown in the intro
  introSubtitle: "A journey worth remembering",

  // Chapter subtitles (optional, customize per chapter)
  chapterTitles: {
    hero:      "The Story of Us",
    polaroids: "Captured Moments",
    scrapbook: "Pages of Our Journey",
    envelope:  "A Letter to You",
    glass:     "A Cherished Memory",
    film:      "Our Kodak Moments",
    pinterest: "Our Gallery of Joy",
    favorite:  "My Favorite Memory",
    timeline:  "Milestones",
    hidden:    "Secret Discoveries",
  },

  // Enable/disable features
  features: {
    floatingPolaroids: true,   // Occasional drifting polaroid
    customCursor: true,         // Custom cursor on desktop
    filmGrain: true,            // Subtle film grain overlay
    scrollProgress: true,       // Top progress bar
    navDots: true,              // Right side nav dots
    pageTransitions: true,      // Page turn transitions
    hiddenMemories: true,       // Hidden clickable objects
    parallax: true,             // Scroll parallax
    music: false,               // Set to true if you add music.mp3 to assets/audio/
  }
};
