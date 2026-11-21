import { useEffect, useState, useSyncExternalStore } from 'react'

/** Subscribe to a media query. Returns false during the first render on the server-less build. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    callback => {
      const list = window.matchMedia(query)
      list.addEventListener('change', callback)
      return () => list.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices with a precise pointer that can hover (mouse, trackpad). */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/** Which of the given section ids is currently under the nav line. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        const current = ids.find(id => visible.get(id))
        setActive(current ?? null)
      },
      // A thin band 30% down the viewport: whichever section crosses it is "current".
      { rootMargin: '-30% 0px -69% 0px' },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids])

  return active
}

/** Current time in a time zone, ticking each minute. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState(() => formatTime(timeZone))
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(timeZone)), 15_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())
}
