# Stage 3 — The scroll story

Branch `redesign/ui-v2`. Screenshots and raw results are in [`stage-3/`](stage-3/).

One continuous visual journey from the hero to the real event photography, with every number and word from `data/story.js`:

```
GDG mark → separates and orbits → "Google Developer Group · On Campus · Vishwaniketan"
        → reshapes into an abstract cloud → "Google Cloud" → "Cloud Study Jams"
        → 245+ Participants → 107 Completed Milestones → 20+ Cloud Labs & Courses   (one at a time)
        → TIER 1 · 3 YEARS STRONG → 4TH COLLEGE TO COMPLETE THE JAMS
        → the cloud recedes; real Study Jams photographs fan in; "See all events"
```

[Part 1](stage-3/journey-1440-part1-orbit-cloud-metrics.jpg) · [Part 2](stage-3/journey-1440-part2-achievement-photography.jpg) · [Phone](stage-3/journey-390-phone.jpg) · [Reduced motion](stage-3/reduced-motion-static-story.jpg)

## Copy rules (user-approved, do not embellish)

All strings live in [`src/data/story.js`](../../frontend/src/data/story.js); components never hard-code them.

| Beat | Text |
|---|---|
| Metrics | **245+** Participants · **107** Completed Milestones · **20+** Cloud Labs & Courses |
| Achievement | **TIER 1 · 3 YEARS STRONG** · **4TH COLLEGE TO COMPLETE THE JAMS** |

No rankings or extra claims ("#4 in India", "top 4 college") unless an official source is supplied. Numbers enter **one per beat** — never together — and count up once (the final value is always in the HTML).

> The Events page now reads the same figures (`data/events.js` imports `studyJams`), so its Cloud Study Jams card says "Completed Milestones" and "Cloud Labs & Courses" instead of the earlier "Completed & earned goodies" / "Cloud courses each". One source means the two pages cannot disagree; revert by editing `studyJams.stats[].label`.

## The chapters (`src/story/chapters.js`)

| Chapter | Pinned length | Words | Visual |
|---|---|---|---|
| hero → drift | 1 screen | headline (fades as it leaves) | mark glides into the story frame, pieces loosen |
| orbit | 150 svh | Google Developer Group → On Campus · Vishwaniketan | the ring of pieces completes a full orbit, each piece counter-rotating so it stays upright |
| cloud | 100 | Google Cloud | pieces stand up and gather into an abstract cloud (blue / red / yellow lobes, green base) |
| jams | 80 | Cloud Study Jams + one-line lede | cloud settles, halos widen |
| m1 · m2 · m3 | 60 each | 245+ · 107 · 20+ | a different lobe lifts toward the camera each beat; the dots swing a third of a turn |
| achieve | 110 | TIER 1 · 3 YEARS STRONG → 4TH COLLEGE… | halos open wide |
| community | 130 | From the Cloud Study Jams + credits + link | cloud recedes; 4 real photos fan in (3 on phones) |

Total ≈ 750 svh of scroll after the hero. Phones get 80% of every length.

## How it works (changes since Stage 2)

**One master timeline.** The first version gave each chapter its own timeline. That broke on jumps: when several timelines write the same properties at once, which one renders last is undefined, so dragging the scrollbar or following a link could leave the pieces in the *previous* chapter's pose. Now every chapter is a segment of **one** timeline driven by **one** scrubbed ScrollTrigger, placed by the measured scroll geometry. The journey is a pure function of scroll position: scrolling in order, jumping in a scrambled order and reloading mid-page produce identical states (tested, below).

**The intro yields to the journey.** The one-time load-in animation writes the same properties. If the browser restores your scroll after a reload (or you start scrolling during the intro) the intro finishes instantly and the journey is re-applied; otherwise it would complete *after* the right state was set and overwrite it.

**Pieces are built big and only scaled down.** A piece that grows 1.9× for the cloud used to be rasterized small and scaled up, which stair-stepped the edges (worst on phones, where the mark also grows 1.46× into the story frame). Each cloud piece is now built at its cloud size (`data-kx/ky`) and the engine divides the authored scale by it; the mark's box is sized by the larger of the hero/story frames. Poses still mean "1 = the original diamond". Result: [clean edges at 2× density](stage-3/edge-sharpness-before-after-phone-2x.jpg); the hero is pixel-identical to before.

