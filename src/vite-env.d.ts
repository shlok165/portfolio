/// <reference types="vite/client" />

/** True when public/resume.pdf existed at build time (see vite.config.ts). */
declare const __HAS_RESUME__: boolean

interface ImportMetaEnv {
  /** Formspree-compatible form endpoint for the contact form. Optional. */
  readonly VITE_CONTACT_ENDPOINT?: string
}
