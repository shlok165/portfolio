import type { CSSProperties, HTMLAttributes } from 'react'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import { TONE_HEX, type Tone } from '@/data/profile'
import { cn } from '@/lib/utils'

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /** Colour of the faint hover light. */
  tone?: Tone | 'neutral'
  /** Fade and rise into view; a number delays it by that many milliseconds. */
  reveal?: boolean | number
}

/**
 * The white, hairline-bordered panel used across the site, built on React Bits'
 * SpotlightCard (light theme) for a soft tinted light that follows the pointer.
 */
export function Panel({ tone = 'neutral', reveal, className, style, children, ...rest }: PanelProps) {
  const light = tone === 'neutral' ? '#0d0f14' : TONE_HEX[tone]
  const revealProps =
    reveal === undefined || reveal === false
      ? {}
      : { 'data-reveal': '', style: { '--reveal-delay': `${reveal === true ? 0 : reveal}ms` } }

  return (
    <SpotlightCard
      theme="light"
      spotlightColor={light}
      intensity={tone === 'neutral' ? 0.12 : 0.22}
      spotlightSize={320}
      softness={0.9}
      borderGlow={0.9}
      proximity={90}
      smoothing={0.35}
      flare={false}
      className={cn('rounded-2xl p-6 sm:p-7', className)}
      {...rest}
      {...revealProps}
      style={
        {
          '--spotlight-card-surface': 'var(--card)',
          '--spotlight-card-border': 'var(--line)',
          '--spotlight-card-shadow': 'var(--panel-shadow)',
          ...revealProps.style,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </SpotlightCard>
  )
}
