import { render, screen } from '@testing-library/react'
import { Slider } from './Slider'

// Radix Slider uses ResizeObserver internally — jsdom doesn't provide it
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Slider', () => {
  test('renders slider', () => {
    render(<Slider defaultValue={[50]} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
  test('renders with min and max', () => {
    render(<Slider defaultValue={[25]} min={0} max={100} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })
})
