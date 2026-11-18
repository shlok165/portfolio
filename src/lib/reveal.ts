import { useEffect, type CSSProperties } from 'react'

/**
 * Props that make an element fade and rise into place when it scrolls into view.
 * Spread onto the element itself: `<GlassCard {...reveal(120)}>`.
 */
export function reveal(delayMs = 0) {
  return {
    'data-reveal': '',
    style: { '--reveal-delay': `${delayMs}ms` } as CSSProperties,
  }
}

/** Call once at the app root: marks every [data-reveal] element as it enters the viewport. */
export function useRevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      for (const el of targets) el.dataset.revealed = ''
      return undefined
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = ''
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [])
}
