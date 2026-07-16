import type {
  FoodImageSearchResponse,
  FoodTypeOut,
  FoodTypePopularOut,
  FoodTypeCreatePayload,
  FoodTypePhotoUpdatePayload,
  FoodTypeUpdatePayload,
  PlaceSearchResult,
  RestaurantCreatePayload,
  RestaurantPhotoUpdatePayload,
  RestaurantCatalogueResult,
  BranchListResult,
  BranchResolveOut,
  BrandListOut,
  ReviewCreate,
  ReviewOut,
  ReviewListResult,
  RestaurantReviewCreate,
  RestaurantReviewOut,
  RestaurantReviewListResult,
  FoodDetailResult,
  Token,
  UserCreate,
  UserOut,
  DishOut,
  DishSearchResult,
  DishCompareResult,
  BrandDetailOut,
  BrandDishOut,
  BrandDishDetailOut,
  RestaurantSummaryOut,
  FoodSubTypeListResult,
} from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'khawon_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

interface ApiErrorDetail {
  msg?: string
}

function formatError(detail: unknown): string | null {
  if (!detail) return null
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'msg' in item) {
          return (item as ApiErrorDetail).msg ?? String(item)
        }
        return String(item)
      })
      .join(', ')
  }
  return String(detail)
}

async function fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)

  if (
    !(options.body instanceof URLSearchParams) &&
    !(options.body instanceof FormData)
  ) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { detail?: unknown }
    throw new Error(formatError(body.detail) || `Request failed (${response.status})`)
  }

  return response
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchApi(path, options)

  if (response.status === 204) {
    throw new Error(`Expected JSON response from ${path}, got 204 No Content`)
  }

  return response.json() as Promise<T>
}

/** For endpoints that return 204 No Content with no body. */
export async function requestVoid(path: string, options: RequestInit = {}): Promise<void> {
  const response = await fetchApi(path, options)

  if (response.status !== 204) {
    await response.json().catch(() => undefined)
  }
}

export function searchDishes(
  query: string,
  options: { offset?: number; limit?: number } = {},
): Promise<DishSearchResult> {
  const params = new URLSearchParams({ q: query })
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  return request(`/dishes/search?${params.toString()}`)
}

export function compareDish(
  canonicalDishId: number | string,
  options: { offset?: number; limit?: number } = {},
): Promise<DishCompareResult> {
  const params = new URLSearchParams()
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  const query = params.toString()
  return request(
    `/dishes/compare/${canonicalDishId}${query ? `?${query}` : ''}`,
  )
}

export function getRestaurantDish(
  slug: string,
  foodTypeId: number | string,
  dishSlug: string,
): Promise<BrandDishDetailOut> {
  return request(
    `/restaurants/${encodeURIComponent(slug)}/dishes/${foodTypeId}/${encodeURIComponent(dishSlug)}`,
  )
}

export function getDish(id: number | string): Promise<DishOut> {
  return request(`/dishes/${id}`)
}

export function getDishReviews(
  id: number | string,
  options: { offset?: number; limit?: number } = {},
): Promise<ReviewListResult> {
  const params = new URLSearchParams()
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  const query = params.toString()
  return request(`/dishes/${id}/reviews${query ? `?${query}` : ''}`)
}

export function getRestaurant(slug: string): Promise<BrandDetailOut> {
  return request(`/restaurants/${encodeURIComponent(slug)}`)
}

export function resolveBranch(branchId: number | string): Promise<BranchResolveOut> {
  return request(`/branches/${branchId}`)
}

export function getRestaurantReviews(
  slug: string,
  options: { offset?: number; limit?: number } = {},
): Promise<RestaurantReviewListResult> {
  const params = new URLSearchParams()
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  const query = params.toString()
  return request(`/restaurants/${encodeURIComponent(slug)}/reviews${query ? `?${query}` : ''}`)
}

export function getRestaurantMenu(slug: string): Promise<BrandDishOut[]> {
  return request(`/restaurants/${encodeURIComponent(slug)}/menu`)
}

/** @deprecated Use getRestaurantMenu — kept for branch admin inspection. */
export function getBranchDishes(branchId: number | string): Promise<DishOut[]> {
  return request(`/branches/${branchId}/dishes`)
}

