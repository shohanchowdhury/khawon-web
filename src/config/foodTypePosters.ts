export interface FoodTypePosterEntry {
  slug: string
  name: string
  image: string
}

const posterModules = import.meta.glob<string>(
  '@/assets/food-type-posters/*/poster.png',
  { eager: true, import: 'default' },
)

const POSTER_SLUG_PATTERN = /\/food-type-posters\/([^/]+)\/poster\.png$/

export function foodTypeNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function slugToFoodTypeName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function listFoodTypePosters(): FoodTypePosterEntry[] {
  const entries: FoodTypePosterEntry[] = []

  for (const [path, image] of Object.entries(posterModules)) {
    const match = path.match(POSTER_SLUG_PATTERN)
    if (!match?.[1] || !image) continue
    const slug = match[1]
    entries.push({
      slug,
      name: slugToFoodTypeName(slug),
      image,
    })
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name))
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
