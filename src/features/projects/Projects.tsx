import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useState, type MouseEvent } from 'react'
import { Section } from '@/components/primitives/Section'
import { moreWork, projects, tracks, type Repo, type TrackId } from '@/data/profile'
import { dur, ease, stagger } from '@/lib/motion'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { readProjectFromHash, useOpenProject } from './store'

const CaseStudy = lazy(() => import('./CaseStudy').then(m => ({ default: m.CaseStudy })))

const count = (id: TrackId) => projects.filter(p => p.track === id).length + moreWork.filter(r => r.track === id).length

export function Projects() {
  const open = useOpenProject()
  const scrollTo = useScrollTo()
  // Once loaded, the dialog stays mounted so its close animation can play.
  const [loaded, setLoaded] = useState(false)
  if (open && !loaded) setLoaded(true)

  useEffect(readProjectFromHash, [])

  const jump = (id: string) => (event: MouseEvent) => {
    event.preventDefault()
    scrollTo(id)
  }

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Selected work"
      intro="Two tracks: software (development and AI) and robotics. Cards with a case study open into the details and a small interactive model of how the project works."
      aside={
        <nav aria-label="Project tracks" className="surface inline-flex gap-1 rounded-full p-1">
          {tracks.map(t => (
            <a
              key={t.id}
              href={`#projects-${t.id}`}
              onClick={jump(`projects-${t.id}`)}
              className="group inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm text-ink-2 transition-colors duration-(--dur-2) hover:bg-sunken hover:text-ink"
            >
              {t.title}
              <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-sunken px-1.5 font-mono text-2xs text-ink-3 group-hover:bg-surface">
                {count(t.id)}
              </span>
              <ArrowDown className="size-3.5 text-ink-3 transition-transform duration-(--dur-2) group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          ))}
        </nav>
      }
    >
      <div className="grid gap-24">
        {tracks.map((track, t) => {
          const featured = projects.filter(p => p.track === track.id)
          const repos = moreWork.filter(r => r.track === track.id)
          return (
            <section
              key={track.id}
              id={`projects-${track.id}`}
              aria-labelledby={`projects-${track.id}-title`}
              className="scroll-mt-28 outline-none"
            >
              <header className="mb-8 grid gap-2 border-t border-line-strong pt-6 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-x-8">
                <h3 id={`projects-${track.id}-title`} className="flex items-baseline gap-3 text-2xl text-ink sm:text-3xl">
                  <span className="label text-accent">Track {String.fromCharCode(65 + t)}</span>
                  {track.title}
                  <span className="num font-mono text-xs font-normal tracking-normal text-ink-3">{count(track.id)} projects</span>
                </h3>
                <p className="text-sm text-ink-2 sm:justify-self-end sm:text-right">{track.blurb}</p>
              </header>

              {featured.length ? (
                <ul className="grid gap-4 lg:grid-cols-2">
                  {featured.map((project, i) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      order={i}
                      hidden={open === project.slug}
                      className={featured.length === 1 ? 'lg:col-span-2' : undefined}
                    />
                  ))}
                </ul>
              ) : null}

              {repos.length ? <RepoList repos={repos} /> : null}
            </section>
          )
        })}
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

function RepoList({ repos }: { repos: Repo[] }) {
  const reduce = useReducedMotion()
  return (
    <div className="mt-10">
      <p className="label border-b border-line pb-3">More projects</p>
      <ul>
        {repos.map((repo, i) => {
          const Row = repo.url ? 'a' : 'div'
          return (
          <motion.li
            key={repo.url ?? repo.title}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: dur[4], ease: ease.out, delay: reduce ? 0 : i * stagger.base }}
            className="border-b border-line"
          >
            <Row
              {...(repo.url ? { href: repo.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_6.5rem] sm:items-baseline"
            >
              <span className="flex items-baseline gap-3">
                {repo.year ? <span className="num font-mono text-xs text-ink-3">{repo.year}</span> : null}
                <span className={cn('font-medium text-ink', repo.url && 'transition-colors duration-(--dur-2) group-hover:text-accent')}>{repo.title}</span>
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
              {repo.url ? (
                <>
                  <ArrowUpRight
                    aria-hidden="true"
                    className={cn(
                      'hidden size-5 text-ink-3 transition-[transform,color] duration-(--dur-3) ease-out sm:block sm:justify-self-end',
                      'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent',
                    )}
                  />
                  <span className="sr-only">(opens GitHub in a new tab)</span>
                </>
              ) : (
                <span className="font-mono text-2xs text-ink-3 sm:justify-self-end">No public repo</span>
              )}
            </Row>
          </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
