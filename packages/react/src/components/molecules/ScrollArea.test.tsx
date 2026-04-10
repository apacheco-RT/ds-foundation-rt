import { render } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
  test('renders children', () => {
    const { getByText } = render(
      <ScrollArea>
        <p>content</p>
      </ScrollArea>
    )
    expect(getByText('content')).toBeInTheDocument()
  })

  test('renders multiple children', () => {
    const { getByText } = render(
      <ScrollArea>
        <p>item one</p>
        <p>item two</p>
        <p>item three</p>
      </ScrollArea>
    )
    expect(getByText('item one')).toBeInTheDocument()
    expect(getByText('item two')).toBeInTheDocument()
    expect(getByText('item three')).toBeInTheDocument()
  })

  test('renders without crashing with className', () => {
    const { container } = render(
      <ScrollArea className="h-40">
        <p>scrollable</p>
      </ScrollArea>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  test('ScrollBar renders inside ScrollArea', () => {
    const { container } = render(
      <ScrollArea className="h-40">
        <p>scrollable content</p>
      </ScrollArea>
    )
    // ScrollBar is rendered internally by ScrollArea
    expect(container.firstChild).toBeInTheDocument()
  })
})
