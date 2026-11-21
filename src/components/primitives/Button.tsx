import { LoaderCircle } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-(--dur-2) ease-out ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 ' +
  '[&_svg]:size-4 [&_svg]:shrink-0'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper shadow-2 hover:bg-[color-mix(in_oklab,var(--ink)_86%,var(--accent))]',
  accent: 'bg-accent text-on-accent shadow-2 hover:bg-[color-mix(in_oklab,var(--accent)_88%,black)]',
  outline: 'surface text-ink hover:border-line-strong hover:bg-paper',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
}

// Every size meets the 44px touch-target guideline except `sm`, used only on desktop chrome.
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'size-11',
}

export function buttonClass(variant: Variant = 'outline', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size; loading?: boolean; icon?: ReactNode }

export function Button({ variant, size, loading, icon, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  )
}

type LinkButtonProps = ComponentProps<'a'> & { variant?: Variant; size?: Size; icon?: ReactNode; external?: boolean }

export function LinkButton({ variant, size, icon, external, className, children, ...props }: LinkButtonProps) {
  return (
    <a
      className={buttonClass(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...props}
    >
      {icon}
      {children}
    </a>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-line-strong bg-surface px-1 font-mono text-2xs text-ink-3 shadow-[0_1px_0_var(--line-strong)]',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
