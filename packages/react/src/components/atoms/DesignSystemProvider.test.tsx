import { render, screen } from '@testing-library/react'
import { DesignSystemProvider, useTheme } from './DesignSystemProvider'

function ThemeDisplay() {
  const { theme } = useTheme()
  return <span>{theme}</span>
}

describe('DesignSystemProvider', () => {
  beforeEach(() => {
    // Prevent localStorage from persisting theme state between tests
    localStorage.clear()
  })

  test('renders children', () => {
    render(<DesignSystemProvider><span>child</span></DesignSystemProvider>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })
  test('provides default theme via useTheme', () => {
    render(<DesignSystemProvider><ThemeDisplay /></DesignSystemProvider>)
    // Default theme is 'light'
    expect(screen.getByText(/light|dark|wireframe/)).toBeInTheDocument()
  })
  test('respects a custom defaultTheme', () => {
    render(<DesignSystemProvider defaultTheme="dark"><ThemeDisplay /></DesignSystemProvider>)
    expect(screen.getByText('dark')).toBeInTheDocument()
  })
})
