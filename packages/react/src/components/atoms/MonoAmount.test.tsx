import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonoAmount, deriveFreshnessState } from './MonoAmount'

describe('MonoAmount', () => {
  test('formats USD amount', () => {
    render(<MonoAmount value={1250000} currency="USD" />)
    expect(screen.getByText('$1,250,000.00')).toBeInTheDocument()
  })

  test('formats EUR amount', () => {
    render(<MonoAmount value={500} currency="EUR" />)
    expect(screen.getByText('€500.00')).toBeInTheDocument()
  })

  test('not interactive without onProvenanceTap', () => {
    render(<MonoAmount value={100} currency="USD" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('becomes interactive with onProvenanceTap', async () => {
    const fn = vi.fn()
    render(<MonoAmount value={100} currency="USD" onProvenanceTap={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('activates on Enter key when interactive', async () => {
    const fn = vi.fn()
    render(<MonoAmount value={100} currency="USD" onProvenanceTap={fn} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('deriveFreshnessState', () => {
  test('fresh when less than 5 minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 2 * 60 * 1000))).toBe('fresh')
  })
  test('watch when 5-15 minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 8 * 60 * 1000))).toBe('watch')
  })
  test('stale when 15+ minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 20 * 60 * 1000))).toBe('stale')
  })
})
