import type { CSSProperties } from 'react'
import SpotlightCard, { type SpotlightCardProps } from '@/components/reactbits/SpotlightCard'
import { TONE_HEX, type Tone } from '@/data/profile'
import { cn } from '@/lib/utils'

type GlassCardProps = Omit<SpotlightCardProps, 'theme' | 'spotlightColor'> & {
  /** Colour of the light that follows the pointer. */
  tone?: Tone | 'neutral'
  /** Fade and rise in on scroll. Pass a number for a delay in milliseconds. */
  reveal?: boolean | number
}

/**
 * The site's frosted panel: backdrop blur, a light-catching hairline edge and a
 * pointer-following spotlight (React Bits SpotlightCard) that also reaches
 * neighbouring cards.
 */
export function GlassCard({ tone = 'neutral', reveal, className, style, children, ...rest }: GlassCardProps) {
  const light = tone === 'neutral' ? '#ffffff' : TONE_HEX[tone]
  const revealProps =
    reveal === undefined || reveal === false
      ? {}
      : { 'data-reveal': '', style: { '--reveal-delay': `${reveal === true ? 0 : reveal}ms` } }

  return (
    <SpotlightCard
      spotlightColor={light}
      intensity={tone === 'neutral' ? 0.07 : 0.11}
      spotlightSize={340}
      softness={0.85}
      borderGlow={0.7}
      proximity={110}
      smoothing={0.35}
      className={cn('glass rounded-[1.75rem] p-6 sm:p-7', className)}
      {...rest}
      {...revealProps}
      style={
        {
          '--spotlight-card-surface': 'var(--glass-tint)',
          '--spotlight-card-border': 'var(--glass-edge)',
          '--spotlight-card-shadow': 'var(--glass-shadow)',
          ...revealProps.style,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </SpotlightCard>
  )
}
