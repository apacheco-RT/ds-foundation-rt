import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  test('renders label text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
  test('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
