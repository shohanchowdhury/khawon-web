import { useEffect, useState } from 'react'

/**
 * True when the target element has scrolled above the viewport top offset
 * (e.g. under a sticky navbar).
 */
export default function useScrolledPast(element: Element | null, topOffsetPx = 72) {
  const [scrolledPast, setScrolledPast] = useState(false)

  useEffect(() => {
    if (!element) {
      setScrolledPast(false)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setScrolledPast(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: `-${topOffsetPx}px 0px 0px 0px`,
      },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, topOffsetPx])

  return scrolledPast
}
