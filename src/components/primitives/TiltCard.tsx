import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef, type ComponentProps, type PointerEvent, type ReactNode } from 'react'
import { useFinePointer } from '@/lib/hooks'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

type TiltCardProps = Omit<ComponentProps<typeof motion.div>, 'children'> & {
  children?: ReactNode
  /** Maximum tilt in degrees. */
  max?: number
  /** Show the cursor-follow spotlight. */
  spotlight?: boolean
}

/**
 * A surface that tilts toward the pointer on a spring and carries a soft
 * accent spotlight under the cursor. Both effects are off on touch screens
 * and with reduced motion; the card is then a plain surface.
 */
export function TiltCard({ max = 5, spotlight = true, className, children, style, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const active = fine && !reduce

  // Pointer position, normalised to 0..1 across the card.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring.tilt)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring.tilt)
  const glowX = useTransform(px, v => `${v * 100}%`)
  const glowY = useTransform(py, v => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)`
  const opacity = useSpring(0, { stiffness: 200, damping: 30 })

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
    opacity.set(1)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    opacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={active ? { rotateX, rotateY, transformPerspective: 900, ...style } : style}
      className={cn('surface relative isolate overflow-hidden rounded-xl', className)}
      {...props}
    >
      {spotlight && active ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: glow, opacity }}
        />
      ) : null}
      {children}
    </motion.div>
  )
}
