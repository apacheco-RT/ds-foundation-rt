import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

describe('RadioGroup', () => {
  test('renders radio inputs', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    )
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })
  test('reflects defaultValue', () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>
    )
    expect(screen.getByRole('radio')).toBeChecked()
  })
  test('unchecked item is not checked', () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    )
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toBeChecked()
    expect(radios[1]).not.toBeChecked()
  })
  test('calls onValueChange when a radio is clicked', async () => {
    const fn = vi.fn()
    render(
      <RadioGroup onValueChange={fn}>
        <RadioGroupItem value="x" />
      </RadioGroup>
    )
    await userEvent.click(screen.getByRole('radio'))
    expect(fn).toHaveBeenCalledWith('x')
  })
})
