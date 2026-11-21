import { Fragment, type CSSProperties, type ElementType } from 'react'

type SplitTextProps = {
  text: string
  as?: ElementType
  className?: string
  /** Delay before the first character, in seconds. */
  delay?: number
  /** Gap between characters, in seconds. */
  step?: number
}

/**
 * Character-by-character reveal: each glyph rises out of a clipped line box.
 *
 * Pure CSS (the `.char` animation in index.css), with each glyph's delay set
 * inline. It needs no JavaScript, so it plays from the prerendered first paint,
 * and reduced-motion users get the final state through the global media query.
 *
 * The glyph spans are aria-hidden; give screen readers the plain text nearby
 * (e.g. an sr-only span), since aria-label on a generic element is unreliable.
 * Words stay unbreakable, with real spaces between them so lines still wrap.
 */
export function SplitText({ text, as: Tag = 'span', className, delay = 0, step = 0.028 }: SplitTextProps) {
  let index = 0
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {Array.from(word).map(char => {
              const i = index++
              return (
                // pb / -mb keeps descenders inside the clip box without changing line height.
                <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span className="char inline-block origin-bottom-left" style={{ '--char-delay': `${delay + i * step}s` } as CSSProperties}>
                    {char}
                  </span>
                </span>
              )
            })}
          </span>
          {w < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
