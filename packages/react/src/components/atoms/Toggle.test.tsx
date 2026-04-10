import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  test('renders as button', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  test('has aria-pressed false by default', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
  test('has aria-pressed true when pressed=true', () => {
    render(<Toggle pressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
  test('calls onPressedChange when clicked', async () => {
    const fn = vi.fn()
    render(<Toggle onPressedChange={fn}>Bold</Toggle>)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalled()
  })
  test('renders children', () => {
    render(<Toggle>Italic</Toggle>)
    expect(screen.getByText('Italic')).toBeInTheDocument()
  })
  test('accepts variant prop without error', () => {
    render(<Toggle variant="outline">Outline</Toggle>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
