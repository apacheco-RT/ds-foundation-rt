import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputNumber } from './InputNumber'

describe('InputNumber', () => {
  test('renders a spinbutton input', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  test('renders decrease and increase buttons', () => {
    render(<InputNumber />)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
  })

  test('is disabled when disabled prop set', () => {
    render(<InputNumber disabled />)
    const input = screen.getByRole('spinbutton')
    expect(input).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })

  test('shows defaultValue', () => {
    render(<InputNumber defaultValue={42} />)
    expect(screen.getByRole('spinbutton')).toHaveValue('42')
  })

  test('increase button increments value', async () => {
    render(<InputNumber defaultValue={5} step={1} />)
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByRole('spinbutton')).toHaveValue('6')
  })

  test('decrease button decrements value', async () => {
    render(<InputNumber defaultValue={5} step={1} />)
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(screen.getByRole('spinbutton')).toHaveValue('4')
  })

  test('respects min by disabling decrease at boundary', () => {
    render(<InputNumber defaultValue={0} min={0} />)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
  })

  test('respects max by disabling increase at boundary', () => {
    render(<InputNumber defaultValue={10} max={10} />)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })

  test('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={1} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
