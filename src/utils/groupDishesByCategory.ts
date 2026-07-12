import type { DishOut } from '@/types/api'

export interface DishCategoryGroup {
  slug: string
  label: string
  dishes: DishOut[]
}

const FALLBACK_CATEGORY = 'Other'

export function slugifyCategory(label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'other'
}

export function groupDishesByCategory(dishes: DishOut[]): DishCategoryGroup[] {
  const byCategory = new Map<string, DishOut[]>()

  for (const dish of dishes) {
    const label = dish.category_raw?.trim() || FALLBACK_CATEGORY
    const existing = byCategory.get(label)
    if (existing) {
      existing.push(dish)
    } else {
      byCategory.set(label, [dish])
    }
  }

  return Array.from(byCategory.entries())
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(([label, categoryDishes]) => ({
      slug: slugifyCategory(label),
      label,
      dishes: [...categoryDishes].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      ),
    }))
}
