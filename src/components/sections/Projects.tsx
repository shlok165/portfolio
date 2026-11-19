import { ArrowUpRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { GithubIcon } from '@/components/icons'
import { Panel } from '@/components/layout/Panel'
import { Accent, Chip, Section } from '@/components/layout/Section'
import { BlurFade } from '@/components/magicui/blur-fade'
import { RagPipeline } from '@/components/visuals/RagPipeline'
import { ReconFunnel } from '@/components/visuals/ReconFunnel'
import { SensorPanel } from '@/components/visuals/SensorPanel'
import { moreWork, projects, socials, TONE_HEX, type Project } from '@/data/profile'
import { cn } from '@/lib/utils'

const visuals: Record<Project['slug'], ReactNode> = {
  rag: <RagPipeline />,
  recon: <ReconFunnel />,
  water: <SensorPanel />,
}

const figureLabel: Record<Project['slug'], string> = {
  rag: 'Fig. 1 — Query routing and retrieval',
  recon: 'Fig. 2 — Where cases get resolved',
  water: 'Fig. 3 — Sensor dashboard (simulated values)',
}

function Featured({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1
  const color = TONE_HEX[project.tone]
  const repoName = project.repo.split('/').slice(-2).join('/')

  return (
    <Panel reveal tone={project.tone} className="p-0 sm:p-0">
      {/* Title block */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-6 py-3.5 font-mono text-[0.72rem] text-muted-foreground sm:px-9">
        <span className="text-signal">PRJ-0{index + 1}</span>
        <span aria-hidden="true">·</span>
        <span className="uppercase tracking-[0.12em]">{project.kicker}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="ml-auto hidden items-center gap-1.5 truncate text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <GithubIcon className="size-3.5" />
          {repoName}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className={cn('flex flex-col p-6 sm:p-9', flip && 'lg:order-2')}>
          <h3 className="text-[1.85rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.3rem]">
            {project.title}
          </h3>
          <p className="mt-3.5 text-[1.02rem] leading-relaxed text-foreground/80">{project.summary}</p>

          {/* Results first: what a reviewer looks for */}
          <dl
            className="mt-6 grid divide-x divide-line overflow-hidden rounded-xl border border-line bg-muted/50"
            style={{ gridTemplateColumns: `repeat(${project.metrics.length}, minmax(0, 1fr))` }}
          >
            {project.metrics.map(metric => (
              <div key={metric.label} className="px-3.5 py-3 sm:px-4">
                <dd className="text-[1.35rem] font-semibold leading-none tracking-[-0.03em] sm:text-[1.55rem]" style={{ color }}>
                  {metric.value}
                </dd>
                <dt className="mt-1.5 font-mono text-[0.66rem] uppercase leading-tight tracking-[0.08em] text-muted-foreground">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>

          <ul className="mt-6 space-y-2.5">
            {project.points.map(point => (
              <li key={point} className="flex gap-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                <Check className="mt-[0.3rem] size-3.5 shrink-0 text-signal" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7">
            <p className="eyebrow text-[0.62rem] text-dim">Stack</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map(tech => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-line-strong bg-white px-3.5 text-[0.88rem] font-medium transition-colors hover:border-ink/40"
            >
              <GithubIcon className="size-4" />
              View source
              <ArrowUpRight
                className="size-3.5 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div
          className={cn(
            'blueprint relative flex min-h-[22rem] flex-col border-t border-line p-5 sm:p-8 lg:border-t-0',
            flip ? 'lg:order-1 lg:border-r' : 'lg:border-l',
          )}
        >
          <div className="relative flex-1">{visuals[project.slug]}</div>
          <p className="relative mt-5 font-mono text-[0.66rem] text-dim">{figureLabel[project.slug]}</p>
        </div>
      </div>
    </Panel>
  )
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      meta={`${projects.length} featured · ${moreWork.length} more`}
      title={
        <>
          Work that shows its <Accent>numbers</Accent>.
        </>
      }
      lead="Three systems I built end to end, each with a measured result, then more from my GitHub."
    >
      <div className="grid gap-5">
        {projects.map((project, i) => (
          <Featured key={project.slug} project={project} index={i} />
        ))}
      </div>

      <BlurFade inView inViewMargin="-80px">
        <div className="mb-5 mt-16 flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-[1.5rem] font-semibold tracking-[-0.03em] sm:text-[1.8rem]">More from GitHub</h3>
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-[0.78rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            github.com/shlok165
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </BlurFade>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moreWork.map((repo, i) => (
          <Panel
            key={repo.title}
            reveal={(i % 3) * 80}
            tone={repo.tone}
            className="group flex flex-col p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex items-center justify-between font-mono text-[0.7rem] text-muted-foreground">
              <span className="flex items-center gap-2">
                <GithubIcon className="size-3.5" />
                {repo.url.split('/').pop()}
              </span>
              <span>{repo.year}</span>
            </div>
            <h4 className="mt-4 text-[1.08rem] font-semibold leading-snug tracking-[-0.02em]">
              <a href={repo.url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 after:z-10">
                {repo.title}
              </a>
            </h4>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{repo.blurb}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <div className="flex flex-wrap gap-1.5">
                {repo.tags.map(tag => (
                  <Chip key={tag} className="text-[0.64rem]">
                    {tag}
                  </Chip>
                ))}
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                aria-hidden="true"
              />
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  )
}
