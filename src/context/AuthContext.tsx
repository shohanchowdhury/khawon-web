import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearToken, getMe, getToken, loginUser, registerUser, setToken } from '@/api/client'
import type { AuthContextValue } from '@/types/domain/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  async function login(username: string, password: string) {
    const { access_token } = await loginUser(username, password)
    setToken(access_token)
    const me = await getMe()
    setUser(me)
    return me
  }

  async function register(email: string, username: string, password: string) {
    await registerUser({ email, username, password })
    return login(username, password)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
