import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FoodImage from '@/components/FoodImage'

const DEFAULT_INTERVAL_MS = 3000
const FADE_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

interface CyclingDishImageProps {
  imageUrls: string[]
  alt: string
  intervalMs?: number
  className?: string
  imageClassName?: string
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export default function CyclingDishImage({
  imageUrls,
  alt,
  intervalMs = DEFAULT_INTERVAL_MS,
  className = 'cycling-dish-image',
  imageClassName = 'cycling-dish-image__img',
}: CyclingDishImageProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const urls = imageUrls.filter(Boolean)

  useEffect(() => {
    setActiveIndex(0)
  }, [urls.join('|')])

  useEffect(() => {
    if (urls.length <= 1 || prefersReducedMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % urls.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [urls.length, intervalMs, prefersReducedMotion, urls.join('|')])

  if (urls.length === 0) {
    return (
      <div className={className}>
        <FoodImage name={alt} className={imageClassName} />
      </div>
    )
  }

  const activeUrl = urls[activeIndex] ?? urls[0]

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.img
          key={activeUrl}
          src={activeUrl}
          alt=""
          className={imageClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE_TRANSITION}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
    </div>
  )
}
