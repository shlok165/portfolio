import { ArrowUp } from 'lucide-react'
import { Kbd } from '@/components/primitives/Button'
import { site } from '@/data/profile'
import { useModKey } from '@/lib/platform'
import { useScrollTo } from '@/lib/scroll'

const YEAR = new Date().getFullYear()

export function Footer() {
  const scrollTo = useScrollTo()
  const modKey = useModKey()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-(--gutter) py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <span className="num" suppressHydrationWarning>
            {YEAR}
          </span> {site.name} · {site.instituteShort}
        </p>
        <p className="hidden items-center gap-1.5 md:flex">
          Press <Kbd>{modKey}</Kbd>
          <Kbd>K</Kbd> to jump anywhere
        </p>
        <div className="flex items-center gap-5">
          <a href={site.resumePage} className="link-underline text-ink-2 hover:text-ink">
            Printable résumé
          </a>
          <button type="button" onClick={() => scrollTo('top')} className="inline-flex h-9 items-center gap-1.5 text-ink-2 hover:text-ink">
            <ArrowUp className="size-4" aria-hidden="true" />
            Top
          </button>
        </div>
      </div>
    </footer>
  )
}
