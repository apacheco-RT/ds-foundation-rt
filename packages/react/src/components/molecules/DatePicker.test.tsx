import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  test('renders trigger button', () => {
    render(<DatePicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('shows placeholder text by default', () => {
    render(<DatePicker placeholder="Select date" />)
    expect(screen.getByText('Select date')).toBeInTheDocument()
  })

  test('uses default placeholder when none provided', () => {
    render(<DatePicker />)
    expect(screen.getByText('Pick a date')).toBeInTheDocument()
  })

  test('trigger is disabled when disabled prop is set', () => {
    render(<DatePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('opens calendar popover on click', async () => {
    render(<DatePicker />)
    await userEvent.click(screen.getByRole('button'))
    // Calendar should render (it has a grid or navigation buttons)
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })

  test('shows formatted value when defaultValue is supplied', () => {
    const date = new Date(2024, 0, 15) // Jan 15, 2024
    render(<DatePicker defaultValue={date} />)
    // format(date, 'PPP') = "January 15th, 2024"
    expect(screen.getByRole('button')).toHaveTextContent('January')
  })
})
