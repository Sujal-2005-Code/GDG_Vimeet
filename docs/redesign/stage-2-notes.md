# Stage 2 — Foundation, NavBar, Hero, 2.5D engine

Branch `redesign/ui-v2`. Screenshots and the raw verification report are in [`stage-2/`](stage-2/).

## What shipped

| Area | Files |
|---|---|
| Design tokens, fluid type, accessible colours, base styles | `src/index.css` |
| Old dark/BMW styles, **scoped** so untouched pages look identical | `src/styles/legacy.css` (deleted in Stage 5) |
| Self-hosted Inter + JetBrains Mono (OFL), metric-matched fallback | `public/fonts/*.woff2`, `index.html` preload |
| GSAP registered once; motion tiers (`full` / `lite` / `static`) | `src/animations/gsap.js`, `motion.js`, `hooks/useMotionTier.js` |
| 2.5D engine | `src/story/` (`engine.js`, `poses.js`, `chapters.js`, `StoryRoot/Stage`, `marks/`) |
| NavBar (sliding four-colour indicator, accessible mobile dialog) | `components/layout/NavBar.jsx`, `hooks/useFocusTrap.js` |
| UI primitives | `components/ui/{Button,ColorStroke,Wordmark,Icon}.jsx`, `components/layout/{Container,SkipLink}.jsx` |
| Hero | `sections/Hero.jsx` (data in `data/site.js → hero`) |
| One recruitment source of truth | `data/recruitment.js → getRecruitmentCta()` |
| SEO hygiene | `index.html` (UTF-8, absolute canonical/OG), `public/{favicon.svg,robots.txt,sitemap.xml}` |
| Removed | hero videos (17 MB), `big-hero-text.svg`, GTA-style `logo.webp`/`fav.png`, `ComingSoon`, `constants/` (mask hook), `react-responsive`, the global GSAP `timeScale(50)` hack, the blocking Loader on `/` |

Inner pages (`/events`, `/team`, `/contact`, `/join`) and `/admin/*` are **unchanged** in design (still dark, via `.legacy-dark`) but now lazy-loaded and under the new NavBar. The home page below the Hero is still the old dark sections until Stage 3/4.

## How the 2.5D effect works

```
.story-stage      position:fixed · CSS perspective (≈0.95×viewport width)
 └ parallax       pointer tilt (full tier only) — isolated from scroll
    └ world       THE CAMERA: scroll tweens its z (dolly)
       └ entity   every piece: x, y, z, rotation, rotationX/Y, scale, opacity
```

- The browser's compositor projects the layers, so pieces at different `z` move by different amounts under the same camera move — that **is** the parallax.
- Each diamond is up to 3 stacked slices at slightly different Z (front = gradient, rest = darker "edge" colours) → real thickness when it turns. Lite tiers use 1 slice.
- Only `transform` and `opacity` are animated. No blur, SVG filters, animated shadows or particles. The soft shadow is one static gradient layer whose opacity/scale animate.
- Layout is CSS: the Hero reserves `data-story-slot="hero"`; the engine measures it and places the mark there. No magic numbers, responsive for free.

## Choreography is data

`poses.js` names where every entity is at each moment; `chapters.js` lists the journey; a chapter tweens `from → to`. Chapter N's `to` is chapter N+1's `from`, so there is no "reset" between sections and anchor jumps / reverse scrolling stay correct. Stage 2 enables only `hero → drift`; the rest of the agreed journey is listed in `chapters.js` (`enabled: false`).

## Motion tiers

| Tier | When | Behaviour |
|---|---|---|
| `full` | ≥1024px **and** mouse-like pointer, motion allowed | 3 depth slices, pointer parallax, scrubbed chapters |
| `lite` | phones/tablets/touch, motion allowed | 1 slice, no pointer parallax, shorter scrub smoothing, same story |
| `static` | `prefers-reduced-motion: reduce` | **no timelines at all**; final composition; stage scrolls with the page |

## Things you'll actually do

**Swap the hero visual** — `src/data/site.js`:
```js
hero: { visual: { kind: 'image', src: '/events/cloud-campaign/1.webp', alt: 'Students at the Google Cloud Study Jams' } }
```
`kind: 'mark'` = the supplied 2.5D mark; `kind: 'image'` = any image as a rounded plane with the same rings/dots. No component or engine change.

**Add the official logo** — `site.brand.logo = { src: '/images/<official>.svg', alt }`. The NavBar wordmark renders it instead of text. Set `site.brand.lockup = null` to drop the supplied hero lockup.

**Reopen applications** — `site.recruitmentOpen = true` (and `REGISTRATIONS_OPEN` in `backend/server.js`). Nav, Hero and the old sections all follow via `getRecruitmentCta()`.

**Debug the story** — add `?story=debug` to the URL (tier / chapter / progress).

## Measured results

Lighthouse 12.8, simulated throttling. Stage 2 = **local production build** (uncompressed, so slightly pessimistic); baseline = live site. Raw data: [`stage-2/lighthouse-stage2.json`](stage-2/lighthouse-stage2.json), baseline in [`stage-1/baseline-lighthouse.json`](stage-1/baseline-lighthouse.json).

| | Baseline | Stage 2 |
|---|---|---|
| **Mobile** perf / a11y / best-pr. / SEO | 37 / 94 / 79 / 85 | **66 / 100 / 100 / 100** |
| Mobile FCP · LCP · TBT · CLS | 4.2 s · 4.5 s · 5,010 ms · 0.025 | 2.9 s · 3.9 s · 620 ms · **0** |
| **Desktop** perf / a11y / best-pr. / SEO | 53 / 94 / 78 / 85 | **100 / 96→100\* / 100 / 100** |
| Desktop FCP · LCP · TBT | 1.8 s · 1.8 s · 660 ms | 0.5 s · 0.6 s · 10 ms |
| Transferred (home) | 19.7 MiB | **0.55 MiB** |
| Main JS (gzip) | 212.4 kB | **151.4 kB** |

\* the two remaining desktop a11y findings (wordmark label, footer contrast) were fixed afterwards; re-measured on mobile = 100, desktop not re-run.

**Why mobile isn't ≥90 yet:** a throwaway build with *only* NavBar + Hero + engine scored **96 mobile** (LCP 2.5 s, TBT 60 ms). The remaining gap on the full page is the *old* sections below the fold (≈1.5 s of style/layout on a throttled CPU), which Stage 3/4 replace. Below-the-fold content now mounts after the hero paints (`App.jsx` → lazy `LegacyHome`) — the pattern the new chapters will follow.

**Behaviour checks (headless Chrome, `stage-2/verification-report.json`):** 0 console errors/warnings · 0 horizontal overflow on 8 route/viewport combinations · exactly one nav item active per route · mobile menu: focus trapped across 12 Tabs, Esc closes, focus returns to the toggle, page scroll unlocked · reversible scroll (mark returns to the identical pixel position at scroll 0) · `/#about` deep link lands on the section · reduced-motion builds no timelines.

## Temporary on purpose

- The supplied `gdg-on-campus-vishwaniketan.svg` lockup is used **only** in the Hero. It is not used in the nav, favicon or share image. The favicon is a neutral four-diamond motif, not a logo.
- No `og:image` yet (the old one was the GTA-style graphic). Needs a 1200×630 once the official brand art exists.
- The dark block under the Hero is the old home page; the hand-off edge is abrupt until Stage 3/4.
- Legacy sections still lazy-load `animejs`; it goes when `animateCards` is rewritten in GSAP (Stage 4).