**Sticky tracks, no GSAP pinning.** Each chapter is a `pinned + 100svh` tall section with a CSS-sticky layer; the next overlaps the previous by 100svh, so chapters are contiguous. No pin-spacers, nothing to fight React. Every beat is real HTML in DOM order (hidden with `opacity`, not `visibility`) so screen readers read the whole story; each chapter has a labelled `h2`.

**Photos cost nothing until needed.** They are fetched only when the visitor comes within one screen of the achievement chapter (0 requests on first load, verified).

## Tiers

| Tier | Story behaviour |
|---|---|
| `full` | 3-slice depth, pointer parallax, full orbit width, 4 photos |
| `lite` (phones/touch) | 1 slice, no pointer parallax, orbit 32% narrower so it stays on screen, tracks 80% as long, 3 photos |
| `static` (reduced motion) | **no timelines**; every beat is ordinary stacked content with final numbers; nothing pinned |

## Verification

All in a headless Chrome against the production build (`stage-3/verification-report.json`, `stage-3/results.json`).

- **Order independence:** scroll-in-order vs a scrambled sequence of jumps → **8/8 identical** on desktop and phone. **Reload mid-page** with restored scroll → identical to the in-order state. (These tests found two real bugs that single-pass screenshots had hidden — see above.)
- **0** console errors/warnings · **0** horizontal overflow · **0** photo requests on first load · all nine chapters have a labelled heading · counters read 245 → 107 → 20 · reverse scroll returns the mark to the exact hero pixel · the Stage 2 suite (nav, menu focus trap, `/#about`, inner pages) still passes.
- **Lighthouse** (local production build, simulated throttling): **mobile 83 / 100 / 100 / 100** (LCP 3.0 s, TBT 380 ms, CLS 0), **desktop 100 / 100 / 100 / 100**. Stage 2 was 66 on mobile.
- **Frame cadence** — real wheel input down the whole journey, median of 3 runs, % of frames over 20 ms (a trivial page measures ~0–3% under the same slowdown):

| Device model | Before the fix | After |
|---|---|---|
| Desktop, full speed | 1.5% | **1.7%** |
| Desktop, 4× CPU slowdown (college-lab PC) | 33% | **3.3%** |
| Phone @2×, 4× slowdown (mid-range) | — | **2.5%** |
| Phone @2×, 6× slowdown (budget) | 60% | **14%** (p95 33 ms) |

**The slowdown was not the 3D stage.** Isolation experiments (stage hidden, photos hidden, every ScrollTrigger killed) all left 20–26% of frames late. What fixed it was pausing an **infinite SVG animation in the old closing scene** that ran continuously even off-screen — a legacy leftover that disappears in Stage 4. It is now paused unless that scene is visible. Two smaller changes also went in: the NavBar's scroll listener (a forced layout every frame) became an IntersectionObserver, and tweens that change nothing are no longer created.

## Things to know

- The home page **below the story** is still the old dark sections (Stage 4). The hand-off from the last chapter is a fade, then the dark block.
- `?story=debug` shows tier / chapter / progress, and exposes `window.__ScrollTrigger` for the console.
- Headless Chrome with a CPU-throttle flag is a **model** of a slow device, not a measurement of one. The budget-phone model (14%) is the weakest result; real hardware may differ either way.
- Mobile LCP (3.0 s) is held back by the old block mounting below the fold; a hero-only build scored 96 on mobile in Stage 2.

## Editing the story

- **Copy / numbers:** `src/data/story.js` (events page follows automatically).
- **Length of a chapter:** its `pinned` value in `src/story/chapters.js`.
- **Where pieces go:** the named poses in `src/story/poses.js` (units are fractions of the mark's size; `kx/ky` in `marks/GdgMark.jsx` must match the cloud scales).
- **Add a chapter:** add a track in `sections/ScrollStory.jsx` (`<Track id=…>`), a pose in `poses.js`, and an entry in `chapters.js` (`from` = previous `to`). The engine does the rest.
