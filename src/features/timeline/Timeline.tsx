import { BriefcaseBusiness, GraduationCap, Trophy, Users } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { Section } from '@/components/primitives/Section'
import { timeline, type TimelineKind } from '@/data/profile'
import { dur, ease } from '@/lib/motion'
import { useLenis } from '@/lib/scroll'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<TimelineKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  Work: BriefcaseBusiness,
  Responsibility: Users,
  Competition: Trophy,
  Education: GraduationCap,
}

/** Where on screen an entry counts as "current" (fraction from the top). */
const READ_LINE = '55%'

export function Timeline() {
  const reduce = useReducedMotion()
  const lenis = useLenis()
  const [active, setActive] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  // GSAP + ScrollTrigger are only needed here, so they load with this section.
  useEffect(() => {
    const listEl = list.current
    const fillEl = fill.current
    if (!listEl || !fillEl) return undefined
    let cleanup = () => {}
    let cancelled = false

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        if (reduce) gsap.set(fillEl, { scaleY: 1 })
        else
          gsap.fromTo(
            fillEl,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: listEl, start: `top ${READ_LINE}`, end: `bottom ${READ_LINE}`, scrub: 0.5 },
            },
          )
        listEl.querySelectorAll<HTMLElement>('[data-entry]').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: `top ${READ_LINE}`,
            end: `bottom ${READ_LINE}`,
            onToggle: self => {
              if (self.isActive) setActive(i)
            },
          })
        })
      })
      // Keep ScrollTrigger in step with Lenis' smoothed position.
      const off = lenis?.on('scroll', ScrollTrigger.update)
      cleanup = () => {
        off?.()
        ctx.revert()
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [reduce, lenis])

  const current = timeline[active]!
  const ActiveIcon = KIND_ICON[current.kind]

  const jump = (i: number) => {
    const el = list.current?.querySelectorAll<HTMLElement>('[data-entry]')[i]
    if (!el) return
    const offset = -window.innerHeight * 0.4
    if (lenis) lenis.scrollTo(el, { offset, duration: 1 })
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset })
  }

  return (
    <Section
      id="experience"
      index="02"
      label="Experience & education"
      title="Timeline"
      intro="Work, responsibilities and education, newest first."
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Pinned column (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-h)+3rem)]">
            <div className="surface relative overflow-hidden rounded-xl p-8">
              <div className="flex items-center gap-2">
                <ActiveIcon className="size-4 text-accent" aria-hidden="true" />
                <span className="label">{current.kind}</span>
              </div>
              <div className="relative mt-6 h-[6.5rem] overflow-hidden" aria-hidden="true">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={current.id}
                    className="num absolute inset-x-0 top-0 font-display text-[5.5rem] font-semibold leading-none tracking-tightest text-ink [font-stretch:88%]"
                    initial={{ y: reduce ? 0 : '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: reduce ? 0 : '-100%', opacity: 0 }}
                    transition={{ duration: dur[4], ease: ease.out }}
                  >
                    {current.marker}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="mt-2 text-sm text-ink-2">
                {current.title}
                <span className="block text-ink-3">{current.org}</span>
              </p>
            </div>

            <nav aria-label="Timeline entries" className="mt-6">
              <ol className="grid gap-1">
                {timeline.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === active ? 'step' : undefined}
                      className={cn(
                        'group flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm transition-colors duration-(--dur-2)',
                        i === active ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
                      )}
                    >
                      <span
                        className={cn(
                          'h-px transition-[width,background-color] duration-(--dur-3) ease-out',
                          i === active ? 'w-8 bg-accent' : 'w-4 bg-line-strong group-hover:w-6',
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                      <span className="num ml-auto shrink-0 whitespace-nowrap font-mono text-2xs text-ink-3">{item.period}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        {/* Entries with the scroll-driven progress line */}
        <ol ref={list} className="relative">
          <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line-strong">
            <div ref={fill} className="h-full w-full origin-top bg-accent" style={{ transform: 'scaleY(0)' }} />
          </div>
          {timeline.map((item, i) => {
            const Icon = KIND_ICON[item.kind]
            const on = i <= active
            return (
              <li key={item.id} data-entry className="relative pb-14 pl-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-0 top-1.5 grid size-[15px] place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-(--dur-3)',
                    on ? 'border-accent bg-accent shadow-[0_0_0_4px_var(--accent-wash)]' : 'border-line-strong bg-paper',
                  )}
                >
                  <span className={cn('size-1.5 rounded-full transition-colors duration-(--dur-3)', on ? 'bg-on-accent' : 'bg-transparent')} />
                </span>
                <motion.article
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-12% 0px' }}
                  transition={{ duration: dur[4], ease: ease.out }}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-3">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {item.kind}
                    </span>
                    <span aria-hidden="true" className="text-ink-3">·</span>
                    <time className="num font-mono text-xs text-ink-2">{item.period}</time>
                    {item.current && item.period !== 'Current' ? (
                      <span className="rounded-full bg-accent-wash px-2 py-0.5 text-2xs font-medium text-accent">Ongoing</span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-xl text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-2">
                    {item.org}
                    {item.orgNote ? <span className="text-ink-3"> · {item.orgNote}</span> : null}
                    {item.place ? <span className="text-ink-3"> · {item.place}</span> : null}
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm text-ink-2 sm:text-base">
                    {item.points.map(point => (
                      <li key={point} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-3">
                        {point}
                      </li>
                    ))}
                  </ul>
                  {item.tags.length ? (
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
                      {item.tags.map(tag => (
                        <li key={tag} className="rounded-sm border border-line bg-surface px-2 py-1 font-mono text-2xs text-ink-2">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.article>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
