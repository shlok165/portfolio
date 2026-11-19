import type { ReactNode } from 'react'
import { BlurFade } from '@/components/magicui/blur-fade'
import DecryptedText from '@/components/reactbits/DecryptedText'
import { cn } from '@/lib/utils'

type SectionProps = {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  /** Short mono note at the right end of the section rule. */
  meta?: string
  children: ReactNode
  className?: string
}

/** Emphasised word inside a heading: accent colour over a highlighter stroke. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('marker text-signal', className)}>{children}</span>
}

/** A "+" registration mark, as on a technical drawing. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 11 11" className={cn('size-[11px] text-line-strong', className)}>
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function Section({ id, index, eyebrow, title, lead, meta, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('relative scroll-mt-20 py-14 sm:py-18', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <BlurFade inView inViewMargin="-80px">
          {/* The rule runs rail to rail, with registration marks sitting on the page frame. */}
          <div className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground md:-mx-8">
            <Crosshair className="hidden md:block md:-ml-[5.5px] md:mr-5" />
            <span className="text-signal">{index}</span>
            <span aria-hidden="true">/</span>
            <DecryptedText text={eyebrow} animateOn="view" sequential speed={40} encryptedClassName="text-signal/60" />
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            {meta ? <span className="hidden text-dim sm:inline">{meta}</span> : null}
            <Crosshair className="hidden md:block md:-mr-[5.5px] md:ml-5" />
          </div>
        </BlurFade>
        <header className="mb-10 mt-7 grid gap-5 sm:mb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <BlurFade inView inViewMargin="-80px" delay={0.06}>
            <h2
              id={`${id}-title`}
              className="max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[2.9rem] lg:text-[3.3rem]"
            >
              {title}
            </h2>
          </BlurFade>
          {lead ? (
            <BlurFade inView inViewMargin="-80px" delay={0.12}>
              <p className="max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5 lg:text-right">
                {lead}
              </p>
            </BlurFade>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  )
}

/** Small mono tag used for stack and tag lists. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-line bg-muted/70 px-2 py-[0.3rem] font-mono text-[0.7rem] leading-none text-foreground/75',
        className,
      )}
    >
      {children}
    </span>
  )
}
