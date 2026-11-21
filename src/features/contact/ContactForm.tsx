import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/primitives/Button'
import { site } from '@/data/profile'
import { dur, ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Any Formspree-compatible endpoint (POST JSON, 2xx on success), e.g.
 * https://formspree.io/f/xxxxxx. Set VITE_CONTACT_ENDPOINT in .env.
 * Without one, the form opens the visitor's mail app with the message filled in.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

type Values = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Values, string>>
const EMPTY: Values = { name: '', email: '', message: '' }
const MAX = 2000

function validate(v: Values): Errors {
  const errors: Errors = {}
  if (!v.name.trim()) errors.name = 'Please add your name.'
  if (!v.email.trim()) errors.email = 'Please add an email so I can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = 'That email doesn’t look complete.'
  if (v.message.trim().length < 10) errors.message = 'A sentence or two, please (10+ characters).'
  return errors
}

async function send(values: Values) {
  if (!ENDPOINT) {
    const subject = encodeURIComponent(`Hello from ${values.name}`)
    const body = encodeURIComponent(`${values.message}\n\n${values.name}\n${values.email}`)
    location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    return
  }
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
}

export function ContactForm() {
  const reduce = useReducedMotion()
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const [pending, setPending] = useState(false)
  const errors = validate(values)

  const set = (key: keyof Values) => (value: string) => setValues(v => ({ ...v, [key]: value }))
  const blur = (key: keyof Values) => () => setTouched(t => ({ ...t, [key]: true }))
  const show = (key: keyof Values) => (touched[key] ? errors[key] : undefined)

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const form = event?.currentTarget
    // Honeypot: real visitors never see or fill this field.
    if (form && (form.elements.namedItem('company') as HTMLInputElement | null)?.value) return
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length) {
      const first = (['name', 'email', 'message'] as const).find(k => errors[k])
      document.getElementById(`contact-${first}`)?.focus()
      return
    }

    // Optimistic: show the sent state now, roll back if the request fails.
    const snapshot = values
    setStatus('sent')
    setPending(true)
    try {
      await send(snapshot)
      toast.success(ENDPOINT ? 'Message sent' : 'Opening your mail app', {
        description: ENDPOINT ? 'Thanks. I’ll reply to ' + snapshot.email : 'Your message is filled in; just press send.',
      })
      setValues(EMPTY)
      setTouched({})
    } catch {
      setStatus('idle')
      setValues(snapshot)
      toast.error('Couldn’t send that', {
        description: 'Your message is still here. Try again, or email me directly.',
        action: { label: 'Retry', onClick: () => void submit() },
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="surface relative self-start overflow-hidden rounded-xl p-6 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur[3], ease: ease.out }}
            className="flex min-h-[26rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid size-12 place-items-center rounded-full bg-accent text-on-accent">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
              {pending ? 'Sending…' : ENDPOINT ? 'Message sent.' : 'Almost there.'}
            </p>
            <p className="mt-2 max-w-sm text-ink-2">
              {ENDPOINT ? 'Thanks for writing. I usually reply within a couple of days.' : 'Your mail app should have opened with the message ready to send.'}
            </p>
            <Button variant="outline" className="mt-8" icon={<RotateCcw />} onClick={() => setStatus('idle')} disabled={pending}>
              Write another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur[2] }}
            className="grid gap-5"
            aria-label="Contact form"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contact-name" label="Name" error={show('name')}>
                {props => (
                  <input {...props} name="name" autoComplete="name" value={values.name} onChange={e => set('name')(e.target.value)} onBlur={blur('name')} />
                )}
              </Field>
              <Field id="contact-email" label="Email" error={show('email')}>
                {props => (
                  <input
                    {...props}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={e => set('email')(e.target.value)}
                    onBlur={blur('email')}
                  />
                )}
              </Field>
            </div>
            <Field
              id="contact-message"
              label="Message"
              error={show('message')}
              hint={<span className="num">{values.message.length} / {MAX}</span>}
            >
              {props => (
                <textarea
                  {...props}
                  name="message"
                  rows={6}
                  maxLength={MAX}
                  value={values.message}
                  onChange={e => set('message')(e.target.value)}
                  onBlur={blur('message')}
                  className={cn(props.className, 'h-auto resize-y py-3')}
                />
              )}
            </Field>
            {/* Honeypot */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <p className="text-xs text-ink-3">
                {ENDPOINT ? 'Goes straight to my inbox.' : 'Opens your mail app with this message.'}
              </p>
              <Button type="submit" variant="primary" size="lg" loading={pending}>
                Send message
                <ArrowRight className="transition-transform duration-(--dur-2) group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  children: (props: {
    id: string
    className: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
    required: true
  }) => ReactNode
}

function Field({ id, label, error, hint, children }: FieldProps) {
  const errorId = useId()
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {hint ? <span className="font-mono text-2xs text-ink-3">{hint}</span> : null}
      </div>
      {children({
        id,
        required: true,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
        className: cn(
          'h-12 w-full rounded-md border bg-paper px-4 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-(--dur-2) placeholder:text-ink-3 sm:text-sm',
          'hover:border-line-strong focus:border-accent focus:bg-surface focus:shadow-[0_0_0_4px_var(--accent-wash)]',
          error ? 'border-danger/60 focus:border-danger focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--danger)_10%,transparent)]' : 'border-line',
        ),
      })}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: dur[2], ease: ease.out }}
            className="text-xs text-danger"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
