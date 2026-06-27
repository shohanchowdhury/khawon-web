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
  if (!(options.body instanceof URLSearchParams)) {
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

export function createFoodType(data) {
  return request('/food-types/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function createRestaurant(data) {
  return request('/restaurants/', {
    method: 'POST',
    body: JSON.stringify(data),
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
