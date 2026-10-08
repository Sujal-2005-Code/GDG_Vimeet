# Stage 1 — Audit & Plan
**GDG On Campus Vishwaniketan (ViMEET) · UI/UX redesign v2 · captured 2026-10-09 against commit `76f88cf`**

No application code was changed in this stage. Everything below was measured on the live site
(`gdg-vimeet.vercel.app`, which serves a byte-identical build to the repo at `76f88cf`) and on a local
production build. Screenshots and raw numbers are in [`stage-1/`](stage-1/).

---

## 0. Read this first

**The audit in your brief is right, and the real picture is worse in four places.**

| # | Finding the brief didn't have | Why it matters |
|---|---|---|
| 1 | The "logo" (`logo.webp`) is a **GTA-style "GOOGLE DEVELOPER GROUPS 25" graphic, 9674×6049 px (58 megapixels)** — not an official GDG On Campus mark. It is also the favicon and the social-share image. `nav-logo.svg` is an auto-traced vector of the bracket mark. **The repo contains no official logo.** | Brand rules (§3) require official files. **Blocks Stage 2** — I need them from you. |
| 2 | The hero car footage carries a visible **"@pikachupcar" Instagram watermark** — third-party content. | Licensing risk independent of design. |
| 3 | **10 of the 13 raw photos in `public/events/fe-se-gitngithub/` contain GPS coordinates**, were pushed in `76f88cf`, and are **served publicly** (`/events/fe-se-gitngithub/IMG_2132.HEIC` → HTTP 200, 1 MB). The GitHub repo is **public**. My converted WebPs contain no EXIF. | Likely the campus location, so low severity — but it is metadata nobody meant to publish, plus 23 MB of dead weight. Recommend removing from `public/` (details §9). |
| 4 | **Six** places (not two) still advertise open recruitment while `site.recruitmentOpen = false`. | See §1. |

**Baseline (live, Lighthouse 12.8):**

| | Perf | A11y | Best-Pr. | SEO | FCP | LCP | TBT | Transfer |
|---|---|---|---|---|---|---|---|---|
| **Mobile** | **37** | 94 | 79 | 85 | 4.2 s | 4.5 s | **5,010 ms** | 19.7 MiB |
| **Desktop** | **53** | 94 | 78 | 85 | 1.8 s | 1.8 s | 660 ms | 19.5 MiB |

**My recommendations (decisions needed from you are marked ❓ in §10):**
1. **Scroll story → Option B (2.5D, SVG/CSS + GSAP).** Measured: a *minimal* React-Three-Fiber scene costs **≈250 kB gzip** — more than the entire current JS bundle (212 kB) and above the brief's own ≤200 kB budget — *and* you'd still have to build the 2D fallback for mobile, i.e. build it twice. (§6)
2. **Palette needs darker "-600/-700" variants for text and buttons.** Google's brand blue/red/green fail WCAG AA as text (3.1–3.9 : 1); white-on-`#4285F4` buttons fail too (3.56 : 1). Brand colours stay for shapes, strokes and graphics. (§4)
3. **Ship light only in v2**; structure tokens so dark can be added later. Dark mode doubles QA for no stated goal.
4. **Admin: keep it dark behind a scoped theme** until Stage 5 — it holds 183 of the 553 dark-theme class usages and is not user-facing.
5. **Drop `motion` + `Stack` + `GlareHover`** with the redesigned Moments/lightbox, and replace `animejs` with GSAP → one animation engine.

---

## 1. Audit — your Section 1, verified

✅ confirmed · ✏️ corrected/extended · ➕ new

