import { render, screen } from '@testing-library/react'
import { Separator } from './Separator'

// Radix Separator suppresses the ARIA role when decorative={true} (the default).
// Pass decorative={false} so the role appears in the DOM.
describe('Separator', () => {
  test('renders separator', () => {
    render(<Separator decorative={false} />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
  test('horizontal by default', () => {
    render(<Separator decorative={false} />)
    // Radix sets data-orientation; aria-orientation is implicit for horizontal
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal')
  })
  test('can be vertical', () => {
    render(<Separator decorative={false} orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })
})
