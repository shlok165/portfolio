import { BookOpenText, Contact, FileText, MessageSquareQuote, Radio, Split } from 'lucide-react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { dur, ease, stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Route = {
  id: 'directory' | 'live' | 'docs'
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  steps: { name: string; detail: string }[]
}

// Routes and steps as described in the CV; nothing here is sampled output.
const ROUTES: Route[] = [
  {
    id: 'directory',
    label: 'Directory lookup',
    Icon: Contact,
    steps: [
      { name: 'Rule-based router', detail: 'Matches a directory-style question' },
      { name: 'Directory lookup', detail: 'Answered from the directory' },
    ],
  },
  {
    id: 'live',
    label: 'Live institute API',
    Icon: Radio,
    steps: [
      { name: 'Rule-based router', detail: 'Matches a question that needs live data' },
      { name: 'Live institute API', detail: 'Answered from the API' },
    ],
  },
  {
    id: 'docs',
    label: 'Document search',
    Icon: BookOpenText,
    steps: [
      { name: '1,900+ pages & PDFs', detail: 'Scraped from IIT Ropar' },
      { name: '7.9K chunks', detail: '~350 words each, overlapping' },
      { name: 'BGE-small → ChromaDB', detail: 'Embeddings stored for search' },
      { name: 'Hybrid retrieval', detail: 'Cosine similarity + BM25 keyword ranking' },
      { name: 'Top-6 chunks', detail: 'Passed to GPT-5.4-mini' },
      { name: 'Answer with citations', detail: 'Sources listed with the reply' },
    ],
  },
]

/**
 * How a question is routed in Ask IIT Ropar. Pick a route to trace its path.
 * Cycles on its own until the visitor picks one (not with reduced motion).
 */
export default function RouterDemo() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [index, setIndex] = useState(2)
  const [touched, setTouched] = useState(false)
  const route = ROUTES[index]!

  useEffect(() => {
    if (touched || reduce || !inView) return undefined
    const id = window.setInterval(() => setIndex(i => (i + 1) % ROUTES.length), 4200)
    return () => window.clearInterval(id)
  }, [touched, reduce, inView])

  const pick = (i: number) => {
    setTouched(true)
    setIndex(i)
  }

  return (
    <figure ref={ref} className="flex h-full flex-col gap-5">
      <figcaption className="flex items-center justify-between">
        <span className="label">How a question is routed</span>
        <span className="font-mono text-2xs text-ink-3">{touched ? 'manual' : 'auto-cycling'}</span>
      </figcaption>

      {/* Question → router */}
      <div className="flex items-center gap-3">
        <div className="surface flex size-11 shrink-0 items-center justify-center rounded-md">
          <MessageSquareQuote className="size-4 text-ink-2" aria-hidden="true" />
        </div>
        <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
        <div className="flex h-11 items-center gap-2 rounded-md border border-accent-line bg-accent-wash px-3 text-sm text-ink">
          <Split className="size-4 text-accent" aria-hidden="true" />
          Rule-based router
        </div>
      </div>

      {/* Route picker */}
      <div role="radiogroup" aria-label="Route" className="grid grid-cols-3 gap-2">
        {ROUTES.map((r, i) => {
          const on = i === index
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={e => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  pick((i + 1) % ROUTES.length)
                  ;(e.currentTarget.parentElement?.children[(i + 1) % ROUTES.length] as HTMLElement | undefined)?.focus()
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  const n = (i - 1 + ROUTES.length) % ROUTES.length
                  pick(n)
                  ;(e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus()
                }
              }}
              className={cn(
                'relative flex min-h-16 flex-col items-start justify-between gap-2 rounded-md border p-3 text-left text-xs transition-colors duration-(--dur-2)',
                on ? 'border-accent bg-surface text-ink shadow-1' : 'border-line bg-surface/60 text-ink-3 hover:border-line-strong hover:text-ink-2',
              )}
            >
              <r.Icon className={cn('size-4', on ? 'text-accent' : 'text-ink-3')} aria-hidden="true" />
              {r.label}
              {on && !touched && !reduce ? (
                <motion.span
                  key={`timer-${index}`}
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1.5 h-px origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4.2, ease: 'linear' }}
                />
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Steps for the selected route */}
      <div className="surface relative flex-1 rounded-lg p-4" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={route.id}
            className="relative grid gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: dur[1] } }}
          >
            {route.steps.map((step, i) => (
              <motion.li
                key={step.name}
                className="relative flex gap-3 pb-4 last:pb-0"
                initial={{ opacity: 0, x: reduce ? 0 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: dur[3], ease: ease.out, delay: reduce ? 0 : i * stagger.loose * 1.5 }}
              >
                <span className="relative flex w-5 shrink-0 justify-center" aria-hidden="true">
                  <span
                    className={cn(
                      'z-10 mt-1 size-2.5 rounded-full border',
                      i === route.steps.length - 1 ? 'border-accent bg-accent' : 'border-ink-3 bg-surface',
                    )}
                  />
                  {i < route.steps.length - 1 ? <span className="absolute bottom-[-0.25rem] top-4 w-px bg-line-strong" /> : null}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{step.name}</span>
                  <span className="block text-xs text-ink-3">{step.detail}</span>
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <p className="flex items-center gap-2 text-xs text-ink-3">
        <FileText className="size-3.5" aria-hidden="true" />
        Weighting, chunk count and relevance threshold tuned on a 49-question eval set (hit@5, MRR).
      </p>
    </figure>
  )
}
