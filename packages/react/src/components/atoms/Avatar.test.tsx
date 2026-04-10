import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

describe('Avatar', () => {
  test('renders fallback text', () => {
    render(<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
  test('renders without crashing with image', () => {
    const { container } = render(
      <Avatar><AvatarImage src="test.jpg" alt="Test" /><AvatarFallback>JD</AvatarFallback></Avatar>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
