import { render } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

describe('AspectRatio', () => {
  test('renders without crashing', () => {
    const { container } = render(<AspectRatio ratio={16/9}><img alt="test" /></AspectRatio>)
    expect(container.firstChild).toBeInTheDocument()
  })
  test('renders children', () => {
    const { getByAltText } = render(<AspectRatio ratio={4/3}><img alt="photo" /></AspectRatio>)
    expect(getByAltText('photo')).toBeInTheDocument()
  })
})
