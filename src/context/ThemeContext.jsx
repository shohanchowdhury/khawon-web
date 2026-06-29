import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

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

function getRevealRadius(x, y) {
  return (
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 16
  )
}

const initialTheme = getStoredTheme()
applyThemeToDocument(initialTheme)

export function ThemeProvider({ children }) {
  const reduceMotion = useReducedMotion()
  const [theme, setTheme] = useState(initialTheme)
  const [transition, setTransition] = useState(null)

  const commitTheme = useCallback((nextTheme) => {
    applyThemeToDocument(nextTheme)
    setTheme(nextTheme)
  }, [])

  const toggleTheme = useCallback(({ x, y }) => {
    const target = theme === 'dark' ? 'light' : 'dark'

    if (reduceMotion) {
      commitTheme(target)
      return
    }

    const radius = getRevealRadius(x, y)
    document.documentElement.style.setProperty('--theme-x', `${x}px`)
    document.documentElement.style.setProperty('--theme-y', `${y}px`)
    document.documentElement.style.setProperty('--theme-r', `${radius}px`)

    if (typeof document.startViewTransition !== 'function') {
      commitTheme(target)
      return
    }

    setTransition((current) => {
      if (current) return current
      return { target, x, y, radius }
    })

    const viewTransition = document.startViewTransition(() => {
      commitTheme(target)
    })

    viewTransition.finished.finally(() => {
      setTransition(null)
    })
  }, [theme, reduceMotion, commitTheme])

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
