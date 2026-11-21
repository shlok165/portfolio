import { motion, useScroll, useSpring } from 'motion/react'

/** Hairline reading-progress bar along the top edge. Decorative: the scrollbar already conveys position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
