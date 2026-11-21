# Shlok Vaidya: portfolio

A one-page portfolio and living CV. React 19 + Vite + TypeScript (strict) +
Tailwind CSS v4, with Motion, GSAP ScrollTrigger, Lenis and a small OGL
WebGL field. All copy comes from one typed data file, and the same data
generates a printable one-page résumé.

Previous versions are kept as git tags: `v1-dark-glass` (dark glass theme) and
`v2-light-wip` (first light-theme attempt).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (client-rendered, hot reload)
npm run build      # type-check, client build, SSR build, prerender → dist/
npm run preview    # serve dist/ (the real, prerendered site)
npm run lint
```

Needs Node 20.19+ or 22.12+ (developed on Node 24).

## Change the content

Everything the site says is in [`src/data/profile.ts`](src/data/profile.ts):
`site` (name, email, phone, links to résumé, status line), `socials`, `summary`,
`stats`, `education`, `coursework`, `timeline`, `projects`, `moreWork`,
`skillGroups`, `achievements`, `responsibilities`.

- **Skills ↔ projects:** a skill highlights every project whose `stack`
  contains the exact same string. Rename both together.
- **Résumé PDF download:** put a PDF at `public/resume.pdf`. The download
  buttons appear on the next build and stay hidden while it's missing.
- **Contact form:** set `VITE_CONTACT_ENDPOINT` in `.env` to any
  Formspree-compatible endpoint (POST JSON, 2xx on success). Without it, the
  form opens the visitor's mail app with the message filled in.
- **Domain:** the site lives at https://shlok165.github.io/portfolio/. To move it,
  replace that address in `src/data/profile.ts`, `index.html`, `resume.html`,
  `public/robots.txt` and `public/sitemap.xml`.

## Deploy

`dist/` is static and uses relative paths, so it works at a domain root or
under a sub-path.

- **Vercel / Netlify:** import the repo. Build command `npm run build`,
  output directory `dist`. Set `VITE_CONTACT_ENDPOINT` in the project's
  environment variables if you use the form.
- **GitHub Pages:** `.github/workflows/deploy.yml` builds and publishes on
  push to `main` (Settings → Pages → Source: GitHub Actions). Use a repo other
  than `shlok165.github.io`, which already hosts another site.

## Features

- **Hero:** split-character name reveal, a cursor-reactive WebGL dot field
  (OGL, lazy-loaded, pauses off-screen, CSS fallback), magnetic CTAs, live
  local time, copy-email, and the five headline numbers counting up.
  Name, degree, institute, links and key numbers are all above the fold.
- **About bento:** spring tilt + cursor spotlight tiles; animated CGPA bar;
  a 23-cell strip showing 6th of 23 IITs.
- **Timeline:** experience and education as one list. On desktop the left
  column stays pinned and swaps a large date marker as you scroll; a
  GSAP-scrubbed line fills along the entries; the mini-index jumps to any entry.
- **Projects:** cards grow into a case-study dialog via shared-element
  (`layoutId`) transitions; ←/→ browse, Esc closes, focus returns to the card,
  and the URL updates (`#projects/rag`) so a case study can be linked to.
  Each case study lazy-loads an interactive visual built from the CV's own
  description:
  - *Ask IIT Ropar:* the rule-based router's three routes, auto-cycling until
    you pick one.
  - *Reconciliation agent:* 200 cases as 200 squares: 196 matched, 4
    escalated, 0 forced (derived from the stated 98% recall / 100% precision).
  - *AquaIntegrity:* a simulated live feed of pH, turbidity and conductivity
    with a "Simulate contamination" button that trips the anomaly flag.
- **More on GitHub:** six further repositories as a compact list.
- **Skills:** area filter plus skill chips; picking one lights up the projects
  that use it, with counts and an empty state.
- **Contact:** validated form (inline errors, focus to first error),
  optimistic "sent" state that rolls back with a Retry toast on failure,
  honeypot, copy-email with confirmation, phone and profiles.
- **⌘K / Ctrl+K palette:** sections, case studies, repos, copy email,
  résumé view/print/download, accent switch, profiles.
- **Accent switcher:** vermilion, cobalt, forest, plum. Each passes WCAG AA;
  the choice persists and is applied before first paint.
