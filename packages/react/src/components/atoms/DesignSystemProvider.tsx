// @forwardref-exempt: context provider — no DOM element to ref
import * as React from "react"

export type Theme = 'light' | 'dark' | 'wireframe'

const VALID_THEMES: Theme[] = ['light', 'dark', 'wireframe']

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export interface DesignSystemProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

// SSR / hydration note:
// The provider reads localStorage on the client, which can differ from the server-rendered
// defaultTheme. To suppress the resulting React hydration mismatch warning, add
// suppressHydrationWarning to the <html> element in your app's root layout:
//   <html suppressHydrationWarning>
// This is the standard pattern for theme providers that use localStorage.

function DesignSystemProvider({
  children,
  defaultTheme = 'light',
}: DesignSystemProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem('ds-theme') as Theme | null
    return stored && VALID_THEMES.includes(stored) ? stored : defaultTheme
  })

  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem('ds-theme', theme)
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

DesignSystemProvider.displayName = 'DesignSystemProvider'

function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a DesignSystemProvider')
  }
  return ctx
}

export { DesignSystemProvider, useTheme }
