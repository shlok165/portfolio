import { ArrowUp, BriefcaseBusiness, Copy, FileText, Layers, Mail, Send, UserRound, Wrench } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { CodeforcesIcon, GithubIcon, LeetcodeIcon, LinkedinIcon } from '@/components/icons'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { site, socials } from '@/data/profile'
import { copyEmail, openLink } from '@/lib/actions'
import { useScrollLock, useScrollTo } from '@/lib/scroll'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

const sections: { id: string; label: string; Icon: Icon }[] = [
  { id: 'top', label: 'Back to top', Icon: ArrowUp },
  { id: 'about', label: 'About', Icon: UserRound },
  { id: 'experience', label: 'Experience', Icon: BriefcaseBusiness },
  { id: 'projects', label: 'Projects', Icon: Layers },
  { id: 'skills', label: 'Skills', Icon: Wrench },
  { id: 'contact', label: 'Contact', Icon: Mail },
]

const links: { label: string; url: string; Icon: Icon }[] = [
  { label: 'GitHub', url: socials.github, Icon: GithubIcon },
  { label: 'LinkedIn', url: socials.linkedin, Icon: LinkedinIcon },
  { label: 'LeetCode', url: socials.leetcode, Icon: LeetcodeIcon },
  { label: 'Codeforces', url: socials.codeforces, Icon: CodeforcesIcon },
].filter(link => link.url)

type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Ctrl/⌘ + K palette: jump to a section, copy the email, open a profile. */
export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const scrollTo = useScrollTo()
  useScrollLock(open)

  const run = (action: () => void) => {
    onOpenChange(false)
    // Let the dialog release its scroll lock before acting.
    window.setTimeout(action, 60)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command menu"
      description="Jump to a section or run an action"
      className="glass rounded-3xl! border-white/10 bg-transparent p-1.5 ring-0 [--glass-blur:28px] [--glass-tint:rgb(10_13_24/0.72)] sm:max-w-lg"
    >
      <Command className="bg-transparent">
        <CommandInput placeholder="Where to? Try “projects” or “email”…" />
        <CommandList data-lenis-prevent className="max-h-[22rem]">
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          <CommandGroup heading="Go to">
            {sections.map(({ id, label, Icon }) => (
              <CommandItem key={id} value={`go ${label}`} onSelect={() => run(() => scrollTo(id))}>
                <Icon aria-hidden="true" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="copy email address" onSelect={() => run(() => void copyEmail())}>
              <Copy aria-hidden="true" />
              Copy email address
              <CommandShortcut>{site.email}</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="send an email write message"
              onSelect={() => run(() => (location.href = `mailto:${site.email}`))}
            >
              <Send aria-hidden="true" />
              Write me an email
            </CommandItem>
            {__HAS_RESUME__ ? (
              <CommandItem value="open resume cv pdf" onSelect={() => run(() => openLink(site.resume))}>
                <FileText aria-hidden="true" />
                Open résumé
              </CommandItem>
            ) : null}
          </CommandGroup>
          {links.length ? (
            <CommandGroup heading="Profiles">
              {links.map(({ label, url, Icon }) => (
                <CommandItem key={label} value={`open ${label}`} onSelect={() => run(() => openLink(url))}>
                  <Icon aria-hidden="true" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
