// From Magic UI (magicui.design), MIT.
// Local changes: starts from config.phi, can sway around it instead of spinning,
// and stops rendering while it is off screen.
import { useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [],
}

/** Angles that turn the globe to face a latitude / longitude. */
export function locationToAngles(lat: number, lng: number): [phi: number, theta: number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
  sway,
}: {
  className?: string
  config?: COBEOptions
  /** Radians to rock either side of config.phi. Omit for a continuous spin. */
  sway?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(config.phi)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const onResize = () => {
      widthRef.current = canvas.offsetWidth
    }
    window.addEventListener("resize", onResize)
    onResize()

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let time = 0
    phiRef.current = config.phi

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current && !still) {
          time += 1 / 60
          if (sway === undefined) phiRef.current += 0.005
          else phiRef.current = config.phi + Math.sin(time * 0.35) * sway
        }
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    const observer = new IntersectionObserver(([entry]) => {
      globe.toggle(entry.isIntersecting)
    })
    observer.observe(canvas)

    const shown = window.setTimeout(() => {
      canvas.style.opacity = "1"
    }, 0)

    return () => {
      window.clearTimeout(shown)
      observer.disconnect()
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config, sway])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-700 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
