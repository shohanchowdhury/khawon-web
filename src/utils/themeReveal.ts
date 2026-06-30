import type { Theme } from '@/types/domain/theme'

const REVEAL_DURATION_MS = 650

const THEME_VAR_NAMES = [
  '--bg',
  '--bg-elevated',
  '--bg-card',
  '--red',
  '--red-hover',
  '--red-glow',
  '--yellow',
  '--yellow-muted',
  '--yellow-text',
  '--text',
  '--text-muted',
  '--border',
  '--shadow',
  '--shadow-lg',
  '--nav-backdrop',
  '--surface-hover',
  '--control-bg',
  '--control-bg-hover',
  '--text-shadow-strong',
  '--text-shadow-medium',
  '--image-overlay-top',
  '--image-overlay-bottom',
  '--image-overlay-bottom-soft',
  '--on-image-text',
  '--on-image-text-muted',
  '--on-image-text-soft',
  '--on-image-text-badge',
  '--placeholder-gradient',
  '--wordmark-gradient',
  '--home-glow-1',
  '--home-glow-2',
  '--badge-bg',
  '--badge-color',
  '--badge-border',
  '--badge-soft-bg',
  '--badge-soft-border',
  '--badge-spots-bg',
  '--badge-spots-border',
  '--accent-surface',
  '--accent-surface-border',
  '--accent-surface-subtle',
  '--accent-surface-muted',
  '--focus-ring',
  '--card-shadow-hover',
  '--tile-shadow',
  '--tile-shadow-hover',
  '--pattern-blend',
  '--pattern-opacity',
  '--theme-toggle-icon',
  '--theme-toggle-bg',
  '--scrollbar-track',
  '--scrollbar-thumb',
  '--scrollbar-thumb-hover',
] as const

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function prefersReducedSystemMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getRevealRadius(x: number, y: number): number {
  return (
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 16
  )
}

export function setThemeRevealOrigin(x: number, y: number, radius: number): void {
  document.documentElement.style.setProperty('--theme-x', `${x}px`)
  document.documentElement.style.setProperty('--theme-y', `${y}px`)
  document.documentElement.style.setProperty('--theme-r', `${radius}px`)
}

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function captureThemeVars(): Record<string, string> {
  const computed = getComputedStyle(document.documentElement)
  const vars: Record<string, string> = {}

  for (const name of THEME_VAR_NAMES) {
    const value = computed.getPropertyValue(name).trim()
    if (value) vars[name] = value
  }

  return vars
}

function applyThemeVars(element: HTMLElement, vars: Record<string, string>): void {
  for (const [name, value] of Object.entries(vars)) {
    element.style.setProperty(name, value)
  }
}

function createFrozenSnapshotOverlay(x: number, y: number): HTMLDivElement | null {
  const root = document.getElementById('root')
  if (!root) return null

  const themeVars = captureThemeVars()
  const overlay = document.createElement('div')
  overlay.className = 'theme-reveal-layer theme-reveal-layer--snapshot'
  overlay.setAttribute('aria-hidden', 'true')

  applyThemeVars(overlay, themeVars)
  overlay.style.backgroundColor =
    themeVars['--bg'] || getComputedStyle(document.body).backgroundColor
  overlay.style.color = getComputedStyle(document.body).color
  overlay.style.maskImage = `radial-gradient(circle at ${x}px ${y}px, transparent 0px, #000 0px)`
  overlay.style.webkitMaskImage = overlay.style.maskImage

  const viewport = document.createElement('div')
  viewport.className = 'theme-reveal-layer__viewport'

  const clone = root.cloneNode(true)
  if (!(clone instanceof HTMLElement)) {
    return null
  }

  clone.removeAttribute('id')
  clone.setAttribute('aria-hidden', 'true')
  clone.style.transform = `translateY(${-window.scrollY}px)`

  viewport.appendChild(clone)
  overlay.appendChild(viewport)
  document.body.appendChild(overlay)

  return overlay
}

function animateSnapshotMaskReveal(
  overlay: HTMLDivElement,
  x: number,
  y: number,
  radius: number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / REVEAL_DURATION_MS)
      const eased = easeInOutCubic(progress)
      const currentRadius = eased * radius
      const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${currentRadius}px, #000 ${currentRadius + 0.75}px)`

      overlay.style.maskImage = mask
      overlay.style.webkitMaskImage = mask

      if (progress < 1) {
        requestAnimationFrame(frame)
        return
      }

      resolve()
    }

    requestAnimationFrame(frame)
  })
}

export async function runSnapshotThemeReveal(
  _targetTheme: Theme,
  commitTheme: () => void,
  x: number,
  y: number,
  radius: number,
): Promise<void> {
  const overlay = createFrozenSnapshotOverlay(x, y)
  if (!overlay) {
    commitTheme()
    return
  }

  await waitForFrame()
  commitTheme()
  await waitForFrame()
  await animateSnapshotMaskReveal(overlay, x, y, radius)
  overlay.remove()
}

export function runViewTransitionReveal(commitTheme: () => void): ViewTransition {
  return document.startViewTransition(() => {
    commitTheme()
  })
}
