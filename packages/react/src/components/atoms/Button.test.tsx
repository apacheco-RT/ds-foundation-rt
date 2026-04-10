import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  test('renders with default variant and colorScheme', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  test('shows loading spinner and sets aria-busy when isLoading', () => {
    render(<Button isLoading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
  })

  test('shows loadingText when provided and isLoading', () => {
    render(<Button isLoading loadingText="Saving…">Save</Button>)
    expect(screen.getByText('Saving…')).toBeInTheDocument()
  })

  test('is disabled when disabled prop set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('renders leftIcon', () => {
    render(<Button leftIcon={<span data-testid="icon" />}>With icon</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('no inline style color props — uses Tailwind classes only', () => {
    const { container } = render(<Button>Test</Button>)
    const btn = container.querySelector('button')!
    expect(btn.style.backgroundColor).toBe('')
    expect(btn.style.color).toBe('')
  })
})
