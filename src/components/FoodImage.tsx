import { useEffect, useState, type CSSProperties } from 'react'

interface FoodImageProps {
  name: string
  imageUrl?: string | null
  /** Tried when the primary URL fails to load (e.g. restaurant logo after hero). */
  fallbackUrl?: string | null
  className?: string
  priority?: boolean
  style?: CSSProperties
}

function normalizeUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim()
  return trimmed ? trimmed : null
}

export default function FoodImage({
  name,
  imageUrl,
  fallbackUrl,
  className = '',
  priority = false,
  style,
}: FoodImageProps) {
  const primary = normalizeUrl(imageUrl)
  const fallback = normalizeUrl(fallbackUrl)
  const [activeUrl, setActiveUrl] = useState(primary)
  const [showPlaceholder, setShowPlaceholder] = useState(!primary)

  useEffect(() => {
    setActiveUrl(primary)
    setShowPlaceholder(!primary)
  }, [primary, fallback])

  const letter = (name || '?').trim().charAt(0).toUpperCase()

  function handleError() {
    if (activeUrl && fallback && activeUrl !== fallback) {
      setActiveUrl(fallback)
      return
    }
    setShowPlaceholder(true)
  }

  if (showPlaceholder || !activeUrl) {
    return (
      <div
        className={`food-card__placeholder ${className}`.trim()}
        style={style}
        aria-hidden="true"
      >
        {letter}
      </div>
    )
  }

  return (
    <img
      src={activeUrl}
      alt={name}
      className={`food-card__image ${className}`.trim()}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  )
}
