import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently crossing the middle of the viewport,
 * or 'top' while the hero is on screen.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>('top')

  useEffect(() => {
    const elements = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return undefined

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Later sections win when two overlap the probe line.
        const current = [...ids].reverse().find(id => visible.has(id))
        setActive(current ?? (window.scrollY < window.innerHeight * 0.6 ? 'top' : ids[0]))
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids])

  return active
}
