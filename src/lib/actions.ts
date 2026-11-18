import { toast } from 'sonner'
import { site } from '@/data/profile'

/** Copy the contact email and confirm with a toast; fall back to the mail client. */
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.email)
    toast.success('Email copied', { description: site.email })
  } catch {
    location.href = `mailto:${site.email}`
  }
}

export function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
