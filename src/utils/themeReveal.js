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
]

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function prefersReducedSystemMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getRevealRadius(x, y) {
  return (
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 16
  )
}

export function setThemeRevealOrigin(x, y, radius) {
  document.documentElement.style.setProperty('--theme-x', `${x}px`)
  document.documentElement.style.setProperty('--theme-y', `${y}px`)
  document.documentElement.style.setProperty('--theme-r', `${radius}px`)
}

function waitForFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function captureThemeVars() {
  const computed = getComputedStyle(document.documentElement)
  const vars = {}

  for (const name of THEME_VAR_NAMES) {
    const value = computed.getPropertyValue(name).trim()
    if (value) vars[name] = value
  }

  return vars
}

function applyThemeVars(element, vars) {
  for (const [name, value] of Object.entries(vars)) {
    element.style.setProperty(name, value)
  }
}

function createFrozenSnapshotOverlay(x, y) {
  const root = document.getElementById('root')
  if (!root) return null

  const themeVars = captureThemeVars()
  const overlay = document.createElement('div')
  overlay.className = 'theme-reveal-layer theme-reveal-layer--snapshot'
  overlay.setAttribute('aria-hidden', 'true')

  applyThemeVars(overlay, themeVars)
  overlay.style.backgroundColor = themeVars['--bg'] || getComputedStyle(document.body).backgroundColor
  overlay.style.color = getComputedStyle(document.body).color
  overlay.style.maskImage = `radial-gradient(circle at ${x}px ${y}px, transparent 0px, #000 0px)`
  overlay.style.webkitMaskImage = overlay.style.maskImage

  const viewport = document.createElement('div')
  viewport.className = 'theme-reveal-layer__viewport'

  const clone = root.cloneNode(true)
  clone.removeAttribute('id')
  clone.setAttribute('aria-hidden', 'true')
  clone.style.transform = `translateY(${-window.scrollY}px)`

  viewport.appendChild(clone)
  overlay.appendChild(viewport)
  document.body.appendChild(overlay)

  return overlay
}

function animateSnapshotMaskReveal(overlay, x, y, radius) {
  return new Promise((resolve) => {
    const start = performance.now()

    const frame = (now) => {
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

export async function runSnapshotThemeReveal(_targetTheme, commitTheme, x, y, radius) {
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

export function runViewTransitionReveal(commitTheme) {
  return document.startViewTransition(() => {
    commitTheme()
  })
}
