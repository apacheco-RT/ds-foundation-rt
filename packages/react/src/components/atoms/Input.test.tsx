import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  test('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
  test('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
  test('shows error text when errorText provided', () => {
    render(<Input errorText="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
  test('shows helper text', () => {
    render(<Input helperText="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })
  test('errorText takes precedence over helperText', () => {
    render(<Input helperText="Helper" errorText="Error" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })
  test('is disabled when disabled prop set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
  test('calls onChange on user input', async () => {
    const fn = vi.fn()
    render(<Input onChange={fn} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(fn).toHaveBeenCalled()
  })
  test('accepts size prop without error', () => {
    render(<Input size="sm" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
  test('renders label with required asterisk when required', () => {
    render(<Input label="Name" required />)
    // The label element is present — use getByText since the label contains an
    // aria-hidden asterisk span that breaks getByLabelText exact matching
    expect(screen.getByText('Name', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeRequired()
  })
  test('sets aria-invalid when errorText is provided', () => {
    render(<Input errorText="Bad input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
