# Shlok Vaidya — portfolio

A single-page portfolio: React 19, Vite, Tailwind CSS v4 and Motion, with a glass (frosted and liquid) visual language over WebGL aurora backgrounds.

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
  index.css                design tokens, the glass recipe, reveal animation
  components/
    glass/GlassCard.tsx    the frosted panel used everywhere
    layout/                background, navigation, command menu, section wrapper
    sections/              Hero, About, Experience, Projects, Skills, Contact
    visuals/               the three animated project diagrams
    reactbits/             components imported from React Bits
    magicui/               components imported from Magic UI
    ui/                    shadcn/ui primitives
```

One rule worth knowing before editing: a glass panel must animate itself, never sit inside a wrapper that fades or has a CSS `filter`. An ancestor with `opacity < 1` or `filter` cuts the panel off from the page behind it and the backdrop blur disappears. `GlassCard` has a `reveal` prop for this.

## Credits

Imported open-source components, kept in their own folders with local changes noted at the top of each changed file:

- [React Bits](https://reactbits.dev) (MIT + Commons Clause): DarkVeil, SoftAurora, GlassSurface, SpotlightCard, RotatingText, DecryptedText, Magnet
- [Magic UI](https://magicui.design) (MIT): AnimatedBeam, Globe, Marquee, NumberTicker, BorderBeam, BlurFade, AnimatedCircularProgressBar, DotPattern, ScrollProgress, AnimatedShinyText, Particles
- [shadcn/ui](https://ui.shadcn.com) (MIT): command menu, dialog, toaster
- [Lenis](https://lenis.darkroom.engineering) smooth scrolling, [Motion](https://motion.dev) animation, [cobe](https://cobe.vercel.app) globe, [Lucide](https://lucide.dev) and [Simple Icons](https://simpleicons.org) icons, Geist and Instrument Serif typefaces
