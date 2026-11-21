// Adapted from shadcn/ui (MIT): Sonner toaster, restyled to the site tokens.
import { CircleAlert, CircleCheck, Info, LoaderCircle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        info: <Info className="size-4 text-accent" />,
        error: <CircleAlert className="size-4 text-danger" />,
        loading: <LoaderCircle className="size-4 animate-spin text-ink-3" />,
      }}
      style={
        {
          '--normal-bg': 'var(--surface)',
          '--normal-text': 'var(--ink)',
          '--normal-border': 'var(--line-strong)',
          '--border-radius': '14px',
          fontFamily: 'var(--font-sans)',
        } as CSSProperties
      }
      toastOptions={{ classNames: { toast: 'shadow-3!', description: 'text-ink-3!' } }}
      {...props}
    />
  )
}
