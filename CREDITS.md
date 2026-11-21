# Credits

Everything below is open source. Licences were read from each package's own
`package.json` / licence file at the version installed (November 2026).

## Code adapted into this repository

| What | Where in this repo | Source | Licence |
|---|---|---|---|
| Dialog wrapper (restyled) | `src/components/ui/dialog.tsx` | [shadcn/ui](https://ui.shadcn.com) | MIT |
| Command wrapper (restyled) | `src/components/ui/command.tsx` | [shadcn/ui](https://ui.shadcn.com) | MIT |
| Toaster wrapper (restyled) | `src/components/ui/sonner.tsx` | [shadcn/ui](https://ui.shadcn.com) | MIT |
| GitHub, LeetCode, Codeforces glyphs | `src/components/icons.tsx` | [Simple Icons](https://simpleicons.org) | CC0 1.0 |
| LinkedIn glyph | `src/components/icons.tsx` | LinkedIn brand guidelines | Trademark of LinkedIn; used to link to the profile |

All three shadcn/ui wrappers were rewritten against this site's tokens
(`--surface`, `--line`, `--accent`, the radius and motion scales). No other
component code was copied. The hero field, tilt cards, magnetic buttons,
split text, count-up, timeline, case-study transition and the three project
visuals are original.

## Runtime libraries

| Package | Version | Used for | Licence |
|---|---|---|---|
| react, react-dom | 19.3.1 | UI | MIT |
| motion | 12.43.0 | Component, layout and shared-element animation | MIT |
| gsap (+ ScrollTrigger) | 3.15.1 | Scroll-scrubbed timeline progress | **GSAP Standard "No Charge" License**, not MIT/Apache. Free for this use; see https://gsap.com/standard-license |
| lenis | 1.3.27 | Smooth scrolling | MIT |
| ogl | 1.0.11 | WebGL dot field in the hero | Unlicense (public domain) |
| @radix-ui/react-dialog | 1.3.1 | Accessible dialogs (menu, ⌘K, case studies) | MIT |
| cmdk | 1.1.1 | Command palette | MIT |
| sonner | 2.0.8 | Toasts | MIT |
| lucide-react | 1.73.0 | Icons | ISC (permissive, MIT-equivalent) |
| tailwindcss | 4.3.5 | Styling | MIT |
| tw-animate-css | 1.4.0 | Enter/exit keyframes for Radix dialogs | MIT |
| cn | 0.5.2 | Class name joining | MIT |

## Fonts

| Font | Package | Licence |
|---|---|---|
| Bricolage Grotesque (display) | @fontsource-variable/bricolage-grotesque 5.3.0 | SIL Open Font License 1.1 |
| Geist (text) | @fontsource-variable/geist 5.3.0 | SIL Open Font License 1.1 |
| Geist Mono (data, labels) | @fontsource-variable/geist-mono 5.3.0 | SIL Open Font License 1.1 |

## Note on the brief's licence rule

The brief asked for MIT/Apache only. Everything adapted into the repo is MIT
or CC0. Among libraries, GSAP is the one that isn't under an OSI licence; it
was kept because the brief names GSAP + ScrollTrigger explicitly. OGL
(Unlicense), Lucide (ISC) and the OFL fonts are permissive but technically not
MIT/Apache. To remove GSAP, the timeline's progress line can be driven by
Motion's `useScroll` instead (`src/features/timeline/Timeline.tsx`).

React Bits components used in the previous version were removed: React Bits
is MIT + Commons Clause, which isn't MIT/Apache.
