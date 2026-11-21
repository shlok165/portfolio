import { useSyncExternalStore } from 'react'
import { projects, type ProjectSlug } from '@/data/profile'

/**
 * Which project's case study is open. A tiny external store, so the command
 * menu, the cards and the overlay can all open or close a project without
 * threading props through the page. The open project is mirrored in the URL
 * (#projects/rag) so a case study can be linked to directly.
 */
let current: ProjectSlug | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(fn => fn())

const HASH = /^#projects\/([a-z]+)$/

export function openProject(slug: ProjectSlug) {
  current = slug
  history.replaceState(null, '', `#projects/${slug}`)
  emit()
}

export function closeProject() {
  if (!current) return
  current = null
  history.replaceState(null, '', '#projects')
  emit()
}

/** Open the case study named in the URL on first load. */
export function readProjectFromHash() {
  const slug = HASH.exec(location.hash)?.[1]
  const match = projects.find(p => p.slug === slug)
  if (match) {
    current = match.slug
    emit()
  }
}

export function useOpenProject() {
  return useSyncExternalStore(
    fn => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => current,
    () => null,
  )
}