| Claim | | Evidence |
|---|---|---|
| Stack: Vite 6, React 19, RR6, Tailwind v4, GSAP + motion + animejs | ✏️ | All present. **`animejs` is not dead:** it is lazy-`import()`ed in `animations/cardAnimations.js` and powers every `animateCards*` reveal (Events, About, Go Beyond). **`motion` is used only by `Stack.jsx`** (photo stack). `react-responsive` is used only by `constants/index.js` (the hero-mask hook). |
| Routes; admin chunks lazy | ✅ | Plus an unlisted `/admin/queries` route. Only admin + chat are lazy — **Events, Team, Contact and Recruitment are all in the 644 kB main chunk.** |
| Home order Loader → Nav → Hero → Upcoming → Social → Lucia → GoBeyondCode → JoinUs → Final → Footer | ✅ | `App.jsx`. `ComingSoon` (logo + "ViMEET 2026-27") lives *inside* Hero as the mask-reveal payload. |
| Car videos, ~17 MB | ✅ ✏️ | `herovideo.mp4` 6.9 MB + `newbmw.mp4` 10.8 MB. **Both download on every device** — the "other" one is only CSS-hidden and both have `preload="auto"`. Lighthouse (live): mobile 10.3 + 6.6 MiB; desktop 10.1 + 6.6 MiB. My local mobile run: 16.9 MiB of video. Watermarked (see §0). |
| Template leftovers (`Lucia`, `.bmw-text`, `#bmwGradient`, repurposed tokens) | ✅ | Also: the GTA-style logo art, the mask-reveal hero and the section name "Lucia" all point to a GTA-VI-trailer-style template. `--color-yellow: #0066B1` is **blue**; the only usage is `Events.jsx:374` (`text-yellow`, renders blue). |
| Dark/black theme everywhere | ✅ | `body{background:black}` + dark gradient on `main`. **553** uses of `text-white / bg-white/ / border-white/` (370 public, 183 admin) across 24 files, plus 67 BMW-blue hex literals in 7 files. This is the true scope of the light conversion. |
| "Six font families" | ✏️ | **Five are loaded** — Round, Round Bold, Long (self-hosted `.woff`, no `font-display` → invisible text while loading) + Space Grotesk and DM Sans (Google Fonts CDN). **Audiowide** is referenced by `.bmw-text` but never loaded — it silently falls back. Home uses 5 different `font-family` stacks (one of them the phantom Audiowide). |
| Rainbow gradient text, gradient buttons, emoji icons | ✏️ | Not one gradient but **three competing systems**: Google rainbow (Events, About, Hero), BMW blue→cyan→red (Team/Contact/Join/Upcoming/Social via `gradient-title`), purple→pink (Team group headings). Emoji: 12 in Go Beyond Code, 7 in Recruitment, 1 in Events (👍👎 in chat are functional — keep as icons). |
| Blocking Loader until `window.load` | ✅ ➕ | `App.jsx` shows the Loader until `load` and sets `aria-hidden` on `<main>`. **➕ `Final.jsx` renders the same BMW `<Loader/>` as the page's closing scene** — a permanent `role="status" aria-label="Loading"` at the bottom, with no CTA or links. |
| Spacer `div`s | ✅ | Five `py-16/py-20` spacer divs in `App.jsx`. Page is 8,280 px (1440) / 8,511 px (390) tall with large empty bands. |
| Contradictory recruitment state | ✏️ | **Six** places ignore `site.recruitmentOpen`: `Upcoming.jsx:61-82` ("Hiring Now" / "Apply to Join"), `Lucia.jsx:61-77` ("actively hiring"), `Team.jsx:110-126` ("Apply Now"), `Events.jsx:416-436` (banner), NavBar "Join Us" CTA with pulsing green dot (`navigation.js`), Hero "Join Us". Only `JoinUs.jsx` and `Recruitment.jsx` read the flag. |
| "Event Details" goes to `/join` | ✏️ | In `Upcoming.jsx` it is a plain `<a href="/events">` (full page reload, not router `Link`). The `/join` CTA is the featured card's "Stay Tuned" in `events.js`. |
| Past events `date: 'Date TBD'` | ✅ ✏️ | 4 of 5 still TBD. The new Oct-2026 workshop has a date. **There are now two events titled "Git & GitHub Workshop"** (2025-26 undated, 15 photos in `git-github-workshop/`; 7 Oct 2026, 12 photos in `git-github-workshop-2026/`). About (`Lucia.jsx:43`) also hotlinks `git-github-workshop/13.webp`, so that folder can't be renamed blindly. |
| Social feed block | ✅ | Instagram `/embed` iframe + LinkedIn card. Lighthouse flags a **third-party cookie** (Best-Practices fail) and ~0.5 MB of Instagram assets. It rendered as an empty dark panel in my capture. |
| Real assets | ✏️ | Event folders ✅ (cloud-campaign 12, git-github-workshop 15, nirmaan 15, jamming 11, +2026: 12). `manifest.json` is **not read at runtime** — only by `find-unused-assets.mjs`. Logo: see §0. |
| Components to keep | ✏️ | `EventGallery`: Esc ✅ but no focus trap / `role="dialog"` / `aria-modal`. `ChatWidget`: Esc ✅, focuses input ✅, no focus trap. `GlareHover` is **not unused** — `EventPhotoStack` depends on it. |

