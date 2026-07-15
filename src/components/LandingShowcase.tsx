import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { LandingPosterFood } from '@/config/landingPosterFoods'
import ShowcaseFood from '@/components/ShowcaseFood'

const CAROUSEL_INTERVAL_MS = 4500
const AUTO_RESUME_MS = 10000
const SLOT_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

interface LandingShowcaseProps {
  posters: readonly LandingPosterFood[]
}

export default function LandingShowcase({ posters }: LandingShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPaused, setAutoPaused] = useState(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pauseAutoAdvance = useCallback(() => {
    setAutoPaused(true)
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current)
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setAutoPaused(false)
      resumeTimerRef.current = null
    }, AUTO_RESUME_MS)
  }, [])

  useEffect(() => {
    setActiveIndex(0)
  }, [posters])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (posters.length <= 1 || autoPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posters.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [posters.length, autoPaused])

  const goToIndex = useCallback(
    (index: number) => {
      if (posters.length === 0) return
      pauseAutoAdvance()
      setActiveIndex(((index % posters.length) + posters.length) % posters.length)
    },
    [pauseAutoAdvance, posters.length],
  )

  function goPrev() {
    goToIndex(activeIndex - 1)
  }

  function goNext() {
    goToIndex(activeIndex + 1)
  }

  const activePoster = posters[activeIndex]

  if (posters.length === 0) {
    return null
  }

  return (
    <section
      className="landing-showcase"
      aria-label="Featured food categories"
      style={
        activePoster
          ? ({ '--showcase-active-accent': activePoster.accent } as CSSProperties)
          : undefined
      }
    >
      <div className="landing-showcase__glow" aria-hidden="true" />
      <div className="landing-showcase__stage">
        <div className="landing-showcase__slot landing-showcase__slot--hero">
          {activePoster ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activePoster.id}
                className="landing-showcase__slot-inner landing-showcase__slot-inner--hero"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={SLOT_TRANSITION}
              >
                <Link
                  to={`/foods?category=${encodeURIComponent(activePoster.name)}`}
                  className="landing-showcase__link"
                  aria-label={`Browse ${activePoster.name}`}
                >
                  <ShowcaseFood poster={activePoster} priority />
                </Link>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>

      {posters.length > 1 && (
        <>
          <button
            type="button"
            className="landing-showcase__nav landing-showcase__nav--prev"
            onClick={goPrev}
            aria-label="Previous food category"
          >
            ‹
          </button>
          <button
            type="button"
            className="landing-showcase__nav landing-showcase__nav--next"
            onClick={goNext}
            aria-label="Next food category"
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
