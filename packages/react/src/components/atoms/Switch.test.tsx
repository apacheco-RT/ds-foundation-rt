import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

describe('Switch', () => {
  test('renders switch', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })
  test('is off by default', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })
  test('calls onCheckedChange when toggled', async () => {
    const fn = vi.fn()
    render(<Switch onCheckedChange={fn} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(fn).toHaveBeenCalledWith(true)
  })
  test('reflects defaultChecked state', () => {
    render(<Switch defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })
  test('is disabled when disabled prop is set', () => {
    render(<Switch disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
