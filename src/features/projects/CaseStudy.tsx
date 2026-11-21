import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, type ComponentType } from 'react'
import { SocialIcon } from '@/components/icons'
import { buttonClass, Kbd, LinkButton } from '@/components/primitives/Button'
import { projects, type ProjectSlug } from '@/data/profile'
import { dur, ease, spring } from '@/lib/motion'
import { useScrollLock } from '@/lib/scroll'
import { closeProject, openProject, useOpenProject } from './store'

// Each visual is its own chunk, fetched the first time its case study opens.
const VISUALS: Record<ProjectSlug, ComponentType> = {
  rag: lazy(() => import('./visuals/RouterDemo')),
  recon: lazy(() => import('./visuals/ResolutionGrid')),
  water: lazy(() => import('./visuals/SensorDemo')),
}

function VisualSkeleton() {
  return (
    <div className="grid h-full min-h-[22rem] gap-3" aria-label="Loading visual" role="status">
      <div className="skeleton h-10 rounded-md" />
      <div className="skeleton h-40 rounded-md" />
      <div className="grid grid-cols-3 gap-3">
        <div className="skeleton h-16 rounded-md" />
        <div className="skeleton h-16 rounded-md" />
        <div className="skeleton h-16 rounded-md" />
      </div>
    </div>
  )
}

/**
 * The case-study view. A Radix dialog (focus trap, Esc, aria-modal) whose panel
 * shares layoutIds with the card it opened from. ← / → move between projects.
 */
