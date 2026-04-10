import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FreshnessChip } from './FreshnessChip'

const watchDate = new Date(Date.now() - 8 * 60 * 1000)
const staleDate = new Date(Date.now() - 20 * 60 * 1000)

describe('FreshnessChip', () => {
  test('hides chip when state=fresh', () => {
    const { container } = render(<FreshnessChip state="fresh" timestamp={new Date()} />)
    expect(container.querySelector('.hidden')).toBeInTheDocument()
  })

  test('shows amber chip when state=watch', () => {
    render(<FreshnessChip state="watch" timestamp={watchDate} />)
    expect(screen.getByRole('status')).not.toHaveClass('hidden')
  })

  test('shows refresh button when stale and onRefresh provided', () => {
    render(<FreshnessChip state="stale" timestamp={staleDate} onRefresh={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Refresh data' })).toBeInTheDocument()
  })

  test('calls onRefresh when refresh clicked', async () => {
    const fn = vi.fn()
    render(<FreshnessChip state="stale" timestamp={staleDate} onRefresh={fn} />)
    await userEvent.click(screen.getByRole('button', { name: 'Refresh data' }))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('no refresh button without onRefresh', () => {
    render(<FreshnessChip state="stale" timestamp={staleDate} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
