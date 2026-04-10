import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  test('renders title', () => {
    render(<EmptyState title="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try adjusting your filters." />)
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument()
  })

  test('omits description when not provided', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  test('renders action button when action provided', () => {
    render(<EmptyState title="Empty" action={{ label: 'Add item', onClick: vi.fn() }} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  test('calls action.onClick when button clicked', async () => {
    const onClick = vi.fn()
    render(<EmptyState title="Empty" action={{ label: 'Add item', onClick }} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add item' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('omits action button when action not provided', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<EmptyState title="Empty" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
