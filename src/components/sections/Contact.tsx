import { ArrowUpRight, Copy, FileText, Send } from 'lucide-react'
import { CodeforcesIcon, GithubIcon, LeetcodeIcon, LinkedinIcon } from '@/components/icons'
import { Panel } from '@/components/layout/Panel'
import { Accent, Crosshair } from '@/components/layout/Section'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { site, socials } from '@/data/profile'
import { copyEmail } from '@/lib/actions'
import { useScrollTo } from '@/lib/scroll'

const profiles = [
  { label: 'GitHub', handle: 'shlok165', href: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', handle: 'shlok-vaidya', href: socials.linkedin, Icon: LinkedinIcon },
  { label: 'LeetCode', handle: 'SN_v', href: socials.leetcode, Icon: LeetcodeIcon },
  { label: 'Codeforces', handle: 'shlokvaidya11', href: socials.codeforces, Icon: CodeforcesIcon },
].filter(profile => profile.href)

const BUTTON =
  'group inline-flex h-12 items-center gap-2.5 rounded-lg px-5 text-[0.95rem] font-medium transition-[background-color,border-color] duration-200'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 py-14 sm:py-18">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Panel reveal tone="sky" className="relative grid overflow-hidden p-0 sm:p-0 lg:grid-cols-[1.25fr_1fr]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 mask-radial opacity-70">
            <FlickeringGrid squareSize={3} gridGap={7} flickerChance={0.15} color="#2350ff" maxOpacity={0.12} />
          </div>

          <div className="relative px-6 pt-10 sm:px-10 sm:pt-14 lg:pb-14">
            <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-signal">05</span>
              <span aria-hidden="true">/</span>
              Contact
            </p>
            <h2
              id="contact-title"
              className="mt-6 max-w-xl text-[2.5rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-[3.6rem]"
            >
              Let’s <Accent>work together</Accent>.
            </h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-muted-foreground">
              I’m open to opportunities in AI systems, software engineering and robotics. Email is the fastest way to
              reach me.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => void copyEmail()}
                className={`${BUTTON} bg-ink text-white hover:bg-ink/85`}
              >
                <span className="font-mono text-[0.88rem]">{site.email}</span>
                <Copy className="size-4 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                <span className="sr-only">Copy email address</span>
              </button>
              <a href={`mailto:${site.email}`} className={`${BUTTON} border border-line-strong bg-white hover:border-ink/40`}>
                <Send className="size-4 text-muted-foreground" aria-hidden="true" />
                Write an email
              </a>
              {__HAS_RESUME__ ? (
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noreferrer"
                  className={`${BUTTON} border border-line-strong bg-white hover:border-ink/40`}
                >
                  <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  Résumé
                </a>
              ) : null}
            </div>
          </div>

          {/* Profiles, as a small directory listing */}
          <div className="relative border-t border-line bg-white/80 lg:border-l lg:border-t-0">
            <p className="border-b border-line px-6 py-3.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim sm:px-8">
              Profiles
            </p>
            <ul className="divide-y divide-line">
              {profiles.map(({ label, handle, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/60 sm:px-8"
                  >
                    <span className="grid size-9 place-items-center rounded-lg border border-line bg-white">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] font-medium">{label}</span>
                      <span className="block truncate font-mono text-[0.74rem] text-muted-foreground">{handle}</span>
                    </span>
                    <ArrowUpRight
                      className="size-4 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

const credit = 'underline decoration-line-strong underline-offset-4 hover:text-foreground'

export function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="relative z-10 pb-28 md:pb-10">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="relative flex items-center md:-mx-8">
          <Crosshair className="hidden md:block md:-ml-[5.5px]" />
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <Crosshair className="hidden md:block md:-mr-[5.5px]" />
        </div>
        <div className="flex flex-col gap-4 pt-6 font-mono text-[0.74rem] text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p className="shrink-0">
            © {YEAR} {site.name} · {site.location}
          </p>
          <p className="text-dim lg:text-center">
            Built with React, Tailwind CSS and Motion · components from{' '}
            <a className={credit} href="https://reactbits.dev" target="_blank" rel="noreferrer">
              React Bits
            </a>
            ,{' '}
            <a className={credit} href="https://magicui.design" target="_blank" rel="noreferrer">
              Magic UI
            </a>{' '}
            and{' '}
            <a className={credit} href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
              shadcn/ui
            </a>
          </p>
          <a
            href="#top"
            onClick={event => {
              event.preventDefault()
              scrollTo('top')
            }}
            className="w-fit shrink-0 text-foreground/70 transition-colors hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
