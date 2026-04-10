import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  test('has role=alert', () => {
    render(<Alert>message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('renders AlertTitle and AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Body</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
  test('accepts variant prop without error', () => {
    render(<Alert variant="destructive">danger</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('accepts success variant', () => {
    render(<Alert variant="success">success message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('accepts info variant', () => {
    render(<Alert variant="info">info message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('accepts warning variant', () => {
    render(<Alert variant="warning">warning message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
