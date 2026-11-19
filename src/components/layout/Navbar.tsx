import { BriefcaseBusiness, House, Layers, Mail, Search, UserRound, Wrench } from 'lucide-react'
import { motion } from 'motion/react'
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
      className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink font-mono text-[0.78rem] font-semibold tracking-tight text-white transition-transform hover:scale-[1.04]"
    >
      <span aria-hidden="true">{site.initials}</span>
    </a>
  )
}

/** Desktop: a floating frosted bar. */
export function Navbar({ active, onOpenCommand }: NavProps) {
  const scrollTo = useScrollTo()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-4 md:flex">
      <nav aria-label="Primary" className="frost pointer-events-auto flex h-[3.4rem] items-center gap-1 rounded-xl px-2">
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
                    'relative block rounded-lg px-3 py-2 text-[0.86rem] font-medium transition-colors duration-200',
                    current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {current ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-ink/[0.06]"
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
          className="flex h-9 items-center gap-2 rounded-lg border border-line bg-white/70 pl-2.5 pr-1.5 text-[0.8rem] text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span>Search</span>
          <kbd className="rounded border border-line bg-muted px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground/70">
            Ctrl K
          </kbd>
        </button>
        <a
          href={hasResume ? site.resume : `mailto:${site.email}`}
          {...(hasResume ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="ml-1 flex h-9 items-center rounded-lg bg-signal px-3.5 text-[0.84rem] font-medium text-white transition-colors hover:bg-signal/90"
        >
          {hasResume ? 'Résumé' : 'Email me'}
        </a>
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
      <ul className="frost flex w-full max-w-md items-stretch justify-between rounded-2xl p-1.5">
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
                  'relative flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[0.62rem] font-medium tracking-wide transition-colors',
                  current ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {current ? (
                  <motion.span
                    layoutId="dock-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-ink/[0.06]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <Icon className={cn('relative size-[1.15rem]', current && 'text-signal')} aria-hidden="true" />
                <span className="relative">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
