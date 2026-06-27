const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'khawon_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function formatError(detail) {
  if (!detail) return null
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(', ')
  return String(detail)
}

async function request(path, options = {}) {
  const headers = { ...options.headers }
  if (
    !(options.body instanceof URLSearchParams) &&
    !(options.body instanceof FormData)
  ) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(formatError(body.detail) || `Request failed (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}

export function searchFood(query) {
  return request(`/search/?q=${encodeURIComponent(query)}`)
}

export function getRestaurant(id) {
  return request(`/restaurants/${id}`)
}

export function getRestaurantReviews(id) {
  return request(`/restaurants/${id}/reviews`)
}

export function submitReview(data) {
  return request('/reviews/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function listFoodTypes() {
  return request('/food-types/')
}

export function getTopFoodTypes(limit = 8) {
  return request(`/food-types/top?limit=${limit}`)
}

export function getFoodType(id) {
  return request(`/food-types/${id}`)
}

export function getFoodCatalogue(query = '') {
  const params = query.trim()
    ? `?q=${encodeURIComponent(query.trim())}`
    : ''
  return request(`/food-types/catalogue${params}`)
}

export function getRestaurantCatalogue(query = '') {
  const params = query.trim()
    ? `?q=${encodeURIComponent(query.trim())}`
    : ''
  return request(`/restaurants/catalogue${params}`)
}

export function searchPlaces(query, area = '') {
  const params = new URLSearchParams({ q: query.trim() })
  if (area.trim()) {
    params.set('area', area.trim())
  }
  return request(`/places/search?${params.toString()}`)
}

export function getPlaceDetails(placeId) {
  return request(`/places/details?place_id=${encodeURIComponent(placeId)}`)
}

export function getPlacePhotoUrl(photoName, maxWidth = 400) {
  const params = new URLSearchParams({
    photo_name: photoName,
    max_width: String(maxWidth),
  })
  return `${API_URL}/places/photo?${params.toString()}`
}

export function searchFoodImages(query, limit = 3) {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(limit),
  })
  return request(`/food-images/generate?${params.toString()}`)
}

export function getFoodGeneratedImageUrl(imageId) {
  return `${API_URL}/food-images/generated/${encodeURIComponent(imageId)}`
}

export function createFoodType({ name, description, image, ai_image_id }) {
  const body = new FormData()
  body.append('name', name)
  if (description) {
    body.append('description', description)
  }
  if (ai_image_id) {
    body.append('ai_image_id', ai_image_id)
  }
  if (image) {
    body.append('image', image)
  }
  return request('/food-types/', {
    method: 'POST',
    body,
  })
}

export function updateFoodType(id, { name, description, image, ai_image_id }) {
  const body = new FormData()
  body.append('name', name)
  if (description) {
    body.append('description', description)
  }
  if (ai_image_id) {
    body.append('ai_image_id', ai_image_id)
  }
  if (image) {
    body.append('image', image)
  }
  return request(`/food-types/${id}`, {
    method: 'PUT',
    body,
  })
}

export function updateFoodTypePhoto(id, { ai_image_id, image }) {
  const body = new FormData()
  if (ai_image_id) body.append('ai_image_id', ai_image_id)
  if (image) body.append('image', image)
  return request(`/food-types/${id}/photo`, {
    method: 'PUT',
    body,
  })
}

function buildRestaurantFormData(data) {
  const body = new FormData()
  body.append('name', data.name)
  if (data.area) body.append('area', data.area)
  if (data.address) body.append('address', data.address)
  if (data.phone) body.append('phone', data.phone)
  if (data.google_maps_url) body.append('google_maps_url', data.google_maps_url)
  if (data.website_url) body.append('website_url', data.website_url)
  if (data.google_place_id) body.append('google_place_id', data.google_place_id)
  if (data.google_photo_name) body.append('google_photo_name', data.google_photo_name)
  body.append('food_type_ids', JSON.stringify(data.food_type_ids || []))
  if (data.image) body.append('image', data.image)
  return body
}

export function createRestaurant(data) {
  return request('/restaurants/', {
    method: 'POST',
    body: buildRestaurantFormData(data),
  })
}

export function updateRestaurant(id, data) {
  return request(`/restaurants/${id}`, {
    method: 'PUT',
    body: buildRestaurantFormData(data),
  })
}

export function updateRestaurantPhoto(id, { google_photo_name, image }) {
  const body = new FormData()
  if (google_photo_name) body.append('google_photo_name', google_photo_name)
  if (image) body.append('image', image)
  return request(`/restaurants/${id}/photo`, {
    method: 'PUT',
    body,
  })
}

export function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function loginUser(username, password) {
  const body = new URLSearchParams()
  body.set('username', username)
  body.set('password', password)
  return request('/auth/login', { method: 'POST', body })
}

export function getMe() {
  return request('/auth/me')
}
