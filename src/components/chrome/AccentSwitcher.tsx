import { motion } from 'motion/react'
import { ACCENTS, setAccent, useAccent } from '@/lib/accent'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Four accent presets as a radio group. Arrow keys move between swatches
 * (native radio behaviour); the ring slides to the selection on a spring.
 */
export function AccentSwitcher({ className }: { className?: string }) {
  const accent = useAccent()

  return (
    <fieldset className={cn('flex items-center gap-0.5 rounded-full p-1', className)}>
      <legend className="sr-only">Accent colour</legend>
      {ACCENTS.map(option => {
        const checked = accent === option.id
        return (
          <label
            key={option.id}
            title={option.label}
            className="relative grid size-7 cursor-pointer place-items-center rounded-full has-focus-visible:outline-2 has-focus-visible:outline-accent"
          >
            <input
              type="radio"
              name="accent"
              value={option.id}
              checked={checked}
              onChange={() => setAccent(option.id)}
              className="peer sr-only"
            />
            <span className="sr-only">{option.label}</span>
            {checked ? (
              <motion.span
                layoutId="accent-ring"
                transition={spring.pointer}
                className="absolute inset-0 rounded-full border border-line-strong bg-surface"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="relative size-3 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] transition-transform duration-(--dur-2) ease-out hover:scale-125"
              style={{ background: option.swatch }}
            />
          </label>
        )
      })}
    </fieldset>
  )
}