- **Résumé page** (`/resume.html`): one A4 page generated from the same data,
  with a print stylesheet; `?print` opens the print dialog.
- Custom cursor ring (fine pointers only), scroll progress bar, animated
  underlines, skeleton states for lazy visuals.

## Architecture

```
src/
  data/profile.ts            all content, typed
  index.css                  design tokens (colour, type, radius, shadow, motion) + utilities
  lib/                       motion tokens, Lenis scroll, accent store, hooks, platform, actions
  components/
    primitives/              Button, Section, SplitText, CountUp, Magnetic, TiltCard
    chrome/                  Navbar, Footer, Cursor, ScrollProgress, AccentSwitcher
    ui/                      shadcn/ui wrappers (dialog, command, sonner), restyled
    icons.tsx                brand glyphs
  features/
    hero/                    Hero, DotField (OGL)
    about/  timeline/  skills/  contact/  command/  resume/
    projects/                cards, case-study dialog, open-project store, visuals/
  entry-server.tsx           build-time render of both pages
scripts/prerender.mjs        injects the rendered HTML, preloads fonts, defers the app bundle
```

### Build pipeline

1. `vite build` builds two pages from one codebase (`index.html`, `resume.html`).
2. `vite build --ssr src/entry-server.tsx` builds a Node renderer.
3. `scripts/prerender.mjs` writes the rendered HTML into both pages, preloads
   the two above-the-fold fonts, and changes the main bundle to start
   downloading on the browser's first-contentful-paint event.

The browser paints real content from HTML + CSS alone; React then hydrates
the same DOM.

## Design decisions

- **Warm paper, one accent.** Base `#f6f4ef`, never pure white; raised
  surfaces are one step lighter with a 1px hairline and a warm, layered shadow.
  The single accent (vermilion `#c2380c`) is dark enough to pass AA both as
  text on every surface and under white text, so one token serves both roles.
- **Three typefaces, three jobs.** Bricolage Grotesque (display, slightly
  condensed via the width axis) for headings and big numbers; Geist for
  reading; Geist Mono for labels, dates and data. A 1.25 modular scale;
  −0.035em tracking on headings; tabular figures everywhere numbers appear.
- **Tokens first.** Colours, radii, type scale, easings and durations are CSS
  variables in `index.css`, mirrored in `src/lib/motion.ts` for JS animation.
  Components never use raw values.
- **Motion rules.** Entrances use ease-out and stagger 40–80ms; things that
  move between states use ease-in-out; anything the pointer drives (tilt,
  magnet, cursor) uses springs. Only transform and opacity animate (plus a
  clip-path wipe in the hero). With `prefers-reduced-motion`, Lenis isn't
  started, the timeline doesn't scrub, the WebGL field draws one still frame,
  auto-cycling stops and transforms are dropped.
- **Pinned with `position: sticky`, scrubbed with GSAP.** ScrollTrigger's
  `pin` adds a pin-spacer and reflows; sticky pins with zero layout shift.
  GSAP does what it's best at: the scrubbed line and active-entry triggers.
- **Native cursor stays.** The ring adds feedback and labels; replacing the
  pointer would cost precision and accessibility.
- **Case studies are dialogs, not routes.** One page, no router; a Radix
  dialog gives focus trapping and Esc, and the hash makes each one linkable.
- **Copy stays factual.** Numbers and claims come from the CV; the visuals
  either restate them or are labelled as simulated.

## Quality checks (production build, local preview)

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Lighthouse, mobile | 99 | 100 | 100 | 100 |
| Lighthouse, desktop | 100 | 100 | 100 | 100 |
| Résumé page, mobile | 96 | 100 | 100 | 100 |

Mobile: LCP 2.0s, FCP 1.1s, TBT ~100ms, CLS 0 (simulated slow 4G).
axe-core (WCAG 2.2 AA + best practices): 0 violations on the page, with a
case study open, and on the résumé page.

**Trade-off to know about:** because the app bundle starts loading after first
paint, on a slow phone the page is readable before buttons respond (about a
few hundred ms later than a normal script tag). Content-first was the
deliberate choice. To revert, delete the `deferAfterFirstPaint` call in
`scripts/prerender.mjs`.
