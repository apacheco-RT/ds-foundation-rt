import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  test('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
  test('renders as span', () => {
    const { container } = render(<Badge>Test</Badge>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })
  test('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge dot>Status</Badge>)
    expect(container.querySelectorAll('span').length).toBeGreaterThan(1)
  })
  test('does not render dot indicator by default', () => {
    const { container } = render(<Badge>No dot</Badge>)
    // Only the outer span — no inner dot span
    expect(container.querySelectorAll('span').length).toBe(1)
  })
  test('accepts variant and color props', () => {
    render(<Badge variant="solid" color="success">ok</Badge>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
  test('accepts size prop', () => {
    render(<Badge size="sm">small</Badge>)
    expect(screen.getByText('small')).toBeInTheDocument()
  })
  test('accepts outline variant', () => {
    render(<Badge variant="outline" color="danger">error</Badge>)
    expect(screen.getByText('error')).toBeInTheDocument()
  })
})
