import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const NAV_OFFSET = -96

const LenisContext = createContext<Lenis | null>(null)

/** Inertial smooth scrolling (Lenis). Skipped when the visitor prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const instance = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1 })
    setLenis(instance)
    if (import.meta.env.DEV) Object.assign(window, { __lenis: instance })
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** Scroll to a section id ("about") or to the top ("top"). */
export function useScrollTo() {
  const lenis = useContext(LenisContext)
  return useCallback(
    (id: string) => {
      const target = id === 'top' ? null : document.getElementById(id)
      if (lenis) {
        lenis.scrollTo(target ?? 0, { offset: target ? NAV_OFFSET : 0, duration: 1.15 })
      } else if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else {
        window.scrollTo({ top: 0 })
      }
      if (target) history.replaceState(null, '', `#${id}`)
      else history.replaceState(null, '', location.pathname + location.search)
    },
    [lenis],
  )
}

/** Pause page scrolling while an overlay (command menu) is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useContext(LenisContext)
  useEffect(() => {
    if (!lenis || !locked) return undefined
    lenis.stop()
    return () => lenis.start()
  }, [lenis, locked])
}
