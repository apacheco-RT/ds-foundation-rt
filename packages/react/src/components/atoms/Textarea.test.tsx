import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  test('renders textarea', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
  test('is disabled when disabled prop set', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
  test('accepts user input', async () => {
    render(<Textarea />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })
})
