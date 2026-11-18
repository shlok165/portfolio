import { ArrowUpRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { GlassCard } from '@/components/glass/GlassCard'
import { GithubIcon } from '@/components/icons'
import { Accent, Chip, Section } from '@/components/layout/Section'
import { BlurFade } from '@/components/magicui/blur-fade'
import { moreWork, projects, socials, TONE_HEX, type Project } from '@/data/profile'
import { cn } from '@/lib/utils'
import { RagPipeline } from '@/components/visuals/RagPipeline'
import { ReconFunnel } from '@/components/visuals/ReconFunnel'
import { SensorPanel } from '@/components/visuals/SensorPanel'

const visuals: Record<Project['slug'], ReactNode> = {
  rag: <RagPipeline />,
  recon: <ReconFunnel />,
  water: <SensorPanel />,
}

function Featured({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1
  const color = TONE_HEX[project.tone]

  return (
    <GlassCard reveal tone={project.tone} className="grid p-0 sm:p-0 lg:grid-cols-2">
      <div className={cn('flex flex-col p-6 sm:p-9 lg:p-11', flip && 'lg:order-2')}>
        <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground">
          <span style={{ color }}>0{index + 1}</span>
          <span aria-hidden="true" className="h-px w-6 bg-white/20" />
          <span className="uppercase">{project.kicker}</span>
          <span className="ml-auto tracking-wide text-foreground/50">{project.year}</span>
        </div>

        <h3 className="mt-6 text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[2.5rem]">
          {project.title}
        </h3>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/80">{project.summary}</p>

        <ul className="mt-6 space-y-3">
          {project.points.map(point => (
            <li key={point} className="flex gap-3 text-[0.92rem] leading-relaxed text-muted-foreground">
              <Check className="mt-[0.3rem] size-3.5 shrink-0" style={{ color }} aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-8 flex flex-wrap gap-x-9 gap-y-4 border-t border-white/[0.07] pt-6">
          {project.metrics.map(metric => (
            <div key={metric.label}>
              <dd className="text-[1.7rem] font-semibold leading-none tracking-[-0.03em]">{metric.value}</dd>
              <dt className="mt-1.5 text-[0.78rem] text-muted-foreground">{metric.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
          {project.stack.map(tech => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 inline-flex h-11 w-fit items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] pl-4 pr-3.5 text-[0.9rem] font-medium transition-colors hover:bg-white/[0.12]"
        >
          <GithubIcon className="size-4" />
          View the code
          <ArrowUpRight
            className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden="true"
          />
        </a>
      </div>

      <div
        className={cn(
          'relative min-h-[22rem] border-t border-white/[0.07] bg-black/25 p-5 sm:p-8 lg:border-t-0',
          flip ? 'lg:order-1 lg:border-r' : 'lg:border-l',
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(60% 55% at ${flip ? '30%' : '70%'} 20%, ${color}22, transparent 70%)`,
          }}
        />
        <div className="relative h-full">{visuals[project.slug]}</div>
      </div>
    </GlassCard>
  )
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
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
        <div className="mb-6 mt-20 flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em] sm:text-[2rem]">
            More from <Accent>GitHub</Accent>
          </h3>
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All repositories
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </BlurFade>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moreWork.map((repo, i) => (
          <GlassCard
            key={repo.title}
            reveal={(i % 3) * 90}
            tone={repo.tone}
            className="group flex flex-col transition-transform duration-500 ease-out hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ background: TONE_HEX[repo.tone], boxShadow: `0 0 14px 1px ${TONE_HEX[repo.tone]}` }}
              />
              <span className="font-mono text-[0.7rem] tracking-wide text-foreground/45">{repo.year}</span>
            </div>
            <h4 className="mt-5 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">
              <a href={repo.url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 after:z-10">
                {repo.title}
              </a>
            </h4>
            <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{repo.blurb}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-6">
              <div className="flex flex-wrap gap-1.5">
                {repo.tags.map(tag => (
                  <Chip key={tag} className="px-2.5 text-[0.64rem]">
                    {tag}
                  </Chip>
                ))}
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-foreground/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
