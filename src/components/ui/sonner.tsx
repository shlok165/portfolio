import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import type { CSSProperties } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// shadcn/ui toaster, fixed to the light theme (this site has no theme switch).
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "rgb(255 255 255 / 0.92)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--line)",
          "--border-radius": "0.75rem",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast backdrop-blur-xl",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
