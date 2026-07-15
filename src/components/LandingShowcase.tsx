import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LandingPosterFood } from '@/config/landingPosterFoods'
import ShowcaseFood from '@/components/ShowcaseFood'

const CAROUSEL_INTERVAL_MS = 4500
const SLOT_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

interface LandingShowcaseProps {
  posters: readonly LandingPosterFood[]
}

export default function LandingShowcase({ posters }: LandingShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [posters])

  useEffect(() => {
    if (posters.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posters.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [posters.length])

  const activePoster = posters[activeIndex]

  return (
    <div
      className="landing-showcase"
      aria-hidden="true"
      style={
        activePoster
          ? ({ '--showcase-active-accent': activePoster.accent } as CSSProperties)
          : undefined
      }
    >
      <div className="landing-showcase__glow" />
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
                <ShowcaseFood poster={activePoster} priority />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    </div>
  )
}
