import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

/**
 * Inertial smooth scrolling (Lenis). Not created when the visitor prefers
 * reduced motion, so native scrolling and native anchor jumps take over.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const instance = new Lenis({ autoRaf: true, lerp: 0.12, anchors: false })
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Scroll to a section id, or to the top with 'top'. Moves focus for keyboard users. */
export function useScrollTo() {
  const lenis = useLenis()
  return useCallback(
    (id: string) => {
      const target = id === 'top' ? null : document.getElementById(id)
      const offset = -parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || '0')
      if (lenis) lenis.scrollTo(target ?? 0, { offset: target ? offset : 0, duration: 1.1 })
      else if (target) target.scrollIntoView({ block: 'start' })
      else window.scrollTo({ top: 0 })

      if (target) {
        history.replaceState(null, '', `#${id}`)
        // Send focus to the section so the next Tab continues from there.
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      } else {
        history.replaceState(null, '', location.pathname + location.search)
      }
    },
    [lenis],
  )
}

/** Pause page scrolling while an overlay is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis || !locked) return undefined
    lenis.stop()
    return () => lenis.start()
  }, [lenis, locked])
}
