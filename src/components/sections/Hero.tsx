import { ArrowDown, ArrowUpRight, FileText, Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { Crosshair } from '@/components/layout/Section'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/magicui/terminal'
import RotatingText from '@/components/reactbits/RotatingText'
import { hero, projects, moreWork, site, socials, stats } from '@/data/profile'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/** Letters rise into place, one after another. */
function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span aria-hidden="true" className={cn('inline-block whitespace-nowrap', className)}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={reduce ? false : { y: '0.4em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.04, ease: EASE }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

const BUTTON =
  'group inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4.5 text-[0.92rem] font-medium transition-[background-color,border-color,box-shadow] duration-200'
const PRIMARY = cn(BUTTON, 'max-sm:flex-[1_1_45%] bg-ink text-white shadow-[0_8px_20px_-10px_rgb(13_15_20/0.6)] hover:bg-ink/85')
const SECONDARY = cn(BUTTON, 'border border-line-strong bg-white text-foreground hover:border-ink/40')

const iconLinks = [
  { label: 'GitHub', href: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: socials.linkedin, Icon: LinkedinIcon },
].filter(link => link.href)

const repoNames = projects.map(project => project.repo.split('/').pop() ?? project.slug)

/** A short shell session that doubles as a summary. */
function WhoAmI() {
  return (
    <Terminal title="shlok@iitrpr: ~" className="font-mono text-[0.8rem] leading-relaxed shadow-[var(--panel-shadow)]">
      <TypingAnimation duration={45} className="text-[0.8rem] text-foreground">
        $ whoami
      </TypingAnimation>
      <AnimatedSpan className="text-[0.8rem] text-muted-foreground">
        <span>
          shlok vaidya · b.tech ai &amp; data engineering · iit ropar &apos;28
        </span>
      </AnimatedSpan>
      <TypingAnimation duration={45} className="mt-2 text-[0.8rem] text-foreground">
        $ cat focus.txt
      </TypingAnimation>
      <AnimatedSpan className="text-[0.8rem] text-mint">
        <span>✓ retrieval systems (RAG) with eval sets</span>
      </AnimatedSpan>
      <AnimatedSpan className="text-[0.8rem] text-mint">
        <span>✓ ai agents with function calling</span>
      </AnimatedSpan>
      <AnimatedSpan className="text-[0.8rem] text-mint">
        <span>✓ ros robotics and iot data pipelines</span>
      </AnimatedSpan>
      <TypingAnimation duration={45} className="mt-2 text-[0.8rem] text-foreground">
        $ ls ~/projects
      </TypingAnimation>
      <AnimatedSpan className="text-[0.8rem] text-signal">
        <span className="flex flex-col">
          {repoNames.map(name => (
            <span key={name} className="truncate">
              {name}/
            </span>
          ))}
          <span className="text-dim">+{moreWork.length} more on github</span>
        </span>
      </AnimatedSpan>
      <TypingAnimation duration={45} className="mt-2 text-[0.8rem] text-foreground">
        $ echo $STATUS
      </TypingAnimation>
      <AnimatedSpan className="text-[0.8rem] text-foreground">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-live text-live" />
          {site.availability.toLowerCase()}
          <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[0.5em] animate-caret bg-ink/70" />
        </span>
      </AnimatedSpan>
    </Terminal>
  )
}

export function Hero() {
  const scrollTo = useScrollTo()
  const reduce = useReducedMotion()

  const rise = (delay: number) => ({
    initial: reduce ? false : { y: 14, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, delay, ease: EASE },
  })

  return (
    <section id="top" className="relative overflow-x-clip pt-24 md:pt-28">
      {/* Flickering grid behind the hero, faded out towards the edges. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] mask-radial">
        <FlickeringGrid squareSize={3} gridGap={7} flickerChance={0.18} color="#2350ff" maxOpacity={0.16} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <motion.p
              {...rise(0.05)}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-3 pr-3.5 font-mono text-[0.72rem] text-muted-foreground shadow-[var(--panel-shadow)]"
            >
              <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-live text-live" />
              <span className="text-foreground">{site.availability}</span>
              <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
              {site.classOf}
            </motion.p>

            <h1
              aria-label={site.name}
              className="mt-7 text-[clamp(3.4rem,15vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-[clamp(4.6rem,9vw,6.4rem)]"
            >
              <Letters text={site.firstName} delay={0.1} className="mr-[0.22em]" />
              <Letters text={site.lastName} delay={0.3} />
            </h1>

            <motion.p {...rise(0.55)} className="mt-5 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-muted-foreground">
              B.Tech · AI &amp; Data Engineering · IIT Ropar
            </motion.p>

            <motion.p
              {...rise(0.65)}
              className="mt-7 flex flex-wrap items-baseline gap-x-[0.3em] text-[1.45rem] font-medium tracking-[-0.025em] sm:text-[1.8rem]"
            >
              <span>I build</span>
              <RotatingText
                texts={hero.rotating}
                effect="blur"
                rotationInterval={2600}
                staggerDuration={0.018}
                staggerFrom="first"
                mainClassName="marker text-signal"
              />
            </motion.p>

            <motion.p {...rise(0.75)} className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
              {hero.lead}
            </motion.p>

            <motion.div {...rise(0.85)} className="mt-8 flex flex-wrap items-center gap-2.5">
              <a
                href="#projects"
                onClick={event => {
                  event.preventDefault()
                  scrollTo('projects')
                }}
                className={PRIMARY}
              >
                View projects
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              {__HAS_RESUME__ ? (
                <a href={site.resume} target="_blank" rel="noreferrer" className={cn(SECONDARY, 'max-sm:flex-[1_1_45%]')}>
                  <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  Résumé
                  <ArrowUpRight className="size-3.5 text-dim" aria-hidden="true" />
                </a>
              ) : (
                <a href={`mailto:${site.email}`} className={cn(SECONDARY, 'max-sm:flex-[1_1_45%]')}>
                  <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                  Email me
                </a>
              )}
              {iconLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(SECONDARY, 'w-11 justify-center px-0 text-foreground/70 hover:text-foreground')}
                >
                  <Icon className="size-[1.05rem]" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div {...rise(0.5)} className="lg:col-span-5">
            <WhoAmI />
          </motion.div>
        </div>

        {/* Key numbers, laid out like a spec table. */}
        <div data-reveal="" className="relative mb-6 md:-mx-8">
          <Crosshair className="absolute -top-[5.5px] -left-[5.5px] hidden md:block" />
          <Crosshair className="absolute -top-[5.5px] -right-[5.5px] hidden md:block" />
          <dl className="grid grid-cols-2 border-y border-line bg-white/70 backdrop-blur-[2px] lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'px-5 py-5 sm:px-8 sm:py-6',
                  i % 2 === 1 && 'border-l border-line',
                  i >= 2 && 'border-t border-line lg:border-t-0',
                  i === 2 && 'lg:border-l',
                )}
              >
                <dt className="eyebrow text-[0.64rem] text-muted-foreground">{stat.label}</dt>
                <dd className="mt-2.5 flex items-baseline gap-1 text-[1.85rem] font-semibold tracking-[-0.035em] sm:text-[2.3rem]">
                  {stat.prefix ? (
                    <span className="mr-1 font-mono text-[0.42em] font-medium tracking-normal text-signal">
                      {stat.prefix.trim()}
                    </span>
                  ) : null}
                  {stat.value < 10 && !stat.decimals ? (
                    // Counting up to a rank would flash "1th, 2th…" on the way.
                    <span>{stat.value}</span>
                  ) : (
                    <NumberTicker
                      value={stat.value}
                      decimalPlaces={stat.decimals ?? 0}
                      delay={0.9 + i * 0.1}
                      className="tracking-[-0.035em] text-foreground"
                    />
                  )}
                  {stat.suffix ? (
                    <span className="text-[0.48em] font-medium tracking-normal text-muted-foreground">{stat.suffix}</span>
                  ) : null}
                </dd>
                <dd className="mt-1 font-mono text-[0.72rem] text-muted-foreground">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
