import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&auto=format&fit=crop"
          alt="Photo by Alvaro Pinot"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
        />
      </AspectRatio>
    </div>
  ),
};