### ➕ New findings not in the brief

- **SEO/metadata** (`index.html`): a raw `0x97` byte (Windows-1252 em-dash) makes the description / `og:description` / `twitter:description` render as "�"; `og:image`, `og:url` and `canonical` are **relative** (`/images/logo.webp`, `/`), which social crawlers ignore; every route shares one `<title>`/description; **`/robots.txt` returns the SPA's HTML** (Lighthouse: "43 errors"); no sitemap.
- **Nav**: on `/`, **both "Home" and "About" render active** (`aria-current` on both — About is `/#about`, same pathname). Hamburger is 32 px. The mobile drawer has **no Esc, no focus trap, no `aria-modal`**. Desktop nav has no logo and an unlabeled `role="navigation"` div.
- **Chat launcher covers content on mobile** — in the 390 captures it covers the right edge of the Contact form's fields and crowds the Join card's buttons. See [`pages-390-folds.jpg`](stage-1/pages-390-folds.jpg).
- **Events page mounts 65 photos / 9.2 MiB at once**; 1200–1600 px images displayed at ~300 px; no `srcset`, no `width/height`.
- **Contact**: the Google Form iframe is not lazy (map is) and renders as a bright white block on the dark page.
- **Team**: `Icon` components are *defined inside* a `.map()` (remount every render); no member photos exist in data; **no 2026-27 members exist** (only the 2025-26 tenure); `team.js` publishes a personal Gmail for the previous lead — your call.
- **Lighthouse failures**: a11y `color-contrast`, `heading-order`; best-practices `third-party-cookies`, `valid-source-maps`; SEO `robots-txt`, `canonical`. LCP element on both form factors is `h1.hero-title` — text painted over a video mask.
- **Reduced motion**: `main.jsx` sets `gsap.globalTimeline.timeScale(50)` (as you noted); the CSS media query is global; each animation file has its own check but there are no designed fallbacks.
- **CSS collisions**: global `.container`, `.section`, `.card`, `.btn-primary/-secondary` shadow Tailwind-style names; `.btn-secondary` hard-codes white text (breaks on light).
- **Recruitment form**: year options are `SE / TE / BE` (no FE) while the admin filter has FE; the "Ganesh Chaturthi poster" challenge is seasonal. Not redesign scope — see §10.

---

## 2. Ranked UI/UX problems

Screenshots: [home 1440 fold](stage-1/home-1440-fold.jpg) · [home 390 fold](stage-1/home-390-fold.jpg) · [home 1440 full](stage-1/home-1440-fullpage.jpg) · [home 390 full](stage-1/home-390-fullpage.jpg) · [pages 1440](stage-1/pages-1440-folds.jpg) · [pages 390](stage-1/pages-390-folds.jpg)

