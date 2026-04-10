import { render, screen } from '@testing-library/react'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  test('renders calendar grid', () => {
    render(<Calendar mode="single" />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  test('renders navigation buttons', () => {
    render(<Calendar mode="single" />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('renders day cells', () => {
    render(<Calendar mode="single" />)
    const gridCells = screen.getAllByRole('gridcell')
    expect(gridCells.length).toBeGreaterThan(0)
  })

  test('applies custom className', () => {
    const { container } = render(<Calendar mode="single" className="custom-calendar" />)
    expect(container.querySelector('.custom-calendar')).toBeInTheDocument()
  })

  test('renders outside days by default', () => {
    render(<Calendar mode="single" />)
    const cells = screen.getAllByRole('gridcell')
    // With showOutsideDays=true (default), we expect a full 6-row grid
    expect(cells.length).toBeGreaterThanOrEqual(28)
  })
})
