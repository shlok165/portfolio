import { GlassCard } from '@/components/glass/GlassCard'
import { techLogos } from '@/components/icons'
import { Accent, Section } from '@/components/layout/Section'
import { Marquee } from '@/components/magicui/marquee'
import { skills, TONE_HEX } from '@/data/profile'
import { cn } from '@/lib/utils'

// Wide cards on the first row, three narrower ones below.
const spans = ['lg:col-span-2', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-6']

export function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      eyebrow="Skills"
      title={
        <>
          The <Accent>toolkit</Accent> behind the work.
        </>
      }
      lead="Everything here has been used in a project or internship on this page."
    >
      <div
        data-reveal=""
        className="glass glass-edge mask-fade-x relative mb-4 overflow-hidden rounded-[1.75rem] py-5"
      >
        <Marquee pauseOnHover className="p-0 [--duration:42s] [--gap:2.75rem]">
          {techLogos.map(({ name, Icon }) => (
            <span key={name} className="flex items-center gap-2.5 text-foreground/55 transition-colors hover:text-foreground">
              <Icon className="size-6" />
              <span className="text-[0.95rem] font-medium">{name}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="grid gap-4 lg:grid-cols-6">
        {skills.map((group, i) => (
          <GlassCard key={group.title} reveal={(i % 2) * 90} tone={group.tone} className={cn(spans[i])}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="flex items-center gap-3 text-[1.25rem] font-semibold tracking-[-0.02em]">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ background: TONE_HEX[group.tone], boxShadow: `0 0 14px 1px ${TONE_HEX[group.tone]}` }}
                />
                {group.title}
              </h3>
              <p className="text-right text-[0.8rem] text-muted-foreground">{group.note}</p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map(item => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[0.9rem] text-foreground/85 transition-colors hover:border-white/25 hover:bg-white/[0.09]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
