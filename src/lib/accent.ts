import { useSyncExternalStore } from 'react'

export const ACCENTS = [
  { id: 'vermilion', label: 'Vermilion', swatch: '#c2380c' },
  { id: 'cobalt', label: 'Cobalt', swatch: '#2346d8' },
  { id: 'forest', label: 'Forest', swatch: '#17734f' },
  { id: 'plum', label: 'Plum', swatch: '#8a2e7a' },
] as const

export type AccentId = (typeof ACCENTS)[number]['id']

const KEY = 'accent'
const listeners = new Set<() => void>()

function read(): AccentId {
  const value = document.documentElement.dataset.accent
  return ACCENTS.some(a => a.id === value) ? (value as AccentId) : 'vermilion'
}

/**
 * Apply an accent. The value lives on <html data-accent>, which index.html
 * sets before first paint from localStorage, so there's no flash on reload.
 */
export function setAccent(id: AccentId) {
  const root = document.documentElement
  const apply = () => {
    if (id === 'vermilion') delete root.dataset.accent
    else root.dataset.accent = id
    listeners.forEach(fn => fn())
  }
  // Cross-fade the whole page where the browser supports view transitions.
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduce) doc.startViewTransition(apply)
  else apply()
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* storage unavailable (private mode): the choice lasts for this visit only */
  }
}

export function useAccent() {
  return useSyncExternalStore(
    fn => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    read,
    () => 'vermilion' as AccentId,
  )
}

/** Resolved CSS value of a custom property, e.g. for WebGL uniforms. */
export function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
