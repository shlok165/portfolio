import type { COBEOptions } from 'cobe'
import { ArrowUpRight, Bot, BrainCircuit, GraduationCap, MapPin, Terminal } from 'lucide-react'
import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { GlassCard } from '@/components/glass/GlassCard'
import { CodeforcesIcon, GithubIcon, LeetcodeIcon, LinkedinIcon } from '@/components/icons'
import { Accent, Chip, Section } from '@/components/layout/Section'
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { Globe, locationToAngles } from '@/components/magicui/globe'
import { Marquee } from '@/components/magicui/marquee'
import { about, cgpa, coursework, education, profiles, site, TONE_HEX } from '@/data/profile'
import { cn } from '@/lib/utils'

const PROFILE_ICON = { coding: Terminal, ai: BrainCircuit, robotics: Bot }

const LINK_ICON = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: LeetcodeIcon,
  codeforces: CodeforcesIcon,
}

const [phi, theta] = locationToAngles(site.coords.lat, site.coords.lng)

const GLOBE: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi,
  theta: theta - 0.12,
  dark: 1,
  diffuse: 1.6,
  mapSamples: 18000,
  mapBrightness: 5.5,
  mapBaseBrightness: 0.04,
  baseColor: [0.2, 0.26, 0.42],
  markerColor: [94 / 255, 234 / 255, 212 / 255],
  glowColor: [0.16, 0.24, 0.5],
  markers: [{ location: [site.coords.lat, site.coords.lng], size: 0.11 }],
}

/** Current time in the site owner's time zone, refreshed every 20 seconds. */
function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000)
    return () => window.clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: site.timeZone,
  }).format(now)
  return (
    <span className="font-mono text-[0.8rem] tracking-wide text-foreground/80">
      <time dateTime={now.toISOString()}>{time}</time> IST
    </span>
  )
}

function CgpaRing() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} className="shrink-0">
      <AnimatedCircularProgressBar
        value={seen ? cgpa.value : 0}
        max={cgpa.max}
        gaugePrimaryColor={TONE_HEX.mint}
        gaugeSecondaryColor="rgb(255 255 255 / 0.08)"
        className="size-[5.5rem]"
      >
        <span className="flex flex-col items-center leading-none">
          <span className="text-[1.3rem] font-semibold tracking-[-0.03em]">{cgpa.value}</span>
          <span className="mt-1 font-mono text-[0.58rem] tracking-[0.18em] text-muted-foreground">CGPA</span>
        </span>
      </AnimatedCircularProgressBar>
    </div>
  )
}

// Codeforces rating bands; Pupil is where "1200+" sits.
const bands = [
  { label: 'Newbie', range: '< 1200' },
  { label: 'Pupil', range: '1200', active: true },
  { label: 'Specialist', range: '1400' },
  { label: 'Expert', range: '1600' },
]

