import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getFoodDisplayImage } from '../config/featuredFoods'
import FoodImage from './FoodImage'

const SWIPE_THRESHOLD = 50

function NavArrow({ direction }) {
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

function getAccent(food) {
  return food?.accent || '#dc2626'
}

function StagePeek({ food, side, direction, reduceMotion, intro }) {
  if (!food) return <div className={`food-stage__peek food-stage__peek--${side}`} aria-hidden="true" />

  const imageUrl = getFoodDisplayImage(food)
  const slide = direction * (side === 'prev' ? -20 : 20)
  const showIntro = intro && !reduceMotion

  return (
    <motion.div
      className={`food-stage__peek food-stage__peek--${side}`}
      aria-hidden="true"
      initial={showIntro ? { opacity: 0, x: 0 } : false}
      animate={{ opacity: 0.85, x: reduceMotion ? 0 : slide }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : showIntro
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

export default function FoodStage({ foods, onAccentChange, intro = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const touchStartX = useRef(null)
  const introPlayedRef = useRef(false)
  const reduceMotion = useReducedMotion()

  const count = foods.length
  const active = foods[activeIndex]
  const prevFood = activeIndex > 0 ? foods[activeIndex - 1] : null
  const nextFood = activeIndex < count - 1 ? foods[activeIndex + 1] : null

  const goTo = useCallback((index, dir) => {
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
    const onKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase()
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

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    if (delta < 0) goNext()
    else goPrev()
  }

  if (!active) return null

  const searchParams = new URLSearchParams({ q: active.name })
  const slideOffset = reduceMotion ? 0 : 48
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 320, damping: 32 }

  const showIntro = intro && !introPlayedRef.current && !reduceMotion

  const imageVariants = showIntro
    ? {
        enter: { opacity: 0, scale: 0.82, x: 0 },
        center: { opacity: 1, scale: 1, x: 0 },
        exit: (d) => ({
          opacity: 0,
          x: d * -slideOffset,
          scale: reduceMotion ? 1 : 0.96,
        }),
      }
    : {
        enter: (d) => ({ opacity: 0, x: d * slideOffset, scale: reduceMotion ? 1 : 0.96 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (d) => ({ opacity: 0, x: d * -slideOffset, scale: reduceMotion ? 1 : 0.96 }),
      }

  const textVariants = showIntro
    ? {
        enter: { opacity: 0, x: 0, y: 12 },
        center: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: reduceMotion ? 0 : 16, y: reduceMotion ? 0 : -8 },
      }
    : {
        enter: { opacity: 0, x: reduceMotion ? 0 : -20, y: reduceMotion ? 0 : 8 },
        center: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: reduceMotion ? 0 : 16, y: reduceMotion ? 0 : -8 },
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
            reduceMotion={reduceMotion}
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
                transition={transition}
                onAnimationComplete={handleIntroComplete}
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
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="food-stage__spacer" aria-hidden="true" />

          <StagePeek
            food={nextFood}
            side="next"
            direction={direction}
            reduceMotion={reduceMotion}
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
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`meta-${active.id ?? active.name}`}
              className="food-stage__footer-inner"
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                ...transition,
                delay: reduceMotion ? 0 : showIntro ? 0.12 : 0.05,
              }}
            >
              <h2 className="food-stage__title">{active.name}</h2>

              <motion.div
                className="food-stage__cta-wrap"
                initial={{ opacity: 0, x: reduceMotion ? 0 : 16, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  ...transition,
                  delay: reduceMotion ? 0 : showIntro ? 0.2 : 0.08,
                }}
              >
                <Link
                  to={`/search?${searchParams.toString()}`}
                  className="food-stage__cta nav-btn nav-btn--primary"
                >
                  Find {active.name} near you
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
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
