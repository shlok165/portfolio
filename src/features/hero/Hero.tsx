import { ArrowDown, ArrowUpRight, Check, Copy, FileText } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { SocialIcon } from '@/components/icons'
import { Button, LinkButton } from '@/components/primitives/Button'
import { CountUp } from '@/components/primitives/CountUp'
import { Magnetic } from '@/components/primitives/Magnetic'
import { SplitText } from '@/components/primitives/SplitText'
import { site, socials, stats, summary } from '@/data/profile'
import { copyEmail } from '@/lib/actions'
import { useClock } from '@/lib/hooks'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'

// WebGL is not needed for first paint, so it loads after the page is idle.
const DotField = lazy(() => import('./DotField'))

function useIdle() {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const id = ric(() => setIdle(true), { timeout: 1500 })
    return () => cancel(id)
  }, [])
  return idle
}

/*
 * The hero's entrances are CSS animations (.enter / .char in index.css), not
 * Motion. The page is prerendered, so they start on the very first paint,
 * before any JavaScript has loaded; hydration keeps the same DOM nodes, so
 * nothing restarts. Load order: name → role & summary → actions → links → stats.
 */
const NAME_END = 0.45
const delay = (s: number) => ({ '--enter-delay': `${s}s` }) as CSSProperties

export function Hero() {
  const reduce = useReducedMotion()
  const idle = useIdle()
  const [fieldReady, setFieldReady] = useState(false)
  const onReady = useCallback(() => setFieldReady(true), [])
  const scrollTo = useScrollTo()
  const time = useClock(site.timeZone)
  const [copied, setCopied] = useState(false)

  // The name drifts up as the hero scrolls away; the dot field fades out.
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80])
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const onCopy = async () => {
    if (await copyEmail()) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative isolate overflow-hidden pt-(--nav-h)">
      {/* Background: CSS dot grid first, WebGL field fades in over it once loaded. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: fieldOpacity }}
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_72%_42%,black_20%,transparent_75%)] max-md:[mask-image:radial-gradient(ellipse_120%_60%_at_60%_30%,black_10%,transparent_70%)]"
      >
        <div className={cn('dot-grid absolute inset-0 transition-opacity duration-(--dur-5)', fieldReady && 'opacity-0')} />
        {idle ? (
          <Suspense fallback={null}>
            <div className={cn('absolute inset-0 transition-opacity duration-(--dur-5)', fieldReady ? 'opacity-100' : 'opacity-0')}>
              <DotField onReady={onReady} />
            </div>
          </Suspense>
        ) : null}
      </motion.div>

      <div className="mx-auto flex max-w-[1200px] flex-col px-(--gutter) pb-8 pt-8 sm:pt-12">
        {/* Status row */}
        <div className="enter flex flex-wrap items-center gap-x-5 gap-y-2" style={delay(0.05)}>
          {site.status ? (
            <span className="surface inline-flex h-8 items-center gap-2 rounded-full pl-2.5 pr-3.5 text-xs text-ink-2">
              <span className="size-2 animate-pulse-ring rounded-full bg-success text-success" aria-hidden="true" />
              {site.status}
            </span>
          ) : null}
          <span className="label">
            {site.location.split(',')[0]} ·{' '}
            <time className="text-ink-2" suppressHydrationWarning>
              {time}
            </time>{' '}
            IST
          </span>
        </div>

        {/* Name: two stacked lines on small screens, one line from lg up. */}
        <motion.h1 style={{ y: nameY }} className="mt-6 font-display font-semibold leading-[0.86] tracking-tightest text-ink [font-stretch:88%] sm:mt-8">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true" className="block text-[clamp(4.25rem,16vw,9rem)] lg:text-[clamp(6rem,10.4vw,9.75rem)]">
            <SplitText text={site.firstName} className="block lg:inline" delay={0.05} />
            <span className="hidden lg:inline"> </span>
            <SplitText text={site.lastName} className="block sm:pl-[0.55em] lg:inline lg:pl-0" delay={0.05 + site.firstName.length * 0.028} />
          </span>
        </motion.h1>

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          {/* Who */}
          <div>
            <p className="enter text-lg font-medium text-ink" style={delay(NAME_END)}>
              {site.degree}
              <span className="block text-ink-3">
                {site.institute} · <span className="num">{site.years}</span>
              </span>
            </p>
            <p className="enter mt-4 max-w-xl text-base text-ink-2" style={delay(NAME_END + 0.08)}>
              {summary.hero}
            </p>
          </div>

          {/* Actions + links */}
          <div className="lg:justify-self-end">
            <div className="enter flex flex-wrap items-center gap-3" style={delay(NAME_END + 0.16)}>
              <Magnetic>
                <Button variant="accent" size="lg" onClick={() => scrollTo('projects')} data-cursor="View" icon={<ArrowDown />}>
                  See projects
                </Button>
              </Magnetic>
              <Magnetic>
                <LinkButton href={site.resumePage} variant="outline" size="lg" icon={<FileText />}>
                  Résumé
                </LinkButton>
              </Magnetic>
              <Button
                variant="ghost"
                size="lg"
                onClick={onCopy}
                aria-label={copied ? 'Email address copied' : `Copy email address ${site.email}`}
                icon={copied ? <Check className="text-success" /> : <Copy />}
                className="px-3"
              >
                <span className="font-mono text-sm">{copied ? 'Copied' : site.email}</span>
              </Button>
            </div>
            <ul className="enter mt-5 flex flex-wrap gap-x-5 gap-y-2" style={delay(NAME_END + 0.24)} aria-label="Profiles">
              {socials.map(s => {
                const Icon = SocialIcon[s.id]
                return (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-8 items-center gap-2 text-sm text-ink-2 transition-colors duration-(--dur-2) hover:text-ink"
                    >
                      <Icon className="size-4 text-ink-3 transition-colors duration-(--dur-2) group-hover:text-accent" />
                      <span className="link-underline">{s.label}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 -translate-x-1 text-ink-3 opacity-0 transition-[opacity,transform] duration-(--dur-2) group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Key numbers */}
        <dl className="enter surface mt-12 grid grid-cols-2 overflow-hidden rounded-xl sm:grid-cols-3 lg:mt-16 lg:grid-cols-5" style={delay(NAME_END + 0.35)}>
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className={cn(
                'flex flex-col gap-1 px-5 py-4',
                i > 0 && 'lg:border-l',
                i % 2 === 1 && 'max-sm:border-l',
                i >= 2 && 'max-sm:border-t',
                i % 3 !== 0 && 'sm:max-lg:border-l',
                i >= 3 && 'sm:max-lg:border-t',
                i === stats.length - 1 && 'max-sm:col-span-2',
              )}
            >
              <dt className="label order-2">{stat.label}</dt>
              <dd className="order-1 font-display text-2xl font-semibold tracking-tighter text-ink">
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} delay={i * 0.08} />
              </dd>
              <dd className="order-3 text-xs text-ink-3">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
