import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  test('renders progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
  test('renders with 0 value', () => {
    render(<Progress value={0} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
