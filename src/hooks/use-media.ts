import { useSyncExternalStore } from 'react'

/** Subscribe to a CSS media query. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    onChange => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices with a mouse or trackpad (hover-capable, fine pointer). */
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')
