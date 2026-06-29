/** Mirrors khawon-api/schemas.py — UserCreate, UserOut, Token */

export interface UserCreate {
  email: string
  username: string
  password: string
}

export interface UserOut {
  id: number
  email: string
  username: string
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
}
