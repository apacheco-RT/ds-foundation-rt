import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Segmented } from './Segmented'

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

describe('Segmented', () => {
  test('renders all options', () => {
    render(<Segmented options={options} value="day" onChange={vi.fn()} />)
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })

  test('renders with role radiogroup', () => {
    render(<Segmented options={options} value="day" onChange={vi.fn()} />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  test('active option has aria-checked=true', () => {
    render(<Segmented options={options} value="week" onChange={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'false')
  })

  test('calls onChange when an option is clicked', async () => {
    const onChange = vi.fn()
    render(<Segmented options={options} value="day" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }))
    expect(onChange).toHaveBeenCalledWith('month')
  })

  test('uncontrolled — defaultValue selects initial option', () => {
    render(<Segmented options={options} defaultValue="week" />)
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true')
  })

  test('disabled option cannot be clicked', async () => {
    const onChange = vi.fn()
    const opts = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b', disabled: true },
    ]
    render(<Segmented options={opts} value="a" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'B' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
