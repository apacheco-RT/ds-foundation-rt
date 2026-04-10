import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  test('renders label for submitted', () => {
    render(<StatusPill status="submitted" />)
    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })

  test('has role=status', () => {
    render(<StatusPill status="in_payments" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('aria-label describes current state', () => {
    render(<StatusPill status="failed" />)
    expect(screen.getByLabelText('Status: Failed')).toBeInTheDocument()
  })

  test('renders bank_confirmed label', () => {
    render(<StatusPill status="bank_confirmed" />)
    expect(screen.getByText('Confirmed ✓')).toBeInTheDocument()
  })
})
