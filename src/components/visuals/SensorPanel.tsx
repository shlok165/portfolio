import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { TONE_HEX } from '@/data/profile'

type Channel = {
  name: string
  unit: string
  value: string
  color: string
  seed: number
  /** Index of a sample to spike, to show what a flagged reading looks like. */
  spike?: number
}

// Decorative, simulated readings: the dashboard's four parameters.
const channels: Channel[] = [
  { name: 'pH', unit: '', value: '7.2', color: TONE_HEX.mint, seed: 3 },
  { name: 'Turbidity', unit: 'NTU', value: '3.1', color: TONE_HEX.rose, seed: 11, spike: 22 },
  { name: 'Conductivity', unit: 'µS/cm', value: '412', color: TONE_HEX.sky, seed: 7 },
  { name: 'Temperature', unit: '°C', value: '24.6', color: TONE_HEX.iris, seed: 19 },
]

const W = 200
const H = 56
const N = 32

/** Small deterministic pseudo-random walk, so the lines look the same on every render. */
function series(seed: number, spike?: number) {
  let state = seed * 9301 + 49297
  const next = () => {
    state = (state * 233280 + 49297) % 2147483647
    return state / 2147483647
  }
  let level = 0.5
  return Array.from({ length: N }, (_, i) => {
    level = Math.min(0.82, Math.max(0.3, level + (next() - 0.5) * 0.2))
    return spike !== undefined && Math.abs(i - spike) <= 1 ? (i === spike ? 0.04 : 0.3) : 1 - level
  })
}

function toPath(points: number[]) {
  return points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${((i / (N - 1)) * W).toFixed(1)} ${(4 + y * (H - 8)).toFixed(1)}`)
    .join(' ')
}

function Tile({ channel, index, show }: { channel: Channel; index: number; show: boolean }) {
  const points = series(channel.seed, channel.spike)
  const line = toPath(points)
  const lastY = 4 + points[N - 1] * (H - 8)
  const spikeX = channel.spike !== undefined ? (channel.spike / (N - 1)) * W : 0

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.74rem] text-muted-foreground">{channel.name}</span>
        {channel.spike !== undefined ? (
          <span className="rounded-full bg-rose/15 px-1.5 py-0.5 font-mono text-[0.54rem] tracking-wider text-rose">
            FLAGGED
          </span>
        ) : (
          <span className="size-1.5 animate-pulse-dot rounded-full" style={{ background: channel.color, color: channel.color }} />
        )}
      </div>
      <p className="mt-1 text-[1.35rem] font-semibold leading-none tracking-[-0.03em]">
        {channel.value}
        <span className="ml-1 text-[0.66rem] font-normal tracking-normal text-foreground/45">{channel.unit}</span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2.5 h-12 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`fill-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={channel.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={channel.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${line} L${W} ${H} L0 ${H} Z`}
          fill={`url(#fill-${index})`}
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.6 + index * 0.12 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={channel.color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 0.2 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
        {channel.spike !== undefined ? (
          <line x1={spikeX} x2={spikeX} y1="0" y2={H} stroke={channel.color} strokeOpacity="0.35" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        ) : null}
        <circle cx={W} cy={lastY} r="2.6" fill={channel.color} opacity={show ? 1 : 0} />
      </svg>
    </div>
  )
}

/** A miniature of the AquaIntegrity dashboard: four live parameters, one flagged. */
export function SensorPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  return (
    <figure ref={ref} className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center justify-between font-mono text-[0.62rem] tracking-[0.18em] text-foreground/45">
        <span className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-mint text-mint" />
          SENSOR FEED
        </span>
        <span>SIMULATED</span>
      </div>
      <ol aria-hidden="true" className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[0.66rem] text-foreground/75">
        {['Sensors', 'Calibration', 'Wireless link', 'Firebase', 'Dashboard'].map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            {i > 0 ? <span className="text-mint/70">→</span> : null}
            <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5">{step}</span>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="grid grid-cols-2 gap-3">
        {channels.map((channel, i) => (
          <Tile key={channel.name} channel={channel} index={i} show={seen || Boolean(reduce)} />
        ))}
      </div>
      <figcaption className="sr-only">
        Illustration of the water quality dashboard with pH, turbidity, conductivity and temperature readings; the
        values are simulated.
      </figcaption>
    </figure>
  )
}
