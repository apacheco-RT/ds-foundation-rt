import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

describe('ToggleGroup', () => {
  test('renders items', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  test('selects item on click', async () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )
    // Items render with role="radio" inside a role="group"
    const item = screen.getByRole('radio', { name: 'A' })
    await userEvent.click(item)
    expect(item).toHaveAttribute('data-state', 'on')
  })

  test('deselects item on second click (single type)', async () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )
    const item = screen.getByRole('radio', { name: 'A' })
    await userEvent.click(item)
    expect(item).toHaveAttribute('data-state', 'on')
    await userEvent.click(item)
    expect(item).toHaveAttribute('data-state', 'off')
  })

  test('multiple type allows multiple selections', async () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )
    await userEvent.click(screen.getByText('A'))
    await userEvent.click(screen.getByText('B'))
    expect(screen.getByText('A').closest('[data-state]')).toHaveAttribute('data-state', 'on')
    expect(screen.getByText('B').closest('[data-state]')).toHaveAttribute('data-state', 'on')
  })

  test('calls onValueChange when item is toggled', async () => {
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="x">X</ToggleGroupItem>
      </ToggleGroup>
    )
    await userEvent.click(screen.getByRole('radio', { name: 'X' }))
    expect(onValueChange).toHaveBeenCalledWith('x')
  })
})
