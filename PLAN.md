# GDG ViMEET 2026–27 Website Relaunch — Implementation Plan

> **Launch window:** ~2 days
> **Working directory:** `C:\Users\RUSHIKESH\Desktop\GDG\GDG_Vimeet`

---

## 1. Project Summary

**GDG ViMEET** is a React 19 + Vite 6 single-page website for the Google Developer Groups chapter at Vishwaniketan Institute of Management, Entrepreneurship & Engineering Technology (ViMEET).

**Current state:** GTA 6 / BMW M-Sport themed landing page.
**Target state:** Official GDG ViMEET 2026–27 website — **Google/GDG identity primary, cinematic/editorial influence secondary.**

### Tech Stack (preserved)
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19 |
| Build/Dev | Vite | 6.3.5 |
| Styling | Tailwind CSS | 4.1.10 |
| Animation (cinematic) | GSAP + ScrollTrigger + @gsap/react | 3.13.0 |
| Animation (UI/micro) | Anime.js | 4.5.0 |
| Routing | react-router-dom | 6.30.1 |
| Responsive | react-responsive | 10.0.1 |
| Storage | localStorage + Google Sheets webhook | — |

### Route Map
| Route | Component | Status |
|-------|-----------|--------|
| `/` | `App.jsx` | Redesign in progress |
| `/team` | `Team.jsx` | Redesign planned |
| `/events` | `Events.jsx` | Redesign planned |
| `/contact` | `Contact.jsx` | Redesign planned |
| `/join` | `Recruitment.jsx` | Update planned |
| `/recruitment` | `Recruitment.jsx` | Same component |
| `/admin/applications` | `ApplicationsAdmin.jsx` | Keep working |

---

## 2. Completed Work ✅

### Phase 1: Repository Cleanup
| Task | Details |
|------|---------|
| Delete dead components | Removed `src/sections/Jason.jsx`, `src/sections/SecondVideo.jsx`, `src/sections/Outro.jsx` (zero imports) |
| Remove video preload | Removed `<link rel="preload" href="/videos/output1.mp4">` from `index.html` |
| Delete unreferenced videos | Removed `output1.mp4`, `output3.mp4`, `m5new.mp4`, `bmwvideo.mp4` (~20 MB freed). Kept `herovideo.mp4`, `newbmw.mp4` (used by Hero). |
| Fix `py-50` | Changed to `py-20` in `App.jsx:45` (invalid Tailwind utility — generated no CSS) |
| Remove stale comments | Removed "Outro removed per request" comments from `App.jsx` |
| Optimize image | Converted `lucia-1.png` (13 MB) → `lucia-1.webp` (1.09 MB, quality 82). Updated reference in `Lucia.jsx:23`. |
| Clean Loader | Removed stray empty `<div>` in `Loader.jsx` |
| Lint result | `npm run lint` — 0 errors |

### Phase 3: Anime.js Setup
| Task | Details |
|------|---------|
| Install anime.js | `npm install animejs@4.5.0` — added to `package.json` |
| Create animation utilities | `src/animations/` with `textAnimations.js`, `cardAnimations.js`, `interactionAnimations.js`, `index.js` |
| Animation functions | `animateTextReveal`, `animateHeading`, `animateStaggerItems`, `animateCards`, `animateCardHover/InOut`, `animateNavItem/InOut`, `animateButtonHover/InOut`, `animateMobileMenuOpen/Close`, `animateStaggerMenuItems` |
| Reduced motion support | All functions check `prefers-reduced-motion` |
| Graceful fallback | Dynamic `import('animejs')` with try-catch fallback |
| Lint result | `npm run lint` — 0 errors |
| Build result | `npm run build` — passed |

---

## 3. Remaining Work 📋

### Phase 2: Centralized Data Files (Pending — blocked by agent issue, will do now)
Create `src/data/` with:
- `site.js` — site config, social links, contact info, recruitment URL placeholder
- `navigation.js` — nav items (Home, About, Teams, Events, Contact, Join Us)
- `events.js` — upcoming + past events data, socialPosts placeholders
- `team.js` — 2025-26 previous tenure team data (extracted from Team.jsx)
- `recruitment.js` — 5 official teams with descriptions

