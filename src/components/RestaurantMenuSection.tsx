import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DishOut } from '@/types/api'
import RestaurantDishRow from '@/components/RestaurantDishRow'
import { groupDishesByCategory } from '@/utils/groupDishesByCategory'

interface RestaurantMenuSectionProps {
  dishes: DishOut[]
  loading?: boolean
}

export default function RestaurantMenuSection({
  dishes,
  loading = false,
}: RestaurantMenuSectionProps) {
  const categories = useMemo(() => groupDishesByCategory(dishes), [dishes])
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? '')
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveSlug(categories[0]?.slug ?? '')
  }, [categories])

  const scrollToCategory = useCallback((slug: string) => {
    const section = sectionRefs.current.get(slug)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSlug(slug)
    }
  }, [])

  useEffect(() => {
    if (categories.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const top = visible[0]
        if (top?.target.id) {
          setActiveSlug(top.target.id)
        }
      },
      {
        rootMargin: '-40% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const category of categories) {
      const section = sectionRefs.current.get(category.slug)
      if (section) {
        observer.observe(section)
      }
    }

    return () => observer.disconnect()
  }, [categories])

  useEffect(() => {
    if (!activeSlug || !chipsRef.current) return
    const activeChip = chipsRef.current.querySelector<HTMLButtonElement>(
      `[data-category-slug="${activeSlug}"]`,
    )
    activeChip?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [activeSlug])

  if (loading) {
    return (
      <section id="restaurant-menu" className="restaurant-menu" aria-busy="true">
        <h2 className="restaurant-menu__heading">Menu</h2>
        <p className="loading">Loading menu...</p>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section id="restaurant-menu" className="restaurant-menu">
        <h2 className="restaurant-menu__heading">Menu</h2>
        <p className="empty">No menu items yet.</p>
      </section>
    )
  }

  return (
    <section id="restaurant-menu" className="restaurant-menu">
      <h2 className="restaurant-menu__heading">Menu</h2>

      <div className="restaurant-menu__chips" ref={chipsRef}>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            data-category-slug={category.slug}
            className={
              activeSlug === category.slug
                ? 'restaurant-menu__chip restaurant-menu__chip--active'
                : 'restaurant-menu__chip'
            }
            onClick={() => scrollToCategory(category.slug)}
          >
            {category.label}
            <span className="restaurant-menu__chip-count">{category.dishes.length}</span>
          </button>
        ))}
      </div>

      <div className="restaurant-menu__sections">
        {categories.map((category) => (
          <section
            key={category.slug}
            id={category.slug}
            ref={(node) => {
              if (node) {
                sectionRefs.current.set(category.slug, node)
              } else {
                sectionRefs.current.delete(category.slug)
              }
            }}
            className="restaurant-menu__category"
          >
            <h3 className="restaurant-menu__category-title">{category.label}</h3>
            <div className="restaurant-menu__dishes">
              {category.dishes.map((dish) => (
                <RestaurantDishRow key={dish.id} dish={dish} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
