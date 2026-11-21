// Prerender: inject the server-rendered HTML of each page into the built HTML
// files, so the first paint needs only HTML + CSS, then preload the two
// above-the-fold font files. Runs after `vite build` and the SSR build.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const { render } = await import(pathToFileURL(path.join(root, 'node_modules/.cache/prerender/entry-server.js')).href)

/**
 * The prerendered page is readable without JavaScript, so the app bundle is
 * requested just after the first frame is painted instead of competing with
 * the CSS and fonts for it. Trade-off: on slow phones, hydration (and with it
 * interactivity) starts a few hundred ms later; the content shows sooner.
 */
function deferAfterFirstPaint(html) {
  const entry = /<script type="module" crossorigin src="(\.\/assets\/main-[^"]+\.js)"><\/script>/
  const match = html.match(entry)
  if (!match) throw new Error('main entry script not found')
  return html
    .replace(/\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, '')
    .replace(
      entry,
      // Start on the browser's first-contentful-paint entry; fall back to a short
      // timer where the Paint Timing API is missing or the entry never arrives.
      `<script type="module">
      let started = false
      const start = () => started || ((started = true), import('${match[1]}'))
      try {
        new PerformanceObserver(list => list.getEntriesByName('first-contentful-paint').length && start()).observe({ type: 'paint', buffered: true })
      } catch {}
      setTimeout(start, 1500)
    </script>`,
    )
}

const assets = readdirSync(path.join(dist, 'assets'))
const font = prefix => assets.find(f => f.startsWith(prefix) && f.endsWith('.woff2'))
const preloads = ['bricolage-grotesque-latin-wdth-normal-', 'geist-latin-wght-normal-']
  .map(font)
  .filter(Boolean)
  .map(f => `<link rel="preload" href="./assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

for (const [file, page] of [
  ['index.html', 'main'],
  ['resume.html', 'resume'],
]) {
  const target = path.join(dist, file)
  let html = readFileSync(target, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`${file}: empty #root not found`)
  html = html.replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`)
  if (page === 'main') {
    html = html.replace('</head>', `  ${preloads}\n  </head>`)
    html = deferAfterFirstPaint(html)
  }
  writeFileSync(target, html)
  console.log(`prerendered ${file} (${(html.length / 1024).toFixed(1)} kB)`)
}
