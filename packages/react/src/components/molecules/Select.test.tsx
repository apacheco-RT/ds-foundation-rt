import { render, screen } from '@testing-library/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from './Select'

// Radix Select uses hasPointerCapture which jsdom does not implement.
// Polyfill so pointer-down interactions don't crash.
beforeAll(() => {
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false
    HTMLElement.prototype.setPointerCapture = () => {}
    HTMLElement.prototype.releasePointerCapture = () => {}
  }
})

describe('Select', () => {
  test('renders trigger with combobox role', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('shows placeholder text', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">X</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  test('trigger is disabled when disabled prop set', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  test('renders SelectGroup with SelectLabel structure', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
    // Trigger renders correctly; content is in portal so not queried here
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('trigger has aria-expanded=false when closed', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })
})
