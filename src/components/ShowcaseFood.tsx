import type { CSSProperties } from 'react'
import type { LandingPosterFood } from '@/config/landingPosterFoods'

interface ShowcaseFoodProps {
  poster: LandingPosterFood
  priority?: boolean
  className?: string
}

export default function ShowcaseFood({
  poster,
  priority,
  className = 'landing-showcase__food',
}: ShowcaseFoodProps) {
  const style = { '--showcase-accent': poster.accent } as CSSProperties

  return (
    <img
      src={poster.image}
      alt={poster.name}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
