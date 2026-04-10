import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormCard } from './FormCard'

describe('FormCard', () => {
  test('renders label', () => {
    render(<FormCard label="Credit Card" />)
    expect(screen.getByText('Credit Card')).toBeInTheDocument()
  })

  test('has role=button', () => {
    render(<FormCard label="Option" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('aria-pressed reflects selected state', () => {
    render(<FormCard label="Option" selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  test('calls onClick when clicked', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" disabled onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).not.toHaveBeenCalled()
  })

  test('activates on Enter key', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" onClick={fn} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('renders description when provided', () => {
    render(<FormCard label="Option" description="Some detail" />)
    expect(screen.getByText('Some detail')).toBeInTheDocument()
  })
})