export function About() {
  const [degree, ...school] = education

  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title={
        <>
          Code, AI and <Accent>robotics</Accent>.
        </>
      }
      lead="Where I study, where I’m based, and the three areas I work in."
    >
      <div className="grid gap-4 lg:grid-cols-6">
        {/* Bio */}
        <GlassCard reveal tone="sky" className="flex flex-col lg:col-span-4 lg:row-span-2 lg:p-10">
          <p className="eyebrow text-muted-foreground">Profile</p>
          <p className="mt-6 text-[1.35rem] font-medium leading-[1.32] tracking-[-0.02em] text-foreground/95 sm:text-[1.72rem]">
            {about.paragraphs[0]}
          </p>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground">{about.paragraphs[1]}</p>
          <dl className="mt-9 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {about.now.map(row => (
              <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="eyebrow pt-0.5 text-[0.66rem] text-mint/90">{row.label}</dt>
                <dd className="text-[0.95rem] text-foreground/85">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-wrap gap-2 pt-9">
            {['Retrieval systems', 'AI agents', 'Data pipelines', 'Robotics'].map(item => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </GlassCard>

        {/* Location */}
        <GlassCard reveal={90} tone="mint" className="relative min-h-[17.5rem] lg:col-span-2">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-3.5 text-mint" aria-hidden="true" />
                Based in
              </p>
              <p className="mt-3 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em]">Rupnagar, Punjab</p>
              <p className="mt-1 text-sm text-muted-foreground">India</p>
            </div>
            <LocalTime />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 top-[6.2rem] h-[26rem]">
            <Globe config={GLOBE} sway={0.42} className="max-w-[26rem]" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#070a13]/90 to-transparent"
          />
        </GlassCard>

        {/* Education */}
        <GlassCard reveal={180} tone="mint" className="lg:col-span-2">
          <p className="eyebrow flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="size-3.5 text-mint" aria-hidden="true" />
            Education
          </p>
          <div className="mt-5 flex items-center gap-5">
            <CgpaRing />
            <div className="min-w-0">
              <p className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em]">{degree.degree}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{degree.school}</p>
              <p className="mt-1 font-mono text-[0.72rem] tracking-wide text-foreground/60">{degree.years}</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.06] text-sm">
            {school.map(row => (
              <div key={row.degree} className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="min-w-0">
                  <span className="text-foreground/90">{row.degree}</span>
                  <span className="text-muted-foreground"> · {row.years}</span>
                </dt>
                <dd className="shrink-0 font-mono text-[0.78rem] text-foreground/80">{row.score}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>

        {/* Coding, AI & SDE, Robotics */}
        {profiles.map((profile, i) => {
          const Icon = PROFILE_ICON[profile.id]
          const hex = TONE_HEX[profile.tone]
          return (
            <GlassCard key={profile.id} reveal={i * 90} tone={profile.tone} className="flex flex-col lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="eyebrow text-muted-foreground">{profile.eyebrow}</h3>
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05]"
                  style={{ color: hex, boxShadow: `0 0 22px -6px ${hex}` }}
                >
                  <Icon className="size-[1.05rem]" />
                </span>
              </div>
              <p className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.04em]">{profile.headline}</span>
                <span className="text-sm text-muted-foreground">{profile.caption}</span>
              </p>
              {profile.id === 'coding' ? (
                <ol aria-label="Codeforces rating bands" className="mt-6 grid grid-cols-4 gap-1.5">
                  {bands.map(band => (
                    <li key={band.label}>
                      <span
                        className={cn(
                          'block h-1.5 rounded-full',
                          band.active ? 'bg-mint shadow-[0_0_14px_rgb(94_234_212/0.7)]' : 'bg-white/10',
                        )}
                      />
                      <span
                        className={cn(
                          'mt-2 block font-mono text-[0.6rem] tracking-wide',
                          band.active ? 'text-mint' : 'text-foreground/40',
                        )}
                      >
                        {band.label}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
              <dl className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {profile.rows.map(row => (
                  <div key={row.label} className="grid grid-cols-[5.25rem_1fr] gap-3 py-2.5">
                    <dt className="eyebrow pt-0.5 text-[0.62rem]" style={{ color: hex }}>
                      {row.label}
                    </dt>
                    <dd className="text-[0.9rem] leading-snug text-foreground/85">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                {profile.links
                  .filter(link => link.href)
                  .map(link => {
                    const LinkIcon = LINK_ICON[link.icon]
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[0.82rem] text-foreground/85 transition-colors hover:border-white/25 hover:bg-white/[0.09] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
                        >
                          <LinkIcon className="size-3.5 text-foreground/60" />
                          {link.label}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-3.5 text-foreground/40 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    )
                  })}
              </ul>
            </GlassCard>
          )
        })}

        {/* Coursework */}
        <GlassCard reveal className="flex flex-col justify-between overflow-hidden lg:col-span-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow text-muted-foreground">Coursework</p>
            <p className="text-sm text-muted-foreground">Computer science, ML and optimisation</p>
          </div>
          <div className="mask-fade-x -mx-7 mt-8 flex flex-col gap-3">
            <Marquee pauseOnHover className="p-0 [--duration:38s] [--gap:0.75rem]">
              {coursework.map(course => (
                <span
                  key={course}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[0.92rem] text-foreground/85"
                >
                  {course}
                </span>
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="p-0 [--duration:46s] [--gap:0.75rem]">
              {[...coursework].reverse().map(course => (
                <span
                  key={course}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.92rem] text-foreground/60"
                >
                  {course}
                </span>
              ))}
            </Marquee>
          </div>
        </GlassCard>
      </div>
    </Section>
  )
}
