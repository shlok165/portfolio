import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { Fragment } from 'react'
import { GlassCard } from '@/components/glass/GlassCard'
import { Accent, Chip, Section } from '@/components/layout/Section'
import { BorderBeam } from '@/components/magicui/border-beam'
import { internship, involvement, TONE_HEX } from '@/data/profile'

// What the internship certificate describes the work as covering.
const flow = ['Acquisition', 'Processing', 'Communication']

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title={
        <>
          Shipping in a team, <Accent>early</Accent>.
        </>
      }
      lead="A robotics internship in my first year, then leading and coordinating on campus."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard reveal tone={internship.tone} className="lg:col-span-3 lg:p-10">
          <BorderBeam size={140} duration={9} colorFrom={TONE_HEX.mint} colorTo={TONE_HEX.sky} borderWidth={1} />
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-13 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] font-serif text-2xl italic text-mint shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
              >
                S
              </span>
              <div>
                <p className="text-[1.05rem] font-semibold tracking-[-0.01em]">{internship.org}</p>
                <p className="text-sm text-muted-foreground">{internship.orgNote}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-[0.8rem] text-muted-foreground sm:items-end">
              <span className="flex items-center gap-2 font-mono tracking-wide text-foreground/80">
                <CalendarDays className="size-3.5 text-mint" aria-hidden="true" />
                {internship.period}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5" aria-hidden="true" />
                {internship.place}
              </span>
            </div>
          </div>

          <h3 className="mt-8 text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.1rem]">
            {internship.role}
          </h3>

          {/* Data path through a robotic system */}
          <div
            aria-hidden="true"
            className="mt-7 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-3 font-mono text-[0.7rem] tracking-wide"
          >
            <span className="rounded-lg bg-mint/10 px-2.5 py-1.5 text-mint">ROS</span>
            {flow.map(step => (
              <Fragment key={step}>
                <svg viewBox="0 0 36 8" className="h-2 w-6 shrink-0 sm:w-9">
                  <path
                    d="M0 4h36"
                    className="animate-flow stroke-mint/60"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>
                <span className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-foreground/80">{step}</span>
              </Fragment>
            ))}
          </div>

          <ul className="mt-7 space-y-3.5">
            {internship.points.map(point => (
              <li key={point} className="flex gap-3.5 text-[0.98rem] leading-relaxed text-foreground/80">
                <ArrowRight className="mt-[0.35rem] size-4 shrink-0 text-mint" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {internship.tags.map(tag => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:col-span-2">
          {involvement.map((item, i) => (
            <GlassCard key={item.role} reveal={120 + i * 110} tone={item.tone} className="flex flex-col lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted-foreground">{item.org}</p>
                {item.current ? (
                  <span className="flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 font-mono text-[0.66rem] tracking-wider text-mint">
                    <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-mint" />
                    NOW
                  </span>
                ) : (
                  <span className="font-mono text-[0.72rem] tracking-wide text-foreground/60">{item.period}</span>
                )}
              </div>

              {item.role.startsWith('Inter IIT') ? (
                <p aria-hidden="true" className="mt-6 flex items-baseline gap-2">
                  <span className="text-[4rem] font-semibold leading-none tracking-[-0.05em]">
                    6<span className="align-top text-[0.4em] tracking-normal text-muted-foreground">th</span>
                  </span>
                  <span className="font-serif text-2xl italic text-muted-foreground">of 23 IITs</span>
                </p>
              ) : null}

              <h3 className="mt-5 text-[1.3rem] font-semibold leading-snug tracking-[-0.02em]">{item.role}</h3>
              {item.orgNote ? <p className="mt-1 text-sm text-muted-foreground">{item.orgNote}</p> : null}
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{item.points[0]}</p>

              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {item.tags.map(tag => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  )
}
