import { motion, useInView, useReducedMotion } from 'motion/react'
import { Fragment, useRef } from 'react'
import { cn } from '@/lib/utils'

// Stage breakdown from the project's 200-case run (README, "Resolution Stage Breakdown").
const stages = [
  { name: 'Deterministic', share: 70, detail: 'Exact ID links, amount + date, bank references', bar: 'bg-mint', text: 'text-mint' },
  { name: 'Fuzzy', share: 25, detail: 'RapidFuzz text score, weighted with amount and date', bar: 'bg-sky', text: 'text-sky' },
  { name: 'LLM', share: 3, detail: 'Tie-breaker for genuinely ambiguous candidates', bar: 'bg-iris', text: 'text-iris' },
  { name: 'Exception', share: 2, detail: 'Left unresolved and reported, never forced', bar: 'bg-rose', text: 'text-rose' },
]

/** Where each transaction gets resolved in the four-pass reconciliation engine. */
export function ReconFunnel() {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const show = seen || reduce

  return (
    <figure ref={ref} className="flex h-full flex-col justify-center gap-6">
      {/* One case = an invoice, its payment and the bank transaction */}
      <div aria-hidden="true">
        <p className="font-mono text-[0.62rem] tracking-[0.18em] text-foreground/45">ONE CASE, THREE RECORDS</p>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-[0.72rem] sm:gap-2">
          {['INV-0045', 'PAY-0045', 'TXN-0045'].map((id, i) => (
            <Fragment key={id}>
              {i > 0 ? (
                <svg viewBox="0 0 28 8" className="h-2 w-4 shrink-0 sm:w-7">
                  <path d="M0 4h28" className="animate-flow stroke-mint/60" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                </svg>
              ) : null}
              <span className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-2 py-2.5 text-center text-foreground/85">
                <span className="block text-[0.54rem] tracking-[0.16em] text-foreground/40">{['INVOICE', 'PAYMENT', 'BANK'][i]}</span>
                {id}
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between font-mono text-[0.62rem] tracking-[0.18em] text-foreground/45">
          <span>WHERE 200 CASES GET RESOLVED</span>
          <span>APPROX.</span>
        </div>
        <div
          role="img"
          aria-label="About 70% of cases are resolved deterministically, 25% by fuzzy matching, 3% by the language model, and 2% are left as exceptions."
          className="mt-3 flex h-11 gap-1"
        >
          {stages.map((stage, i) => (
            <motion.div
              key={stage.name}
              className={cn('relative h-full min-w-1.5 overflow-hidden rounded-lg', stage.bar)}
              initial={false}
              animate={{ flexGrow: show ? stage.share : 0.001, opacity: show ? 1 : 0 }}
              transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexBasis: 0 }}
            >
              <span className="absolute inset-0 bg-linear-to-b from-white/35 to-transparent" />
              {stage.share >= 20 ? (
                <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[0.78rem] font-semibold text-[#06121a]">
                  {stage.share}%
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>

      <ol className="space-y-2">
        {stages.map((stage, i) => (
          <motion.li
            key={stage.name}
            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5"
            initial={false}
            animate={{ opacity: show ? 1 : 0, x: show ? 0 : 14 }}
            transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={cn('font-mono text-[0.68rem] tracking-wider', stage.text)}>0{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.86rem] font-medium text-foreground/90">{stage.name}</span>
              <span className="block truncate text-[0.74rem] text-muted-foreground">{stage.detail}</span>
            </span>
            <span className="font-mono text-[0.8rem] tabular-nums text-foreground/80">~{stage.share}%</span>
          </motion.li>
        ))}
      </ol>
      {/* Confidence score weighting used by the fuzzy pass */}
      <div aria-hidden="true">
        <p className="font-mono text-[0.62rem] tracking-[0.18em] text-foreground/45">MATCH SCORE WEIGHTS</p>
        <div className="mt-3 flex gap-1 font-mono text-[0.68rem] text-foreground/75">
          <span className="basis-1/2 rounded-lg border border-white/[0.08] bg-white/[0.06] px-2.5 py-1.5">50% text</span>
          <span className="basis-[30%] rounded-lg border border-white/[0.08] bg-white/[0.045] px-2.5 py-1.5">30% amount</span>
          <span className="basis-1/5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5">20% date</span>
        </div>
      </div>
      <figcaption className="sr-only">Share of cases resolved at each pass of the reconciliation engine.</figcaption>
    </figure>
  )
}
