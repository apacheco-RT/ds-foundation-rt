import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  test('renders checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
  test('is unchecked by default', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
  test('calls onCheckedChange when clicked', async () => {
    const fn = vi.fn()
    render(<Checkbox onCheckedChange={fn} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(fn).toHaveBeenCalledWith(true)
  })
  test('is checked when defaultChecked is true', () => {
    render(<Checkbox defaultChecked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
  test('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
