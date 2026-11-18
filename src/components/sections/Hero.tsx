import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { GlassCard } from '@/components/glass/GlassCard'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { NumberTicker } from '@/components/magicui/number-ticker'
import Magnet from '@/components/reactbits/Magnet'
import RotatingText from '@/components/reactbits/RotatingText'
import SoftAurora from '@/components/reactbits/SoftAurora'
import { hero, site, socials, stats } from '@/data/profile'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/** Letters rise out of a blur, one after another. */
function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span aria-hidden="true" className={cn('inline-block whitespace-nowrap', className)}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={reduce ? false : { y: '0.32em', opacity: 0, filter: 'blur(16px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: delay + i * 0.05, ease: EASE }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

const GLASS_PILL =
  'glass glass-edge relative flex h-12 items-center gap-2 rounded-full text-[0.95rem] font-medium transition-colors hover:bg-white/[0.07]'

const iconLinks = [
  { label: 'GitHub', href: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: socials.linkedin, Icon: LinkedinIcon },
].filter(link => link.href)

export function Hero() {
  const scrollTo = useScrollTo()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], [0, -70])
  const horizon = useTransform(scrollYProgress, [0, 1], [0, 150])

  /*
   * Entrance animation, applied to each element itself. Glass elements must not
   * sit inside a fading wrapper: an ancestor with opacity < 1 would switch their
   * backdrop blur off until the fade finished.
   */
  const rise = (delay: number) => ({
    initial: reduce ? false : { y: 18, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col overflow-x-clip">
      {/* Aurora horizon: sits behind the stat bar so the glass has light to bend. */}
      <motion.div
        aria-hidden="true"
        style={{ y: horizon }}
        className="pointer-events-none absolute inset-x-0 bottom-[-30%] h-[82%]"
      >
        <SoftAurora
          color1="#5cc8ff"
          color2="#a495ff"
          brightness={1.05}
          bandHeight={0.6}
          bandSpread={1.25}
          speed={0.5}
          mouseInfluence={0.18}
          clickPulse={false}
        />
      </motion.div>
      <DotPattern
        aria-hidden="true"
        width={26}
        height={26}
        cr={1}
        className="mask-radial absolute inset-0 h-full w-full fill-white/[0.14]"
      />

      <motion.div
        style={{ y: lift }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-8 pt-28 text-center sm:px-8 md:pt-36"
      >
        <motion.p
          {...rise(0.05)}
          className="glass glass-edge relative inline-flex items-center gap-3 rounded-full py-1.5 pl-3.5 pr-4 text-[0.82rem]"
        >
          <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-mint text-mint" />
          <AnimatedShinyText className="mx-0 text-foreground/80 dark:text-foreground/80">
            {site.availability}
          </AnimatedShinyText>
          <span aria-hidden="true" className="h-3.5 w-px bg-white/15" />
          <span className="text-muted-foreground">{site.classOf}</span>
        </motion.p>

        <h1
          aria-label={site.name}
          className="mt-8 text-[clamp(4.2rem,21vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[clamp(5.5rem,13.5vw,10.25rem)]"
        >
          <Letters text={site.firstName} delay={0.15} className="block sm:mr-[0.2em] sm:inline-block" />
          <Letters
            text={site.lastName}
            delay={0.4}
            className="block pr-[0.06em] font-serif text-[1.08em] font-normal italic tracking-[-0.03em] sm:inline-block"
          />
        </h1>

        <motion.p
          {...rise(0.85)}
          className="mt-8 flex w-full flex-wrap items-baseline justify-center gap-x-[0.35em] text-[1.45rem] font-medium tracking-[-0.02em] text-foreground/90 sm:text-[2rem]"
        >
          <span>I build</span>
          <RotatingText
            texts={hero.rotating}
            effect="blur"
            rotationInterval={2600}
            staggerDuration={0.018}
            staggerFrom="first"
            mainClassName="font-serif text-[1.16em] italic font-normal text-mint"
          />
        </motion.p>

        <motion.p
          {...rise(1)}
          className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-lg"
        >
          {hero.lead}
        </motion.p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <motion.div {...rise(1.12)}>
            <Magnet padding={50} magnetStrength={3}>
              <a
                href="#projects"
                onClick={event => {
                  event.preventDefault()
                  scrollTo('projects')
                }}
                className="group flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-[0.95rem] font-semibold text-primary-foreground shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_18px_50px_-12px_rgb(92_200_255/0.55)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.3),0_22px_60px_-10px_rgb(164_149_255/0.75)]"
              >
                See my work
                <ArrowDown
                  className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </Magnet>
          </motion.div>
          {__HAS_RESUME__ ? (
            <motion.a
              {...rise(1.2)}
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className={cn(GLASS_PILL, 'group pl-6 pr-5')}
            >
              Résumé
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </motion.a>
          ) : (
            <motion.a
              {...rise(1.2)}
              href="#contact"
              onClick={event => {
                event.preventDefault()
                scrollTo('contact')
              }}
              className={cn(GLASS_PILL, 'pl-5 pr-6')}
            >
              <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              Get in touch
            </motion.a>
          )}
          {iconLinks.map(({ label, href, Icon }, i) => (
            <motion.a
              key={label}
              {...rise(1.28 + i * 0.08)}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={cn(GLASS_PILL, 'w-12 justify-center text-foreground/75 hover:text-foreground')}
            >
              <Icon className="size-[1.15rem]" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8 md:pb-12">
        <GlassCard reveal={1250} className="grid grid-cols-2 p-0 sm:p-0 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'relative px-5 py-5 text-left sm:px-7 sm:py-6',
                i % 2 === 1 && 'border-l border-white/[0.07]',
                i >= 2 && 'border-t border-white/[0.07] lg:border-t-0',
                i === 2 && 'lg:border-l',
              )}
            >
              <p className="eyebrow text-[0.64rem] text-muted-foreground">{stat.label}</p>
              <p className="mt-2.5 flex items-baseline gap-1 text-[1.9rem] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">
                {stat.prefix ? (
                  <span className="mr-1 font-mono text-[0.42em] font-medium tracking-normal text-mint">
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
                    delay={1.3 + i * 0.12}
                    className="tracking-[-0.03em] text-foreground dark:text-foreground"
                  />
                )}
                {stat.suffix ? (
                  <span className="text-[0.48em] font-medium tracking-normal text-muted-foreground">{stat.suffix}</span>
                ) : null}
              </p>
              <p className="mt-1 text-[0.82rem] text-muted-foreground">{stat.note}</p>
            </div>
          ))}
        </GlassCard>
      </div>
    </section>
  )
}