**P0 — defeats the three first impressions**
1. **Hero is a car video.** "This is a GDG website" fails in the first second; the rainbow headline is unreadable over the car; "Join Us" collides with the wheel at 1440. 17 MB, watermarked.
2. **Performance**: mobile 37/100, TBT 5 s, 19.7 MiB transferred. A phone user on campus data won't see the site.
3. **No real brand**: GTA-style graphic as logo/favicon/OG image; no official lockup anywhere.
4. **Recruitment messaging contradicts itself in six places** while applications are closed — the most trust-damaging bug for someone arriving to apply.

**P1 — no design system**
5. Dark gaming mood + three gradient systems + five fonts; contrast failures (heading `#0066B1` on `#12121A` = 3.14 : 1 — the "Upcoming Events" title is nearly invisible).
6. Scroll mechanics: two pinned sections (Hero, Final) + a scrubbed Upcoming reveal → dead scroll and large empty bands; the Final scene is a loader.
7. Navigation correctness and a11y (double-active, 32 px targets, no focus trapping in menu/lightbox/chat).
8. Events: no date/venue/audience/status (except the new one); duplicate title; 65 images mounted at once.

**P2 — polish**
9. Emoji as icons (12+7+1); Instagram embed + third-party cookie; template naming; Team page has no photos or current team; white Google Form on dark; chat launcher overlapping CTAs.
10. SEO hygiene (§1).

---

## 3. Baselines (for the Stage 5 comparison)

Raw: [`baseline-lighthouse.json`](stage-1/baseline-lighthouse.json), [`page-metrics.json`](stage-1/page-metrics.json).

**`vite build` (current tree):**

| Chunk | Raw | Gzip |
|---|---|---|
| `index-*.js` (main: React, Router, GSAP+ScrollTrigger, motion, all public pages) | 644.62 kB | **212.37 kB** |
| `index-*.js` (lazy: `animejs`) | 125.53 kB | 43.17 kB |
| `index-*.css` | 86.82 kB | 14.33 kB |
| Admin/chat chunks (lazy) | 3–17 kB each | 1–4.5 kB |

**Per-route weight (local, Chrome, cache off):**

| Route | 1440 | 390 | Notes |
|---|---|---|---|
| `/` | 8.8 MiB | **18.4 MiB** | 16.9 MiB is video on mobile |
| `/events` | 10.0 MiB, 75 req | 10.0 MiB | 9.2 MiB = 65 photos |
| `/team` | 0.8 MiB | 0.8 MiB | 0 images; 4.7k / 7.1k px tall |
| `/join` | 0.75 MiB | 0.75 MiB | |
| `/contact` | 0.77 MiB | 0.77 MiB | Maps + Google Form iframes |

