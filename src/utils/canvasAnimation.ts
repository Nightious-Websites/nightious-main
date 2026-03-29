/**
 * canvasAnimation.ts
 * Shared canvas lifecycle utility — DPR scaling + rAF loop with cleanup.
 * All canvas animations on the site use this to ensure proper Astro
 * View Transitions cleanup (cancel rAF on astro:before-swap).
 */

interface CanvasState {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  w: number   // logical width (CSS pixels)
  h: number   // logical height (CSS pixels)
  dpr: number
  rafId: number | null
  ro: ResizeObserver | null
}

/**
 * Start a requestAnimationFrame loop on a canvas element.
 * - Scales canvas for device pixel ratio (clamped to 2)
 * - Attaches a ResizeObserver to re-scale on container resize
 * - Calls `draw(ctx, w, h, dt)` every frame where dt = delta ms
 * - Returns a stop() function — MUST be called on astro:before-swap
 */
export function startCanvasLoop(
  canvas: HTMLCanvasElement,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void
): (() => void) | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const state: CanvasState = {
    canvas,
    ctx,
    w: canvas.offsetWidth,
    h: canvas.offsetHeight,
    dpr,
    rafId: null,
    ro: null,
  }

  function resize() {
    state.w = canvas.offsetWidth
    state.h = canvas.offsetHeight
    canvas.width  = state.w * state.dpr
    canvas.height = state.h * state.dpr
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0)
  }

  resize()

  state.ro = new ResizeObserver(resize)
  state.ro.observe(canvas)

  let lastT = 0

  function loop(t: number) {
    const dt = lastT === 0 ? 16 : t - lastT
    lastT = t
    draw(ctx, state.w, state.h, dt)
    state.rafId = requestAnimationFrame(loop)
  }

  state.rafId = requestAnimationFrame(loop)

  return function stop() {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId)
      state.rafId = null
    }
    state.ro?.disconnect()
    state.ro = null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}
