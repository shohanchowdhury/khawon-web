import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Theme, ThemeContextValue, ThemeTransitionState } from '@/types/domain/theme'
import {
  getRevealRadius,
  prefersReducedSystemMotion,
  runSnapshotThemeReveal,
  runViewTransitionReveal,
  setThemeRevealOrigin,
} from '@/utils/themeReveal'

const STORAGE_KEY = 'khawon-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

function applyThemeToDocument(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

const initialTheme = getStoredTheme()
applyThemeToDocument(initialTheme)

function beginThemeTransition(): void {
  document.documentElement.classList.add('theme-transition-active')
}

function endThemeTransition(): void {
  document.documentElement.classList.remove('theme-transition-active')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [transition, setTransition] = useState<ThemeTransitionState | null>(null)

  const commitTheme = useCallback((nextTheme: Theme) => {
    applyThemeToDocument(nextTheme)
    setTheme(nextTheme)
  }, [])

  const toggleTheme = useCallback(({ x, y }: { x: number; y: number }) => {
    const target: Theme = theme === 'dark' ? 'light' : 'dark'
    const radius = getRevealRadius(x, y)

    setTransition((current) => {
      if (current) return current
      return { target, x, y, radius }
    })

    setThemeRevealOrigin(x, y, radius)
    beginThemeTransition()

    const finishTransition = () => {
      endThemeTransition()
      setTransition(null)
    }

    const applyTargetTheme = () => commitTheme(target)

    const useViewTransition =
      typeof document.startViewTransition === 'function' && !prefersReducedSystemMotion()

    if (useViewTransition) {
      runViewTransitionReveal(applyTargetTheme).finished.finally(finishTransition)
      return
    }

    void runSnapshotThemeReveal(target, applyTargetTheme, x, y, radius).finally(finishTransition)
  }, [theme, commitTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      transition,
      toggleTheme,
    }),
    [theme, transition, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
