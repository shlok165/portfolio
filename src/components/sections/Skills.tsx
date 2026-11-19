import type { CSSProperties } from 'react'
import { techLogos } from '@/components/icons'
import { Panel } from '@/components/layout/Panel'
import { Accent, Section } from '@/components/layout/Section'
import { Marquee } from '@/components/magicui/marquee'
import { skills, TONE_HEX } from '@/data/profile'

export function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      eyebrow="Skills"
      meta={`${skills.reduce((n, group) => n + group.items.length, 0)} entries`}
      title={
        <>
          The <Accent>toolkit</Accent> behind the work.
        </>
      }
      lead="Everything here has been used in a project or internship on this page."
    >
      {/* Logos sit in grey and take their brand colour on hover. */}
      <div data-reveal="" className="panel mask-fade-x mb-4 overflow-hidden rounded-2xl py-4">
        <Marquee pauseOnHover className="p-0 [--duration:42s] [--gap:2.5rem]">
          {techLogos.map(({ name, hex, Icon }) => (
            <span
              key={name}
              style={{ '--brand': hex } as CSSProperties}
              className="flex items-center gap-2.5 text-foreground/45 transition-colors duration-300 hover:text-(--brand)"
            >
              <Icon className="size-5" />
              <span className="text-[0.9rem] font-medium text-foreground/70">{name}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Panel reveal className="p-0 sm:p-0">
        <div className="hidden grid-cols-[15rem_1fr] border-b border-line px-7 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-dim md:grid">
          <span>Area</span>
          <span>Tools and techniques</span>
        </div>
        <ul className="divide-y divide-line">
          {skills.map(group => (
            <li key={group.title} className="grid gap-3 px-5 py-5 sm:px-7 md:grid-cols-[15rem_1fr] md:items-center md:gap-6">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="size-2 rounded-sm" style={{ background: TONE_HEX[group.tone] }} />
                <div>
                  <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em]">{group.title}</h3>
                  <p className="font-mono text-[0.68rem] text-muted-foreground">{group.note}</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-white px-2.5 py-1.5 text-[0.86rem] text-foreground/85 transition-colors hover:border-ink/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Panel>
    </Section>
  )
}
