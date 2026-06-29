import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthModalContextValue, AuthModalMode } from '@/types/domain/authModal'

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthModalMode>('login')

  const openAuthModal = useCallback((nextMode: AuthModalMode = 'login') => {
    setMode(nextMode)
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo<AuthModalContextValue>(
    () => ({
      isOpen,
      mode,
      openAuthModal,
      closeAuthModal,
    }),
    [isOpen, mode, openAuthModal, closeAuthModal],
  )

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext)
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return ctx
}
