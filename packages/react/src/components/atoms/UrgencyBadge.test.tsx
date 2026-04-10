import { render, screen } from '@testing-library/react'
import { UrgencyBadge } from './UrgencyBadge'

describe('UrgencyBadge', () => {
  test.each([
    ['critical', 'Critical'],
    ['watch', 'Watch'],
    ['clear', 'Clear'],
    ['skip', 'Skip-node'],
  ] as const)('%s renders default label %s', (urgency, label) => {
    render(<UrgencyBadge urgency={urgency} />)
    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.getByLabelText(`Urgency: ${label}`)).toBeInTheDocument()
  })

  test('uses custom label when provided', () => {
    render(<UrgencyBadge urgency="critical" label="Urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByLabelText('Urgency: Urgent')).toBeInTheDocument()
  })
})
