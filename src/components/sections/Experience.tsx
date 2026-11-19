import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { Fragment } from 'react'
import { Panel } from '@/components/layout/Panel'
import { Accent, Chip, Section } from '@/components/layout/Section'
import { internship, involvement } from '@/data/profile'

// What the internship certificate describes the work as covering.
const flow = ['Acquisition', 'Processing', 'Communication']

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      meta="2025 — now"
      title={
        <>
          Shipping in a team, <Accent>early</Accent>.
        </>
      }
      lead="A robotics internship in my first year, then leading and coordinating on campus."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel reveal tone={internship.tone} className="p-0 sm:p-0 lg:col-span-3">
          {/* Header strip, like the title block of a drawing */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-3.5 font-mono text-[0.72rem] text-muted-foreground sm:px-8">
            <span className="flex items-center gap-2">
              <span className="text-signal">EXP-01</span>
              <span aria-hidden="true">·</span>
              Internship
            </span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {internship.period}
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <MapPin className="size-3.5" aria-hidden="true" />
                {internship.place}
              </span>
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-muted font-mono text-[0.95rem] font-semibold text-signal"
              >
                SB
              </span>
              <div>
                <p className="text-[1.02rem] font-semibold tracking-[-0.01em]">{internship.org}</p>
                <p className="text-sm text-muted-foreground">{internship.orgNote}</p>
              </div>
            </div>

            <h3 className="mt-7 text-[1.6rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[1.95rem]">
              {internship.role}
            </h3>

            {/* Data path through a robotic system */}
            <div
              aria-hidden="true"
              className="blueprint mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-line px-3 py-3 font-mono text-[0.7rem]"
            >
              <span className="rounded-md bg-signal px-2.5 py-1.5 font-medium text-white">ROS</span>
              {flow.map(step => (
                <Fragment key={step}>
                  <svg viewBox="0 0 36 8" className="h-2 w-6 shrink-0 sm:w-9">
                    <path
                      d="M0 4h36"
                      className="animate-flow stroke-signal/70"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  </svg>
                  <span className="rounded-md border border-line bg-white px-2.5 py-1.5 text-foreground/80">{step}</span>
                </Fragment>
              ))}
            </div>

            <ul className="mt-7 space-y-3">
              {internship.points.map(point => (
                <li key={point} className="flex gap-3 text-[0.96rem] leading-relaxed text-foreground/80">
                  <ArrowRight className="mt-[0.35rem] size-4 shrink-0 text-signal" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {internship.tags.map(tag => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 lg:col-span-2">
          {involvement.map((item, i) => (
            <Panel key={item.role} reveal={120 + i * 110} tone={item.tone} className="flex flex-col">
              <div className="flex items-center justify-between gap-3 font-mono text-[0.72rem]">
                <span className="text-muted-foreground">
                  <span className="text-signal">EXP-0{i + 2}</span> · {item.org}
                </span>
                {item.current ? (
                  <span className="flex items-center gap-1.5 rounded-md border border-live/25 bg-live/10 px-2 py-1 text-[0.66rem] font-medium tracking-wider text-live">
                    <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-live text-live" />
                    CURRENT
                  </span>
                ) : (
                  <span className="text-muted-foreground">{item.period}</span>
                )}
              </div>

              {item.role.startsWith('Inter IIT') ? (
                <p aria-hidden="true" className="mt-6 flex items-baseline gap-2">
                  <span className="text-[3.6rem] font-semibold leading-none tracking-[-0.05em]">
                    6<span className="align-top text-[0.38em] tracking-normal text-muted-foreground">th</span>
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">/ 23 IITs</span>
                </p>
              ) : null}

              <h3 className="mt-5 text-[1.22rem] font-semibold leading-snug tracking-[-0.02em]">{item.role}</h3>
              {item.orgNote ? <p className="mt-1 text-sm text-muted-foreground">{item.orgNote}</p> : null}
              <p className="mt-3 text-[0.94rem] leading-relaxed text-muted-foreground">{item.points[0]}</p>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {item.tags.map(tag => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Section>
  )
}
