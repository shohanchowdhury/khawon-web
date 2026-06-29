import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { LANDING_PATTERN } from '@/config/landingBackground'

const MOBILE_TILE = { width: 520, height: 283 } as const

function getDriftTarget(): { width: number; height: number } {
  if (window.matchMedia('(max-width: 767px)').matches) {
    return MOBILE_TILE
  }

  return {
    width: LANDING_PATTERN.tileWidth,
    height: LANDING_PATTERN.tileHeight,
  }
}

export function useLandingPatternDrift(): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let rafId = 0
    let startedAt = performance.now()

    const stopJsDrift = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
      element.style.backgroundPosition = ''
    }

    const startJsDrift = () => {
      stopJsDrift()
      element.style.animation = 'none'

      const durationMs = LANDING_PATTERN.duration * 1000
      startedAt = performance.now()

      const tick = (now: number) => {
        const { width, height } = getDriftTarget()
        const progress = ((now - startedAt) % durationMs) / durationMs
        element.style.backgroundPosition = `${width * progress}px ${height * progress}px`
        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    }

    const syncMotionMode = () => {
      if (motionQuery.matches) {
        startJsDrift()
        return
      }

      element.style.animation = ''
      stopJsDrift()
    }

    syncMotionMode()
    motionQuery.addEventListener('change', syncMotionMode)
    window.addEventListener('resize', syncMotionMode)

    return () => {
      motionQuery.removeEventListener('change', syncMotionMode)
      window.removeEventListener('resize', syncMotionMode)
      element.style.animation = ''
      stopJsDrift()
    }
  }, [])

  return ref
}
