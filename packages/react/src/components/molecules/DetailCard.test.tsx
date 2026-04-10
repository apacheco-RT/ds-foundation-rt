import { render, screen } from '@testing-library/react'
import { DetailCard } from './DetailCard'

describe('DetailCard', () => {
  test('renders title as h4', () => {
    render(<DetailCard title="Payment Details"><p>content</p></DetailCard>)
    expect(screen.getByRole('heading', { level: 4, name: 'Payment Details' })).toBeInTheDocument()
  })

  test('renders children', () => {
    render(<DetailCard title="Test"><span>child</span></DetailCard>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })
})
