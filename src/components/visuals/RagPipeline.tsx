import { Database, FileSearch, MessageCircleQuestion, Radio, Sparkles, Split } from 'lucide-react'
import { useRef, type ComponentType, type ReactNode, type Ref, type SVGProps } from 'react'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { SIGNAL, TONE_HEX } from '@/data/profile'
import { cn } from '@/lib/utils'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

function Node({
  ref,
  Icon,
  label,
  note,
  accent,
}: {
  ref: Ref<HTMLDivElement>
  Icon: Icon
  label: string
  note?: string
  accent?: boolean
}) {
  return (
    <div className="relative z-10 flex w-[4.6rem] flex-col items-center gap-2 text-center sm:w-24">
      <div
        ref={ref}
        className={cn(
          'grid size-11 place-items-center rounded-xl border bg-white shadow-[0_6px_16px_-10px_rgb(13_15_20/0.45)] sm:size-12',
          accent ? 'border-signal/50 bg-signal-soft text-signal' : 'border-line-strong text-foreground/75',
        )}
      >
        <Icon className="size-[1.15rem]" aria-hidden="true" />
      </div>
      <p className="text-[0.68rem] font-medium leading-tight text-foreground sm:text-[0.74rem]">{label}</p>
      {note ? <p className="-mt-1.5 font-mono text-[0.56rem] leading-tight text-muted-foreground">{note}</p> : null}
    </div>
  )
}

function Skeleton({ className }: { className?: string }): ReactNode {
  return <span className={cn('block h-2 rounded-full bg-ink/10', className)} />
}

/** How a question travels through Ask IIT Ropar: router, three retrieval paths, cited answer. */
export function RagPipeline() {
  const box = useRef<HTMLDivElement>(null)
  const question = useRef<HTMLDivElement>(null)
  const router = useRef<HTMLDivElement>(null)
  const tables = useRef<HTMLDivElement>(null)
  const live = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLDivElement>(null)
  const answer = useRef<HTMLDivElement>(null)

  const beam = {
    containerRef: box,
    pathColor: 'rgb(13 15 20)',
    pathOpacity: 0.14,
    pathWidth: 1.5,
    gradientStartColor: SIGNAL,
    gradientStopColor: TONE_HEX.mint,
    duration: 3.2,
  }

  return (
    <figure className="flex h-full flex-col justify-center gap-5">
      {/* Example query from the project README */}
      <div aria-hidden="true" className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
        <span className="font-mono text-[0.72rem] text-signal">&gt;</span>
        <span className="text-[0.9rem] text-foreground">When is Zeitgeist?</span>
        <span className="ml-auto h-4 w-px animate-caret bg-signal" />
      </div>
      <div
        ref={box}
        role="img"
        aria-label="A question goes to a rule-based router, which sends it to CSV tables, the live institute API or hybrid search, and the result goes to the language model for a cited answer."
        className="relative flex items-center justify-between gap-1 py-2"
      >
        <Node ref={question} Icon={MessageCircleQuestion} label="Question" />
        <Node ref={router} Icon={Split} label="Router" note="rules, no LLM" accent />
        <div className="flex flex-col gap-5">
          <Node ref={tables} Icon={Database} label="Tables" note="lookups" />
          <Node ref={live} Icon={Radio} label="Live API" note="time-sensitive" />
          <Node ref={search} Icon={FileSearch} label="Hybrid search" note="BM25 + BGE" />
        </div>
        <Node ref={answer} Icon={Sparkles} label="Answer" note="top 6, cited" accent />

        <AnimatedBeam {...beam} fromRef={question} toRef={router} />
        <AnimatedBeam {...beam} fromRef={router} toRef={tables} curvature={-36} delay={0.3} />
        <AnimatedBeam {...beam} fromRef={router} toRef={live} delay={0.6} />
        <AnimatedBeam {...beam} fromRef={router} toRef={search} curvature={36} delay={0.9} />
        <AnimatedBeam {...beam} fromRef={tables} toRef={answer} curvature={-36} delay={1.2} />
        <AnimatedBeam {...beam} fromRef={live} toRef={answer} delay={1.5} />
        <AnimatedBeam {...beam} fromRef={search} toRef={answer} curvature={36} delay={1.8} />
      </div>

      {/* Shape of a reply: text, then numbered sources */}
      <div aria-hidden="true" className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-signal" />
          ANSWER WITH SOURCES
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="w-[92%]" />
          <Skeleton className="w-[78%]" />
          <Skeleton className="w-[55%]" />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[0.62rem] text-foreground/70">
          {['[1] iitrpr.ac.in', '[2] handbook.pdf', '[3] calendar'].map(source => (
            <span key={source} className="rounded-md border border-signal/25 bg-signal-soft px-2 py-1 text-signal">
              {source}
            </span>
          ))}
        </div>
      </div>
      {/* Retrieval settings tuned on the evaluation set */}
      <dl aria-hidden="true" className="grid grid-cols-3 gap-2 font-mono">
        {[
          ['TOP_K', '6'],
          ['HYBRID_ALPHA', '0.5'],
          ['MIN_RELEVANCE', '0.65'],
        ].map(([key, value]) => (
          <div key={key} className="rounded-lg border border-line bg-white px-3 py-2.5">
            <dt className="truncate text-[0.56rem] tracking-[0.14em] text-muted-foreground">{key}</dt>
            <dd className="mt-1 text-[0.95rem] text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="sr-only">Architecture of the Ask IIT Ropar retrieval pipeline.</figcaption>
    </figure>
  )
}
