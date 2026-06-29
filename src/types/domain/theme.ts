export type Theme = 'light' | 'dark'

export interface ThemeTransitionState {
  target: Theme
  x: number
  y: number
  radius: number
}

export interface ThemeContextValue {
  theme: Theme
  transition: ThemeTransitionState | null
  toggleTheme: (origin: { x: number; y: number }) => void
}