**Targets (your §11):** Lighthouse mobile P ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95 · LCP < 2.5 s · CLS < 0.1 · INP < 200 ms · main JS smaller than 212 kB gz. All look achievable once video, Instagram embed and Google-Fonts CDN are gone; the 5 s TBT is the item to watch (it's GSAP scrub + video decode on a throttled CPU).

---

## 4. Design tokens (Tailwind v4 `@theme`)

**Colour** — contrast ratios computed, not estimated:

| Token | Value | Use | Contrast on white |
|---|---|---|---|
| `blue` | `#4285F4` | brand: shapes, strokes, focus ring, illustration | 3.56 (graphics only) |
| **`blue-600`** | `#1A73E8` | **links, primary button fill, interactive text** | **4.51 ✔ AA** (white label on it also 4.51) |
| `blue-700` | `#185ABC` | text on blue tint | verify in Stage 2 (`blue-600` on `#E8F0FE` is only 3.93 ✗) |
| `red` / **`red-600`** | `#EA4335` / `#C5221F` | brand / text & emphasis | 3.92 / **5.80 ✔** |
| `yellow` | `#FBBC05` | highlights, badges — **never text** | 1.71; `ink` on yellow = 9.43 ✔ |
| `green` / **`green-700`** | `#34A853` / `#137333` | brand / "Completed", success text | 3.06 / **5.95 ✔** |
| `ink` | `#202124` | headings, body | 16.10 ✔ |
| `ink-2` | `#5F6368` | secondary text | 6.05 ✔ |
| `surface` / `surface-2` | `#FFFFFF` / `#F8F9FA` | page / alt sections | — |
| `line` | `#DADCE0` | decorative dividers only (1.37 : 1) | — |
| **`line-strong`** | `#80868B` | **input borders** (3.68 : 1 meets WCAG 1.4.11) | 3.68 ✔ |
| tints 50 | `#E8F0FE` `#FCE8E6` `#FEF7E0` `#E6F4EA` | chips / status backgrounds | — |

Ratio ≈ 80 % neutrals / 15 % blue-600 / 5 % others. **Migration trap:** `--color-yellow` currently means *blue*; redefining it recolours `Events.jsx:374` — the only usage — so it gets fixed in the same commit. `--color-pink`, `--color-paper`, `--font-long`, `--font-round-bold`, `--font-display`, `--font-body` are removed.

**Type** — Google Sans isn't licensed for web self-hosting, so **Inter (variable, self-hosted woff2, `font-display: swap`, preload one weight) + JetBrains Mono** for code accents. Both OFL; no npm dependency, files go in `public/fonts/`.

| Role | Size (fluid) | Line / tracking |
|---|---|---|
| Display | `clamp(2.75rem, 1.6rem + 5vw, 5.25rem)` | 1.02 / −0.03em |
| H1 | `clamp(2.25rem, 1.5rem + 3vw, 3.75rem)` | 1.08 / −0.025em |
| H2 | `clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)` | 1.15 / −0.02em |
| H3 | `1.25rem → 1.5rem` | 1.3 |
| Body-L / Body / Small | 1.125–1.25 / 1 / 0.875 rem | 1.6; ≤ 68 ch |
| Overline (mono) | 0.75 rem, uppercase | +0.12em |

**Space** 4 px scale (4…128) · container 1200–1280 · section padding 96–128 desktop / 64 mobile (no spacer divs).
**Shape** radius 8 (inputs/chips) · 16 (cards) · 24–32 (media) · full (buttons/chips only).
**Elevation** 3 neutral shadows (`rest`, `raised`, `overlay`); elevation = interactive.
**Motion** 150 / 250 / 450 ms · standard `cubic-bezier(0.2,0,0,1)` · emphasized `cubic-bezier(0.3,0,0,1)`; GSAP twins in `src/animations/`.

---

## 5. Wireframes

### Home (≥1024 px)
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [logo]  GDG On Campus · Vishwaniketan     Home  Events  Team  Contact  [CTA]│ 72px, sticky
│ ▔▔▔▔ four-colour stroke slides under the active item                    │   CTA = "Join GDG" | "Follow us" (flag)
├─────────────────────────────────────────────────────────────────────────┤
│ HERO                                                                    │
│  GDG ON CAMPUS · VISHWANIKETAN  (overline)        ┌───────────────┐ ●   │
│  Build. Create.                                   │  REAL PHOTO   │ ▬▬  │
│  Connect. Go Beyond.                              │ (rounded 32)  │ ▬▬  │ blue/red/yellow/green
│  Where students build, learn and grow together.   │               │ ○   │ bars + dots, slow drift
│  [Explore events]  [Join GDG|Follow us]           └───────────────┘     │
│  ━━━━ ━━━━ ━━━━ ━━━━                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ SCROLL STORY (pinned ~250vh)   GDG → Google Developer Group →           │
│   4 bars assemble < >, orbit, regroup as cloud     On Campus → Cloud    │
├─────────────────────────────────────────────────────────────────────────┤
│ ABOUT   Learn · Build · Grow  (3 pillars, line icons) + 2–3 sentences   │
├─────────────────────────────────────────────────────────────────────────┤
│ IMPACT  245+ participants  107 completed  20+ courses   (counters)      │
│         [Tier 1] [3 Years Strong] [4th college] (badges)  + one photo   │
├─────────────────────────────────────────────────────────────────────────┤
│ EVENTS  ┌──────── featured upcoming (large) ────────┐ ┌─ recent ─┐      │
│         │ Cloud & AI Study Jam · Coming this semester│ ├─ recent ─┤      │ asymmetric, not a grid
│         └─────────────────────────────────────────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────────────────┤
│ MOMENTS  bento strip of real photos from every event → /events          │
├─────────────────────────────────────────────────────────────────────────┤
│ FIND YOUR PLACE   Build · Create · Connect · Lead  → the 5 teams        │
├─────────────────────────────────────────────────────────────────────────┤
│ TEAM PREVIEW  leads (initials avatars until photos exist) → Meet the team│
├─────────────────────────────────────────────────────────────────────────┤
│ FINAL CTA  open: "Join GDG…"   closed: "Applications are closed —       │
│            follow us to hear when they reopen" + LinkedIn/Instagram/GitHub│
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER  nav · socials · address (site.institute) · ━━━━ ━━━━ ━━━━ ━━━━   │
└─────────────────────────────────────────────────────────────────────────┘
Mobile: single column; hero photo below headline; story = 2D version (same 5 beats);
        chat launcher raised above sticky CTAs and hidden while a modal is open.
```

### Events
```
 Explore Events  (H1, solid ink + one coloured word)         [All|Study Jams|Workshops|Hackathons|Community]
 ── UP NEXT ───────────────────────────────────────────────────────────────
 ┌ featured (large) ────────────────────────────┐  empty state if none:
 │ [Cloud & AI]  ●Upcoming   Coming this semester│  "Something new is brewing"
 │ Google Cloud & AI Study Jam                   │
 │ venue · audience              [Stay tuned →]  │
 └───────────────────────────────────────────────┘
 ── PAST ──────────────────────────────────────────────────────────────────
 ┌ large photo (clip-reveal) ─────┐ ┌ photo ┐ ┌ photo ┐     status derived from `date`:
 │ ●Completed  Workshops           │ │       │ │       │     upcoming → blue CTA, date emphasised
 │ Git & GitHub Workshop           │ └───────┘ └───────┘     completed → green chip, "View photos"
 │ 7 Oct 2026 · 2:00–4:15 · B008   │                         hover/focus: image scale 1.03–1.05
 │ FE & SE   [View photos (12)]    │                         click → drawer/page → bento → lightbox
 └─────────────────────────────────┘
```

### Team
```
 Team (H1)  — "The people behind GDG On Campus Vishwaniketan"
 ── 2026-27 recruitment teams (5 cards, line icons)   [Apply | "Applications closed"] by flag
 ── Current team            ← EMPTY until you supply 2026-27 members (never invented)
 ── Under the guidance of   compact list (faculty), respectful, no cards
 ▸ Previous tenure 2025-26  (collapsible)  groups → members: initials avatar (4-colour,
                            deterministic), name, role, labelled social icons (≥44px targets)
```

### Join (multi-step, API/validation unchanged)
```
 closed (today):  status chip "Applications closed"  ·  friendly message  ·  socials  ·  home
 open:  ① You  →  ② Teams  →  ③ Why us  →  ✓ Review          stepper = four-colour stroke fills
        inline errors (aria-describedby) · success draws the stroke in · confetti once (optional)
```

---

## 6. Scroll story — Option A vs B

**Measured**, not estimated: I built a minimal R3F scene in a scratch folder (4 rotating boxes, 2 lights; three 0.186, fiber 9.8, drei 10.7) with your Vite 6 / React 19.

| | **A — React Three Fiber** | **B — 2.5D SVG/CSS + GSAP** |
|---|---|---|
| Added JS (gzip) | **≈250 kB** (319.3 kB probe − 69.5 kB React). With drei helpers: ≈251 kB | **≈0 deps**; a few kB of component code (estimate) |
| vs today's main bundle (212 kB gz) | +118 % | ≈ +1–2 % |
| vs your ≤ 200 kB budget | **over by ~25 %** | well under |
| Mobile / low-end | needs a full 2D fallback → **build the scene twice** | one implementation, scales down |
| College lab PCs / integrated GPU | risk of dropped frames | CSS transforms on GPU layers, no WebGL |
| Reduced motion | static composition (must author) | static composition (same DOM) |
| Maintainability by student team | R3F/three knowledge needed | GSAP + SVG you already use |
| Visual ceiling | true depth, lighting | CSS `perspective` + `rotateY/X`, layered SVG — convincing for abstract bars/dots |

**Recommendation: B.** The scene is abstract geometry (rounded bars, dots, a cloud-like cluster); it doesn't need real lighting. B satisfies all five beats in your table with `ScrollTrigger` (already installed, `pin` + `scrub`), keeps the LCP unaffected, and can be *upgraded* to A later without touching the page contract (same text overlay, same beats). **Beat map** (`progress → visual / text`) is exactly your §6 table; mobile (≤768 px) swaps pin+scrub for a 5-step stacked reveal. All ScrollTriggers get killed on route change via `gsap.context` per page.

---

## 7. Component plan

**Create** — `components/ui/`: `Button`, `TextLink`, `Chip` + `StatusChip`, `Card`, `SectionHeader`, `StatCounter`, `ColorStroke`, `ImageReveal`, `Lightbox`, `Icon` (inline-SVG sprite, ~25 icons; avoids a ~200 kB icon font) · `components/layout/`: `Container`, `Section`, `SkipLink`, `NavBar`, `Footer` · `components/events/`: `FeaturedEvent`, `EventCard`, `EventStatusChip` · `sections/`: `Hero`, `ScrollStory`, `About`, `Impact`, `EventsPreview`, `Moments`, `FindYourPlace`, `TeamPreview`, `FinalCTA` · `three/` **not needed** (Option B) · `animations/`: `reveal`, `scrollStory`, `microInteractions` · `data/` helpers: `getEventStatus(event)`, `useRecruitment()` (reads `site.recruitmentOpen` → label / href / state — **one source for all six contradicting places**).

**Refactor (keep logic, restyle)** — `Events` (keep filter + sliding indicator), `EventGallery → Lightbox` (add focus trap, `role="dialog"`, swipe, counter), `Team`, `Contact` (lazy form iframe), `Recruitment` (steps; **validation + `saveApplication` untouched**), `ChatWidget/Panel/Message` (light surface, solid-blue launcher, focus management, keep API), `RootLayout` (skip link, ScrollTrigger cleanup), `ScrollToTop` (keep), Admin pages (tokens only, scoped dark wrapper first).

**Remove** (after confirming no importer) — `Hero` video + mask + `ComingSoon`, `Loader` (→ ≤300 ms brand fade that never waits for `load`, or nothing), `Final.jsx`, `Social.jsx`, `Lucia.jsx` → `About`, `GoBeyondCode.jsx` → `FindYourPlace`, `Upcoming.jsx` → `EventsPreview`, `JoinUs.jsx` (merged into `FinalCTA`), `constants/index.js` (mask hook), `Stack.jsx/.css`, `GlareHover.jsx/.css`, `EventPhotoStack.jsx`, spacer divs; CSS: `.bmw-text`, `.mask-wrapper`, `.entrance-message`, `.loader`, `.gradient-*`, `.hero-*`, `.card`, `.events-blob*`, `glow/pulse` keyframes, `main` gradient, Audiowide reference; assets: `herovideo.mp4`, `newbmw.mp4`, `big-hero-text.svg`, `logo.webp`, `fav.png`, `long/round/round-bold.woff`; the `fe-se-gitngithub/` originals.

---

## 8. Dependencies

| | Package | Why |
|---|---|---|
| **Remove** | `animejs` | Used only by 4 reveal/hover helpers (~100 lines) → reimplement with GSAP. −43 kB gz lazy chunk. |
| **Remove** | `react-responsive` | Only the hero-mask hook; replaced by `gsap.matchMedia()`. |
| **Remove** | `motion` | Only `Stack.jsx`; Stack goes away with the new Moments/Lightbox. *(Keep only if you want the draggable photo stack — ❓ Q6.)* |
| **Decide** | `canvas-confetti` | Recruitment success only; fires nothing while closed. Keep (tiny) or drop. |
| Keep | `gsap`, `@gsap/react`, `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `@tailwindcss/vite` | |
| **Add** | *none required* with Option B | |
| Add (dev, optional) | `sharp` | Build-time script for 480/960/1600 px WebP/AVIF `srcset` variants of the 65 event photos. Not shipped to users. |

Savings will be **measured in Stage 2** (before/after `vite build`), not assumed.

---

## 9. Housekeeping found along the way (not part of the redesign)

- **Raw originals**: `public/events/fe-se-gitngithub/` — 13 files, ~23 MB, **10 with GPS EXIF**, public repo, served by Vercel. Recommend `git rm -r` it and keep the originals outside the repo (like `cloud-campaign-originals/`). Removing it from *history* is only worth doing if you consider the GPS sensitive; the venue is a public campus. I haven't touched it. ❓ Q7.
- **Duplicate event title** and the `git-github-workshop/13.webp` hotlink in About. ❓ Q8.
- **Branching**: your tree is clean and in sync with `origin/main` (you pushed everything in `76f88cf`), so `redesign/ui-v2` can be cut from `main` right now. Vercel normally builds a preview URL per branch, so each stage can be reviewed live without touching production (I can't confirm your Vercel project settings from here).

---

## 10. What I need from you

**Blocking Stage 2**
- ❓ **Q1 — Official GDG On Campus logo / lockup** (SVG; light-background variant). None exists in the repo. Until then I can ship a *typographic* wordmark ("GDG On Campus · Vishwaniketan") — I won't redraw or approximate the logo.
- ❓ **Q2 — Scroll story: A or B?** (I recommend B.)
- ❓ **Q3 — Admin theme**: scoped dark until Stage 5 (recommended), or convert now?
- ❓ **Q4 — Light only in v2?** (recommended) or light + `prefers-color-scheme` dark.
- ❓ **Q5 — Hero photo**: use `cloud-campaign/1.webp` as the brief suggests, or choose another.

**Stage 4**
- ❓ **Q6 — Drop `motion` + photo Stack?** (recommended — bento + lightbox replace it.)
- ❓ **Q7 — Remove `fe-se-gitngithub/` from the repo?** (recommended; I can do it as a separate one-commit change.)
- ❓ **Q8 — The two "Git & GitHub Workshop" entries**: keep both (I'd add the year to the old one's title/date), or are they the same event?
- **Dates** (currently `TODO` in `events.js`): Cloud Study Jams Campaign, Nirmaan, Jamming Session, the 2025-26 Git & GitHub Workshop; plus **venue / audience** for each; date for the upcoming Study Jam.
- **Impact copy**: confirm the exact wording for "Tier 1", "3 Years Strong", "4th college to complete the Jams" (I'll add them as `site.achievements`; they aren't in the data files today).
- **Team**: 2026-27 members and photos (none exist); whether the previous lead's personal Gmail stays public.
- **Recruitment form** (not redesign scope, but visible): should FE appear in the year list? Is the Ganesh Chaturthi poster challenge still wanted?
- **OG image** (1200×630) once the logo exists. **Alt text**: I'll draft per-photo descriptions for all 65 event photos for your approval.

---

## Stage plan — adjustments I'd make

Your five stages hold. Two changes: **(1)** Stage 2 starts with the `useRecruitment()` helper + metadata/robots/canonical fixes — they're small, high-value, and independent of the visual work; **(2)** the 553 `text-white/…` usages mean the theme flip touches almost every file, so Stage 2 introduces *semantic* classes (`text-ink`, `bg-surface`, `border-line`) and Stages 3-4 convert pages to them — admin stays behind a `.theme-admin-dark` wrapper until you decide Q3.

*Stage 1 complete. Waiting for **NEXT STAGE** (and answers to Q1–Q5).*
