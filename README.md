# 🎂 Huzz Birthday — Ultra-Premium Cinematic Birthday Experience

A luxury, handcrafted birthday website that feels like an emotional cinematic storybook.

---

## ✨ How to Personalize

### Step 1 — Add Your Photos

Place your photos inside `assets/images/` using sequential numbering:

```
assets/images/
  001.jpg
  002.jpg
  003.jpg
  004.jpg
  ...
```

**Supported formats:** JPG, JPEG, PNG, WEBP

### Step 2 — Edit `memories.js`

This is the **only file you ever need to edit** to personalize the site.

```js
export const memories = [
  {
    image: "001.jpg",
    title: "The Beginning",
    caption: "The day everything became beautiful.",
    date: "January 2023"    // optional
    // favorite: true       // optional — marks this as the 'favorite memory' chapter
  },
  {
    image: "002.jpg",
    title: "Our Favorite Place",
    caption: "Still feels like yesterday."
  },
  // ... add as many as you want
];

export const settings = {
  name: "Bubuuuu",          // ← Change this!
  from: "With all my love", // ← Shown in intro
  birthdayGreeting: "Happy Birthday",
  finaleMessage: "Every picture here is a little piece of us...",
  introSubtitle: "A journey worth remembering",
  // ... customize chapter titles, toggle features, etc.
};
```

### Step 3 — Open in Browser

Because this is a 100% static site, you can:

- **Locally:** Open `index.html` via a local server (VS Code Live Server, or `npx serve .`)
- **Deploy:** Upload to GitHub Pages, Netlify, or Vercel — zero configuration needed

> ⚠️ **Note:** Due to ES Module imports (`type="module"`), you must open via a local server, not directly as a `file://` URL. Use VS Code Live Server or run `npx serve .` in the project folder.

---

## 🎬 What's Inside

| Chapter | Layout | Description |
|---------|--------|-------------|
| 1 | Cinematic Hero | Full-bleed image with slow Ken Burns zoom |
| 2 | Pinned Polaroids | Two polaroids with masking tape + handwritten note |
| 3 | Luxury Scrapbook | Three overlapping vintage photos on paper |
| 4 | Envelope Reveal | Animated envelope that opens on click |
| 5 | Glass Frame | Cursor-tracked glass reflection effect |
| 6 | Kodak Film Strip | Horizontal draggable film roll |
| 7 | Pinterest Board | Masonry photo wall |
| 8 | Favorite Memory | Fullscreen cinematic photo |
| 9 | Memory Timeline | Vertical timeline with heartbeat dots |
| 10 | Hidden Memories | Symbols that reveal secret photos on click |
| Finale | Heart Assembly | All photos assemble into an animated heart |

---

## 📸 Image Tips

- **Minimum:** 3–5 photos (enough for a beautiful experience)
- **Optimal:** 15–30 photos (full cinematic story)
- **Maximum:** Unlimited (engine scales automatically)
- **Aspect ratio:** Any — the engine handles cropping
- **Resolution:** 800×800px minimum recommended

---

## 🚀 Deployment

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
# Enable GitHub Pages in repo settings → Pages → main branch
```

### Netlify / Vercel
Drag and drop the project folder — it deploys automatically.

---

## 🛠 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, keyframes, glassmorphism
- **JavaScript ES6+** — Modules, IntersectionObserver, Canvas API
- **GSAP 3** — Premium animations (loaded via CDN)
- **Lenis** — Ultra-smooth scroll (loaded via CDN)
- **Google Fonts** — Cormorant Garamond, Dancing Script, Inter, Playfair Display

**No build step. No Node. No backend. Just static files.**

---

## 📁 Project Structure

```
Huzz Birthday/
├── index.html          ← Entry point
├── memories.js         ← ONLY file you need to edit
├── assets/
│   └── images/         ← Place your photos here (001.jpg, 002.jpg...)
│   └── audio/          ← Optional: add music.mp3
├── css/
│   ├── tokens.css      ← Design system tokens
│   ├── typography.css  ← Font system
│   ├── animations.css  ← All keyframes
│   ├── components.css  ← UI components
│   └── main.css        ← Root stylesheet
└── js/
    ├── main.js          ← App bootstrapper
    ├── memories.js      ← Config (symlinked)
    ├── engine/
    │   ├── memoryEngine.js    ← Distribution logic
    │   └── chapterBuilder.js  ← DOM generation
    ├── core/
    │   ├── scroll.js          ← Lenis integration
    │   └── performance.js     ← Lazy load, parallax
    ├── chapters/
    │   ├── intro.js           ← Loading + opening
    │   └── finale.js          ← Heart assembly
    ├── interactions/
    │   ├── cursor.js          ← Custom cursor
    │   └── hidden.js          ← Reveal interactions
    └── floating/
        └── floatingMemories.js ← Drifting polaroids
```

---

Made with ❤️ — *Every memory deserves to be a masterpiece.*
