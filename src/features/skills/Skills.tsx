import { ArrowUpRight, Plus, X } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Section } from '@/components/primitives/Section'
import { moreWork, projects, skillGroups, type ProjectSlug, type SkillGroupId } from '@/data/profile'
import { openProject } from '@/features/projects/store'
import { dur, ease, spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Work = { key: string; title: string; year?: string; stack: string[]; slug?: ProjectSlug; url?: string }

// Every project on the page, featured first.
const WORK: Work[] = [
  ...projects.map(p => ({ key: p.slug, title: p.title, year: p.year, stack: p.stack, slug: p.slug, url: p.repo })),
  ...moreWork.map(r => ({ key: r.url ?? r.title, title: r.title, year: r.year, stack: r.stack, url: r.url })),
]

const usage = (skill: string) => WORK.filter(w => w.stack.includes(skill))

type GroupFilter = SkillGroupId | 'all'

export function Skills() {
  const reduce = useReducedMotion()
  const [group, setGroup] = useState<GroupFilter>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const focus = hovered ?? selected

  const visible = useMemo(
    () => skillGroups.filter(g => group === 'all' || g.id === group).flatMap(g => g.items.map(item => ({ item, group: g.id }))),
    [group],
  )
  const related = useMemo(() => new Set(focus ? usage(focus).map(w => w.key) : []), [focus])

  const filters: { id: GroupFilter; label: string }[] = [{ id: 'all', label: 'All' }, ...skillGroups.map(g => ({ id: g.id, label: g.title }))]

  return (
    <Section
      id="skills"
      index="04"
      label="Skills"
      title="Skills, linked to the work"
      intro="Pick a skill to see which projects use it."
    >
      {/* Group filter */}
      <LayoutGroup id="skill-filter">
        <div role="toolbar" aria-label="Filter skills by area" className="surface -mx-1 mb-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1">
          {filters.map(f => {
            const on = group === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setGroup(f.id)}
                className={cn(
                  'relative h-9 shrink-0 rounded-full px-4 text-sm transition-colors duration-(--dur-2)',
                  on ? 'text-paper' : 'text-ink-3 hover:text-ink',
                )}
              >
                {on ? <motion.span layoutId="skill-filter-pill" transition={spring.layout} className="absolute inset-0 rounded-full bg-ink" /> : null}
                <span className="relative">{f.label}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      {/* Small screens: the related list sits far below the chips, so summarise it here. */}
      <p className="-mt-4 mb-6 min-h-10 text-sm text-ink-2 lg:hidden" aria-hidden="true">
        {selected ? (
          related.size ? (
            <>
              <span className="text-accent">{selected}</span> is used in {WORK.filter(w => related.has(w.key)).map(w => w.title).join(', ')}.
            </>
          ) : (
            <>No project on this page lists {selected} in its stack.</>
          )
        ) : (
          'Tap a skill to see where it’s used.'
        )}
      </p>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Skill chips */}
        <motion.ul layout={!reduce} className="flex flex-wrap content-start gap-2" aria-label="Skills">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ item }) => {
              const count = usage(item).length
              const on = selected === item
              return (
                <motion.li
                  key={item}
                  layout={!reduce}
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
                  transition={{ duration: dur[3], ease: ease.out }}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(s => (s === item ? null : item))}
                    onPointerEnter={e => e.pointerType === 'mouse' && setHovered(item)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn(
                      'group inline-flex h-11 items-center gap-2.5 rounded-full border pl-4 pr-2 text-sm transition-[background-color,border-color,color,box-shadow] duration-(--dur-2)',
                      on
                        ? 'border-accent bg-accent text-on-accent shadow-2'
                        : 'surface text-ink hover:border-line-strong hover:shadow-2',
                    )}
                  >
                    {item}
                    <span
                      className={cn(
                        'num grid h-6 min-w-6 place-items-center rounded-full px-1.5 font-mono text-2xs',
                        on ? 'bg-on-accent/20 text-on-accent' : count ? 'bg-sunken text-ink-2' : 'border border-dashed border-line-strong text-ink-3',
                      )}
                    >
                      {on ? <X className="size-3" aria-hidden="true" /> : count}
                      <span className="sr-only">{on ? ', selected' : `, used in ${count} project${count === 1 ? '' : 's'}`}</span>
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>

        {/* Related work */}
        <aside aria-labelledby="skills-related" className="surface self-start rounded-xl p-2 lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
          <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-4">
            <h3 id="skills-related" className="label">
              {focus ? (
                <>
                  Using <span className="text-accent">{focus}</span>
                </>
              ) : (
                'All projects'
              )}
            </h3>
            <span className="num font-mono text-2xs text-ink-3" aria-live="polite">
              {focus ? `${related.size} of ${WORK.length}` : WORK.length}
            </span>
          </div>

          {focus && related.size === 0 ? (
            <p className="mx-2 mb-2 rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-3">
              No project on this page lists {focus} in its stack.
            </p>
          ) : null}

          <ul>
            {WORK.map(w => {
              const lit = !focus || related.has(w.key)
              const Row = w.slug || w.url ? 'a' : 'div'
              return (
                <li key={w.key}>
                  <Row
                    {...(w.slug ? { href: `#projects/${w.slug}` } : w.url ? { href: w.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={e => {
                      if (!w.slug) return
                      e.preventDefault()
                      openProject(w.slug)
                    }}
                    className={cn(
                      'group flex h-11 items-center gap-3 rounded-md px-4 text-sm transition-[opacity,background-color,color] duration-(--dur-3)',
                      lit ? 'text-ink hover:bg-sunken' : 'text-ink-3 opacity-40 hover:opacity-100',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-(--dur-3)',
                        focus && lit ? 'scale-150 bg-accent' : 'bg-line-strong',
                      )}
                    />
                    <span className="truncate">{w.title}</span>
                    <span className="num ml-auto font-mono text-2xs text-ink-3">{w.year}</span>
                    {w.slug ? (
                      <Plus className="size-3.5 shrink-0 text-ink-3 group-hover:text-accent" aria-label="Open case study" />
                    ) : w.url ? (
                      <ArrowUpRight className="size-3.5 shrink-0 text-ink-3 group-hover:text-accent" aria-label="Opens GitHub in a new tab" />
                    ) : (
                      <span className="size-3.5 shrink-0" aria-hidden="true" />
                    )}
                  </Row>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>
    </Section>
  )
}
