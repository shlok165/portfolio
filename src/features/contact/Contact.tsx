import { ArrowUpRight, Check, Copy, MapPin, Phone } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { SocialIcon } from '@/components/icons'
import { Section } from '@/components/primitives/Section'
import { site, socials } from '@/data/profile'
import { copyEmail } from '@/lib/actions'
import { dur, ease } from '@/lib/motion'
import { ContactForm } from './ContactForm'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    if (await copyEmail()) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group flex flex-wrap items-center gap-3">
      <a href={`mailto:${site.email}`} className="link-underline font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {site.email}
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
        className="surface relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full px-3 text-xs text-ink-2 transition-colors duration-(--dur-2) hover:border-line-strong hover:text-ink"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: dur[2], ease: ease.out }}
            className="inline-flex items-center gap-2"
          >
            {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>
      </button>
    </div>
  )
}

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title="Get in touch"
      intro="For internships, projects or questions about my work. Email is the fastest way to reach me."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-10">
          <div>
            <p className="label mb-3">Email</p>
            <CopyEmail />
          </div>

          <dl className="grid gap-4 text-sm">
            <div className="flex items-center gap-3">
              <dt>
                <Phone className="size-4 text-ink-3" aria-hidden="true" />
                <span className="sr-only">Phone</span>
              </dt>
              <dd>
                <a href={site.phoneHref} className="link-underline num text-ink">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <dt>
                <MapPin className="size-4 text-ink-3" aria-hidden="true" />
                <span className="sr-only">Location</span>
              </dt>
              <dd className="text-ink">{site.location}</dd>
            </div>
          </dl>

          <div>
            <p className="label mb-3">Elsewhere</p>
            <ul className="grid border-t border-line">
              {socials.map(s => {
                const Icon = SocialIcon[s.id]
                return (
                  <li key={s.id} className="border-b border-line">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-13 items-center gap-3 text-sm text-ink transition-colors duration-(--dur-2)"
                    >
                      <Icon className="size-4 text-ink-3 transition-colors duration-(--dur-2) group-hover:text-accent" />
                      {s.label}
                      <span className="ml-auto font-mono text-xs text-ink-3">{s.handle}</span>
                      <ArrowUpRight
                        className="size-4 text-ink-3 transition-[transform,color] duration-(--dur-3) ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  )
}
