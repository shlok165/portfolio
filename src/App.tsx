import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Cursor } from '@/components/chrome/Cursor'
import { Footer } from '@/components/chrome/Footer'
import { Navbar } from '@/components/chrome/Navbar'
import { ScrollProgress } from '@/components/chrome/ScrollProgress'
import { Toaster } from '@/components/ui/sonner'
import { nav } from '@/data/profile'
import { About } from '@/features/about/About'
import { Contact } from '@/features/contact/Contact'
import { Hero } from '@/features/hero/Hero'
import { Projects } from '@/features/projects/Projects'
import { Skills } from '@/features/skills/Skills'
import { Timeline } from '@/features/timeline/Timeline'
import { useActiveSection } from '@/lib/hooks'
import { SmoothScroll } from '@/lib/scroll'

// cmdk + its dialog load on first use (shortcut or button), not with the page.
const CommandMenu = lazy(() => import('@/features/command/CommandMenu').then(m => ({ default: m.CommandMenu })))

const SECTION_IDS = nav.map(item => item.id)


export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandLoaded, setCommandLoaded] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  const openCommand = () => {
    setCommandLoaded(true)
    setCommandOpen(true)
  }

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
    // reducedMotion="user": Motion drops transform/layout animation for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a
          href="#about"
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar active={active} onOpenCommand={openCommand} />
        <main>
          <Hero />
          <About />
          <Timeline />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
        {commandLoaded ? (
          <Suspense fallback={null}>
            <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
          </Suspense>
        ) : null}
        <Cursor />
        <Toaster position="bottom-center" />
      </SmoothScroll>
    </MotionConfig>
  )
}
