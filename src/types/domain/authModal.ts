export type AuthModalMode = 'login' | 'register'

export interface AuthModalContextValue {
  isOpen: boolean
  mode: AuthModalMode
  openAuthModal: (mode?: AuthModalMode) => void
  closeAuthModal: () => void
}
