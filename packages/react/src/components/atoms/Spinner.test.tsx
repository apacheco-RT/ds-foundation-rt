import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  test('renders without crashing', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })
  test('renders status role for accessibility', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
  test('renders with size prop', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
