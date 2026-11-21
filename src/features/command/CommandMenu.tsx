import { ArrowUp, Copy, Download, FileText, FolderGit2, Hash, Mail, Palette, Plus, Printer } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { SocialIcon } from '@/components/icons'
import { Kbd } from '@/components/primitives/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '@/components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { moreWork, nav, projects, site, socials } from '@/data/profile'
import { openProject } from '@/features/projects/store'
import { ACCENTS, setAccent, useAccent } from '@/lib/accent'
import { copyEmail, openLink } from '@/lib/actions'
import { useScrollLock, useScrollTo } from '@/lib/scroll'

type Icon = ComponentType<SVGProps<SVGSVGElement>>
type CommandMenuProps = { open: boolean; onOpenChange: (open: boolean) => void }
type ItemProps = { value: string; icon: Icon; label: string; hint?: string; onSelect: () => void }

function Item({ value, icon: I, label, hint, onSelect }: ItemProps) {
  return (
    <CommandItem value={value} onSelect={onSelect}>
      <I aria-hidden="true" />
      <span className="truncate">{label}</span>
      {hint ? <CommandShortcut>{hint}</CommandShortcut> : null}
    </CommandItem>
  )
}

/** ⌘/Ctrl + K: jump to a section or project, open a profile, copy the email, get the résumé. */
export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const scrollTo = useScrollTo()
  const accent = useAccent()
  useScrollLock(open)

  // Close first, then act, so focus and scroll-lock are released before scrolling.
  const run = (action: () => void) => {
    onOpenChange(false)
    window.setTimeout(action, 80)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[14vh] max-w-xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <DialogDescription className="sr-only">Search sections, projects, links and actions.</DialogDescription>
        <Command loop>
          <CommandInput placeholder="Search sections, projects, actions…" />
          <CommandList data-lenis-prevent>
            <CommandEmpty>No matches. Try “projects”, “email” or “résumé”.</CommandEmpty>

            <CommandGroup heading="Go to">
              <Item value="top home hero start" icon={ArrowUp} label="Top" onSelect={() => run(() => scrollTo('top'))} />
              {nav.map(n => (
                <Item key={n.id} value={`section ${n.label}`} icon={Hash} label={n.label} hint={n.index} onSelect={() => run(() => scrollTo(n.id))} />
              ))}
            </CommandGroup>

            <CommandGroup heading="Projects">
              {projects.map(p => (
                <Item
                  key={p.slug}
                  value={`project ${p.title} ${p.kicker} ${p.stack.join(' ')}`}
                  icon={Plus}
                  label={p.title}
                  hint="Case study"
                  onSelect={() =>
                    run(() => {
                      scrollTo('projects')
                      window.setTimeout(() => openProject(p.slug), 500)
                    })
                  }
                />
              ))}
              {moreWork.map(r => (
                <Item key={r.url} value={`repo ${r.title} ${r.stack.join(' ')}`} icon={FolderGit2} label={r.title} hint="GitHub" onSelect={() => run(() => openLink(r.url))} />
              ))}
            </CommandGroup>

            <CommandGroup heading="Actions">
              <Item value="copy email address" icon={Copy} label="Copy email address" hint={site.email} onSelect={() => run(() => void copyEmail())} />
              <Item value="write send email mail" icon={Mail} label="Write an email" onSelect={() => run(() => (location.href = `mailto:${site.email}`))} />
              <Item value="resume cv view" icon={FileText} label="View résumé" onSelect={() => run(() => (location.href = site.resumePage))} />
              <Item value="resume cv print save pdf" icon={Printer} label="Print résumé / save as PDF" onSelect={() => run(() => (location.href = `${site.resumePage}?print`))} />
              {__HAS_RESUME__ ? (
                <Item value="resume cv download pdf" icon={Download} label="Download résumé PDF" onSelect={() => run(() => openLink(site.resumePdf))} />
              ) : null}
            </CommandGroup>

            <CommandGroup heading="Accent colour">
              {ACCENTS.map(a => (
                <Item
                  key={a.id}
                  value={`accent colour color theme ${a.label}`}
                  icon={Palette}
                  label={a.label}
                  hint={accent === a.id ? 'Current' : undefined}
                  onSelect={() => run(() => setAccent(a.id))}
                />
              ))}
            </CommandGroup>

            <CommandGroup heading="Profiles">
              {socials.map(s => (
                <Item key={s.id} value={`profile ${s.label} ${s.handle}`} icon={SocialIcon[s.id]} label={s.label} hint={s.handle} onSelect={() => run(() => openLink(s.href))} />
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-2xs text-ink-3" aria-hidden="true">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> move
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd> select
            </span>
            <span className="ml-auto flex items-center gap-1">
              <Kbd>Esc</Kbd> close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
