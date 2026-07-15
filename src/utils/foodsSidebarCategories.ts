import type { FoodTypePopularOut } from '@/types/api'

export function partitionSidebarCategories(
  categories: FoodTypePopularOut[],
  selectedCategory: string | null,
): {
  selected: FoodTypePopularOut | null
  rest: FoodTypePopularOut[]
} {
  if (!selectedCategory) {
    return { selected: null, rest: categories }
  }

  const selected =
    categories.find((category) => category.name === selectedCategory) ?? null

  if (!selected) {
    return { selected: null, rest: categories }
  }

  return {
    selected,
    rest: categories.filter((category) => category.name !== selectedCategory),
  }
}
