import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '@/lib/hooks'
import { spring } from '@/lib/motion'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/**
 * A ring that trails the pointer and swells over interactive elements.
 * The native cursor stays visible: the ring adds feedback, it never replaces
 * the precise pointer. Only mounted for fine pointers without reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  if (!fine || reduce) return null
  return <Ring />
}

function Ring() {
  const x = useSpring(useMotionValue(-100), spring.pointer)
  const y = useSpring(useMotionValue(-100), spring.pointer)
  const [state, setState] = useState<{ hover: boolean; label: string | null; down: boolean; visible: boolean }>({
    hover: false,
    label: null,
    down: false,
    visible: false,
  })

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null
      const label = target?.getAttribute('data-cursor') ?? null
      setState(s =>
        s.hover === Boolean(target) && s.label === label && s.visible ? s : { ...s, hover: Boolean(target), label, visible: true },
      )
    }
    const down = () => setState(s => ({ ...s, down: true }))
    const up = () => setState(s => ({ ...s, down: false, hover: false, label: null }))
    const leave = () => setState(s => ({ ...s, visible: false }))
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  const size = state.label ? 64 : state.hover ? 40 : 20

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] grid place-items-center rounded-full border border-accent/60 font-mono text-[10px] uppercase tracking-[0.08em] text-on-accent"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: size,
        height: size,
        opacity: state.visible ? 1 : 0,
        scale: state.down ? 0.85 : 1,
        backgroundColor: state.label ? 'var(--accent)' : 'rgba(0,0,0,0)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
    >
      {state.label}
    </motion.div>
  )
}
