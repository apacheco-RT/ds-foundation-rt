import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'

describe('Tag', () => {
  test('renders label', () => {
    render(<Tag>Finance</Tag>)
    expect(screen.getByText('Finance')).toBeInTheDocument()
  })

  test('renders remove button when onRemove provided', () => {
    render(<Tag onRemove={vi.fn()}>Finance</Tag>)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  test('calls onRemove when remove button clicked', async () => {
    const fn = vi.fn()
    render(<Tag onRemove={fn}>Finance</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('no remove button when onRemove not provided', () => {
    render(<Tag>Finance</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders icon slot', () => {
    render(<Tag icon={<svg data-testid="icon" />}>USD</Tag>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
