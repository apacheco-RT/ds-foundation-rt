import { render } from '@testing-library/react'
import { BankingWindowDot } from './BankingWindowDot'

describe('BankingWindowDot', () => {
  test('renders with aria-hidden', () => {
    const { container } = render(<BankingWindowDot status="open" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  test('applies pulse for closing status', () => {
    const { container } = render(<BankingWindowDot status="closing" />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  test('does not pulse when open', () => {
    const { container } = render(<BankingWindowDot status="open" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  test('applies custom size via style', () => {
    const { container } = render(<BankingWindowDot status="open" size={10} />)
    expect((container.firstChild as HTMLElement).style.width).toBe('10px')
  })
})