export function submitRestaurantReview(
  slug: string,
  data: RestaurantReviewCreate,
): Promise<RestaurantReviewOut> {
  return request(`/restaurants/${encodeURIComponent(slug)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function submitReview(data: ReviewCreate): Promise<ReviewOut> {
  return request('/reviews/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function listFoodTypes(): Promise<FoodTypeOut[]> {
  return request('/food-types/')
}

export function getTopFoodTypes(limit = 8): Promise<FoodTypePopularOut[]> {
  return request(`/food-types/top?limit=${limit}`)
}

export function getFoodType(id: number | string): Promise<FoodTypeOut> {
  return request(`/food-types/${id}`)
}

export function getFoodDetail(id: number | string): Promise<FoodDetailResult> {
  return request(`/food-types/${id}/detail`)
}

export function getFoodSubTypes(
  foodTypeId: number | string,
): Promise<FoodSubTypeListResult> {
  return request(`/food-types/${foodTypeId}/sub-types`)
}

export function getFoodCatalogue(query = ''): Promise<FoodTypePopularOut[]> {
  const params = query.trim()
    ? `?q=${encodeURIComponent(query.trim())}`
    : ''
  return request(`/food-types/catalogue${params}`)
}

export function listBranches(
  query = '',
  options: { offset?: number; limit?: number } = {},
): Promise<BranchListResult> {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  const qs = params.toString()
  return request(`/branches/${qs ? `?${qs}` : ''}`)
}

export function getRestaurants(
  query = '',
  options: { offset?: number; limit?: number } = {},
): Promise<RestaurantCatalogueResult> {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (options.offset != null) params.set('offset', String(options.offset))
  if (options.limit != null) params.set('limit', String(options.limit))
  const qs = params.toString()
  return request(`/restaurants/${qs ? `?${qs}` : ''}`)
}

export function searchPlaces(query: string, area = ''): Promise<PlaceSearchResult[]> {
  const params = new URLSearchParams({ q: query.trim() })
  if (area.trim()) {
    params.set('area', area.trim())
  }
  return request(`/places/search?${params.toString()}`)
}

export function getPlaceDetails(placeId: string): Promise<PlaceSearchResult> {
  return request(`/places/details?place_id=${encodeURIComponent(placeId)}`)
}

export function getPlacePhotoUrl(photoName: string, maxWidth = 400): string {
  const params = new URLSearchParams({
    photo_name: photoName,
    max_width: String(maxWidth),
  })
  return `${API_URL}/places/photo?${params.toString()}`
}

export function searchFoodImages(query: string, limit = 3): Promise<FoodImageSearchResponse> {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(limit),
  })
  return request(`/food-images/generate?${params.toString()}`)
}

export function getFoodGeneratedImageUrl(imageId: string): string {
  return `${API_URL}/food-images/generated/${encodeURIComponent(imageId)}`
}

export function createFoodType(payload: FoodTypeCreatePayload): Promise<FoodTypeOut> {
  const body = new FormData()
  body.append('name', payload.name)
  if (payload.description) {
    body.append('description', payload.description)
  }
  if (payload.ai_image_id) {
    body.append('ai_image_id', payload.ai_image_id)
  }
  if (payload.image) {
    body.append('image', payload.image)
  }
  return request('/food-types/', {
    method: 'POST',
    body,
  })
}

export function updateFoodType(
  id: number | string,
  payload: FoodTypeUpdatePayload,
): Promise<FoodTypeOut> {
  const body = new FormData()
  body.append('name', payload.name)
  if (payload.description) {
    body.append('description', payload.description)
  }
  if (payload.ai_image_id) {
    body.append('ai_image_id', payload.ai_image_id)
  }
  if (payload.image) {
    body.append('image', payload.image)
  }
  return request(`/food-types/${id}`, {
    method: 'PUT',
    body,
  })
}

export function updateFoodTypePhoto(
  id: number | string,
  payload: FoodTypePhotoUpdatePayload,
): Promise<FoodTypeOut> {
  const body = new FormData()
  if (payload.ai_image_id) body.append('ai_image_id', payload.ai_image_id)
  if (payload.image) body.append('image', payload.image)
  return request(`/food-types/${id}/photo`, {
    method: 'PUT',
    body,
  })
}

function buildRestaurantFormData(data: RestaurantCreatePayload): FormData {
  const body = new FormData()
  body.append('name', data.name)
  if (data.area) body.append('area', data.area)
  if (data.address) body.append('address', data.address)
  if (data.phone) body.append('phone', data.phone)
  if (data.google_place_id) body.append('google_place_id', data.google_place_id)
  if (data.google_photo_name) body.append('google_photo_name', data.google_photo_name)
  if (data.image) body.append('image', data.image)
  return body
}

export function createRestaurant(data: RestaurantCreatePayload): Promise<RestaurantSummaryOut> {
  return request('/branches/', {
    method: 'POST',
    body: buildRestaurantFormData(data),
  })
}

export function updateRestaurant(
  id: number | string,
  data: RestaurantCreatePayload,
): Promise<RestaurantSummaryOut> {
  return request(`/branches/${id}`, {
    method: 'PUT',
    body: buildRestaurantFormData(data),
  })
}

export function updateRestaurantPhoto(
  id: number | string,
  payload: RestaurantPhotoUpdatePayload,
): Promise<RestaurantSummaryOut> {
  const body = new FormData()
  if (payload.google_photo_name) body.append('google_photo_name', payload.google_photo_name)
  if (payload.image) body.append('image', payload.image)
  return request(`/branches/${id}/photo`, {
    method: 'PUT',
    body,
  })
}

export function registerUser(data: UserCreate): Promise<UserOut> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(identifier: string, password: string): Promise<Token> {
  const body = new URLSearchParams()
  body.set('username', identifier)
  body.set('password', password)
  return request('/auth/login', { method: 'POST', body })
}

export function getMe(): Promise<UserOut> {
  return request('/auth/me')
}

export { API_URL }
