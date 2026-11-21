import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useFinePointer } from '@/lib/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

type MagneticProps = {
  children: ReactNode
  /** Fraction of the pointer offset the element follows (0–1). */
  strength?: number
  className?: string
}

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Inert on touch screens and with reduced motion. The hit area is padded
 * so the pull starts slightly before the pointer reaches the button.
 */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), spring.pointer)
  const y = useSpring(useMotionValue(0), spring.pointer)
  const active = fine && !reduce

  const onMove = (event: PointerEvent) => {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', active && '-m-3 p-3', className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
