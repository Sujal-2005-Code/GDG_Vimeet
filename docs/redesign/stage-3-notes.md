# Stage 3 — The scroll story (revised: the real GDG mark is the hero)

> **Superseded:** the rotating logo mark, 3D tilt, camera dolly, idle float and pointer parallax described below were replaced by a calmer choreography with the four-diamond mark. The current behaviour is documented in the README's "The scroll story" section. This file is kept as history.

Branch `redesign/ui-v2`. Screenshots and measured results are in [`stage-3/`](stage-3/).

The first Stage 3 built the story out of four rounded blocks that formed a "cloud". That visual was rejected as generic and disconnected from GDG identity, and has been **removed entirely** — no diamonds, no cloud, no rings, no slices. The object on the stage is now the **actual GDG mark**: the `#gdg-mark` group (the two chevrons) of `public/images/gdg-on-campus-vishwaniketan.svg`, referenced with `<use>`. It is never redrawn, split, re-coloured or morphed; the text lockup is not part of it.

[Desktop, part 1](stage-3/journey-1440-1-hero-tier1-cloud.jpg) · [Desktop, part 2](stage-3/journey-1440-2-metrics-closing-photos.jpg) · [Phone](stage-3/journey-390-phone.jpg) · [Reduced motion](stage-3/reduced-motion.jpg) · [Orbit and depth, 2× close-up](stage-3/orbit-depth-closeup-2x.jpg) · [Logo cap fix](stage-3/logo-cap-fix-before-after.png)

## The scene

```
THE REAL GDG MARK  +  4 orbiting accent dots  +  depth / tilt  +  scroll-driven rotation  +  camera
```

