const posterModules = import.meta.glob<string>(
  '@/assets/food-type-posters/*/poster.png',
  { eager: true, import: 'default' },
)

export function foodTypeNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getFoodTypePoster(foodTypeName: string): string | null {
  const slug = foodTypeNameToSlug(foodTypeName)
  const key = Object.keys(posterModules).find((path) =>
    path.includes(`/food-type-posters/${slug}/`),
  )
  return key ? (posterModules[key] ?? null) : null
}

export function requireFoodTypePoster(foodTypeName: string): string {
  const poster = getFoodTypePoster(foodTypeName)
  if (!poster) {
    throw new Error(
      `Missing food type poster: src/assets/food-type-posters/${foodTypeNameToSlug(foodTypeName)}/poster.png`,
    )
  }
  return poster
}
