import { render, screen } from '@testing-library/react'
import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  test('renders label and value', () => {
    render(<KpiCard label="Revenue" value="$1,200" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,200')).toBeInTheDocument()
  })

  test('formats number value with toLocaleString', () => {
    render(<KpiCard label="Count" value={4821} />)
    expect(screen.getByText('4,821')).toBeInTheDocument()
  })

  test('renders trend label when provided', () => {
    render(<KpiCard label="Revenue" value="$1,200" trend={{ direction: 'up', label: '+12%' }} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  test('renders without trend', () => {
    render(<KpiCard label="Revenue" value="$1,200" />)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })
})
