import { Geometry, Mesh, Program, Renderer } from 'ogl'
import { useEffect, useRef } from 'react'
import { useAccent } from '@/lib/accent'

const SPACING = 22 // CSS px between dots
const RADIUS = 170 // CSS px of cursor influence

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute float seed;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uPx;
  uniform float uActive;
  uniform float uRadius;
  varying float vNear;

  void main() {
    vec2 p = position;
    // Slow ambient swell so the field breathes even without a pointer.
    float wave = sin(p.x * 0.011 + uTime * 0.55 + seed * 6.2831) * cos(p.y * 0.009 - uTime * 0.35);
    p.y += wave * 2.2;

    // Push dots away from the cursor with a smooth falloff.
    vec2 d = p - uMouse;
    float dist = length(d);
    float near = smoothstep(uRadius, 0.0, dist) * uActive;
    p += (d / max(dist, 0.001)) * near * 26.0;
    vNear = near;

    vec2 clip = (p / uRes) * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    gl_PointSize = (1.7 + near * 2.6 + wave * 0.25) * uPx;
  }
`

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vNear;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
    float edge = smoothstep(0.25, 0.16, r);
    vec3 color = mix(uInk, uAccent, smoothstep(0.05, 0.6, vNear));
    float alpha = (0.2 + vNear * 0.75) * edge;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const n = parseInt(value.length === 3 ? value.replace(/./g, c => c + c) : value, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

type DotFieldProps = { onReady?: () => void }

/**
 * Hero background: a grid of dots in WebGL (OGL) that parts around the cursor
 * and tints toward the accent. Rendering stops when the hero is off-screen or
 * the tab is hidden; with reduced motion it draws one still frame.
 */
export default function DotField({ onReady }: DotFieldProps) {
  const host = useRef<HTMLDivElement>(null)
  const accent = useAccent()
  const programRef = useRef<Program | null>(null)
  const drawRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const container = host.current
    if (!container) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    let renderer: Renderer
    try {
      renderer = new Renderer({ dpr, alpha: true, antialias: false, premultipliedAlpha: true })
    } catch {
      return undefined // No WebGL: the CSS dot grid behind stays as the fallback.
    }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.canvas.setAttribute('aria-hidden', 'true')
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'
    container.appendChild(gl.canvas)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const styles = getComputedStyle(document.documentElement)
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        uRes: { value: [1, 1] },
        uMouse: { value: [-9999, -9999] },
        uTime: { value: 0 },
        uPx: { value: dpr },
        uActive: { value: 0 },
        uRadius: { value: RADIUS },
        uInk: { value: hexToRgb(styles.getPropertyValue('--ink').trim()) },
        uAccent: { value: hexToRgb(styles.getPropertyValue('--accent').trim()) },
      },
    })
    program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    programRef.current = program

    let mesh: Mesh | null = null
    let width = 0
    let height = 0

    const build = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      renderer.setSize(width, height)
      program.uniforms.uRes!.value = [width, height]
      const cols = Math.ceil(width / SPACING) + 1
      const rows = Math.ceil(height / SPACING) + 1
      const positions = new Float32Array(cols * rows * 2)
      const seeds = new Float32Array(cols * rows)
      let i = 0
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          positions[i * 2] = x * SPACING + (y % 2) * (SPACING / 2)
          positions[i * 2 + 1] = y * SPACING
          seeds[i] = Math.random()
          i++
        }
      }
      mesh?.geometry.remove()
      const geometry = new Geometry(gl, {
        position: { size: 2, data: positions },
        seed: { size: 1, data: seeds },
      })
      mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program })
    }

    // Pointer, smoothed toward the target each frame.
    const target = { x: -9999, y: -9999, active: 0 }
    const mouse = { x: -9999, y: -9999, active: 0 }
    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      target.active = event.pointerType === 'mouse' ? 1 : 0.6
      if (mouse.x < -9000) {
        mouse.x = target.x
        mouse.y = target.y
      }
    }
    const onLeave = () => {
      target.active = 0
    }

    let frame = 0
    let running = false
    let visible = true
    const start = performance.now()

    const draw = () => {
      if (!mesh) return
      renderer.render({ scene: mesh })
    }
    drawRef.current = draw

    const tick = () => {
      frame = requestAnimationFrame(tick)
      mouse.x += (target.x - mouse.x) * 0.14
      mouse.y += (target.y - mouse.y) * 0.14
      mouse.active += (target.active - mouse.active) * 0.08
      program.uniforms.uMouse!.value = [mouse.x, mouse.y]
      program.uniforms.uActive!.value = mouse.active
      program.uniforms.uTime!.value = (performance.now() - start) / 1000
      draw()
    }
    const play = () => {
      if (running || reduce || !visible || document.hidden) return
      running = true
      frame = requestAnimationFrame(tick)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    build()
    draw()
    onReady?.()

    const resize = new ResizeObserver(() => {
      build()
      draw()
    })
    resize.observe(container)

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible) play()
      else pause()
    })
    io.observe(container)

    const onVisibility = () => (document.hidden ? pause() : play())
    document.addEventListener('visibilitychange', onVisibility)
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    play()

    return () => {
      pause()
      resize.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      mesh?.geometry.remove()
      program.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
      programRef.current = null
      drawRef.current = null
    }
  }, [onReady])

  // Follow the accent switcher.
  useEffect(() => {
    const program = programRef.current
    if (!program) return
    const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    program.uniforms.uAccent!.value = hexToRgb(value)
    drawRef.current?.()
  }, [accent])

  return <div ref={host} className="absolute inset-0" />
}
