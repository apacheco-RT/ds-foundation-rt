import type { Meta, StoryObj } from '@storybook/react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel';

const meta: Meta = {
  title: 'Components/Carousel',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

const slides = ['Slide 1', 'Slide 2', 'Slide 3'];

export const Default: StoryObj = {
  render: () => (
    <Carousel style={{ width: 320 }}>
      <CarouselContent>
        {slides.map((label, idx) => (
          <CarouselItem key={idx}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 160,
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--muted))',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const ThreeSlides: StoryObj = {
  render: () => (
    <Carousel opts={{ align: 'start' }} style={{ width: 400 }}>
      <CarouselContent style={{ marginLeft: -8 }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <CarouselItem key={idx} style={{ paddingLeft: 8, flexBasis: '50%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--muted))',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Item {idx + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
