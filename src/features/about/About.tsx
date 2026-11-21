import { ArrowUpRight, GraduationCap, MapPin } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { SocialIcon } from '@/components/icons'
import { CountUp } from '@/components/primitives/CountUp'
import { Section } from '@/components/primitives/Section'
import { TiltCard } from '@/components/primitives/TiltCard'
import { coursework, education, site, socials, summary } from '@/data/profile'
import { useClock } from '@/lib/hooks'
import { dur, ease, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

function Tile({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      className={cn('flex', className)}
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: dur[4], ease: ease.out, delay: reduce ? 0 : index * stagger.loose }}
    >
      <TiltCard className="flex w-full flex-col p-6 sm:p-7">{children}</TiltCard>
    </motion.li>
  )
}

function TileLabel({ children }: { children: ReactNode }) {
  return <p className="label mb-5">{children}</p>
}

const cfLinks = socials.filter(s => s.id === 'codeforces' || s.id === 'leetcode')

/** Six cells for the 6th place, out of 23. */
function RankStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  return (
    <div ref={ref} role="img" aria-label="6th place out of 23 IITs" className="mt-auto grid grid-cols-[repeat(23,minmax(0,1fr))] gap-[3px] pt-6">
      {Array.from({ length: 23 }, (_, i) => (
        <motion.span
          key={i}
          className={cn('h-6 rounded-[2px]', i === 5 ? 'bg-accent' : i < 5 ? 'bg-ink/25' : 'bg-ink/8')}
          initial={false}
          animate={seen || reduce ? { scaleY: 1, opacity: 1 } : { scaleY: 0.2, opacity: 0 }}
          transition={{ duration: dur[3], ease: ease.out, delay: reduce ? 0 : 0.2 + i * 0.025 }}
          style={{ originY: 1 }}
        />
      ))}
    </div>
  )
}

function CgpaBar() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  return (
    <div ref={ref} className="h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
      <motion.div
        className="h-full origin-left rounded-full bg-accent"
        initial={false}
        animate={{ scaleX: seen || reduce ? 0.863 : 0 }}
        transition={{ duration: 1.4, ease: ease.out, delay: 0.2 }}
      />
    </div>
  )
}

export function About() {
  const time = useClock(site.timeZone)
  const btech = education[0]!

  return (
    <Section id="about" index="01" label="About" title="Background at a glance">
      <ul className="grid auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary */}
        <Tile index={0} className="md:col-span-2 lg:row-span-2">
          <TileLabel>Summary</TileLabel>
          <div className="space-y-4 text-lg leading-relaxed text-ink">
            {summary.full.map(p => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-auto flex items-center gap-2 pt-8 text-sm text-ink-3">
            <MapPin className="size-4" aria-hidden="true" />
            {site.location}
            <span aria-hidden="true">·</span>
            <time className="num" suppressHydrationWarning>
              {time}
            </time>{' '}
            IST
          </p>
        </Tile>

        {/* Education */}
        <Tile index={1} className="md:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <TileLabel>Education</TileLabel>
            <GraduationCap className="size-5 text-ink-3" aria-hidden="true" />
          </div>
          <p className="font-display text-xl font-semibold tracking-tight text-ink">{btech.degree}</p>
          <p className="mt-1 text-sm text-ink-3">
            {btech.school} · <span className="num">{btech.years}</span>
          </p>
          <div className="mt-6 flex items-end justify-between">
            <p className="font-display text-4xl font-semibold tracking-tighter text-ink">
              <CountUp value={8.63} decimals={2} />
              <span className="ml-1 text-lg text-ink-3">/ 10</span>
            </p>
            <p className="label pb-1.5">CGPA</p>
          </div>
          <div className="mt-3">
            <CgpaBar />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            {education.slice(1).map(e => (
              <div key={e.degree}>
                <dt className="text-ink-3">
                  {e.degree} · <span className="num">{e.years}</span>
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{e.score}</dd>
              </div>
            ))}
          </dl>
        </Tile>

        {/* Competitive programming */}
        <Tile index={2}>
          <TileLabel>Competitive programming</TileLabel>
          <p className="font-display text-4xl font-semibold tracking-tighter text-ink">
            <CountUp value={1200} suffix="+" />
          </p>
          <p className="mt-1 text-sm text-ink-2">Pupil on Codeforces; active problem solver on LeetCode.</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {cfLinks.map(s => {
              const Icon = SocialIcon[s.id]
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-9 items-center gap-2 rounded-full border border-line bg-paper px-3 text-xs text-ink-2 transition-colors duration-(--dur-2) hover:border-line-strong hover:text-ink"
                  >
                    <Icon className="size-3.5" />
                    <span className="font-mono">{s.handle}</span>
                    <ArrowUpRight className="size-3.5 text-ink-3 transition-transform duration-(--dur-2) group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    <span className="sr-only">on {s.label} (opens in a new tab)</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </Tile>

        {/* Inter IIT */}
        <Tile index={3}>
          <TileLabel>Inter IIT Tech Meet · 2025</TileLabel>
          <p className="font-display text-4xl font-semibold tracking-tighter text-ink">
            <CountUp value={6} suffix="th" />
            <span className="ml-2 text-lg text-ink-3">of 23 IITs</span>
          </p>
          <p className="mt-1 text-sm text-ink-2">National-level engineering problem, set by Eternal.</p>
          <RankStrip />
        </Tile>

        {/* Now */}
        <Tile index={4} className="md:col-span-1 lg:col-span-2">
          <TileLabel>Right now</TileLabel>
          <dl className="grid gap-4 text-sm">
            {[
              ['Studying', `${site.degreeShort}, ${site.instituteShort}`],
              ['Coordinating', 'SDE internships as Assistant Internship Coordinator, CAPS'],
              ['Exploring', 'Code-switched speech recognition and state-space models for medical video'],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 sm:grid-cols-[7.5rem_1fr]">
                <dt className="font-mono text-xs text-ink-3">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Tile>

        {/* Coursework */}
        <Tile index={5} className="md:col-span-1 lg:col-span-2">
          <TileLabel>Key coursework</TileLabel>
          <div className="grid gap-4">
            {coursework.map(group => (
              <div key={group.area}>
                <p className="text-xs text-ink-3">{group.area}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {group.courses.map(c => (
                    <li key={c} className="rounded-sm border border-line bg-paper px-2 py-1 text-xs text-ink-2">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Tile>
      </ul>
    </Section>
  )
}
