import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Section } from '@/components/primitives/Section'
import { moreWork, projects } from '@/data/profile'
import { dur, ease, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { readProjectFromHash, useOpenProject } from './store'

const CaseStudy = lazy(() => import('./CaseStudy').then(m => ({ default: m.CaseStudy })))

// Bento placement for the three featured projects on large screens.
const LAYOUT = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-12']

export function Projects() {
  const open = useOpenProject()
  const reduce = useReducedMotion()
  // Once loaded, the dialog stays mounted so its close animation can play.
  const [loaded, setLoaded] = useState(false)
  if (open && !loaded) setLoaded(true)

  useEffect(readProjectFromHash, [])

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Selected work"
      intro="Three projects from the CV. Open one for the details and a small interactive model of how it works."
    >
      <ul className="grid gap-4 lg:grid-cols-12">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} order={i} hidden={open === project.slug} className={LAYOUT[i]} />
        ))}
      </ul>

      <div className="mt-20">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h3 className="text-xl text-ink">More on GitHub</h3>
          <span className="num font-mono text-xs text-ink-3">{moreWork.length} repositories</span>
        </div>
        <ul>
          {moreWork.map((repo, i) => (
            <motion.li
              key={repo.url}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: dur[4], ease: ease.out, delay: reduce ? 0 : i * stagger.base }}
              className="border-b border-line"
            >
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-x-8 gap-y-2 py-5 transition-colors duration-(--dur-2) sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-baseline"
              >
                <span className="flex items-baseline gap-3">
                  <span className="num font-mono text-xs text-ink-3">{repo.year}</span>
                  <span className="font-medium text-ink transition-colors duration-(--dur-2) group-hover:text-accent">{repo.title}</span>
                </span>
                <span className="text-sm text-ink-2">
                  {repo.blurb}
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {repo.stack.map(s => (
                      <span key={s} className="font-mono text-2xs text-ink-3 after:ml-1.5 after:content-['/'] last:after:content-none">
                        {s}
                      </span>
                    ))}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    'hidden size-5 text-ink-3 transition-[transform,color] duration-(--dur-3) ease-out sm:block',
                    'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent',
                  )}
                />
                <span className="sr-only">(opens GitHub in a new tab)</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* The dialog code (and its visuals) loads the first time a project opens. */}
      {loaded ? (
        <Suspense fallback={null}>
          <CaseStudy />
        </Suspense>
      ) : null}
    </Section>
  )
}
