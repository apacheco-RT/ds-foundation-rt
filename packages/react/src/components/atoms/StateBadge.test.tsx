import { render, screen } from '@testing-library/react'
import { StateBadge } from './StateBadge'

describe('StateBadge', () => {
  test('renders state label', () => {
    render(<StateBadge state="Processing" intent="info" />)
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  test('has role=status', () => {
    render(<StateBadge state="Failed" intent="error" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('renders nextState when provided', () => {
    render(<StateBadge state="Processing" intent="info" nextState="Approval" />)
    expect(screen.getByText('Approval')).toBeInTheDocument()
  })

  test('aria-label includes nextState', () => {
    render(<StateBadge state="Processing" intent="info" nextState="Approval" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Processing, next: Approval')
  })
})
