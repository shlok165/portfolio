import { ArrowUpRight, Plus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { SocialIcon } from '@/components/icons'
import { CountUp } from '@/components/primitives/CountUp'
import type { Project } from '@/data/profile'
import { dur, ease, spring, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { openProject } from './store'

type ProjectCardProps = { project: Project; order: number; hidden: boolean; className?: string }

/**
 * A project card. Its surface and title share `layoutId`s with the case-study
 * dialog, so opening a project grows this card into the dialog. The card is a
 * single button (stretched over the surface) with the repo link layered above it,
 * which keeps the two targets separate and avoids nesting interactive elements.
 */
export function ProjectCard({ project, order, hidden, className }: ProjectCardProps) {
  const reduce = useReducedMotion()
  const GitHub = SocialIcon.github

  return (
    <motion.li
      className={cn('flex', className)}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: dur[4], ease: ease.out, delay: reduce ? 0 : order * stagger.loose }}
    >
      <motion.article
        layoutId={`card-${project.slug}`}
        transition={spring.layout}
        style={{ borderRadius: 20 }}
        className={cn(
          'surface group relative flex w-full flex-col overflow-hidden p-6 transition-[box-shadow,border-color] duration-(--dur-3) hover:border-line-strong hover:shadow-2 sm:p-8',
          hidden && 'invisible',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="label flex items-center gap-2">
            <span className="num text-accent">{project.index}</span>
            {project.kicker}
          </p>
          <span className="num font-mono text-xs text-ink-3">{project.year}</span>
        </div>

        <motion.h3 layoutId={`title-${project.slug}`} transition={spring.layout} className="mt-8 text-2xl text-ink sm:text-3xl">
          {project.title}
        </motion.h3>
        <p className="mt-3 max-w-prose text-base text-ink-2">{project.summary}</p>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {project.metrics.map(m => (
            <div key={m.label}>
              <dd className="font-display text-2xl font-semibold tracking-tighter text-ink">
                <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
              </dd>
              <dt className="mt-0.5 text-xs text-ink-3">{m.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.slice(0, 3).map(s => (
            <li key={s} className="rounded-sm border border-line bg-paper px-2 py-1 font-mono text-2xs text-ink-2">
              {s}
            </li>
          ))}
          {project.stack.length > 3 ? (
            <li className="px-1 py-1 font-mono text-2xs text-ink-3">+{project.stack.length - 3}</li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <button
            type="button"
            onClick={() => openProject(project.slug)}
            data-cursor="Open"
            data-project-trigger={project.slug}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink after:absolute after:inset-0 after:content-['']"
          >
            <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,color,transform] duration-(--dur-3) ease-out group-hover:rotate-90 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              <Plus className="size-4" aria-hidden="true" />
            </span>
            <span>
              Case study<span className="sr-only">: {project.title}</span>
            </span>
          </button>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs text-ink-3 transition-colors duration-(--dur-2) hover:bg-sunken hover:text-ink"
          >
            <GitHub className="size-3.5" />
            Code
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        </div>
      </motion.article>
    </motion.li>
  )
}
