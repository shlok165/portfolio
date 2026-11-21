import type { Transition } from 'motion/react'

/**
 * Motion tokens for JS-driven animation. They mirror the CSS custom
 * properties in index.css so CSS transitions and Motion/GSAP tweens match.
 *
 * Rules:
 *  - Entrances use `ease.out`; elements that move between states use `ease.inOut`.
 *  - Anything the pointer drives directly (tilt, magnet, cursor) uses a spring.
 *  - Siblings stagger by `stagger.base`; never animate a whole section at once.
 */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.3, 1.4, 0.5, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>

/** Durations in seconds (Motion's unit). */
export const dur = {
  1: 0.12,
  2: 0.2,
  3: 0.32,
  4: 0.56,
  5: 0.9,
} as const

export const stagger = { tight: 0.03, base: 0.05, loose: 0.08 } as const

export const spring = {
  /** Pointer-following: magnetic buttons, cursor ring. */
  pointer: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
  /** Card tilt: softer so it settles rather than snaps. */
  tilt: { type: 'spring', stiffness: 260, damping: 26 },
  /** Shared-element layout transitions (project cards ↔ case study). */
  layout: { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 },
} as const satisfies Record<string, Transition>
