import { render, screen } from '@testing-library/react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel'

describe('Carousel', () => {
  test('renders carousel container', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  test('renders slide content', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('Slide 2')).toBeInTheDocument()
  })

  test('renders navigation buttons when provided', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
  })

  test('has accessible aria-roledescription', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(container.querySelector('[aria-roledescription="carousel"]')).toBeInTheDocument()
  })
})
