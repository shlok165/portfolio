import { lazy, Suspense, useEffect, useState } from 'react'
import { Backdrop, CursorGlow } from '@/components/layout/Backdrop'
import { MobileDock, Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/magicui/scroll-progress'
import { About } from '@/components/sections/About'
import { Contact, Footer } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Toaster } from '@/components/ui/sonner'
import { nav } from '@/data/profile'
import { useActiveSection } from '@/hooks/use-active-section'
import { useRevealObserver } from '@/lib/reveal'
import { SmoothScroll } from '@/lib/scroll'

// The command menu pulls in the dialog and search libraries, so it loads on first use.
const CommandMenu = lazy(() =>
  import('@/components/layout/CommandMenu').then(module => ({ default: module.CommandMenu })),
)

const SECTION_IDS = nav.map(item => item.id)

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandLoaded, setCommandLoaded] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  useRevealObserver()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandLoaded(true)
        setCommandOpen(open => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <SmoothScroll>
      <a
        href="#about"
        className="sr-only z-[100] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Backdrop />
      <CursorGlow />
      <ScrollProgress className="z-[60] h-0.5 from-mint via-sky to-iris" />
      <Navbar active={active} onOpenCommand={() => {
          setCommandLoaded(true)
          setCommandOpen(true)
        }} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <MobileDock active={active} />
      {commandLoaded ? (
        <Suspense fallback={null}>
          <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
        </Suspense>
      ) : null}
      <Toaster position="bottom-center" />
    </SmoothScroll>
  )
}
