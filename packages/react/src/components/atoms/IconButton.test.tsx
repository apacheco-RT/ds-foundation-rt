import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'

const icon = <svg data-testid="icon" />

describe('IconButton', () => {
  test('renders button with icon', () => {
    render(<IconButton icon={icon} aria-label="Delete" />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('renders label text when children provided', () => {
    render(<IconButton icon={icon}>Edit</IconButton>)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  test('calls onClick when clicked', async () => {
    const fn = vi.fn()
    render(<IconButton icon={icon} aria-label="Go" onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('is disabled when disabled prop set', () => {
    render(<IconButton icon={icon} aria-label="Go" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
