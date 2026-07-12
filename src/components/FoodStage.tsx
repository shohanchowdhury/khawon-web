import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavButtonLink } from '@/components/NavButton'
import { AnimatePresence, motion } from 'framer-motion'
import { getFoodDisplayImage } from '@/config/featuredFoods'
import type { CarouselFood } from '@/types/domain/featuredFood'
import FoodImage from '@/components/FoodImage'

const SWIPE_THRESHOLD = 50
const SLIDE_OFFSET = 48
const STAGE_TRANSITION = { type: 'spring' as const, stiffness: 320, damping: 32 }

interface NavArrowProps {
  direction: 'prev' | 'next'
}

function NavArrow({ direction }: NavArrowProps) {
  return (
    <svg className="food-stage__nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function getAccent(food: CarouselFood): string {
  return ('accent' in food && food.accent) ? food.accent : '#ef233c'
}

interface StagePeekProps {
  food: CarouselFood | null
  side: 'prev' | 'next'
  direction: number
  intro: boolean
}

function StagePeek({ food, side, direction, intro }: StagePeekProps) {
  if (!food) return <div className={`food-stage__peek food-stage__peek--${side}`} aria-hidden="true" />

  const imageUrl = getFoodDisplayImage(food)
  const slide = direction * (side === 'prev' ? -20 : 20)

  return (
    <motion.div
      className={`food-stage__peek food-stage__peek--${side}`}
      aria-hidden="true"
      initial={intro ? { opacity: 0, x: 0 } : false}
      animate={{ opacity: 0.85, x: slide }}
      transition={
        intro
          ? { duration: 0.35, ease: 'easeOut', delay: 0.18 }
          : { duration: 0.35, ease: 'easeOut' }
      }
    >
      <div className="food-stage__peek-inner">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="food-stage__peek-image"
            loading="eager"
          />
        ) : (
          <FoodImage name={food.name} className="food-stage__peek-image" priority />
        )}
      </div>
    </motion.div>
  )
}

interface FoodStageProps {
  foods: CarouselFood[]
  onAccentChange?: (accent: string) => void
  intro?: boolean
}

export default function FoodStage({ foods, onAccentChange, intro = false }: FoodStageProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const introPlayedRef = useRef(false)

  const count = foods.length
  const active = foods[activeIndex]
  const prevFood = activeIndex > 0 ? foods[activeIndex - 1] ?? null : null
  const nextFood = activeIndex < count - 1 ? foods[activeIndex + 1] ?? null : null

  const goTo = useCallback((index: number, dir: number) => {
    if (index < 0 || index >= count || index === activeIndex) return
    setDirection(dir)
    setActiveIndex(index)
  }, [activeIndex, count])

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1)
  }, [activeIndex, goTo])

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1)
  }, [activeIndex, goTo])

  useEffect(() => {
    if (!active) return
    onAccentChange?.(getAccent(active))
  }, [active, onAccentChange])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goPrev, goNext])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    if (delta < 0) goNext()
    else goPrev()
  }

  if (!active) return null

  const foodDetailHref = active.id
    ? `/food/${active.id}`
    : `/search?q=${encodeURIComponent(active.name)}`
  const showIntro = intro && !introPlayedRef.current

  const imageVariants = showIntro
    ? {
        enter: { opacity: 0, scale: 0.82, x: 0 },
        center: { opacity: 1, scale: 1, x: 0 },
        exit: (d: number) => ({
          opacity: 0,
          x: d * -SLIDE_OFFSET,
          scale: 0.96,
        }),
      }
    : {
        enter: (d: number) => ({ opacity: 0, x: d * SLIDE_OFFSET, scale: 0.96 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (d: number) => ({ opacity: 0, x: d * -SLIDE_OFFSET, scale: 0.96 }),
      }

  const handleIntroComplete = () => {
    if (intro && !introPlayedRef.current) {
      introPlayedRef.current = true
    }
  }

  const activeImageUrl = getFoodDisplayImage(active)

  return (
    <section
      className="food-stage"
      style={{ '--home-accent': getAccent(active) }}
      aria-label="Featured foods"
    >
      <div
        className="food-stage__viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && (
          <button
            type="button"
            className="food-stage__nav food-stage__nav--prev"
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous food"
          >
            <NavArrow direction="prev" />
          </button>
        )}

        <div className="food-stage__photos">
          <StagePeek
            food={prevFood}
            side="prev"
            direction={direction}
            intro={showIntro}
          />

          <div className="food-stage__spacer" aria-hidden="true" />

          <div className="food-stage__center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id ?? active.name}
                className="food-stage__center-frame"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={STAGE_TRANSITION}
                onAnimationComplete={handleIntroComplete}
              >
                <Link
                  to={foodDetailHref}
                  className="food-stage__image-link"
                  aria-label={`View ${active.name} details`}
                >
                  {activeImageUrl ? (
                    <img
                      src={activeImageUrl}
                      alt={active.name}
                      className="food-stage__image"
                      loading="eager"
                      fetchPriority="high"
                    />
                  ) : (
                    <FoodImage
                      name={active.name}
                      className="food-stage__image"
                      priority
                    />
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="food-stage__spacer" aria-hidden="true" />

          <StagePeek
            food={nextFood}
            side="next"
            direction={direction}
            intro={showIntro}
          />
        </div>

        {count > 1 && (
          <button
            type="button"
            className="food-stage__nav food-stage__nav--next"
            onClick={goNext}
            disabled={activeIndex === count - 1}
            aria-label="Next food"
          >
            <NavArrow direction="next" />
          </button>
        )}

        <div className="food-stage__footer" aria-live="polite">
          <div className="food-stage__footer-inner">
            <h2 className="food-stage__title">{active.name}</h2>

            <div className="food-stage__cta-wrap">
              <NavButtonLink
                to={foodDetailHref}
                variant="primary"
                className="food-stage__cta"
              >
                Find {active.name} near you
              </NavButtonLink>
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="food-stage__dots" aria-hidden="true">
            {foods.map((food, index) => (
              <button
                key={food.id ?? food.name}
                type="button"
                className={
                  index === activeIndex
                    ? 'food-stage__dot food-stage__dot--active'
                    : 'food-stage__dot'
                }
                onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                aria-label={`Show ${food.name}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
