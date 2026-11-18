import { ArrowUpRight, Copy, FileText, Send } from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'
import { CodeforcesIcon, GithubIcon, LeetcodeIcon, LinkedinIcon } from '@/components/icons'
import { Accent } from '@/components/layout/Section'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Particles } from '@/components/magicui/particles'
import Magnet from '@/components/reactbits/Magnet'
import { site, socials, TONE_HEX } from '@/data/profile'
import { copyEmail } from '@/lib/actions'
import { useScrollTo } from '@/lib/scroll'

const profiles = [
  { label: 'GitHub', href: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: socials.linkedin, Icon: LinkedinIcon },
  { label: 'LeetCode', href: socials.leetcode, Icon: LeetcodeIcon },
  { label: 'Codeforces', href: socials.codeforces, Icon: CodeforcesIcon },
].filter(profile => profile.href)

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <GlassCard
          reveal
          tone="sky"
          className="relative px-6 py-14 text-center sm:px-12 sm:py-20 [--glass-tint:rgb(13_17_30/0.5)]"
        >
          <Particles className="absolute inset-0" quantity={70} size={0.5} staticity={40} color="#bcd7ff" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[46rem] max-w-full rounded-full bg-[radial-gradient(closest-side,rgb(92_200_255/0.22),transparent)]"
          />
          <BorderBeam size={220} duration={11} colorFrom={TONE_HEX.sky} colorTo={TONE_HEX.iris} borderWidth={1} />

          <div className="relative">
            <p className="eyebrow flex items-center justify-center gap-3 text-muted-foreground">
              <span className="text-mint">05</span>
              <span aria-hidden="true" className="h-px w-8 bg-white/20" />
              Contact
            </p>
            <h2
              id="contact-title"
              className="mx-auto mt-6 max-w-3xl text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] sm:text-[4.4rem]"
            >
              Let’s build something <Accent>reliable</Accent>.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
              I’m open to opportunities in AI systems, data engineering and robotics. Email is the fastest way to
              reach me.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnet padding={50} magnetStrength={3}>
                <button
                  type="button"
                  onClick={() => void copyEmail()}
                  className="group flex h-13 items-center gap-3 rounded-full bg-foreground pl-6 pr-5 text-[0.98rem] font-semibold text-primary-foreground shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_18px_50px_-12px_rgb(92_200_255/0.55)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.3),0_22px_60px_-10px_rgb(164_149_255/0.75)]"
                >
                  {site.email}
                  <Copy className="size-4 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <span className="sr-only">Copy email address</span>
                </button>
              </Magnet>
              <a
                href={`mailto:${site.email}`}
                className="flex h-13 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-6 text-[0.98rem] font-medium transition-colors hover:bg-white/[0.12]"
              >
                <Send className="size-4 text-muted-foreground" aria-hidden="true" />
                Write an email
              </a>
              {__HAS_RESUME__ ? (
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-13 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-6 text-[0.98rem] font-medium transition-colors hover:bg-white/[0.12]"
                >
                  <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  Résumé
                </a>
              ) : null}
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {profiles.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 text-[0.92rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4" />
                    {label}
                    <ArrowUpRight
                      className="size-3.5 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="relative z-10 pb-28 md:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 text-[0.82rem] text-muted-foreground sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>
          © {YEAR} {site.name} · {site.location}
        </p>
        <p className="text-foreground/45">
          Built with React, Tailwind CSS and Motion. Components from{' '}
          <a className="underline decoration-white/20 underline-offset-4 hover:text-foreground" href="https://reactbits.dev" target="_blank" rel="noreferrer">
            React Bits
          </a>
          ,{' '}
          <a className="underline decoration-white/20 underline-offset-4 hover:text-foreground" href="https://magicui.design" target="_blank" rel="noreferrer">
            Magic UI
          </a>{' '}
          and{' '}
          <a className="underline decoration-white/20 underline-offset-4 hover:text-foreground" href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
            shadcn/ui
          </a>
          .
        </p>
        <a
          href="#top"
          onClick={event => {
            event.preventDefault()
            scrollTo('top')
          }}
          className="w-fit text-foreground/70 transition-colors hover:text-foreground"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
