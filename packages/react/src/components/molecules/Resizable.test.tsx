import { render } from '@testing-library/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './Resizable'

// react-resizable-panels uses ResizeObserver internally; polyfill for jsdom
beforeAll(() => {
  if (typeof window.ResizeObserver === 'undefined') {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

describe('Resizable', () => {
  test('renders panels without crashing', () => {
    const { getByText } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div>Left</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(getByText('Left')).toBeInTheDocument()
    expect(getByText('Right')).toBeInTheDocument()
  })

  test('renders vertical layout', () => {
    const { getByText } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <div>Top</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Bottom</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(getByText('Top')).toBeInTheDocument()
    expect(getByText('Bottom')).toBeInTheDocument()
  })

  test('renders ResizableHandle with withHandle prop', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel><div>L</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel><div>R</div></ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
