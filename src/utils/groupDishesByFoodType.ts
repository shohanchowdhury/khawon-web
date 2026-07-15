import type { DishOut } from '@/types/api'
import {
  groupDishesByCategory,
  slugifyCategory,
  type DishCategoryGroup,
} from '@/utils/groupDishesByCategory'

export interface DishFoodTypeGroup {
  slug: string
  label: string
  foodTypeId: number | null
  categories: DishCategoryGroup[]
}

const FALLBACK_FOOD_TYPE = 'Other'

export function foodTypeGroupSlug(foodTypeId: number | null, label: string): string {
  if (foodTypeId != null) return `ft-${foodTypeId}`
  return `ft-${slugifyCategory(label)}`
}

export function dishFoodTypeSlug(dish: DishOut): string {
  const label = dish.food_type?.name?.trim() || FALLBACK_FOOD_TYPE
  return foodTypeGroupSlug(dish.food_type?.id ?? null, label)
}

export function groupDishesByFoodType(dishes: DishOut[]): DishFoodTypeGroup[] {
  const byFoodType = new Map<
    string,
    { label: string; foodTypeId: number | null; dishes: DishOut[] }
  >()

  for (const dish of dishes) {
    const label = dish.food_type?.name?.trim() || FALLBACK_FOOD_TYPE
    const foodTypeId = dish.food_type?.id ?? null
    const key = foodTypeId != null ? String(foodTypeId) : label
    const existing = byFoodType.get(key)
    if (existing) {
      existing.dishes.push(dish)
    } else {
      byFoodType.set(key, { label, foodTypeId, dishes: [dish] })
    }
  }

  return Array.from(byFoodType.values())
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
    .map(({ label, foodTypeId, dishes: foodTypeDishes }) => ({
      slug: foodTypeGroupSlug(foodTypeId, label),
      label,
      foodTypeId,
      categories: groupDishesByCategory(foodTypeDishes),
    }))
}
