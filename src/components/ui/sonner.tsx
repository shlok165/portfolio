import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import type { CSSProperties } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// shadcn/ui toaster, fixed to the dark theme (this site has no theme switch).
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
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
          "--normal-bg": "rgb(12 16 28 / 0.86)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "rgb(255 255 255 / 0.12)",
          "--border-radius": "1rem",
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
