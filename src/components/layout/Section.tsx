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
  children: ReactNode
  className?: string
}

/** Serif-italic aurora word used for emphasis inside headings. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <em className={cn('pr-[0.08em] font-serif text-[1.1em] font-normal italic leading-none text-aurora', className)}>
      {children}
    </em>
  )
}

export function Section({ id, index, eyebrow, title, lead, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('relative scroll-mt-24 py-20 sm:py-28', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div>
            <BlurFade inView inViewMargin="-80px">
              <p className="eyebrow flex items-center gap-3 text-muted-foreground">
                <span className="text-mint">{index}</span>
                <span aria-hidden="true" className="h-px w-8 bg-white/20" />
                <DecryptedText
                  text={eyebrow}
                  animateOn="view"
                  sequential
                  speed={45}
                  encryptedClassName="text-mint/60"
                />
              </p>
            </BlurFade>
            <BlurFade inView inViewMargin="-80px" delay={0.08}>
              <h2
                id={`${id}-title`}
                className="mt-5 max-w-3xl text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]"
              >
                {title}
              </h2>
            </BlurFade>
          </div>
          {lead ? (
            <BlurFade inView inViewMargin="-80px" delay={0.16}>
              <p className="max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-2 lg:text-right">
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

/** Small pill used for stack and tag lists. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 font-mono text-[0.7rem] tracking-wide text-foreground/80',
        className,
      )}
    >
      {children}
    </span>
  )
}
