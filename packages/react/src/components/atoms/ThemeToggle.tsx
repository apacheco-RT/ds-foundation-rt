import * as React from "react"
import { Sun, Moon, PenLine } from "lucide-react"
import { Button } from "./Button"
import { useTheme } from "./DesignSystemProvider"
import type { Theme } from "./DesignSystemProvider"

const NEXT_THEME: Record<Theme, Theme> = {
  light:     'dark',
  dark:      'wireframe',
  wireframe: 'light',
}

const NEXT_LABEL: Record<Theme, string> = {
  light:     'Switch to dark theme',
  dark:      'Switch to wireframe theme',
  wireframe: 'Switch to light theme',
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { theme, setTheme } = useTheme()
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={() => setTheme(NEXT_THEME[theme])}
        aria-label={NEXT_LABEL[theme]}
        {...props}
      >
        {theme === 'light'     && <Sun className="w-4 h-4" />}
        {theme === 'dark'      && <Moon className="w-4 h-4" />}
        {theme === 'wireframe' && <PenLine className="w-4 h-4" />}
      </Button>
    )
  }
)

ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle }
