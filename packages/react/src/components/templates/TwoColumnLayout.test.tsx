import { render, screen } from '@testing-library/react'
import { TwoColumnLayout } from './TwoColumnLayout'

describe('TwoColumnLayout', () => {
  test('renders left slot content', () => {
    render(<TwoColumnLayout left={<div>Left content</div>} right={<div>Right</div>} />)
    expect(screen.getByText('Left content')).toBeInTheDocument()
  })

  test('renders right slot content', () => {
    render(<TwoColumnLayout left={<div>Left</div>} right={<div>Right content</div>} />)
    expect(screen.getByText('Right content')).toBeInTheDocument()
  })

  test('applies default equal columns', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>L</div>} right={<div>R</div>} />
    )
    expect((container.firstChild as HTMLElement)?.style.gridTemplateColumns).toBe('1fr 1fr')
  })

  test('applies custom column proportions', () => {
    const { container } = render(
      <TwoColumnLayout left={<div>L</div>} right={<div>R</div>} columns="2fr 1fr" />
    )
    expect((container.firstChild as HTMLElement)?.style.gridTemplateColumns).toBe('2fr 1fr')
  })

  test('forwards ref to root div', () => {
    const ref = { current: null }
    render(<TwoColumnLayout ref={ref} left={<div>L</div>} right={<div>R</div>} />)
    expect(ref.current).not.toBeNull()
  })
})
