import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'
import DarkVeil from '@/components/reactbits/DarkVeil'
import { useFinePointer } from '@/hooks/use-media'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Fixed page background. Everything frosted sits on top of this, so it carries
 * the colour: a slow silk shader, two aurora glows that drift with the scroll,
 * a vignette and a film of grain.
 */
export function Backdrop() {
  const { scrollYProgress } = useScroll()
  const mintY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const roseY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])
  const irisY = useTransform(scrollYProgress, [0, 1], ['30%', '-60%'])
  // The hero brings its own aurora, so the veil stays quiet until you scroll past it.
  const veil = useTransform(scrollYProgress, [0, 0.1, 1], [0.5, 0.95, 0.85])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ opacity: veil }}>
        <DarkVeil
          color="#5868ff"
          speed={0.45}
          brightness={1}
          quality={0.4}
          mouseInteraction={false}
          className="size-full"
        />
      </motion.div>

      <motion.div
        style={{ y: mintY }}
        className="absolute -left-[14%] top-[6%] size-[48rem] rounded-full bg-[radial-gradient(closest-side,rgb(94_234_212/0.15),transparent)]"
      />
      <motion.div
        style={{ y: roseY }}
        className="absolute -right-[16%] top-[34%] size-[46rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_143_199/0.11),transparent)]"
      />
      <motion.div
        style={{ y: irisY }}
        className="absolute left-[24%] top-[70%] size-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(164_149_255/0.13),transparent)]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_95%_at_50%_38%,transparent_38%,rgb(4_6_12/0.82)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
    </div>
  )
}

/** A soft pool of light that trails the cursor underneath the glass. */
export function CursorGlow() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useMotionValue(-800)
  const y = useMotionValue(-800)
  const sx = useSpring(x, { stiffness: 110, damping: 24, mass: 0.7 })
  const sy = useSpring(y, { stiffness: 110, damping: 24, mass: 0.7 })
  const enabled = fine && !reduce

  useEffect(() => {
    if (!enabled) return undefined
    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] -ml-[19rem] -mt-[19rem] size-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(92_200_255/0.1),rgb(164_149_255/0.04)_55%,transparent)]"
      style={{ x: sx, y: sy }}
    />
  )
}