export function CaseStudy() {
  const slug = useOpenProject()
  const reduce = useReducedMotion()
  useScrollLock(slug !== null)

  const i = projects.findIndex(p => p.slug === slug)
  const project = i >= 0 ? projects[i] : undefined
  const prev = projects[(i - 1 + projects.length) % projects.length]!
  const next = projects[(i + 1) % projects.length]!

  useEffect(() => {
    if (!slug) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [role="radiogroup"], [role="tablist"]')) return
      if (event.key === 'ArrowRight') openProject(next.slug)
      if (event.key === 'ArrowLeft') openProject(prev.slug)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slug, next.slug, prev.slug])

  // Remember the last project so focus can return to its card on close, even
  // after browsing to other projects (which remounts the dialog content).
  const last = useRef(slug)
  useEffect(() => {
    if (slug) last.current = slug
  }, [slug])

  const Visual = project ? VISUALS[project.slug] : null
  const GitHub = SocialIcon.github

  return (
    <DialogPrimitive.Root open={Boolean(project)} onOpenChange={open => !open && closeProject()}>
      <AnimatePresence>
        {project && Visual ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-[rgb(23_22_15/0.22)] backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur[3], ease: ease.out }}
              />
            </DialogPrimitive.Overlay>
            <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
              <DialogPrimitive.Content
                forceMount
                asChild
                aria-describedby={undefined}
                onCloseAutoFocus={event => {
                  event.preventDefault()
                  document.querySelector<HTMLElement>(`[data-project-trigger="${last.current}"]`)?.focus({ preventScroll: true })
                }}
              >
                <motion.div
                  key={project.slug}
                  layoutId={`card-${project.slug}`}
                  transition={spring.layout}
                  style={{ borderRadius: 20 }}
                  className="surface pointer-events-auto relative flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden shadow-3 outline-none max-sm:rounded-b-none!"
                >
                  {/* Header */}
                  <header className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-8 sm:py-5">
                    <div className="min-w-0 flex-1">
                      <p className="label flex items-center gap-2">
                        <span className="num text-accent">{project.index}</span>
                        {project.kicker}
                        <span aria-hidden="true">·</span>
                        <span className="num">{project.year}</span>
                      </p>
                      <DialogPrimitive.Title asChild>
                        <motion.h2 layoutId={`title-${project.slug}`} transition={spring.layout} className="mt-2 text-2xl text-ink sm:text-3xl">
                          {project.title}
                        </motion.h2>
                      </DialogPrimitive.Title>
                    </div>
                    <DialogPrimitive.Close className={buttonClass('outline', 'icon', 'shrink-0')} aria-label="Close case study">
                      <X aria-hidden="true" />
                    </DialogPrimitive.Close>
                  </header>

                  {/* Body: scrolls inside the dialog, not the page */}
                  <motion.div
                    data-lenis-prevent
                    className="grid flex-1 overflow-y-auto overscroll-contain lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: dur[1] } }}
                    transition={{ duration: dur[4], ease: ease.out, delay: reduce ? 0 : 0.15 }}
                  >
                    <div className="px-5 py-6 sm:px-8 sm:py-8">
                      <p className="text-lg text-ink">{project.summary}</p>

                      <dl
                        className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line"
                        style={{ gridTemplateColumns: `repeat(${project.metrics.length}, minmax(0, 1fr))` }}
                      >
                        {project.metrics.map(m => (
                          <div key={m.label} className="bg-surface px-4 py-3">
                            <dd className="num font-display text-xl font-semibold tracking-tighter text-ink">
                              {m.prefix}
                              {m.value.toLocaleString('en-IN', { minimumFractionDigits: m.decimals ?? 0 })}
                              {m.suffix}
                            </dd>
                            <dt className="mt-0.5 text-xs text-ink-3">{m.label}</dt>
                          </div>
                        ))}
                      </dl>

                      <h3 className="label mt-8">What I built</h3>
                      <ul className="mt-3 grid gap-3 text-base text-ink-2">
                        {project.points.map(point => (
                          <li key={point} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-accent">
                            {point}
                          </li>
                        ))}
                      </ul>

                      <h3 className="label mt-8">Stack</h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {project.stack.map(s => (
                          <li key={s} className="rounded-sm border border-line bg-paper px-2 py-1 font-mono text-2xs text-ink-2">
                            {s}
                          </li>
                        ))}
                      </ul>

                      <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
                        <div>
                          <dt className="text-ink-3">Role</dt>
                          <dd className="mt-0.5 text-ink">{project.role}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-3">Year</dt>
                          <dd className="num mt-0.5 text-ink">{project.year}</dd>
                        </div>
                      </dl>

                      <LinkButton href={project.repo} external variant="primary" className="mt-8" icon={<GitHub />}>
                        View the code
                        <ArrowUpRight aria-hidden="true" />
                      </LinkButton>
                    </div>

                    <div className="border-line bg-paper px-5 py-6 sm:px-8 sm:py-8 max-lg:border-t lg:border-l">
                      <Suspense fallback={<VisualSkeleton />}>
                        <Visual />
                      </Suspense>
                    </div>
                  </motion.div>

                  {/* Footer: move between projects */}
                  <footer className="flex items-center justify-between gap-2 border-t border-line px-3 py-2 sm:px-5">
                    <button type="button" onClick={() => openProject(prev.slug)} className={buttonClass('ghost', 'sm', 'min-w-0')}>
                      <ArrowLeft aria-hidden="true" />
                      <span className="truncate">
                        <span className="sr-only">Previous project: </span>
                        {prev.title}
                      </span>
                    </button>
                    <span className="hidden items-center gap-1 text-2xs text-ink-3 md:flex" aria-hidden="true">
                      <Kbd>←</Kbd>
                      <Kbd>→</Kbd>
                      <span className="ml-1">to browse</span>
                      <Kbd className="ml-3">Esc</Kbd>
                      <span className="ml-1">to close</span>
                    </span>
                    <button type="button" onClick={() => openProject(next.slug)} className={buttonClass('ghost', 'sm', 'min-w-0')}>
                      <span className="truncate">
                        <span className="sr-only">Next project: </span>
                        {next.title}
                      </span>
                      <ArrowRight aria-hidden="true" />
                    </button>
                  </footer>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
