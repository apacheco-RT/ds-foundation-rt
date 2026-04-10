import { render } from '@testing-library/react'
import { Toaster } from './Sonner'

describe('Toaster', () => {
  test('renders without error', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })

  test('renders toaster element', () => {
    const { container } = render(<Toaster />)
    // sonner renders a section/div at root
    expect(container.firstChild).not.toBeNull()
  })
})
