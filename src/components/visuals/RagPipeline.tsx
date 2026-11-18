import { Database, FileSearch, MessageCircleQuestion, Radio, Sparkles, Split } from 'lucide-react'
import { useRef, type ComponentType, type ReactNode, type Ref, type SVGProps } from 'react'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { TONE_HEX } from '@/data/profile'
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
          'grid size-11 place-items-center rounded-2xl border bg-[#0b1020] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_10px_24px_-10px_rgb(0_0_0/0.9)] sm:size-12',
          accent ? 'border-sky/50 text-sky' : 'border-white/12 text-foreground/80',
        )}
      >
        <Icon className="size-[1.15rem]" aria-hidden="true" />
      </div>
      <p className="text-[0.68rem] font-medium leading-tight text-foreground/85 sm:text-[0.74rem]">{label}</p>
      {note ? <p className="-mt-1.5 font-mono text-[0.56rem] leading-tight text-foreground/45">{note}</p> : null}
    </div>
  )
}

function Skeleton({ className }: { className?: string }): ReactNode {
  return <span className={cn('block h-2 rounded-full bg-white/10', className)} />
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
    pathColor: 'rgb(255 255 255)',
    pathOpacity: 0.12,
    pathWidth: 1.5,
    gradientStartColor: TONE_HEX.mint,
    gradientStopColor: TONE_HEX.sky,
    duration: 3.2,
  }

  return (
    <figure className="flex h-full flex-col justify-center gap-5">
      {/* Example query from the project README */}
      <div aria-hidden="true" className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
        <span className="font-mono text-[0.72rem] text-mint">&gt;</span>
        <span className="text-[0.9rem] text-foreground/85">When is Zeitgeist?</span>
        <span className="ml-auto h-4 w-px animate-caret bg-mint" />
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
      <div aria-hidden="true" className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-foreground/45">
          <span className="size-1.5 rounded-full bg-sky" />
          ANSWER WITH SOURCES
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="w-[92%]" />
          <Skeleton className="w-[78%]" />
          <Skeleton className="w-[55%]" />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[0.62rem] text-foreground/70">
          {['[1] iitrpr.ac.in', '[2] handbook.pdf', '[3] calendar'].map(source => (
            <span key={source} className="rounded-md border border-sky/25 bg-sky/10 px-2 py-1 text-sky">
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
          <div key={key} className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2.5">
            <dt className="truncate text-[0.56rem] tracking-[0.14em] text-foreground/45">{key}</dt>
            <dd className="mt-1 text-[0.95rem] text-foreground/90">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="sr-only">Architecture of the Ask IIT Ropar retrieval pipeline.</figcaption>
    </figure>
  )
}
