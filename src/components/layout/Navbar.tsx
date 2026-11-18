import { BriefcaseBusiness, House, Layers, Mail, Search, UserRound, Wrench } from 'lucide-react'
import { motion } from 'motion/react'
import GlassSurface from '@/components/reactbits/GlassSurface'
import { nav, site } from '@/data/profile'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'

type NavProps = {
  active: string
  onOpenCommand: () => void
}

const hasResume = __HAS_RESUME__

function Monogram({ onClick }: { onClick: () => void }) {
  return (
    <a
      href="#top"
      onClick={event => {
        event.preventDefault()
        onClick()
      }}
      aria-label={`${site.name}, back to top`}
      className="group relative grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.07] font-serif text-lg italic text-foreground transition-colors hover:bg-white/[0.12]"
    >
      <span aria-hidden="true" className="translate-y-px">
        {site.initials}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 ring-1 ring-mint/60 transition-opacity duration-300 group-hover:opacity-100"
      />
    </a>
  )
}

/** Desktop: a floating liquid-glass pill (React Bits GlassSurface). */
export function Navbar({ active, onOpenCommand }: NavProps) {
  const scrollTo = useScrollTo()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-4 md:flex">
      <nav aria-label="Primary" className="pointer-events-auto">
        <GlassSurface
          width="auto"
          height={58}
          borderRadius={29}
          backgroundOpacity={0.72}
          saturation={1.5}
          displace={5}
          distortionScale={-120}
          redOffset={0}
          greenOffset={8}
          blueOffset={16}
        >
          <div className="flex items-center gap-1">
            <Monogram onClick={() => scrollTo('top')} />
            <ul className="mx-1 flex items-center">
              {nav.map(item => {
                const current = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={current ? 'location' : undefined}
                      onClick={event => {
                        event.preventDefault()
                        scrollTo(item.id)
                      }}
                      className={cn(
                        'relative block rounded-full px-3.5 py-2 text-[0.88rem] font-medium transition-colors duration-300',
                        current ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
                      )}
                    >
                      {current ? (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Open command menu"
              className="flex h-10 items-center gap-2 rounded-full bg-white/[0.06] pl-3 pr-2 text-[0.8rem] text-foreground/60 transition-colors hover:bg-white/[0.1] hover:text-foreground"
            >
              <Search className="size-3.5" aria-hidden="true" />
              <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.68rem] tracking-wider text-foreground/70">
                Ctrl K
              </kbd>
            </button>
            <a
              href={hasResume ? site.resume : `mailto:${site.email}`}
              {...(hasResume ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="ml-1 flex h-10 items-center rounded-full bg-foreground px-4 text-[0.85rem] font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              {hasResume ? 'Résumé' : 'Say hello'}
            </a>
          </div>
        </GlassSurface>
      </nav>
    </header>
  )
}

const dockItems = [
  { id: 'top', label: 'Home', Icon: House },
  { id: 'about', label: 'About', Icon: UserRound },
  { id: 'experience', label: 'Work', Icon: BriefcaseBusiness },
  { id: 'projects', label: 'Projects', Icon: Layers },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'contact', label: 'Contact', Icon: Mail },
] as const

/** Phones: a frosted tab bar within thumb reach. */
export function MobileDock({ active }: { active: string }) {
  const scrollTo = useScrollTo()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="glass glass-edge relative flex w-full max-w-md items-stretch justify-between rounded-[1.6rem] p-1.5 [--glass-blur:22px] [--glass-tint:rgb(10_13_24/0.62)]">
        {dockItems.map(({ id, label, Icon }) => {
          const current = active === id
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={current ? 'location' : undefined}
                onClick={event => {
                  event.preventDefault()
                  scrollTo(id)
                }}
                className={cn(
                  'relative flex flex-col items-center gap-1 rounded-[1.2rem] px-1 py-2 text-[0.62rem] font-medium tracking-wide transition-colors',
                  current ? 'text-foreground' : 'text-foreground/55',
                )}
              >
                {current ? (
                  <motion.span
                    layoutId="dock-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[1.2rem] bg-white/[0.1] shadow-[inset_0_1px_0_rgb(255_255_255/0.16)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <Icon className={cn('relative size-[1.15rem]', current && 'text-mint')} aria-hidden="true" />
                <span className="relative">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