### Phase 4: Design System Redesign (Pending)
- **Fonts**: Replace Audiowide/Righteous → Space Grotesk (display) + DM Sans (body) via Google Fonts
- **Colors**: Google palette (#4285F4, #EA4335, #FBBC05, #34A835) + neutrals
- **CSS variables**: In `@theme`, plus color utility classes
- **Primitives**: `.btn-primary`, `.btn-secondary`, `.card`, `.section`, `.container`, `.gradient-text-google`
- **Backgrounds**: `.bg-dark-cinematic` (dark) + `.bg-light` (white/light content sections)
- **Remove**: old GTA/BMW CSS classes (`.bmw-text`, `.gta-text`, `.mask-wrapper`, `.jason`, `.lucia-*`, `.post-card`, `.first-vd`, `.trailer-logo`, `.entrance-message`, `.final-message`)
- **Update**: `.loader`/`.gdg-text` for new brand
- **Update**: `Loader.jsx` text → "GDG ViMEET 2026-27"
- **Global**: `prefers-reduced-motion` support

### Phase 5: Navbar Redesign
- Logo + nav links: HOME, ABOUT, TEAMS, EVENTS, CONTACT, JOIN US
- Mobile drawer menu with Anime.js stagger
- Active route indicator
- Prominent "Join Us" CTA
- Sticky/fixed positioning

### Phase 6: Hero Redesign
- "GDG ViMEET 2026–27"
- Main headline: "BUILD. CREATE. CONNECT. GO BEYOND."
- Supporting copy: community of developers, designers, creators, innovators
- CTAs: "EXPLORE GDG" (links to /about) and "JOIN US" (links to /join)
- Preserve GSAP cinematic scroll/mask animation
- Anime.js for secondary UI: headline reveal, subtitle, CTA entrance

### Phase 7: About + Go Beyond Code
- **About section**: "More Than A Coding Community" — technology, learning, creativity, leadership, collaboration, innovation, community, networking
- **Go Beyond Code section**: 12 category cards (Technology, AI, Web & App Dev, Cloud, Design, Graphics, Content & Social, PR & Outreach, Events, Entrepreneurship, Community, Innovation)
- Anime.js for heading reveal + card stagger

### Phase 8: Events + Social Sections
- **Events**: Data-driven from `events.js`; category filter; impact stats; remove Free Fire entirely
- **Social**: Replace invalid Instagram iframe with clean post grid; "LATEST FROM GDG VIMEET" + "FOLLOW THE JOURNEY"; Follow buttons for Instagram + LinkedIn
- Anime.js for grid entrance + stagger + hover

### Phase 9: Join Us + Footer
- **Join Us**: Homepage section — "JOIN THE NEXT CHAPTER" + "Don't just attend events. Be part of the team that creates them." + CTA "APPLY FOR 2026-27"
- **Footer**: GDG ViMEET + tagline + nav + social links + institute name + 2026-27
- Anime.js for subtle reveal

### Phase 10: Team Page Redesign
- **Top**: "2026–27 RECRUITMENT" — team cards for 5 official teams + "APPLY NOW" button → config form URL
- **Bottom**: "PREVIOUS TENURE — 2025–26 LEADERSHIP & TEAM" — existing team data (clearly labeled as previous)
- Breadcrumb navigation

### Phase 11: Recruitment Page Update
- Keep existing functional form (localStorage + webhook backend)
- Update all copy to 2026–27
- Update team names to official list (Technical, Graphics & Design, Content & Social Media, PR & Outreach, Event Management)
- Graphics team challenge: Ganesh Chaturthi poster → replace with neutral placeholder or keep if culturally appropriate
- Validate form fields
- Make form URL configurable from `site.js`

### Phase 12: Contact Page Redesign
- "LET'S CONNECT." structure
- Contact reasons: questions, collaborations, workshops, community, partnerships, recruitment
- Email, Instagram, LinkedIn, Location/Map
- Remove personal phone numbers (no PII)
- Data from `site.js`
- Modern card layout

### Phase 13: Performance & Accessibility
- Lazy-load non-critical images
- Image optimization (WebP, proper sizing)
- Font loading optimization
- `prefers-reduced-motion` support across all components
- Alt text, semantic headings, focus states, contrast
- Mobile viewport test: 375/390/414/768/1024/1440px

### Phase 14: Final Validation
- `npm run lint` — 0 errors
- `npm run build` — passes
- Test all routes: `/`, `/team`, `/events`, `/contact`, `/join`, `/recruitment`, `/admin/applications`
- Responsive audit
- Accessibility audit

---

## 4. Animation Responsibility Policy

| Library | Used For |
|---------|----------|
| **GSAP** | Hero cinematic animations, mask reveals, ScrollTrigger, pinned sections, complex timelines, scroll-driven animations |
| **Anime.js** | Text entrance/reveal, heading animations, staggered cards, nav/menu interactions, micro-interactions, CTA animations, button hover |
| **Conflict rule** | Never let both libraries control the same property on the same element simultaneously |

---

## 5. Content Rules (Strict)

### ✅ DO Create:
- Configurable placeholder structures for events, social posts, recruitment form URL
- Clean data files where missing content can be easily replaced

### ❌ DO NOT Invent:
- Team members (beyond existing 2025-26 data)
- Event dates/titles (use placeholders)
- Sponsors
- Phone numbers (remove existing ones)
- Registration URLs (use placeholder)
- Social URLs (use verified existing ones only)
- Google Form URLs (use placeholder)
- Statistics (beyond existing data)

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| 2-day deadline | Prioritize: Homepage → Navbar → Hero → About → Join Us → Footer | Keep working pages functional; defer polish |
| Large bundle | Limit videos to essential ones; lazy-load images; code-split heavy animations |
| Mobile perf | Defer non-critical animations; test 375px viewport early |
| Recruitment form | Keep existing localStorage + webhook system (it works) |
| Font loading | Use `font-display: swap`; preload critical fonts |
| Anime.js dynamic import | Fallback if library fails to load — content still renders |

---

## 7. Validation Criteria

```
npm run lint   → 0 errors
npm run build  → exits 0, emits dist/
npm run dev    → starts at http://localhost:5173
```

All routes must render without console errors. No broken images. No missing references. Mobile-responsive. Respects `prefers-reduced-motion`.

---

## 8. Quick Start (for teammates)

```bash
cd C:\Users\RUSHIKESH\Desktop\GDG\GDG_Vimeet
npm install        # install dependencies (if needed)
npm run dev        # start dev server
npm run build      # production build
npm run lint       # lint
npm run preview    # preview production build
```
