import type { UserOut } from '../api/auth'

export interface AuthContextValue {
  user: UserOut | null
  loading: boolean
  login: (email: string, password: string) => Promise<UserOut>
  register: (email: string, username: string, password: string) => Promise<UserOut>
  logout: () => void
  isAuthenticated: boolean
}
