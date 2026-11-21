import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

type CountUpProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}

const format = (n: number, decimals: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * The final number is rendered invisibly in the same grid cell, so the box is
 * sized to the end state from the first frame: no layout shift while counting.
 * It writes to the DOM directly instead of re-rendering React on every frame.
 */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.4, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const live = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const final = `${prefix}${format(value, decimals)}${suffix}`

  useEffect(() => {
    const node = live.current
    if (!node || !seen) return undefined
    if (reduce) {
      node.textContent = final
      return undefined
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: ease.out,
      onUpdate: v => {
        node.textContent = `${prefix}${format(v, decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [seen, reduce, value, decimals, prefix, suffix, duration, delay, final])

  return (
    <span ref={ref} className={cn('num inline-grid', className)}>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
      <span ref={live} className="col-start-1 row-start-1" aria-hidden="true">
        {`${prefix}${format(0, decimals)}${suffix}`}
      </span>
    </span>
  )
}
