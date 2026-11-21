import { Command as CommandIcon, FileText, Menu, X } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState, type MouseEvent } from 'react'
import { AccentSwitcher } from '@/components/chrome/AccentSwitcher'
import { SocialIcon } from '@/components/icons'
import { Kbd, LinkButton, buttonClass } from '@/components/primitives/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { nav, site, socials, type SectionId } from '@/data/profile'
import { spring } from '@/lib/motion'
import { useIsMac } from '@/lib/platform'
import { useScrollTo } from '@/lib/scroll'
import { cn } from '@/lib/utils'


type NavbarProps = { active: string | null; onOpenCommand: () => void }

export function Navbar({ active, onOpenCommand }: NavbarProps) {
  const scrollTo = useScrollTo()
  const isMac = useIsMac()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 8))

  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollTo(id)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-(--dur-3) ease-out',
        scrolled ? 'border-b border-line bg-paper/80 backdrop-blur-md backdrop-saturate-150' : 'border-b border-transparent',
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-(--nav-h) max-w-[1200px] items-center gap-4 px-(--gutter)">
        <a href="#top" onClick={go('top')} className="group mr-auto flex items-center gap-2.5 rounded-md">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-md bg-ink font-display text-sm font-semibold tracking-tight text-paper transition-colors duration-(--dur-2) group-hover:bg-accent">
            {site.initials}
          </span>
          <span className="sr-only text-sm font-medium text-ink sm:not-sr-only">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map(item => {
            const current = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  aria-current={current ? 'location' : undefined}
                  className={cn(
                    'relative flex h-9 items-center rounded-full px-3.5 text-sm transition-colors duration-(--dur-2)',
                    current ? 'text-ink' : 'text-ink-3 hover:text-ink',
                  )}
                >
                  {current ? (
                    <motion.span layoutId="nav-pill" transition={spring.layout} className="surface absolute inset-0 -z-10 rounded-full" />
                  ) : null}
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <AccentSwitcher className="hidden lg:flex" />
          <button
            type="button"
            onClick={onOpenCommand}
            className={buttonClass('outline', 'sm', 'gap-2 pr-2 text-ink-3 hover:text-ink')}
            aria-label="Open command menu"
            aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
          >
            <CommandIcon aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Search</span>
            <span className="flex gap-0.5">
              <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <LinkButton href={site.resumePage} variant="primary" size="sm" icon={<FileText />}>
            Résumé
          </LinkButton>
        </div>

        <button
          type="button"
          className={buttonClass('outline', 'icon', 'md:hidden')}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>
      </nav>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="top-3 max-w-none p-2 data-[state=open]:slide-in-from-top-4">
          <div className="flex items-center justify-between px-3 py-2">
            <DialogTitle className="label">Menu</DialogTitle>
            <DialogDescription className="sr-only">Jump to a section or open a profile.</DialogDescription>
            <DialogClose className={buttonClass('ghost', 'icon', '-mr-1')} aria-label="Close menu">
              <X aria-hidden="true" />
            </DialogClose>
          </div>
          <ul className="grid">
            {nav.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id as SectionId)}
                  className="flex h-13 items-center gap-4 rounded-md px-3 font-display text-xl text-ink active:bg-sunken"
                >
                  <span className="num font-mono text-2xs text-accent">{item.index}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-line px-1 pt-3">
            <div className="flex">
              {socials.map(s => {
                const Icon = SocialIcon[s.id]
                return (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost', 'icon')} aria-label={s.label}>
                    <Icon />
                  </a>
                )
              })}
            </div>
            <AccentSwitcher />
          </div>
          <LinkButton href={site.resumePage} variant="primary" className="mt-3 w-full" icon={<FileText />}>
            View résumé
          </LinkButton>
        </DialogContent>
      </Dialog>
    </header>
  )
}
