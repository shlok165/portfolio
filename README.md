# Shlok Vaidya — portfolio

A single-page portfolio: React 19, Vite, Tailwind CSS v4 and Motion. Light, technical look: paper background, white hairline panels, Geist and Geist Mono, one blue accent, and diagram panels on an engineering grid.

The first iteration (dark liquid-glass theme) is saved in git as the tag `v1-dark-glass`: `git checkout v1-dark-glass` to see it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

Needs Node 20.19+ or 22.12+ (developed on Node 24).

## Change the content

Everything the site says lives in one file: [`src/data/profile.ts`](src/data/profile.ts).

| To change | Edit |
|---|---|
| Name, email, location, availability line | `site` |
| GitHub / LinkedIn / LeetCode / Codeforces links | `socials` (an empty string hides the link everywhere) |
| Hero rotating phrases and intro line | `hero` |
| The four headline numbers | `stats` |
| Bio and "right now" list | `about` |
| Coding, AI & SDE and Robotics tiles | `profiles` |
| Education, CGPA ring, coursework | `education`, `cgpa`, `coursework` |
| Internship and other roles | `internship`, `involvement` |
| The three featured projects | `projects` |
| The "More from GitHub" grid | `moreWork` |
| Skill groups | `skills` |

**Résumé button:** put your PDF at `public/resume.pdf`. The résumé buttons (nav, hero, contact, command menu) appear automatically on the next `npm run dev` or build, and stay hidden while the file is absent.

**Social preview image:** `public/og.png`. Link previews need an absolute URL, so once the site is live set `og:image` in `index.html` to the full address, for example `https://your-domain/og.png`.

## Deploy

The build uses relative asset paths, so `dist/` works at a domain root or under a sub-path without changes.

- **GitHub Pages:** push this folder to a repository, then in Settings → Pages set Source to "GitHub Actions". The included workflow (`.github/workflows/deploy.yml`) builds and publishes on every push to `main`. A repository named `portfolio` is served at `https://<user>.github.io/portfolio/`.
- **Vercel / Netlify:** import the repository; build command `npm run build`, output directory `dist`.

## How it is put together

```
src/
  data/profile.ts          all content
  index.css                design tokens, panel / grid utilities, reveal animation
  components/
    layout/Panel.tsx       the white panel used everywhere
    layout/                page frame, navigation, command menu, section wrapper
    sections/              Hero, About, Experience, Projects, Skills, Contact
    visuals/               the three animated project diagrams
    reactbits/             components imported from React Bits
    magicui/               components imported from Magic UI
    ui/                    shadcn/ui primitives
```

Colours live as tokens at the top of `src/index.css` (`--paper`, `--ink`, `--signal` for the blue accent, and five per-item tones). `TONE_HEX` and `SIGNAL` in `profile.ts` mirror them for places that need a raw colour (charts, the globe).

## Credits

Imported open-source components, kept in their own folders with local changes noted at the top of each changed file:

- [React Bits](https://reactbits.dev) (MIT + Commons Clause): SpotlightCard, RotatingText, DecryptedText
- [Magic UI](https://magicui.design) (MIT): Terminal, FlickeringGrid, AnimatedBeam, Globe, Marquee, NumberTicker, BlurFade, AnimatedCircularProgressBar, ScrollProgress
- [shadcn/ui](https://ui.shadcn.com) (MIT): command menu, dialog, toaster
- [Lenis](https://lenis.darkroom.engineering) smooth scrolling, [Motion](https://motion.dev) animation, [cobe](https://cobe.vercel.app) globe, [Lucide](https://lucide.dev) and [Simple Icons](https://simpleicons.org) icons, Geist and Geist Mono typefaces
