import { render, screen } from '@testing-library/react'
import { DesignSystemProvider } from './DesignSystemProvider'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  test('renders a button', () => {
    render(<DesignSystemProvider><ThemeToggle /></DesignSystemProvider>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  test('button has an accessible aria-label', () => {
    render(<DesignSystemProvider><ThemeToggle /></DesignSystemProvider>)
    // Default theme is 'light', so the label says "Switch to dark theme"
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })
})
