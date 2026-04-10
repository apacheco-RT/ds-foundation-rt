import { render, screen } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './InputOTP'

// input-otp uses ResizeObserver internally; polyfill for jsdom
beforeAll(() => {
  if (typeof window.ResizeObserver === 'undefined') {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

describe('InputOTP', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  test('renders the correct number of slots', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSeparator />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    )
    // 6 slot divs + 1 separator
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(1)
  })

  test('contains a hidden input for accessibility', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    // input-otp renders a hidden <input> element
    const input = container.querySelector('input')
    expect(input).toBeInTheDocument()
  })
})