| Part | What it is | Driven by |
|---|---|---|
| The mark | `<svg viewBox="352 28 488 168"><use href="…svg#gdg-mark"/></svg>`, one object | — |
| Rotation | One smooth curve through **0° → 25° → 90° → 180° → 270° → 360°** at **0 / 20 / 40 / 60 / 80 / 100 %** of the scroll from the hero to the end of the third metric | scroll (not a free-running spin) |
| Tilt | `rotateX`/`rotateY` up to ±16°, `translateZ`, scale — in screen axes, *outside* the rotation, so the object leans toward the camera while it turns | scroll (poses) |
| Orbit | 4 small dots (blue, red, yellow, green — the logo's own colours), each on its **own** inclined orbit (different radius, tilt, slant, speed). Computed in true 3D, so a dot passes **in front of** the mark on the near side and **behind** it on the far side; the far side is a little dimmer | scroll |
| Camera | Perspective ≈1200 px; the world dollies toward the mark for *Google Cloud* and sways a few degrees per beat | scroll |
| Float | The mark breathes a few px in 3D on its own (desktop only), so it reads as a physical object even when you stop scrolling | time |
| Parallax | Pointer tilt of the whole scene (desktop only) | pointer |

## Exact scroll sequence

Measured in a headless Chrome on the production build (`stage-3/verification-report.json` has every value).

| # | 1440 × 900 scrollY | 390 × 844 scrollY | Logo rotation | Left (copy) | Right (stage) |
|---|---|---|---|---|---|
| 1 | 0 | 0 | 0° | Hero: lockup, *Build. Create. Connect. Go Beyond.* | The mark upright, dots orbiting; flies in once on load |
| 2 | 540 | 506 | 8° | Hero copy lifts away | The mark glides into the story frame and leans in |
| 3 | 1035 | 1027 | 23° | **TIER 1** fades in | Turning, tilting; dots sweep round |
| 4 | 1575 | 1433 | 48° | **TIER 1 / 3 YEARS STRONG** | Tilt swings the other way |
| 5 | 2183 | 1888 | 89° | (same) | The mark **lifts up and to the right** as the next chapter arrives |
| 6 | 2700 | 2277 | 129° | **Google Cloud** | Camera dolly toward the mark, orbit widens |
| 7 | 3582 | 2938 | 204° | **Cloud Study Jams** · *A full learning cycle, executed start to finish.* | Camera eases back |
| 8 | 4248 | 3438 | 258° | **245+** Participants (counts up) | Mark smaller, upper right, leaning one way |
| 9 | 4788 | 3843 | 310° | **107** Completed Milestones | Leans the other way |
| 10 | 5328 | 4248 | 356° | **20+** Cloud Labs & Courses | Nearly upright again |
| 11 | 6030 | 4774 | 360° | **4TH COLLEGE TO COMPLETE THE JAMS** | Upright, centred, orbit wide |
| 12 | 6624 | 5220 | 360° | *From the Cloud Study Jams* | The mark recedes |
| 13 | 7209 | 5659 | — | Credits · **See all events** | Four real Study Jams photos fan in (three on phones) |

Numbers enter **one per beat**, never together, and count once (final values are always in the HTML).

### Chapter order and two placement decisions

The order follows the correction brief: **Tier 1 → Google Cloud → Cloud Study Jams → 245+ / 107 / 20+**. Two things the brief did not place:

- **"4TH COLLEGE TO COMPLETE THE JAMS"** now comes *after* the three metrics, as the closing beat. Before the Jams are introduced the sentence has nothing to refer to. Moving it is one line in `ScrollStory.jsx`.
- The old orbit chapter's *Google Developer Group / On Campus · Vishwaniketan* lines were dropped (the hero lockup already says it, and the brief goes straight from the hero to Tier 1). `story.orbit` was removed from `data/story.js`.

All copy is unchanged and still comes from `data/story.js`.

## One fix inside the logo file

The supplied SVG's `softShadow` filter region was sized as a percentage of the chevrons' **centre-lines**, which ignores the 56-unit round stroke, so the filter **sliced the round caps flat** (the red tip ended at y = 42 instead of 34). Invisible at nav size, obvious at hero size. The filter region is now set in user space (`filterUnits="userSpaceOnUse" x="320" y="10" width="540" height="210"`). Geometry and colours are untouched — [before / after](stage-3/logo-cap-fix-before-after.png).

## Tiers

| Tier | Behaviour |
|---|---|
| `full` (desktop, mouse) | Everything above |
| `lite` (phones/touch) | Same journey; mark 86% size, orbits 80% radius so dots stay on screen, softer tilt, no idle float, no pointer parallax, tracks 80% as long, 3 photos |
| `static` (`prefers-reduced-motion`) | **No rotation, no orbit, no timelines** (0 ScrollTriggers). The mark sits upright in the hero; each chapter fades in once and eases from 97% to 100% size as it scrolls into view |

## How it is built

```
stage (perspective) → parallax (pointer) → world (camera)
  anchor ── mark ─┬─ orbit ── 4 dots            (positions from the rig)
                  └─ core (tilt) ── float ── spin (rotation from the rig) ── <use #gdg-mark>
         └─ photo-1…4
```

- **Poses** (`story/poses.js`): named states — position, size, tilt, camera — tweened between chapters.
- **Rig** (`story/rig.js`): the rotation curve (monotone cubic through the keys, so it passes exactly through 25°/90°/… with no jolts) and the dot orbits, evaluated from the master timeline's time.
- Both run on **one master timeline driven by one scrubbed ScrollTrigger**, so the picture is a pure function of scroll position: scrolling in order, jumping around and reloading mid-page land on identical states (tested).
- The logo is built 1.3× larger than its largest on-screen size and only ever scaled **down**, and it sits on its own compositor layers, so it is rasterised once (shadow included) and then only moved by the GPU.
- The hero visual is still swappable by data: `site.hero.visual.kind = 'image'` puts a photo plane in the same rig (tilt + orbit, no spin) — tested.

## Verification

- **Rotation curve** — measured at 0/20/40/60/80/100%: **0°, 25°, 90°, 180°, 270°, 360°** exactly, on desktop and phone.
- **Nothing leaves the screen** — the whole journey swept every 60 px: the logo and every dot stay inside the viewport and below the header at 1440 × 900 and 390 × 844 (0 violations).
- **Order independence** — scroll-in-order vs. scrambled jumps: **8/8 identical** on desktop and phone (now including the spin and every dot position); **reload mid-page** restores the identical state.
- **Reduced motion** — tier `static`, 0 ScrollTriggers, orbit hidden, no rotation, nothing pinned, all 8 chapters fade in when reached, counters show 245/107/20.
- **Regression suite** (Stage 2) — nav, mobile menu focus trap + Esc + focus return, `/#about`, all inner pages: pass; 0 horizontal overflow anywhere; 0 console errors or warnings.
- **Lighthouse** (local production build): mobile **84 / 100 / 100 / 100**, desktop **97–98 / 100 / 100 / 100** (interleaved with the previous build: 97, 97 vs 95, 97).

### Performance — measured carefully

Headless measurements on this machine turned out to be very noisy (the same build swings between ~5% and ~30% late frames depending on background load), and an early run was contaminated by leftover headless browsers. So the new build was compared **interleaved** with the previous build, run by run:

| Model | New | Previous build |
|---|---|---|
| Desktop, 4× CPU slowdown | 22.9, 22.8 % | 23.6, 22.7 % |
| Phone @2×, 4× slowdown (quiet runs) | 5.7, 5.7 % | 4.8, 4.6 % |
| Main-thread time per frame (desktop 4×, trace) | **1.85 ms** | 2.05 ms |

Parity. One real improvement came out of it: the photos are now **decoded as soon as they load** (a screen before they are needed), which removed the 166–284 ms stalls that both builds had when the photos fanned in (0 such frames in 3 runs, vs. 7/7 before).

## Editing the story

- **Copy / numbers:** `src/data/story.js`.
- **Rotation:** `SPIN.keys` in `src/story/chapters.js` (`[progress, degrees]`).
- **Orbit:** `src/story/orbit.js` (radius, tilt, slant, speed, phase, size per dot); sweep speed `ORBIT_SWEEP` in `chapters.js`.
- **Where the mark goes / how it leans / camera:** the named poses in `src/story/poses.js`.
- **Length of a chapter:** its `pinned` value in `chapters.js`.
- `?story=debug` shows tier / chapter / progress / rotation live.
