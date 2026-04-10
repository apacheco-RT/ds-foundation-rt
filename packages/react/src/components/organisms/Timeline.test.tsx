import { render, screen } from '@testing-library/react'
import { Timeline, type TimelineItem } from './Timeline'

const items: TimelineItem[] = [
  { id: '1', title: 'Order placed', timestamp: '10:00 AM', status: 'complete' },
  { id: '2', title: 'Processing', description: 'Being prepared', status: 'active' },
  { id: '3', title: 'Shipped', status: 'default' },
]

describe('Timeline', () => {
  test('renders all item titles', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Order placed')).toBeInTheDocument()
    expect(screen.getByText('Processing')).toBeInTheDocument()
    expect(screen.getByText('Shipped')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Being prepared')).toBeInTheDocument()
  })

  test('renders timestamp when provided', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('10:00 AM')).toBeInTheDocument()
  })

  test('renders as ordered list', () => {
    render(<Timeline items={items} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  test('renders empty timeline with no items', () => {
    render(<Timeline items={[]} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  test('renders icon when provided', () => {
    const withIcon: TimelineItem[] = [
      { id: '1', title: 'Event', icon: <span data-testid="icon">★</span> },
    ]
    render(<Timeline items={withIcon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<Timeline items={[]} className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })
})
