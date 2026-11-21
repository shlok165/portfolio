import { RotateCcw } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Derived only from the CV's reported numbers on the 200-case dataset:
 *   recall 98%     → 196 of 200 cases matched
 *   precision 100% → 0 wrong ("forced") matches
 *   the remaining 4 are escalated as exceptions.
 * Which cells are the four exceptions is arbitrary; it's a picture of the ratio.
 */
const TOTAL = 200
const ESCALATED = new Set([37, 88, 141, 176])

const PASSES = [
  { name: 'Exact-ID', detail: 'Deterministic links on shared identifiers' },
  { name: 'Fuzzy', detail: 'RapidFuzz weighted fuzzy matching' },
  { name: 'LLM tie-breaker', detail: 'Only for ambiguous cases (~3–12%)' },
  { name: 'Escalate', detail: 'Unresolved cases become exceptions' },
]

type Filter = 'all' | 'matched' | 'escalated'

const HATCH = 'border border-ink-2 bg-[repeating-linear-gradient(135deg,var(--ink-3)_0_1px,transparent_1px_4px)]'

export default function ResolutionGrid() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true })
  const [run, setRun] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const cells = useMemo(() => Array.from({ length: TOTAL }, (_, i) => ESCALATED.has(i)), [])
  const show = seen || reduce

  return (
    <figure ref={ref} className="flex h-full flex-col gap-5">
      <figcaption className="flex items-center justify-between gap-4">
        <span className="label">200 synthetic cases, one square each</span>
        <Button variant="ghost" size="sm" onClick={() => setRun(r => r + 1)} icon={<RotateCcw />} disabled={Boolean(reduce)}>
          Replay
        </Button>
      </figcaption>

      {/* Passes, in order */}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PASSES.map((pass, i) => (
          <li key={pass.name} className="surface rounded-md p-3">
            <p className="flex items-center gap-2 text-xs font-medium text-ink">
              <span className="num font-mono text-2xs text-accent">0{i + 1}</span>
              {pass.name}
            </p>
            <p className="mt-1 text-2xs leading-snug text-ink-3">{pass.detail}</p>
          </li>
        ))}
      </ol>

      {/* Waffle grid */}
      <div
        key={run}
        role="img"
        aria-label="196 of 200 cases matched, 4 escalated as exceptions, 0 forced matches."
        className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]"
      >
        {cells.map((escalated, i) => {
          const dim = (filter === 'matched' && escalated) || (filter === 'escalated' && !escalated)
          return (
            <motion.span
              key={i}
              className={cn(
                'aspect-square rounded-[2px] transition-opacity duration-(--dur-2)',
                escalated ? HATCH : 'bg-accent',
                dim && 'opacity-15',
              )}
              initial={false}
              animate={show ? { scale: 1, opacity: dim ? 0.15 : 1 } : { scale: 0, opacity: 0 }}
              transition={{
                duration: 0.35,
                ease: ease.out,
                // Sweep diagonally: row + column, so the grid "resolves" corner to corner.
                delay: reduce ? 0 : ((i % 20) + Math.floor(i / 20)) * 0.022,
              }}
            />
          )
        })}
      </div>

      {/* Legend doubles as a filter */}
      <div role="group" aria-label="Highlight cases" className="grid grid-cols-3 gap-2">
        {(
          [
            ['matched', 'Matched', '196', 'bg-accent'],
            ['escalated', 'Escalated', '4', HATCH],
          ] as const
        ).map(([id, label, count, swatch]) => {
          const pressed = filter === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(f => (f === id ? 'all' : id))}
              className={cn(
                'flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors duration-(--dur-2)',
                pressed ? 'border-accent bg-surface' : 'border-line bg-surface/60 hover:border-line-strong',
              )}
            >
              <span className="flex items-center gap-2 text-xs text-ink-2">
                <span className={cn('size-2.5 rounded-[2px]', swatch)} aria-hidden="true" />
                {label}
              </span>
              <span className="num font-display text-2xl font-semibold tracking-tighter text-ink">{count}</span>
            </button>
          )
        })}
        <div className="flex flex-col items-start gap-1 rounded-md border border-dashed border-line-strong p-3">
          <span className="text-xs text-ink-2">Forced matches</span>
          <span className="num font-display text-2xl font-semibold tracking-tighter text-ink">0</span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line text-center">
        {[
          ['Accuracy', '98%'],
          ['Precision', '100%'],
          ['Recall', '98%'],
        ].map(([k, v]) => (
          <div key={k} className="bg-surface py-2.5">
            <dt className="text-2xs text-ink-3">{k}</dt>
            <dd className="num font-mono text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
