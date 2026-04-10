import { render, screen } from '@testing-library/react'
import { CurrencyBadge } from './CurrencyBadge'

describe('CurrencyBadge', () => {
  test.each(['USD', 'EUR', 'GBP'] as const)('renders %s with aria-label', (currency) => {
    render(<CurrencyBadge currency={currency} />)
    expect(screen.getByText(currency)).toBeInTheDocument()
    expect(screen.getByLabelText(`Currency: ${currency}`)).toBeInTheDocument()
  })
})
