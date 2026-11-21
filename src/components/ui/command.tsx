// Adapted from shadcn/ui (MIT): Command (cmdk), restyled to the site tokens.
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn('flex size-full flex-col overflow-hidden text-ink', className)} {...props} />
}

export function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4">
      <Search className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
      <CommandPrimitive.Input
        className={cn('h-13 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-3 sm:text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn('max-h-[min(24rem,60vh)] scroll-py-2 overflow-y-auto overscroll-contain p-2', className)}
      {...props}
    />
  )
}

export function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="py-10 text-center text-sm text-ink-3" {...props} />
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        '[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3',
        className,
      )}
      {...props}
    />
  )
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'relative flex h-11 cursor-pointer select-none items-center gap-3 rounded-md px-2.5 text-sm text-ink-2 outline-none',
        'transition-colors duration-(--dur-1) data-[selected=true]:bg-sunken data-[selected=true]:text-ink',
        '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3 data-[selected=true]:[&_svg]:text-accent',
        className,
      )}
      {...props}
    />
  )
}

export function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('ml-auto truncate pl-4 font-mono text-2xs text-ink-3', className)} {...props} />
}
