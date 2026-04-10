import { render } from '@testing-library/react'
import { StatusRing } from './StatusRing'

describe('StatusRing', () => {
  test('renders with aria-hidden', () => {
    const { container } = render(<StatusRing urgency="critical" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  test('applies pulse class when pulse=true', () => {
    const { container } = render(<StatusRing urgency="watch" pulse />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  test('does not apply pulse class by default', () => {
    const { container } = render(<StatusRing urgency="critical" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })
})
