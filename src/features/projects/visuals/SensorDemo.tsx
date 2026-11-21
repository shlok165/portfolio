import { FlaskConical, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { dur, ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * A simulated feed of the three parameters the CV lists (pH, turbidity,
 * conductivity). Values, bands and the anomaly rule are illustrative only:
 * they show what "flag contamination" means, not the project's real data.
 */
type Channel = {
  id: 'ph' | 'turbidity' | 'conductivity'
  name: string
  unit: string
  base: number
  jitter: number
  /** Normal band; outside it the reading is flagged. */
  band: [number, number]
  /** How far a contamination event pushes the value. */
  shock: number
  min: number
  max: number
  decimals: number
}

const CHANNELS: Channel[] = [
  { id: 'ph', name: 'pH', unit: '', base: 7.2, jitter: 0.05, band: [6.5, 8.5], shock: -1.6, min: 4.5, max: 9.5, decimals: 2 },
  { id: 'turbidity', name: 'Turbidity', unit: 'NTU', base: 2.4, jitter: 0.15, band: [0, 5], shock: 6.5, min: 0, max: 12, decimals: 1 },
  { id: 'conductivity', name: 'Conductivity', unit: 'µS/cm', base: 410, jitter: 6, band: [200, 600], shock: 340, min: 150, max: 900, decimals: 0 },
]

const N = 48
const TICK = 450

type Series = Record<Channel['id'], number[]>

function seed(): Series {
  const out = {} as Series
  for (const c of CHANNELS) out[c.id] = Array.from({ length: N }, () => c.base + (Math.random() - 0.5) * c.jitter * 2)
  return out
}

export default function SensorDemo() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [series, setSeries] = useState<Series>(seed)
  const event = useRef(0) // remaining ticks of a contamination event

  useEffect(() => {
    if (reduce || !inView) return undefined
    const id = window.setInterval(() => {
      const e = event.current
      // Bell-shaped pulse over ~12 ticks.
      const k = e > 0 ? Math.sin(((12 - e) / 12) * Math.PI) : 0
      if (e > 0) event.current = e - 1
      setSeries(prev => {
        const next = {} as Series
        for (const c of CHANNELS) {
          const v = c.base + c.shock * k + (Math.random() - 0.5) * c.jitter * 2
          next[c.id] = [...prev[c.id].slice(1), v]
        }
        return next
      })
    }, TICK)
    return () => window.clearInterval(id)
  }, [reduce, inView])

  const flagged = CHANNELS.filter(c => {
    const v = series[c.id][N - 1]!
    return v < c.band[0] || v > c.band[1]
  })

  return (
    <figure ref={ref} className="flex h-full flex-col gap-4">
      <figcaption className="flex items-center justify-between gap-4">
        <span className="label flex items-center gap-2">
          <span className={cn('size-2 rounded-full', reduce ? 'bg-ink-3' : 'animate-pulse-ring bg-success text-success')} aria-hidden="true" />
          Sensor feed · simulated
        </span>
        <Button
          variant="outline"
          size="sm"
          icon={<FlaskConical />}
          onClick={() => (event.current = 12)}
          disabled={Boolean(reduce)}
          title={reduce ? 'Live feed paused (reduced motion)' : undefined}
        >
          Simulate contamination
        </Button>
      </figcaption>

      <div className="grid gap-3">
        {CHANNELS.map(c => (
          <Trace key={c.id} channel={c} values={series[c.id]} />
        ))}
      </div>

      <div className="min-h-14" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {flagged.length ? (
            <motion.p
              key="alert"
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur[2], ease: ease.out }}
              className="flex items-center gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
            >
              <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
              Possible contamination: {flagged.map(f => f.name).join(', ')} out of range
            </motion.p>
          ) : (
            <motion.p
              key="ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur[2] }}
              className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink-2"
            >
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              All readings within range
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-2xs text-ink-2" aria-label="Pipeline">
        {['Acquisition', 'Calibration', 'Wireless', 'Cloud dashboard', 'Trend + anomaly'].map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span className="text-accent" aria-hidden="true">
                →
              </span>
            ) : null}
            <span className="rounded-sm border border-line bg-surface px-2 py-1">{step}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

const W = 240
const H = 44

function Trace({ channel: c, values }: { channel: Channel; values: number[] }) {
  const y = (v: number) => H - ((v - c.min) / (c.max - c.min)) * H
  const path = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (N - 1)) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = values[N - 1]!
  const out = last < c.band[0] || last > c.band[1]
  const bandTop = y(Math.min(c.band[1], c.max))
  const bandBottom = y(Math.max(c.band[0], c.min))

  return (
    <div className={cn('surface grid grid-cols-[6.5rem_1fr] items-center gap-4 rounded-md px-4 py-3 transition-colors duration-(--dur-3)', out && 'border-danger/40')}>
      <div>
        <p className="text-xs text-ink-3">{c.name}</p>
        <p className={cn('num font-display text-xl font-semibold tracking-tight transition-colors duration-(--dur-2)', out ? 'text-danger' : 'text-ink')}>
          {last.toFixed(c.decimals)}
          <span className="ml-1 font-sans text-2xs font-normal text-ink-3">{c.unit}</span>
        </p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-11 w-full overflow-visible" aria-hidden="true">
        <rect x="0" y={bandTop} width={W} height={bandBottom - bandTop} className="fill-success/8" />
        <path
          d={path}
          fill="none"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          className={cn('transition-[stroke] duration-(--dur-2)', out ? 'stroke-danger' : 'stroke-ink-2')}
        />
      </svg>
    </div>
  )
}
