import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  getRevealRadius,
  prefersReducedSystemMotion,
  runSnapshotThemeReveal,
  runViewTransitionReveal,
  setThemeRevealOrigin,
} from '../utils/themeReveal'

const STORAGE_KEY = 'khawon-theme'

const ThemeContext = createContext(null)

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

function applyThemeToDocument(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

const initialTheme = getStoredTheme()
applyThemeToDocument(initialTheme)

function beginThemeTransition() {
  document.documentElement.classList.add('theme-transition-active')
}

function endThemeTransition() {
  document.documentElement.classList.remove('theme-transition-active')
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [transition, setTransition] = useState(null)

  const commitTheme = useCallback((nextTheme) => {
    applyThemeToDocument(nextTheme)
    setTheme(nextTheme)
  }, [])

  const toggleTheme = useCallback(({ x, y }) => {
    const target = theme === 'dark' ? 'light' : 'dark'
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

    runSnapshotThemeReveal(target, applyTargetTheme, x, y, radius).finally(finishTransition)
  }, [theme, commitTheme])

  const value = useMemo(
    () => ({
      theme,
      transition,
      toggleTheme,
    }),
    [theme, transition, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
