import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CarouselFood } from '@/types/domain/featuredFood'
import CarouselFoodCard from '@/components/CarouselFoodCard'

type CarouselVariant = 'default' | 'focused' | 'fullscreen' | 'hero'
type CarouselCardSize = 'default' | 'focused' | 'fullscreen' | 'hero'

function getClosestCenterIndex(track: HTMLElement): number {
  const cards = [...track.querySelectorAll<HTMLElement>('.carousel-food-card')]
  if (cards.length === 0) return 0

  const trackCenter = track.scrollLeft + track.clientWidth / 2
  let closestIndex = 0
  let closestDistance = Infinity

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2
    const distance = Math.abs(trackCenter - cardCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  return closestIndex
}

interface TopFoodCarouselProps {
  foods: CarouselFood[]
  variant?: CarouselVariant
  showScrollbar?: boolean
}

export default function TopFoodCarousel({
  foods,
  variant = 'default',
  showScrollbar = false,
}: TopFoodCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const isFocused = variant === 'focused'
  const isFullscreen = variant === 'fullscreen'
  const isHero = variant === 'hero'

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current
    if (!track) return

    const card = track.children[index] as HTMLElement | undefined
    if (!card) return

    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
    track.scrollTo({ left, behavior })
    setActiveIndex(index)
  }, [])

  const scrollBy = useCallback((direction: number) => {
    const next = activeIndex + direction
    if (next < 0 || next >= foods.length) return
    scrollToIndex(next)
  }, [activeIndex, foods.length, scrollToIndex])

  const handleScrollEnd = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setActiveIndex(getClosestCenterIndex(track))
  }, [])

  useLayoutEffect(() => {
    if (foods.length === 0) return
    setActiveIndex(0)
    scrollToIndex(0, 'auto')
  }, [foods, scrollToIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track || foods.length === 0) return undefined

    const cards = [...track.querySelectorAll<HTMLElement>('.carousel-food-card')]
    if (cards.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = cards.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActiveIndex(index)
        })
      },
      {
        root: track,
        threshold: 0.55,
      },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [foods])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onScroll = () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
      scrollEndTimerRef.current = setTimeout(handleScrollEnd, 120)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
    }
  }, [handleScrollEnd, foods])

  if (foods.length === 0) return null

  const cardSize: CarouselCardSize = isFocused
    ? 'focused'
    : isFullscreen
      ? 'fullscreen'
      : isHero
        ? 'hero'
        : 'default'

  const sectionClass = [
    'food-carousel',
    isFocused && 'food-carousel--focused',
    isFullscreen && 'food-carousel--fullscreen',
    isHero && 'food-carousel--hero',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass} aria-label="Top foods">
      {!isFullscreen && !isHero && !isFocused && (
        <div className="food-carousel__header">
          <div>
            <h2 className="food-carousel__heading">Top picks</h2>
            <p className="food-carousel__subheading muted">
              Scroll sideways — the focused card is ready to explore
            </p>
          </div>
          <div className="food-carousel__hint muted" aria-hidden="true">
            ← swipe →
          </div>
        </div>
      )}

      <div className="food-carousel__viewport">
        {isFocused && foods.length > 1 && (
          <>
            <button
              type="button"
              className="food-carousel__nav food-carousel__nav--prev"
              onClick={() => scrollBy(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous food"
            >
              ‹
            </button>
            <button
              type="button"
              className="food-carousel__nav food-carousel__nav--next"
              onClick={() => scrollBy(1)}
              disabled={activeIndex === foods.length - 1}
              aria-label="Next food"
            >
              ›
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className={`food-carousel__track khawon-scrollbar${showScrollbar ? ' food-carousel__track--scrollbar-visible' : ''}`}
          role="list"
        >
          {foods.map((food, index) => (
            <CarouselFoodCard
              key={food.id ?? food.name}
              food={food}
              active={index === activeIndex}
              size={cardSize}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
