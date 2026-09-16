# GDG ViMEET

The website for **Google Developer Groups on Campus — ViMEET**, a student-led developer community at Vishwaniketan's Institute of Management, Entrepreneurship and Engineering Technology. It runs the chapter's public site, its recruitment pipeline, an admin dashboard for reviewing applications, and an AI FAQ assistant — in production, with real applicants.

**Live:** [gdg-vimeet.vercel.app](https://gdg-vimeet.vercel.app)

![Home page](docs/screenshots/home-hero.jpg)

## What it does

- **Public site** — home, team, events (with photo galleries), contact, and a recruitment form across five teams (Technical, Graphics & Design, Content & Social Media, PR & Outreach, Event Management).
- **Recruitment pipeline** — applicants fill in one form; the backend validates and stores it, emails a confirmation with a WhatsApp invite, and syncs a live Excel workbook (one sheet per team) for the organising committee.
- **Admin dashboard** — a password-protected panel for the core team to search, filter, re-status, export and delete applications.
- **FAQ assistant** — a chat widget answering questions about recruitment, teams and events from a curated ~200-entry knowledge base, backed by Claude with Gemini as an automatic fallback.

| | |
|---|---|
| ![Admin dashboard](docs/screenshots/admin-dashboard.jpg) | ![Admin login](docs/screenshots/admin-login.jpg) |
| ![Chat assistant](docs/screenshots/chat-widget.jpg) | ![Events page](docs/screenshots/events-highlight.jpg) |

## Architecture

```
Browser
  │
  ├─ static assets ───────────────► Vercel (React 19 + Vite, frontend/)
  │
  └─ /api/* ─── rewrite ──────────► Railway (Express 5, backend/) ─── MongoDB Atlas
                                          │
                                          ├─ Brevo (confirmation email)
                                          └─ Claude / Gemini (FAQ assistant)
```

Two npm workspaces (`frontend/`, `backend/`) in one repo, one root lockfile. The frontend never talks to the backend's own domain directly — Vercel rewrites `/api/*` to the Railway service, so every request the browser makes is same-origin.

### Why the `/api` rewrite exists

Admin auth is a JWT in an httpOnly cookie. With the frontend on `*.vercel.app` and the backend on `*.up.railway.app`, that cookie is cross-site — and Chrome and Safari's third-party-cookie policies drop it outright, `SameSite=None; Secure` or not. Login would appear to succeed and then every following request would silently come back 401. Routing everything through the Vercel rewrite makes the cookie first-party instead, which is the actual fix (see `frontend/src/services/db.js` and both `vercel.json` files).

### Admin auth

- Password is a bcrypt hash in an environment variable — never in the repo (`backend/scripts/hash-password.js` generates it).
- Session is a JWT in an httpOnly, `Secure`, `SameSite=None` cookie — not `localStorage`, so it can't be read or exfiltrated by client-side JavaScript.
- The frontend holds **no** client-side "is admin" state. `AdminGate` asks the backend `GET /api/admin/me` on every mount and renders nothing until it answers (`frontend/src/hooks/useAdminSession.js`).
- Every admin route is enforced server-side by `requireAdmin` (`backend/middleware/adminAuth.js`) — a hidden frontend route is not a security boundary here, the backend is.
- Login attempts are rate-limited per IP; admin responses are sent `Cache-Control: no-store`.

### FAQ assistant

`POST /api/chat` answers only from `backend/content/faq.json` (~200 entries), which is small enough to fit in a single Claude system prompt with prompt caching — no vector database needed at this scale. The model cites which FAQ entries it used; the backend turns those into clickable source links and strips anything it doesn't recognise, so a hallucinated citation can never reach the UI.

Claude and Gemini sit behind one interface (`backend/services/llm/`), selected by an environment variable, with automatic failover to the other provider on a rate limit or outage. The endpoint is public, so it's guarded independently of login: per-IP rate limits, a message-count and character cap, and a `CHAT_ENABLED` kill switch that returns 503 without a redeploy. `npm run check:faq` (also run in CI) validates the dataset's structure and checks that the facts it duplicates — team names, event titles, contact details — still exist in the frontend source.

## Tech stack

**Frontend** — React 19, Vite 6, Tailwind CSS 4, React Router 6. GSAP drives scroll-linked cinematic sections; anime.js (dynamically imported, with a silent fallback) handles menu and micro-interactions — the two are kept to disjoint DOM properties so they never fight over the same element. Everything respects `prefers-reduced-motion`.

**Backend** — Express 5, Mongoose/MongoDB. `backend/utils/excel.js` builds a styled, multi-sheet workbook (one tab per team, frozen headers, autofilter, status colour-coding, IST-corrected timestamps) with ExcelJS. `backend/utils/email.js` sends over Brevo's HTTP API rather than SMTP, worked around a hosting provider that blocks outbound SMTP.

**Tests & CI** — `node:test` (no extra test framework) covering admin-auth token verification, the Excel builder, and application validation; GitHub Actions runs lint, build, `check:faq` and the test suite on every push and PR.

## Local setup

```bash
git clone <repo-url> && cd GDG_Vimeet
npm ci                        # installs both workspaces from the one root lockfile

cp backend/.env.example backend/.env
# fill in MONGODB_URI, then generate the admin credentials:
node backend/scripts/hash-password.js "your-chosen-password"
# paste the output into ADMIN_USERNAME / ADMIN_PASSWORD_HASH / JWT_SECRET in backend/.env

npm run start:backend    # http://localhost:3000
npm run dev:frontend     # http://localhost:5173, proxies /api to :3000
```

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | backend | Database connection |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` | backend | Admin login (see `hash-password.js` above) |
| `CORS_ORIGIN` | backend | Exact deployed frontend origin(s) — required for the admin cookie in production |
| `BREVO_API_KEY`, `EMAIL_USER` | backend | Applicant confirmation emails (skipped silently if unset) |
| `LLM_PROVIDER`, `ANTHROPIC_API_KEY`, `CHAT_MODEL` | backend | FAQ assistant, Claude — **a Claude Pro subscription does not include API access**; this is a separate pay-as-you-go key from console.anthropic.com |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | backend | FAQ assistant, Gemini fallback |
| `CHAT_ENABLED` | backend | Set `false` to disable the assistant instantly |

Full list with comments: `backend/.env.example`.

## Scripts

```bash
npm run lint --workspace=frontend       # ESLint
npm run build --workspace=frontend      # production build
npm test --workspace=backend            # node:test suite
npm run check:faq --workspace=backend   # validates and syncs the FAQ dataset
```

## Project layout

```
frontend/src/
  sections/          route-level page components (Home, Team, Events, Contact, Recruitment)
  sections/admin/    admin dashboard, login, route guard
  components/chat/   the FAQ assistant widget
  data/              recruitment teams, events, team roster, site config
  animations/        the anime.js wrapper (GSAP lives inline in the sections that use it)
  services/          fetch wrappers — the only code that talks to the backend

backend/
  server.js          route definitions
  routes/            admin auth, chat
  middleware/        JWT auth, per-IP rate limiters
  services/llm/      Claude / Gemini provider adapter
  utils/             validation, Excel export, email, FAQ context builder
  content/faq.json   the FAQ dataset
```
