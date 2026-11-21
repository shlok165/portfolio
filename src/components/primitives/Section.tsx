import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { dur, ease, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

type SectionProps = {
  id: string
  index: string
  label: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
  /** Extra content on the right of the heading row (e.g. a filter). */
  aside?: ReactNode
}

/** Page section with the shared heading pattern: index · label, title, optional intro. */
export function Section({ id, index, label, title, intro, aside, children, className }: SectionProps) {
  const reduce = useReducedMotion()
  const item = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-15% 0px' },
    transition: { duration: dur[4], ease: ease.out, delay: reduce ? 0 : i * stagger.loose },
  })

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('relative scroll-mt-24 py-24 outline-none sm:py-32', className)}>
      <div className="mx-auto w-full max-w-[1200px] px-(--gutter)">
        <header className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <motion.p {...item(0)} className="label flex items-center gap-3">
              <span className="num text-accent">{index}</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              {label}
            </motion.p>
            <motion.h2 {...item(1)} id={`${id}-title`} className="mt-5 text-3xl text-ink sm:text-4xl">
              {title}
            </motion.h2>
            {intro ? (
              <motion.p {...item(2)} className="mt-5 max-w-2xl text-base text-ink-2 sm:text-lg">
                {intro}
              </motion.p>
            ) : null}
          </div>
          {aside ? <motion.div {...item(3)}>{aside}</motion.div> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
