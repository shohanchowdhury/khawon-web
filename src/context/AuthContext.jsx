import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearToken, getMe, getToken, loginUser, registerUser, setToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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
    refreshUser()
  }, [refreshUser])

  async function login(username, password) {
    const { access_token } = await loginUser(username, password)
    setToken(access_token)
    const me = await getMe()
    setUser(me)
    return me
  }

  async function register(email, username, password) {
    await registerUser({ email, username, password })
    return login(username, password)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
