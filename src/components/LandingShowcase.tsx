import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CarouselFood } from '@/types/domain/featuredFood'
import ShowcaseFood, { getShowcaseAccent } from '@/components/ShowcaseFood'

const CAROUSEL_INTERVAL_MS = 4500
const SLOT_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

interface LandingShowcaseProps {
  foods: CarouselFood[]
}

export default function LandingShowcase({ foods }: LandingShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [foods])

  useEffect(() => {
    if (foods.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % foods.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [foods.length])

  const activeFood = foods[activeIndex]

  return (
    <div
      className="landing-showcase"
      aria-hidden="true"
      style={
        activeFood
          ? ({ '--showcase-active-accent': getShowcaseAccent(activeFood) } as CSSProperties)
          : undefined
      }
    >
      <div className="landing-showcase__glow" />
      <div className="landing-showcase__stage">
        <div className="landing-showcase__slot landing-showcase__slot--hero">
          {activeFood ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFood.id ?? activeFood.name}
                className="landing-showcase__slot-inner landing-showcase__slot-inner--hero"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={SLOT_TRANSITION}
              >
                <ShowcaseFood food={activeFood} priority />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    </div>
  )
}
