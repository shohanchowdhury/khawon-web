import { useEffect, useState } from 'react'
import {
  getFoodCatalogue,
  searchDishes,
} from '@/api/client'
import { POSTER_FOODS } from '@/config/featuredFoods'
import type { CanonicalDishMatch, FoodTypePopularOut } from '@/types/api'

const SEED_QUERIES = POSTER_FOODS.map((food) => food.name)
export const DISH_BROWSE_PAGE_SIZE = 12

export interface FoodsBrowseOptions {
  /** When false, only paginated dish search runs (no catalogue/featured fetch). */
  loadSidebar?: boolean
}

async function fetchDefaultCanonicalDishes(): Promise<CanonicalDishMatch[]> {
  const results = await Promise.all(SEED_QUERIES.map((query) => searchDishes(query)))
  const seen = new Set<number>()
  const merged: CanonicalDishMatch[] = []

  for (const result of results) {
    for (const match of result.canonical_matches) {
      if (seen.has(match.id)) continue
      seen.add(match.id)
      merged.push(match)
    }
  }

  return merged.sort(
    (a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0),
  )
}

export interface FoodsBrowseData {
  categories: FoodTypePopularOut[]
  categoriesLoading: boolean
  categoriesError: string
  featuredDishes: CanonicalDishMatch[]
  featuredLoading: boolean
  featuredError: string
  canonicalDishes: CanonicalDishMatch[]
  dishesTotal: number
  dishesLoading: boolean
  dishesError: string
}

export function useFoodsBrowseData(
  searchQuery: string,
  categoryFilter: string | null = null,
  subTypeFilter: string | null = null,
  page = 0,
  options: FoodsBrowseOptions = {},
) {
  const loadSidebar = options.loadSidebar ?? true

  const [categories, setCategories] = useState<FoodTypePopularOut[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(loadSidebar)
  const [categoriesError, setCategoriesError] = useState('')

  const [featuredDishes, setFeaturedDishes] = useState<CanonicalDishMatch[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(loadSidebar)
  const [featuredError, setFeaturedError] = useState('')

  const [canonicalDishes, setCanonicalDishes] = useState<CanonicalDishMatch[]>([])
  const [dishesTotal, setDishesTotal] = useState(0)
  const [dishesLoading, setDishesLoading] = useState(false)
  const [dishesError, setDishesError] = useState('')

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (!loadSidebar) return

    setCategoriesLoading(true)
    setCategoriesError('')

    getFoodCatalogue('')
      .then((catalogue) => {
        setCategories(
          [...catalogue].sort(
            (a, b) => (b.review_count ?? 0) - (a.review_count ?? 0),
          ),
        )
      })
      .catch((err) => {
        setCategoriesError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setCategoriesLoading(false)
      })
  }, [loadSidebar])

  useEffect(() => {
    if (!loadSidebar) return

    setFeaturedLoading(true)
    setFeaturedError('')

    fetchDefaultCanonicalDishes()
      .then(setFeaturedDishes)
      .catch((err) => {
        setFeaturedError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setFeaturedLoading(false)
      })
  }, [loadSidebar])

  useEffect(() => {
    const effectiveQuery =
      debouncedQuery.trim() ||
      subTypeFilter?.trim() ||
      categoryFilter?.trim() ||
      ''

    if (!effectiveQuery) {
      setCanonicalDishes([])
      setDishesTotal(0)
      setDishesLoading(false)
      setDishesError('')
      return
    }

    setDishesLoading(true)
    setDishesError('')

    searchDishes(effectiveQuery, {
      offset: page * DISH_BROWSE_PAGE_SIZE,
      limit: DISH_BROWSE_PAGE_SIZE,
    })
      .then((result) => {
        setCanonicalDishes(result.canonical_matches)
        setDishesTotal(result.total)
      })
      .catch((err) => {
        setDishesError(err instanceof Error ? err.message : String(err))
        setCanonicalDishes([])
        setDishesTotal(0)
      })
      .finally(() => setDishesLoading(false))
  }, [debouncedQuery, categoryFilter, subTypeFilter, page])

  return {
    categories,
    categoriesLoading,
    categoriesError,
    featuredDishes,
    featuredLoading,
    featuredError,
    canonicalDishes,
    dishesTotal,
    dishesLoading,
    dishesError,
  } satisfies FoodsBrowseData
}
