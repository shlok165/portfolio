import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * True on Apple platforms, where the shortcut modifier is ⌘ rather than Ctrl.
 * The prerendered HTML says "Ctrl"; Apple visitors get "⌘" right after
 * hydration without a hydration mismatch.
 */
export function useIsMac() {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false,
  )
}

export function useModKey() {
  return useIsMac() ? '⌘' : 'Ctrl'
}
